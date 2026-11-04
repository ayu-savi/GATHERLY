import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Grid, List, Sparkles, RefreshCw, AlertCircle, Compass } from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { eventService } from '../../services/eventService';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'date';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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

  // Fetch filtered events from backend
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (activeCategory && activeCategory !== 'all') params.category = activeCategory;
      if (activeSort) params.sort = activeSort;

      const res = await eventService.getEvents(params);
      setEvents(res.data || []);
    } catch (err) {
      console.warn('Failed to load events:', err.message);
      setError(err.message || 'Unable to load events from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [activeCategory, activeSort]);

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveSort('date');
    setSearchParams({});
  };

  return (
    <div style={{ padding: 'var(--space-10) 0 var(--space-20)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div className="editorial-eyebrow">
            <Compass size={14} />
            <span>Campus Schedule</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Campus Event Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
            Filter and discover academic summits, cultural fests, sports championships, and workshops happening across university departments.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div
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
          {/* Top Row: Search Input + Sort Dropdown + View Mode */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center', justifyContent: 'space-between' }}>
            <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 300px', display: 'flex', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 12px',
                }}
              >
                <Search size={16} color="var(--primary)" style={{ marginRight: '8px', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search by event title, venue, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-xs)',
                  }}
                />
              </div>
              <Button type="submit" variant="primary" size="sm">
                Filter
              </Button>
            </form>

            {/* Sort & View Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Sort:</span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 10px',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-xs)',
                    outline: 'none',
                  }}
                >
                  <option value="date">Date: Earliest First</option>
                  <option value="popularity">Most Registered</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* View Mode */}
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
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--text-inverse)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Grid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  style={{
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--text-inverse)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
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
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: activeCategory === 'all' ? 'bold' : 'normal',
                background: activeCategory === 'all' ? 'var(--primary)' : 'var(--bg-elevated)',
                color: activeCategory === 'all' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
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
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-elevated)',
                    color: isSelected ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Metadata Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <span>Showing {events.length} campus {events.length === 1 ? 'event' : 'events'}</span>
          {(searchQuery || activeCategory !== 'all') && (
            <button
              onClick={handleResetFilters}
              style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              Reset all filters
            </button>
          )}
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
              {events.map((evt) => (
                <EventCard key={evt.id || evt._id} event={evt} layout="card" />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {events.map((evt) => (
                <div
                  key={evt.id || evt._id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Badge variant="primary" size="sm">{evt.category}</Badge>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{evt.date}</span>
                    </div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                      {evt.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {evt.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{evt.venue}</span>
                    <Link to={`/events/${evt.id || evt._id}`}>
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
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
              No scheduled events matched your search query or category filter. Try clearing filters or exploring other domains.
            </p>
            <Button variant="primary" size="sm" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
