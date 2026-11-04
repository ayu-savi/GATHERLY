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
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { EventCard } from '../../components/events/EventCard';
import { eventService } from '../../services/eventService';
import { useToast } from '../../hooks/useToast';

// Icon mapping helper for categories
const CATEGORY_ICONS = {
  Code2: Code2,
  Music: Music,
  Trophy: Trophy,
  Gamepad2: Gamepad2,
  BookOpen: BookOpen,
  Briefcase: Briefcase,
  Rocket: Rocket,
  Palette: Palette,
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State management
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);

  // Loading and error states
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Search input in hero
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  // Host event modal state
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hostFormData, setHostFormData] = useState({
    societyName: '',
    eventTitle: '',
    category: 'Technical',
    contactEmail: '',
  });

  // Fetch all initial homepage data from Express backend
  const fetchHomepageData = async () => {
    setApiError(null);

    // 1. Fetch featured events
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

    // 2. Fetch upcoming events
    try {
      setLoadingUpcoming(true);
      const upcoming = await eventService.getUpcomingEvents(3);
      setUpcomingEvents(upcoming);
    } catch (err) {
      console.warn('Failed to load upcoming events:', err.message);
    } finally {
      setLoadingUpcoming(false);
    }

    // 3. Fetch categories
    try {
      setLoadingCategories(true);
      const cats = await eventService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.warn('Failed to load categories:', err.message);
    } finally {
      setLoadingCategories(false);
    }

    // 4. Fetch real stats
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

  // Handle Hero Search submission
  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      navigate(`/events?q=${encodeURIComponent(heroSearchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  // Handle Host Event Mock Submit
  const handleHostSubmit = (e) => {
    e.preventDefault();
    setHostModalOpen(false);
    showToast(`Society proposal submitted for "${hostFormData.eventTitle}". Pending faculty approval!`, 'success');
    setHostFormData({ societyName: '', eventTitle: '', category: 'Technical', contactEmail: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          paddingTop: 'var(--space-16)',
          paddingBottom: 'var(--space-12)',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(var(--primary-rgb), 0.18) 0%, transparent 70%)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            {/* Top pill badge */}
            <div style={{ display: 'inline-flex', marginBottom: 'var(--space-4)' }}>
              <Badge variant="featured" size="lg" icon={Sparkles}>
                Campus Event Discovery & Management
              </Badge>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                fontWeight: 'var(--weight-extrabold)',
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                marginBottom: 'var(--space-5)',
              }}
            >
              Discover. Connect.{' '}
              <span className="text-gradient-festive">Celebrate.</span>
            </h1>

            {/* Supporting Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '680px',
                margin: '0 auto var(--space-8)',
              }}
            >
              The unified campus hub for university students. Discover upcoming hackathons,
              cultural galas, sports tournaments, and workshops — with verified instant registration.
            </p>

            {/* Interactive Hero Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '580px',
                margin: '0 auto var(--space-8)',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 8px 6px 18px',
                boxShadow: 'var(--shadow-md)',
                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <Search size={18} color="var(--primary)" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search hackathons, fests, robotics, workshops..."
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
                Search Events
              </Button>
            </form>

            {/* Primary & Secondary Action CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-4)',
              }}
            >
              <Link to="/events">
                <Button size="lg" variant="primary" icon={Compass} iconPosition="left">
                  Explore All Events
                </Button>
              </Link>

              <Button
                size="lg"
                variant="secondary"
                icon={PlusCircle}
                iconPosition="left"
                onClick={() => setHostModalOpen(true)}
              >
                Host an Event
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CAMPUS HIGHLIGHTS & REAL STATISTICS
          ========================================================================= */}
      <section className="container">
        {loadingStats ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
            Loading live campus metrics...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {/* Stat 1: Total Events */}
            <Card glass hoverable style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(var(--primary-rgb), 0.15)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Calendar size={22} />
              </div>
              <div
                style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-extrabold)',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {stats?.totalEvents ?? '8'}+
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Active Campus Events
              </div>
            </Card>

            {/* Stat 2: Registered Participants */}
            <Card glass hoverable style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(var(--accent-secondary-rgb), 0.18)',
                  color: 'var(--accent-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Users size={22} />
              </div>
              <div
                style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-extrabold)',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {stats?.totalParticipants ?? '2,300'}+
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Registered Students
              </div>
            </Card>

            {/* Stat 3: Event Domains */}
            <Card glass hoverable style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(var(--highlight-rgb), 0.18)',
                  color: 'var(--highlight)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Layers size={22} />
              </div>
              <div
                style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-extrabold)',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {stats?.totalCategories ?? '8'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Activity Categories
              </div>
            </Card>

            {/* Stat 4: Student Societies */}
            <Card glass hoverable style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(var(--primary-rgb), 0.15)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <TrendingUp size={22} />
              </div>
              <div
                style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 'var(--weight-extrabold)',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {stats?.totalSocieties ?? '14'}+
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Campus Clubs & Societies
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* =========================================================================
          3. FEATURED EVENTS SECTION
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
            <Badge variant="featured" icon={Sparkles} style={{ marginBottom: 'var(--space-2)' }}>
              Curated Highlights
            </Badge>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)' }}>
              Featured Campus Events
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Handpicked major fests, competitive hackathons, and signature symposiums.
            </p>
          </div>

          <Link to="/events">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View All Events
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loadingFeatured && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} glass style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  Loading featured event #{i}...
                </span>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loadingFeatured && apiError && (
          <Card glass style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--error)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>Backend Service Notice</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', maxWidth: '500px', margin: '0 auto 16px' }}>
              {apiError}
            </p>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchHomepageData}>
              Retry Connection
            </Button>
          </Card>
        )}

        {/* Success Grid */}
        {!loadingFeatured && !apiError && featuredEvents.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id || evt._id} event={evt} featured={true} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingFeatured && !apiError && featuredEvents.length === 0 && (
          <Card glass style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <Calendar size={42} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3>No Featured Events Available</h3>
            <p>Check back soon or explore our complete catalog.</p>
          </Card>
        )}
      </section>

      {/* =========================================================================
          4. CATEGORIES SECTION
          ========================================================================= */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-10)' }}>
          <Badge variant="cyan" icon={Layers} style={{ marginBottom: 'var(--space-2)' }}>
            Browse by Interest
          </Badge>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
            Explore Event Categories
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Find activities tailored to your academic domain, technical passions, and creative hobbies.
          </p>
        </div>

        {loadingCategories ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
            Loading categories from backend...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {categories.map((cat) => {
              const IconComp = CATEGORY_ICONS[cat.icon] || Sparkles;
              return (
                <Card
                  key={cat.id || cat.slug}
                  glass
                  hoverable
                  style={{ cursor: 'pointer', padding: 'var(--space-5)' }}
                  onClick={() => navigate(`/events?category=${encodeURIComponent(cat.slug || cat.name)}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(var(--primary-rgb), 0.15)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={22} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>
                          {cat.name}
                        </h3>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'bold' }}>
                          {cat.eventCount || 0} events
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                          marginTop: '4px',
                        }}
                      >
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. UPCOMING EVENTS PREVIEW SECTION
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
              <Badge variant="peach" icon={Clock} style={{ marginBottom: 'var(--space-2)' }}>
                Upcoming Schedule
              </Badge>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)' }}>
                Happening Soon on Campus
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Chronological timeline of confirmed upcoming activities.
              </p>
            </div>

            <Link to="/events?sort=date">
              <Button variant="secondary" size="md">
                Full Calendar Schedule &rarr;
              </Button>
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {upcomingEvents.map((evt) => (
              <EventCard key={`up-${evt.id || evt._id}`} event={evt} />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          6. CAMPUS COMMUNITY & BENEFITS ("Why GATHERLY")
          ========================================================================= */}
      <section className="container">
        <Card
          glass
          style={{
            padding: 'var(--space-12) var(--space-8)',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.12) 0%, rgba(var(--accent-secondary-rgb), 0.1) 100%)',
            borderColor: 'var(--border-strong)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto var(--space-10)' }}>
            <Badge variant="primary" icon={ShieldCheck} style={{ marginBottom: 'var(--space-2)' }}>
              Campus Ecosystem
            </Badge>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-3)' }}>
              Built Exclusively for University Life
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              GATHERLY connects students, faculty advisors, and society organizers into an organized event network.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {/* Benefit 1 */}
            <div style={{ padding: 'var(--space-4)' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(var(--primary-rgb), 0.2)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>
                Instant Verified Registrations
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Register in seconds with client-side form validation and receive a digital confirmation pass for event check-in.
              </p>
            </div>

            {/* Benefit 2 */}
            <div style={{ padding: 'var(--space-4)' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(var(--accent-secondary-rgb), 0.2)',
                  color: 'var(--accent-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Calendar size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>
                Unified Academic Calendar
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Never miss overlapping events again. Track all registered and bookmarked events in your personal student dashboard.
              </p>
            </div>

            {/* Benefit 3 */}
            <div style={{ padding: 'var(--space-4)' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(var(--highlight-rgb), 0.2)',
                  color: 'var(--highlight)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>
                Society Organizer Portal
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Empower student clubs to publish fests, track real-time attendee capacities, and manage event schedules.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* =========================================================================
          7. HOST AN EVENT CALL TO ACTION
          ========================================================================= */}
      <section className="container">
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-10) var(--space-8)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-6)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ maxWidth: '580px' }}>
            <Badge variant="cyan" icon={PlusCircle} style={{ marginBottom: 'var(--space-2)' }}>
              For Campus Societies & Clubs
            </Badge>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
              Are you planning a campus event?
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Whether you are organizing an inter-university cultural night, a coding hackathon, or a sports derby,
              GATHERLY provides the ticketing and discovery tools your club needs.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={PlusCircle}
            onClick={() => setHostModalOpen(true)}
          >
            Submit an Event Proposal
          </Button>
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
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Submit your club's event draft. Approved proposals will appear immediately on the live campus feed.
          </p>

          <Input
            label="Club / Student Society Name"
            placeholder="e.g. Turing Computing Society"
            value={hostFormData.societyName}
            onChange={(e) => setHostFormData({ ...hostFormData, societyName: e.target.value })}
            required
          />

          <Input
            label="Event Title"
            placeholder="e.g. Inter-College Battle of the Bands"
            value={hostFormData.eventTitle}
            onChange={(e) => setHostFormData({ ...hostFormData, eventTitle: e.target.value })}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>
              Event Category
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
                fontSize: 'var(--text-base)',
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
            label="Lead Organizer Email"
            type="email"
            placeholder="organizer@campus.edu"
            value={hostFormData.contactEmail}
            onChange={(e) => setHostFormData({ ...hostFormData, contactEmail: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={() => setHostModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Event Draft
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HomePage;
