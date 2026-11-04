import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Compass,
  Calendar,
  Ticket,
  Bookmark,
  Image,
  User,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  if (!isOpen) return null;

  const navSections = [
    {
      title: 'DISCOVERY',
      items: [
        { name: 'Dashboard Overview', path: '/app/overview', icon: LayoutDashboard },
        { name: 'Browse Events', path: '/app/discover', icon: Compass },
        { name: 'Event Calendar', path: '/app/calendar', icon: Calendar },
      ],
    },
    {
      title: 'MY ACTIVITY',
      items: [
        { name: 'My Registrations', path: '/app/registrations', icon: Ticket },
        { name: 'Saved Events', path: '/app/saved', icon: Bookmark },
        { name: 'Event Gallery', path: '/app/gallery', icon: Image },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Student Profile', path: '/app/profile', icon: User },
        { name: 'Settings', path: '/app/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-drawer)',
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '290px',
          maxWidth: '85vw',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 'var(--z-drawer)',
          animation: 'slideInLeft 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            padding: '0 var(--space-5)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to="/"
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                border: '1.5px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: '900',
                fontSize: '0.95rem',
              }}
            >
              G
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
              GATHERLY
            </span>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              padding: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || 'Student Demo'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {user?.email || 'student@campus.edu'}
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--space-3)' }}>
          {navSections.map((sec) => (
            <div key={sec.title} style={{ marginBottom: 'var(--space-5)' }}>
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 'bold',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-mono)',
                  padding: '0 var(--space-3)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-elevated)' : 'transparent',
                    })}
                  >
                    <Icon size={17} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}

          <Link
            to="/"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-4)',
            }}
          >
            <span>Public Website</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        {/* Logout */}
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '9px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-bold)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
