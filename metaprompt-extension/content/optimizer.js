const PromptOptimizer = {

  // ── Local Fallback Templates (used when no API key) ───────────────────────

  templates: {
    general: {
      pattern: /.*/,
      transform: (p) => `You are an expert assistant with deep knowledge across multiple domains.\n\nTask: ${p}\n\nInstructions:\n- Provide a comprehensive, well-structured response\n- Break down complex concepts with examples\n- Be precise and actionable\n\nFormat your response with clear sections and bullet points where helpful.`
    },
    strategy: {
      pattern: /(sell|money|income|price|cost|business|plan|strategy|market|distribute|license|protect)/i,
      transform: (p) => `You are an expert Strategic Consultant and Product Manager.\n\nStrategy Task: ${p}\n\nObjective:\n- Analyze the business/security goal\n- Provide a robust, step-by-step plan\n- Address risks and mitigation strategies\n\nOutput format:\n1. Executive Summary\n2. Strategic Steps\n3. Risk Analysis\n4. Recommended Implementation path`
    },
    coding: {
      pattern: /(write|create|build|code|implement|function|class|debug|fix|error|bug|script|program|algorithm)/i,
      transform: (p) => {
        const lang = PromptOptimizer.detectLanguage(p);
        return `You are an expert software engineer specializing in ${lang || 'general software architecture'}.\n\nTask: ${p}\n\nRequirements:\n- Write clean, efficient, maintainable code\n- Follow best practices and design patterns\n- Include error handling and concise comments\n\nOutput format:\n1. Brief approach explanation\n2. Complete implementation\n3. Usage example`;
      }
    },
    debugging: {
      pattern: /(debug|fix|error|issue|problem|not working|broken|crash|fails)/i,
      transform: (p) => `You are an expert debugging specialist.\n\nProblem: ${p}\n\nDebugging approach:\n1. Problem Analysis\n2. Root Cause\n3. Solution (with code if applicable)\n4. Prevention tips`
    },
    explanation: {
      pattern: /(explain|what is|how does|why|describe|tell me about|understand|clarify)/i,
      transform: (p) => `You are an expert educator skilled at making complex topics accessible.\n\nTopic: ${p}\n\nTeaching approach:\n- Start with a clear, simple definition\n- Build understanding progressively with analogies\n- Address common misconceptions\n\nOutput format:\n1. Clear Definition\n2. Core Concepts (step by step)\n3. Examples\n4. Practical Applications`
    },
    writing: {
      pattern: /(write|compose|draft|essay|article|blog|email|letter|content|copy)/i,
      transform: (p) => `You are an expert writer with exceptional communication skills.\n\nWriting task: ${p}\n\nGuidelines:\n- Match appropriate tone and style\n- Structure content logically\n- Use clear and engaging language\n- Consider the target audience`
    },
    analysis: {
      pattern: /(analyze|compare|evaluate|assess|review|critique)/i,
      transform: (p) => `You are an expert analyst with critical thinking skills.\n\nAnalysis task: ${p}\n\nFramework:\n1. Overview\n2. Detailed Analysis\n3. Key Findings\n4. Recommendations/Conclusions`
    }
  },

  detectLanguage(prompt) {
    const languages = {
      '\\b(javascript|js|node|react|vue|angular)\\b': 'JavaScript',
      '\\b(python|py|django|flask)\\b': 'Python',
      '\\b(java(?!script))\\b': 'Java',
      '\\b(c\\+\\+|cpp)\\b': 'C++',
      '\\b(c#|csharp)\\b': 'C#',
      '\\b(ruby|rails)\\b': 'Ruby',
      '\\b(php)\\b': 'PHP',
      '\\b(swift|ios)\\b': 'Swift',
      '\\b(kotlin|android)\\b': 'Kotlin',
      '\\b(go|golang)\\b': 'Go',
      '\\b(rust)\\b': 'Rust',
      '\\b(typescript|ts)\\b': 'TypeScript',
      '\\b(sql|database|query)\\b': 'SQL'
    };
    for (const [pattern, lang] of Object.entries(languages)) {
      if (new RegExp(pattern, 'i').test(prompt)) return lang;
    }
    return null;
  },

  detectIntent(prompt) {
    const order = ['strategy', 'debugging', 'coding', 'explanation', 'analysis', 'writing'];
    for (const intent of order) {
      if (this.templates[intent].pattern.test(prompt)) return intent;
    }
    return 'general';
  },

  // ── Main Optimize Entry Point ─────────────────────────────────────────────

  async optimize(prompt) {
    if (!prompt?.trim()) return { text: prompt, source: 'template' };
    const trimmed = prompt.trim();

    // ── Step 1: get saved settings ─────────────────────────────────────
    let settings = {};
    try {
      settings = await this.getSettings();
      console.log('[MetaPrompt] Settings loaded — apiKey present:', !!settings.apiKey,
        '| model:', settings.model, '| technique:', settings.technique);
    } catch (e) {
      console.error('[MetaPrompt] Failed to read settings:', e);
    }

    // ── Step 2: try Gemini API if key exists ───────────────────────────
    if (settings.apiKey) {
      try {
        const platform = PlatformDetector.detect();
        const history = platform ? PlatformDetector.getChatHistory(platform) : '';

        console.log('[MetaPrompt] Sending to background → model:', settings.model, '| technique:', settings.technique);

        const response = await this.sendMessageToBackground({
          action: 'OPTIMIZE_PROMPT',
          prompt: trimmed,
          history,
          apiKey: settings.apiKey,
          modelId: settings.model || 'auto',
          technique: settings.technique || 'auto'
        });

        console.log('[MetaPrompt] Background response:', response);

        if (response?.success && response.data) {
          return { text: response.data, source: 'ai' };
        }

        // API responded but failed — surface the error
        const apiError = response?.error || 'Unknown API error';
        console.warn('[MetaPrompt] API call failed:', apiError);
        return {
          text: this.templates[this.detectIntent(trimmed)].transform(trimmed),
          source: 'template',
          apiError
        };

      } catch (e) {
        console.error('[MetaPrompt] Exception during API call:', e);
        return {
          text: this.templates[this.detectIntent(trimmed)].transform(trimmed),
          source: 'template',
          apiError: e.message
        };
      }
    }

    // ── Step 3: no API key — use local templates ───────────────────────
    console.log('[MetaPrompt] No API key — using local templates');
    const intent = this.detectIntent(trimmed);
    return { text: this.templates[intent].transform(trimmed), source: 'template' };
  },

  // ── Settings Loader ───────────────────────────────────────────────────────

  getSettings() {
    return new Promise((resolve) => {
      if (!chrome?.storage?.sync) { 
        console.warn('[MetaPrompt] Storage API not available');
        resolve({}); 
        return; 
      }
      chrome.storage.sync.get(['geminiApiKey', 'selectedModel', 'selectedTechnique'], (result) => {
        if (chrome.runtime.lastError) { 
          console.error('[MetaPrompt] Storage Error:', chrome.runtime.lastError.message);
          resolve({}); 
          return; 
        }
        resolve({
          apiKey:    result.geminiApiKey    || null,
          model:     result.selectedModel   || 'auto',
          technique: result.selectedTechnique || 'auto'
        });
      });
    });
  },

  // ── Message Sender (with retry + exponential backoff) ─────────────────────

  async sendMessageToBackground(message) {
    const MAX_RETRIES = 5;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await this._send(message);
      } catch (error) {
        const isRetriable = ['Receiving end does not exist', 'disconnected', 'timed out', 'Could not establish connection']
          .some(k => error.message.includes(k));
        if (isRetriable && attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, attempt * 500));
          continue;
        }
        return { success: false, error: error.message };
      }
    }
  },

  _send(message) {
    return new Promise((resolve, reject) => {
      if (!chrome.runtime?.id) return reject(new Error('Extension context invalidated. Please refresh the page.'));
      const timer = setTimeout(() => reject(new Error('Request timed out')), 60000);
      chrome.runtime.sendMessage(message, (response) => {
        clearTimeout(timer);
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(response);
      });
    });
  },

  getStats(original, optimized) {
    return {
      original:    { length: original.length,  words: original.split(/\s+/).length },
      optimized:   { length: optimized.length, words: optimized.split(/\s+/).length },
      improvement: { lengthIncrease: optimized.length - original.length, wordsAdded: optimized.split(/\s+/).length - original.split(/\s+/).length }
    };
  }
};

window.PromptOptimizer = PromptOptimizer;
