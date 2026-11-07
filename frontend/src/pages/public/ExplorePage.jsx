import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Grid,
  List,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Compass,
  Clock,
  MapPin,
  ArrowRight,
  X,
} from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { eventService } from '../../services/eventService';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Category and query filter states (Search bar removed per specification; entry point is homepage hero)
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize category and search query if URL search parameters change
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const q = searchParams.get('q') || '';
    setActiveCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  // Fetch categories list
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await eventService.getCategories();
        setCategories(cats);
      } catch (e) {
        console.warn('Failed to fetch categories:', e.message);
      }
    };
    loadCategories();
  }, []);

  // Fetch filtered events from backend (automatically in chronological order)
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const cat = searchParams.get('category') || 'all';
      const q = (searchParams.get('q') || '').trim();

      const params = { limit: 100 };
      if (cat && cat !== 'all') {
        params.category = cat;
      }
      if (q) {
        params.q = q;
      }

      const res = await eventService.getEvents(params);
      let fetchedEvents = res.data || [];

      // Deduplicate events by id, slug, or title as extra defensive layer
      const seenKeys = new Set();
      fetchedEvents = fetchedEvents.filter((ev) => {
        if (!ev) return false;
        const key = ev.slug || ev.id || ev._id || (ev.title ? ev.title.toLowerCase().trim() : null);
        if (!key || seenKeys.has(key)) return false;
        seenKeys.add(key);
        return true;
      });

      // Safeguard client-side filtering across title, description, category, and venue
      if (q) {
        const term = q.toLowerCase();
        fetchedEvents = fetchedEvents.filter((e) =>
          (e.title && e.title.toLowerCase().includes(term)) ||
          (e.description && e.description.toLowerCase().includes(term)) ||
          (e.category && e.category.toLowerCase().includes(term)) ||
          (e.venue && e.venue.toLowerCase().includes(term)) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(term)))
        );
      }

      // Guarantee chronological order: earliest upcoming event first
      const now = new Date();
      const parseTime = (e) => {
        if (!e || !e.date) return new Date(9999, 11, 31);
        let timeStr = '00:00:00';
        if (e.time) {
          const match = e.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
          if (match) {
            let hours = parseInt(match[1], 10);
            const minutes = match[2];
            const ampm = match[3].toUpperCase();
            if (ampm === 'PM' && hours < 12) hours += 12;
            if (ampm === 'AM' && hours === 12) hours = 0;
            timeStr = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
          }
        }
        return new Date(`${e.date}T${timeStr}`);
      };

      const sorted = [...fetchedEvents].sort((a, b) => {
        const startA = parseTime(a);
        const startB = parseTime(b);
        const isPastA = startA < now;
        const isPastB = startB < now;

        if (!isPastA && isPastB) return -1;
        if (isPastA && !isPastB) return 1;
        if (!isPastA && !isPastB) return startA - startB;
        return startB - startA;
      });

      setEvents(sorted);
    } catch (err) {
      console.warn('Failed to load events:', err.message);
      setError(err.message || 'Unable to load events from server.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger load when searchParams change (handling both category and q)
  useEffect(() => {
    loadEvents();
  }, [searchParams]);

  const handleCategorySelect = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ padding: 'var(--space-10) 0 var(--space-20)' }}>
      <div className="container">
        {/* Page Header */}
        <div className="animate-slide-up" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="editorial-eyebrow">
            <Compass size={14} />
            <span>Campus Schedule</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Campus Event Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: 1.6, marginTop: 'var(--space-2)' }}>
            Filter and discover academic summits, cultural fests, sports championships, and workshops happening across university departments.
          </p>
        </div>

        {/* Filter Toolbar: Unified Category Chips & Grid/List View Toggle (Search Bar Removed) */}
        <div
          className="animate-slide-up delay-1"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4) var(--space-6)',
            marginBottom: 'var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
              flex: '1 1 auto',
            }}
          >
            <button
              onClick={() => handleCategorySelect('all')}
              style={{
                padding: '7px 15px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: activeCategory === 'all' ? '700' : '600',
                background: activeCategory === 'all' ? 'var(--primary)' : 'var(--bg-elevated)',
                color: activeCategory === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: activeCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                boxShadow: activeCategory === 'all' ? '0 2px 8px rgba(var(--primary-rgb), 0.25)' : 'none',
                transform: activeCategory === 'all' ? 'scale(1.03) translateY(-1px)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== 'all') {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== 'all') {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              All Events
            </button>

            {categories.map((c) => {
              const slug = c.slug || c.name.toLowerCase();
              const isSelected = activeCategory.toLowerCase() === slug.toLowerCase() || activeCategory.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.id || c.name}
                  onClick={() => handleCategorySelect(slug)}
                  style={{
                    padding: '7px 15px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isSelected ? '700' : '600',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? '0 2px 8px rgba(var(--primary-rgb), 0.25)' : 'none',
                    transform: isSelected ? 'scale(1.03) translateY(-1px)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--text-inverse)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--text-inverse)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Metadata & Active Query Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            fontWeight: '600',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span>Showing {events.length} campus {events.length === 1 ? 'event' : 'events'}</span>
            {searchQuery && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--primary)',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                }}
              >
                <span>Search: <strong>"{searchQuery}"</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    searchParams.delete('q');
                    setSearchParams(searchParams);
                  }}
                  title="Clear search filter"
                  aria-label="Clear search filter"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Retrieving events from backend...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card glass style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
            <AlertCircle size={32} color="var(--error)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ marginBottom: '6px' }}>Service Notice</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{error}</p>
            <Button variant="secondary" size="sm" onClick={loadEvents}>
              Try Again
            </Button>
          </Card>
        )}

        {/* Results: Grid View vs List View */}
        {!loading && !error && events.length > 0 && (
          viewMode === 'grid' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {events.map((evt, idx) => (
                <div
                  key={evt.id || evt._id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(idx * 0.05, 0.35)}s` }}
                >
                  <EventCard event={evt} layout="card" />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {events.map((evt, idx) => (
                <div
                  key={evt.id || evt._id}
                  className="stage-row-interactive animate-slide-up"
                  onClick={() => navigate(`/events/${evt.slug || evt.id || evt._id}`)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-4) var(--space-5)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    boxShadow: 'var(--shadow-sm)',
                    animationDelay: `${Math.min(idx * 0.05, 0.3)}s`,
                    cursor: 'pointer',
                  }}
                >
                  {/* Left: Thumbnail + Title + Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: '1 1 340px' }}>
                    <div
                      style={{
                        width: '76px',
                        height: '56px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'var(--bg-elevated)',
                      }}
                    >
                      <img
                        src={evt.image}
                        alt={evt.title}
                        onError={(e) => {
                          e.currentTarget.src = '/uploads/events/rhythm_lights_cultural.jpg';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <Badge variant="peach" size="sm">{evt.category}</Badge>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {evt.date}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  {/* Center: Venue & Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} color="var(--primary)" />
                      <span>{evt.time ? evt.time.split('-')[0].trim() : 'TBA'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--accent-secondary)" />
                      <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {evt.venue}
                      </span>
                    </div>
                  </div>

                  {/* Right: Details cue */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)' }}>
                    <span>View Event</span>
                    <ArrowRight size={14} className="stage-arrow-icon" style={{ transition: 'transform 0.2s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <Card glass style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
            <Compass size={40} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ marginBottom: '6px' }}>No Campus Events Found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 16px' }}>
              No scheduled events matched this category filter. Select "All Events" to view upcoming schedules across the university.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setActiveCategory('all');
                setSearchParams({});
              }}
            >
              Show All Events
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
