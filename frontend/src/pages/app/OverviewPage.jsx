import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Ticket,
  Bookmark,
  Calendar,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  MapPin,
} from 'lucide-react';

export const OverviewPage = () => {
  const { user } = useAuth();

  const statCards = [
    { title: 'Active Passes', value: '2', subtitle: 'Confirmed registrations', icon: Ticket, color: 'var(--primary)', path: '/app/registrations' },
    { title: 'Saved Events', value: '4', subtitle: 'On your wishlist', icon: Bookmark, color: 'var(--accent-secondary)', path: '/app/saved' },
    { title: 'Happening This Week', value: '1', subtitle: 'HackNexa 2026', icon: Calendar, color: 'var(--highlight)', path: '/app/calendar' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <div className="editorial-eyebrow">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
            <span>Authenticated Student Center</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '4px', color: 'var(--text-primary)' }}>
            Welcome back, {user?.fullName || 'Student'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
            {user?.department || 'Computer Science & Engineering'} &bull; Roll: CS-2023-049
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/app/discover">
            <Button variant="primary" size="md" icon={Compass}>
              Browse Campus Events
            </Button>
          </Link>
          <Link to="/app/calendar">
            <Button variant="secondary" size="md" icon={Calendar}>
              View Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {stat.title}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {stat.subtitle}
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                <Link to={stat.path} style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Manage &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Immediate Registered Pass Preview */}
      <Card glass style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={18} color="var(--primary)" />
            <h3 style={{ fontSize: 'var(--text-base)', margin: 0, fontWeight: '800' }}>Your Next Registered Event Pass</h3>
          </div>
          <Badge variant="success">Confirmed Seat</Badge>
        </div>

        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 'bold' }}>
              PASS REF: GATH-HACK-8921 &bull; TECHNICAL
            </div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '2px' }}>
              HackNexa 2026: 36-Hour National Campus Hackathon
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={13} color="var(--primary)" /> 2026-11-20 &bull; 09:00 AM IST
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={13} color="var(--primary)" /> Turing Computer Auditorium
              </span>
            </div>
          </div>

          <Link to="/app/registrations">
            <Button variant="primary" size="sm" icon={ArrowUpRight}>
              View Digital Pass
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default OverviewPage;
