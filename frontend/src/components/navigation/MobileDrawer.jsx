import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  Sparkles,
  LayoutDashboard,
  Compass,
  Calendar,
  Ticket,
  Bookmark,
  Image,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  if (!isOpen) return null;

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { name: 'Overview', path: '/app/overview', icon: LayoutDashboard },
        { name: 'Discover Events', path: '/app/discover', icon: Compass },
        { name: 'Event Calendar', path: '/app/calendar', icon: Calendar },
      ],
    },
    {
      title: 'PERSONAL',
      items: [
        { name: 'My Registrations', path: '/app/registrations', icon: Ticket },
        { name: 'Saved Events', path: '/app/saved', icon: Bookmark },
        { name: 'Event Gallery', path: '/app/gallery', icon: Image },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'My Profile', path: '/app/profile', icon: User },
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
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: 'relative',
          width: '280px',
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
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Sparkles size={16} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
              GATHER<span className="text-gradient">LY</span>
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
            <X size={20} />
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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {user?.fullName || 'Student Demo'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {user?.email || 'student@campus.edu'}
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--space-3)' }}>
          {navSections.map((sec) => (
            <div key={sec.title} style={{ marginBottom: 'var(--space-5)' }}>
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
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
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(var(--primary-rgb), 0.12)' : 'transparent',
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
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
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;

