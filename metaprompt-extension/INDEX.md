# MetaPrompt - Complete Extension Package

**Version**: 1.0.0
**Type**: Browser Extension (Chrome, Edge, Firefox)
**License**: MIT
**API Requirements**: None (100% client-side)

---

## Quick Navigation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [QUICKSTART.md](QUICKSTART.md) | Get running in 5 minutes | 3 min |
| [README.md](README.md) | Full overview and features | 10 min |
| [SETUP.md](SETUP.md) | Detailed installation guide | 8 min |
| [EXAMPLES.md](EXAMPLES.md) | See prompt transformations | 15 min |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical deep dive | 30 min |

---

## What is MetaPrompt?

A browser extension that enhances your AI prompts using professional prompt engineering techniques. Works with ChatGPT, Gemini, and Claude.

### Key Features

✅ No API keys required
✅ 100% free forever
✅ Privacy-first (client-side only)
✅ Smart intent detection
✅ Professional templates
✅ Cross-browser compatible

---

## Getting Started

### 1. Generate Icons (Required)

```
Open: icons/generate-icons.html
Download: icon16.png, icon48.png, icon128.png
Place in: icons/ folder
```

### 2. Install Extension

**Chrome/Edge:**
1. `chrome://extensions/` → Developer mode ON
2. Load unpacked → Select folder

**Firefox:**
1. `about:debugging#/runtime/this-firefox`
2. Load Temporary Add-on → Select manifest.json

### 3. Test It

