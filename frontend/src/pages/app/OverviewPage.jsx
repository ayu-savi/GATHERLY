import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CheckCircle2,
  CalendarCheck,
  Compass,
  ArrowRight,
  Printer,
  Download,
  X,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { registrationService } from '../../services/registrationService';
import { Button } from '../../components/common/Button';

export const OverviewPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      registeredEvents: 0,
      upcomingEvents: 0,
      admittedEvents: 0,
      completedEvents: 0,
    },
    registeredEvents: [],
  });

  // Selected pass for viewing in modal
  const [selectedPass, setSelectedPass] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await registrationService.getDashboardSummary();
      if (res && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
      setError('Could not retrieve student activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const { stats, registeredEvents } = dashboardData;
  const studentName = user?.fullName || dashboardData.student?.fullName || 'Student';

  // Format date helper: "2026-11-20" -> "Nov 20, 2026"
  const formatDate = (dateString) => {
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

  // Ticket text download
  const handleDownloadTicket = (pass) => {
    const ticketText = `
==================================================
              GATHERLY CAMPUS PASS
            Discover. Connect. Celebrate.
==================================================
PASS ID: ${pass.passId}
REGISTRATION ID: ${pass.registrationId}
STATUS: ${pass.status.toUpperCase()}
CHECKED-IN: ${pass.checkedIn ? 'YES (Admitted)' : 'NO (Pending Entry)'}

EVENT: ${pass.eventTitle}
DATE: ${pass.eventDate}
TIME: ${pass.eventTime}
VENUE: ${pass.eventVenue}

ATTENDEE: ${pass.participantName}
EMAIL: ${pass.participantEmail}
STUDENT ID: ${pass.studentId || 'N/A'}
DEPARTMENT: ${pass.department || 'N/A'}
${pass.teamName ? `TEAM NAME: ${pass.teamName}` : 'TYPE: Individual Entry'}

QR TOKEN: ${pass.qrToken}
==================================================
Present this pass at campus gate for admission.
==================================================
    `.trim();

    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pass.passId}_Gatherly_Ticket.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* =========================================================================
          1. DASHBOARD WELCOME SECTION (Compact & Focused)
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          paddingBottom: 'var(--space-3)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 2.8vw, 1.95rem)',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 4px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back, {studentName}!
          </h1>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Here's what's happening with your campus events.
          </p>
        </div>

        <Link to="/events" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="sm" icon={Compass}>
            Discover Events
          </Button>
        </Link>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--error-bg)',
            border: '1px solid var(--error)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-xs)',
          }}
        >
          {error}
        </div>
      )}

      {/* =========================================================================
          2. FOUR DASHBOARD STATISTIC CARDS (Compact 4-Column Grid)
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
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
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Registered Events
            </span>
            <Ticket size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
              {loading ? '—' : stats.registeredEvents}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Valid registrations on record
            </span>
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
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Upcoming Events
            </span>
            <Calendar size={16} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
              {loading ? '—' : stats.upcomingEvents}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Scheduled in future
            </span>
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
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Admitted / Checked In
            </span>
            <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--success)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
              {loading ? '—' : stats.admittedEvents}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Confirmed gate scans
            </span>
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
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Completed Events
            </span>
            <Award size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--text-secondary)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
              {loading ? '—' : stats.completedEvents}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Past campus activities
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. MY REGISTERED EVENTS SECTION (Clean, Compact Registered Cards)
          ========================================================================= */}
      <section style={{ marginTop: 'var(--space-2)' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'var(--font-heading)',
              }}
            >
              My Registered Events
            </h2>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                margin: '2px 0 0',
              }}
            >
              Your campus events, registrations and entry status.
            </p>
          </div>

          <Link
            to="/app/registrations"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: '600',
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All Registrations</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Retrieving student activity...
          </div>
        )}

        {/* 4. EMPTY STATES */}
        {!loading && registeredEvents.length === 0 && (
          <div
            style={{
              padding: 'var(--space-10)',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-secondary)',
              border: '1.5px dashed var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <Ticket size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
              No registrations yet
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '4px 0 16px' }}>
              Discover campus events and reserve your spot.
            </p>
            <Link to="/events" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm" icon={Compass}>
                Explore Events
              </Button>
            </Link>
          </div>
        )}

        {/* Compact Registered Event Cards Grid */}
        {!loading && registeredEvents.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            {registeredEvents.map((item) => {
              const {
                registrationId,
                passId,
                eventTitle,
                eventDate,
                eventTime,
                eventVenue,
                eventImage,
                entryStatus,
              } = item;

              const isReadyForEntry = entryStatus.code === 'ready_for_entry';
              const isCheckedIn = entryStatus.code === 'checked_in';
              const isCompleted = entryStatus.code === 'event_completed';
              const isCancelled = entryStatus.code === 'cancelled';

              return (
                <article
                  key={passId || registrationId}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* 1. Event Image Container */}
                  <div style={{ position: 'relative', width: '100%', height: '150px', overflow: 'hidden' }}>
                    <img
                      src={eventImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'}
                      alt={eventTitle}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Top Pass Reference Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(23, 23, 25, 0.88)',
                        backdropFilter: 'blur(6px)',
                        color: 'var(--primary)',
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '700',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {passId}
                    </div>

                    {/* Entry Status Indicator on Image Top Right */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(23, 23, 25, 0.90)',
                        backdropFilter: 'blur(6px)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        color: '#FFFFFF',
                      }}
                    >
                      {/* Green dot for Ready for Entry */}
                      {isReadyForEntry && (
                        <>
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#10B981',
                              boxShadow: '0 0 6px #10B981',
                              display: 'inline-block',
                            }}
                          />
                          <span style={{ color: '#A7F3D0' }}>Ready for Entry</span>
                        </>
                      )}

                      {/* Checked in indicator */}
                      {isCheckedIn && (
                        <>
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: 'var(--primary)',
                              display: 'inline-block',
                            }}
                          />
                          <span>Checked In</span>
                        </>
                      )}

                      {/* Event Completed */}
                      {isCompleted && (
                        <>
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#9CA3AF',
                              display: 'inline-block',
                            }}
                          />
                          <span style={{ color: '#D1D5DB' }}>Event Completed</span>
                        </>
                      )}

                      {/* Cancelled */}
                      {isCancelled && (
                        <>
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#EF4444',
                              display: 'inline-block',
                            }}
                          />
                          <span style={{ color: '#FCA5A5' }}>Cancelled</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 2-6. Content: Title, Date, Time, Venue, Pass Number */}
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    {/* 2. Event Title */}
                    <h3
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                        margin: '0 0 var(--space-3)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.7em',
                      }}
                    >
                      {eventTitle}
                    </h3>

                    {/* 3-5. Date, Time, Venue */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        fontSize: '0.73rem',
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--space-4)',
                        marginTop: 'auto',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {formatDate(eventDate)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                        <span>{eventTime || 'All Day Event'}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {eventVenue}
                        </span>
                      </div>
                    </div>

                    {/* 8. View Digital Pass Button */}
                    <Button
                      variant={isReadyForEntry ? 'primary' : 'secondary'}
                      size="sm"
                      fullWidth
                      icon={Ticket}
                      onClick={() => setSelectedPass(item)}
                    >
                      View Digital Pass
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. DIGITAL PASS MODAL (Opens only on click — No QR clutter on dashboard)
          ========================================================================= */}
      {selectedPass && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setSelectedPass(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--bg-overlay)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 1001,
              animation: 'fadeIn 0.18s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-elevated)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket size={16} style={{ color: 'var(--primary)' }} />
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  GATHERLY Verified Entry Pass
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPass(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Full Ticket Details */}
            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  EVENT PASS IDENTIFIER
                </span>
                <h3
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '2px 0 0',
                    lineHeight: 1.3,
                  }}
                >
                  {selectedPass.eventTitle}
                </h3>
              </div>

              {/* Status Banner */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedPass.entryStatus.code === 'ready_for_entry' ? 'var(--success-bg)' : 'var(--bg-elevated)',
                  border: `1px solid ${selectedPass.entryStatus.code === 'ready_for_entry' ? 'var(--success)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>Admission Status:</span>
                <strong style={{ color: selectedPass.entryStatus.code === 'ready_for_entry' ? 'var(--success)' : 'var(--text-primary)' }}>
                  {selectedPass.entryStatus.label}
                </strong>
              </div>

              {/* QR Code Container */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 0 1px var(--border-subtle)',
                }}
              >
                <div
                  style={{ width: '160px', height: '160px' }}
                  dangerouslySetInnerHTML={{ __html: selectedPass.qrSvg }}
                />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '900',
                    color: '#171719',
                    marginTop: '8px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {selectedPass.passId}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#6B7280', marginTop: '2px' }}>
                  Scan at admission gate with Gate Verifier
                </span>
              </div>

              {/* Ticket Details Matrix */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  fontSize: '0.75rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    Attendee
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedPass.participantName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    Student ID
                  </span>
                  <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {selectedPass.studentId || 'STU-2026-089'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    Date & Time
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {selectedPass.eventDate} ({selectedPass.eventTime})
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    Venue
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedPass.eventVenue}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button variant="secondary" size="sm" fullWidth icon={Printer} onClick={() => window.print()}>
                  Print Pass
                </Button>
                <Button variant="ghost" size="sm" fullWidth icon={Download} onClick={() => handleDownloadTicket(selectedPass)}>
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
