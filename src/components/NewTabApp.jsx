import { useEffect } from 'react';
import useStore from '../store';

export default function NewTabApp() {
  const { notes, sessions, loadNotes, loadSessions, restoreSession } = useStore();

  useEffect(() => {
    loadNotes();
    loadSessions();
  }, []);

  const sessionEntries = Object.entries(sessions);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="newtab-container">
      <div className="newtab-hero">
        <div className="newtab-clock">{currentTime}</div>
        <div className="newtab-date">{currentDate}</div>
      </div>

      <div className="newtab-widgets">
        <div className="widget" data-testid="widget-notes">
          <div className="widget-header">
            <span className="widget-icon">📝</span>
            <h2 className="widget-title">My Notes</h2>
          </div>
          <div className="widget-body">
            {notes ? (
              <pre className="notes-display">{notes}</pre>
            ) : (
              <p className="empty-state">No notes yet. Open the extension popup to add some!</p>
            )}
          </div>
        </div>

        <div className="widget" data-testid="widget-sessions">
          <div className="widget-header">
            <span className="widget-icon">📂</span>
            <h2 className="widget-title">Saved Sessions</h2>
          </div>
          <div className="widget-body">
            {sessionEntries.length === 0 ? (
              <p className="empty-state">No sessions saved. Save some tabs from the popup!</p>
            ) : (
              <ul className="sessions-widget-list">
                {sessionEntries.map(([name, urls]) => (
                  <li key={name} className="session-widget-item">
                    <div className="session-widget-info">
                      <span className="session-widget-name">{name}</span>
                      <span className="session-widget-count">{urls.length} tab{urls.length !== 1 ? 's' : ''}</span>
                    </div>
                    <button
                      className="btn btn-accent btn-sm"
                      data-testid={`restore-session-${name}`}
                      onClick={() => restoreSession(name)}
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
