# MetaPrompt File Structure

Complete file structure and verification checklist.

## Directory Tree

```
metaprompt-extension/
│
├── manifest.json                 # Extension configuration (Manifest V3)
├── .gitignore                    # Git ignore rules
├── LICENSE                       # MIT License
│
├── Documentation/
│   ├── README.md                 # Main documentation and overview
│   ├── QUICKSTART.md            # 5-minute setup guide
│   ├── SETUP.md                 # Detailed installation instructions
│   ├── ARCHITECTURE.md          # Technical architecture documentation
│   ├── EXAMPLES.md              # Before/after prompt examples
│   ├── CHANGELOG.md             # Version history
│   └── FILE_STRUCTURE.md        # This file
│
├── content/                      # Content scripts (injected into pages)
│   ├── content.js               # Main orchestration and initialization
│   ├── observer.js              # UI injection and lifecycle management
│   └── optimizer.js             # Prompt enhancement engine
│
├── ui/                          # Extension popup interface
│   ├── panel.html               # Popup HTML structure
│   ├── panel.css                # Popup styles
│   └── panel.js                 # Popup functionality
│
├── utils/                       # Utility modules
│   └── detectPlatform.js        # Platform detection and DOM abstraction
│
├── icons/                       # Extension icons
│   ├── icon.svg                 # SVG source icon
│   ├── generate-icons.html      # Icon generator utility
│   ├── icon16.png              # 16x16 icon (generate this)
│   ├── icon48.png              # 48x48 icon (generate this)
│   └── icon128.png             # 128x128 icon (generate this)
│
└── test.html                    # Local optimizer testing page
```

## File Descriptions

### Core Extension Files

| File | Purpose | Lines | Critical |
|------|---------|-------|----------|
| `manifest.json` | Extension configuration, permissions, content scripts | 40 | Yes |
| `content/content.js` | Main entry point, initialization logic | 70 | Yes |
| `content/optimizer.js` | Prompt enhancement engine with templates | 180 | Yes |
| `content/observer.js` | UI injection, MutationObserver, notifications | 250 | Yes |
| `utils/detectPlatform.js` | Platform detection and DOM manipulation | 150 | Yes |

### UI Files

| File | Purpose | Lines | Critical |
|------|---------|-------|----------|
| `ui/panel.html` | Extension popup structure | 100 | No |
| `ui/panel.css` | Extension popup styles | 200 | No |
| `ui/panel.js` | Extension popup functionality | 80 | No |

### Documentation Files

| File | Purpose | Pages | Audience |
|------|---------|-------|----------|
| `README.md` | Overview, features, usage | 4 | All users |
| `QUICKSTART.md` | Fast setup guide | 2 | New users |
| `SETUP.md` | Detailed installation | 3 | All users |
| `ARCHITECTURE.md` | Technical documentation | 8 | Developers |
| `EXAMPLES.md` | Prompt transformations | 6 | All users |
| `CHANGELOG.md` | Version history | 2 | All users |

### Utility Files

| File | Purpose | Type |
|------|---------|------|
| `icons/icon.svg` | Source icon | SVG |
| `icons/generate-icons.html` | Icon generator | HTML tool |
| `test.html` | Optimizer testing page | HTML tool |
| `.gitignore` | Git ignore rules | Config |
| `LICENSE` | MIT License | Legal |

## Verification Checklist

### Pre-Installation

- [ ] All files present (18 files total)
- [ ] No syntax errors in JavaScript files
- [ ] manifest.json is valid JSON
- [ ] All file paths are correct

### Icon Generation

- [ ] Open `icons/generate-icons.html`
- [ ] Download icon16.png
- [ ] Download icon48.png
- [ ] Download icon128.png
- [ ] Place all PNGs in `icons/` folder
- [ ] Verify icons display correctly

### Browser Installation

- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens correctly
- [ ] No console errors

### Functionality Testing

- [ ] Floating button appears on ChatGPT
- [ ] Floating button appears on Gemini
- [ ] Floating button appears on Claude
- [ ] Button click enhances prompts
- [ ] Keyboard shortcut works (Ctrl+Shift+E)
- [ ] Notifications display correctly
- [ ] Shadow DOM isolates styles
- [ ] No conflicts with platform styles

### Platform-Specific Testing

#### ChatGPT (chat.openai.com)
- [ ] Button appears on new conversation
- [ ] Button appears on existing conversation
- [ ] Textarea detection works
- [ ] Send button detection works
- [ ] Prompt injection successful
- [ ] Events trigger correctly

