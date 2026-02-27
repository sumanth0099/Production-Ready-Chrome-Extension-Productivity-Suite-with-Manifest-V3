import { useState, useEffect } from 'react';
import useStore from '../store';

export default function OptionsApp() {
  const {
    blockedSites,
    loadBlockedSites,
    addBlockedSite,
    removeBlockedSite,
    exportData,
  } = useStore();

  const [hostnameInput, setHostnameInput] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadBlockedSites();
  }, []);

  const handleAddBlock = async () => {
    const hostname = hostnameInput.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    if (!hostname) return;
    await addBlockedSite(hostname);
    setHostnameInput('');
    setStatusMsg(`"${hostname}" added to blocklist!`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleRemove = async (site) => {
    await removeBlockedSite(site);
    setStatusMsg(`"${site}" removed.`);
    setTimeout(() => setStatusMsg(''), 2000);
  };

  const handleExport = () => {
    exportData();
  };

  return (
    <div className="options-container">
      <header className="options-header">
        <div className="options-logo">
          <span className="logo-icon">⚡</span>
          <h1>Productivity Suite</h1>
          <span className="logo-subtitle">Settings</span>
        </div>
      </header>

      <main className="options-main">
        <section className="options-section">
          <h2 className="section-title">🚫 Website Blocker</h2>
          <p className="section-description">
            Block distracting websites during focus sessions. Settings sync across your devices.
          </p>

          <div className="add-block-row">
            <input
              type="text"
              className="input-field"
              data-testid="block-hostname-input"
              placeholder="e.g. facebook.com"
              value={hostnameInput}
              onChange={(e) => setHostnameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBlock()}
            />
            <button
              className="btn btn-primary"
              data-testid="add-block-btn"
              onClick={handleAddBlock}
            >
              Block Site
            </button>
          </div>

          {statusMsg && <p className="status-msg">{statusMsg}</p>}

          <div className="blocked-sites-list" data-testid="blocked-sites-list">
            {blockedSites.length === 0 ? (
              <p className="empty-state">No blocked sites. Add one above.</p>
            ) : (
              blockedSites.map((site) => (
                <div key={site} className="blocked-site-item">
                  <span className="site-hostname">🔒 {site}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(site)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="options-section">
          <h2 className="section-title">📦 Data Management</h2>
          <p className="section-description">
            Export all your notes, tab sessions, and blocklist as a single JSON file.
          </p>
          <button
            className="btn btn-accent"
            data-testid="export-data-btn"
            onClick={handleExport}
          >
            Export All Data
          </button>
        </section>
      </main>
    </div>
  );
}
