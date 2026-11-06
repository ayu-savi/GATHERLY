import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Compass,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { registrationService } from '../../services/registrationService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionError, setActionError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    setActionError('');
    try {
      const res = await registrationService.getMyRegistrations();
      setRegistrations(res.data || []);
    } catch (err) {
      setActionError('Could not load registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this event registration? Your spot will be released.')) {
      return;
    }

    setCancellingId(regId);
    try {
      await registrationService.cancelRegistration(regId);
      // Refresh list
      await fetchRegistrations();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to cancel registration.');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = registrations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
            My Registrations
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Review your campus event admissions, digital passes, and registration history.
          </p>
        </div>

        <Link to="/events" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="sm" icon={Compass}>
            Discover Events
          </Button>
        </Link>
      </div>

      {actionError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--error-bg)',
            border: '1px solid var(--error)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-xs)',
          }}
        >
          {actionError}
        </div>
      )}

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
        }}
      >
        {['all', 'confirmed', 'attended', 'cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: filter === tab ? 'var(--primary)' : 'var(--bg-elevated)',
              color: filter === tab ? 'var(--text-inverse)' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-xs)',
              fontWeight: filter === tab ? '700' : '500',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab} ({tab === 'all' ? registrations.length : registrations.filter((r) => r.status === tab).length})
          </button>
        ))}
      </div>

      {/* Registrations List */}
      {loading ? (
        <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Loading your registrations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: 'var(--space-12)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            border: '1.5px dashed var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Ticket size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            No Registrations Found
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '6px 0 16px' }}>
            {filter === 'all'
              ? 'You have not registered for any events yet.'
              : `You have no registrations under "${filter}".`}
          </p>
          <Link to="/events">
            <Button variant="primary" size="sm" icon={Compass}>
              Browse Upcoming Events
            </Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filtered.map((reg) => (
            <div
              key={reg._id || reg.registrationId}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                display: 'grid',
                gridTemplateColumns: '120px minmax(0, 1fr) auto',
                gap: 'var(--space-6)',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
              className="registration-card"
            >
              {/* Event Image */}
              <div style={{ width: '120px', height: '90px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={reg.eventImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'}
                  alt={reg.eventTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Event Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 'bold' }}>
                    {reg.passId}
                  </span>
                  <Badge variant={reg.status === 'confirmed' ? 'success' : reg.status === 'attended' ? 'primary' : 'error'}>
                    {reg.status}
                  </Badge>
                  {reg.registrationType === 'team' && (
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                      Team: {reg.teamName || 'Roster'}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 6px' }}>
                  {reg.eventTitle}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={13} style={{ color: 'var(--primary)' }} />
                    <span>{reg.eventDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={13} style={{ color: 'var(--accent-secondary)' }} />
                    <span>{reg.eventVenue}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Ticket size={13} />
                    <span>Attendee: {reg.participantName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                <Link to={`/app/passes/${reg.passId || reg.registrationId}`} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="sm" fullWidth icon={Ticket}>
                    Digital Pass
                  </Button>
                </Link>

                <Link to={`/events/${reg.eventSlug || reg.event}`} style={{ textDecoration: 'none' }}>
                  <Button variant="ghost" size="sm" fullWidth>
                    Event Details
                  </Button>
                </Link>

                {reg.status === 'confirmed' && (
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    loading={cancellingId === (reg._id || reg.registrationId)}
                    onClick={() => handleCancel(reg._id || reg.registrationId)}
                    icon={Trash2}
                  >
                    Cancel Spot
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistrationsPage;

