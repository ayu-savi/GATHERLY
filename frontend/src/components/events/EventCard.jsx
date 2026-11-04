import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowUpRight, Users, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const EventCard = ({
  event,
  onRegister,
  layout = 'card', // 'card' | 'featured-hero' | 'compact-row'
  className = '',
  style = {},
}) => {
  if (!event) return null;

  const {
    id,
    title,
    tagline,
    description,
    category,
    image,
    date,
    time,
    venue,
    capacity = 100,
    registeredCount = 0,
    registrationStatus = 'Open',
    isFeatured = false,
  } = event;

  const fillPercentage = Math.min(100, Math.round((registeredCount / capacity) * 100));

  // Category badge variant helper
  const getCategoryBadgeVariant = (cat) => {
    switch ((cat || '').toLowerCase()) {
      case 'technical':
        return 'primary';
      case 'cultural':
      case 'arts & entertainment':
        return 'highlight';
      case 'sports':
      case 'gaming':
        return 'secondary';
      default:
        return 'peach';
    }
  };

  // Status badge variant helper (NO ORANGE)
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

  // Format date parts (e.g. "2026-11-20" -> { month: "NOV", day: "20" })
  const getDateParts = (dateString) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) {
        return { month: 'DATE', day: dateString };
      }
      return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: d.getDate(),
      };
    } catch (e) {
      return { month: 'CAMPUS', day: '2026' };
    }
  };

  const { month, day } = getDateParts(date);

  // =========================================================================
  // LAYOUT 1: FEATURED HERO BANNER (Asymmetric Large Lead Event)
  // =========================================================================
  if (layout === 'featured-hero') {
    return (
      <div
        className={`gatherly-event-hero ${className}`}
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          transition: 'all var(--transition-base)',
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
        {/* Left: Large Image with Date Block */}
        <div style={{ position: 'relative', minHeight: '340px', overflow: 'hidden' }}>
          <img
            src={image}
            alt={title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-smooth)',
            }}
          />

          {/* Date Block Stamp */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '800',
                letterSpacing: '0.1em',
                color: 'var(--primary)',
              }}
            >
              {month}
            </div>
            <div
              style={{
                fontSize: '1.4rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: '900',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {day}
            </div>
          </div>

          {/* Badges Top Right */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px' }}>
            <Badge variant="featured" icon={Sparkles}>Signature Fest</Badge>
            {getStatusBadge(registrationStatus)}
          </div>
        </div>

        {/* Right: Rich Editorial Content */}
        <div style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <Badge variant={getCategoryBadgeVariant(category)}>{category}</Badge>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Campus Flagship
            </span>
          </div>

          <h3
            style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
              fontWeight: '800',
              lineHeight: 1.25,
              marginBottom: 'var(--space-3)',
              color: 'var(--text-primary)',
            }}
          >
            <Link to={`/events/${id}`} style={{ color: 'inherit' }}>
              {title}
            </Link>
          </h3>

          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-6)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description || tagline}
          </p>

          {/* Schedule & Venue Meta */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-5)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              padding: 'var(--space-4) 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--primary)" />
              <span>{time}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--primary)" />
              <span>{venue}</span>
            </div>
          </div>

          {/* Capacity Meter & CTAs */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} /> {registeredCount} / {capacity} Registered
              </span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{fillPercentage}% Capacity</span>
            </div>

            <div
              style={{
                width: '100%',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-elevated)',
                overflow: 'hidden',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div
                style={{
                  width: `${fillPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--accent-secondary))',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Link to={`/events/${id}`} style={{ flex: 1 }}>
                <Button fullWidth variant="primary" size="md" icon={ArrowUpRight} iconPosition="right">
                  View Full Agenda
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="md"
                onClick={() => (onRegister ? onRegister(event) : (window.location.href = `/events/${id}`))}
              >
                Register Pass
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LAYOUT 2: STANDARD EDITORIAL CARD
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
        transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
        position: 'relative',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Banner Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-smooth)',
          }}
        />

        {/* Date Stamp Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--primary)' }}>
            {month}
          </span>
          <span style={{ width: '1px', height: '10px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: '900', color: 'var(--text-primary)' }}>
            {day}
          </span>
        </div>

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <Badge variant={getCategoryBadgeVariant(category)}>{category}</Badge>
          </div>
          <div style={{ display: 'flex', gap: '4px', pointerEvents: 'auto' }}>
            {getStatusBadge(registrationStatus)}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', flex: 1 }}>
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
          <Link to={`/events/${id}`} style={{ color: 'inherit' }}>
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
          {description || tagline}
        </p>

        {/* Venue & Time Meta */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} color="var(--primary)" />
            <span>{time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={12} color="var(--primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {venue}
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div style={{ marginTop: 'auto', marginBottom: 'var(--space-4)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}
          >
            <span>Seats: {registeredCount} / {capacity}</span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{fillPercentage}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${fillPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--accent-secondary))',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
        </div>

        {/* Card Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <Link to={`/events/${id}`} style={{ flex: 1 }}>
            <Button fullWidth variant="secondary" size="sm">
              Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            style={{ flex: 1 }}
            disabled={registrationStatus === 'Closed'}
            onClick={() => (onRegister ? onRegister(event) : (window.location.href = `/events/${id}`))}
          >
            {registrationStatus === 'Closed' ? 'Closed' : 'Register'}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
