import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Layout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🏫 Smart Kindergarten</h2>
          <span>Boshqaruv tizimi</span>
        </div>
        <nav>
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end onClick={() => setSidebarOpen(false)}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/students" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            👶 O'quvchilar
          </NavLink>
          <NavLink to="/payments" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            💰 To'lovlar
          </NavLink>
        </nav>
        <div style={{position: 'absolute', bottom: '20px', left: 0, right: 0, padding: '0 20px'}}>
          <button className="btn btn-danger" style={{width: '100%'}} onClick={onLogout}>
            🚪 Chiqish
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
