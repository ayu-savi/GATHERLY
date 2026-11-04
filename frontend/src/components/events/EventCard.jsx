import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowUpRight, Users, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const EventCard = ({
  event,
  onRegister,
  featured = false,
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

  // Calculate percentage of seats filled
  const fillPercentage = Math.min(100, Math.round((registeredCount / capacity) * 100));

  // Category badge variant helper
  const getCategoryBadgeVariant = (cat) => {
    switch ((cat || '').toLowerCase()) {
      case 'technical':
        return 'primary';
      case 'cultural':
        return 'pink';
      case 'sports':
      case 'gaming':
        return 'turquoise';
      default:
        return 'peach';
    }
  };

  // Status badge variant helper (STRICT: NO ORANGE!)
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

  return (
    <div
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
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Banner Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
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
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Top Badges Overlay */}
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
          <div style={{ pointerEvents: 'auto' }}>
            <Badge variant={getCategoryBadgeVariant(category)}>
              {category}
            </Badge>
          </div>

          <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto' }}>
            {isFeatured && (
              <Badge variant="featured" icon={Sparkles}>
                Featured
              </Badge>
            )}
            {getStatusBadge(registrationStatus)}
          </div>
        </div>

        {/* Date Pill Floating Bottom Left */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--text-primary)',
          }}
        >
          <Calendar size={13} color="var(--primary)" />
          <span>{date}</span>
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-bold)',
            lineHeight: 1.3,
            marginBottom: 'var(--space-2)',
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link
            to={`/events/${id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {title}
          </Link>
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: 'var(--text-sm)',
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

        {/* Metadata Details List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={13} color="var(--accent-secondary)" />
            <span>{time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={13} color="var(--accent-secondary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {venue}
            </span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div style={{ marginTop: 'auto', marginBottom: 'var(--space-5)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginBottom: '5px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} /> Seats: {registeredCount} / {capacity}
            </span>
            <span style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-secondary)' }}>
              {fillPercentage}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${fillPercentage}%`,
                height: '100%',
                background:
                  fillPercentage > 85
                    ? 'var(--primary)'
                    : 'linear-gradient(90deg, var(--primary), var(--accent-secondary))',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <Link to={`/events/${id}`} style={{ flex: 1 }}>
            <Button fullWidth variant="secondary" size="sm" icon={ArrowUpRight} iconPosition="right">
              Details
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            style={{ flex: 1 }}
            disabled={registrationStatus === 'Closed'}
            onClick={() => {
              if (onRegister) {
                onRegister(event);
              } else {
                window.location.href = `/events/${id}`;
              }
            }}
          >
            {registrationStatus === 'Closed' ? 'Closed' : 'Register'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
