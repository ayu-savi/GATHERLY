import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Ticket,
  ShieldCheck,
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
      title: 'CAMPUS HUB',
      items: [
        { name: 'Overview', path: '/app/overview', icon: LayoutDashboard },
        { name: 'Discover Events', path: '/events', icon: Compass },
      ],
    },
    {
      title: 'MY ACTIVITY',
      items: [
        { name: 'My Registrations', path: '/app/registrations', icon: CalendarCheck },
        { name: 'My Digital Passes', path: '/app/passes', icon: Ticket },
      ],
    },
    {
      title: 'TOOLS & PROFILE',
      items: [
        { name: 'Gate Verifier', path: '/app/pass-verifier', icon: ShieldCheck },
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
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontFamily: 'var(--font-heading)',
                fontWeight: '900',
              }}
            >
              G
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '800',
                fontSize: '1.15rem',
                color: 'var(--text-primary)',
              }}
            >
              GATHERLY
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-5) var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          {navSections.map((section) => (
            <div key={section.title}>
              <p
                style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  padding: '0 var(--space-2)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {section.title}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {section.items.map((item) => {
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
                        fontSize: 'var(--text-xs)',
                        fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        background: isActive ? 'var(--bg-elevated)' : 'transparent',
                        textDecoration: 'none',
                      })}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer User & Logout */}
        <div
          style={{
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {user?.fullName || 'Campus Student'}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                {user?.studentId || 'STU-2026-089'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                color: 'var(--error)',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                fontWeight: '600',
              }}
            >
              <LogOut size={16} />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
