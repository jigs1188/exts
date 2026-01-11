# MetaPrompt Architecture

Technical documentation for the MetaPrompt browser extension.

## Overview

MetaPrompt is a client-side browser extension that enhances AI prompts using rule-based prompt engineering patterns. It operates entirely in the browser without external APIs, backends, or data transmission.

## Core Principles

1. **Zero External Dependencies**: No API calls, no backend services
2. **Privacy First**: All processing happens locally
3. **Platform Agnostic**: Works across ChatGPT, Gemini, and Claude
4. **Non-Invasive**: Uses Shadow DOM to avoid CSS conflicts
5. **Dynamic**: Adapts to platform UI changes via MutationObserver

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Browser Tab                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │         AI Platform (ChatGPT/Gemini/Claude)       │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │         Content Scripts (Injected)          │ │  │
│  │  │                                             │ │  │
│  │  │  ┌──────────────┐  ┌──────────────────┐    │ │  │
│  │  │  │  Platform    │  │   Prompt         │    │ │  │
│  │  │  │  Detector    │─▶│   Optimizer      │    │ │  │
│  │  │  └──────────────┘  └──────────────────┘    │ │  │
│  │  │         │                    │             │ │  │
│  │  │         ▼                    ▼             │ │  │
│  │  │  ┌──────────────┐  ┌──────────────────┐    │ │  │
│  │  │  │     UI       │  │   DOM            │    │ │  │
│  │  │  │   Observer   │─▶│   Manipulator    │    │ │  │
│  │  │  └──────────────┘  └──────────────────┘    │ │  │
│  │  │                                             │ │  │
│  │  │  ┌────────────────────────────────────┐    │ │  │
│  │  │  │      Shadow DOM UI                 │    │ │  │
│  │  │  │  (Floating Button + Notifications) │    │ │  │
│  │  │  └────────────────────────────────────┘    │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Module Breakdown

### 1. detectPlatform.js

**Purpose**: Platform detection and DOM manipulation abstraction layer

**Key Functions**:
- `detect()`: Identifies current AI platform (ChatGPT/Gemini/Claude)
- `getTextarea()`: Locates input field across different platform structures
- `getText()`: Extracts text from textarea or contenteditable elements
- `setText()`: Injects optimized prompt and triggers events
- `getSendButton()`: Finds the submit button for programmatic triggering

**Platform-Specific Selectors**:

```javascript
ChatGPT: {
  textarea: '#prompt-textarea, textarea[data-id]',
  sendButton: 'button[data-testid="send-button"]',
  container: 'main form'
}

Gemini: {
  textarea: '.ql-editor[contenteditable="true"]',
  sendButton: 'button[aria-label*="Send"]',
  container: 'chat-input'
}

Claude: {
  textarea: 'div[contenteditable="true"][role="textbox"]',
  sendButton: 'button[aria-label="Send Message"]',
  container: 'fieldset'
}
```

**Event Triggering**:
- Dispatches `input`, `change`, and `InputEvent` to ensure platform detection
- Handles both standard textareas and contenteditable divs
- Maintains cursor position after text injection

### 2. optimizer.js

**Purpose**: Rule-based prompt enhancement engine

**Architecture**:

```
User Prompt
    │
    ▼
┌──────────────┐
│ Intent       │──▶ Pattern Matching (Regex)
│ Detection    │
└──────────────┘
    │
    ▼
┌──────────────┐
│ Template     │──▶ Coding / Debugging / Writing / etc.
│ Selection    │
└──────────────┘
    │
    ▼
┌──────────────┐
│ Transform    │──▶ Apply Template + Context
│ Function     │
└──────────────┘
    │
    ▼
Enhanced Prompt
```

**Intent Detection Patterns**:

| Intent | Trigger Keywords | Priority |
|--------|-----------------|----------|
| Debugging | debug, fix, error, broken | 1 (Highest) |
| Coding | write, create, function, implement | 2 |
| Explanation | explain, what is, how does | 3 |
| Analysis | analyze, compare, evaluate | 4 |
| Writing | write, essay, blog, email | 5 |
| General | (fallback) | 6 (Lowest) |

**Template Structure**:

Each template contains:
- **Role Definition**: "You are an expert {domain}"
- **Task Clarification**: Restates the user's goal
- **Instructions**: Step-by-step guidelines
- **Output Format**: Structured response template
- **Best Practices**: Domain-specific requirements

**Language Detection**:

Coding templates detect programming language via keyword matching:
- JavaScript, Python, Java, C++, C#, Ruby, PHP, Swift, Kotlin, Go, Rust, TypeScript, SQL

### 3. observer.js

**Purpose**: UI injection and lifecycle management

**Key Responsibilities**:
- Inject floating button via Shadow DOM
- Monitor DOM changes for dynamic content
- Handle button interactions
- Display notifications
- Periodic visibility checks

**MutationObserver Configuration**:

```javascript
{
  childList: true,    // Watch for added/removed nodes
  subtree: true       // Monitor entire DOM tree
}
```

**Shadow DOM Structure**:

```html
<div id="metaprompt-button-host">
  #shadow-root
    ├── <style> (Isolated CSS)
    ├── <button class="metaprompt-button">
    └── <div class="tooltip">
```

