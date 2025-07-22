import React, { useState } from 'react';

const DebugPanel = ({ logs }) => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      width: isOpen ? 350 : 100,
      maxHeight: '40vh',
      overflowY: 'auto',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      fontSize: '12px',
      fontFamily: 'monospace',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      zIndex: 9999,
      padding: '10px'
    }}>
      <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
        <strong>🛠 Debug</strong>
        <button onClick={togglePanel} style={{
          background: 'transparent',
          color: '#fff',
          border: 'none',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          {isOpen ? '–' : '+'}
        </button>
      </div>
      {isOpen && logs.length === 0 && <p style={{ color: '#999' }}>No logs yet...</p>}
      {isOpen && logs.slice().reverse().map((log, index) => (
        <div key={index} style={{
          marginBottom: '5px',
          color: log.type === 'error' ? 'red' : log.type === 'warn' ? 'orange' : 'lightgreen'
        }}>
          [{log.type.toUpperCase()}] {log.message}
        </div>
      ))}
    </div>
  );
};

export default DebugPanel;
