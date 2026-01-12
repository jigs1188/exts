document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadApiKey();
  setupEventListeners();
  setupApiKeyListeners();
});

function loadApiKey() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      if (result.geminiApiKey) {
        document.getElementById('apiKey').value = result.geminiApiKey;
        showStatus('Key loaded', 'success');
      }
    });
  }
}

function setupApiKeyListeners() {
  const saveBtn = document.getElementById('saveKey');
  const input = document.getElementById('apiKey');

  if (saveBtn && input) {
    saveBtn.addEventListener('click', () => {
      const key = input.value.trim();
      if (!key) {
        showStatus('Please enter a key', 'error');
        return;
      }

      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ geminiApiKey: key }, () => {
          showStatus('API Key saved!', 'success');
          // Clear visual input for security after a moment, or keep it masked
          setTimeout(() => showStatus('', ''), 3000);
        });
      }
    });
  }
}

function showStatus(msg, type) {
  const status = document.getElementById('status');
  if (status) {
    status.textContent = msg;
    status.style.color = type === 'error' ? '#e53e3e' : '#38a169';
  }
}

function loadStats() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['enhanceCount', 'lastUsed'], (result) => {
      if (result.enhanceCount) {
        displayStats(result);
      }
    });
  }
}

function displayStats(stats) {
  const statsSection = document.querySelector('.stats');
  if (!statsSection || !stats.enhanceCount) return;

  const statsInfo = document.createElement('div');
  statsInfo.style.cssText = `
    margin-top: 12px;
    padding: 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  `;

  statsInfo.innerHTML = `
    <p style="font-size: 13px; color: #4a5568; margin-bottom: 4px;">
      📈 <strong>Total Enhancements:</strong> ${stats.enhanceCount}
    </p>
    ${stats.lastUsed ? `
      <p style="font-size: 12px; color: #718096;">
        🕐 Last used: ${new Date(stats.lastUsed).toLocaleString()}
      </p>
    ` : ''}
  `;

  statsSection.appendChild(statsInfo);
}

function setupEventListeners() {
  const platformElements = document.querySelectorAll('.platform');

  platformElements.forEach(platform => {
    platform.style.cursor = 'pointer';

    platform.addEventListener('click', () => {
      const platformName = platform.textContent.trim().toLowerCase();
      let url = '';

      switch(platformName) {
        case 'chatgpt':
          url = 'https://chat.openai.com';
          break;
        case 'gemini':
          url = 'https://gemini.google.com';
          break;
        case 'claude':
          url = 'https://claude.ai';
          break;
      }

      if (url && typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url });
      }
    });

    platform.addEventListener('mouseenter', () => {
      platform.style.transform = 'scale(1.05)';
      platform.style.transition = 'transform 0.2s ease';
    });

    platform.addEventListener('mouseleave', () => {
      platform.style.transform = 'scale(1)';
    });
  });
}

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'statsUpdate') {
      loadStats();
    }
  });
}
