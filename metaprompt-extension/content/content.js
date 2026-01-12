(() => {
  let initialized = false;

  function initializeExtension() {
    if (initialized) {
      return;
    }

    const platform = PlatformDetector.detect();

    if (!platform) {
      console.log('[MetaPrompt] Not on a supported platform');
      return;
    }

    console.log(`[MetaPrompt] Detected platform: ${platform.name}`);

    console.log(`[MetaPrompt] Detected platform: ${platform.name}`);

    // Initialize UI immediately so usage is visible
    UIObserver.init(platform);
    initialized = true;
    setupKeyboardShortcut(platform);
    
    // Check for textarea just for logging purposes
    const waitForTextarea = setInterval(() => {
      const textarea = PlatformDetector.getTextarea(platform);
      if (textarea) {
        clearInterval(waitForTextarea);
        console.log('[MetaPrompt] Textarea found');
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(waitForTextarea);
    }, 30000);
  }

  function setupKeyboardShortcut(platform) {
    document.addEventListener('keydown', async (e) => {
      // Changed to Alt+Shift+P to avoid conflicts with browser dev tools (Ctrl+Shift+E is often Network tab)
      if (e.altKey && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();

        const textarea = PlatformDetector.getTextarea(platform);
        if (!textarea) return;

        const originalPrompt = PlatformDetector.getText(textarea);
        if (!originalPrompt || originalPrompt.trim().length === 0) return;

        UIObserver.showNotification('Optimizing prompt...', 'info');
        
        try {
          const optimizedPrompt = await PromptOptimizer.optimize(originalPrompt);
          PlatformDetector.setText(textarea, optimizedPrompt);
          UIObserver.showNotification('Prompt enhanced with Alt+Shift+P', 'success');
        } catch (err) {
          console.error(err);
          UIObserver.showNotification('Optimization failed', 'error');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }

  window.addEventListener('load', () => {
    if (!initialized) {
      setTimeout(initializeExtension, 1000);
    }
  });

  const navigationObserver = new MutationObserver(() => {
    if (!initialized) {
      initializeExtension();
    }
  });

  navigationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
