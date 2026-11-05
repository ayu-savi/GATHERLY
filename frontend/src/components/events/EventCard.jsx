import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const EventCard = ({
  event,
  layout = 'card', // 'card' | 'featured-hero'
  className = '',
  style = {},
}) => {
  if (!event) return null;

  const {
    id,
    _id,
    slug,
    title,
    tagline,
    description,
    category,
    image,
    date,
    time,
    venue,
    registrationStatus = 'Open',
    registrationFee = 0,
  } = event;

  const eventIdentifier = slug || id || _id;

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Filling Fast':
        return <Badge variant="warning">Filling Fast</Badge>;
      case 'Waitlist':
      case 'Closed':
        return <Badge variant="error">{status}</Badge>;
      case 'Open':
      default:
        return <Badge variant="success">Open</Badge>;
    }
  };

  // =========================================================================
  // 1. FEATURED HERO WIDESCREEN LAYOUT
  // =========================================================================
  if (layout === 'featured-hero') {
    return (
      <article
        className={`gatherly-featured-hero ${className}`}
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
      >
        {/* Left Hero Media Banner */}
        <div style={{ position: 'relative', minHeight: '320px', overflow: 'hidden' }}>
          <img
            src={image}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              gap: '8px',
            }}
          >
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid var(--border-strong)',
                fontSize: '0.72rem',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: registrationFee > 0 ? 'var(--bg-elevated)' : 'var(--success-bg)',
                color: registrationFee > 0 ? 'var(--text-primary)' : 'var(--success)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.72rem',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {registrationFee > 0 ? `Entry: ₹${registrationFee}` : 'FREE ENTRY'}
            </span>
          </div>
        </div>

        {/* Right Editorial Info */}
        <div
          style={{
            padding: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--primary)',
                  fontWeight: '800',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Lead Campus Feature
              </span>
              {getStatusBadge(registrationStatus)}
            </div>

            <h3
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                fontWeight: '800',
                lineHeight: 1.25,
                color: 'var(--text-primary)',
                marginBottom: '10px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              <Link to={`/events/${eventIdentifier}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {title}
              </Link>
            </h3>

            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: 'var(--space-6)',
              }}
            >
              {tagline || description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                padding: '14px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: 'var(--primary)' }} />
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Date</span>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{formatDate(date)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} style={{ color: 'var(--accent-secondary)' }} />
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Venue</span>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '140px' }}>
                    {venue}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <Link to={`/events/${eventIdentifier}`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" fullWidth icon={ArrowRight} iconPosition="right">
              View Complete Event Profile
            </Button>
          </Link>
        </div>
      </article>
    );
  }

  // =========================================================================
  // 2. STANDARD STREAMLINED CARD LAYOUT
  // =========================================================================
  return (
    <article
      className={`gatherly-event-card ${className}`}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease',
        position: 'relative',
        height: '100%',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        const img = e.currentTarget.querySelector('.event-card-img');
        if (img) img.style.transform = 'scale(1.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        const img = e.currentTarget.querySelector('.event-card-img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      {/* 16:9 Image container with zoom hover */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
        <img
          className="event-card-img"
          src={image}
          alt={title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Top Floating Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid var(--border-strong)',
              fontSize: '0.68rem',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
            }}
          >
            {category}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: registrationFee > 0 ? 'var(--bg-elevated)' : 'var(--success-bg)',
                color: registrationFee > 0 ? 'var(--text-primary)' : 'var(--success)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.68rem',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {registrationFee > 0 ? `₹${registrationFee}` : 'FREE'}
            </span>
            {getStatusBadge(registrationStatus)}
          </div>
        </div>
      </div>

      {/* Streamlined Body */}
      <div
        style={{
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--weight-bold)',
            lineHeight: 1.35,
            marginBottom: 'var(--space-2)',
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link
            to={`/events/${eventIdentifier}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {title}
          </Link>
        </h3>

        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: 'var(--space-4)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {tagline || description}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-5)',
            marginTop: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Calendar size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{formatDate(date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <MapPin size={13} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {venue}
            </span>
          </div>
        </div>

        <Link
          to={`/events/${eventIdentifier}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <Button
            variant="primary"
            size="sm"
            fullWidth
            icon={ArrowRight}
            iconPosition="right"
          >
            View Event Details
          </Button>
        </Link>
      </div>
    </article>
  );
};

export default EventCard;
