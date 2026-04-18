// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULTS = { technique: 'auto', model: 'auto' };
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

const TIER_LABELS = { flash: 'Flash', pro: 'Pro', latest: 'Latest' };

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadApiKey();
  loadTechnique();
  loadModel();
  loadStats();
  loadCustomSites();
  detectActiveTabMode();
  setupApiKeyListeners();
  setupTechniqueListeners();
  setupModelListeners();
  setupCustomSiteListeners();
  setupPlatformLinks();
});

// ── Custom Sites ──────────────────────────────────────────────────────────────

let customSitesList = [];

function loadCustomSites() {
  chrome.storage.local.get(['customSites'], (result) => {
    customSitesList = result.customSites || [];
    renderCustomSites();
  });
}

function renderCustomSites() {
  const listEl = document.getElementById('sitesList');
  if (!listEl) return;
  listEl.innerHTML = '';
  customSitesList.forEach(site => {
    const el = document.createElement('div');
    el.className = 'site-item';
    el.innerHTML = `<span>${site}</span><button data-site="${site}" class="btn-ghost btn-icon">❌</button>`;
    listEl.appendChild(el);
  });

  listEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const site = e.currentTarget.dataset.site;
      customSitesList = customSitesList.filter(s => s !== site);
      chrome.storage.local.set({ customSites: customSitesList }, renderCustomSites);
    });
  });
}

function setupCustomSiteListeners() {
  const addBtn = document.getElementById('addSite');
  const input = document.getElementById('customSite');
  addBtn?.addEventListener('click', () => {
    let site = input.value.trim().toLowerCase();
    if (!site) return;
    site = site.replace(/^https?:\/\//, '').split('/')[0]; // simple domain extraction
    if (!customSitesList.includes(site)) {
      customSitesList.push(site);
      chrome.storage.local.set({ customSites: customSitesList }, () => {
        input.value = '';
        renderCustomSites();
        
        // Dynamically inject script into the active tab if it matches the new site
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].url && tabs[0].url.includes(site)) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['utils/detectPlatform.js', 'content/optimizer.js', 'content/observer.js', 'content/content.js']
            }).catch(e => console.warn('[MetaPrompt] Could not inject after adding site:', e));
          }
        });
      });
    }
  });
}

// ── Mode Detection ────────────────────────────────────────────────────────────

let currentMode = 'prompt';

function detectActiveTabMode() {
  // Mode detection is no longer needed since we show all techniques.
  // The user can freely choose between Prompt and Refine techniques.
}

// ── API Key ───────────────────────────────────────────────────────────────────

function loadApiKey() {
  if (!chrome?.storage) return;
  chrome.storage.sync.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      document.getElementById('apiKey').value = result.geminiApiKey;
      showStatus('✅ API Key loaded', 'success');
    }
  });
}

function setupApiKeyListeners() {
  const saveBtn  = document.getElementById('saveKey');
  const clearBtn = document.getElementById('clearKey');
  const input    = document.getElementById('apiKey');

  saveBtn?.addEventListener('click', () => {
    const key = input.value.trim();
    if (!key) { showStatus('⚠️ Please paste an API key first', 'error'); return; }
    chrome.storage.sync.set({ geminiApiKey: key }, () => {
      showStatus('✅ API Key saved!', 'success');
      setTimeout(() => showStatus('', ''), 4000);
    });
  });

  clearBtn?.addEventListener('click', () => {
    chrome.storage.sync.remove('geminiApiKey', () => {
      document.getElementById('apiKey').value = '';
      showStatus('🗑️ Key cleared', 'info');
      setTimeout(() => showStatus('', ''), 3000);
    });
  });
}

function showStatus(msg, type) {
  const el = document.getElementById('status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = { success: '#276749', error: '#c53030', info: '#718096' }[type] || '#718096';
}

// ── Technique Picker ──────────────────────────────────────────────────────────

function loadTechnique() {
  chrome.storage.sync.get(['selectedTechnique'], (result) => {
    setActiveChip('techniqueGrid', result.selectedTechnique || DEFAULTS.technique);
  });
}

function setupTechniqueListeners() {
  document.querySelectorAll('.technique-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const technique = btn.dataset.technique;
      const mode = btn.dataset.mode || 'prompt';
      
      // Update UI for both grids
      document.querySelectorAll('.technique-chip').forEach(el => {
        el.classList.toggle('active', el.dataset.technique === technique);
      });
      
      chrome.storage.sync.set({ selectedTechnique: technique, selectedMode: mode });
    });
  });
}

function setActiveChip(unusedId, value) {
  document.querySelectorAll('[data-technique]').forEach(el => {
    el.classList.toggle('active', el.dataset.technique === value);
  });
}

// ── Model Picker & Live Fetching ─────────────────────────────────────────────

