import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import { PublicFooter } from '../components/navigation/PublicFooter';

/**
 * AppLayout — Unified Campus Layout for Authenticated Pages
 * 
 * Replaces the old left sidebar navigation with a full-width horizontal
 * authenticated navbar layout, giving students maximum screen real estate
 * and a cohesive experience across public and private portal areas.
 */
export const AppLayout = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Horizontal Authenticated Navbar */}
      <PublicNavbar />

      {/* Main Full-Width Content Container */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-6)',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </main>

      {/* Standard Campus Footer */}
      <PublicFooter />
    </div>
  );
};

export default AppLayout;
