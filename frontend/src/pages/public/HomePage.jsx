import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  Users,
  CheckCircle2,
  Layers,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  Search,
  Code2,
  Music,
  Trophy,
  Gamepad2,
  BookOpen,
  Briefcase,
  Rocket,
  Palette,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin,
  ArrowUpRight,
  Ticket,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { EventCard } from '../../components/events/EventCard';
import { eventService } from '../../services/eventService';
import { useToast } from '../../hooks/useToast';

const CATEGORY_ICONS = {
  Code2,
  Music,
  Trophy,
  Gamepad2,
  BookOpen,
  Briefcase,
  Rocket,
  Palette,
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);

  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hostFormData, setHostFormData] = useState({
    societyName: '',
    eventTitle: '',
    category: 'Technical',
    contactEmail: '',
  });

  const fetchHomepageData = async () => {
    setApiError(null);

    // 1. Featured Events
    try {
      setLoadingFeatured(true);
      const featured = await eventService.getFeaturedEvents(4);
      setFeaturedEvents(featured);
    } catch (err) {
      console.warn('Failed to load featured events:', err.message);
      setApiError('Unable to connect to backend server. Ensure backend is running on port 5000.');
    } finally {
      setLoadingFeatured(false);
    }

    // 2. Upcoming Events
    try {
      setLoadingUpcoming(true);
      const upcoming = await eventService.getUpcomingEvents(3);
      setUpcomingEvents(upcoming);
    } catch (err) {
      console.warn('Failed to load upcoming events:', err.message);
    } finally {
      setLoadingUpcoming(false);
    }

    // 3. Categories
    try {
      setLoadingCategories(true);
      const cats = await eventService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.warn('Failed to load categories:', err.message);
    } finally {
      setLoadingCategories(false);
    }

    // 4. Statistics
    try {
      setLoadingStats(true);
      const statsData = await eventService.getHomepageStats();
      setStats(statsData);
    } catch (err) {
      console.warn('Failed to load stats:', err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      navigate(`/events?q=${encodeURIComponent(heroSearchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleHostSubmit = (e) => {
    e.preventDefault();
    setHostModalOpen(false);
    showToast(`Proposal registered for "${hostFormData.eventTitle}". We will notify you!`, 'success');
    setHostFormData({ societyName: '', eventTitle: '', category: 'Technical', contactEmail: '' });
  };

  // Lead featured event + side featured events
  const leadFeatured = featuredEvents.length > 0 ? featuredEvents[0] : null;
  const secondaryFeatured = featuredEvents.length > 1 ? featuredEvents.slice(1, 4) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)', paddingBottom: 'var(--space-20)' }}>
      {/* =========================================================================
          1. ASYMMETRIC EDITORIAL HERO SECTION
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          paddingTop: 'var(--space-12)',
          paddingBottom: 'var(--space-6)',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-10)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Bold Editorial Typography & Direct Action */}
            <div style={{ maxWidth: '620px' }}>
              <div className="editorial-eyebrow">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                <span>The Unified Campus Stage</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: '900',
                  lineHeight: 1.08,
                  letterSpacing: '-0.04em',
                  marginBottom: 'var(--space-5)',
                  color: 'var(--text-primary)',
                }}
              >
                Where campus ideas meet their{' '}
                <span className="text-gradient">spotlight.</span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  marginBottom: 'var(--space-8)',
                }}
              >
                Explore student hackathons, cultural spectacles, sports tournaments, and technical summits.
                Real-time schedules, verified digital passes, and club collaboration.
              </p>

              {/* Integrated Search Bar with Quick Filter Chips */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <form
                  onSubmit={handleHeroSearch}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '6px 8px 6px 16px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  <Search size={18} color="var(--primary)" style={{ marginRight: '10px', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search events, clubs, venues, or keywords..."
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                  <Button type="submit" variant="primary" size="sm">
                    Search
                  </Button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Quick tags:</span>
                  <button onClick={() => navigate('/events?category=technical')} style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Hackathons</button>
                  <span>&bull;</span>
                  <button onClick={() => navigate('/events?category=cultural')} style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Concerts</button>
                  <span>&bull;</span>
                  <button onClick={() => navigate('/events?category=sports')} style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Derbies</button>
                </div>
              </div>

              {/* Primary Actions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Link to="/events">
                  <Button size="lg" variant="primary" icon={Compass} iconPosition="right">
                    Explore Season Schedule
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="secondary"
                  icon={PlusCircle}
                  onClick={() => setHostModalOpen(true)}
                >
                  Host with Us
                </Button>
              </div>
            </div>

            {/* Right Column: Layered Editorial Visual Montage */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-2xl)',
                  overflow: 'hidden',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-lg)',
                  aspectRatio: '4/3',
                  maxHeight: '440px',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80"
                  alt="Campus Event Energy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Layered Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(23, 23, 25, 0.92) 0%, rgba(23, 23, 25, 0.2) 60%, transparent 100%)',
                  }}
                />

                {/* Floating Live Badge Top Left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-full)',
                    padding: '5px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)' }} />
                  <span>2026 Campus Semester Edition</span>
                </div>

                {/* Floating Event Brief Card Bottom Left */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 'bold' }}>
                      FEATURED THIS MONTH
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      HackNexa 2026 &bull; 36-Hr Hackathon
                    </div>
                  </div>

                  <Link to="/events">
                    <Button variant="primary" size="sm" icon={ArrowUpRight}>
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ASYMMETRIC BENTO STATISTICS (REAL BACKEND DATA)
          ========================================================================= */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          {/* Bento Card 1: Active Events */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                SCHEDULED
              </span>
              <Calendar size={18} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats?.totalEvents ?? '8'}+
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Active Campus Activities
              </div>
            </div>
          </div>

          {/* Bento Card 2: Registered Students */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                STUDENT PARTICIPATION
              </span>
              <Users size={18} color="var(--accent-secondary)" />
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats?.totalParticipants ?? '2,300'}+
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Verified Student Signups
              </div>
            </div>
          </div>

          {/* Bento Card 3: Domains */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                EVENT SPECTRUM
              </span>
              <Layers size={18} color="var(--highlight)" />
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats?.totalCategories ?? '8'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Distinct Campus Domains
              </div>
            </div>
          </div>

          {/* Bento Card 4: Student Societies */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                ORGANIZER NETWORK
              </span>
              <TrendingUp size={18} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats?.totalSocieties ?? '14'}+
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Clubs, Cells & Chapters
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED EVENTS SHOWCASE (Varied Layout: Lead Banner + Grid)
          ========================================================================= */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div>
            <div className="editorial-eyebrow">
              <Sparkles size={14} />
              <span>Curated Headliners</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
              Featured Campus Showcases
            </h2>
          </div>

          <Link to="/events">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View Full Schedule
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loadingFeatured && (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Retrieving featured campus events...
          </div>
        )}

        {/* Error State */}
        {!loadingFeatured && apiError && (
          <Card glass style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <AlertCircle size={32} color="var(--error)" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{apiError}</p>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchHomepageData}>
              Retry Connection
            </Button>
          </Card>
        )}

        {/* Visually Varied Showcase */}
        {!loadingFeatured && !apiError && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* 1. Large Lead Feature Panel */}
            {leadFeatured && (
              <EventCard event={leadFeatured} layout="featured-hero" />
            )}

            {/* 2. Secondary Feature Cards Grid */}
            {secondaryFeatured.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 'var(--space-6)',
                }}
              >
                {secondaryFeatured.map((evt) => (
                  <EventCard key={evt.id || evt._id} event={evt} layout="card" />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. CATEGORIES SECTION (Editorial Panels)
          ========================================================================= */}
      <section className="container">
        <div style={{ maxWidth: '640px', marginBottom: 'var(--space-8)' }}>
          <div className="editorial-eyebrow">
            <Layers size={14} />
            <span>Campus Domains</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Browse by Passion & Track
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
            From competitive coding circuits to cultural stages and sports arenas.
          </p>
        </div>

        {loadingCategories ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading categories...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {categories.map((cat, idx) => {
              const IconComp = CATEGORY_ICONS[cat.icon] || Sparkles;
              return (
                <div
                  key={cat.id || cat.slug}
                  onClick={() => navigate(`/events?category=${encodeURIComponent(cat.slug || cat.name)}`)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-6)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={18} />
                    </div>

                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginBottom: '4px', color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {cat.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {cat.eventCount || 0} scheduled
                    </span>
                    <ArrowUpRight size={14} color="var(--primary)" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. UPCOMING HORIZONTAL AGENDA (Numbered Chronological View)
          ========================================================================= */}
      {upcomingEvents.length > 0 && (
        <section className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-8)',
            }}
          >
            <div>
              <div className="editorial-eyebrow">
                <Clock size={14} />
                <span>Immediate Schedule</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
                Next on the University Stage
              </h2>
            </div>

            <Link to="/events?sort=date">
              <Button variant="secondary" size="md">
                Full Calendar &rarr;
              </Button>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {upcomingEvents.map((evt, idx) => (
              <div
                key={evt.id || evt._id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                {/* Left: Number + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flex: 1, minWidth: '260px' }}>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '900',
                      color: 'var(--primary)',
                      opacity: 0.8,
                    }}
                  >
                    0{idx + 1}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <Badge variant="peach" size="sm">{evt.category}</Badge>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{evt.date}</span>
                    </div>
                    <Link
                      to={`/events/${evt.id || evt._id}`}
                      style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)' }}
                    >
                      {evt.title}
                    </Link>
                  </div>
                </div>

                {/* Center: Venue & Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--primary)" />
                    <span>{evt.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--primary)" />
                    <span>{evt.venue}</span>
                  </div>
                </div>

                {/* Right: Register Action */}
                <Link to={`/events/${evt.id || evt._id}`}>
                  <Button variant="secondary" size="sm" icon={Ticket}>
                    Get Ticket
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          6. COMMUNITY & SOCIETY HOST CTA BANNER
          ========================================================================= */}
      <section className="container">
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-12) var(--space-8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="editorial-eyebrow">
              <ShieldCheck size={14} />
              <span>Society & Club Leadership</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: 'var(--space-3)' }}>
              Ready to launch your next campus fest?
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '520px' }}>
              Publish verified tickets, manage attendee capacities, broadcast agenda updates, and reach over 2,300 active campus participants.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
            <Button
              variant="primary"
              size="lg"
              icon={PlusCircle}
              onClick={() => setHostModalOpen(true)}
            >
              Draft Event Proposal
            </Button>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Faculty council approval required for major hall bookings.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOST AN EVENT MODAL (Interactive Dialog)
          ========================================================================= */}
      <Modal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        title="Host a Campus Event on GATHERLY"
        maxWidth="520px"
      >
        <form onSubmit={handleHostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Submit your student society's event proposal. Approved drafts appear immediately in the live discovery catalog.
          </p>

          <Input
            label="Club / Student Society"
            placeholder="e.g. Turing Computing Society"
            value={hostFormData.societyName}
            onChange={(e) => setHostFormData({ ...hostFormData, societyName: e.target.value })}
            required
          />

          <Input
            label="Event Headline"
            placeholder="e.g. 2026 Inter-College Robotics Challenge"
            value={hostFormData.eventTitle}
            onChange={(e) => setHostFormData({ ...hostFormData, eventTitle: e.target.value })}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
              Domain Category
            </label>
            <select
              value={hostFormData.category}
              onChange={(e) => setHostFormData({ ...hostFormData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
            >
              {categories.map((c) => (
                <option key={c.slug || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Lead Organizer Campus Email"
            type="email"
            placeholder="lead@campus.edu"
            value={hostFormData.contactEmail}
            onChange={(e) => setHostFormData({ ...hostFormData, contactEmail: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={() => setHostModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Event Proposal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HomePage;
