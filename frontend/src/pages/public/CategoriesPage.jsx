import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowUpRight, Sparkles, Code2, Music, Trophy, Gamepad2, BookOpen, Briefcase, Rocket, Palette } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { eventService } from '../../services/eventService';

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

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await eventService.getCategories();
        setCategories(data);
      } catch (e) {
        console.warn('Failed to load categories:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: 'var(--space-10)' }}>
          <div className="editorial-eyebrow">
            <Layers size={14} />
            <span>Campus Tracks</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Event Categories & Domains
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Explore university activities organized by academic, cultural, athletic, and creative interests.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading campus tracks...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
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
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-8)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={20} />
                    </div>

                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
                      {cat.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {cat.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {cat.eventCount || 0} scheduled events
                    </span>
                    <ArrowUpRight size={16} color="var(--primary)" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
