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
  Trophy,
  Check,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { registrationService } from '../../services/registrationService';
import { Button } from '../../components/common/Button';
import { StudentResultModal } from '../../components/events/StudentResultModal';

export const OverviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedEventForResult, setSelectedEventForResult] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    student: null,
    stats: {
      registeredEvents: 0,
      upcomingEvents: 0,
      admittedEvents: 0,
      completedEvents: 0,
    },
    upcomingEvents: [],
    recentlyCompletedEvents: [],
    registeredEvents: [],
    allRegisteredCount: 0,
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

  const { stats, registeredEvents } = dashboardData;
  const studentName = user?.fullName || dashboardData.student?.fullName || 'Student';

  // Group events into Upcoming (Group A) and Recently Completed (Group B)
  const upcomingList = dashboardData.upcomingEvents?.length > 0
    ? dashboardData.upcomingEvents
    : registeredEvents.filter((r) => r.isUpcoming && !r.isCancelled);

  const recentlyCompletedList = dashboardData.recentlyCompletedEvents?.length > 0
    ? dashboardData.recentlyCompletedEvents
    : registeredEvents.filter((r) => r.isCompleted && !r.isCancelled && r.retentionInfo?.isDashboardRetained).slice(0, 2);

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

  // Render Full-Width Registered Event Card
  const renderRegisteredEventCard = (event) => {
    const isCompleted = Boolean(event.isCompleted);
    const hasResults = Boolean(event.hasResults);
    const resultsPublished = Boolean(event.resultsPublished);
    const resultsAwaited = isCompleted && hasResults && !resultsPublished;
    const isWinner = Boolean(event.resultDetails?.isWinner);

    return (
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
          height: '100%',
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
        {/* Event Image Banner (140px height, compact proportion) */}
        <div
          style={{
            height: '140px',
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
              e.currentTarget.src = '/uploads/events/rhythm_lights_cultural.jpg';
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
              background: 'rgba(23, 23, 25, 0.78)',
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

          {/* Winner or Results Awaited Banner on Top Right */}
          {resultsPublished && isWinner && (
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '3px 9px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(217, 119, 6, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#FFF',
                fontSize: '0.65rem',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Trophy size={11} />
              {event.resultDetails?.rank ? event.resultDetails.rank.split('(')[0].trim() : 'Award Won'}
            </span>
          )}

          {resultsAwaited && (
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '3px 9px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(20, 184, 166, 0.88)',
                backdropFilter: 'blur(8px)',
                color: '#FFF',
                fontSize: '0.65rem',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Clock size={11} />
              Results Awaited
            </span>
          )}
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
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.7em',
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
                gap: '6px',
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
                    maxWidth: '260px',
                  }}
                >
                  {event.eventVenue || 'Campus Grounds'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Controls: Pass ID, Entry Status & Action Buttons */}
          <div
            style={{
              paddingTop: '10px',
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

            {/* Action Buttons: View Results (when published) + View Digital Pass */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: resultsPublished ? '1fr 1fr' : '1fr',
                gap: '8px',
              }}
            >
              {resultsPublished && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Trophy}
                  onClick={() => {
                    setSelectedEventForResult(event);
                    setResultModalOpen(true);
                  }}
                  style={{
                    fontSize: 'var(--text-xs)',
                    padding: '6px 10px',
                  }}
                >
                  View Results
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                fullWidth={!resultsPublished}
                icon={Ticket}
                onClick={() => navigate(`/app/passes/${event.passId || event.registrationId}`)}
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: '6px 10px',
                }}
              >
                View Digital Pass
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              Here's what's happening with your campus events.
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
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
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
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
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
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
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
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Past events concluded
            </div>
          </div>
        </div>
      </section>

      {/* 3. FULL-WIDTH PRIMARY CONTENT: MY REGISTERED EVENTS (NO 60:40, NO SCHEDULE) */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
          width: '100%',
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
              Your registered campus events, digital passes and entry statuses in chronological order.
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
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
          >
            <span>View Permanent History</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="gatherly-dashboard-grid">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: '320px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : upcomingList.length === 0 && recentlyCompletedList.length === 0 ? (
          /* Empty State */
          <div
            style={{
              padding: 'var(--space-12) var(--space-6)',
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
            <Ticket size={44} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
            <h3
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              No Registered Events Yet
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                margin: '8px 0 18px',
                maxWidth: '380px',
              }}
            >
              Explore upcoming campus fests, workshops, coding hackathons and sports tourneys to reserve your entry pass.
            </p>
            <Link to="/events">
              <Button variant="primary" size="sm" icon={Compass}>
                Explore Campus Events
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* GROUP A: UPCOMING REGISTERED EVENTS (Chronological Order: Earliest First) */}
            {upcomingList.length > 0 && (
              <div className="gatherly-dashboard-grid">
                {upcomingList.map((event) => renderRegisteredEventCard(event))}
              </div>
            )}

            {/* GROUP B: RECENTLY COMPLETED EVENTS (Retained under 7-Day Result Announcement Rule) */}
            {recentlyCompletedList.length > 0 && (
              <div style={{ marginTop: 'var(--space-4)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingTop: 'var(--space-6)',
                    borderTop: '1px solid var(--border-subtle)',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-heading)',
                          margin: 0,
                        }}
                      >
                        Recently Completed
                      </h3>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          color: 'var(--primary)',
                          background: 'var(--bg-elevated)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        Results & Prize Access
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                      Competitions remain accessible for one week following official result publication.
                    </p>
                  </div>

                  <Link
                    to="/app/registrations"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '700',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Archive in My Registrations</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="gatherly-dashboard-grid">
                  {recentlyCompletedList.map((event) => renderRegisteredEventCard(event))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* 4. OFFICIAL EVENT RESULT & PRIZE MODAL */}
      <StudentResultModal
        isOpen={resultModalOpen}
        onClose={() => {
          setResultModalOpen(false);
          setSelectedEventForResult(null);
        }}
        event={selectedEventForResult}
      />
    </div>
  );
};

export default OverviewPage;