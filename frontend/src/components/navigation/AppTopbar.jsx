import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const AppTopbar = ({ onMobileToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Derive human-readable page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/overview')) return 'Dashboard Overview';
    if (path.includes('/discover')) return 'Discover Events';
    if (path.includes('/calendar')) return 'Event Calendar';
    if (path.includes('/registrations')) return 'My Registrations';
    if (path.includes('/saved')) return 'Saved Events';
    if (path.includes('/gallery')) return 'Campus Gallery';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        transition: 'background var(--transition-base)',
      }}
    >
      {/* Left: Mobile hamburger + Breadcrumb / Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          type="button"
          className="show-below-desktop"
          onClick={onMobileToggle}
          aria-label="Open Navigation Drawer"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Gatherly &bull; Campus Portal
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, fontWeight: 'var(--weight-bold)' }}>
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme, User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Quick Search */}
        <div
          className="hide-on-mobile"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search dashboard..."
            style={{
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              width: '180px',
              outline: 'none',
              transition: 'width var(--transition-base), border-color var(--transition-fast)',
            }}
            onFocus={(e) => {
              e.target.style.width = '240px';
              e.target.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.target.style.width = '180px';
              e.target.style.borderColor = 'var(--border-subtle)';
            }}
          />
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          aria-label="Notifications"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
            }}
          />
        </button>

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* User Profile Avatar & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px 4px 4px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--accent-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 'var(--weight-bold)',
                fontSize: '0.75rem',
              }}
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span
              className="hide-on-mobile"
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-primary)',
              }}
            >
              {user?.fullName || 'Student'}
            </span>
          </button>

          {userDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '200px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 'var(--z-modal)',
              }}
            >
              <Link
                to="/app/profile"
                onClick={() => setUserDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <User size={15} /> My Profile
              </Link>
              <Link
                to="/app/settings"
                onClick={() => setUserDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <SettingsIcon size={15} /> Settings
              </Link>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--error)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppTopbar;

