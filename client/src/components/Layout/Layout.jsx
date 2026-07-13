import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { useToast } from '../../context/ToastContext';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { addToast } = useToast();

  React.useEffect(() => {
    let currentClientId = '';

    import('../../socket').then(({ socket, CLIENT_ID }) => {
      currentClientId = CLIENT_ID;
      setIsConnected(socket.connected);

      const onConnect = () => setIsConnected(true);
      const onDisconnect = () => setIsConnected(false);

      const onCreated = (p) => {
        if (p && p.originClientId !== currentClientId) {
          const name = p.data ? p.data.full_name : 'An employee';
          addToast(`${name} was added by someone else`, 'success');
        }
      };

      const onUpdated = (p) => {
        if (p && p.originClientId !== currentClientId) {
          const name = p.data ? p.data.full_name : 'An employee';
          addToast(`${name} was updated`, 'success');
        }
      };

      const onDeleted = (p) => {
        if (p && p.originClientId !== currentClientId) {
          addToast('An employee was deleted', 'success');
        }
      };

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('employee:created', onCreated);
      socket.on('employee:updated', onUpdated);
      socket.on('employee:deleted', onDeleted);

      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('employee:created', onCreated);
        socket.off('employee:updated', onUpdated);
        socket.off('employee:deleted', onDeleted);
      };
    });
  }, [addToast]);

  return (
    <div className="layout">
      <Navbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="layout__main">
        {/* Top header bar */}
        <header className="layout__header">
          <button
            className="layout__menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="layout__header-right">
            <div className={`layout__socket-status ${isConnected ? 'connected' : 'disconnected'}`}>
              <span className="status-dot"></span>
              {isConnected ? 'Live Connected' : 'Reconnecting...'}
            </div>
            <Link to="/" className="layout__header-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="var(--color-primary)"/>
                <path d="M16 10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" fill="white"/>
                <path d="M8 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="layout__header-title">EMS</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
