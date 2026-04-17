// Shared Fingerprint Logic
// This must be IDENTICAL in both install.html and background.js

async function getDeviceFingerprint() {
    // 1. Collect Stable Hardware Signals (SW Compatible)
    const components = [
        navigator.platform,                             // OS (e.g., "Win32")
        navigator.hardwareConcurrency,                  // CPU Cores (e.g., 8)
        navigator.language,                             // Language (e.g., "en-US")
        Intl.DateTimeFormat().resolvedOptions().timeZone // Timezone (e.g., "Asia/Kolkata")
    ];

    // 2. Join them
    const fingerprintString = components.join('||');

    // 3. Hash them using SHA-256 (Web Crypto API)
    const msgBuffer = new TextEncoder().encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

// Export for Node/Extension usage if needed, but this is primarily a script file
if (typeof self !== 'undefined') {
    self.getDeviceFingerprint = getDeviceFingerprint;
}
