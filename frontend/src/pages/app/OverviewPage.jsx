import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  User,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { registrationService } from '../../services/registrationService';
import { passService } from '../../services/passService';
import { eventService } from '../../services/eventService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const OverviewPage = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [passes, setPasses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [regRes, passRes, upRes] = await Promise.all([
          registrationService.getMyRegistrations().catch(() => ({ data: [] })),
          passService.getMyPasses().catch(() => ({ data: [] })),
          eventService.getUpcomingEvents(3).catch(() => []),
        ]);

        setRegistrations(regRes.data || []);
        setPasses(passRes.data || []);
        setUpcomingEvents(Array.isArray(upRes) ? upRes : upRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRegistered = registrations.length;
  const attendedCount = registrations.filter((r) => r.checkedIn || r.status === 'attended').length;
  const activePassCount = passes.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 1. PERSONALIZED WELCOME SECTION */}
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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
            <span>Student Dashboard</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              marginBottom: '6px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Welcome back, {user?.fullName ? user.fullName.split(' ')[0] : 'Scholar'}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>
            {user?.department || 'Computer Science & Engineering'} &bull; ID: {user?.studentId || 'STU-2026-089'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/events">
            <Button variant="primary" size="md" icon={Compass}>
              Discover Events
            </Button>
          </Link>
          <Link to="/app/passes">
            <Button variant="secondary" size="md" icon={Ticket}>
              My Digital Passes ({activePassCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. SUMMARY METRICS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5) var(--space-6)',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Registered Events
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)', margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
            {totalRegistered}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Active registrations on record
          </p>
        </div>

        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5) var(--space-6)',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Digital Passes
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-secondary)', margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
            {activePassCount}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Ready for QR gate admission
          </p>
        </div>

        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5) var(--space-6)',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Attended Events
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
            {attendedCount}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Gate check-ins confirmed
          </p>
        </div>

        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5) var(--space-6)',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            Campus Status
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)', margin: '8px 0 4px', fontFamily: 'var(--font-heading)' }}>
            Active Scholar
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Fall Term 2026
          </p>
        </div>
      </div>

      {/* 3. MY REGISTERED EVENTS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              My Registered Events
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Events you have confirmed admission for
            </p>
          </div>

          {registrations.length > 0 && (
            <Link to="/app/registrations" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All Registrations
              </Button>
            </Link>
          )}
        </div>

        {registrations.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-10)',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-secondary)',
              border: '1.5px dashed var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <Ticket size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
              No Event Registrations Yet
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '6px 0 16px' }}>
              Explore upcoming campus hackathons, cultural fests, and workshops to claim your passes.
            </p>
            <Link to="/events">
              <Button variant="primary" size="sm" icon={Compass}>
                Explore Campus Events
              </Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {registrations.slice(0, 4).map((reg) => (
              <div
                key={reg._id || reg.registrationId}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Event Image */}
                <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={reg.eventImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'}
                    alt={reg.eventTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(23, 23, 25, 0.85)',
                      color: 'var(--primary)',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 'bold',
                    }}
                  >
                    {reg.eventCategory || 'Technical'}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                    }}
                  >
                    <Badge variant={reg.status === 'confirmed' ? 'success' : reg.status === 'attended' ? 'primary' : 'error'}>
                      {reg.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {reg.passId}
                  </span>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)', margin: '4px 0 10px', lineHeight: 1.3 }}>
                    {reg.eventTitle}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-5)', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} style={{ color: 'var(--primary)' }} />
                      <span>{reg.eventDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} style={{ color: 'var(--accent-secondary)' }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {reg.eventVenue}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/events/${reg.eventSlug || reg.event}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <Button variant="ghost" size="sm" fullWidth>
                        View Details
                      </Button>
                    </Link>
                    <Link to="/app/passes" style={{ flex: 1, textDecoration: 'none' }}>
                      <Button variant="primary" size="sm" fullWidth icon={Ticket}>
                        Digital Pass
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. UPCOMING CAMPUS EVENTS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Discover More Campus Events
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Recommended activities across your university calendar
            </p>
          </div>

          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" icon={Compass} iconPosition="right">
              Explore All
            </Button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {upcomingEvents.slice(0, 3).map((evt) => (
            <div
              key={evt.slug || evt.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {evt.category}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{evt.date}</span>
              </div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 6px', lineHeight: 1.3 }}>
                {evt.title}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {evt.tagline || evt.description}
              </p>

              <Link to={`/events/${evt.slug || evt.id}`} style={{ marginTop: 'auto', textDecoration: 'none' }}>
                <Button variant="secondary" size="sm" fullWidth icon={ArrowRight} iconPosition="right">
                  View Event
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
