(() => {
  let initialized = false;

  function initializeExtension() {
    if (initialized) {
      return;
    }

    chrome.storage.local.get(['customSites'], (result) => {
      const customSites = result.customSites || [];
      const platform = PlatformDetector.detect(customSites);

      if (!platform) {
        console.log('[MetaPrompt] Not on a supported platform');
        return;
      }

      console.log(`[MetaPrompt] Detected platform: ${platform.name}`);

    // Initialize UI immediately so usage is visible
    UIObserver.init(platform);
    PlatformDetector.initFocusTracking();
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
    }); // End of chrome.storage.local.get
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
          const result = await PromptOptimizer.optimize(originalPrompt);
          
          const optimizedText = (typeof result === 'object') ? result.text : result;
          const source        = (typeof result === 'object') ? result.source : 'template';
          const apiError      = (typeof result === 'object') ? result.apiError : null;

          if (!optimizedText || optimizedText === originalPrompt) {
            UIObserver.showNotification('Prompt already well-structured', 'info');
            return;
          }

          const success = PlatformDetector.setText(textarea, optimizedText);
          
          if (success) {
            if (source === 'ai') {
              UIObserver.showNotification('✨ Enhanced with Gemini AI! (Alt+Shift+P)', 'success');
            } else if (apiError) {
              let friendlyError = 'API Error';
              if (apiError.includes('Quota')) friendlyError = 'API Quota Exceeded';
              else if (apiError.includes('Invalid')) friendlyError = 'Invalid API Key';
              else if (apiError.includes('Receiving end')) friendlyError = 'Extension Reloaded (Refresh Page)';
              else friendlyError = apiError;
              UIObserver.showNotification(`⚠️ ${friendlyError}`, 'warning', 6000);
            } else {
              UIObserver.showNotification('📋 Enhanced with local template (Alt+Shift+P)', 'info');
            }
          } else {
            UIObserver.showNotification('Failed to update the text field', 'error');
          }
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
