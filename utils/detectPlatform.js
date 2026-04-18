// detectPlatform.js — Platform detection and text injection utilities

const PlatformDetector = {
  lastFocusedTextarea: null,
  _savedSelection: null,
  _savedText: '',

  initFocusTracking() {
    const recordFocus = (e) => {
      let node = e.target;
      if (node && node.nodeType === 3) node = node.parentNode;

      // CRITICAL: Ignore clicks on the MetaPrompt button itself.
      if (this._isInsideMetaPrompt(node)) return;

      while (node && node !== document.body && node !== document) {
        if (this.isValidTextarea(node)) {
          this.lastFocusedTextarea = node;
          break;
        }
        node = node.parentNode;
      }
    };

    const snapshotSelection = (e) => {
      if (this._isInsideMetaPrompt(e.target)) {
        this._saveCurrentSelection();
      }
    };

    document.addEventListener('focusin', recordFocus, true);
    document.addEventListener('mousedown', recordFocus, true);
    document.addEventListener('keyup', recordFocus, true);
    document.addEventListener('mousedown', snapshotSelection, true);
  },

  _isInsideMetaPrompt(node) {
    if (!node) return false;
    let current = node;
    while (current) {
      if (current.id === 'metaprompt-button-host') return true;
      if (current.getRootNode && current.getRootNode() instanceof ShadowRoot) {
        current = current.getRootNode().host;
      } else {
        current = current.parentNode;
      }
    }
    return false;
  },

  /** Snapshot the current window.getSelection into a stored reference */
  _saveCurrentSelection() {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        this._savedText = selection.toString().trim();
        let node = selection.anchorNode;
        if (node && node.nodeType === 3) node = node.parentNode;
        // Walk up to find the editable container
        while (node && node !== document.body && node !== document) {
          if (this.isValidTextarea(node)) {
            this._savedSelection = node;
            return;
          }
          node = node.parentNode;
        }
      } else {
        this._savedText = '';
      }
      // Even if selection is collapsed, try to save the focused element
      const active = document.activeElement;
      if (active && this.isValidTextarea(active)) {
        this._savedSelection = active;
      }
    } catch (e) {
      // Silently ignore — this is a best-effort optimization
    }
  },

  detect(customSites) {
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

    if (hostname.includes('linkedin.com')) {
      return {
        name: 'linkedin',
        selectors: {
          // Standard chat, Sales Navigator, and Recruiter chat selectors
          // Added .msg-form__contenteditable and role="textbox" with generic attributes
          textarea: '.msg-form__contenteditable, [contenteditable="true"], [contenteditable="plaintext-only"], [role="textbox"], .msg-form__textarea, textarea',
          sendButton: '.msg-form__send-button, button.msg-form__send-button',
          container: '.msg-form, .msg-form__content-container, .msg-convo-wrapper',
          history: '.msg-s-event-listitem__body, .msg-s-message-group-listitem__message-container'
        }
      };
    }

    if (customSites && Array.isArray(customSites)) {
      if (customSites.some(site => hostname.includes(site))) {
        return {
          name: 'generic',
          selectors: {
            // LinkedIn uses contenteditable="plaintext-only" — must match that too
            textarea: 'textarea, input[type="text"], div[contenteditable="true"], div[contenteditable="plaintext-only"], *[contenteditable="true"], *[contenteditable="plaintext-only"], div[role="textbox"], [data-artdeco-is-focused]',
            sendButton: '',
            container: 'body',
            history: ''
          }
        };
      }
    }

    return null;
  },

  isValidTextarea(element) {
    if (!element || element.nodeType !== 1) return false;

    const style = window.getComputedStyle(element);
    const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';

    // Check all forms of contenteditable including "plaintext-only" (used by LinkedIn)
    const ce = element.getAttribute('contenteditable');
    const role = element.getAttribute('role');
    const isEditable = element.isContentEditable ||
                      element.tagName === 'TEXTAREA' ||
                      element.tagName === 'INPUT' ||
                      (ce !== null && ce !== 'false' && ce !== 'inherit') ||
                      (role === 'textbox');

    return isVisible && isEditable;
  },

  getTextarea(platform) {
    // 1. BEST: Use the snapshot we saved BEFORE the button click stole focus
    if (this._savedSelection && this.isValidTextarea(this._savedSelection)) {
      const found = this._savedSelection;
      this._savedSelection = null; // consume it
      this.lastFocusedTextarea = found; // also update the tracker
      console.log('[MetaPrompt] Textarea found via saved selection snapshot');
      return found;
    }
    this._savedSelection = null;

    // 2. Check window.getSelection (works if user used keyboard shortcut, not button)
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.anchorNode;
        if (node && node.nodeType === 3) node = node.parentNode;
        while (node && node !== document.body && node !== document) {
          if (this.isValidTextarea(node)) {
            this.lastFocusedTextarea = node;
            console.log('[MetaPrompt] Textarea found via window.getSelection');
            return node;
          }
          node = node.parentNode;
        }
      }
    } catch (e) {}

    // 3. Check the last element they interacted with (clicked or typed in)
    if (this.lastFocusedTextarea && this.isValidTextarea(this.lastFocusedTextarea)) {
      console.log('[MetaPrompt] Textarea found via lastFocusedTextarea');
      return this.lastFocusedTextarea;
    }

    // 4. Check document.activeElement
    const active = document.activeElement;
    if (active && active !== document.body && this.isValidTextarea(active)) {
      console.log('[MetaPrompt] Textarea found via activeElement');
      return active;
    }

    // 5. Fallback: Generic DOM query
    if (platform?.selectors?.textarea) {
      const selectors = platform.selectors.textarea.split(',').map(s => s.trim());
      for (const selector of selectors) {
        try {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            if (this.isValidTextarea(el) && !this._isInsideMetaPrompt(el)) {
              console.log('[MetaPrompt] Textarea found via DOM query:', selector);
              return el;
            }
          }
        } catch (e) {}
      }
    }

    // 6. Last Resort: Find ANY visible editable element on the page
    // We iterate through ALL candidates to find the most likely one (e.g. active one)
    const generics = [
      '[contenteditable="true"]', 
      '[contenteditable="plaintext-only"]', 
      '[role="textbox"]', 
      '.ql-editor', // Quill.js (common in LinkedIn/Slack)
      '.msg-form__contenteditable',
      '[aria-label*="Write a message"]',
      '[aria-label*="message"]',
      'textarea', 
      'input[type="text"]'
    ];

    for (const sel of generics) {
      try {
        const elements = document.querySelectorAll(sel);
        for (const el of elements) {
          if (this.isValidTextarea(el) && !this._isInsideMetaPrompt(el)) {
            // If this one is currently focused, it's definitely the right one
            if (el === document.activeElement) {
              console.log('[MetaPrompt] Textarea found via active generic:', sel);
              return el;
            }
            // Otherwise, keep track of the first visible one we find
            console.log('[MetaPrompt] Textarea found via visible generic:', sel);
            return el; 
          }
        }
      } catch (e) {}
    }

    console.warn('[MetaPrompt] No textarea found with any strategy');
    return null;
  },

  getSendButton(platform) {
    if (!platform?.selectors?.sendButton) return null;
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
    if (textarea.tagName === 'TEXTAREA' || textarea.tagName === 'INPUT') return textarea.value;
    if (textarea.isContentEditable) return textarea.textContent || textarea.innerText || '';
    // Fallback for elements with contenteditable attribute but isContentEditable is false
    const ce = textarea.getAttribute('contenteditable');
    if (ce !== null && ce !== 'false') return textarea.textContent || textarea.innerText || '';
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

  getSelectedText() {
    // Return the text we snapshotted on mousedown
    if (this._savedText) {
      return this._savedText;
    }
    
    // Fallback for keyboard shortcut
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        return selection.toString().trim();
      }
    } catch (e) {}
    return '';
  },

  setText(textarea, text, isSelectionMode = false) {
    if (!textarea) return false;

    // Case 1: Standard textarea / input
    if (textarea.tagName === 'TEXTAREA' || textarea.tagName === 'INPUT') {
      // Use native setter to bypass React's synthetic event system
      const nativeSetter = Object.getOwnPropertyDescriptor(
        textarea.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
        'value'
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(textarea, text);
      } else {
        textarea.value = text;
      }
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    // Case 2: ContentEditable (React/Next.js apps, LinkedIn, Instagram, ChatGPT, Claude)
    const ce = textarea.getAttribute('contenteditable');
    if (textarea.isContentEditable || (ce !== null && ce !== 'false')) {
      textarea.focus();

      // Selection Management
      const selection = window.getSelection();
      const hasSelection = selection && selection.rangeCount > 0 && !selection.isCollapsed;

      // Only selectAll if we are NOT in selection backup mode
      if (!isSelectionMode || !hasSelection) {
        document.execCommand('selectAll', false, null);
      }

      // Strategy A: execCommand (most compatible with undo/redo)
      let execSuccess = false;
      try {
        execSuccess = document.execCommand('insertText', false, text);
      } catch (e) {}

      if (execSuccess) {
        console.log('[MetaPrompt] setText: Strategy A (execCommand) succeeded');
        return true;
      }

      // Strategy B: Direct DOM update (fallback)
      console.log('[MetaPrompt] setText: Strategy A failed, using Strategy B (DOM)');
      
      if (!isSelectionMode || !hasSelection) {
        while (textarea.firstChild) {
          textarea.removeChild(textarea.firstChild);
        }
        textarea.textContent = text;
      } else {
        // Selection-based DOM replacement
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      }

      textarea.style.whiteSpace = 'pre-wrap';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));

      return true;
    }

    return false;
  }
};

window.PlatformDetector = PlatformDetector;
