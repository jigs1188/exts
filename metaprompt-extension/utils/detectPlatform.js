// detectPlatform.js — Platform detection and text injection utilities
// No changes needed from open-source refactor.

const PlatformDetector = {
  detect() {
    const hostname = window.location.hostname;

    if (hostname.includes('chat.openai.com') || hostname.includes('chatgpt.com')) {
      return {
        name: 'chatgpt',
        selectors: {
          textarea: '#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"], div[contenteditable="true"][role="textbox"], main form textarea',
          sendButton: 'button[data-testid="send-button"], button[aria-label="Send prompt"]',
          container: 'main form, #prompt-textarea',
          history: 'div[data-message-author-role="user"], div[data-message-author-role="assistant"]'
        }
      };
    }

    if (hostname.includes('gemini.google.com')) {
      return {
        name: 'gemini',
        selectors: {
          textarea: '.ql-editor, div[contenteditable="true"][role="textbox"], div[role="textbox"]',
          sendButton: 'button[aria-label*="Send"], .send-button',
          container: 'chat-input, .input-area-container',
          history: 'user-query, model-response, .user-query, .model-response'
        }
      };
    }

    if (hostname.includes('claude.ai')) {
      return {
        name: 'claude',
        selectors: {
          textarea: 'div[contenteditable="true"], fieldset div[contenteditable="true"]',
          sendButton: 'button[aria-label*="Send"]',
          container: 'fieldset, div[class*="input-container"]',
          history: '.font-user-message, .font-claude-message'
        }
      };
    }

    return null;
  },

  isValidTextarea(element) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0 &&
                      window.getComputedStyle(element).visibility !== 'hidden' &&
                      window.getComputedStyle(element).display !== 'none';

    const isEditable = element.isContentEditable ||
                      element.tagName === 'TEXTAREA' ||
                      element.getAttribute('contenteditable') === 'true';

    return isVisible && isEditable;
  },

  getTextarea(platform) {
    const selectors = platform.selectors.textarea.split(',').map(s => s.trim());
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (this.isValidTextarea(el)) return el;
      }
    }
    return null;
  },

  getSendButton(platform) {
    const selectors = platform.selectors.sendButton.split(',').map(s => s.trim());
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && button.offsetParent !== null) return button;
    }
    return null;
  },

  getInputContainer(platform) {
    const selectors = platform.selectors.container.split(',').map(s => s.trim());
    for (const selector of selectors) {
      const container = document.querySelector(selector);
      if (container && container.offsetParent !== null) return container;
    }
    return document.body;
  },

  getText(textarea) {
    if (!textarea) return '';
    if (textarea.tagName === 'TEXTAREA') return textarea.value;
    if (textarea.isContentEditable) return textarea.textContent || textarea.innerText || '';
    return '';
  },

  getChatHistory(platform) {
    try {
      if (!platform?.selectors?.history) return '';
      const elements = document.querySelectorAll(platform.selectors.history);
      if (!elements || elements.length === 0) return '';

      // Last 4 messages for context without token overload
      const recent = Array.from(elements).slice(-4);
      let historyText = '';
      recent.forEach(el => {
        const text = el.innerText || el.textContent;
        if (text?.trim()) {
          historyText += `[History]: ${text.substring(0, 300)}...\n`;
        }
      });
      return historyText;
    } catch (e) {
      console.warn('[MetaPrompt] Failed to read chat history', e);
      return '';
    }
  },

  setText(textarea, text) {
    if (!textarea) return false;

    // Case 1: Standard textarea
    if (textarea.tagName === 'TEXTAREA') {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    // Case 2: ContentEditable (React/Next.js apps like ChatGPT, Claude)
    if (textarea.isContentEditable) {
      textarea.focus();

      // Strategy A: execCommand (most compatible)
      document.execCommand('selectAll', false, null);
      let success = false;
      try {
        success = document.execCommand('insertText', false, text);
      } catch (e) {}

      if (success) {
        const check = this.getText(textarea);
        if (check?.trim() === text.trim()) return true;
      }

      // Strategy B: Nuclear DOM update (fallback for React-controlled inputs)
      textarea.style.whiteSpace = 'pre-wrap';
      textarea.textContent = text;

      const events = [
        new Event('focus', { bubbles: true }),
        new KeyboardEvent('keydown', { bubbles: true, key: 'a' }),
        new InputEvent('input', {
          bubbles: true,
          inputType: 'insertText',
          data: text,
          view: window
        }),
        new KeyboardEvent('keyup', { bubbles: true, key: 'a' }),
        new Event('change', { bubbles: true }),
        new Event('blur', { bubbles: true })
      ];
      events.forEach(evt => textarea.dispatchEvent(evt));

      return true;
    }

    return false;
  }
};

window.PlatformDetector = PlatformDetector;
