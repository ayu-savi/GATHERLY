import React, { useEffect, useState, useCallback } from 'react';
import {
  Camera,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Info,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { galleryService } from '../../services/galleryService';
import { useInView } from '../../hooks/useInView';

export const GalleryPage = () => {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  // Intersection observers for fluid scroll entrances
  const [heroRef, heroInView] = useInView();
  const [featuredRef, featuredInView] = useInView();
  const [gridRef, gridInView] = useInView();

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await galleryService.getActiveGallery();
      setCollection(data);
    } catch (err) {
      console.error('Failed to load campus memories gallery:', err);
      setError(err.message || 'Unable to load campus memories gallery. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (activePhotoIndex === null || !collection?.photographs?.length) return;

      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % collection.photographs.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev === 0 ? collection.photographs.length - 1 : prev - 1
        );
      }
    },
    [activePhotoIndex, collection]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const featuredPhoto =
    collection?.photographs?.find((p) => p.isFeatured) || collection?.photographs?.[0];
  const activePhoto =
    activePhotoIndex !== null ? collection?.photographs?.[activePhotoIndex] : null;

  return (
    <div style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
      <div className="container">
        {/* Page Header */}
        <div
          ref={heroRef}
          className={heroInView ? 'animate-hero-fade-up' : ''}
          style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}
        >
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            <Camera size={14} />
            <span>Campus Memories</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-4)',
            }}
          >
            Rotating Event Photography Gallery
          </h1>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A visual retrospective of university concerts, hackathons, theater performances,
            athletic meets, and vibrant student society celebrations.
          </p>
        </div>

        {/* Demo Showcase Notice Banner */}
        {collection?.isDemo && (
          <div
            className={heroInView ? 'animate-slide-up delay-1' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(var(--primary-rgb), 0.08)',
              border: '1px solid rgba(var(--primary-rgb), 0.25)',
              marginBottom: 'var(--space-10)',
              fontSize: 'var(--text-xs)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                Sample Campus Memories (Demo Showcase)
              </strong>
              This demonstration gallery highlights campus life using verified, free-to-use photography with original
              photographer attributions. It illustrates the platform’s rotating event gallery and administrative publishing workflow.
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-20) 0',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                marginBottom: 'var(--space-4)',
              }}
            />
            <p style={{ fontWeight: '600' }}>Loading Campus Memories Gallery...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card
            glass
            style={{
              padding: 'var(--space-10)',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <AlertCircle size={36} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '8px' }}>Unable to Load Gallery</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              {error}
            </p>
            <Button variant="primary" onClick={fetchGallery}>
              <RefreshCw size={14} style={{ marginRight: '6px' }} /> Retry Connection
            </Button>
          </Card>
        )}

        {/* Active Collection Content */}
        {!loading && !error && collection?.photographs?.length > 0 && (
          <>
            {/* Featured Photograph Hero Showcase */}
            {featuredPhoto && (
              <div
                ref={featuredRef}
                className={featuredInView ? 'animate-scale-fade-in delay-2' : ''}
                style={{ marginBottom: 'var(--space-12)' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '700',
                        fontSize: 'var(--text-sm)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--primary)',
                      }}
                    >
                      Featured Event Photograph
                    </span>
                  </div>
                  <Badge variant="primary">Spotlight</Badge>
                </div>

                <div
                  onClick={() => {
                    const idx = collection.photographs.findIndex(
                      (p) => p._id === featuredPhoto._id
                    );
                    setActivePhotoIndex(idx >= 0 ? idx : 0);
                  }}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-subtle)',
                    aspectRatio: '16 / 9',
                    maxHeight: '520px',
                    background: 'var(--bg-card)',
                  }}
                  className="card-lift featured-hero-interactive"
                >
                  <img
                    src={featuredPhoto.photoPath}
                    alt={featuredPhoto.eventName}
                    className="featured-hero-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Gradient Overlay & Metadata */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.4) 45%, transparent 80%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: 'clamp(20px, 4vw, 36px)',
                      color: '#FFFFFF',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.78rem',
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(8px)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        <Calendar size={12} /> {featuredPhoto.eventDate}
                      </span>

                      {featuredPhoto.isSocietyAttribution ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.78rem',
                            background: 'var(--primary)',
                            color: 'var(--text-inverse)',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: '700',
                          }}
                        >
                          <Camera size={12} /> Photography Society
                        </span>
                      ) : featuredPhoto.photographerCredit ? (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            background: 'rgba(0,0,0,0.45)',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            color: '#E0E0E0',
                          }}
                        >
                          Photo by {featuredPhoto.photographerCredit}
                          {featuredPhoto.photographerSource && ` (${featuredPhoto.photographerSource})`}
                        </span>
                      ) : null}
                    </div>

                    <h2
                      style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
                        fontWeight: '900',
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
                        marginBottom: '6px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      }}
                    >
                      {featuredPhoto.eventName}
                    </h2>

                    {featuredPhoto.caption && (
                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: '#E0E0E0',
                          maxWidth: '680px',
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {featuredPhoto.caption}
                      </p>
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(6px)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#FFFFFF',
                      }}
                    >
                      <Maximize2 size={13} /> Click to expand
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Grid Section */}
            <div ref={gridRef} style={{ marginBottom: 'var(--space-8)' }}>
              <div
                className={gridInView ? 'animate-slide-up delay-1' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-6)',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800' }}>
                    {collection.title || 'Campus Event Retrospective'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
                    Showing {collection.photographs.length} photographs from verified campus proceedings
                  </p>
                </div>
              </div>

              {/* Responsive Photography Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-6)',
                }}
              >
                {collection.photographs.map((photo, idx) => (
                  <Card
                    key={photo._id || idx}
                    glass
                    className={`card-lift gallery-photo-card ${
                      gridInView ? `animate-slide-up delay-${(idx % 6) + 1}` : ''
                    }`}
                    onClick={() => setActivePhotoIndex(idx)}
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 'var(--radius-xl)',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '4 / 3',
                        overflow: 'hidden',
                        background: 'var(--bg-secondary)',
                      }}
                    >
                      <img
                        src={photo.photoPath}
                        alt={photo.eventName}
                        loading="lazy"
                        className="gallery-card-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      {photo.isFeatured && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                          }}
                        >
                          <Badge variant="primary">Featured</Badge>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.72rem',
                          color: 'var(--primary)',
                          fontWeight: '700',
                          marginBottom: '6px',
                        }}
                      >
                        <Calendar size={12} />
                        <span>{photo.eventDate}</span>
                      </div>

                      <h4
                        style={{
                          fontSize: 'var(--text-base)',
                          fontWeight: '800',
                          marginBottom: 'var(--space-2)',
                          lineHeight: 1.3,
                        }}
                      >
                        {photo.eventName}
                      </h4>

                      {photo.caption && (
                        <p
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.5,
                            marginBottom: 'var(--space-4)',
                            flex: 1,
                          }}
                        >
                          {photo.caption}
                        </p>
                      )}

                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: 'var(--space-3)',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {photo.isSocietyAttribution ? (
                          <span style={{ color: 'var(--primary)', fontWeight: '700' }}>
                            Photography Society
                          </span>
                        ) : photo.photographerCredit ? (
                          <span>
                            Photo: {photo.photographerCredit}
                            {photo.photographerSource && ` (${photo.photographerSource})`}
                          </span>
                        ) : (
                          <span>Campus Life</span>
                        )}

                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: '600' }}>
                          <Maximize2 size={11} /> View
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-event-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(16px, 3vw, 32px)',
            animation: 'fadeIn 0.22s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePhotoIndex(null);
          }}
        >
          {/* Top Bar: Counter & Close */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {activePhotoIndex + 1} / {collection.photographs.length}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: '#A0A0A0' }}>
                Use Arrow Keys or buttons to navigate
              </span>
            </div>

            <button
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Close Lightbox"
              className="lightbox-control-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Central Image with Navigation Chevrons */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 0,
              padding: '12px 0',
            }}
          >
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) =>
                  prev === 0 ? collection.photographs.length - 1 : prev - 1
                );
              }}
              aria-label="Previous Photograph"
              className="lightbox-control-btn"
              style={{
                position: 'absolute',
                left: '10px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={26} />
            </button>

            {/* Main Lightbox Image */}
            <img
              key={activePhoto._id || activePhotoIndex}
              src={activePhoto.photoPath}
              alt={activePhoto.eventName}
              className="animate-lightbox-zoom"
              style={{
                maxWidth: '90%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            />

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) =>
                  (prev + 1) % collection.photographs.length
                );
              }}
              aria-label="Next Photograph"
              className="lightbox-control-btn"
              style={{
                position: 'absolute',
                right: '10px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={26} />
            </button>
          </div>

          {/* Bottom Bar: Image Metadata */}
          <div
            className="animate-slide-up delay-1"
            style={{
              background: 'rgba(20, 20, 20, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px 24px',
              maxWidth: '800px',
              margin: '0 auto',
              width: '100%',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                  }}
                >
                  {activePhoto.eventDate}
                </span>
                {activePhoto.isSocietyAttribution && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      background: 'var(--primary)',
                      color: 'var(--text-inverse)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700',
                    }}
                  >
                    Photography Society
                  </span>
                )}
              </div>
              <h3 id="lightbox-event-title" style={{ fontSize: 'var(--text-lg)', fontWeight: '800', margin: 0 }}>
                {activePhoto.eventName}
              </h3>
              {activePhoto.caption && (
                <p style={{ fontSize: 'var(--text-xs)', color: '#C0C0C0', margin: '4px 0 0', lineHeight: 1.4 }}>
                  {activePhoto.caption}
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right', fontSize: 'var(--text-xs)', color: '#A0A0A0' }}>
              <div>Attribution:</div>
              <div style={{ color: '#FFFFFF', fontWeight: '600' }}>
                {activePhoto.photographerCredit || 'Campus Contributor'}
                {activePhoto.photographerSource && ` (${activePhoto.photographerSource})`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
