import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-10)',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Main Editorial Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-10)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-4)' }}>
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
                }}
              >
                G
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                GATHERLY
              </span>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              Discover. Connect. Celebrate. The unified campus event discovery and registration platform engineered for university ecosystems.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
              <span>Campus Services Operational</span>
            </div>
          </div>

          {/* Directory Column */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 'var(--space-4)',
                color: 'var(--primary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Event Directory
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li>
                <Link to="/events" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>All Events</Link>
              </li>
              <li>
                <Link to="/categories" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Browse Categories</Link>
              </li>
              <li>
                <Link to="/events?sort=popularity" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Popular Fests</Link>
              </li>
              <li>
                <Link to="/events?sort=date" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Upcoming Timeline</Link>
              </li>
            </ul>
          </div>

          {/* Student Hub Column */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 'var(--space-4)',
                color: 'var(--primary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Student Portal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li>
                <Link to="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Student Sign In</Link>
              </li>
              <li>
                <Link to="/signup" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Create Account</Link>
              </li>
              <li>
                <Link to="/app/overview" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>My Passes & Schedule</Link>
              </li>
              <li>
                <Link to="/about" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Campus Society Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Academic Statement */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 'var(--space-4)',
                color: 'var(--primary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Academic Submission
            </h4>
            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Semester Project
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Strictly developed according to university examiner requirements with independent editorial design and full-stack architecture.
              </p>
            </div>
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
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>&copy; {new Date().getFullYear()} GATHERLY &bull; All campus rights reserved.</span>
          <span>Engineered with React + Vite + Express + MongoDB</span>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
