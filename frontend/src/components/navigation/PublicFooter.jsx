import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-8)',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-8)',
            marginBottom: 'var(--space-10)',
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-3)' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
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
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Discover. Connect. Celebrate. The responsive campus event discovery and management platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li>
                <Link to="/events" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>All Events</Link>
              </li>
              <li>
                <Link to="/categories" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Event Categories</Link>
              </li>
              <li>
                <Link to="/about" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>About GATHERLY</Link>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
              Student Hub
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li>
                <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Student Login</Link>
              </li>
              <li>
                <Link to="/signup" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Sign Up</Link>
              </li>
              <li>
                <Link to="/app/overview" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>My Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Academic Info */}
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
              Semester Project
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Designed & developed as a university semester submission project adhering strictly to the examiner's problem statement.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}
        >
          <span>&copy; {new Date().getFullYear()} GATHERLY. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={13} color="var(--highlight-pink)" fill="var(--highlight-pink)" /> for Campus Life
          </span>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

