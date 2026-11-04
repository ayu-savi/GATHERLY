import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, User, Compass, Calendar, Layers, Info } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { name: 'Discover', path: '/events', icon: Compass },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'About Campus', path: '/about', icon: Info },
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
          <NavLink
            to="/"
            end
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
            Home
          </NavLink>

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
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
        </nav>

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <ThemeToggle size="md" />

          {/* Auth Actions (Desktop) */}
          <div className="hide-below-desktop" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {isAuthenticated ? (
              <Link to="/app/overview">
                <Button variant="secondary" size="sm" icon={User}>
                  {user?.fullName ? user.fullName.split(' ')[0] : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
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
              </>
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
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav Menu */}
      {mobileMenuOpen && (
        <div
          className="show-below-desktop"
          style={{
            position: 'absolute',
            top: 'var(--navbar-height)',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-strong)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-primary)',
              padding: '8px 0',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            Home
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-primary)',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {link.name}
            </Link>
          ))}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            {isAuthenticated ? (
              <Link to="/app/overview" style={{ width: '100%' }} onClick={() => setMobileMenuOpen(false)}>
                <Button fullWidth variant="primary" icon={User}>
                  Go to Student Hub
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth variant="secondary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth variant="primary">
                    Get Started
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
