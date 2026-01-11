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

    coding: {
      pattern: /(write|create|build|code|implement|function|class|debug|fix|error|bug|script|program|algorithm)/i,
      transform: (prompt) => {
        const language = this.detectLanguage(prompt);
        return `You are an expert software engineer specializing in ${language || 'multiple programming languages'}.

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
      }
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
      }
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
      }
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
    }
  },

  detectLanguage(prompt) {
    const languages = {
      'javascript|js|node|react|vue|angular': 'JavaScript',
      'python|py|django|flask': 'Python',
      'java(?!script)': 'Java',
      'c\\+\\+|cpp': 'C++',
      'c#|csharp': 'C#',
      'ruby|rails': 'Ruby',
      'php': 'PHP',
      'swift|ios': 'Swift',
      'kotlin|android': 'Kotlin',
      'go|golang': 'Go',
      'rust': 'Rust',
      'typescript|ts': 'TypeScript',
      'sql|database|query': 'SQL'
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

  optimize(prompt) {
    if (!prompt || prompt.trim().length === 0) {
      return prompt;
    }

    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < 10) {
      return trimmedPrompt;
    }

    const intent = this.detectIntent(trimmedPrompt);
    const template = this.templates[intent];

    return template.transform(trimmedPrompt);
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
