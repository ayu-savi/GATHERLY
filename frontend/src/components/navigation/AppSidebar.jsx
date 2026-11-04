import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  Ticket,
  Bookmark,
  Image,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AppSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

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

  const sidebarWidth = isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)';

  return (
    <aside
      className="hide-below-desktop"
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-base), min-width var(--transition-base)',
        zIndex: 'var(--z-sidebar)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '0' : '0 var(--space-5)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-elevated)',
              border: '1.5px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              fontWeight: '900',
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            G
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                GATHERLY
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                Workspace
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? 'var(--space-4) 0' : 'var(--space-5) var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-mono)',
                  padding: '0 var(--space-3)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {section.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={isCollapsed ? item.name : undefined}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      gap: '12px',
                      padding: isCollapsed ? '10px 0' : '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-elevated)' : 'transparent',
                      borderLeft: isActive && !isCollapsed ? '3px solid var(--primary)' : '3px solid transparent',
                      transition: 'all var(--transition-fast)',
                    })}
                  >
                    <Icon size={17} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Public Website Shortcut */}
        {!isCollapsed && (
          <div style={{ marginTop: 'auto', padding: '0 var(--space-3)' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>Back to Public Portal</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        )}
      </div>

      {/* Footer User Strip */}
      <div
        style={{
          padding: 'var(--space-3)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        {!isCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {user?.fullName || 'Student'}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Verified Account</span>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            padding: '7px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
