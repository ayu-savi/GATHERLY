import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  DollarSign,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  Send,
  Building,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import { useAuth } from '../../hooks/useAuth';
import { proposalService } from '../../services/proposalService';

const STEP_TITLES = [
  'Basic Info',
  'Date & Venue',
  'Organizer & Team',
  'Registration',
  'Budget & Finance',
  'Prizes & Sponsors',
  'Rules & Safety',
  'Agenda Schedule',
  'Media & Docs',
  'Review & Submit',
];

const CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshops',
  'Seminars',
  'Competitions',
  'Entrepreneurship',
  'Other',
];

export const HostEventModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedProposal, setSubmittedProposal] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Event Information
    title: '',
    category: 'Technical',
    eventType: 'Competition',
    tagline: '',
    description: '',
    objectives: '',
    intendedAudience: 'All Campus Students',
    eventMode: 'offline',

    // Step 2: Date, Time & Venue
    startDate: '',
    endDate: '',
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    duration: 'Full Day',
    venue: '',
    building: '',
    roomDetails: '',
    expectedParticipants: 60,
    minParticipants: 15,
    maxCapacity: 100,

    // Step 3: Organizer & Committee
    leadOrganizer: {
      name: '',
      studentId: '',
      department: '',
      email: '',
      phone: '',
    },
    clubOrSociety: '',
    facultyCoordinator: {
      name: '',
      email: '',
      phone: '',
    },
    committeeMembers: [
      { name: '', role: 'Operations Lead', contact: '' },
    ],

    // Step 4: Registration & Participation
    registrationType: 'free',
    registrationFee: 0,
    maxRegistrations: 100,
    registrationOpeningDate: '',
    registrationClosingDeadline: '',
    participationMode: 'individual',
    teamSizeMin: 1,
    teamSizeMax: 4,
    eligibility: 'Open to all currently enrolled campus university students.',
    instructions: 'Please bring your student ID and laptop/equipment.',

    // Step 5: Financial & Budget Proposal (Internal only)
    budgetItems: [
      { description: 'Venue Setup & Sound Engineering', estimatedAmount: 12000 },
      { description: 'Participant Badges & Printing', estimatedAmount: 5000 },
      { description: 'Refreshments & Mineral Water', estimatedAmount: 8000 },
    ],
    totalEstimatedBudget: 25000,
    expectedSponsorship: 0,
    otherFunding: 0,
    expectedRegistrationRevenue: 0,
    requestedInstitutionalFunding: 25000,

    // Step 6: Prizes, Rewards & Sponsorships
    prizesOffered: true,
    firstPlace: '₹10,000 Cash Prize + Winner Trophy',
    secondPlace: '₹5,000 Cash Prize + Silver Runner-up Plaque',
    thirdPlace: '₹2,500 Cash Prize + Bronze Plaque',
    otherRewards: 'Certificate of Merit for Top 5 teams',
    totalPrizePool: 17500,
    sponsors: [
      { name: '', contribution: '', benefits: '' },
    ],

    // Step 7: Event Rules & Requirements
    rulesList: [
      'Participants must present a valid university student identity card at registration.',
      'Plagiarism or misconduct results in immediate disqualification by the organizers.',
      'All team members must be present during evaluation and certificate distribution.',
    ],
    codeOfConduct: 'Respect, integrity, and adherence to collegiate safety regulations are mandatory.',
    judgingCriteria: 'Technical accuracy (40%), innovation (30%), presentation & Q&A (30%).',
    cancellationPolicy: 'Cancellations must be communicated 24 hours prior.',
    safetyRequirements: 'Emergency exits and standard university lab safety protocols apply.',
    equipmentRequirements: '',
    accessibilityRequirements: 'Auditorium and ground floors are ramp and wheelchair accessible.',

    // Step 8: Event Agenda
    agendaItems: [
      { startTime: '10:00 AM', endTime: '10:30 AM', title: 'Registration & Welcome Keynote', description: 'Check-in and team kit handout', venue: 'Main Foyer' },
      { startTime: '10:30 AM', endTime: '01:30 PM', title: 'Round 1: Main Challenge', description: 'Execution of problem statements', venue: 'Main Arena' },
      { startTime: '02:30 PM', endTime: '04:30 PM', title: 'Jury Evaluation & Presentations', description: 'Project demos to judge panel', venue: 'Auditorium' },
      { startTime: '04:30 PM', endTime: '05:00 PM', title: 'Award Ceremony & Valedictory', description: 'Prize distribution', venue: 'Auditorium' },
    ],

    // Step 9: Media & Supporting Documents
    posterUrl: '/uploads/events/rhythm_lights_cultural.jpg',
    supportingImages: [],
    proposalDocumentUrl: '',
    sponsorshipDocumentUrl: '',

    // Step 10: Confirmation
    confirmedAccurate: false,
    acknowledgedPolicies: false,
  });

  // Pre-populate authenticated student info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        leadOrganizer: {
          name: prev.leadOrganizer.name || user.fullName || '',
          studentId: prev.leadOrganizer.studentId || user.studentId || '',
          department: prev.leadOrganizer.department || user.department || '',
          email: prev.leadOrganizer.email || user.email || '',
          phone: prev.leadOrganizer.phone || '',
        },
      }));
    }
  }, [user]);

  // Auto-calculate budget sum whenever budgetItems change
  useEffect(() => {
    const sum = formData.budgetItems.reduce((acc, curr) => acc + (Number(curr.estimatedAmount) || 0), 0);
    setFormData((prev) => ({
      ...prev,
      totalEstimatedBudget: sum,
      requestedInstitutionalFunding: Math.max(0, sum - (Number(prev.expectedSponsorship) || 0) - (Number(prev.expectedRegistrationRevenue) || 0)),
    }));
  }, [formData.budgetItems, formData.expectedSponsorship, formData.expectedRegistrationRevenue]);

  // Validation per step
  const validateCurrentStep = () => {
    setError('');

    if (currentStep === 1) {
      if (!formData.title.trim()) return 'Event Title is required.';
      if (!formData.category.trim()) return 'Please select an event category.';
      if (!formData.description.trim()) return 'Detailed event description is required.';
    }

    if (currentStep === 2) {
      if (!formData.startDate) return 'Proposed event start date is required.';
      if (!formData.startTime) return 'Start time is required.';
      if (!formData.endTime) return 'End time is required.';
      if (!formData.venue.trim()) return 'Proposed venue or ground details are required.';
      if (Number(formData.maxCapacity) <= 0) return 'Maximum capacity must be a positive number.';
    }

    if (currentStep === 3) {
      if (!formData.leadOrganizer.name.trim()) return 'Lead Organizer Name is required.';
      if (!formData.leadOrganizer.email.trim()) return 'Lead Organizer Email is required.';
      if (!formData.clubOrSociety.trim()) return 'Organizing Club or Society name is required.';
    }

    if (currentStep === 4) {
      if (formData.registrationType === 'paid' && Number(formData.registrationFee) <= 0) {
        return 'Please enter a valid non-zero registration fee, or select Free.';
      }
    }

    if (currentStep === 10) {
      if (!formData.confirmedAccurate) return 'Please confirm that the proposal details are accurate.';
      if (!formData.acknowledgedPolicies) return 'Please acknowledge university campus event guidelines.';
    }

    return null;
  };

  const handleNext = () => {
    const err = validateCurrentStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setCurrentStep((prev) => Math.min(10, prev + 1));
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const err = validateCurrentStep();
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await proposalService.submitProposal(formData);
      if (res && res.success) {
        setSubmittedProposal(res.data || res.meta);
        if (onSuccess) onSuccess(res.data);
      } else {
        setError(res?.message || 'Failed to submit proposal. Please check required fields.');
      }
    } catch (err) {
      console.error('Proposal submission error:', err);
      // If 401 unauthorized, prompt user
      if (err.response?.status === 401) {
        setError('Please log in with your university account to submit an event proposal.');
      } else {
        setError(err.response?.data?.message || err.message || 'Error communicating with server.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Helper dynamic mutators
  const addCommitteeMember = () => {
    setFormData((prev) => ({
      ...prev,
      committeeMembers: [...prev.committeeMembers, { name: '', role: 'Committee Member', contact: '' }],
    }));
  };

  const removeCommitteeMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      committeeMembers: prev.committeeMembers.filter((_, i) => i !== index),
    }));
  };

  const addBudgetItem = () => {
    setFormData((prev) => ({
      ...prev,
      budgetItems: [...prev.budgetItems, { description: 'New Line Item', estimatedAmount: 5000 }],
    }));
  };

  const removeBudgetItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.filter((_, i) => i !== index),
    }));
  };

  const addRule = () => {
    setFormData((prev) => ({
      ...prev,
      rulesList: [...prev.rulesList, ''],
    }));
  };

  const removeRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      rulesList: prev.rulesList.filter((_, i) => i !== index),
    }));
  };

  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agendaItems: [
        ...prev.agendaItems,
        { startTime: '12:00 PM', endTime: '01:00 PM', title: 'Session Activity', description: '', venue: prev.venue || 'Campus Venue' },
      ],
    }));
  };

  const removeAgendaItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      agendaItems: prev.agendaItems.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="860px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 'min(88vh, 800px)', maxHeight: '92dvh', overflow: 'hidden' }}>
        {/* Header Bar */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                }}
              />
              <span style={{ fontSize: '0.72rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                University Event Proposal
              </span>
            </div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0 0' }}>
              Host a Campus Event
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                color: 'var(--text-muted)',
                background: 'var(--bg-elevated)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Step {currentStep} of 10
            </span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div style={{ background: 'var(--bg-elevated)', height: '4px', width: '100%', position: 'relative' }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent-secondary) 100%)',
              width: `${(currentStep / 10) * 100}%`,
              transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Stepper Indicator Pills (Horizontal Scrollable) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            padding: '8px var(--space-6)',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            scrollbarWidth: 'none',
          }}
        >
          {STEP_TITLES.map((title, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                key={title}
                type="button"
                onClick={() => {
                  if (stepNum < currentStep) setCurrentStep(stepNum);
                }}
                disabled={stepNum > currentStep}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.68rem',
                  fontWeight: isCurrent ? '800' : '600',
                  color: isCurrent ? 'var(--text-inverse)' : isDone ? 'var(--primary)' : 'var(--text-muted)',
                  background: isCurrent ? 'var(--primary)' : isDone ? 'var(--bg-elevated)' : 'transparent',
                  border: isDone ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: isDone ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {isDone ? <Check size={10} strokeWidth={3} /> : <span>{stepNum}</span>}
                <span>{title}</span>
              </button>
            );
          })}
        </div>

        {/* Interior Form Content (Scrollable) */}
        <div
          style={{
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
            background: 'var(--bg-primary)',
          }}
        >
          {/* Success Submission Screen */}
          {submittedProposal ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-8) var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-4)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  border: '2px solid var(--success)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--success)',
                    background: 'var(--success-bg)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  PROPOSAL SUBMITTED SUCCESSFULLY
                </span>
                <h3
                  style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    margin: '12px 0 6px',
                  }}
                >
                  {formData.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '480px', margin: '0 auto' }}>
                  Your event proposal has been submitted successfully. It will be reviewed by the authorized campus committee.
                </p>
              </div>

              {/* Reference Card */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4) var(--space-6)',
                  width: '100%',
                  maxWidth: '420px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Proposal Reference:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: '0.85rem' }}>
                    {submittedProposal.proposalReference || submittedProposal.reference || 'PROP-GATH-2026'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Initial Review Status:</span>
                  <Badge variant="warning">Pending Review</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Submitting Club:</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                    {formData.clubOrSociety}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <Button variant="primary" size="md" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {/* Error Notice */}
              {error && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--error-bg)',
                    border: '1px solid var(--error)',
                    color: 'var(--error)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <AlertCircle size={16} flexShrink={0} />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: Basic Event Information */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 1: Basic Event Information
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Explain what your event is about, its objectives, and core target audience.
                    </p>
                  </div>

                  <Input
                    label="Event Title"
                    placeholder="e.g. HackNexa 2026: 36-Hour National Campus Hackathon"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                    <div>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Event Type
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <option value="Competition">Competition</option>
                        <option value="Technical Hackathon">Technical Hackathon</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Cultural Fest">Cultural Fest</option>
                        <option value="Sports Tournament">Sports Tournament</option>
                        <option value="Summit">Summit</option>
                        <option value="Exhibition">Exhibition</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Event Mode
                      </label>
                      <select
                        value={formData.eventMode}
                        onChange={(e) => setFormData({ ...formData, eventMode: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <option value="offline">In-Person (Offline)</option>
                        <option value="online">Virtual (Online)</option>
                        <option value="hybrid">Hybrid (Offline + Live Stream)</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Short Tagline"
                    placeholder="e.g. 36 hours of relentless engineering, mentorship and demo day glory"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />

                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Detailed Event Description *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive overview of the event, tracks, guidelines, and what students will experience..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg-secondary)',
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Key Objectives"
                      placeholder="e.g. Promote open-source software, student research and AI integration"
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    />

                    <Input
                      label="Intended Audience"
                      placeholder="e.g. Computer Science, AI, and Electronics undergraduates"
                      value={formData.intendedAudience}
                      onChange={(e) => setFormData({ ...formData, intendedAudience: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Date, Time & Venue */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 2: Proposed Date, Time & Campus Venue
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Provide exact dates, booking blocks, and capacity thresholds for hall reservation.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Proposed Start Date *"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />

                    <Input
                      label="End Date (for multi-day)"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />

                    <Input
                      label="Start Time *"
                      placeholder="e.g. 09:00 AM"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />

                    <Input
                      label="End Time *"
                      placeholder="e.g. 05:00 PM"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Proposed Primary Venue *"
                    placeholder="e.g. Turing Auditorium & Innovation Hub"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Building / Campus Block"
                      placeholder="e.g. Tech Block B, 2nd Floor"
                      value={formData.building}
                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    />

                    <Input
                      label="Room / Lab Details"
                      placeholder="e.g. Room 204 & Project Sandbox"
                      value={formData.roomDetails}
                      onChange={(e) => setFormData({ ...formData, roomDetails: e.target.value })}
                    />

                    <Input
                      label="Expected Duration"
                      placeholder="e.g. 8 Hours, 2 Days, 36 Hours"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Expected Participants"
                      type="number"
                      min="1"
                      value={formData.expectedParticipants}
                      onChange={(e) => setFormData({ ...formData, expectedParticipants: Number(e.target.value) })}
                    />

                    <Input
                      label="Min Required"
                      type="number"
                      min="1"
                      value={formData.minParticipants}
                      onChange={(e) => setFormData({ ...formData, minParticipants: Number(e.target.value) })}
                    />

                    <Input
                      label="Maximum Capacity *"
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Organizer & Committee Details */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 3: Organizing Society & Committee
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Detail the responsible student chapter, faculty patron, and core committee leads.
                    </p>
                  </div>

                  <Input
                    label="Organizing Club, Society or Department *"
                    placeholder="e.g. Turing Computing Society & IEEE Student Branch"
                    value={formData.clubOrSociety}
                    onChange={(e) => setFormData({ ...formData, clubOrSociety: e.target.value })}
                    required
                  />

                  <div style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--primary)', marginBottom: '10px' }}>
                      Lead Student Organizer
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                      <Input
                        label="Full Name *"
                        placeholder="Organizer Name"
                        value={formData.leadOrganizer.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          leadOrganizer: { ...formData.leadOrganizer, name: e.target.value },
                        })}
                        required
                      />
                      <Input
                        label="Student ID"
                        placeholder="STU-2026-089"
                        value={formData.leadOrganizer.studentId}
                        onChange={(e) => setFormData({
                          ...formData,
                          leadOrganizer: { ...formData.leadOrganizer, studentId: e.target.value },
                        })}
                      />
                      <Input
                        label="Department"
                        placeholder="Computer Science & Engineering"
                        value={formData.leadOrganizer.department}
                        onChange={(e) => setFormData({
                          ...formData,
                          leadOrganizer: { ...formData.leadOrganizer, department: e.target.value },
                        })}
                      />
                      <Input
                        label="Campus Email *"
                        type="email"
                        placeholder="lead@campus.edu"
                        value={formData.leadOrganizer.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          leadOrganizer: { ...formData.leadOrganizer, email: e.target.value },
                        })}
                        required
                      />
                      <Input
                        label="Contact Number"
                        placeholder="+91 98765 43210"
                        value={formData.leadOrganizer.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          leadOrganizer: { ...formData.leadOrganizer, phone: e.target.value },
                        })}
                      />
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                      Faculty Advisor / Coordinator
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                      <Input
                        label="Faculty Name"
                        placeholder="Dr. Coordinator Name"
                        value={formData.facultyCoordinator.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          facultyCoordinator: { ...formData.facultyCoordinator, name: e.target.value },
                        })}
                      />
                      <Input
                        label="Faculty Email"
                        type="email"
                        placeholder="faculty@campus.edu"
                        value={formData.facultyCoordinator.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          facultyCoordinator: { ...formData.facultyCoordinator, email: e.target.value },
                        })}
                      />
                      <Input
                        label="Faculty Phone"
                        placeholder="+91 94321 09876"
                        value={formData.facultyCoordinator.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          facultyCoordinator: { ...formData.facultyCoordinator, phone: e.target.value },
                        })}
                      />
                    </div>
                  </div>

                  {/* Additional Committee Members */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-secondary)' }}>
                        Core Committee Members ({formData.committeeMembers.length})
                      </span>
                      <Button variant="ghost" size="xs" icon={Plus} onClick={addCommitteeMember}>
                        Add Member
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.committeeMembers.map((member, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr auto',
                            gap: '8px',
                            alignItems: 'center',
                            background: 'var(--bg-secondary)',
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <input
                            placeholder="Member Name"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...formData.committeeMembers];
                              updated[idx].name = e.target.value;
                              setFormData({ ...formData, committeeMembers: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <input
                            placeholder="Role (e.g. Logistics)"
                            value={member.role}
                            onChange={(e) => {
                              const updated = [...formData.committeeMembers];
                              updated[idx].role = e.target.value;
                              setFormData({ ...formData, committeeMembers: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <input
                            placeholder="Email / Phone"
                            value={member.contact}
                            onChange={(e) => {
                              const updated = [...formData.committeeMembers];
                              updated[idx].contact = e.target.value;
                              setFormData({ ...formData, committeeMembers: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeCommitteeMember(idx)}
                            style={{ color: 'var(--error)', padding: '6px' }}
                            title="Remove Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Registration & Participation Details */}
              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 4: Registration & Participation Framework
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Define entry ticket pricing, team criteria, and registration deadlines.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                    <div>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Registration Type *
                      </label>
                      <select
                        value={formData.registrationType}
                        onChange={(e) => setFormData({ ...formData, registrationType: e.target.value, registrationFee: e.target.value === 'free' ? 0 : formData.registrationFee })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <option value="free">Free Campus Entry (₹0)</option>
                        <option value="paid">Paid Registration Fee</option>
                      </select>
                    </div>

                    {formData.registrationType === 'paid' && (
                      <Input
                        label="Registration Fee per Participant (₹) *"
                        type="number"
                        min="1"
                        placeholder="e.g. 299"
                        value={formData.registrationFee}
                        onChange={(e) => setFormData({ ...formData, registrationFee: Math.max(0, Number(e.target.value)) })}
                        required
                      />
                    )}

                    <div>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Participation Mode
                      </label>
                      <select
                        value={formData.participationMode}
                        onChange={(e) => setFormData({ ...formData, participationMode: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-sm)',
                        }}
                      >
                        <option value="individual">Individual Registration</option>
                        <option value="team">Team Participation</option>
                      </select>
                    </div>
                  </div>

                  {formData.participationMode === 'team' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                      <Input
                        label="Min Team Size"
                        type="number"
                        min="1"
                        value={formData.teamSizeMin}
                        onChange={(e) => setFormData({ ...formData, teamSizeMin: Number(e.target.value) })}
                      />
                      <Input
                        label="Max Team Size"
                        type="number"
                        min="1"
                        value={formData.teamSizeMax}
                        onChange={(e) => setFormData({ ...formData, teamSizeMax: Number(e.target.value) })}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Registration Opening Date"
                      type="date"
                      value={formData.registrationOpeningDate}
                      onChange={(e) => setFormData({ ...formData, registrationOpeningDate: e.target.value })}
                    />
                    <Input
                      label="Registration Closing Deadline"
                      type="date"
                      value={formData.registrationClosingDeadline}
                      onChange={(e) => setFormData({ ...formData, registrationClosingDeadline: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Eligibility Criteria"
                    placeholder="e.g. Open to all students with valid university ID."
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  />

                  <Input
                    label="Participation Instructions"
                    placeholder="e.g. Bring laptops with Python 3.10+ installed and photo ID."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  />
                </div>
              )}

              {/* STEP 5: Financial & Budget Proposal (INTERNAL ONLY) */}
              {currentStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(var(--primary-rgb), 0.15)', color: 'var(--primary)', fontWeight: 'bold' }}>
                          INTERNAL USE ONLY
                        </span>
                      </div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0 0' }}>
                        Step 5: Event Financial & Budget Proposal
                      </h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        This budget is confidential and reviewed only by the campus events committee. It is not published publicly.
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Total Estimated Budget</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        ₹{formData.totalEstimatedBudget.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Expense Line Items */}
                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        Expenditure Line Items
                      </span>
                      <Button variant="ghost" size="xs" icon={Plus} onClick={addBudgetItem}>
                        Add Expense
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.budgetItems.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 140px auto',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            placeholder="Expense Description (e.g. Venue sound, refreshment boxes)"
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...formData.budgetItems];
                              updated[idx].description = e.target.value;
                              setFormData({ ...formData, budgetItems: updated });
                            }}
                            style={{
                              padding: '8px 12px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.8rem',
                            }}
                          />
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{ position: 'absolute', left: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹</span>
                            <input
                              type="number"
                              min="0"
                              placeholder="Amount"
                              value={item.estimatedAmount}
                              onChange={(e) => {
                                const updated = [...formData.budgetItems];
                                updated[idx].estimatedAmount = Number(e.target.value);
                                setFormData({ ...formData, budgetItems: updated });
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 10px 8px 22px',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-primary)',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-mono)',
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBudgetItem(idx)}
                            style={{ color: 'var(--error)', padding: '6px' }}
                            title="Remove Expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue & Funding Sources */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                    <Input
                      label="Expected Sponsorship (₹)"
                      type="number"
                      min="0"
                      value={formData.expectedSponsorship}
                      onChange={(e) => setFormData({ ...formData, expectedSponsorship: Number(e.target.value) })}
                    />

                    <Input
                      label="Expected Registration Revenue (₹)"
                      type="number"
                      min="0"
                      value={formData.expectedRegistrationRevenue}
                      onChange={(e) => setFormData({ ...formData, expectedRegistrationRevenue: Number(e.target.value) })}
                    />

                    <Input
                      label="Requested College Funding (₹)"
                      type="number"
                      min="0"
                      value={formData.requestedInstitutionalFunding}
                      onChange={(e) => setFormData({ ...formData, requestedInstitutionalFunding: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: Prizes, Rewards & Sponsorships */}
              {currentStep === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 6: Prizes, Rewards & External Sponsorships
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Detail student awards and industry sponsors supporting the event.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="prizesOffered"
                      checked={formData.prizesOffered}
                      onChange={(e) => setFormData({ ...formData, prizesOffered: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    <label htmlFor="prizesOffered" style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Competitive Prizes and Awards are offered
                    </label>
                  </div>

                  {formData.prizesOffered && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
                        <Input
                          label="1st Place Reward"
                          placeholder="e.g. ₹15,000 Cash + Gold Trophy"
                          value={formData.firstPlace}
                          onChange={(e) => setFormData({ ...formData, firstPlace: e.target.value })}
                        />
                        <Input
                          label="2nd Place Reward"
                          placeholder="e.g. ₹10,000 Cash + Silver Plaque"
                          value={formData.secondPlace}
                          onChange={(e) => setFormData({ ...formData, secondPlace: e.target.value })}
                        />
                        <Input
                          label="3rd Place Reward"
                          placeholder="e.g. ₹5,000 Cash + Bronze Plaque"
                          value={formData.thirdPlace}
                          onChange={(e) => setFormData({ ...formData, thirdPlace: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
                        <Input
                          label="Total Proposed Prize Pool (₹)"
                          type="number"
                          placeholder="e.g. 30000"
                          value={formData.totalPrizePool}
                          onChange={(e) => setFormData({ ...formData, totalPrizePool: Number(e.target.value) })}
                        />
                        <Input
                          label="Other Perks / Certificates"
                          placeholder="e.g. Participation certificates & internship interviews"
                          value={formData.otherRewards}
                          onChange={(e) => setFormData({ ...formData, otherRewards: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Sponsors Section */}
                  <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        Confirmed or Targeted Sponsors
                      </span>
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Plus}
                        onClick={() => setFormData({
                          ...formData,
                          sponsors: [...formData.sponsors, { name: '', contribution: '', benefits: '' }],
                        })}
                      >
                        Add Sponsor
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.sponsors.map((sp, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr auto',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            placeholder="Sponsor Name"
                            value={sp.name}
                            onChange={(e) => {
                              const updated = [...formData.sponsors];
                              updated[idx].name = e.target.value;
                              setFormData({ ...formData, sponsors: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <input
                            placeholder="Amount / Contribution"
                            value={sp.contribution}
                            onChange={(e) => {
                              const updated = [...formData.sponsors];
                              updated[idx].contribution = e.target.value;
                              setFormData({ ...formData, sponsors: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <input
                            placeholder="Deliverables / Benefits"
                            value={sp.benefits}
                            onChange={(e) => {
                              const updated = [...formData.sponsors];
                              updated[idx].benefits = e.target.value;
                              setFormData({ ...formData, sponsors: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                sponsors: formData.sponsors.filter((_, i) => i !== idx),
                              });
                            }}
                            style={{ color: 'var(--error)', padding: '6px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Event Rules & Requirements */}
              {currentStep === 7 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 7: Event Rules, Guidelines & Safety Standards
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Publish clear competition rules, code of conduct, and lab/venue safety provisions.
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        Rules & Regulations List ({formData.rulesList.length})
                      </label>
                      <Button variant="ghost" size="xs" icon={Plus} onClick={addRule}>
                        Add Rule
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.rulesList.map((rule, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>#{idx + 1}</span>
                          <input
                            value={rule}
                            placeholder="State an event rule..."
                            onChange={(e) => {
                              const updated = [...formData.rulesList];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, rulesList: updated });
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.8rem',
                            }}
                          />
                          <button type="button" onClick={() => removeRule(idx)} style={{ color: 'var(--error)', padding: '4px' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Judging Criteria"
                      placeholder="e.g. Technical depth, UI/UX execution, impact"
                      value={formData.judgingCriteria}
                      onChange={(e) => setFormData({ ...formData, judgingCriteria: e.target.value })}
                    />
                    <Input
                      label="Cancellation Policy"
                      placeholder="e.g. Notice of withdrawal 24 hours prior"
                      value={formData.cancellationPolicy}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Safety & Security Provisions"
                      placeholder="e.g. Fire safety, lab coats, first aid station"
                      value={formData.safetyRequirements}
                      onChange={(e) => setFormData({ ...formData, safetyRequirements: e.target.value })}
                    />
                    <Input
                      label="Universal Accessibility"
                      placeholder="e.g. Ramp and elevator accessible venue"
                      value={formData.accessibilityRequirements}
                      onChange={(e) => setFormData({ ...formData, accessibilityRequirements: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: Event Agenda Schedule */}
              {currentStep === 8 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        Step 8: Event Agenda Schedule Builder
                      </h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        Build a chronological timeline of activities, speaker slots, and breaks.
                      </p>
                    </div>

                    <Button variant="secondary" size="xs" icon={Plus} onClick={addAgendaItem}>
                      Add Slot
                    </Button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {formData.agendaItems.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                            AGENDA SLOT #{idx + 1}
                          </span>
                          <button type="button" onClick={() => removeAgendaItem(idx)} style={{ color: 'var(--error)' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 1fr 1fr', gap: '8px' }}>
                          <input
                            placeholder="Start (e.g. 10:00 AM)"
                            value={item.startTime}
                            onChange={(e) => {
                              const updated = [...formData.agendaItems];
                              updated[idx].startTime = e.target.value;
                              setFormData({ ...formData, agendaItems: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <input
                            placeholder="End (e.g. 11:30 AM)"
                            value={item.endTime}
                            onChange={(e) => {
                              const updated = [...formData.agendaItems];
                              updated[idx].endTime = e.target.value;
                              setFormData({ ...formData, agendaItems: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <input
                            placeholder="Session Title (e.g. Keynote)"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...formData.agendaItems];
                              updated[idx].title = e.target.value;
                              setFormData({ ...formData, agendaItems: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                          <input
                            placeholder="Venue / Room"
                            value={item.venue}
                            onChange={(e) => {
                              const updated = [...formData.agendaItems];
                              updated[idx].venue = e.target.value;
                              setFormData({ ...formData, agendaItems: updated });
                            }}
                            style={{
                              padding: '6px 10px',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: Media & Supporting Documents */}
              {currentStep === 9 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 9: Media & Supporting Proposal Documents
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Provide poster graphics and links to committee presentation decks.
                    </p>
                  </div>

                  <Input
                    label="Event Poster Banner Image URL"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                  />

                  {formData.posterUrl && (
                    <div style={{ height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img
                        src={formData.posterUrl}
                        alt="Poster Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = '/uploads/events/rhythm_lights_cultural.jpg';
                        }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                    <Input
                      label="Event Proposal Document (Google Drive / PDF link)"
                      placeholder="https://drive.google.com/file/..."
                      value={formData.proposalDocumentUrl}
                      onChange={(e) => setFormData({ ...formData, proposalDocumentUrl: e.target.value })}
                    />
                    <Input
                      label="Sponsorship Prospectus Document Link"
                      placeholder="https://drive.google.com/file/..."
                      value={formData.sponsorshipDocumentUrl}
                      onChange={(e) => setFormData({ ...formData, sponsorshipDocumentUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 10: Review & Final Submission */}
              {currentStep === 10 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      Step 10: Review Proposal & Submit for Campus Approval
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Please carefully inspect all proposal details prior to final submission.
                    </p>
                  </div>

                  {/* Summary Bento Review Card */}
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                          {formData.category} &bull; {formData.eventType}
                        </span>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0' }}>
                          {formData.title || 'Untitled Event'}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Organized by {formData.clubOrSociety}
                        </div>
                      </div>
                      <Button variant="ghost" size="xs" onClick={() => setCurrentStep(1)}>
                        Edit
                      </Button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.75rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Date & Schedule</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{formData.startDate} ({formData.startTime} - {formData.endTime})</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Proposed Venue</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{formData.venue || 'TBA'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Registration Framework</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{formData.registrationType === 'free' ? 'Free Entry' : `Paid (₹${formData.registrationFee})`} &bull; Max {formData.maxCapacity} spots</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Estimated Budget</span>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>₹{formData.totalEstimatedBudget.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Policy Acknowledgement Checks */}
                  <div
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.confirmedAccurate}
                        onChange={(e) => setFormData({ ...formData, confirmedAccurate: e.target.checked })}
                        style={{ marginTop: '2px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                        I confirm that the proposed event information is accurate, approved by our student society officers, and ready for official faculty review.
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.acknowledgedPolicies}
                        onChange={(e) => setFormData({ ...formData, acknowledgedPolicies: e.target.checked })}
                        style={{ marginTop: '2px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                        I acknowledge that submitting this form creates an <strong>event proposal</strong> pending committee review, and does not automatically publish a public event until university clearance is granted.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!submittedProposal && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary)',
              flexShrink: 0,
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              disabled={currentStep === 1 || submitting}
              onClick={handlePrev}
            >
              Previous
            </Button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>

              {currentStep < 10 ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleNext}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  iconPosition="right"
                  loading={submitting}
                  onClick={handleSubmit}
                  disabled={!formData.confirmedAccurate || !formData.acknowledgedPolicies}
                >
                  Submit Event Proposal
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HostEventModal;

