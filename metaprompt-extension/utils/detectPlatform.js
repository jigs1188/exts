const PlatformDetector = {
  detect() {
    const hostname = window.location.hostname;

    if (hostname.includes('chat.openai.com')) {
      return {
        name: 'chatgpt',
        selectors: {
          textarea: '#prompt-textarea, textarea[data-id], textarea',
          sendButton: 'button[data-testid="send-button"], button[aria-label="Send prompt"]',
          container: 'main form, div[class*="composer"]'
        }
      };
    }

    if (hostname.includes('gemini.google.com')) {
      return {
        name: 'gemini',
        selectors: {
          textarea: '.ql-editor[contenteditable="true"], div[contenteditable="true"][role="textbox"]',
          sendButton: 'button[aria-label*="Send"], button[mattooltip*="Send"]',
          container: 'chat-input, .input-area-container'
        }
      };
    }

    if (hostname.includes('claude.ai')) {
      return {
        name: 'claude',
        selectors: {
          textarea: 'div[contenteditable="true"][role="textbox"], fieldset div[contenteditable="true"]',
          sendButton: 'button[aria-label="Send Message"], button[aria-label*="Send"]',
          container: 'fieldset, div[class*="input-container"]'
        }
      };
    }

    return null;
  },

  getTextarea(platform) {
    const selectors = platform.selectors.textarea.split(',').map(s => s.trim());
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (this.isValidTextarea(el)) {
          return el;
        }
      }
    }
    return null;
  },

  isValidTextarea(element) {
    if (!element) return false;

    const isVisible = element.offsetParent !== null;
    const isEditable = element.isContentEditable ||
                      element.tagName === 'TEXTAREA' ||
                      element.getAttribute('contenteditable') === 'true';

    return isVisible && isEditable;
  },

  getSendButton(platform) {
    const selectors = platform.selectors.sendButton.split(',').map(s => s.trim());
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && button.offsetParent !== null) {
        return button;
      }
    }
    return null;
  },

  getInputContainer(platform) {
    const selectors = platform.selectors.container.split(',').map(s => s.trim());
    for (const selector of selectors) {
      const container = document.querySelector(selector);
      if (container && container.offsetParent !== null) {
        return container;
      }
    }
    return document.body;
  },

  getText(textarea) {
    if (!textarea) return '';

    if (textarea.tagName === 'TEXTAREA') {
      return textarea.value;
    }

    if (textarea.isContentEditable) {
      return textarea.textContent || textarea.innerText || '';
    }

    return '';
  },

  setText(textarea, text) {
    if (!textarea) return false;

    if (textarea.tagName === 'TEXTAREA') {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    if (textarea.isContentEditable) {
      textarea.textContent = text;

      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: text
      });
      textarea.dispatchEvent(inputEvent);

      const changeEvent = new Event('change', { bubbles: true });
      textarea.dispatchEvent(changeEvent);

      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(textarea);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      return true;
    }

    return false;
  }
};

window.PlatformDetector = PlatformDetector;