**Benefits of Shadow DOM**:
- CSS isolation (no conflicts with platform styles)
- Encapsulated component
- Protection from platform JavaScript
- Clean DOM structure

**Periodic Checks**:
- Runs every 2 seconds
- Verifies button visibility
- Re-injects if removed by platform updates

### 4. content.js

**Purpose**: Main orchestration and initialization

**Initialization Flow**:

```
Page Load
    │
    ▼
Detect Platform
    │
    ├──▶ Not Supported ──▶ Exit
    │
    ▼
Wait for Textarea (max 30s)
    │
    ▼
Initialize UI Observer
    │
    ▼
Setup Keyboard Shortcuts
    │
    ▼
Monitor for Navigation Changes
```

**Keyboard Shortcuts**:
- `Ctrl+Shift+E` (Windows/Linux)
- `Cmd+Shift+E` (Mac)
- Prevents default browser behavior
- Provides visual feedback

**Navigation Handling**:
- Detects SPA route changes
- Re-initializes if needed
- Maintains single instance

## Data Flow

### Enhancement Flow

```
1. User types prompt in AI platform
2. User clicks ✨ button or presses Ctrl+Shift+E
3. Platform Detector reads textarea content
4. Optimizer detects intent via pattern matching
5. Optimizer applies appropriate template
6. Platform Detector injects enhanced prompt
7. Platform Detector dispatches events
8. UI Observer shows success notification
```

### No Data Persistence

- No localStorage usage
- No IndexedDB storage
- No cookies
- No external requests
- Stateless operation

## Browser Compatibility

### Manifest V3

Uses modern extension architecture:
- Content scripts for page interaction
- Action popup for settings
- Declarative permissions
- Service worker (not used in this extension)

### Cross-Browser APIs

**Chrome/Edge**:
```javascript
chrome.storage.local
chrome.tabs
chrome.runtime
```

**Firefox**:
```javascript
browser.storage.local  // Equivalent
browser.tabs
browser.runtime
```

**Compatibility Layer**:
Both Chrome and Firefox support `chrome.*` namespace in content scripts.

## Performance Considerations

### Optimization Techniques

1. **Debounced Checks**: Periodic checks every 2s (not on every mutation)
2. **Selective DOM Queries**: Multiple fallback selectors
3. **Event Delegation**: Single listener instead of multiple
4. **Lazy Initialization**: Only activates on supported platforms
5. **Shadow DOM**: Minimal impact on platform performance

### Memory Management

- Single MutationObserver instance
- Cleanup on navigation
- No memory leaks from event listeners
- Efficient regex pattern matching

## Security

### No External Communication

- Zero network requests
- No API calls
- No telemetry
- No analytics

### Content Security Policy Compliance

- Inline styles in Shadow DOM (isolated)
- No eval() usage
- No remote script loading
- Declarative event handlers

### Permission Model

**Required Permissions**:
- `activeTab`: Access current tab content
- `storage`: (Optional) For future settings persistence

**Host Permissions**:
- `https://chat.openai.com/*`
- `https://gemini.google.com/*`
- `https://claude.ai/*`

## Extension Popup

### UI Components

- Information panel
- Feature showcase
- Platform links
- Keyboard shortcuts
- Usage statistics (optional)

### Popup Communication

```javascript
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'statsUpdate') {
    loadStats();
  }
});
```

## Testing Strategy

### Manual Testing

Use `test.html` for isolated optimizer testing:
- Load different prompt types
- Verify intent detection
- Check template application
- Measure enhancement quality

### Browser Testing

1. Load extension in developer mode
2. Navigate to each platform
3. Verify button injection
4. Test enhancement on various prompts
5. Check keyboard shortcuts
6. Verify notifications

### Platform-Specific Testing

**ChatGPT**:
- Test on new conversation
- Test on existing conversation
- Verify textarea detection after regeneration

**Gemini**:
- Test contenteditable handling
- Verify button positioning
- Check send button detection

**Claude**:
- Test in main chat
- Verify fieldset detection
- Check cursor positioning

## Future Enhancements

Possible improvements while maintaining no-API constraint:

1. **Custom Templates**: User-defined enhancement patterns
2. **Settings Panel**: Toggle enhancement types
3. **Template History**: Local storage of recent enhancements
4. **Prompt Library**: Pre-built prompt templates
5. **A/B Comparison**: Show before/after side-by-side
6. **Export Function**: Save enhanced prompts
7. **Undo Feature**: Revert to original prompt
8. **Multi-Language**: Support non-English prompts

## Troubleshooting

### Common Issues

**Button not appearing**:
- Platform selector outdated (UI changed)
- MutationObserver not detecting elements
- Shadow DOM injection failed

**Enhancement not working**:
- Event dispatching insufficient
- Platform changed input handling
- Cursor position lost

**Performance issues**:
- Too frequent MutationObserver triggers
- Inefficient DOM queries
- Memory leak from listeners

### Debug Mode

Add to content.js:

```javascript
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[MetaPrompt]', ...args);
}
```

## Contributing Guidelines

When contributing:

1. Maintain zero-dependency principle
2. Test on all three platforms
3. Ensure Shadow DOM isolation
4. Add comments for complex logic
5. Update selectors for platform changes
6. Keep code modular and focused

---

**Version**: 1.0.0
**Last Updated**: 2026-01-11
**License**: MIT
