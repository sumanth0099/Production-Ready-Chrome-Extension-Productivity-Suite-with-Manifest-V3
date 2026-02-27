import { useState, useEffect } from 'react';
import useStore from '../store';

export default function PopupApp() {
  const {
    notes, setNotes, loadNotes, saveNotes,
    sessions, loadSessions, saveSession, restoreSession, deleteSession,
  } = useStore();

  const [sessionName, setSessionName] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions');

  useEffect(() => {
    loadNotes();
    loadSessions();
  }, []);

  const handleSaveSession = async () => {
    const name = sessionName.trim() || `session-${Date.now()}`;
    chrome.tabs.query({ currentWindow: true }, async (tabs) => {
      const urls = tabs.map((tab) => tab.url).filter(Boolean);
      await saveSession(name, urls);
      setSessionName('');
      setSessionSaved(true);
      setTimeout(() => setSessionSaved(false), 2000);
    });
  };

  const handleSaveNotes = async () => {
    await saveNotes();
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const sessionEntries = Object.entries(sessions);

  return (
    <div className="popup-container">
      <header className="popup-header">
        <div className="popup-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Productivity Suite</span>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          data-testid="open-options-btn"
          onClick={handleOpenOptions}
          title="Open Options"
        >
          ⚙️
        </button>
      </header>

      <nav className="popup-tabs">
        <button
          className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          Tabs
        </button>
        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </nav>

      {activeTab === 'sessions' && (
        <div className="tab-content">
          <div className="save-session-row">
            <input
              type="text"
              className="input-field"
              placeholder="Session name..."
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSession()}
            />
            <button
              className={`btn btn-primary ${sessionSaved ? 'btn-success' : ''}`}
              data-testid="save-session-btn"
              onClick={handleSaveSession}
            >
              {sessionSaved ? '✓ Saved' : 'Save'}
            </button>
          </div>

          <div className="sessions-list" data-testid="sessions-list">
            {sessionEntries.length === 0 ? (
              <p className="empty-state">No saved sessions yet.</p>
            ) : (
              sessionEntries.map(([name, urls]) => (
                <div key={name} className="session-card">
                  <div className="session-info">
                    <span className="session-name">{name}</span>
                    <span className="session-meta">{urls.length} tab{urls.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="session-actions">
                    <button
                      className="btn btn-accent btn-sm"
                      data-testid={`restore-session-${name}`}
                      onClick={() => restoreSession(name)}
                    >
                      Restore
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteSession(name)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="tab-content">
          <textarea
            className="notes-textarea"
            data-testid="notes-textarea"
            placeholder="Write your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            className={`btn btn-primary btn-full ${noteSaved ? 'btn-success' : ''}`}
            data-testid="save-notes-btn"
            onClick={handleSaveNotes}
          >
            {noteSaved ? '✓ Notes Saved' : 'Save Notes'}
          </button>
        </div>
      )}
    </div>
  );
}
