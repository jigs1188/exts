# ✨ MetaPrompt — AI Prompt Engineer & Optimizer

> **Turn any vague idea into a master-class prompt instantly. Free. Open source. No sign-up.**

MetaPrompt is a browser extension that acts as your personal Prompt Engineer. It rewrites and structures your prompts *before* you send them to ChatGPT, Claude, or Gemini — so you always get dramatically better AI responses with zero extra effort.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Works on Chrome](https://img.shields.io/badge/Chrome-✓-brightgreen)]()
[![Works on Edge](https://img.shields.io/badge/Edge-✓-brightgreen)]()
[![Works on Brave](https://img.shields.io/badge/Brave-✓-brightgreen)]()
[![Works on Firefox](https://img.shields.io/badge/Firefox-✓-orange)]()

---

## 📑 Table of Contents

- [How It Works](#-how-it-works)
- [Features](#-features)
- [Quick Start — Download & Install](#-quick-start)
- [Browser-by-Browser Install Guide](#-browser-by-browser-installation)
  - [Chrome](#-google-chrome)
  - [Microsoft Edge](#-microsoft-edge)
  - [Brave](#-brave-browser)
  - [Opera / Opera GX](#-opera--opera-gx)
  - [Firefox](#-mozilla-firefox)
  - [Safari (macOS)](#-safari-macos)
- [Setup: Gemini API Key (Optional)](#-setup-gemini-api-key-optional)
- [How to Use](#-how-to-use)
- [Prompt Techniques Guide](#-prompt-techniques-guide)
- [Model Tier Guide](#-model-tier-guide)
- [Reloading After Code Changes](#-reloading-after-code-changes-for-developers)
- [Testing Guide](#-testing-guide)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🧠 How It Works

```
You type:      "make a snake game in python"
                        ↓
MetaPrompt:    Detects intent → picks expert persona → adds structure
                        ↓
You get:       "Act as a Senior Python Game Developer with deep expertise
                in Pygame. Create a fully OOP Snake game. Requirements:
                Classes for Snake, Food, Game. Score tracking, progressive
                speed, Game Over screen. Output: complete runnable code."
```

**Two optimization modes — always works:**

| Mode | When Used | Quality |
|------|-----------|---------|
| 🤖 **AI Mode** (Gemini API) | When you add a free API key | ⭐⭐⭐⭐⭐ |
| 📋 **Local Templates** | No API key — works 100% offline | ⭐⭐⭐⭐ |

---

## ✨ Features

- **🧠 6 Prompt Techniques** — Auto, Expert Persona, Chain of Thought, Few-Shot, Zero-Shot, ReAct
- **⚙️ 4 Model Tiers** — Auto, Flash (cheapest), Pro (balanced), Latest (cutting-edge)
- **🔍 Live Model Discovery** — Detects which Gemini models are available on your API key
- **🛡️ Smart Fallback** — If a model is down or removed, silently tries the next working one
- **📴 Works Offline** — Built-in smart templates need zero internet
- **🔒 Privacy First** — Your API key never leaves your browser
- **⌨️ Keyboard Shortcut** — `Alt + Shift + P` to enhance any prompt instantly
- **♾️ Always Alive** — Dual keep-alive strategy prevents service worker sleep

---

## 🚀 Quick Start

### Step 1 — Get the Code

**Option A — Clone with Git:**
```bash
git clone https://github.com/YOUR_USERNAME/metaprompt.git
cd metaprompt
```

**Option B — Download ZIP:**
1. Click the green **`Code`** button at the top of this page
2. Click **`Download ZIP`**
3. Extract the ZIP anywhere on your computer (e.g. `C:\MetaPrompt\` or `~/MetaPrompt/`)

> [!IMPORTANT]
> The folder you need to load into the browser is **`metaprompt-extension`** (the subfolder), NOT the root repo folder.

### Step 2 — Load into Your Browser

See the full browser-specific guide below.

### Step 3 — Use It

1. Go to [chatgpt.com](https://chatgpt.com), [claude.ai](https://claude.ai), or [gemini.google.com](https://gemini.google.com)
2. Type any idea into the chat box
3. Click the **✨ floating button** (bottom-right corner) or press `Alt+Shift+P`
4. Your prompt is instantly upgraded! 🚀

---

## 🌐 Browser-by-Browser Installation

### 🟢 Google Chrome

> Versions supported: Chrome 88+

1. Open a new tab and go to: **`chrome://extensions`**
2. In the top-right corner, enable the **Developer mode** toggle
3. Click **"Load unpacked"** (appears after enabling Developer mode)
4. In the file picker, navigate to your cloned/extracted folder
5. Select the **`metaprompt-extension`** folder (not the root) → click **Select Folder**
6. MetaPrompt appears in your extensions list ✅
7. Click the puzzle icon 🧩 in the toolbar → click the 📌 pin icon next to MetaPrompt

**Verify it works:** Visit [chatgpt.com](https://chatgpt.com) — you should see the ✨ button floating at the bottom-right.

---

### 🔵 Microsoft Edge

> Versions supported: Edge 88+ (Chromium-based)

1. Open a new tab and go to: **`edge://extensions`**
2. In the bottom-left sidebar, enable the **Developer mode** toggle
3. Click **"Load unpacked"** in the top-left
4. Navigate to your folder and select the **`metaprompt-extension`** subfolder
5. Click **Select Folder** → MetaPrompt appears ✅
6. Click the puzzle icon 🧩 in the toolbar → pin MetaPrompt

**Verify it works:** Visit [chatgpt.com](https://chatgpt.com) — ✨ button should appear.

---

### 🟠 Brave Browser

> Versions supported: Brave 1.20+ (Chromium-based)

1. Open a new tab and go to: **`brave://extensions`**
2. Enable **Developer mode** toggle (top-right)
3. Click **"Load unpacked"**
4. Select the **`metaprompt-extension`** folder
5. Click **Select Folder** → MetaPrompt is loaded ✅

> **Brave Shield note:** If the ✨ button doesn't appear on some sites, click the Brave Shield 🛡️ icon in the address bar and set "Shields" to **Down** for that site. MetaPrompt doesn't need this normally, but Brave's aggressive blocking occasionally affects injected UI elements.

---

### 🔴 Opera / Opera GX

> Versions supported: Opera 74+ (Chromium-based)

1. Open a new tab and go to: **`opera://extensions`**  
   *(Opera GX: `operagx://extensions`)*
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the **`metaprompt-extension`** folder → click OK ✅

---

### 🦊 Mozilla Firefox

Firefox allows you to quickly load the extension folder just like Chrome using `about:debugging`. 

> ⚠️ **Note:** Firefox removes unpacked extensions when you restart the browser. For permanent install without restarting, you would need to build an `.xpi` file via `web-ext` and use Firefox Developer Edition, but the method below is the easiest for immediate use.

**How to load the extension directly in Firefox:**

1. Open Firefox, type this in the address bar and press **Enter**:
   ```
   about:debugging#/runtime/this-firefox
   ```
2. You will see a page titled **"This Firefox"**
3. Click the button **"Load Temporary Add-on..."**
4. A file picker opens — navigate to where you cloned/extracted the repo
5. Open the **`metaprompt-extension`** folder
6. Click on the file **`manifest.json`** to select it *(the file, not the folder)*
7. Click **Open**
8. ✅ MetaPrompt appears in the list and is ready to use!

---

## 🔄 Applying Changes (Reloading)

If you modify the source code, change settings that seem stuck, or the extension hits a rate limit glitch, you must do two things:

1. **Reload the Extension**: Go to your browser's extensions page (`chrome://extensions` or `about:debugging`) and click the **Reload 🔄** icon next to MetaPrompt.
2. **Refresh the AI Chat Page (CRITICAL)**: Go to your open ChatGPT / Claude / Gemini tab and press **`Ctrl + R`** (or `Cmd + R` on Mac). 
   - *Why?* Browsers do not automatically update the code injected into already-open web pages. If you don't refresh the page, you will still be using the old, pre-reload version of the extension on that specific tab!

---

## 🔔 Staying Updated

Since this is an open-source project, new AI models, prompt techniques, and bug fixes are pushed to the GitHub repository directly.

**How to get notified of updates:**
1. Go to the MetaPrompt GitHub Repository page.
2. In the top right corner, click the **Watch 👁️** button.
3. Select **"Custom"** -> check **"Releases"** (to only get notified of major updates) OR select **"All Activity"** to get an email whenever code changes.
4. When an update drops, simply run `git pull` (or download the ZIP again) and reload the extension in your browser!

### 🧭 Safari (macOS)

> Requires: macOS 12+, Xcode 14+, Safari 15+

Safari requires converting the extension to a native Mac app. This is a one-time process.

**Prerequisites:** Install [Xcode](https://developer.apple.com/xcode/) from the App Store.

```bash
# Convert the extension to a Safari extension project
xcrun safari-web-extension-converter /path/to/metaprompt-extension --project-location ~/Desktop

# Example with actual path:
xcrun safari-web-extension-converter ~/Downloads/metaprompt/metaprompt-extension --project-location ~/Desktop
```

Then:
1. Xcode opens automatically with the generated project
2. Click the **▶ Run** button in Xcode (builds the app)
3. Open **Safari** → **Safari menu → Settings → Extensions**
4. Enable **MetaPrompt** in the list ✅
5. If you don't see it: Safari menu → **Develop → Allow Unsigned Extensions** (requires Developer menu enabled in Settings → Advanced)

---

## 🔑 Setup: Gemini API Key (Optional)

MetaPrompt works without an API key using built-in local templates. For AI-powered optimization:

### Get a Free API Key

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"** → select any project (or create new)
4. Copy the key (starts with `AIza...`)

### Add Key to MetaPrompt

1. Click the **✨ MetaPrompt icon** in your browser toolbar
2. Paste your key into the **"Gemini API Key"** field
3. Click **💾 Save Key**
4. Optionally click **🔍 Check My Available Models** to see which models work on your key

> 🔒 **Privacy:** Your key is stored in `chrome.storage.sync` (local browser storage). It is sent **only** to `generativelanguage.googleapis.com` (Google's official Gemini API). Never to any third-party server.

> 💡 **Free tier limits:** The free Gemini API tier has generous limits — typically 15 requests/minute and 1 million tokens/day with `gemini-1.5-flash`. MetaPrompt uses ~200-500 tokens per optimization.

---

## 💡 How to Use

### Method 1 — Floating Button (Recommended)

1. Open any supported AI chat site
2. Type your raw idea in the input box: *`"build a todo app"`*
3. Click the **✨ purple floating button** at the bottom-right corner of the page
4. Your prompt is enhanced and automatically placed back in the input box
5. Press Enter to send the improved prompt to the AI

### Method 2 — Keyboard Shortcut

While the cursor is in the AI chat input box:
- Press **`Alt + Shift + P`**
- The prompt is optimized instantly

### Method 3 — Extension Popup

1. Click the ✨ icon in the toolbar to open the popup
2. Change your **Technique** or **Model Tier**
3. Return to the chat and click the floating button

---

## 🧠 Prompt Techniques Guide

Open the popup and choose how you want your prompt structured:

| Technique | Icon | Best For | Example Output Style |
|-----------|------|----------|---------------------|
| **Auto** | 🤖 | Everything — safest default | Gemini picks the best technique per prompt |
| **Expert Persona** | 🎭 | Domain-specific tasks | *"Act as a Senior Python Game Developer..."* |
| **Chain of Thought** | 🧠 | Math, logic, debugging | *"Think through this step by step. Stage 1: ..."* |
| **Few-Shot** | 📋 | Creative, format-specific output | *"Example 1: [input] → [output]... Now: ..."* |
| **Zero-Shot** | ⚡ | Simple, fast, direct tasks | *"Role: ... Task: ... Constraints: ... Format: ..."* |
| **ReAct** | 🔄 | Research, planning, investigation | *"Thought: ... Action: ... Observation: ..."* |

**Which to use?**
- 🤖 **Auto** — when unsure, this is always a great pick
- 🧠 **Chain of Thought** — `"why does this code fail"`, `"solve this math problem"`
- 📋 **Few-Shot** — `"write an email in this style"`, `"generate data in this format"`
- 🎭 **Expert Persona** — `"build a REST API"`, `"write a blog post about AI"`
- ⚡ **Zero-Shot** — `"summarize this"`, `"translate to French"`
- 🔄 **ReAct** — `"research and plan a marketing strategy"`, `"debug this step by step"`

---

## ⚙️ Model Tier Guide

| Tier | Icon | Models Used | Cost | Quality | Best For |
|------|------|-------------|------|---------|----------|
| **Auto** | 🔄 | Best → stable, in order | Varies | ⭐⭐⭐⭐⭐ | Recommended default |
| **Flash** | ⚡ | gemini-2.0-flash → 1.5-flash | Lowest | ⭐⭐⭐⭐ | Everyday use, fast responses |
| **Pro** | 🧠 | gemini-1.5-pro → 1.5-pro-latest | Medium | ⭐⭐⭐⭐⭐ | Complex prompts, better reasoning |
| **Latest** | 🚀 | gemini-2.5-flash-preview → 2.5-pro | Highest | ⭐⭐⭐⭐⭐+ | Cutting-edge, may not exist on free tier |

**Fallback behavior:** Each tier has an ordered list of models. If the first model is unavailable (deprecated, not on your plan, etc.), MetaPrompt **silently** tries the next one. You always get a result.

### Check Your Available Models

1. Add your API key → click **🔍 Check My Available Models** in the popup
2. Each model shows ✅ Available or ❌ Not found
3. Results are **cached for 24 hours** (click the button again to force a recheck)
4. Use this to decide which tier makes sense for your API key

---

## 🔄 Reloading After Code Changes (For Developers)

When you edit any extension file, you need to reload the extension AND the target page.

### Chrome / Edge / Brave / Opera

#### After changing `background.js` or `manifest.json`:
```
chrome://extensions → find MetaPrompt → click the 🔄 Reload icon
```
Then refresh the AI chat page (Ctrl+R / Cmd+R).

#### After changing `content/*.js` or `utils/*.js`:
Just **refresh the AI chat page** (Ctrl+R). Content scripts reload with the page.

#### After changing `ui/panel.html`, `panel.css`, or `panel.js`:
Just **close and reopen the popup** — no reload needed.

#### After changing `manifest.json` (permissions, scripts):
Must reload extension AND refresh all open tabs.

#### Quick Reload Shortcut

You can also add a bookmark with this JavaScript to reload instantly:
```
javascript:chrome.runtime.reload()
```

Or use the **Extensions Reloader** Chrome extension for one-click reloads.

---

### Firefox (web-ext)

If you started Firefox with `web-ext run`, it **auto-reloads** on every file save. No manual action needed.

If you installed manually:
1. Go to `about:debugging#/runtime/this-firefox`
2. Find MetaPrompt → click **Reload**
3. Refresh the AI chat tab

---

### Safari (macOS)

1. Make your code changes
2. In Xcode → click **▶ Run** again to rebuild
3. Safari will prompt to reload the extension

---

## 🧪 Testing Guide

### ✅ Quick Sanity Check (No API Key Required)

1. Install the extension in your browser
2. Open [chatgpt.com](https://chatgpt.com) (or claude.ai, gemini.google.com)
3. Look for the **✨ purple button** in the bottom-right corner — if it's there, the extension loaded ✅
4. Type `"explain recursion"` in the chat box
5. Click the ✨ button
6. The text should transform into a structured, expert-level prompt ✅

---

### 🧠 Testing Techniques

For each technique below, type the same prompt and switch techniques between tests:

**Test prompt:** `"write a function to find prime numbers"`

| Technique | What to check in output |
|-----------|------------------------|
| Auto | Smart structure — likely Expert Persona or Zero-Shot |
| Expert Persona | Starts with *"Act as a Senior Software Engineer..."* |
| Chain of Thought | Contains numbered reasoning steps |
| Few-Shot | Contains 2-3 examples before the actual ask |
| Zero-Shot | Contains labeled sections: Role, Task, Constraints, Format |
| ReAct | Contains Thought → Action → Observation structure |

**How to test:**
1. Open popup → select technique
2. Go to chat site → type the test prompt → click ✨
3. Check the output matches the expected structure
4. Repeat for each technique

---

### ⚙️ Testing Model Tiers (API Key Required)

1. Add your Gemini API key in the popup
2. Click **🔍 Check My Available Models** → wait ~10 seconds
3. Note which models are ✅ available

**Test each tier:**
```
Prompt: "explain machine learning in simple terms"

Flash tier  → Should complete in ~2-3 seconds
Pro tier    → May take 3-5 seconds but more detailed output  
Latest tier → May fail to first model, falls back silently
Auto tier   → Should always work (widest fallback chain)
```

**Verify fallback works:**
1. Select **Latest** tier
2. Optimize any prompt
3. Open the browser console (F12 → Console tab)
4. Look for: `[MetaPrompt] Trying gemini-2.5-flash-preview-04-17`
5. If that model fails: `[MetaPrompt] gemini-2.5-flash-preview-04-17 unavailable (404). Trying next...`
6. Then it tries the next model automatically ✅

---

### 🔍 Testing Model Discovery

1. Add your API key
2. Open the popup → click **🔍 Check My Available Models**
3. You should see a spinner/loading message
4. After ~10 seconds, each model shows ✅ or ❌
5. **Close the popup and reopen it** → results load instantly from cache (no API call)
6. The hint says "Last checked: X min ago · Cached 24h" ✅
7. After 24 hours, results expire and the next check re-pings the API

---

### 🛑 Testing Without API Key (Offline Fallback)

1. Clear any saved API key (popup → 🗑️ Clear)
2. Optimize any prompt → should still work using local templates
3. The result won't use the selected Technique or Model (those require the API)
4. A structured, useful prompt is still produced ✅

---

### 📋 Full Test Checklist

```
SETUP
[ ] Extension loads without errors in chrome://extensions
[ ] ✨ floating button appears on chatgpt.com
[ ] ✨ floating button appears on claude.ai
[ ] ✨ floating button appears on gemini.google.com
[ ] Popup opens when clicking the toolbar icon
[ ] Popup shows Technique Picker (6 chips)
[ ] Popup shows Model Tier Picker (4 cards)

WITHOUT API KEY
[ ] Prompt optimization works (uses local templates)
[ ] Alt+Shift+P keyboard shortcut works
[ ] No error messages appear

WITH API KEY
[ ] API key saves and persists after popup close
[ ] API key clears with Clear button
[ ] "Check My Models" button works and shows results
[ ] Model discovery results persist after popup close/reopen
[ ] Flash tier produces a result
[ ] Pro tier produces a result
[ ] Latest tier falls back gracefully if model unavailable
[ ] Auto technique works
[ ] Expert Persona technique produces "Act as..." style output
[ ] Chain of Thought produces step-by-step structure
[ ] Few-Shot produces examples before the task
[ ] Zero-Shot produces Role/Task/Constraints/Format sections
[ ] ReAct produces Thought/Action/Observation structure

PERSISTENCE
[ ] Selected technique is remembered after popup close
[ ] Selected model tier is remembered after popup close
[ ] Stats (enhancement count) increase after each use
```

---

## 📁 Project Structure

```
metaprompt/                          ← Root repo (clone this)
│
├── README.md                        ← This file
├── .gitignore
│
└── metaprompt-extension/            ← ⬅ LOAD THIS FOLDER in your browser
    │
    ├── manifest.json                ← Extension config (MV3)
    ├── background.js                ← Service worker: Gemini API + keep-alive
    ├── LICENSE
    ├── README.md
    │
    ├── icons/
    │   ├── icon16.png
    │   ├── icon48.png
    │   └── icon128.png
    │
    ├── content/
    │   ├── content.js               ← Page init + keyboard shortcut
    │   ├── observer.js              ← Floating button injection + notifications
    │   └── optimizer.js             ← Local templates + API call dispatcher
    │
    ├── utils/
    │   └── detectPlatform.js        ← ChatGPT/Gemini/Claude detection & text I/O
    │
    └── ui/
        ├── panel.html               ← Extension popup UI
        ├── panel.css                ← Popup styles
        └── panel.js                 ← Popup logic (API key, technique, model, discovery)
```

**Storage keys used (all local, never transmitted):**

| Key | Type | Purpose |
|-----|------|---------|
| `geminiApiKey` | `sync` | Your Gemini API key |
| `selectedTechnique` | `sync` | Chosen prompt technique |
| `selectedModel` | `sync` | Chosen model tier |
| `enhanceCount` | `local` | Total enhancements counter |
| `lastUsed` | `local` | Timestamp of last use |
| `modelAvailability` | `local` | Cached model discovery results |
| `modelCheckTimestamp` | `local` | When the last check was run |

---

## ❓ Troubleshooting

### The ✨ button doesn't appear
- Make sure you're on a supported URL: `chatgpt.com`, `claude.ai`, or `gemini.google.com`
- Reload the page (Ctrl+R)
- Check `chrome://extensions` — ensure MetaPrompt is **enabled** (toggle is blue)
- If the button still doesn't appear: disable/enable the extension, then reload the page

### "Optimization failed" or API error
- Verify your API key is correct (check [AI Studio](https://aistudio.google.com/app/apikey))
- Your key may have hit the free tier rate limit — wait 1 minute and try again
- The extension falls back to local templates automatically — you still get a result

### The text doesn't appear in the chat box after optimization
- Click **inside** the chat input box first, then click ✨
- Some pages re-render the input — the text may appear briefly then disappear; type a character in the box to stabilize it

### "Receiving end does not exist" error
- The service worker went to sleep between your browser session and the next day
- Just click ✨ a **second time** — it reconnects automatically
- This should be rare since we use dual keep-alive (alarm heartbeat + port connection)

### Firefox: Extension disappears after browser restart
- Use `web-ext build` and install the `.xpi` file permanently (see Firefox section above)
- Or enable `xpinstall.signatures.required = false` in `about:config`

### Safari: Extension not showing in Safari settings
- Make sure you clicked **Develop → Allow Unsigned Extensions** in Safari's menu bar
- If Develop menu is missing: Safari → Settings → Advanced → check "Show Develop menu"

### Latest model tier doesn't work
- Check **🔍 Check My Available Models** — the 2.5 preview models may show ❌
- Switch to **Flash** or **Auto** tier — those use stable, widely available models

---

## 🤝 Contributing

Pull requests are welcome! Areas especially needing help:
- 🌍 Adding support for new AI platforms (Perplexity, Mistral, Grok, etc.)
- 🧠 Improving prompt templates for specific domains
- 🌐 Internationalization (non-English prompts)
- 🧪 Writing automated tests with `web-ext`

**To contribute:**
1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes in `metaprompt-extension/`
4. Test in at least Chrome and Firefox
5. Submit a pull request

---

## 📄 License

MIT License — see [LICENSE](metaprompt-extension/LICENSE) for details.

Free to use, modify, fork, and distribute. No attribution required (but appreciated!).

---

**Built with ❤️ for the AI community. Star ⭐ the repo if MetaPrompt helps you!**
