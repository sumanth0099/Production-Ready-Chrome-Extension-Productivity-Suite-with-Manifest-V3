import { create } from 'zustand';

// Getting data  from chrome.storage.local
const getLocal = (keys) =>
  new Promise((resolve) => chrome.storage.local.get(keys, resolve));

// Setting data  in chrome.storage.local
const setLocal = (items) =>
  new Promise((resolve) => chrome.storage.local.set(items, resolve));

// Getting from chrome.storage.sync
const getSync = (keys) =>
  new Promise((resolve) => chrome.storage.sync.get(keys, resolve));

// Setting in chrome.storage.sync
const setSync = (items) =>
  new Promise((resolve) => chrome.storage.sync.set(items, resolve));

const useStore = create((set, get) => ({
  // --- Notes ---
  notes: '',
  setNotes: (notes) => set({ notes }),

  loadNotes: async () => {
    const result = await getLocal(['notes']);
    set({ notes: result.notes || '' });
  },

  saveNotes: async () => {
    const { notes } = get();
    await setLocal({ notes });
  },

  // --- Tab Sessions ---
  sessions: {},
  setSessions: (sessions) => set({ sessions }),

  loadSessions: async () => {
    const result = await getLocal(['sessions']);
    set({ sessions: result.sessions || {} });
  },

  saveSession: async (name, urls) => {
    const { sessions } = get();
    const updated = { ...sessions, [name]: urls };
    await setLocal({ sessions: updated });
    set({ sessions: updated });
  },

  restoreSession: (name) => {
    const { sessions } = get();
    const urls = sessions[name];
    if (urls && urls.length > 0) {
      chrome.windows.create({ url: urls });
    }
  },

  deleteSession: async (name) => {
    const { sessions } = get();
    const updated = { ...sessions };
    delete updated[name];
    await setLocal({ sessions: updated });
    set({ sessions: updated });
  },

  // --- About blocked Sites ---
  blockedSites: [],
  setBlockedSites: (blockedSites) => set({ blockedSites }),

  loadBlockedSites: async () => {
    const result = await getSync(['blockedSites']);
    set({ blockedSites: result.blockedSites || [] });
  },

  addBlockedSite: async (hostname) => {
    const { blockedSites } = get();
    if (!hostname || blockedSites.includes(hostname)) return;
    const updated = [...blockedSites, hostname];
    await setSync({ blockedSites: updated });
    set({ blockedSites: updated });
  },

  removeBlockedSite: async (hostname) => {
    const { blockedSites } = get();
    const updated = blockedSites.filter((s) => s !== hostname);
    await setSync({ blockedSites: updated });
    set({ blockedSites: updated });
  },

  // --- Export ---
  exportData: async () => {
    const localResult = await getLocal(['notes', 'sessions']);
    const syncResult = await getSync(['blockedSites']);
    const data = {
      sessions: localResult.sessions || {},
      notes: localResult.notes || '',
      blockedSites: syncResult.blockedSites || [],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productivity_suite_export.json';
    a.click();
    URL.revokeObjectURL(url);
  },
}));

export default useStore;