#### Gemini (gemini.google.com)
- [ ] Button appears on main chat
- [ ] Contenteditable detection works
- [ ] Send button detection works
- [ ] Prompt injection successful
- [ ] Events trigger correctly

#### Claude (claude.ai)
- [ ] Button appears on chat interface
- [ ] Contenteditable detection works
- [ ] Send button detection works
- [ ] Prompt injection successful
- [ ] Events trigger correctly

### Optimizer Testing

- [ ] Coding intent detected correctly
- [ ] Debugging intent detected correctly
- [ ] Explanation intent detected correctly
- [ ] Writing intent detected correctly
- [ ] Analysis intent detected correctly
- [ ] General fallback works
- [ ] Language detection works
- [ ] Templates apply correctly

### Local Testing

- [ ] `test.html` opens without errors
- [ ] Optimizer.js loads correctly
- [ ] Intent detection works
- [ ] All templates accessible
- [ ] Statistics display correctly
- [ ] Example buttons work

## File Dependencies

### Content Script Load Order

```
1. utils/detectPlatform.js    (Platform detection)
2. content/optimizer.js        (Enhancement engine)
3. content/observer.js         (UI management)
4. content/content.js          (Main orchestration)
```

**Important**: This order is defined in `manifest.json` and must be maintained.

### Module Dependencies

```
content.js
  ├── Depends on: PlatformDetector
  ├── Depends on: PromptOptimizer
  └── Depends on: UIObserver

observer.js
  ├── Depends on: PlatformDetector
  └── Depends on: PromptOptimizer

optimizer.js
  └── No dependencies (standalone)

detectPlatform.js
  └── No dependencies (standalone)
```

## File Sizes

| Category | Files | Approx. Size |
|----------|-------|--------------|
| JavaScript | 5 files | ~45 KB |
| HTML | 3 files | ~15 KB |
| CSS | 1 file | ~6 KB |
| Documentation | 7 files | ~80 KB |
| Icons | 4 files | ~50 KB (with PNGs) |
| **Total** | **20 files** | **~196 KB** |

## Minification (Optional)

For production distribution, consider minifying:

- `content/*.js` → Save ~30% size
- `ui/panel.css` → Save ~40% size
- `ui/panel.js` → Save ~25% size

**Note**: Not required for functionality, only for distribution.

## Security Checklist

- [ ] No eval() usage
- [ ] No remote script loading
- [ ] No external API calls
- [ ] No inline event handlers
- [ ] No hardcoded credentials
- [ ] Shadow DOM properly isolated
- [ ] CSP compliant
- [ ] Minimal permissions requested

## Performance Checklist

- [ ] MutationObserver properly configured
- [ ] Periodic checks not too frequent (2s interval)
- [ ] DOM queries optimized
- [ ] No memory leaks
- [ ] Event listeners properly cleaned up
- [ ] Shadow DOM minimizes reflows
- [ ] Regex patterns efficient

## Browser Compatibility

### Tested Browsers

- [ ] Chrome 88+
- [ ] Edge 88+
- [ ] Firefox 78+

### Browser-Specific Features

| Feature | Chrome/Edge | Firefox | Notes |
|---------|-------------|---------|-------|
| Manifest V3 | ✅ | ✅ | Full support |
| Shadow DOM | ✅ | ✅ | Full support |
| Content Scripts | ✅ | ✅ | Full support |
| Storage API | ✅ | ✅ | chrome.* namespace works in both |
| MutationObserver | ✅ | ✅ | Full support |

## Distribution Checklist

Before distributing:

- [ ] All icons generated
- [ ] Version number updated in manifest.json
- [ ] CHANGELOG.md updated
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] No console.log statements (or wrapped in DEBUG flag)
- [ ] Package as .zip
- [ ] Test installation from zip

## Packaging for Distribution

```bash
# Create distribution package
cd metaprompt-extension
zip -r metaprompt-v1.0.0.zip . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "test.html"
```

## Updates and Maintenance

When updating:

1. Update version in `manifest.json`
2. Add entry to `CHANGELOG.md`
3. Update documentation if needed
4. Test on all three platforms
5. Verify no breaking changes
6. Update FILE_STRUCTURE.md if files added/removed

---

**Last Updated**: 2026-01-11
**Extension Version**: 1.0.0
**File Count**: 18 core files + 3 generated icons
