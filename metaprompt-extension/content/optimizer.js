const PromptOptimizer = {
  templates: {
    general: {
      pattern: /.*/,
      transform: (prompt) => `You are an expert assistant with deep knowledge across multiple domains.

Task: ${prompt}

Instructions:
- Provide a comprehensive and well-structured response
- Break down complex concepts into digestible parts
- Use examples where appropriate
- Consider edge cases and alternative perspectives
- Be precise and actionable

Format your response with clear sections and bullet points where helpful.`
    },

    strategy: {
      pattern: /(sell|money|income|price|cost|business|plan|strategy|market|distribute|share|private|license|protect|hack|prevent)/i,
      transform: (prompt) => `You are an expert Strategic Consultant and Product Manager.

Strategy Task: ${prompt}

Objective:
- Analyze the business/security goal
- Provide a robust, step-by-step plan
- Address risks and mitigation strategies
- Suggest tools or platforms if relevant

Output format:
1. Executive Summary
2. Strategic Steps
3. Risk Analysis
4. Recommended Implementation path`
    },

    coding: {
      pattern: /(write|create|build|code|implement|function|class|debug|fix|error|bug|script|program|algorithm)/i,
      transform: (prompt) => {
        const language = PromptOptimizer.detectLanguage(prompt);
        return `You are an expert software engineer specializing in ${language || 'general software architecture'}.

Task: ${prompt}

Requirements:
- Write clean, efficient, and maintainable code
- Follow best practices and design patterns
- Include error handling where appropriate
- Add concise inline comments for complex logic
- Consider time and space complexity
- Handle edge cases

Output format:
1. Brief explanation of the approach
2. Complete implementation
3. Usage example
4. Time/Space complexity analysis (if applicable)
5. Potential improvements or considerations`;
      }
    },

    debugging: {
      pattern: /(debug|fix|error|issue|problem|not working|broken|crash|fails)/i,
      transform: (prompt) => `You are an expert debugging specialist with systematic problem-solving skills.

Problem: ${prompt}

Debugging approach:
- Analyze the symptoms and error messages
- Identify the root cause
- Explain why the issue occurs
- Provide a clear solution
- Suggest preventive measures

Output format:
1. Problem Analysis
2. Root Cause
3. Solution (with code if applicable)
4. Explanation
5. Prevention tips`
    },

    explanation: {
      pattern: /(explain|what is|how does|why|describe|tell me about|understand|clarify)/i,
      transform: (prompt) => `You are an expert educator skilled at making complex topics accessible.

Topic: ${prompt}

Teaching approach:
- Start with a clear, simple definition
- Build understanding progressively
- Use analogies and real-world examples
- Address common misconceptions
- Provide practical applications

Output format:
1. Clear Definition
2. Core Concepts (step by step)
3. Examples
4. Common Misconceptions
5. Practical Applications
6. Further Learning Resources`
    },

    writing: {
      pattern: /(write|compose|draft|essay|article|blog|email|letter|content|copy)/i,
      transform: (prompt) => `You are an expert writer with exceptional communication skills.

Writing task: ${prompt}

Guidelines:
- Match the appropriate tone and style
- Structure content logically
- Use clear and engaging language
- Ensure proper grammar and flow
- Consider the target audience

Deliverable:
- Well-structured content
- Appropriate formatting
- Engaging and professional tone`
    },

    analysis: {
      pattern: /(analyze|compare|evaluate|assess|review|critique)/i,
      transform: (prompt) => `You are an expert analyst with critical thinking and evaluation skills.

Analysis task: ${prompt}

Framework:
- Define evaluation criteria
- Examine all relevant aspects
- Consider strengths and weaknesses
- Support claims with reasoning
- Provide balanced perspective

Output structure:
1. Overview
2. Detailed Analysis
3. Key Findings
4. Comparison (if applicable)
5. Recommendations/Conclusions`
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
      if (new RegExp(pattern, 'i').test(prompt)) {
        return lang;
      }
    }
    return null;
  },

  detectIntent(prompt) {
    const priorities = [
      'strategy', // Check this first!
      'debugging',
      'coding',
      'explanation',
      'analysis',
      'writing'
    ];

    for (const intent of priorities) {
      if (this.templates[intent].pattern.test(prompt)) {
        return intent;
      }
    }

    return 'general';
  },

  async optimize(prompt) {
    if (!prompt || prompt.trim().length === 0) {
      return prompt;
    }

    const trimmedPrompt = prompt.trim();

    // Check for API Key first
    try {
      const apiKey = await this.getApiKey();
      if (apiKey) {
        
        // NEW: Get Context
        const platform = PlatformDetector.detect();
        const chatHistory = platform ? PlatformDetector.getChatHistory(platform) : '';

        const response = await this.sendMessageToBackground({
          action: 'OPTIMIZE_PROMPT',
          prompt: trimmedPrompt,
          history: chatHistory, // Send the context
          apiKey: apiKey
        });

        if (response && response.success) {
          return response.data;
        } else {
          // CRITICAL CHANGE: If API explicitly checks and fails (e.g., Quota, Key), 
          // DO NOT fallback. Show the error to the user.
          const errorMsg = response ? response.error : 'Unknown API Error';
          
          if (errorMsg.includes('Quota') || errorMsg.includes('API key') || errorMsg.includes('permission') || errorMsg.includes('403') || errorMsg.includes('429')) {
             // throw new Error('Gemini API Error: ' + errorMsg); // OLD: Hard fail
             console.warn('[MetaPrompt] API Quota/Key issue. Falling back to templates:', errorMsg); // NEW: Soft fail
          }

          console.warn('[MetaPrompt] API connection failed, falling back to templates:', errorMsg);
        }
      }
    } catch (e) {
      // Re-throw specific API errors so the UI shows them
      if (e.message.includes('Gemini API Error')) {
        throw e;
      }
      console.error('[MetaPrompt] Error fetching API key or calling background:', e);
    }

    // Fallback to static templates (Only if API Key is missing or Connection failed)
    // console.log('[MetaPrompt] Using local templates');
    const intent = this.detectIntent(trimmedPrompt);
    const template = this.templates[intent];

    return template.transform(trimmedPrompt);
  },

  async sendMessageToBackground(message) {
    const MAX_RETRIES = 5; // Increased from 3
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      attempt++;
      try {
        return await this._attemptSendMessage(message);
      } catch (error) {
        const isConnectionError = error.message.includes('Receiving end does not exist') || 
                                  error.message.includes('disconnected') ||
                                  error.message.includes('timed out') ||
                                  error.message.includes('Could not establish connection');
        
        if (isConnectionError && attempt < MAX_RETRIES) {
          // Exponential Backoff: 500ms, 1000ms, 1500ms, 2000ms...
          const waitTime = attempt * 500;
          // console.log(`[MetaPrompt] Connection failed. Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // Retry
        }
        
        // If it's the last attempt or not a retriable error, return failure
        return { success: false, error: error.message };
      }
    }
  },

  _attemptSendMessage(message) {
    return new Promise((resolve, reject) => {
        if (!chrome.runtime?.id) {
          return reject(new Error('Extension context invalidated. Please refresh the page.'));
        }

        // Timeout race
        const timeoutId = setTimeout(() => {
            reject(new Error('Request timed out (Background Script unresponsive)'));
        }, 60000); // 60s timeout for model discovery processing

        chrome.runtime.sendMessage(message, (response) => {
          clearTimeout(timeoutId);
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
    });
  },

  getApiKey() {
    return new Promise((resolve) => {
      // Check if API is supported in this context
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
        resolve(null);
        return;
      }

      try {
        chrome.storage.sync.get(['geminiApiKey'], (result) => {
          if (chrome.runtime.lastError) {
             resolve(null);
             return;
          }
          if (result && result.geminiApiKey) {
            resolve(result.geminiApiKey);
          } else {
            resolve(null);
          }
        });
      } catch (e) {
        console.error('[MetaPrompt] Storage access exception:', e);
        resolve(null);
      }
    });
  },

  getStats(originalPrompt, optimizedPrompt) {
    return {
      original: {
        length: originalPrompt.length,
        words: originalPrompt.split(/\s+/).length
      },
      optimized: {
        length: optimizedPrompt.length,
        words: optimizedPrompt.split(/\s+/).length
      },
      improvement: {
        lengthIncrease: optimizedPrompt.length - originalPrompt.length,
        wordsAdded: optimizedPrompt.split(/\s+/).length - originalPrompt.split(/\s+/).length
      }
    };
  }
};

window.PromptOptimizer = PromptOptimizer;
