import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  Phone,
  Mail,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Building,
  UserCheck,
  Share2,
  CalendarCheck,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { RegistrationModal } from '../../components/events/RegistrationModal';
import { EventCard } from '../../components/events/EventCard';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredPass, setRegisteredPass] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventData = await eventService.getEventById(id);
        if (!eventData) throw new Error('Event could not be found.');
        setEvent(eventData);

        // Fetch related events in the same category
        if (eventData.category) {
          const allRes = await eventService.getEvents({ category: eventData.category, limit: 4 });
          const all = allRes.data || [];
          setRelatedEvents(all.filter((e) => (e.slug || e.id) !== (eventData.slug || eventData.id)).slice(0, 3));
        }

        // Check if user is already registered for this event
        if (isAuthenticated) {
          try {
            const myRegs = await registrationService.getMyRegistrations();
            const found = (myRegs.data || []).find(
              (r) =>
                (r.event === (eventData._id || eventData.id) ||
                 r.eventSlug === eventData.slug ||
                 r.event === eventData.slug ||
                 r.eventSlug === id ||
                 (r.eventTitle && eventData.title && r.eventTitle.toLowerCase() === eventData.title.toLowerCase())) &&
                r.status !== 'cancelled'
            );
            if (found) {
              setIsRegistered(true);
              setRegisteredPass(found);
            }
          } catch (e) {
            // ignore non-blocking registration check
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, isAuthenticated]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegisterSuccess = (newReg) => {
    setIsRegistered(true);
    if (newReg) {
      setRegisteredPass(newReg);
    }
    if (event) {
      setEvent((prev) => ({
        ...prev,
        registeredCount: (prev.registeredCount || 0) + 1,
      }));
    }
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Loading Event Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Event Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 24px' }}>
          {error || 'The requested campus event does not exist or has been removed.'}
        </p>
        <Link to="/events">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Event Discovery
          </Button>
        </Link>
      </div>
    );
  }

  const isPaid = (event.registrationFee || 0) > 0;
  const spotsLeft = Math.max(0, (event.capacity || 100) - (event.registeredCount || 0));
  const isFull = spotsLeft <= 0;
  const isClosed = event.registrationStatus === 'Closed' || isFull;

  return (
    <div style={{ paddingBottom: 'var(--space-16)' }}>
      {/* Breadcrumb & Navigation Bar */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: 'var(--space-4) 0',
        }}
      >
        <div className="container flex-between">
          <Link
            to="/events"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <ArrowLeft size={16} />
            <span>Discover Events</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            <Share2 size={14} />
            <span>{copied ? 'Copied Link!' : 'Share Event'}</span>
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: 'var(--space-8)' }}>
        {/* A. HERO SECTION */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {/* Banner Image with subtle gradient overlay */}
          <div style={{ position: 'relative', height: '340px', width: '100%', overflow: 'hidden' }}>
            <img
              src={event.image}
              alt={event.title}
              onError={(e) => {
                e.currentTarget.src = '/uploads/events/rhythm_lights_cultural.jpg';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(23,23,25,0.2) 0%, rgba(23,23,25,0.85) 100%)',
              }}
            />

            {/* Badges on Banner */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <Badge variant="primary">{event.category}</Badge>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: isPaid ? 'rgba(var(--primary-rgb), 0.9)' : 'rgba(15, 118, 110, 0.9)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isPaid ? `Entry: ₹${event.registrationFee}` : 'Free Campus Admission'}
              </span>
            </div>
          </div>

          {/* Hero Content Strip */}
          <div style={{ padding: 'var(--space-6) var(--space-8)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div style={{ maxWidth: '780px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--primary)',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Official Campus Event
                </span>
                <h1
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    fontWeight: '800',
                    lineHeight: 1.2,
                    color: 'var(--text-primary)',
                    margin: '6px 0 10px',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {event.title}
                </h1>
                {event.tagline && (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {event.tagline}
                  </p>
                )}
              </div>

              {/* Instant CTA / Status */}
              <div>
                {isRegistered ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--success-bg)',
                      border: '1.5px solid var(--success)',
                      color: 'var(--success)',
                      fontWeight: '700',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Pass Registered</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={isClosed}
                    onClick={() => setModalOpen(true)}
                    icon={CalendarCheck}
                  >
                    {isClosed ? 'Registration Closed' : isPaid ? `Register Now • ₹${event.registrationFee}` : 'Register Free Pass'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT & SIDEBAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 'var(--space-8)', alignItems: 'start' }} className="event-detail-grid">
          {/* LEFT COLUMN: ABOUT, RULES, PRIZES, SCHEDULE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* B. ABOUT THE EVENT */}
            <section
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
              }}
            >
              <h2
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                About the Event
              </h2>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-base)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                }}
              >
                {event.description}
              </div>
            </section>

            {/* D. RULES AND REGULATIONS */}
            {event.rules && event.rules.length > 0 && (
              <section
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-4)' }}>
                  <ShieldAlert size={22} style={{ color: 'var(--primary)' }} />
                  <h2
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading)',
                      margin: 0,
                    }}
                  >
                    Rules & Participation Guidelines
                  </h2>
                </div>

                {event.teamPolicy && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: 'var(--space-5)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <strong>Team Policy: </strong>
                    {event.teamPolicy.note || (event.teamPolicy.allowed ? `Teams of ${event.teamPolicy.minSize} to ${event.teamPolicy.maxSize} students allowed.` : 'Individual student participation only.')}
                  </div>
                )}

                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {event.rules.map((rule, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      {rule}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* E. PRIZES AND REWARDS */}
            {event.prizes && (event.prizes.total || event.prizes.first) && (
              <section
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-6)' }}>
                  <Award size={22} style={{ color: 'var(--accent-secondary)' }} />
                  <div>
                    <h2
                      style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading)',
                        margin: 0,
                      }}
                    >
                      Prizes & Rewards Pool
                    </h2>
                    {event.prizes.total && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                        Total Prize Valuation: {event.prizes.total}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                  {event.prizes.first && (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-elevated)',
                        border: '1.5px solid var(--primary)',
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        🥇 1ST PLACE
                      </span>
                      <p style={{ margin: '6px 0 0', fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {event.prizes.first}
                      </p>
                    </div>
                  )}

                  {event.prizes.second && (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>
                        🥈 2ND PLACE
                      </span>
                      <p style={{ margin: '6px 0 0', fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {event.prizes.second}
                      </p>
                    </div>
                  )}

                  {event.prizes.third && (
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        🥉 3RD PLACE
                      </span>
                      <p style={{ margin: '6px 0 0', fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {event.prizes.third}
                      </p>
                    </div>
                  )}
                </div>

                {event.prizes.perks && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-4)', fontStyle: 'italic' }}>
                    * {event.prizes.perks}
                  </p>
                )}
              </section>
            )}

            {/* EVENT SCHEDULE TIMELINE */}
            {event.schedule && event.schedule.length > 0 && (
              <section
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-6)' }}>
                  <Clock size={22} style={{ color: 'var(--primary)' }} />
                  <h2
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading)',
                      margin: 0,
                    }}
                  >
                    Event Agenda & Schedule
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {event.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 'bold',
                          color: 'var(--primary)',
                          minWidth: '130px',
                          flexShrink: 0,
                        }}
                      >
                        {item.time}
                      </span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                          {item.activity}
                        </p>
                        {item.speakerOrVenue && (
                          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.speakerOrVenue}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* F. ORGANIZING COMMITTEE (MANDATORY DEDICATED SECTION) */}
            {event.organizingCommittee && (
              <section
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-8)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-5)' }}>
                  <Building size={22} style={{ color: 'var(--primary)' }} />
                  <div>
                    <h2
                      style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading)',
                        margin: 0,
                      }}
                    >
                      Organizing Committee & Society
                    </h2>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                      Official campus society coordinators
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '700' }}>
                      HOST SOCIETY / DEPARTMENT
                    </span>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: '2px 0 0' }}>
                      {event.organizingCommittee.societyName}
                    </h4>
                  </div>

                  {event.organizingCommittee.organizerName && (
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <strong>Coordinator: </strong> {event.organizingCommittee.organizerName}
                    </p>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <UserCheck size={16} style={{ color: 'var(--primary)' }} />
                      <span>{event.organizingCommittee.contactPerson}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <Phone size={16} style={{ color: 'var(--accent-secondary)' }} />
                      <a href={`tel:${event.organizingCommittee.contactPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {event.organizingCommittee.contactPhone}
                      </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <Mail size={16} style={{ color: 'var(--primary)' }} />
                      <a href={`mailto:${event.organizingCommittee.contactEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {event.organizingCommittee.contactEmail}
                      </a>
                    </div>
                  </div>

                  {event.organizingCommittee.officeLocation && (
                    <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <strong>Office: </strong> {event.organizingCommittee.officeLocation}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: EVENT INFORMATION MATRIX & REGISTRATION PANEL */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 20px)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* C & G: EVENT INFORMATION MATRIX */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-4)',
                  paddingBottom: 'var(--space-3)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                Event Logistics
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Date */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Calendar size={18} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Date & Duration</span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                      {event.date} {event.endDate ? `to ${event.endDate}` : ''}
                    </strong>
                  </div>
                </div>

                {/* Time */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Clock size={18} style={{ color: 'var(--accent-secondary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Timing</span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{event.time}</strong>
                  </div>
                </div>

                {/* Venue */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Campus Venue</span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{event.venue}</strong>
                  </div>
                </div>

                {/* Capacity */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Users size={18} style={{ color: 'var(--accent-secondary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Available Spots</span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: spotsLeft < 20 ? 'var(--error)' : 'var(--text-primary)' }}>
                      {spotsLeft} spots remaining ({event.capacity} total)
                    </strong>
                  </div>
                </div>

                {/* Deadline */}
                {event.registrationDeadline && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CalendarCheck size={18} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Deadline</span>
                      <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(event.registrationDeadline).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Fee & Action CTA */}
              <div
                style={{
                  marginTop: 'var(--space-6)',
                  paddingTop: 'var(--space-5)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Registration Fee:</span>
                  <span
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '900',
                      fontFamily: 'var(--font-mono)',
                      color: isPaid ? 'var(--primary)' : 'var(--success)',
                    }}
                  >
                    {isPaid ? `₹${event.registrationFee}` : 'FREE ENTRY'}
                  </span>
                </div>

                {isRegistered ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--success-bg)',
                        border: '1px solid var(--success)',
                        textAlign: 'center',
                        color: 'var(--success)',
                        fontWeight: 'bold',
                        fontSize: 'var(--text-xs)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Already Registered</span>
                    </div>
                    <Link to={`/app/passes/${registeredPass?.passId || ''}`} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="md" fullWidth icon={Ticket}>
                        View Digital Pass
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    disabled={isClosed}
                    onClick={() => setModalOpen(true)}
                    icon={CalendarCheck}
                  >
                    {isClosed ? 'Registration Full / Closed' : isPaid ? `Register Pass • ₹${event.registrationFee}` : 'Register Free Pass'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* H. RELATED EVENTS */}
        {relatedEvents.length > 0 && (
          <div style={{ marginTop: 'var(--space-16)', paddingTop: 'var(--space-10)', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                More in {event.category}
              </span>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0 0' }}>
                Related Campus Activities
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {relatedEvents.map((rel) => (
                <EventCard key={rel.slug || rel.id} event={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL */}
      <RegistrationModal
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRegistered={handleRegisterSuccess}
      />
    </div>
  );
};

export default EventDetailsPage;

