import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Compass,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { proposalService } from '../../services/proposalService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { HostEventModal } from '../../components/events/HostEventModal';

export const MyProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [hostModalOpen, setHostModalOpen] = useState(false);

  const fetchMyProposals = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await proposalService.getMyProposals();
      setProposals(res.data || []);
    } catch (err) {
      console.warn('Failed to load my proposals:', err.message);
      setError('Could not load your submitted proposals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProposals();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved & Published</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'revision_requested':
        return <Badge variant="warning">Revision Requested</Badge>;
      case 'under_review':
        return <Badge variant="info">Under Review</Badge>;
      case 'pending_review':
      default:
        return <Badge variant="warning">Pending Review</Badge>;
    }
  };

  const filtered = proposals.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div className="editorial-eyebrow" style={{ marginBottom: '6px' }}>
            <FileText size={14} />
            <span>Event Hosting</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
            My Submitted Proposals
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Track the status of your campus event proposals submitted for administrative committee review.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setHostModalOpen(true)}
        >
          Submit Proposal
        </Button>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--error-bg)',
            border: '1px solid var(--error)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} style={{ color: 'var(--error)' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'all', label: 'All Submissions' },
          { key: 'pending_review', label: 'Pending Review' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: filter === tab.key ? 'var(--primary)' : 'var(--bg-elevated)',
              color: filter === tab.key ? 'var(--text-inverse)' : 'var(--text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: filter === tab.key ? '700' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Proposals Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
          <div className="spinner" style={{ margin: '0 auto var(--space-3)' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Loading your proposal submissions...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-4)' }}>
          <FileText size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: '6px' }}>
            No proposals found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '420px', margin: '0 auto 20px' }}>
            {filter === 'all'
              ? 'You have not submitted any event proposals yet. As a student organizer or club lead, you can propose hackathons, cultural nights, and competitions.'
              : `You have no proposals currently in "${filter.replace('_', ' ')}" status.`}
          </p>
          <Button variant="primary" icon={PlusCircle} onClick={() => setHostModalOpen(true)}>
            Host an Event
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
          {filtered.map((proposal) => {
            const isApproved = proposal.status === 'approved';
            const isRejected = proposal.status === 'rejected';

            return (
              <Card
                key={proposal._id || proposal.proposalReference}
                style={{
                  padding: 'var(--space-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-muted)',
                          fontWeight: '700',
                        }}
                      >
                        {proposal.proposalReference || 'REF-PROP'}
                      </span>
                      {getStatusBadge(proposal.status)}
                      <Badge variant="neutral">{proposal.category}</Badge>
                      <Badge variant="neutral">{proposal.eventType || 'Event'}</Badge>
                    </div>

                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', margin: '0 0 6px', color: 'var(--text-primary)' }}>
                      {proposal.title}
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {proposal.tagline || proposal.description?.slice(0, 160) + '...'}
                    </p>
                  </div>

                  {isApproved && proposal.eventId && (
                    <Link to={`/events/${proposal.eventId}`} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="sm" icon={ExternalLink}>
                        View Live Event
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Logistics details */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>Proposed Date: {proposal.startDate} ({proposal.startTime})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>{proposal.venue}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>Submitted: {new Date(proposal.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Reviewer Feedback Banner */}
                {proposal.reviewFeedback && (
                  <div
                    style={{
                      background: isApproved ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      borderLeft: `3px solid ${isApproved ? 'var(--emerald-500)' : 'var(--error)'}`,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: isApproved ? 'var(--emerald-500)' : 'var(--error)' }}>
                      <MessageSquare size={13} />
                      <span>Campus Review Committee Feedback</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {proposal.reviewFeedback}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Host Event Modal */}
      <HostEventModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        onSuccess={() => {
          setHostModalOpen(false);
          fetchMyProposals();
        }}
      />
    </div>
  );
};

export default MyProposalsPage;
