# ✨ MetaPrompt — AI Prompt Engineer & Optimizer

> Transform any vague idea into a master-class prompt. Free. Open source. No sign-up.

---

## ⚡ Quick Install (2 Minutes)

### Chrome / Edge / Brave / Opera
1. Open your extensions page:
   - Chrome → `chrome://extensions`
   - Edge → `edge://extensions`
   - Brave → `brave://extensions`
   - Opera → `opera://extensions`
2. Enable **Developer Mode** (toggle, top-right)
3. Click **Load unpacked**
4. Select **this `metaprompt-extension` folder**
5. Done! Pin the ✨ icon in your toolbar.

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select the **`manifest.json`** file inside this folder

> For a permanent Firefox install (survives restarts):
> ```bash
> npm install -g web-ext
> web-ext build   # creates a .xpi in web-ext-artifacts/
> ```
> Then install the `.xpi` via `about:addons` → gear icon → Install Add-on From File.

### Safari (macOS)
```bash
xcrun safari-web-extension-converter /path/to/metaprompt-extension
```
Open the generated Xcode project → Run → enable in Safari Settings → Extensions.

---

## 🔑 Optional: Gemini API Key (Free)

Without a key, smart local templates are used. For AI-powered optimization:

1. Get a free key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click the ✨ toolbar icon → paste key → **Save Key**
3. Optionally click **🔍 Check My Available Models** to see which models work

---

## 💡 How to Use

1. Go to **chatgpt.com**, **claude.ai**, or **gemini.google.com**
2. Type any idea in the chat box
3. Click the **✨ floating button** (bottom-right) OR press `Alt+Shift+P`
4. Your prompt is instantly upgraded and ready to send!

---

## 🧠 Prompt Techniques

Choose in the popup how to structure your enhanced prompt:

| Technique | Best For |
|-----------|---------|
| 🤖 **Auto** | Gemini picks the best technique automatically (recommended) |
| 🎭 **Expert Persona** | Domain-specific expert role derivation |
| 🧠 **Chain of Thought** | Logic, math, step-by-step reasoning |
| 📋 **Few-Shot** | Format-specific or creative structured output |
| ⚡ **Zero-Shot** | Clean, fast, structured direct instructions |
| 🔄 **ReAct** | Research and multi-step planning tasks |

---

## ⚙️ Model Tiers

| Tier | Speed | Cost | Use When |
|------|-------|------|----------|
| 🔄 **Auto** | Fast | Low | Best default — tries best, falls back gracefully |
| ⚡ **Flash** | Fastest | Lowest | Everyday use |
| 🧠 **Pro** | Medium | Medium | Complex prompts needing deeper reasoning |
| 🚀 **Latest** | Varies | Highest | Cutting-edge models (may need paid API plan) |

Each tier has **ordered fallbacks** — if a model is unavailable, the next one is tried automatically.

---

## 🔄 Reloading After Code Changes

**Changed `background.js` or `manifest.json`:**
→ `chrome://extensions` → click 🔄 Reload on MetaPrompt → refresh the AI chat page

**Changed `content/*.js` or `utils/*.js`:**
→ Just refresh the AI chat page (Ctrl+R)

**Changed `ui/panel.*`:**
→ Just close and reopen the popup — no reload needed

---

## 🧪 Quick Test

1. Visit [chatgpt.com](https://chatgpt.com)
2. Type: `explain recursion`
3. Click the ✨ purple floating button (bottom-right)
4. You should see a structured, expert-level prompt appear ✅

For the full test guide including all techniques and model tiers → see the **[root README](../README.md)**.

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| ✨ button missing | Reload the page; check extension is enabled |
| API error | Verify key at [AI Studio](https://aistudio.google.com/app/apikey); falls back to templates |
| Text doesn't inject | Click inside the chat box first, then click ✨ |
| "Receiving end" error | Click ✨ a second time — service worker reconnects |
| Firefox disappears on restart | Use `web-ext build` for permanent install |

---

## 📄 License

MIT — Free to use, fork, and modify.

**Star ⭐ the repo if this helps you!**
