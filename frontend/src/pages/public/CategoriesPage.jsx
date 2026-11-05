import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Code2,
  Music,
  Trophy,
  Gamepad2,
  BookOpen,
  Briefcase,
  Rocket,
  Palette,
  Users,
  Building,
  Compass,
} from 'lucide-react';
import { eventService } from '../../services/eventService';
import { Button } from '../../components/common/Button';

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

// Rich campus societies metadata associated with each track
const TRACK_DIRECTORY = {
  technical: {
    societies: ['Turing Computing Society', 'DevSoc KIIT Chapter', 'Robotics & Automation Club', 'IEEE Student Branch'],
    leadDepartment: 'School of Computer Engineering',
    annualHighlights: 'HackNexa, Algorithm Odyssey, Web3 DevSprint',
  },
  cultural: {
    societies: ['Campus Cultural Guild', 'Acoustic Harmonies Band', 'Rhythmics Dance Troupe', 'Theatron Dramatic Society'],
    leadDepartment: 'Office of Student Affairs',
    annualHighlights: 'Rhythm & Lights, Inter-College Band Wars, Street Play Fest',
  },
  sports: {
    societies: ['University Sports Council', 'Football Varsity Team', 'HoopNation Basketball Club', 'Athletics Contingent'],
    leadDepartment: 'Department of Physical Education',
    annualHighlights: "Chancellor's Cup, Night Football Derby, Inter-Hostel Athletics",
  },
  gaming: {
    societies: ['Campus Esports & Gaming League', 'Valorant Campus Squad', 'Arcade & LAN Guild'],
    leadDepartment: 'Student Activity Center',
    annualHighlights: 'ClutchArena Esports, LAN Brawl, FIFA SuperCup',
  },
  workshops: {
    societies: ['AI & Data Science Student Circle', 'UI/UX Design Studio', 'Cloud & DevOps Study Group'],
    leadDepartment: 'Department of Electronics & Computing',
    annualHighlights: 'FutureForward AI Summit, Figma Masterclass, AWS Cloud Day',
  },
  management: {
    societies: ['Consulting & Strategy Club', 'FinTech & Stock League', 'Marketing Consortium'],
    leadDepartment: 'School of Management Studies',
    annualHighlights: 'CaseCraft Derby, B-Plan Sprint, Mock Stock Conclave',
  },
  entrepreneurship: {
    societies: ['E-Cell (Entrepreneurship Cell)', 'Incubation Launchpad', 'Angel Mentorship Network'],
    leadDepartment: 'Campus Innovation Incubator',
    annualHighlights: 'VentureSprint Demo Day, Startup Pitch Night, Founder Firesides',
  },
  'arts-entertainment': {
    societies: ['Iris Photography & Film Club', 'Fine Arts Guild', 'Literary & Debating Society'],
    leadDepartment: 'Department of Humanities & Arts',
    annualHighlights: 'FrameShift Photo Expo, Short Film Screenings, Open Mic Nights',
  },
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
    <div style={{ padding: 'var(--space-10) 0 var(--space-20)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: 'var(--space-10)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <Layers size={14} />
            <span>Campus Domain & Societies Directory</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              margin: '0 0 10px',
            }}
          >
            Campus Activity Tracks
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6, margin: 0 }}>
            Comprehensive directory of university student societies, academic departments, and seasonal activities organized across 8 primary campus domains.
          </p>
        </div>

        {/* Categories Directory Grid */}
        {loading ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading campus tracks...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
            {categories.map((cat, idx) => {
              const slugKey = (cat.slug || cat.id || '').replace('cat-', '');
              const dirInfo = TRACK_DIRECTORY[slugKey] || {
                societies: ['Student Society Guild', 'Campus Club'],
                leadDepartment: 'University Department',
                annualHighlights: 'Campus Hackathons & Fests',
              };
              const IconComp = CATEGORY_ICONS[cat.icon] || Layers;

              return (
                <div
                  key={cat.id || cat.slug}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-6) var(--space-8)',
                    display: 'flex',
                    flexDirection: 'column',
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
                  {/* Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-strong)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                      }}
                    >
                      <IconComp size={22} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                        fontWeight: '700',
                      }}
                    >
                      DOMAIN {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      margin: '0 0 6px',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: 'var(--space-5)',
                    }}
                  >
                    {cat.description}
                  </p>

                  {/* Department & Societies Info */}
                  <div
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.72rem',
                      marginBottom: 'var(--space-6)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <Building size={14} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.62rem' }}>
                          Academic Affiliation
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{dirInfo.leadDepartment}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <Users size={14} style={{ color: 'var(--accent-secondary)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontSize: '0.62rem' }}>
                          Registered Societies
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{dirInfo.societies.join(' • ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link to Discover Page */}
                  <div style={{ marginTop: 'auto' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      icon={Compass}
                      iconPosition="right"
                      onClick={() => navigate(`/events?category=${encodeURIComponent(cat.slug || cat.name)}`)}
                    >
                      Filter {cat.name} Events
                    </Button>
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
