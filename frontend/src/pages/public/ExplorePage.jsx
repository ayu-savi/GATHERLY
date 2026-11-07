import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Grid,
  List,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Compass,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { eventService } from '../../services/eventService';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search and filter states
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchFocused, setSearchFocused] = useState(false);

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize category or search query if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== activeCategory) {
      setActiveCategory(cat);
    }
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
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

      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (activeCategory && activeCategory !== 'all') params.category = activeCategory;

      const res = await eventService.getEvents(params);
      const fetchedEvents = res.data || [];

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

  // Debounced search on typing + immediate trigger on category switch
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEvents();
  };

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
        {/* Page Header (Smooth Entrance) */}
        <div className="animate-slide-up" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="editorial-eyebrow">
            <Compass size={14} />
            <span>Campus Schedule</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Campus Event Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', lineHeight: 1.6, marginTop: 'var(--space-2)' }}>
            Filter and discover academic summits, cultural fests, sports championships, and workshops happening across university departments.
          </p>
        </div>

        {/* Filter & Search Toolbar (No Filter Button, Full Width Search) */}
        <div
          className="animate-slide-up delay-1"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5) var(--space-6)',
            marginBottom: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Top Row: Full-Width Search Input + View Mode */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center', justifyContent: 'space-between' }}>
            <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 360px', display: 'flex' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-elevated)',
                  border: searchFocused ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(15, 118, 110, 0.12)' : 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 14px',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
                }}
              >
                <Search
                  size={16}
                  color={searchFocused ? 'var(--primary)' : 'var(--text-muted)'}
                  style={{ marginRight: '10px', flexShrink: 0, transition: 'color 0.25s ease' }}
                />
                <input
                  type="text"
                  placeholder="Search by event title, venue, or keyword..."
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                />
              </div>
            </form>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  display: 'flex',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2px',
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

          {/* Bottom Row: Category Filter Chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => handleCategorySelect('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: activeCategory === 'all' ? '700' : '600',
                background: activeCategory === 'all' ? 'var(--primary)' : 'var(--bg-elevated)',
                color: activeCategory === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: activeCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                boxShadow: activeCategory === 'all' ? '0 2px 8px rgba(15, 118, 110, 0.25)' : 'none',
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
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isSelected ? '700' : '600',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? '0 2px 8px rgba(15, 118, 110, 0.25)' : 'none',
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
        </div>

        {/* Results Metadata Header (Reset All Filters removed per specification) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            fontWeight: '600',
          }}
        >
          <span>Showing {events.length} campus {events.length === 1 ? 'event' : 'events'}</span>
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
              No scheduled events matched your search query or category filter. Try selecting "All Events" or searching for a different keyword.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
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