Visit [ChatGPT](https://chat.openai.com), type a prompt, click the ✨ button!

---

## Complete File Reference

### 📋 Essential Documentation

| File | Description | When to Read |
|------|-------------|--------------|
| **README.md** | Overview, features, installation | Start here |
| **QUICKSTART.md** | 5-minute setup guide | Want to start fast |
| **SETUP.md** | Detailed setup instructions | Need help installing |
| **EXAMPLES.md** | Before/after prompt examples | Want to see results |
| **ARCHITECTURE.md** | Technical documentation | Building/modifying |
| **CHANGELOG.md** | Version history | Checking updates |
| **FILE_STRUCTURE.md** | File organization | Understanding structure |
| **INDEX.md** | This file | Quick reference |

### 🔧 Core Extension Files

| File | Description | Modify? |
|------|-------------|---------|
| **manifest.json** | Extension configuration | Rarely |
| **content/content.js** | Main initialization | Rarely |
| **content/optimizer.js** | Prompt templates | Often |
| **content/observer.js** | UI management | Rarely |
| **utils/detectPlatform.js** | Platform detection | When platforms update |

### 🎨 UI Files

| File | Description | Modify? |
|------|-------------|---------|
| **ui/panel.html** | Popup structure | Often |
| **ui/panel.css** | Popup styles | Often |
| **ui/panel.js** | Popup logic | Sometimes |

### 🛠 Utility Files

| File | Description | Use Case |
|------|-------------|----------|
| **test.html** | Test optimizer locally | Development |
| **icons/generate-icons.html** | Create PNG icons | Setup |
| **icons/icon.svg** | Source icon | Customization |

### 📁 Generated Files (Not Included)

| File | Generate From | Required? |
|------|---------------|-----------|
| **icons/icon16.png** | generate-icons.html | Yes |
| **icons/icon48.png** | generate-icons.html | Yes |
| **icons/icon128.png** | generate-icons.html | Yes |

---

## Common Tasks

### I Want To...

**Start using the extension**
→ Read: [QUICKSTART.md](QUICKSTART.md)

**Understand how it works**
→ Read: [ARCHITECTURE.md](ARCHITECTURE.md)

**See example transformations**
→ Read: [EXAMPLES.md](EXAMPLES.md)

**Customize prompt templates**
→ Edit: `content/optimizer.js`

**Change the UI appearance**
→ Edit: `ui/panel.css` and `content/observer.js` (Shadow DOM styles)

**Add a new AI platform**
→ Edit: `utils/detectPlatform.js` and `manifest.json`

**Debug issues**
→ Check: Browser console (F12) and [SETUP.md](SETUP.md) troubleshooting

**Test without installing**
→ Open: `test.html` in browser

**Distribute to others**
→ Follow: [FILE_STRUCTURE.md](FILE_STRUCTURE.md) packaging section

---

## Feature Breakdown

### Supported Platforms

| Platform | URL | Status | Notes |
|----------|-----|--------|-------|
| ChatGPT | chat.openai.com | ✅ Full | GPT-3.5, GPT-4 |
| Gemini | gemini.google.com | ✅ Full | Standard, Advanced |
| Claude | claude.ai | ✅ Full | Claude 2, Claude 3 |

### Intent Detection Types

| Type | Trigger Words | Template |
|------|---------------|----------|
| Coding | write, create, function, code | Software engineering best practices |
| Debugging | debug, fix, error, broken | Systematic debugging approach |
| Explanation | explain, what is, how does | Educational framework |
| Writing | write, blog, email, essay | Writing guidelines |
| Analysis | analyze, compare, evaluate | Critical analysis framework |
| General | (any other) | Comprehensive assistant |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+E` | Enhance prompt (Windows/Linux) |
| `Cmd+Shift+E` | Enhance prompt (Mac) |

---

## Technical Specifications

### Requirements

- **Browser**: Chrome 88+, Edge 88+, or Firefox 78+
- **Manifest**: V3
- **Dependencies**: None
- **API Keys**: Not required
- **Backend**: None
- **Internet**: Only for loading AI platforms

### Architecture

```
User types prompt
       ↓
Clicks ✨ button or Ctrl+Shift+E
       ↓
Platform Detector reads textarea
       ↓
Optimizer detects intent
       ↓
Optimizer applies template
       ↓
Platform Detector injects enhanced prompt
       ↓
User sees optimized prompt ready to send
```

### Privacy

- ✅ No external API calls
- ✅ No data collection
- ✅ No telemetry
- ✅ No tracking
- ✅ 100% client-side processing

### Performance

- Load time: < 100ms
- Enhancement time: < 50ms
- Memory usage: < 5MB
- DOM impact: Minimal (Shadow DOM)

---

## Customization Guide

### Modify Templates

Edit `content/optimizer.js`:

```javascript
templates: {
  yourIntent: {
    pattern: /your|keywords/i,
    transform: (prompt) => `Your custom template`
  }
}
```

### Change Button Style

Edit `content/observer.js` Shadow DOM styles:

```javascript
.metaprompt-button {
  background: your-gradient;
  // your styles
}
```

### Add Platform Support

1. Edit `utils/detectPlatform.js` - Add platform detection
2. Edit `manifest.json` - Add host permission
3. Test thoroughly

### Customize Popup

Edit `ui/panel.html` and `ui/panel.css` to match your branding.

---

## Troubleshooting Quick Reference

| Issue | Solution | File |
|-------|----------|------|
| Button not appearing | Check platform selectors | detectPlatform.js |
| Enhancement not working | Check event dispatching | detectPlatform.js |
| Popup not opening | Check manifest permissions | manifest.json |
| Icons not showing | Generate PNG files | generate-icons.html |
| Keyboard shortcut conflict | Check browser extensions | - |
| Platform UI changed | Update selectors | detectPlatform.js |

Detailed troubleshooting: [SETUP.md](SETUP.md)

---

## Development Workflow

### Setup Development Environment

```bash
# Clone/download the extension
cd metaprompt-extension

# Generate icons
open icons/generate-icons.html

# Load in browser
# Chrome: chrome://extensions/ → Load unpacked
# Firefox: about:debugging → Load Temporary Add-on
```

### Make Changes

1. Edit relevant files
2. Save changes
3. Reload extension in browser
4. Refresh AI platform page
5. Test changes

### Test Changes

```bash
# Test optimizer locally
open test.html

# Test on platforms
# - ChatGPT: chat.openai.com
# - Gemini: gemini.google.com
# - Claude: claude.ai
```

### Debug Issues

1. Open browser console (F12)
2. Look for `[MetaPrompt]` logs
3. Check for JavaScript errors
4. Verify DOM selectors still match

---

## Contributing

Want to improve MetaPrompt?

1. **Report bugs**: Open an issue with details
2. **Suggest features**: Describe use case
3. **Submit templates**: Share your custom templates
4. **Improve docs**: Fix typos, add examples
5. **Add platforms**: Support more AI services

See [README.md](README.md) for contribution guidelines.

---

## Distribution

### For Personal Use

Just install directly from the folder.

### For Sharing

```bash
# Create zip package
zip -r metaprompt-v1.0.0.zip metaprompt-extension/
```

Include instructions: [QUICKSTART.md](QUICKSTART.md)

### For Chrome Web Store

1. Follow [Chrome Web Store Developer Guide](https://developer.chrome.com/docs/webstore/publish/)
2. Package extension
3. Submit for review
4. Wait for approval

### For Firefox Add-ons

1. Follow [Firefox Extension Guide](https://extensionworkshop.com/documentation/publish/)
2. Package extension
3. Submit for review
4. Wait for approval

---

## Version History

- **v1.0.0** (2026-01-11) - Initial release

See [CHANGELOG.md](CHANGELOG.md) for details.

---

## Support

- **Documentation**: Read relevant .md files above
- **Issues**: Check troubleshooting sections
- **Questions**: Review [ARCHITECTURE.md](ARCHITECTURE.md)
- **Examples**: See [EXAMPLES.md](EXAMPLES.md)

---

## License

MIT License - See [LICENSE](LICENSE) file

Free to use, modify, and distribute.

---

## Quick Stats

- **Total Files**: 18 core + 3 generated
- **Code Files**: 5 JavaScript files
- **Documentation**: 8 markdown files
- **Total Size**: ~196 KB
- **Setup Time**: 5 minutes
- **Learning Curve**: Beginner-friendly

---

## Project Status

✅ Production Ready
✅ Fully Functional
✅ Well Documented
✅ No Dependencies
✅ Cross-Browser Compatible

---

**Made with ✨ for better AI conversations**

For questions or improvements, see [README.md](README.md)
