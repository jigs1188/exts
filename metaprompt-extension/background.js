chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPTIMIZE_PROMPT') {
    handleOptimization(request.prompt, request.apiKey)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
});

// Create an alarm to keep the service worker active/wake it up
chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    // console.log('Keep-alive alarm fired');
  }
});

// Force reconnection on install/startup
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });
});

async function handleOptimization(userPrompt, apiKey) {
  // List of models to try in order of preference (Speed/Cost -> Stability)
  const models = [
    'gemini-3-flash-preview', // User requested specific model
    'gemini-2.0-flash-exp', 
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest', 
    'gemini-1.5-pro',
    'gemini-pro' 
  ];

  const systemInstruction = `You are a world-class Prompt Engineer and AI Optimization Specialist.
Your goal is to rewrite the user's raw prompt into a masterfully crafted, highly effective prompt for an LLM (like ChatGPT or Gemini).

Follow these steps:
1. ANALYZE intent: Identify if it's coding, writing, debugging, learning, or analysis.
2. ENHANCE: Add a specific expert persona, clear constraints, and structural requirements (e.g., "Think step-by-step").
3. REFINE: Ensure clarity, remove ambiguity, and fix grammar.
4. FORMAT: Use markdown structure (headers, bullet points) if complex.

CRITICAL RULES:
- Output ONLY the optimized prompt. Do not add introductions like "Here is the optimized prompt:".
- Preserve the user's core intent. Do not solve the problem yourself, just write the prompt asking for the solution.
- If the prompt is for code, specify strict clean code guidelines.
- If the prompt is for writing, specify tone and audience.

User Raw Prompt:
"${userPrompt}"`;

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`[MetaPrompt] Attempting optimization with model: ${model}`);
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemInstruction
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || response.statusText;
        
        // If Model Not Found (404) or Invalid Argument (400 often for model mismatch), try next
        if (response.status === 404 || response.status === 400) {
           console.warn(`[MetaPrompt] Model ${model} failed (${response.status}): ${errorMessage}. Trying next...`);
           lastError = new Error(`Model ${model} not found`);
           continue; 
        }
        
        // For other errors (Quota 429, Key 403), fail immediately
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
         throw new Error('Empty response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text.trim();

    } catch (error) {
      lastError = error;
      // If it's a "real" error (not just model not found), stop trying
      if (error.message.includes('Quota') || error.message.includes('API key') || error.message.includes('permission')) {
          throw error;
      }
    }
  }

  // If we ran out of models
  throw lastError || new Error('All Gemini models failed to respond.');
}
