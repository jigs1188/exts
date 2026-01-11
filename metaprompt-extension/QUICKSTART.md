# Quick Start Guide

Get MetaPrompt running in under 5 minutes.

## 1. Generate Icons (1 minute)

```bash
# Open the icon generator
open icons/generate-icons.html
```

Click all three download buttons and save files in the `icons/` folder.

## 2. Install Extension (1 minute)

### Chrome/Edge:
1. Go to `chrome://extensions/`
2. Toggle "Developer mode" ON
3. Click "Load unpacked"
4. Select `metaprompt-extension` folder

### Firefox:
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from `metaprompt-extension` folder

## 3. Test It (2 minutes)

1. Open [ChatGPT](https://chat.openai.com)
2. Look for the ✨ floating button (bottom-right)
3. Type: `write a function to reverse a string`
4. Click the ✨ button
5. Watch your prompt transform!

## 4. Try Different Platforms

- [ChatGPT](https://chat.openai.com) - Works immediately
- [Gemini](https://gemini.google.com) - Works immediately
- [Claude](https://claude.ai) - Works immediately

## Keyboard Shortcut

Press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac) to enhance without clicking!

## Test the Optimizer Locally

Open `test.html` in your browser to experiment with the enhancement engine without loading the extension.

## Common First-Time Issues

**No floating button?**
- Refresh the page
- Check you're on the correct URL
- Verify extension is enabled

**Button not working?**
- Make sure there's text in the input
- Check browser console (F12) for errors

**Wrong platform?**
- Only works on chat.openai.com, gemini.google.com, claude.ai
- Won't work on docs/settings pages

## What to Try

Enhance these prompts to see different templates:

1. **Coding**: "create a REST API"
2. **Debugging**: "fix my null pointer exception"
3. **Learning**: "explain how neural networks work"
4. **Writing**: "write a blog post about productivity"
5. **Analysis**: "compare Python vs JavaScript"

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed instructions
- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand how it works
- Customize templates in `content/optimizer.js`

---

Need help? Check the [README.md](README.md) for full documentation.
