# MetaPrompt Setup Guide

Complete setup instructions for installing the MetaPrompt browser extension.

## Prerequisites

- Chrome, Edge, or Firefox browser
- No additional dependencies required

## Step 1: Generate Icons

The extension requires icon files that aren't included in the repository.

1. Open `icons/generate-icons.html` in your browser
2. Click each download button (16x16, 48x48, 128x128)
3. Save the files as `icon16.png`, `icon48.png`, and `icon128.png`
4. Place them in the `icons/` folder

## Step 2: Install Extension

### For Chrome / Edge:

1. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

2. Enable **Developer mode** (toggle in the top-right corner)

3. Click **"Load unpacked"**

4. Select the `metaprompt-extension` folder

5. The extension icon should appear in your toolbar!

### For Firefox:

1. Open Firefox and navigate to: `about:debugging#/runtime/this-firefox`

2. Click **"Load Temporary Add-on"**

3. Navigate to the `metaprompt-extension` folder

4. Select the `manifest.json` file

5. The extension is now loaded (note: temporary add-ons are removed when Firefox closes)

#### For Permanent Installation in Firefox:

Firefox requires extensions to be signed for permanent installation. For development:

1. Go to `about:config`
2. Search for `xpinstall.signatures.required`
3. Set it to `false`
4. Or use [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)

## Step 3: Test the Extension

1. Navigate to one of the supported platforms:
   - [ChatGPT](https://chat.openai.com)
   - [Gemini](https://gemini.google.com)
   - [Claude](https://claude.ai)

2. You should see a floating **✨ button** in the bottom-right corner

3. Type a prompt in the input field

4. Click the ✨ button or press `Ctrl+Shift+E`

5. Your prompt should be enhanced automatically!

## Verification Checklist

- [ ] Icons generated and placed in `icons/` folder
- [ ] Extension loaded in browser
- [ ] Extension appears in toolbar
- [ ] Floating button visible on AI platforms
- [ ] Button click enhances prompts
- [ ] Keyboard shortcut works (`Ctrl+Shift+E`)
- [ ] Extension popup opens and displays correctly

## Troubleshooting

### Icons not showing in extension

- Make sure you generated all three icon sizes
- Check that files are named exactly: `icon16.png`, `icon48.png`, `icon128.png`
- Verify files are in the `icons/` folder
- Reload the extension

### Floating button not appearing

- Refresh the AI platform page
- Check that you're on a supported URL
- Open browser console (F12) and look for errors
- Try reloading the extension

### Prompt not being enhanced

- Make sure there's text in the input field
- Check that the input field is focused
- Look for notification messages
- Open browser console for error messages

### Keyboard shortcut not working

- Check if another extension uses the same shortcut
- Try the floating button instead
- On Mac, use `Cmd` instead of `Ctrl`

## Uninstallation

### Chrome / Edge:

1. Go to `chrome://extensions/` or `edge://extensions/`
2. Find MetaPrompt
3. Click **Remove**

### Firefox:

1. Go to `about:addons`
2. Find MetaPrompt
3. Click **Remove**

## Development Mode

To modify the extension:

1. Edit files in the extension folder
2. Save your changes
3. Reload the extension:
   - Chrome/Edge: Click the reload icon on the extension card
   - Firefox: Click "Reload" in `about:debugging`
4. Refresh the AI platform page

## Support

If you encounter issues:

1. Check the browser console for errors (F12)
2. Verify you're on the latest browser version
3. Try disabling other extensions temporarily
4. Review the troubleshooting section above

---

Enjoy using MetaPrompt! ✨
