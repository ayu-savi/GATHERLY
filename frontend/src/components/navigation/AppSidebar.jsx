import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Ticket,
  ShieldCheck,
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
            gap: '12px',
            textDecoration: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1.5px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '900',
                fontSize: '1.05rem',
                lineHeight: 1,
              }}
            >
              G
            </span>
          </div>

          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                }}
              >
                GATHERLY
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)',
                  marginTop: '2px',
                }}
              >
                Student Portal
              </span>
            </div>
          )}
        </Link>

        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse Sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? 'var(--space-4) var(--space-2)' : 'var(--space-5) var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p
                style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  padding: '0 var(--space-3)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {section.title}
              </p>
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
                      gap: '12px',
                      padding: isCollapsed ? '10px 0' : '9px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-elevated)' : 'transparent',
                      borderLeft: isActive && !isCollapsed ? '3px solid var(--primary)' : '3px solid transparent',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          style={{
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            flexShrink: 0,
                          }}
                        />
                        {!isCollapsed && (
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Collapse Toggle */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: isCollapsed ? 'var(--space-3)' : 'var(--space-4)',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            title="Expand Sidebar"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 0',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
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
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  flexShrink: 0,
                }}
              >
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--weight-bold)',
                    color: 'var(--text-primary)',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.fullName || 'Campus Student'}
                </p>
                <p
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.studentId || 'STU-2026-089'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
