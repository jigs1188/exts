# ✨ MetaPrompt – The AI Prompt Engineer

> **Transform vague thoughts into master-class prompts instantly.**

MetaPrompt is a powerful browser extension that acts as your personal Prompt Engineer. It uses Google's advanced **Gemini AI models** to rewrite, structure, and optimize your prompts *before* you send them to ChatGPT, Claude, or Gemini.

![MetaPrompt Demo](https://via.placeholder.com/800x400?text=MetaPrompt+in+Action)

## 🚀 Why MetaPrompt?

Most AI responses are only as good as the prompt you give them. MetaPrompt fixes this by automatically applying "Prompt Engineering" best practices:

*   **⚡ AI-Powered Optimization**: Uses the latest **Gemini 1.5 Flash / Pro** models to rewrite your text.
*   **🛡️ Robust Fallback System**: No internet? API Limit reached? No problem. It instantly switches to built-in "Expert Templates".
*   **🌐 Cross-Platform**: Works seamlessly on **ChatGPT**, **Google Gemini**, and **Claude.ai**.
*   **🔌 Smart Injection**: Intelligently detects input boxes and injects the improved prompt without breaking the page's React/JS event listeners.

---

## 📥 Installation

### 1. Chromium Browsers (Chrome, Brave, Edge, Opera)
1.  Download or Clone this repository.
2.  Open your extensions page:
    *   **Chrome/Brave:** `chrome://extensions`
    *   **Edge:** `edge://extensions`
    *   **Opera:** `opera://extensions`
3.  Enable **"Developer mode"** (usually a toggle in the top right).
4.  Click **"Load unpacked"**.
5.  Select the `metaprompt-extension` folder.

### 2. Firefox
1.  Open `about:debugging#/runtime/this-firefox`.
2.  Click **"Load Temporary Add-on..."**.
3.  Select the `manifest.json` file from the `metaprompt-extension` folder.

### 3. Safari (macOS)
Safari requires converting the extension to a native Mac app.
1.  Open Terminal.
2.  Run: `xcrun safari-web-extension-converter /path/to/metaprompt-extension`
3.  Open the generated Xcode project and Run it.
*(Note: This requires Xcode installed).*

---

## 🔑 Setup

MetaPrompt uses the **Google Gemini API** (which is currently free for most users) to power its intelligence.

1.  **Get your Key**: Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API Key.
2.  **Open Extension**: Click the **MetaPrompt Icon** <img src="icons/icon16.png" height="12"/> in your browser toolbar.
3.  **Save Key**: Paste your key into the "API Key" field and click **Save**.

> **Note:** Your API Key is stored locally in your browser's secure storage. It is never sent to any third-party server other than Google's official API.

---

## 💡 How to Use

1.  **Open your favorite AI chat** (e.g., [chatgpt.com](https://chatgpt.com)).
2.  **Type a basic idea**:
    > *make a snake game in python*
3.  **Click the MetaPrompt Button** floating near the text box (or press the extension shortcut).
4.  **Watch the Magic**:
    The text will instantly transform into:
    > *Act as a Senior Python Developer. Create a fully functional Snake game using the Pygame library. The code should be object-oriented, clean, and well-commented. Include a main game loop, score tracking, and smooth controls. Explain the key logic blocks briefly.*

---

## 🛠️ Auto-Model Discovery

MetaPrompt is "Future-Proof". It automatically scans for the best available model for your account, in this order:
1.  `gemini-3-flash-preview` (If available)
2.  `gemini-2.0-flash-exp` (Latest Experimental)
3.  `gemini-1.5-flash` (Fast & Stable)
4.  `gemini-1.5-pro` (High Reasoning)

If one fails, it silently retries the next one until it works.

---

## ❓ Troubleshooting

*   **"API connection failed..."**: Check your internet. If the API is down, the extension successfully used a local template instead.
*   **"Receiving end does not exist"**: The background script went into sleep mode. Just click again, or reload the page. The extension has logic to wake itself up.
*   **Text not showing up?**: We use a "Nuclear" injection method for stubborn sites. If it looks like it didn't type, try clicking inside the box or pressing a key.

---

**Built with ❤️ for the AI Community.**