async function loadModel() {
  const stored = await new Promise(r => chrome.storage.sync.get(['selectedModel', 'geminiApiKey'], r));
  const cached = await new Promise(r => chrome.storage.local.get(['cachedModels', 'modelsTimestamp'], r));

  const select = document.getElementById('modelSelect');
  if (!select) return;

  // Restore previous selection if any
  if (stored.selectedModel) {
    // If the model isn't in the list yet, add it temporarily so the UI shows it correctly
    if (!Array.from(select.options).some(o => o.value === stored.selectedModel)) {
      const opt = document.createElement('option');
      opt.value = stored.selectedModel;
      opt.textContent = stored.selectedModel;
      select.appendChild(opt);
    }
    select.value = stored.selectedModel;
  }

  // Load from cache or fetch live
  if (cached.cachedModels && cached.modelsTimestamp && (Date.now() - cached.modelsTimestamp < CACHE_DURATION_MS)) {
    populateModelSelect(cached.cachedModels, stored.selectedModel);
  } else if (stored.geminiApiKey) {
    fetchAndPopulateModels(stored.geminiApiKey, stored.selectedModel);
  } else {
    showModelStatus('⚠️ Enter an API key to load available models.', 'info');
  }
}

function setupModelListeners() {
  const select = document.getElementById('modelSelect');
  select?.addEventListener('change', (e) => {
    chrome.storage.sync.set({ selectedModel: e.target.value });
  });

  const refreshBtn = document.getElementById('refreshModels');
  refreshBtn?.addEventListener('click', async () => {
    const stored = await new Promise(r => chrome.storage.sync.get(['geminiApiKey', 'selectedModel'], r));
    if (!stored.geminiApiKey) {
      showModelStatus('⚠️ Enter an API key first.', 'error');
      return;
    }
    fetchAndPopulateModels(stored.geminiApiKey, stored.selectedModel, true);
  });
}

async function fetchAndPopulateModels(apiKey, selectedModel, forceRefresh = false) {
  const refreshBtn = document.getElementById('refreshModels');
  if (refreshBtn) {
    refreshBtn.classList.add('spinning');
    refreshBtn.disabled = true;
  }
  
  showModelStatus('Fetching models from Gemini...', 'info');

  try {
    const response = await sendMessage({ action: 'FETCH_MODELS', apiKey });
    if (response?.success && response.data) {
      chrome.storage.local.set({ cachedModels: response.data, modelsTimestamp: Date.now() });
      populateModelSelect(response.data, selectedModel);
      showModelStatus(`✅ Loaded ${response.data.length} models`, 'success');
      setTimeout(() => showModelStatus('', ''), 3000);
    } else {
      showModelStatus(`❌ ${response?.error || 'Unknown error'}`, 'error');
    }
  } catch (e) {
    showModelStatus(`❌ Failed to connect: ${e.message}`, 'error');
  } finally {
    if (refreshBtn) {
      refreshBtn.classList.remove('spinning');
      refreshBtn.disabled = false;
    }
  }
}

function populateModelSelect(models, selectedModel) {
  const select = document.getElementById('modelSelect');
  if (!select) return;

  // Keep 'auto' option
  select.innerHTML = '<option value="auto">Auto (Best available)</option>';

  models.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.displayName || m.id;
    opt.title = m.description || '';
    select.appendChild(opt);
  });

  if (selectedModel && models.some(m => m.id === selectedModel)) {
    select.value = selectedModel;
  } else if (selectedModel && selectedModel !== 'auto') {
    // Model not in list anymore (deprecated)
    select.value = 'auto';
    chrome.storage.sync.set({ selectedModel: 'auto' });
  }
}

function showModelStatus(msg, type) {
  const el = document.getElementById('modelStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = `model-status-msg ${type}`;
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function loadStats() {
  if (!chrome?.storage) return;
  chrome.storage.local.get(['enhanceCount', 'lastUsed'], (result) => {
    if (result.enhanceCount) renderStats(result);
  });
}

function renderStats(stats) {
  const el = document.getElementById('statsDisplay');
  if (!el || !stats.enhanceCount) return;
  el.innerHTML = `
    <p>📈 <strong>Total Enhancements:</strong> ${stats.enhanceCount}</p>
    ${stats.lastUsed ? `<p>🕐 Last used: ${new Date(stats.lastUsed).toLocaleString()}</p>` : ''}
  `;
}

// ── Platform Links ────────────────────────────────────────────────────────────

function setupPlatformLinks() {
  const map = {
    'platform-chatgpt': 'https://chatgpt.com',
    'platform-gemini':  'https://gemini.google.com',
    'platform-claude':  'https://claude.ai',
  };
  for (const [id, url] of Object.entries(map)) {
    document.getElementById(id)?.addEventListener('click', () => chrome.tabs?.create({ url }));
  }
}

// ── Helper: send message to background ───────────────────────────────────────

function sendMessage(msg) {
  return new Promise((resolve, reject) => {
    if (!chrome.runtime?.id) return reject(new Error('Extension context invalidated'));
    const timer = setTimeout(() => reject(new Error('Request timed out')), 90000);
    chrome.runtime.sendMessage(msg, (response) => {
      clearTimeout(timer);
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve(response);
    });
  });
}

// ── Listen for stat updates ───────────────────────────────────────────────────

chrome.runtime?.onMessage.addListener((message) => {
  if (message.type === 'statsUpdate') loadStats();
});
