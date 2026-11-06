import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  MapPin,
  ArrowRight,
  Compass,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { registrationService } from '../../services/registrationService';
import { Button } from '../../components/common/Button';

export const OverviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    student: null,
    stats: {
      registeredEvents: 0,
      upcomingEvents: 0,
      admittedEvents: 0,
      completedEvents: 0,
    },
    registeredEvents: [],
    upcomingSchedule: [],
    totalUpcomingSchedule: 0,
  });

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await registrationService.getDashboardSummary();
      if (res && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
      setError('Unable to load your campus activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const { stats, registeredEvents, upcomingSchedule, totalUpcomingSchedule } = dashboardData;
  const studentName = user?.fullName || dashboardData.student?.fullName || 'Student';

  // Calculate balanced card distribution across 60:40 layout:
  // Left column (60%) shows initial registered events in a 2-column grid.
  // Right column (40%) shows Your Schedule at top, and continues displaying
  // normal registered event cards stacked below it to naturally balance column heights without empty space.
  const rightCardsCount = registeredEvents.length > 2 ? Math.min(2, registeredEvents.length - 2) : 0;
  const leftEvents = registeredEvents.slice(0, registeredEvents.length - rightCardsCount);
  const rightEvents = registeredEvents.slice(registeredEvents.length - rightCardsCount);

  // Date formatting helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Render status badge for registered event card
  const renderEntryStatus = (entryStatus) => {
    const code = entryStatus?.code || 'ready_for_entry';

    if (code === 'ready_for_entry') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            fontWeight: '700',
            color: 'var(--success)',
            background: 'var(--success-bg)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 6px var(--success)',
            }}
          />
          Ready for Entry
        </span>
      );
    }

    if (code === 'checked_in') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            fontWeight: '700',
            color: 'var(--primary)',
            background: 'var(--bg-elevated)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--primary)',
          }}
        >
          <Check size={12} strokeWidth={2.5} />
          Checked In
        </span>
      );
    }

    if (code === 'event_completed') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.72rem',
            fontWeight: '600',
            color: 'var(--text-muted)',
            background: 'var(--bg-elevated)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          Event Completed
        </span>
      );
    }

    if (code === 'cancelled') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.72rem',
            fontWeight: '600',
            color: 'var(--error)',
            background: 'var(--error-bg)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--error)',
          }}
        >
          Cancelled
        </span>
      );
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '0.72rem',
          fontWeight: '600',
          color: 'var(--text-muted)',
          background: 'var(--bg-elevated)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-full)',
        }}
      >
        {entryStatus?.label || 'Confirmed'}
      </span>
    );
  };

  // Render identical Registered Event Card across both Left (60%) and Right (40%) columns
  const renderRegisteredEventCard = (event) => (
    <div
      key={event._id || event.registrationId}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-normal)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Event Image Banner (135px height, compact crop) */}
      <div
        style={{
          height: '135px',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-elevated)',
        }}
      >
        <img
          src={event.eventImage}
          alt={event.eventTitle}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Category Ribbon */}
        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(23, 23, 25, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#FFF',
            fontSize: '0.65rem',
            fontWeight: '700',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {event.eventCategory || 'Campus'}
        </span>
      </div>

      {/* Event Details Content */}
      <div
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          {/* Event Title */}
          <h3
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: '800',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              margin: '0 0 8px',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            title={event.eventTitle}
          >
            {event.eventTitle}
          </h3>

          {/* Meta: Date, Time & Venue */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ fontWeight: '600' }}>{formatDate(event.eventDate)}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <Clock size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-muted)' }}>
                {event.eventTime ? event.eventTime.split('-')[0].trim() : 'TBA'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '220px',
                }}
              >
                {event.eventVenue || 'Campus Grounds'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Info: Pass Number & Entry Status */}
        <div
          style={{
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                background: 'var(--bg-elevated)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              #{event.passId || event.registrationId}
            </span>

            {renderEntryStatus(event.entryStatus)}
          </div>

          {/* View Digital Pass Button */}
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            icon={Ticket}
            onClick={() => navigate(`/app/passes/${event.passId || event.registrationId}`)}
            style={{
              fontSize: 'var(--text-xs)',
              padding: '6px 12px',
            }}
          >
            View Digital Pass
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        width: '100%',
      }}
    >
      {/* 1. COMPACT PERSONALIZED WELCOME SECTION */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          padding: 'var(--space-4) var(--space-6)',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-secondary) 100%)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)',
              flexShrink: 0,
            }}
          >
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                fontWeight: '800',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Welcome back, {studentName}!
            </h1>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                margin: '3px 0 0',
                fontWeight: '500',
              }}
            >
              Your campus activities at a glance.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" icon={Compass}>
              Discover Events
            </Button>
          </Link>
          <Link to="/app/passes" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm" icon={Ticket}>
              My Passes
            </Button>
          </Link>
        </div>
      </section>

      {/* ERROR BANNER */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--error-bg)',
            border: '1px solid var(--error)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--error)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="xs" onClick={loadDashboard} icon={RefreshCw}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. FOUR STUDENT ACTIVITY STATISTIC CARDS */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {/* Card 1: Registered Events */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
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
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Ticket size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '1.65rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.1,
              }}
            >
              {loading ? '—' : stats.registeredEvents}
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginTop: '2px',
              }}
            >
              Registered Events
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
              }}
            >
              Total active registrations
            </div>
          </div>
        </div>

        {/* Card 2: Upcoming Events */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-secondary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '1.65rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.1,
              }}
            >
              {loading ? '—' : stats.upcomingEvents}
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginTop: '2px',
              }}
            >
              Upcoming Events
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
              }}
            >
              Scheduled in future
            </div>
          </div>
        </div>

        {/* Card 3: Admitted / Checked In */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--success)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '1.65rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.1,
              }}
            >
              {loading ? '—' : stats.admittedEvents}
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginTop: '2px',
              }}
            >
              Admitted / Checked In
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
              }}
            >
              Gate admissions scanned
            </div>
          </div>
        </div>

        {/* Card 4: Completed Events */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--text-muted)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Award size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '1.65rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.1,
              }}
            >
              {loading ? '—' : stats.completedEvents}
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginTop: '2px',
              }}
            >
              Completed Events
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
              }}
            >
              Past events concluded
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT AREA — 60:40 BALANCED LAYOUT */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
        className="dashboard-main-grid"
      >
        {/* LEFT COLUMN — 60%: MY REGISTERED EVENTS (GROWS NATURALLY) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                My Registered Events
              </h2>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  margin: '3px 0 0',
                }}
              >
                Your campus events, registrations and entry status.
              </p>
            </div>

            <Link
              to="/app/registrations"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 'var(--text-xs)',
                fontWeight: '700',
                color: 'var(--primary)',
                textDecoration: 'none',
                padding: '4px 8px',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span>View All Registrations</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Registered Events 2-Column Grid (Unrestricted, grows downward seamlessly) */}
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    height: '280px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              ))}
            </div>
          ) : registeredEvents.length === 0 ? (
            <div
              style={{
                padding: 'var(--space-10) var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-secondary)',
                border: '1.5px dashed var(--border-subtle)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ticket size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <h3
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                No Registrations Yet
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  margin: '6px 0 16px',
                  maxWidth: '360px',
                }}
              >
                Explore exciting campus fests, workshops, and competitions to register and reserve your entry passes.
              </p>
              <Link to="/events">
                <Button variant="primary" size="sm" icon={Compass}>
                  Explore Events
                </Button>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              {leftEvents.map((event) => renderRegisteredEventCard(event))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — 40%: YOUR SCHEDULE + REGISTERED EVENT CARDS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          {/* 1. PRIMARY SECTION: YOUR SCHEDULE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {/* Schedule Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Your Schedule
                </h2>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    margin: '3px 0 0',
                  }}
                >
                  Your upcoming registered events.
                </p>
              </div>

              {totalUpcomingSchedule > 5 && (
                <Link
                  to="/app/registrations"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '700',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                  }}
                >
                  <span>View Full Schedule</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>

            {/* Schedule Container */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {loading ? (
                <div
                  style={{
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  Loading upcoming schedule...
                </div>
              ) : upcomingSchedule.length === 0 ? (
                <div
                  style={{
                    padding: 'var(--space-8) var(--space-4)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Calendar size={36} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
                  <h3
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    No upcoming events
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      margin: '6px 0 14px',
                      maxWidth: '280px',
                    }}
                  >
                    Discover campus events and register for something exciting.
                  </p>
                  <Link to="/events">
                    <Button variant="primary" size="xs" icon={Compass}>
                      Explore Events
                    </Button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {upcomingSchedule.map((item, index) => {
                    const isLast = index === upcomingSchedule.length - 1;

                    return (
                      <div
                        key={item._id || item.registrationId}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '14px',
                          padding: '12px 10px',
                          borderRadius: 'var(--radius-md)',
                          background: item.isNext ? 'var(--bg-elevated)' : 'transparent',
                          border: item.isNext ? '1px solid var(--primary)' : '1px solid transparent',
                          borderBottom: !isLast && !item.isNext ? '1px solid var(--border-subtle)' : undefined,
                          marginBottom: item.isNext ? '8px' : '0',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          if (!item.isNext) e.currentTarget.style.background = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (!item.isNext) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {/* Date Badge */}
                        <div
                          style={{
                            width: '48px',
                            height: '52px',
                            borderRadius: 'var(--radius-md)',
                            background: item.isToday
                              ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent-secondary) 100%)'
                              : 'var(--bg-elevated)',
                            border: item.isToday ? 'none' : '1px solid var(--border-subtle)',
                            color: item.isToday ? 'var(--text-inverse)' : 'var(--text-primary)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: item.isToday ? 'var(--shadow-sm)' : 'none',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: '800',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              fontFamily: 'var(--font-mono)',
                              lineHeight: 1,
                            }}
                          >
                            {item.dateBadge?.month || 'DATE'}
                          </span>
                          <span
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: '800',
                              fontFamily: 'var(--font-heading)',
                              lineHeight: 1.1,
                              marginTop: '2px',
                            }}
                          >
                            {item.dateBadge?.day || '--'}
                          </span>
                        </div>

                        {/* Event Meta */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '6px',
                              marginBottom: '4px',
                            }}
                          >
                            {item.isToday && (
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  fontWeight: '800',
                                  padding: '1px 6px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'var(--primary)',
                                  color: 'var(--text-inverse)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                Today
                              </span>
                            )}

                            {item.isNext && !item.isToday && (
                              <span
                                style={{
                                  fontSize: '0.62rem',
                                  fontWeight: '800',
                                  padding: '1px 6px',
                                  borderRadius: 'var(--radius-full)',
                                  background: 'var(--accent-secondary)',
                                  color: 'var(--text-inverse)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                              >
                                <Sparkles size={10} />
                                Next Event
                              </span>
                            )}

                            <h4
                              style={{
                                fontSize: 'var(--text-xs)',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-heading)',
                                margin: 0,
                                lineHeight: 1.3,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                flex: 1,
                              }}
                              title={item.eventTitle}
                            >
                              {item.eventTitle}
                            </h4>
                          </div>

                          {/* Time & Venue */}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Clock size={11} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                              <span>{item.eventTime || 'Time TBA'}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <MapPin size={11} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                              <span
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.eventVenue || 'Campus Venue'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. REGISTERED EVENT CARDS BELOW YOUR SCHEDULE */}
          {rightEvents && rightEvents.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              {rightEvents.map((event) => renderRegisteredEventCard(event))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OverviewPage;
