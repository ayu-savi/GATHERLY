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
  Sparkles,
} from 'lucide-react';

export const AppSidebar = ({ isCollapsed, setIsCollapsed }) => {
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
          padding: isCollapsed ? '0' : '0 var(--space-6)',
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
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={18} />
          </div>
          {!isCollapsed && (
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--weight-extrabold)',
                color: 'var(--text-primary)',
              }}
            >
              GATHER<span className="text-gradient">LY</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Sections */}
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
                  fontSize: '0.65rem',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
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
                      padding: isCollapsed ? '10px 0' : '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(var(--primary-rgb), 0.12)' : 'transparent',
                      borderLeft: isActive && !isCollapsed ? '3px solid var(--primary)' : '3px solid transparent',
                      transition: 'all var(--transition-fast)',
                    })}
                  >
                    <Icon size={18} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div
        style={{
          padding: 'var(--space-3)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-end',
        }}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;

