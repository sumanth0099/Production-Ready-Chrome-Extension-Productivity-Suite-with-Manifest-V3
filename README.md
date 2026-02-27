# Productivity Suite Chrome Extension

A production-ready Chrome Extension built with **React**, **Zustand**, **Plain CSS**, and **Manifest V3**.

## Features

- **Tab Session Manager** — Save and restore your open tabs as named sessions
- **Website Blocker** — Block distracting websites (synced across devices)
- **Persistent Notes** — Quick notes that survive popup close/open
- **Custom New Tab** — Dashboard with notes & sessions widgets
- **Data Export** — Download all your data as JSON
- **Keyboard Shortcuts** — `Ctrl+Shift+P` (open popup), `Ctrl+Shift+S` (save session)

## Project Structure

```
/
├── manifest.json          # Manifest V3 config
├── popup.html             # Popup entry
├── options.html           # Options page entry
├── newtab.html            # New tab override entry
├── background.js          # Service worker
├── src/
│   ├── store.js           # Zustand state management
│   ├── popup.jsx          # Popup React entry
│   ├── options.jsx        # Options React entry
│   ├── newtab.jsx         # New Tab React entry
│   ├── components/
│   │   ├── PopupApp.jsx
│   │   ├── OptionsApp.jsx
│   │   └── NewTabApp.jsx
│   └── styles/
│       ├── popup.css
│       ├── options.css
│       └── newtab.css
├── vite.config.js
└── package.json
```

## Setup

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

## Loading in Chrome

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+P` | Open popup |
| `Ctrl+Shift+S` | Quick save current session |
