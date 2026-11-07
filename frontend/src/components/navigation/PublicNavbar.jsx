import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Info,
  User,
  LogOut,
  Ticket,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Settings as SettingsIcon,
  ArrowRight,
  Menu,
  X,
  FileText,
  ClipboardCheck,
  Camera,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  // Base navigation links visible to everyone
  const publicLinks = [
    { name: 'Home', path: '/', end: true },
    { name: 'Discover', path: '/events', end: false },
    { name: 'Campus Memories', path: '/gallery', end: false },
    { name: 'About Campus', path: '/about', end: false },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-header)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        transition: 'all var(--transition-base)',
      }}
    >
      <div className="container flex-between" style={{ height: '100%' }}>
        {/* Brand Monogram & Wordmark */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1.5px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '900',
                fontSize: '1.15rem',
                lineHeight: 1,
                letterSpacing: '-0.04em',
              }}
            >
              G
            </span>
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--accent-secondary)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
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
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                marginTop: '3px',
              }}
            >
              Campus Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hide-below-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'var(--bg-elevated)',
            padding: '4px 6px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {publicLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              style={({ isActive }) => ({
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
                color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary)' : 'transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Student Dashboard link appears ONLY after student logs in */}
          {isAuthenticated && (
            <NavLink
              to="/app/overview"
              style={({ isActive }) => ({
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
                color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)',
              })}
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
            </NavLink>
          )}
        </nav>

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <ThemeToggle size="md" />

          {/* Desktop Auth Controls */}
          <div className="hide-below-desktop" style={{ position: 'relative' }}>
            {isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px 6px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'all var(--transition-fast)',
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
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
                  </div>

                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {user?.fullName ? user.fullName.split(' ')[0] : 'Student'}
                  </span>

                  <ChevronDown
                    size={14}
                    style={{
                      color: 'var(--text-muted)',
                      transform: userDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform var(--transition-fast)',
                    }}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '240px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '12px',
                      zIndex: 100,
                      animation: 'fadeIn 0.15s ease-out',
                    }}
                  >
                    {/* User Profile Mini Banner */}
                    <div
                      style={{
                        paddingBottom: '10px',
                        marginBottom: '10px',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--weight-bold)',
                          color: 'var(--text-primary)',
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {user?.fullName || 'Campus Student'}
                      </p>
                      <p
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          margin: '2px 0 0',
                          fontFamily: 'var(--font-mono)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {user?.email || 'student@campus.edu'}
                      </p>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '6px',
                          fontSize: '0.65rem',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-elevated)',
                          color: 'var(--primary)',
                          fontWeight: '600',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {user?.studentId || 'STU-2026'}
                      </span>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Link
                        to="/app/overview"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LayoutDashboard size={14} style={{ color: 'var(--primary)' }} />
                        <span>Overview</span>
                      </Link>

                      <Link
                        to="/app/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <User size={14} style={{ color: 'var(--primary)' }} />
                        <span>Student Profile</span>
                      </Link>

                      <Link
                        to="/app/registrations"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <CalendarCheck size={14} style={{ color: 'var(--accent-secondary)' }} />
                        <span>My Registrations</span>
                      </Link>

                      <Link
                        to="/app/passes"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Ticket size={14} style={{ color: 'var(--primary)' }} />
                        <span>My Digital Passes</span>
                      </Link>

                      <Link
                        to="/app/proposals"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <FileText size={14} style={{ color: 'var(--primary)' }} />
                        <span>My Proposals</span>
                      </Link>

                      {user?.role === 'admin' && (
                        <>
                          <Link
                            to="/app/admin/proposals"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-secondary)',
                              textDecoration: 'none',
                              transition: 'background var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <ClipboardCheck size={14} style={{ color: 'var(--primary)' }} />
                            <span>Proposal Review</span>
                          </Link>

                          <Link
                            to="/app/admin/gallery"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-secondary)',
                              textDecoration: 'none',
                              transition: 'background var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Camera size={14} style={{ color: 'var(--primary)' }} />
                            <span>Manage Memories</span>
                          </Link>
                        </>
                      )}

                      {(user?.role === 'organizer' || user?.role === 'admin') && (
                        <Link
                          to="/app/pass-verifier"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            transition: 'background var(--transition-fast)',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <ShieldCheck size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>Gate Verifier</span>
                        </Link>
                      )}

                      <Link
                        to="/app/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <SettingsIcon size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>Settings</span>
                      </Link>

                      <Link
                        to="/"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Compass size={14} style={{ color: 'var(--primary)' }} />
                        <span>Return to Public Site</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: '600',
                          color: 'var(--error)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--error-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                    Join Campus
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="show-below-desktop"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--navbar-height)',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 'var(--z-drawer)',
            padding: 'var(--space-6) var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {publicLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)',
                  fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
                  color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                  background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  textDecoration: 'none',
                })}
              >
                {link.name}
              </NavLink>
            ))}

            {isAuthenticated && (
              <>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    maxWidth: '100%',
                    overflow: 'hidden',
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
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-heading)',
                      flexShrink: 0,
                    }}
                  >
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.fullName || 'Campus Student'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {user?.email || 'student@campus.edu'}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    height: '1px',
                    background: 'var(--border-subtle)',
                    margin: '4px 0',
                  }}
                />
                <NavLink
                  to="/app/overview"
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--weight-semibold)',
                    color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                    background: 'var(--bg-elevated)',
                    textDecoration: 'none',
                  })}
                >
                  <LayoutDashboard size={18} style={{ color: 'var(--primary)' }} />
                  <span>Student Dashboard</span>
                </NavLink>

                <NavLink
                  to="/app/registrations"
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--weight-medium)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                  })}
                >
                  <CalendarCheck size={18} />
                  <span>My Registrations</span>
                </NavLink>

                <NavLink
                  to="/app/passes"
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--weight-medium)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                  })}
                >
                  <Ticket size={18} />
                  <span>My Digital Passes</span>
                </NavLink>

                <NavLink
                  to="/app/proposals"
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--weight-medium)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                  })}
                >
                  <FileText size={18} />
                  <span>My Proposals</span>
                </NavLink>

                {user?.role === 'admin' && (
                  <>
                    <NavLink
                      to="/app/admin/proposals"
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--weight-medium)',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        textDecoration: 'none',
                      })}
                    >
                      <ClipboardCheck size={18} />
                      <span>Proposal Review</span>
                    </NavLink>

                    <NavLink
                      to="/app/admin/gallery"
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--weight-medium)',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        textDecoration: 'none',
                      })}
                    >
                      <Camera size={18} />
                      <span>Manage Memories</span>
                    </NavLink>
                  </>
                )}

                <NavLink
                  to="/app/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--weight-medium)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                  })}
                >
                  <User size={18} />
                  <span>Student Profile</span>
                </NavLink>

                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <NavLink
                    to="/app/pass-verifier"
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--weight-medium)',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      textDecoration: 'none',
                    })}
                  >
                    <ShieldCheck size={18} />
                    <span>Gate Verifier</span>
                  </NavLink>
                )}

                <NavLink
                  to="/app/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--weight-medium)',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                  })}
                >
                  <SettingsIcon size={18} />
                  <span>Settings</span>
                </NavLink>
              </>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {isAuthenticated ? (
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                icon={LogOut}
                fullWidth
              >
                Sign Out ({user?.fullName ? user.fullName.split(' ')[0] : 'Student'})
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" fullWidth icon={ArrowRight} iconPosition="right">
                    Join Campus
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
