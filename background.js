// MetaPrompt – Background Service Worker

// ── Keep-Alive ────────────────────────────────────────────────────────────────
function createKeepAlive() {
  try { chrome.alarms.create('keepAlive', { periodInMinutes: 0.4 }); } catch (e) {}
}
createKeepAlive();
chrome.alarms.onAlarm.addListener((a) => { if (a.name === 'keepAlive') {} });
chrome.runtime.onInstalled.addListener((details) => {
  createKeepAlive();
  if (details.reason === 'install' || details.reason === 'update') {
    injectScriptsInExistingTabs();
  }
});
chrome.runtime.onStartup.addListener(createKeepAlive);
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'keepAlive') port.onDisconnect.addListener(() => {});
});

function injectScriptsInExistingTabs() {
  chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, (tabs) => {
    for (const tab of tabs) {
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) continue;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['utils/detectPlatform.js', 'content/optimizer.js', 'content/observer.js', 'content/content.js']
      }).catch(err => console.warn('[MetaPrompt] Could not inject into tab:', tab.id, err));
    }
  });
}

// ── Auto-fallback chain (used when user picks "auto") ─────────────────────────
const AUTO_FALLBACK = [
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

// ── Message Handler ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[MetaPrompt BG] Action:', request?.action);

  if (request.action === 'OPTIMIZE_PROMPT') {
    handleOptimization(request)
      .then(data => sendResponse({ success: true, data }))
      .catch(err  => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (request.action === 'FETCH_MODELS') {
    fetchModelsFromAPI(request.apiKey)
      .then(data => sendResponse({ success: true, data }))
      .catch(err  => sendResponse({ success: false, error: err.message }));
    return true;
  }
  return false;
});

// ── Fetch real model list from Gemini API ─────────────────────────────────────
async function fetchModelsFromAPI(apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`;
  const res = await fetch(url);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.error?.message || `HTTP ${res.status}`;
    if (res.status === 400 || res.status === 401) throw new Error('Invalid API key — please check your key at aistudio.google.com');
    if (res.status === 403) throw new Error('API key does not have permission to list models');
    if (res.status === 429) throw new Error('Quota exceeded — please wait 1 minute and try again');
    throw new Error('Failed to load models: ' + msg);
  }

  const data = await res.json();
  const models = (data.models || [])
    .filter(m =>
      m.supportedGenerationMethods?.includes('generateContent') &&
      m.name.includes('gemini') &&
      !m.name.includes('embedding') &&
      !m.name.includes('aqa')
    )
    .map(m => ({
      id:          m.name.replace('models/', ''),
      displayName: m.displayName || m.name.replace('models/', ''),
      description: (m.description || '').substring(0, 100),
    }))
    .sort((a, b) => b.id.localeCompare(a.id)); // newest first

  if (models.length === 0) throw new Error('No usable Gemini models found for this API key');
  return models;
}

// ── Technique System Instructions ─────────────────────────────────────────────
function buildSystemInstruction(technique, userPrompt, history, mode = 'prompt') {
  const ctx = history ? `### CONTEXT (Previous conversation history)\n${history}\n\n` : '';

  if (mode === 'refine') {
    const strictRules = `CRITICAL INSTRUCTION: You are an expert Ghostwriter and Message Crafter.

## YOUR CORE JOB
Read the user's raw input below and figure out their TRUE INTENT:

**CASE A — The user wrote INSTRUCTIONS / INTENT** (e.g., "tell her she's beautiful", "compliment his work", "ask for a meeting tomorrow", "write something flirty about her eyes"):
→ You must WRITE THE ACTUAL MESSAGE that the user wants to send. You are writing ON BEHALF of the user, directly addressed to the recipient. Do NOT give advice like "You should tell her..." — actually write the message AS IF the user is saying it.

**CASE B — The user wrote a ROUGH DRAFT** (e.g., "hey ur rly pretty i luv ur eyes", "i wanted to disucss the project tmrw"):
→ Rewrite and polish the draft into a refined version while keeping the same meaning and ALL the same content.

**CASE C — Mixed** (rough text with instructions like "make it shorter" or "make this sound nicer"):
→ Follow the instruction while polishing the text.

## ABSOLUTE RULES
- OUTPUT ONLY the final message text. Nothing else.
- NEVER start with "Here is...", "Sure!", "You should tell her...", or any preamble.
- NEVER give advice or meta-commentary. Write the actual words the user will send.
- NEVER repeat yourself. Output the message exactly ONCE. Do NOT duplicate any sentences.
- Write in FIRST PERSON (I, me, my) because you are ghostwriting for the user.
- NEVER censor, sanitize, or tone down the user's language. If they wrote something explicit, romantic, or intimate, KEEP that energy and meaning — just improve how it's said.
- Keep it natural and human — not robotic.
- If conversation history is provided, use it for context to make the message flow naturally.`;

    if (technique === 'grammar') return `${strictRules}

## TONE: Grammar & Spelling Fix
- If CASE A: Write a deep, well-structured message based on the intent, then ensure perfect grammar.
- If CASE B: Fix all grammatical errors and spelling while keeping the original tone and meaning exactly as-is.
- If CASE C: Follow instructions while fixing grammar.
- Keep the voice and personality intact.
${ctx}=== USER'S RAW INPUT ===
${userPrompt}`;

    if (technique === 'professional') return `${strictRules}

## TONE: Professional & Formal
- If CASE A: Write the message in a polished, professional tone suitable for work emails, LinkedIn, or formal business communication.
- If CASE B: Rewrite the draft to sound highly professional, articulate, and respectful.
- Use proper business language, be concise and clear.
- Appropriate for: work emails, LinkedIn messages, client communication, cover letters, business proposals.
${ctx}=== USER'S RAW INPUT ===
${userPrompt}`;

    if (technique === 'casual') return `${strictRules}

## TONE: Casual, Warm & Personal
- If CASE A: Write the message in a warm, personal, emotionally expressive tone. Be genuine and heartfelt.
- If CASE B: Rewrite the draft to sound natural, friendly, and emotionally connected.
- PRESERVE the user's meaning completely — do NOT remove or soften explicit content, intimacy, or strong feelings. Just make it sound better.
- Match the emotional depth and intensity of the user's intent:
  • Compliment → write a genuine, heartfelt compliment directly to that person.
  • Flirting / intimacy → be bold, playful, and expressive. Keep the same level of explicitness the user intended.
  • Expressing feelings → be emotionally open, vulnerable, and sincere.
  • Casual chat → keep it light, fun, and natural.
- Use natural contractions (I'm, you're, don't).
- Sound like a real person texting, NOT like an AI writing a template.
${ctx}=== USER'S RAW INPUT ===
${userPrompt}`;

    // Default refine (no specific technique selected)
    return `${strictRules}

## TONE: General Polish
- If CASE A: Write the message with clear, natural language and good flow.
- If CASE B: Improve clarity, flow, grammar, and overall quality of the text.
- Match the apparent intent, emotional register, and explicitness level of the original.
${ctx}=== USER'S RAW INPUT ===
${userPrompt}`;
  }

  // mode === 'prompt'
  const strictRules = `CRITICAL INSTRUCTION: You are a Meta-Prompt Generator. 
You must NEVER answer the user's prompt directly. NEVER write the story, NEVER write the code, and NEVER fulfill the user's request. 
Your ONLY job is to write a BETTER PROMPT that the user will copy-paste into a different AI.
- OUTPUT ONLY the final rewritten prompt.
- NO preamble like "Here is your prompt".
- DO NOT solve the user's problem.`;

  if (technique === 'cot') return `${strictRules}
Technique: Rewrite the following prompt so the target AI must think step-by-step before answering. Include numbered reasoning stages.
${ctx}=== USER'S RAW PROMPT ===
${userPrompt}`;

  if (technique === 'few_shot') return `${strictRules}
Technique: Few-Shot prompting. Rewrite the prompt by adding 2-3 realistic domain-specific examples (Input→Output) before stating the actual task.
${ctx}=== USER'S RAW PROMPT ===
${userPrompt}`;

  if (technique === 'zero_shot') return `${strictRules}
Technique: Zero-Shot structured prompting. Rewrite as a clean structured prompt with: **Role:**, **Task:**, **Constraints:**, **Output Format:**.
${ctx}=== USER'S RAW PROMPT ===
${userPrompt}`;

  if (technique === 'react') return `${strictRules}
Technique: ReAct pattern. Rewrite so the target AI uses a Thought→Action→Observation loop.
${ctx}=== USER'S RAW PROMPT ===
${userPrompt}`;

  if (technique === 'persona') return buildPersonaInstruction(userPrompt, ctx, strictRules);

  // Default: auto
  return `${strictRules}
Technique: Analyze the user's raw prompt and silently choose the best technique (Expert Persona, Chain of Thought, Few-Shot, etc), then rewrite it.
${ctx}=== USER'S RAW PROMPT ===
${userPrompt}`;
}

function buildPersonaInstruction(userPrompt, ctx, strictRules) {
  return `${strictRules}
Technique: Expert Persona. Derive the PERFECT specific expert for this domain (e.g., "Senior Python Game Developer"). Rewrite the prompt with: Persona + Requirements + Output Format.
${ctx}=== USER'S RAW PROMPT ===
${userPrompt}`;
}

// ── Core Optimization ─────────────────────────────────────────────────────────
async function handleOptimization({ prompt, apiKey, history = '', modelId = 'auto', technique = 'auto', mode = 'prompt' }) {
  const instruction = buildSystemInstruction(technique, prompt, history, mode);

  // If user picked a specific model → try only that one
  // If "auto" → try fallback chain
  const modelsToTry = (modelId && modelId !== 'auto') ? [modelId] : AUTO_FALLBACK;

  let lastError = null;

  for (const mid of modelsToTry) {
    try {
      console.log(`[MetaPrompt] Trying: ${mid} | technique: ${technique}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${mid}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: instruction }] }],
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg  = errData.error?.message || res.statusText;

        if (res.status === 401) throw new Error('Invalid API key — go to the popup and re-enter your Gemini API key.');
        if (res.status === 403) throw new Error('API key lacks permission for model "' + mid + '". Try Auto mode or a different model.');
        
        // 404 = Model doesn't exist. 429 = Quota exceeded.
        // In both cases, we want to try the NEXT model in the fallback chain.
        // Some models have 0 quota in certain countries or for certain accounts.
        if (res.status === 404 || res.status === 429) {
          console.warn(`[MetaPrompt] ${mid} failed (${res.status}) — trying next. Error:`, errMsg);
          lastError = new Error(res.status === 429 ? 'Quota exceeded on all attempted models.' : `Model "${mid}" not available`);
          continue;
        }
        
        // Any other error (400 Bad Request, 500 Internal, etc) is a real failure
        throw new Error(`API Error: ${errMsg || res.statusText}`);
      }

      const data = await res.json();
      if (!data.candidates?.[0]?.content) throw new Error('Gemini returned an empty response');
      console.log(`[MetaPrompt] ✅ Success with ${mid}`);
      return data.candidates[0].content.parts[0].text.trim();

    } catch (error) {
      lastError = error;
      // If it's an explicit API Error, Invalid Key, etc., stop immediately.
      // We ONLY want to continue the loop if the error was a 404 or 429 (caught above and continue is used)
      // If it reaches this catch block, it means fetch failed (network) or throw was explicitly called.
      // We should NOT continue on invalid keys or malformed requests.
      if (!error.message.startsWith('Model "') && !error.message.includes('Quota exceeded')) {
        throw error;
      }
    }
  }

  throw lastError || new Error('All models failed to respond.');
}
