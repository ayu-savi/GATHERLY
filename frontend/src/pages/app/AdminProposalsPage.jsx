import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  Eye,
  Send,
  Building,
  UserCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { proposalService } from '../../services/proposalService';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';

export const AdminProposalsPage = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Selected proposal for detailed review modal
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError('');
      const params = filter === 'all' ? {} : { status: filter };
      const res = await proposalService.getAllProposals(params);
      setProposals(res.data || []);
    } catch (err) {
      console.warn('Failed to load admin proposals:', err.message);
      setError(err.response?.data?.message || 'Could not load event proposals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [filter]);

  // Strict role check
  if (user && user.role !== 'admin') {
    return (
      <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
          }}
        >
          <ShieldAlert size={48} style={{ color: 'var(--error)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', marginBottom: '8px' }}>
            Administrator Access Only
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '20px' }}>
            The proposal review interface is restricted strictly to authorized campus administrators and committee chairs.
          </p>
          <Link to="/app/overview" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Return to Student Portal</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenReview = (proposal) => {
    setSelectedProposal(proposal);
    setReviewFeedback(proposal.reviewFeedback || '');
    setActionSuccessMessage('');
    setReviewModalOpen(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedProposal) return;

    if (status === 'rejected' && !reviewFeedback.trim()) {
      alert('Please provide review feedback explaining the reason for rejection.');
      return;
    }

    const confirmMsg =
      status === 'approved'
        ? `Approve "${selectedProposal.title}" and automatically publish it to the campus events stage?`
        : `Reject "${selectedProposal.title}" and return feedback to the organizer?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setProcessingAction(true);
      setError('');
      const res = await proposalService.updateProposalStatus(
        selectedProposal._id,
        status,
        reviewFeedback.trim()
      );

      const updated = res.data?.proposal || { ...selectedProposal, status, reviewFeedback };
      const publishedEvent = res.data?.event;

      // Update in local state
      setProposals((prev) =>
        prev.map((p) => (p._id === selectedProposal._id ? updated : p))
      );
      setSelectedProposal(updated);

      if (status === 'approved') {
        setActionSuccessMessage(
          `Proposal approved successfully! Published as Campus Event (${publishedEvent?.slug || 'Live'}).`
        );
      } else {
        setActionSuccessMessage(`Proposal status set to Rejected with feedback sent to student.`);
      }

      await fetchProposals();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update proposal status.');
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div className="editorial-eyebrow" style={{ marginBottom: '6px' }}>
            <FileText size={14} />
            <span>Administrative Workflow</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Campus Proposal Review
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Evaluate student society event proposals, audit proposed budgets, approve publications or provide feedback.
          </p>
        </div>
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
          { key: 'all', label: 'All Proposals' },
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
            Retrieving event proposals for administrative audit...
          </p>
        </div>
      ) : proposals.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-4)' }}>
          <FileText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: '6px' }}>
            No proposals found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '420px', margin: '0 auto' }}>
            There are currently no event proposals matching the selected filter state.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
          {proposals.map((proposal) => {
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
                  transition: 'border-color var(--transition-fast)',
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

                  <Button
                    variant={isApproved ? 'outline' : 'primary'}
                    size="sm"
                    icon={Eye}
                    onClick={() => handleOpenReview(proposal)}
                  >
                    {isApproved ? 'View Details' : 'Review Proposal'}
                  </Button>
                </div>

                {/* Submitter & Budget Highlights Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserCheck size={14} style={{ color: 'var(--primary)' }} />
                      <span>
                        <strong>Lead:</strong> {proposal.leadOrganizer?.name || 'Student Organizer'} ({proposal.clubOrSociety || 'Society'})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{proposal.startDate} • {proposal.startTime}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{proposal.venue}</span>
                    </div>
                  </div>

                  {/* Administrator Confidential Budget Highlight */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Est. Budget: ₹{(proposal.totalEstimatedBudget || 0).toLocaleString()}
                    </span>
                    {proposal.requestedInstitutionalFunding > 0 && (
                      <span
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--error)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '600',
                        }}
                      >
                        Req. Grant: ₹{proposal.requestedInstitutionalFunding.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback note if present */}
                {proposal.reviewFeedback && (
                  <div
                    style={{
                      background: 'var(--bg-elevated)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      borderLeft: `3px solid ${isApproved ? 'var(--emerald-500)' : 'var(--error)'}`,
                    }}
                  >
                    <strong>Committee Feedback:</strong> {proposal.reviewFeedback}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Comprehensive Proposal Review & Audit Modal */}
      {selectedProposal && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="Campus Proposal Audit & Review"
          maxWidth="750px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Header info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selectedProposal.proposalReference}
                </span>
                {getStatusBadge(selectedProposal.status)}
                <Badge variant="neutral">{selectedProposal.category}</Badge>
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', margin: '4px 0 8px', color: 'var(--text-primary)' }}>
                {selectedProposal.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: 0 }}>
                {selectedProposal.description}
              </p>
            </div>

            {actionSuccessMessage && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid var(--emerald-500)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} style={{ color: 'var(--emerald-500)' }} />
                <span>{actionSuccessMessage}</span>
              </div>
            )}

            {/* Grid of Key Logistics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-3)',
                background: 'var(--bg-elevated)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Date & Schedule</span>
                <strong>{selectedProposal.startDate}</strong> {selectedProposal.endDate ? `to ${selectedProposal.endDate}` : ''} ({selectedProposal.startTime} - {selectedProposal.endTime})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Venue Location</span>
                <strong>{selectedProposal.venue}</strong> ({selectedProposal.building || 'Campus'})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Capacity & Mode</span>
                <strong>{selectedProposal.maxCapacity || selectedProposal.expectedParticipants || 100} Spots</strong> • {selectedProposal.eventMode || 'offline'}
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Lead Organizer</span>
                <strong>{selectedProposal.leadOrganizer?.name}</strong> ({selectedProposal.leadOrganizer?.department || 'Student'})
              </div>
            </div>

            {/* CONFIDENTIAL ADMINISTRATOR AUDIT: Budget Breakdown */}
            <div
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} style={{ color: 'var(--primary)' }} />
                  <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: '700' }}>
                    Confidential Budget & Financial Audit (Admin Only)
                  </h4>
                </div>
                <Badge variant="warning">Restricted to Admins</Badge>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: 'var(--text-xs)',
                  textAlign: 'center',
                }}
              >
                <div style={{ background: 'var(--bg-elevated)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Total Estimated Budget</span>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    ₹{(selectedProposal.totalEstimatedBudget || 0).toLocaleString()}
                  </strong>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Expected Sponsorship</span>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>
                    ₹{(selectedProposal.expectedSponsorship || 0).toLocaleString()}
                  </strong>
                </div>
                <div style={{ background: 'var(--bg-elevated)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Requested Grant</span>
                  <strong style={{ fontSize: 'var(--text-sm)', color: selectedProposal.requestedInstitutionalFunding > 0 ? 'var(--error)' : 'var(--text-primary)' }}>
                    ₹{(selectedProposal.requestedInstitutionalFunding || 0).toLocaleString()}
                  </strong>
                </div>
              </div>

              {Array.isArray(selectedProposal.budgetItems) && selectedProposal.budgetItems.length > 0 && (
                <div style={{ maxHeight: '140px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '4px 8px' }}>Item Description</th>
                        <th style={{ padding: '4px 8px', textAlign: 'right' }}>Est. Cost (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProposal.budgetItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '6px 8px' }}>{item.description}</td>
                          <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                            ₹{(item.estimatedAmount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Committee Review Action Area */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-secondary)' }}>
                Reviewer Feedback / Revision Notes for Student Organizer:
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={3}
                disabled={processingAction || selectedProposal.status === 'approved'}
                placeholder="Enter approval conditions, logistical guidance, or reasons for rejection..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  resize: 'vertical',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div>
                  {selectedProposal.eventId && (
                    <Link
                      to={`/events/${selectedProposal.eventId}`}
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: '700' }}
                    >
                      <ExternalLink size={14} />
                      <span>View Published Event</span>
                    </Link>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  {selectedProposal.status !== 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={XCircle}
                      disabled={processingAction}
                      onClick={() => handleStatusUpdate('rejected')}
                      style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                    >
                      {processingAction ? 'Updating...' : 'Reject Proposal'}
                    </Button>
                  )}

                  {selectedProposal.status !== 'approved' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      disabled={processingAction}
                      onClick={() => handleStatusUpdate('approved')}
                    >
                      {processingAction ? 'Publishing Event...' : 'Approve & Publish Event'}
                    </Button>
                  ) : (
                    <Badge variant="success">Event Published</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminProposalsPage;
