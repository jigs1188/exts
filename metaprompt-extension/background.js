chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPTIMIZE_PROMPT') {
    handleOptimization(request.prompt, request.apiKey, request.history)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
});

// Create an alarm to keep the service worker active/wake it up
// Keep-Alive Connection Handler (The "Heartbeat")
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'keepAlive') {
    // console.log('[MetaPrompt] Keep-alive port connected');
    port.onDisconnect.addListener(() => {
      // console.log('[MetaPrompt] Keep-alive port disconnected');
    });
  }
});

async function handleOptimization(userPrompt, apiKey, history = '') {
  // List of models to try in order of preference (Speed/Cost -> Stability)
  const models = [
    'gemini-3-flash-preview', // User requested specific model
    'gemini-2.0-flash-exp', 
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest', 
    'gemini-1.5-pro',
    'gemini-pro' 
  ];

  const systemInstruction = `You are an elite Prompt Engineering AI.
### YOUR GOAL
Rewrite the user's raw prompt into a "God-Tier" optimized prompt for an LLM.

### CRITICAL RULES (Follow these strictly)
1.  **NO PREAMBLE**: Did not say "Here is the prompt" or "To optimize this...". Start DIRECTLY with the prompt content.
2.  **NO POSTSCRIPT**: Do not add explanations at the end.
3.  **DIRECT ACTION**: The output must be the *exact text* the user will paste into ChatGPT.

### STRATEGY: "DYNAMIC EXPERT ADAPTATION"
**Your Primary Task is to analyze the User's Request + History and *derive* the perfect expert persona.**

1.  **ANALYZE THE DOMAIN**:
    *   If user asks about *Python Data Analysis*, become a **"Senior Data Scientist"**.
    *   If user asks about *Python Web Scraping*, become a **"Web Scraping Specialist"**.
    *   If user asks about *Python Games*, become a **"Game Engine Architect"**.
    *   *NEVER* default to a generic "Coder". You must match the specific niche of the query.

2.  **MAINTAIN CONTEXT**:
    *   If the chat history shows we are building a *Finance App*, keep the "FinTech Developer" persona, even for generic questions like "fix this bug".

3.  **ADAPT FORMALITY**:
    *   Coding -> Strict, Technical, Concise.
    *   Ideation/Strategy -> Creative, Consultative, Detailed.

### FEW-SHOT EXAMPLES

**Input:** "make a snake game in python"
**Reasoning:** User wants a game -> Persona: Game Dev.
**Output:**
Act as a **Senior Python Game Developer** with deep expertise in Pygame. 
Create a highly optimized, object-oriented implementation of Snake.
**Requirements:**
- use OOP principles (Classes for Snake, Food, Game).
- Include score tracking.

**Input:** "plot this csv data in python"
**Reasoning:** User wants data viz -> Persona: Data Scientist.
**Output:**
Act as a **Lead Data Scientist** specializing in Python Visualization (Matplotlib/Seaborn).
Write a script to load the CSV and generate insightful visualizations.
**Requirements:**
- Handle missing values robustly.
- Use Pandas for data manipulation.

**Input:** "how should I sell my chrome extension privately"
**Output:**
Act as a Product Strategy Consultant.
I have a Chrome Extension that I want to license to specific users (single PC/device) without publishing it publicly on the Web Store.
**Goal:** Provide a secure distribution and licensing strategy.
**Key Topics to Cover:**
1. Method to lock the extension to a specific Device ID or PC.
2. How to handle "off-store" distribution (ZIP vs. Private Hosting).
3. Approaches for managing access keys or permissions.
4. Pros/cons of this "Private Link" model vs. public listing.

**Input:** "generate dummy user data in json"
**Output:**
Act as a Synthetic Data Generator. Generate a JSON dataset of 5 dummy users.
**Schema Constraints:**
- Root object must be an array \`users\`.
- properties: \`id\` (UUID), \`name\` (Full Name), \`email\` (Valid format).
- **Format:** Pure JSON. No Markdown ticks.

**Input:** "explain quantum physics"
**Output:**
Act as a Quantum Physicist and Master Communicator (like Richard Feynman).
Explain the fundamental principles of Quantum Mechanics to a curious high school student.
**Key Topics:**
1. Wave-Particle Duality (Use the Double-Slit analogy).
2. Superposition (Schrödinger's Cat).
3. Entanglement (Spooky action at a distance).
**Constraint:** Avoid complex calculus. Focus on conceptual clarity.

### CRITICAL RULES
- **OUTPUT ONLY** the final optimized prompt. Do NOT explain your reasoning.
- **NO PREAMBLE**. Start directly with the persona or instruction.
- **PRESERVE** any specific data or code the user provided.

${history ? `### CONTEXT (Past Chat History)\n${history}\n\n` : ''}### USER RAW PROMPT
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
