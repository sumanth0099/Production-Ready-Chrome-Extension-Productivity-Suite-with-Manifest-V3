// Background Service Worker - Productivity Suite Extension

// --- Context Menu Setup ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-to-notes',
    title: 'Save to Productivity Notes',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'save-to-notes' && info.selectionText) {
    chrome.storage.local.get(['notes'], (result) => {
      const existing = result.notes || '';
      const updated = existing + '\n' + info.selectionText;
      chrome.storage.local.set({ notes: updated });
    });
  }
});

// --- Keyboard Shortcuts ---
chrome.commands.onCommand.addListener((command) => {
  if (command === 'save-session') {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const urls = tabs.map((tab) => tab.url);
      const sessionName = 'quick-save-' + Date.now();
      chrome.storage.local.get(['sessions'], (result) => {
        const sessions = result.sessions || {};
        sessions[sessionName] = urls;
        chrome.storage.local.set({ sessions });
      });
    });
  }
});

// --- Website Blocker ---
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      try {
        const url = new URL(tab.url);
        const hostname = url.hostname.replace('www.', '');
        const isBlocked = blockedSites.some(
          (site) => hostname === site || hostname.endsWith('.' + site)
        );
        if (isBlocked) {
          chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              document.open();
              document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Page Blocked</title>
  <style>
    body {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #0f0f1a;
      font-family: 'Segoe UI', sans-serif;
      color: #fff;
      flex-direction: column;
      gap: 16px;
    }
    h1 { font-size: 2.5rem; color: #ff4f6d; margin: 0; }
    p { color: #aaa; font-size: 1rem; }
    a { color: #7c6af7; text-decoration: none; font-size: 0.9rem; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1 data-testid="blocked-message">Page Blocked</h1>
  <p>This site has been blocked by Productivity Suite.</p>
  <a href="javascript:history.back()">Go Back</a>
</body>
</html>`);
              document.close();
            },
          });
        }
      } catch {
        // invalid URL, ignore
      }
    });
  }
});
