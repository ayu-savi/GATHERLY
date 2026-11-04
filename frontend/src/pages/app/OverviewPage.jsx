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
  CheckCircle2,
} from 'lucide-react';

export const OverviewPage = () => {
  const { user } = useAuth();

  const statCards = [
    { title: 'Active Registrations', value: '2', icon: Ticket, color: 'var(--primary)', path: '/app/registrations' },
    { title: 'Saved Bookmarks', value: '4', icon: Bookmark, color: 'var(--accent-cyan)', path: '/app/saved' },
    { title: 'Upcoming This Week', value: '1', icon: Calendar, color: 'var(--highlight-pink)', path: '/app/calendar' },
  ];

  return (
    <div>
      {/* Welcome Hero Banner */}
      <Card
        glass
        style={{
          marginBottom: 'var(--space-8)',
          background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(var(--accent-cyan-rgb), 0.15))',
          borderColor: 'var(--border-strong)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'inline-flex', marginBottom: '8px' }}>
              <Badge variant="cyan" icon={Sparkles}>Authenticated Student Hub</Badge>
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>
              Welcome, {user?.fullName || 'Student'}!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {user?.department || 'Computer Science & Engineering'} &bull; GATHERLY Student Portal
            </p>
          </div>

          <Link to="/app/discover">
            <Button variant="primary" icon={Compass}>
              Discover Events
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} hoverable glass>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{stat.title}</span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${stat.color}22`,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
              <div style={{ marginTop: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <Link to={stat.path} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>View Details &rarr;</Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Phase 1 Verification Notice */}
      <Card glass>
        <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} color="var(--success)" /> Phase 1 Application Shell Verified
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          The collapsible sidebar, mobile slide-out drawer, application topbar, and protected routes are fully mounted.
          In <strong>Phase 8</strong>, this dashboard will be fully expanded with live registered event tickets, agenda countdowns, and society announcements.
        </p>
      </Card>
    </div>
  );
};

export default OverviewPage;

