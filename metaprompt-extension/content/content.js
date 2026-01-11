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

    const waitForTextarea = setInterval(() => {
      const textarea = PlatformDetector.getTextarea(platform);

      if (textarea) {
        clearInterval(waitForTextarea);
        console.log('[MetaPrompt] Textarea found, initializing UI');

        UIObserver.init(platform);
        initialized = true;

        setupKeyboardShortcut(platform);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(waitForTextarea);
    }, 30000);
  }

  function setupKeyboardShortcut(platform) {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();

        const textarea = PlatformDetector.getTextarea(platform);
        if (!textarea) return;

        const originalPrompt = PlatformDetector.getText(textarea);
        if (!originalPrompt || originalPrompt.trim().length === 0) return;

        const optimizedPrompt = PromptOptimizer.optimize(originalPrompt);
        PlatformDetector.setText(textarea, optimizedPrompt);

        UIObserver.showNotification('Prompt enhanced with Ctrl+Shift+E', 'success');
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
