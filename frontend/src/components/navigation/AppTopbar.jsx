import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const AppTopbar = ({ onMobileToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/overview')) return { title: 'Dashboard Overview', category: 'Personal Center' };
    if (path.includes('/discover')) return { title: 'Browse Events', category: 'Explore Schedule' };
    if (path.includes('/calendar')) return { title: 'Event Calendar', category: 'Timeline' };
    if (path.includes('/registrations')) return { title: 'My Registrations', category: 'Tickets & Passes' };
    if (path.includes('/saved')) return { title: 'Saved Events', category: 'Wishlist' };
    if (path.includes('/gallery')) return { title: 'Campus Memories', category: 'Archive' };
    if (path.includes('/profile')) return { title: 'Student Profile', category: 'Account' };
    if (path.includes('/settings')) return { title: 'Application Settings', category: 'Preferences' };
    return { title: 'Dashboard', category: 'Campus Portal' };
  };

  const { title, category } = getPageInfo();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        transition: 'all var(--transition-base)',
      }}
    >
      {/* Left: Mobile hamburger & Clean Breadcrumb */}
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
          <Menu size={18} />
        </button>

        <div>
          <div
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {category}
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', margin: 0, fontWeight: '800', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
        </div>
      </div>

      {/* Right: Quick Search, Notifications, Theme, User Avatar */}
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
          <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search dashboard..."
            style={{
              padding: '7px 12px 7px 34px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              width: '180px',
              outline: 'none',
              transition: 'all var(--transition-base)',
            }}
            onFocus={(e) => {
              e.target.style.width = '230px';
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
            width: '36px',
            height: '36px',
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
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--primary)',
            }}
          />
        </button>

        {/* Theme Switcher */}
        <ThemeToggle size="md" />

        {/* User Profile Pill & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 5px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'var(--text-inverse)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.72rem',
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
              {user?.fullName ? user.fullName.split(' ')[0] : 'Student'}
            </span>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>

          {userDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '210px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: 'var(--space-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 'var(--z-modal)',
                animation: 'fadeIn 0.15s ease-out',
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
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <User size={15} color="var(--primary)" /> Student Profile
              </Link>
              <Link
                to="/app/settings"
                onClick={() => setUserDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <SettingsIcon size={15} color="var(--accent-secondary)" /> Preferences
              </Link>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--error)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppTopbar;
