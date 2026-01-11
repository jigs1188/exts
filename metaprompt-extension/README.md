# MetaPrompt – AI Prompt Engineer & Optimizer

A powerful browser extension that enhances your prompts for ChatGPT, Gemini, and Claude using advanced prompt engineering techniques — **no APIs, no backend, 100% client-side**.

## ✨ Features

- **Smart Intent Detection**: Automatically identifies whether you're coding, debugging, learning, or writing
- **Template-Based Enhancement**: Applies professional prompt engineering patterns
- **Zero Configuration**: Works immediately after installation
- **Privacy First**: All processing happens locally in your browser
- **Cross-Platform**: Supports ChatGPT, Gemini, and Claude
- **Keyboard Shortcuts**: Quick enhancement with `Ctrl+Shift+E`

## 🚀 Installation

### Chrome / Edge

1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `metaprompt-extension` folder
6. The extension is now installed!

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the `metaprompt-extension` folder and select `manifest.json`
5. The extension is now installed!

## 📖 Usage

1. Navigate to ChatGPT, Gemini, or Claude
2. Type your prompt in the input field
3. Click the **✨ floating button** (bottom-right corner)
   - OR press `Ctrl+Shift+E` (Cmd+Shift+E on Mac)
4. Your prompt will be automatically enhanced and inserted!

## 🎯 Optimization Types

The extension automatically detects your intent and applies the appropriate template:

- **Coding**: Adds structure for clean code, best practices, complexity analysis
- **Debugging**: Systematic problem-solving framework
- **Explanation**: Educational approach with examples and analogies
- **Writing**: Content structure with tone and style guidance
- **Analysis**: Critical evaluation framework
- **General**: Comprehensive enhancement for any prompt

## 🔒 Privacy & Security

- **No external API calls**: Everything runs in your browser
- **No data collection**: Your prompts never leave your device
- **No tracking**: Zero analytics or telemetry
- **Open source**: Inspect the code yourself

## 🌐 Supported Platforms

- ✅ ChatGPT (chat.openai.com)
- ✅ Gemini (gemini.google.com)
- ✅ Claude (claude.ai)

## ⌨️ Keyboard Shortcuts

- `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac): Enhance current prompt

## 🛠️ Technical Details

- **Manifest Version**: 3
- **Technologies**: Vanilla JavaScript, Shadow DOM, MutationObserver
- **Architecture**: Client-side only, no external dependencies
- **Browser APIs**: Content Scripts, Storage API

## 📁 Project Structure

```
metaprompt-extension/
├── manifest.json
├── content/
│   ├── content.js       # Main initialization
│   ├── observer.js      # UI injection & management
│   └── optimizer.js     # Prompt enhancement engine
├── ui/
│   ├── panel.html       # Extension popup
│   ├── panel.css        # Popup styles
│   └── panel.js         # Popup functionality
└── utils/
    └── detectPlatform.js # Platform detection & DOM manipulation
```

## 🔧 Development

To modify or extend the extension:

1. Edit the relevant files in the project structure
2. Reload the extension in your browser:
   - Chrome/Edge: Go to `chrome://extensions/` and click the reload icon
   - Firefox: Go to `about:debugging` and click "Reload"
3. Refresh the AI platform page to see changes

## 📝 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 💡 Tips

- Start with short prompts and let MetaPrompt expand them
- The extension works best with prompts over 10 characters
- Use the keyboard shortcut for faster workflow
- Try different prompt types to see various optimization templates

## ⚠️ Troubleshooting

**Button not appearing?**
- Refresh the page
- Make sure you're on a supported platform
- Check that the extension is enabled

**Prompt not being enhanced?**
- Ensure the input field has text
- Try clicking the button again
- Check browser console for errors

**Keyboard shortcut not working?**
- Make sure no other extension is using the same shortcut
- Try clicking the floating button instead

---

Made with ✨ by browser extension engineers who love AI
