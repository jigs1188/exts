const UIObserver = {
  observer: null,
  buttonInjected: false,
  platform: null,
  checkInterval: null,

  init(platform) {
    this.platform = platform;
    this.injectButton();
    this.setupMutationObserver();
    this.setupPeriodicCheck();
    this.setupKeepAlive(); // Start the heartbeat connection
  },

  setupKeepAlive() {
    let port;
    const connect = () => {
      // console.log('[MetaPrompt] Connecting to background service...');
      try {
        port = chrome.runtime.connect({ name: 'keepAlive' });
        port.onDisconnect.addListener(() => {
          // console.log('[MetaPrompt] Port disconnected. Reconnecting...');
          port = null;
          setTimeout(connect, 1000); // Reconnect after 1 second
        });
      } catch (e) {
        // console.error('[MetaPrompt] Keep-alive connection failed', e);
        setTimeout(connect, 5000); // Retry longer if initial fail
      }
    };
    connect();
  },

  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      if (!this.buttonInjected || !this.isButtonVisible()) {
        this.injectButton();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  setupPeriodicCheck() {
    this.checkInterval = setInterval(() => {
      if (!this.isButtonVisible()) {
        this.buttonInjected = false;
        this.injectButton();
      }
    }, 2000);
  },

  isButtonVisible() {
    const shadowHost = document.getElementById('metaprompt-button-host');
    // Check if element exists and is connected to DOM.
    // avoided offsetParent check as it returns null for fixed elements in Firefox
    if (!shadowHost || !shadowHost.isConnected) return false;

    if (shadowHost.shadowRoot) {
      const button = shadowHost.shadowRoot.querySelector('.metaprompt-button');
      return button !== null;
    }

    return false;
  },

  injectButton() {
    if (this.buttonInjected && this.isButtonVisible()) {
      return;
    }

    // Always inject into body to ensure visibility, regardless of platform quirks
    // The button is fixed position anyway, so it doesn't need to be inside the form container
    const container = document.body;

    const existingHost = document.getElementById('metaprompt-button-host');
    if (existingHost) {
      existingHost.remove();
    }

    const shadowHost = document.createElement('div');
    shadowHost.id = 'metaprompt-button-host';
    shadowHost.style.cssText = `
      position: fixed;
      bottom: 120px;
      right: 24px;
      width: 56px;
      height: 56px;
      z-index: 2147483647;
      pointer-events: auto;
    `;

    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .metaprompt-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .metaprompt-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }

      .metaprompt-button:active {
        transform: scale(0.95);
      }

      .metaprompt-button.processing {
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.8;
        }
      }

      .tooltip {
        position: absolute;
        bottom: 70px;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .metaprompt-button:hover + .tooltip {
        opacity: 1;
      }
    `;

    const button = document.createElement('button');
    button.className = 'metaprompt-button';
    button.innerHTML = '✨';
    button.setAttribute('aria-label', 'Enhance Prompt');
    button.title = 'Enhance your prompt with MetaPrompt';

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Enhance Prompt';

    button.addEventListener('click', () => this.handleButtonClick(button));

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(button);
    shadowRoot.appendChild(tooltip);

    document.body.appendChild(shadowHost);
    this.buttonInjected = true;
  },

  async handleButtonClick(button) {
    if (button.classList.contains('processing')) return;

    const textarea = PlatformDetector.getTextarea(this.platform);
    if (!textarea) {
      this.showNotification('Could not find input field', 'error');
      return;
    }

    const originalPrompt = PlatformDetector.getText(textarea);
    
    if (!originalPrompt || originalPrompt.trim().length === 0) {
      this.showNotification('Please enter a prompt first', 'warning');
      return;
    }

    button.classList.add('processing');
    button.innerHTML = '⚡';

    // Small delay to allow UI to update
    await new Promise(r => setTimeout(r, 100));

    try {
      this.showNotification('Optimizing...', 'info');
      
      const optimizedPrompt = await PromptOptimizer.optimize(originalPrompt);
      
      if (!optimizedPrompt) {
        throw new Error('Optimization returned empty result');
      }

      if (optimizedPrompt === originalPrompt) {
        this.showNotification('Prompt already optimized', 'info');
        button.innerHTML = '✨';
        return;
      }

      const success = PlatformDetector.setText(textarea, optimizedPrompt);

      if (success) {
        this.showNotification('Prompt enhanced successfully!', 'success');
        button.innerHTML = '✅';
      } else {
        this.showNotification('Failed to update text', 'error');
        button.innerHTML = '❌';
      }
    } catch (error) {
      console.error('[MetaPrompt] Optimization error:', error);
      // Show the actual error message if available
      const errorMsg = error.message || error.toString();
      this.showNotification(errorMsg.length < 50 ? errorMsg : 'Error optimizing prompt', 'error');
      button.innerHTML = '❌';
    } finally {
      setTimeout(() => {
        button.classList.remove('processing');
        button.innerHTML = '✨';
      }, 1500);
    }
  },

  showNotification(message, type = 'info') {
    const existingNotification = document.getElementById('metaprompt-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'metaprompt-notification';

    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    notification.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: ${colors[type]};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    const shadowHost = document.getElementById('metaprompt-button-host');
    if (shadowHost) {
      shadowHost.remove();
    }
    this.buttonInjected = false;
  }
};

window.UIObserver = UIObserver;
