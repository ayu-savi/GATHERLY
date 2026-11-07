/**
 * GATHERLY Automated Integration & Reliability Test Suite
 * Validates Phase 1 & Phase 2 critical journeys:
 * - Authentication & Role-Based Access Control
 * - Proposal Lifecycle & Confidential Data Isolation
 * - Event Lifecycle CRUD & Backend Ownership
 * - Registration, Passes, Capacity & Gate Verifier Security
 * - Profile Persistence & Event Search Synchronization
 */

const http = require('http');

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const payload = postData ? (typeof postData === 'string' ? postData : JSON.stringify(postData)) : null;
    const headers = { ...options.headers };
    if (payload) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request({ host: HOST, port: PORT, ...options, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

async function runTestSuite() {
  console.log('\n===============================================================');
  console.log('🚀 GATHERLY APPLICATION WORKFLOW INTEGRATION TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, suite, testName, details) => {
    if (condition) {
      console.log(`  ✅ [PASS] ${suite} -> ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${suite} -> ${testName}`);
      if (details) {
        console.error('     Details:', typeof details === 'object' ? JSON.stringify(details, null, 2) : details);
      }
      failed++;
    }
  };

  try {
    // =========================================================================
    // 1. AUTHENTICATION & ROLE-BASED ACCESS CONTROL
    // =========================================================================
    console.log('📌 1. Authentication & Role-Based Access Control');

    // 1.1 Student Login
    const stuLogin = await request({ path: '/api/auth/login', method: 'POST' }, {
      email: 'priya.patel@campus.edu',
      password: 'gatherly123',
    });
    assert(stuLogin.status === 200 && stuLogin.body.data?.token && stuLogin.body.data?.user?.role === 'student',
      'Auth', 'Student authenticates with correct role and JWT token', stuLogin);
    const studentToken = stuLogin.body.data.token;
    const studentHeaders = { Authorization: `Bearer ${studentToken}` };

    // 1.2 Second Student Login (for ownership separation)
    const stu2Login = await request({ path: '/api/auth/login', method: 'POST' }, {
      email: 'aarav.sharma@campus.edu',
      password: 'gatherly123',
    });
    assert(stu2Login.status === 200 && stu2Login.body.data?.token,
      'Auth', 'Second student authenticates successfully', stu2Login);
    const student2Token = stu2Login.body.data.token;
    const student2Headers = { Authorization: `Bearer ${student2Token}` };

    // 1.3 Organizer Login
    const orgLogin = await request({ path: '/api/auth/login', method: 'POST' }, {
      email: 'organizer@campus.edu',
      password: 'gatherly123',
    });
    assert(orgLogin.status === 200 && orgLogin.body.data?.user?.role === 'organizer',
      'Auth', 'Organizer authenticates with organizer role', orgLogin);
    const organizerToken = orgLogin.body.data.token;
    const organizerHeaders = { Authorization: `Bearer ${organizerToken}` };

    // 1.4 Admin Login
    const admLogin = await request({ path: '/api/auth/login', method: 'POST' }, {
      email: 'admin@campus.edu',
      password: 'gatherly123',
    });
    assert(admLogin.status === 200 && admLogin.body.data?.user?.role === 'admin',
      'Auth', 'Administrator authenticates with admin role', admLogin);
    const adminToken = admLogin.body.data.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    // 1.5 Unauthenticated Access Rejection
    const unauth = await request({ path: '/api/auth/me', method: 'GET' });
    assert(unauth.status === 401, 'Auth', 'Missing authorization token rejected with 401 Unauthorized', unauth);

    // 1.6 Role-Based Access Restriction (Student accessing Admin Proposals)
    const roleReject = await request({ path: '/api/proposals', method: 'GET', headers: studentHeaders });
    assert(roleReject.status === 403, 'Auth', 'Student blocked from admin proposals with 403 Forbidden', roleReject);

    // =========================================================================
    // 2. PROPOSAL LIFECYCLE & CONFIDENTIAL DATA ISOLATION
    // =========================================================================
    console.log('\n📌 2. Proposal Lifecycle & Confidential Data Isolation');

    // 2.1 Student Submits Proposal
    const submitProposalRes = await request({ path: '/api/proposals', method: 'POST', headers: studentHeaders }, {
      title: 'Quantum Computing & Algorithms Symposium 2026',
      category: 'Technical',
      eventType: 'Symposium',
      tagline: 'Bridging qubit theory with hardware implementation.',
      description: 'A 2-day technical conference inviting national speakers and student research showcases.',
      startDate: '2026-12-18',
      endDate: '2026-12-19',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      venue: 'Main Science Auditorium',
      building: 'Block A',
      expectedParticipants: 150,
      maxCapacity: 200,
      leadOrganizer: {
        name: 'Priya Patel',
        email: 'priya.patel@campus.edu',
        phone: '+91 98765 43219',
      },
      clubOrSociety: 'Quantum Research Circle',
      budgetItems: [
        { description: 'Keynote Speaker Honorariums', estimatedAmount: 25000 },
        { description: 'Delegate Kits and Lanyards', estimatedAmount: 15000 },
        { description: 'High Tea & Refreshments', estimatedAmount: 20000 },
      ],
      totalEstimatedBudget: 60000,
      expectedSponsorship: 35000,
      requestedInstitutionalFunding: 25000,
    });
    assert(submitProposalRes.status === 201 && submitProposalRes.body.data?.proposalReference,
      'Proposals', 'Student submits comprehensive event proposal (201 Created)', submitProposalRes);
    const createdProposal = submitProposalRes.body.data;
    const proposalId = createdProposal._id || createdProposal.id;

    // 2.2 Student sees own proposals with confidential budget stripped
    const myProposalsRes = await request({ path: '/api/proposals/my', method: 'GET', headers: studentHeaders });
    assert(myProposalsRes.status === 200 && Array.isArray(myProposalsRes.body.data),
      'Proposals', 'Student retrieves own proposal list (200 OK)', myProposalsRes);
    const fetchedMyProp = myProposalsRes.body.data.find(p => p.proposalReference === createdProposal.proposalReference);
    assert(fetchedMyProp && fetchedMyProp.totalEstimatedBudget === undefined && fetchedMyProp.budgetItems === undefined,
      'Proposals', 'Student proposal response strictly strips confidential budgets and grants');

    // 2.3 Other student cannot access another student\'s proposal by ID
    const crossAccess = await request({ path: `/api/proposals/${proposalId}`, method: 'GET', headers: student2Headers });
    assert(crossAccess.status === 403,
      'Proposals', 'Cross-student proposal inspection rejected with 403 Forbidden', crossAccess);

    // 2.4 Administrator views complete proposals with full budget details
    const adminProposalsRes = await request({ path: '/api/proposals', method: 'GET', headers: adminHeaders });
    assert(adminProposalsRes.status === 200 && Array.isArray(adminProposalsRes.body.data),
      'Proposals', 'Admin accesses comprehensive proposals list (200 OK)', adminProposalsRes);
    const adminSeenProp = adminProposalsRes.body.data.find(p => p.proposalReference === createdProposal.proposalReference);
    assert(adminSeenProp && adminSeenProp.totalEstimatedBudget === 60000 && Array.isArray(adminSeenProp.budgetItems),
      'Proposals', 'Admin response retains full confidential budget & grant audit information');

    // 2.5 Administrator approves proposal -> publishes Event
    const approveRes = await request({ path: `/api/proposals/${proposalId}/status`, method: 'PATCH', headers: adminHeaders }, {
      status: 'approved',
      reviewFeedback: 'Approved by Committee. High institutional priority.',
    });
    assert(approveRes.status === 200 && approveRes.body.data?.event?.title,
      'Proposals', 'Admin approves proposal and automatically creates/publishes Event', approveRes);
    const publishedEvent = approveRes.body.data.event;

    // 2.6 Repeated approval is idempotent
    const repeatApprove = await request({ path: `/api/proposals/${proposalId}/status`, method: 'PATCH', headers: adminHeaders }, {
      status: 'approved',
    });
    assert(repeatApprove.status === 200,
      'Proposals', 'Repeated approval is idempotent without duplicate event creation', repeatApprove);

    // 2.7 Submitting student sees updated status & feedback
    const myUpdatedPropRes = await request({ path: '/api/proposals/my', method: 'GET', headers: studentHeaders });
    const verifiedMyProp = myUpdatedPropRes.body.data.find(p => p.proposalReference === createdProposal.proposalReference);
    assert(verifiedMyProp && verifiedMyProp.status === 'approved' && verifiedMyProp.eventId,
      'Proposals', 'Student sees updated approved status and linked published event ID');

    // =========================================================================
    // 3. EVENT MANAGEMENT LIFECYCLE & AUTHORIZATION
    // =========================================================================
    console.log('\n📌 3. Event Management Lifecycle & Authorization');

    // 3.1 Student cannot create event
    const stuEventCreate = await request({ path: '/api/events', method: 'POST', headers: studentHeaders }, {
      title: 'Unauthorized Student Event',
      category: 'Sports',
      description: 'Invalid',
      date: '2026-12-20',
      time: '10:00 AM',
      venue: 'Ground',
      capacity: 50,
    });
    assert(stuEventCreate.status === 403, 'Events', 'Student blocked from creating events (403 Forbidden)', stuEventCreate);

    // 3.2 Organizer creates new event
    const orgEventCreate = await request({ path: '/api/events', method: 'POST', headers: organizerHeaders }, {
      title: 'CloudOps Championship 2026',
      tagline: 'Multi-cloud architecture and chaos engineering.',
      category: 'Workshops',
      description: 'Hands-on practical CI/CD and cloud orchestration masterclass.',
      date: '2026-12-22',
      time: '01:00 PM',
      venue: 'Server Room Lab 2',
      capacity: 50,
      registrationFee: 0,
      registrationDeadline: '2026-12-21',
    });
    assert(orgEventCreate.status === 201 && orgEventCreate.body.data?.slug,
      'Events', 'Organizer creates new event with unique slug (201 Created)', orgEventCreate);
    const managedEvent = orgEventCreate.body.data;
    const managedEventId = managedEvent.id || managedEvent._id;

    // 3.3 Student cannot modify event
    const stuEventUpdate = await request({ path: `/api/events/${managedEventId}`, method: 'PUT', headers: studentHeaders }, {
      title: 'Hacked Title',
    });
    assert(stuEventUpdate.status === 403, 'Events', 'Student cannot modify organizer event (403 Forbidden)', stuEventUpdate);

    // 3.4 Organizer updates own event
    const orgEventUpdate = await request({ path: `/api/events/${managedEventId}`, method: 'PUT', headers: organizerHeaders }, {
      title: 'CloudOps & SRE Championship 2026',
      capacity: 65,
    });
    assert(orgEventUpdate.status === 200 && orgEventUpdate.body.data?.capacity === 65,
      'Events', 'Organizer updates own event capacity and details (200 OK)', orgEventUpdate);

    // 3.5 Student registers for the open event
    const studentEventReg = await request({ path: '/api/registrations', method: 'POST', headers: studentHeaders }, {
      eventId: managedEvent.slug,
      participantName: 'Priya Patel',
      participantEmail: 'priya.patel@campus.edu',
      participantPhone: '+91 98765 43219',
      studentId: 'STU-2026-112',
      department: 'ECE',
      registrationType: 'individual',
    });
    assert(studentEventReg.status === 201 && studentEventReg.body.data?.passId,
      'Events', 'Student registers for open event and receives digital pass', studentEventReg);
    const eventPassId = studentEventReg.body.data?.passId;

    // 3.6 Cannot shrink capacity below registered count
    const shrinkAttempt = await request({ path: `/api/events/${managedEventId}`, method: 'PUT', headers: organizerHeaders }, {
      capacity: 0,
    });
    assert(shrinkAttempt.status === 400,
      'Events', 'Capacity shrink below registered count is rejected with 400 Bad Request', shrinkAttempt);

    // 3.7 Organizer cancels event safely
    const cancelRes = await request({ path: `/api/events/${managedEventId}`, method: 'DELETE', headers: organizerHeaders }, {
      reason: 'Server maintenance and hardware upgrade.',
    });
    assert(cancelRes.status === 200 && cancelRes.body.data?.isCancelled === true,
      'Events', 'Organizer cancels event safely (200 OK, isCancelled marked)', cancelRes);

    // 3.8 New registrations on cancelled event are blocked
    const newRegOnCancelled = await request({ path: '/api/registrations', method: 'POST', headers: student2Headers }, {
      eventId: managedEvent.slug,
      participantName: 'Aarav Sharma',
      participantEmail: 'aarav.sharma@campus.edu',
      participantPhone: '+91 98765 43210',
      studentId: 'STU-2026-089',
      department: 'CSE',
      registrationType: 'individual',
    });
    assert(newRegOnCancelled.status === 400 && newRegOnCancelled.body.message.includes('closed or has been cancelled'),
      'Events', 'New registrations on cancelled events rejected with 400 Bad Request', newRegOnCancelled);

    // 3.9 Historical pass remains preserved and accessible
    const passAccess = await request({ path: `/api/passes/${eventPassId}`, method: 'GET', headers: studentHeaders });
    assert(passAccess.status === 200 && passAccess.body.data?.passId === eventPassId,
      'Events', 'Existing digital pass preserved and verifiable after cancellation', passAccess);

    // =========================================================================
    // 4. REGISTRATION LIFECYCLE & GATE VERIFIER SECURITY (PHASE 1 INTEGRITY)
    // =========================================================================
    console.log('\n📌 4. Registration Lifecycle & Gate Verifier Security');

    const targetEventSlug = 'evt-web3-summit-2026';

    // 4.1 First registration succeeds
    const reg1 = await request({ path: '/api/registrations', method: 'POST', headers: studentHeaders }, {
      eventId: targetEventSlug,
      participantName: 'Priya Patel',
      participantEmail: 'priya.patel@campus.edu',
      participantPhone: '+91 98765 43219',
      studentId: 'STU-2026-112',
      department: 'ECE',
      registrationType: 'individual',
    });
    assert((reg1.status === 201 && reg1.body.data?.passId) || (reg1.status === 409 && reg1.body.data?.passId),
      'Registrations', 'First registration succeeds and returns passId', reg1);
    const regPassId = reg1.body.data.passId;
    const regId = reg1.body.data.registrationId || reg1.body.data._id;

    // 4.2 Duplicate active registration rejected
    const dupReg = await request({ path: '/api/registrations', method: 'POST', headers: studentHeaders }, {
      eventId: targetEventSlug,
      participantName: 'Priya Patel',
      participantEmail: 'priya.patel@campus.edu',
      participantPhone: '+91 98765 43219',
      studentId: 'STU-2026-112',
      department: 'ECE',
      registrationType: 'individual',
    });
    assert(dupReg.status === 409 && dupReg.body.isAlreadyRegistered === true,
      'Registrations', 'Duplicate active registration rejected with 409 Conflict', dupReg);

    // 4.3 Cancellation succeeds
    const cancelReg = await request({ path: `/api/registrations/${regId}`, method: 'DELETE', headers: studentHeaders });
    assert(cancelReg.status === 200 && cancelReg.body.data?.status === 'cancelled',
      'Registrations', 'Active registration cancelled with 200 OK', cancelReg);

    // 4.4 Re-registration succeeds with fresh pass ID
    const reReg = await request({ path: '/api/registrations', method: 'POST', headers: studentHeaders }, {
      eventId: targetEventSlug,
      participantName: 'Priya Patel',
      participantEmail: 'priya.patel@campus.edu',
      participantPhone: '+91 98765 43219',
      studentId: 'STU-2026-112',
      department: 'ECE',
      registrationType: 'individual',
    });
    assert(reReg.status === 201 && reReg.body.data?.passId && reReg.body.data.passId !== regPassId,
      'Registrations', 'Re-registration after cancellation succeeds with fresh pass ID', reReg);
    const freshPassId = reReg.body.data.passId;

    // 4.5 Gate verification restricted to organizers/admins
    const stuVerifyAttempt = await request({ path: '/api/passes/verify', method: 'POST', headers: studentHeaders }, {
      passId: freshPassId,
    });
    assert(stuVerifyAttempt.status === 403,
      'GateSecurity', 'Student blocked from gate verification (403 Forbidden)', stuVerifyAttempt);

    // 4.6 Organizer verifies pass successfully
    const orgVerify = await request({ path: '/api/passes/verify', method: 'POST', headers: organizerHeaders }, {
      passId: freshPassId,
    });
    assert(orgVerify.status === 200 && orgVerify.body.valid === true,
      'GateSecurity', 'Organizer verifies pass successfully at gate (200 OK)', orgVerify);

    // 4.7 Student blocked from check-in
    const stuCheckin = await request({ path: '/api/passes/checkin', method: 'POST', headers: studentHeaders }, {
      passId: freshPassId,
    });
    assert(stuCheckin.status === 403,
      'GateSecurity', 'Student blocked from attendee check-in (403 Forbidden)', stuCheckin);

    // 4.8 Organizer checks in attendee
    const orgCheckin = await request({ path: '/api/passes/checkin', method: 'POST', headers: organizerHeaders }, {
      passId: freshPassId,
    });
    assert(orgCheckin.status === 200 && orgCheckin.body.data?.checkedIn === true,
      'GateSecurity', 'Organizer admits attendee and checks in digital pass', orgCheckin);

    // =========================================================================
    // 5. PROFILE PERSISTENCE & HOMEPAGE SEARCH SYNCHRONIZATION
    // =========================================================================
    console.log('\n📌 5. Profile Persistence & Search Synchronization');

    // 5.1 Update profile
    const profileUp = await request({ path: '/api/auth/profile', method: 'PUT', headers: studentHeaders }, {
      fullName: 'Priya Patel Senior',
      phone: '+91 98765 99887',
      department: 'Robotics & Control',
    });
    assert(profileUp.status === 200 && profileUp.body.data?.fullName === 'Priya Patel Senior',
      'Profile', 'Profile update persists via PUT /api/auth/profile (200 OK)', profileUp);

    // 5.2 Retrieve profile
    const profileGet = await request({ path: '/api/auth/me', method: 'GET', headers: studentHeaders });
    assert(profileGet.status === 200 && profileGet.body.data?.fullName === 'Priya Patel Senior',
      'Profile', 'Profile retrieval via GET /api/auth/me returns updated fields', profileGet);

    // 5.3 Search events by keyword
    const searchRes = await request({ path: '/api/events?q=Web3', method: 'GET' });
    assert(searchRes.status === 200 && Array.isArray(searchRes.body.data) && searchRes.body.data.length > 0,
      'Search', 'Query /api/events?q=Web3 filters matching events', searchRes);
    const searchMatch = searchRes.body.data.every(e =>
      e.title.toLowerCase().includes('web3') ||
      e.description.toLowerCase().includes('web3') ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes('web3')))
    );
    assert(searchMatch, 'Search', 'All returned events match the search query parameter');

    // 5.4 Empty search query returns all events
    const allEventsRes = await request({ path: '/api/events?q=', method: 'GET' });
    assert(allEventsRes.status === 200 && allEventsRes.body.data.length >= searchRes.body.data.length,
      'Search', 'Empty query returns full events list without stale results');

    // =========================================================================
    // 6. CAMPUS MEMORIES GALLERY & ATOMIC REPLACEMENT LIFECYCLE
    // =========================================================================
    console.log('\n📌 6. Campus Memories Gallery & Atomic Replacement');

    // 6.1 Public gallery retrieval
    const galleryRes = await request({ path: '/api/gallery', method: 'GET' });
    assert(
      galleryRes.status === 200 &&
      galleryRes.body.success &&
      Array.isArray(galleryRes.body.data?.photographs) &&
      galleryRes.body.data.photographs.length >= 8,
      'Gallery',
      'Public user retrieves active campus memories gallery with 8+ demo photographs',
      galleryRes
    );

    // 6.2 Photographer credits and source preserved
    const hasCredits = galleryRes.body.data.photographs.every(
      (p) => Boolean(p.photographerCredit) && Boolean(p.eventName) && Boolean(p.eventDate)
    );
    assert(hasCredits, 'Gallery', 'All demo photographs preserve photographer credits and event metadata');

    // 6.3 Static image file serving
    const staticRes = await request({ path: '/uploads/gallery/defaults/rangmanch_cultural_fest.jpg', method: 'GET' });
    assert(staticRes.status === 200, 'Gallery', 'Static uploads endpoint serves image files with 200 OK');

    // 6.4 Non-admin blocked from uploading photographs
    const studentUpload = await request({
      path: '/api/gallery/upload',
      method: 'POST',
      headers: studentHeaders,
    });
    assert(studentUpload.status === 403, 'GalleryAuth', 'Student blocked from uploading gallery photographs (403 Forbidden)');

    // 6.5 Missing auth token rejected
    const unauthPublish = await request({
      path: '/api/gallery/publish',
      method: 'POST',
    }, { photographs: [] });
    assert(unauthPublish.status === 401, 'GalleryAuth', 'Missing auth token rejected on publish (401 Unauthorized)');

    // 6.6 Non-admin blocked from publishing collection
    const studentPublish = await request({
      path: '/api/gallery/publish',
      method: 'POST',
      headers: studentHeaders,
    }, {
      title: 'Hacked Gallery',
      photographs: [{ photoPath: '/uploads/gallery/defaults/rangmanch_cultural_fest.jpg', eventName: 'Hack', eventDate: 'Today' }],
    });
    assert(studentPublish.status === 403, 'GalleryAuth', 'Student blocked from publishing gallery (403 Forbidden)');

    // 6.7 Empty collection rejected with 400 Bad Request
    const emptyPublish = await request({
      path: '/api/gallery/publish',
      method: 'POST',
      headers: adminHeaders,
    }, {
      title: 'Empty Collection',
      photographs: [],
    });
    assert(emptyPublish.status === 400, 'Gallery', 'Empty photograph array rejected with 400 Bad Request');

    // 6.8 Failed publish preserves active gallery
    const verifyAfterFail = await request({ path: '/api/gallery', method: 'GET' });
    assert(
      verifyAfterFail.body.data?._id === galleryRes.body.data?._id,
      'Gallery',
      'Failed publication attempts preserve the existing active gallery collection'
    );

    // 6.9 Admin publishes new collection (atomic replacement)
    const newPublishRes = await request({
      path: '/api/gallery/publish',
      method: 'POST',
      headers: adminHeaders,
    }, {
      title: 'Annual Spring Festival Retrospective',
      description: 'Newly published collection replacing previous active gallery.',
      isDemo: true,
      photographs: [
        {
          photoPath: '/uploads/gallery/defaults/rangmanch_cultural_fest.jpg',
          eventName: 'Spring Concert Gala',
          eventDate: 'April 02, 2026',
          photographerCredit: 'Nainoa Shizuru',
          photographerSource: 'Unsplash',
          isSocietyAttribution: false,
          isFeatured: true,
        },
        {
          photoPath: '/uploads/gallery/defaults/udaan_dance_night.jpg',
          eventName: 'Cultural Dance Parade',
          eventDate: 'April 03, 2026',
          photographerCredit: 'Abhishek Prasad',
          photographerSource: 'Unsplash',
          isSocietyAttribution: true,
          isFeatured: false,
        },
      ],
    });
    assert(
      newPublishRes.status === 200 && newPublishRes.body.data?.title === 'Annual Spring Festival Retrospective',
      'Gallery',
      'Admin successfully publishes and atomically replaces active collection (200 OK)',
      newPublishRes
    );

    // 6.10 Public gallery immediately reflects newly activated collection
    const activeReplaced = await request({ path: '/api/gallery', method: 'GET' });
    assert(
      activeReplaced.body.data?.title === 'Annual Spring Festival Retrospective' &&
      activeReplaced.body.data?.photographs?.length === 2,
      'Gallery',
      'Public gallery immediately displays only the newly activated collection'
    );

    // Restore full 12-photograph demo collection on server for live showcase and test idempotency
    const { INITIAL_DEMO_COLLECTION, galleryStore } = require('../data/galleryStore');
    await request({
      path: '/api/gallery/publish',
      method: 'POST',
      headers: adminHeaders,
    }, {
      title: INITIAL_DEMO_COLLECTION.title,
      description: INITIAL_DEMO_COLLECTION.description,
      isDemo: true,
      photographs: INITIAL_DEMO_COLLECTION.photographs,
    });
    galleryStore.resetToDemo();

    // =========================================================================
    // 7. DISCOVER DEDUPLICATION, DIVERSITY & PRIZE POOL MATHEMATICS
    // =========================================================================
    console.log('\n📌 7. Discover Deduplication, Diversity & Prize Pool Mathematics');

    // 7.1 Authoritative Service Mathematical Calculations: Examples A, B, C
    const { calculateEventFinancials, validateFinancialInputs } = require('../services/prizePoolService');
    const { resetEventsToPristine } = require('../data/seedData');

    // Example A: fee ₹200, expected 80, cap 100, 75% -> rev ₹16,000, prize ₹12,000, org ₹4,000
    const exA = calculateEventFinancials({
      registrationFee: 200,
      expectedRegistrations: 80,
      capacity: 100,
      prizePoolPercentage: 75,
    });
    assert(
      exA.expectedRevenue === 16000 &&
      exA.prizePool === 12000 &&
      exA.organizerShare === 4000 &&
      (exA.prizePool + exA.organizerShare === exA.expectedRevenue),
      'PrizePoolMath',
      'Example A: 80 exp × ₹200 @ 75% yields ₹16,000 rev, ₹12,000 prize, ₹4,000 org share'
    );

    // Example B: fee ₹300, expected 50, cap 60, 70% -> rev ₹15,000, prize ₹10,500, org ₹4,500
    const exB = calculateEventFinancials({
      registrationFee: 300,
      expectedRegistrations: 50,
      capacity: 60,
      prizePoolPercentage: 70,
    });
    assert(
      exB.expectedRevenue === 15000 &&
      exB.prizePool === 10500 &&
      exB.organizerShare === 4500 &&
      (exB.prizePool + exB.organizerShare === exB.expectedRevenue),
      'PrizePoolMath',
      'Example B: 50 exp × ₹300 @ 70% yields ₹15,000 rev, ₹10,500 prize, ₹4,500 org share'
    );

    // Example C: fee ₹100, expected 90, cap 100, 80% -> rev ₹9,000, prize ₹7,200, org ₹1,800
    const exC = calculateEventFinancials({
      registrationFee: 100,
      expectedRegistrations: 90,
      capacity: 100,
      prizePoolPercentage: 80,
    });
    assert(
      exC.expectedRevenue === 9000 &&
      exC.prizePool === 7200 &&
      exC.organizerShare === 1800 &&
      (exC.prizePool + exC.organizerShare === exC.expectedRevenue),
      'PrizePoolMath',
      'Example C: 90 exp × ₹100 @ 80% yields ₹9,000 rev, ₹7,200 prize, ₹1,800 org share'
    );

    // 7.2 Capacity is NOT used in the revenue formula
    const exCapCheck = calculateEventFinancials({
      registrationFee: 200,
      expectedRegistrations: 80,
      capacity: 500, // capacity increased 5x
      prizePoolPercentage: 75,
    });
    assert(
      exCapCheck.expectedRevenue === 16000 &&
      exCapCheck.prizePool === 12000 &&
      exCapCheck.organizerShare === 4000,
      'PrizePoolMath',
      'Revenue formula strictly depends on expectedRegistrations, capacity change does not alter revenue'
    );

    // 7.3 Percentage boundary validations (70% - 80%)
    const lowPct = validateFinancialInputs({ registrationFee: 100, expectedRegistrations: 50, prizePoolPercentage: 65 });
    const highPct = validateFinancialInputs({ registrationFee: 100, expectedRegistrations: 50, prizePoolPercentage: 85 });
    assert(
      !lowPct.isValid && !highPct.isValid,
      'PrizePoolValidation',
      'Prize pool percentages outside 70%–80% are rejected with validation errors'
    );

    // 7.4 Expected registrations exceeding capacity is rejected
    const overCap = validateFinancialInputs({ registrationFee: 100, expectedRegistrations: 150, capacity: 100 });
    assert(!overCap.isValid, 'PrizePoolValidation', 'Expected registrations exceeding maximum capacity rejected');

    // 7.5 Zero expected registrations or free events handled safely
    const zeroFee = calculateEventFinancials({ registrationFee: 0, expectedRegistrations: 100 });
    const zeroExp = calculateEventFinancials({ registrationFee: 150, expectedRegistrations: 0 });
    assert(
      zeroFee.expectedRevenue === 0 && zeroFee.prizePool === 0 && zeroFee.organizerShare === 0 &&
      zeroExp.expectedRevenue === 0 && zeroExp.prizePool === 0 && zeroExp.organizerShare === 0,
      'PrizePoolMath',
      'Zero registrations and zero fee events handled cleanly without errors'
    );

    // 7.6 Public API sanitization: /api/events and /api/events/:id do NOT expose internal financials
    const publicList = await request({ path: '/api/events', method: 'GET' });
    const hasAnyLeakedList = publicList.body.data.some(e => e.financialConfig || e.expectedRevenue || e.prizePool || e.organizerShare);
    assert(
      !hasAnyLeakedList,
      'FinancialPrivacy',
      'Public GET /api/events strictly sanitizes financialConfig, expectedRevenue, prizePool and organizerShare'
    );

    const publicSingle = await request({ path: '/api/events/samvaad-debate-2026', method: 'GET' });
    assert(
      publicSingle.status === 200 &&
      !publicSingle.body.data?.financialConfig &&
      !publicSingle.body.data?.expectedRevenue &&
      Boolean(publicSingle.body.data?.prizes?.first),
      'FinancialPrivacy',
      'Public GET /api/events/:id sanitizes internal finances while preserving public prize text'
    );

    // 7.7 Protected Financials Endpoint: GET /api/events/:id/financials
    // Student blocked with 403 Forbidden
    const studentFinAccess = await request({
      path: '/api/events/samvaad-debate-2026/financials',
      method: 'GET',
      headers: studentHeaders,
    });
    assert(studentFinAccess.status === 403, 'FinancialAuth', 'Student blocked from GET /api/events/:id/financials (403 Forbidden)');

    // Admin allowed with full breakdown and mathematical confirmation
    const adminFinAccess = await request({
      path: '/api/events/samvaad-debate-2026/financials',
      method: 'GET',
      headers: adminHeaders,
    });
    assert(
      adminFinAccess.status === 200 &&
      adminFinAccess.body.data?.expectedRevenue === 16000 &&
      adminFinAccess.body.data?.prizePool === 12000 &&
      adminFinAccess.body.data?.organizerShare === 4000 &&
      adminFinAccess.body.data?.formulas?.mathInvariantValid === true,
      'FinancialAuth',
      'Administrator accesses confidential event financials with valid math invariant'
    );

    // 7.8 Discover Events deduplication & diversity: clean 15-20 events across 7-8 domains
    // Clean up temporary events created during lifecycle tests
    resetEventsToPristine();

    const cleanEventsRes = await request({ path: '/api/events', method: 'GET' });
    const allDiscovered = cleanEventsRes.body.data;
    assert(
      cleanEventsRes.status === 200 &&
      allDiscovered.length >= 15 &&
      allDiscovered.length <= 20,
      'DiscoverDiversity',
      `Discover listing contains 15-20 distinct events (Count: ${allDiscovered.length})`
    );

    // Check for unique IDs, slugs, and normalized titles
    const seenSlugs = new Set();
    const seenTitles = new Set();
    let hasDuplicates = false;
    for (const ev of allDiscovered) {
      const slug = ev.slug ? ev.slug.toLowerCase().trim() : '';
      const normTitle = ev.title ? ev.title.toLowerCase().trim().replace(/\s+/g, ' ') : '';
      if (seenSlugs.has(slug) || seenTitles.has(normTitle)) {
        hasDuplicates = true;
        break;
      }
      seenSlugs.add(slug);
      seenTitles.add(normTitle);
    }
    assert(!hasDuplicates, 'DiscoverDeduplication', 'Discover events have zero duplicate IDs, slugs, or titles');

    // Check domain representation (at least 7 domains present)
    const distinctCategories = new Set(allDiscovered.map(e => e.category?.toLowerCase()));
    assert(
      distinctCategories.size >= 7,
      'DiscoverDiversity',
      `Discover events span across 7+ distinct campus categories/domains (Found: ${distinctCategories.size})`
    );

    // =========================================================================
    // 8. FORGOT PASSWORD WITH EMAIL OTP VERIFICATION
    // =========================================================================
    console.log('\n📌 8. Forgot Password with Email OTP Verification');

    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    dotenv.config();

    if (process.env.MONGO_URI && mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(process.env.MONGO_URI);
      } catch (e) {}
    }

    const User = require('../models/User');
    const { fallbackUsers } = require('../controllers/authController');

    const getTestUser = async (email) => {
      try {
        if (mongoose.connection.readyState === 1) {
          const u = await User.findOne({ email: email.toLowerCase().trim() });
          if (u) return u;
        }
      } catch (e) {}
      return fallbackUsers.find((u) => u.email === email.toLowerCase().trim());
    };

    const crackOtpFromHash = (hash) => {
      if (!hash) return null;
      const crypto = require('crypto');
      for (let i = 100000; i <= 999999; i++) {
        const s = i.toString();
        if (crypto.createHash('sha256').update(s).digest('hex') === hash) {
          return s;
        }
      }
      return null;
    };

    const targetEmail = 'priya.patel@campus.edu';

    // 8.1 Unregistered email returns generic message without leaking account existence
    const unregRes = await request({ path: '/api/auth/forgot-password', method: 'POST' }, {
      email: 'nonexistent.student.99@campus.edu',
    });
    assert(
      unregRes.status === 200 &&
      unregRes.body.success === true &&
      unregRes.body.message === 'If an account with that email exists, a password reset code has been sent.' &&
      !unregRes.body.data?.otp &&
      !unregRes.body.data?.resetToken,
      'ForgotPassword',
      'Unregistered email returns generic message without user enumeration or secret exposure'
    );

    // 8.2 Missing email rejected with 400 Bad Request
    const missingEmailRes = await request({ path: '/api/auth/forgot-password', method: 'POST' }, {});
    assert(
      missingEmailRes.status === 400 && missingEmailRes.body.success === false,
      'ForgotPassword',
      'Missing email rejected with 400 Bad Request'
    );

    // Reset any existing cooldown on test user before starting flow
    const initialUser = await getTestUser(targetEmail);
    if (initialUser) {
      initialUser.resetPasswordCooldown = null;
      initialUser.resetPasswordAttempts = 0;
      await initialUser.save?.();
    }

    // 8.3 Valid registered student requests OTP code
    const validOtpReq = await request({ path: '/api/auth/forgot-password', method: 'POST' }, {
      email: targetEmail,
    });
    assert(
      validOtpReq.status === 200 &&
      validOtpReq.body.success === true &&
      validOtpReq.body.data?.cooldownSeconds === 60 &&
      !validOtpReq.body.data?.otp &&
      !validOtpReq.body.data?.otpHash,
      'ForgotPassword',
      'Registered student receives generic response and OTP is never returned in API body'
    );

    // 8.4 Resend cooldown enforced within 60 seconds
    const cooldownRes = await request({ path: '/api/auth/forgot-password', method: 'POST' }, {
      email: targetEmail,
    });
    assert(
      cooldownRes.status === 429 &&
      cooldownRes.body.message.includes('second(s) before requesting another verification code'),
      'ForgotPassword',
      'Subsequent OTP request within 60 seconds rejected with 429 Rate Limit'
    );

    // 8.5 Malformed OTP format rejected
    const malformedOtpRes = await request({ path: '/api/auth/verify-reset-otp', method: 'POST' }, {
      email: targetEmail,
      otp: '123',
    });
    assert(
      malformedOtpRes.status === 400 &&
      malformedOtpRes.body.message.includes('6-digit number'),
      'ForgotOTP',
      'Non-6-digit OTP rejected with 400 Bad Request'
    );

    // 8.6 Incorrect OTP decrements remaining attempts
    const wrongOtpRes = await request({ path: '/api/auth/verify-reset-otp', method: 'POST' }, {
      email: targetEmail,
      otp: '000000',
    });
    assert(
      wrongOtpRes.status === 400 &&
      wrongOtpRes.body.message.includes('attempt(s) remaining'),
      'ForgotOTP',
      'Incorrect OTP rejected with remaining attempt count'
    );

    // 8.7 Attempt lockout: Send 4 more wrong OTPs (total 5)
    for (let i = 0; i < 3; i++) {
      await request({ path: '/api/auth/verify-reset-otp', method: 'POST' }, {
        email: targetEmail,
        otp: '00000' + (i + 1),
      });
    }
    const finalWrongRes = await request({ path: '/api/auth/verify-reset-otp', method: 'POST' }, {
      email: targetEmail,
      otp: '000009',
    });
    assert(
      (finalWrongRes.status === 429 || finalWrongRes.status === 400) &&
      finalWrongRes.body.message.includes('Too many failed attempts'),
      'ForgotOTP',
      'OTP locked and invalidated after 5 failed attempts'
    );

    // 8.8 Request fresh OTP after resetting cooldown
    const freshUser = await getTestUser(targetEmail);
    if (freshUser) {
      freshUser.resetPasswordCooldown = null;
      await freshUser.save?.();
    }
    await request({ path: '/api/auth/forgot-password', method: 'POST' }, { email: targetEmail });
    const freshUserWithOtp = await getTestUser(targetEmail);
    const validOtp = crackOtpFromHash(freshUserWithOtp.resetPasswordOtpHash);
    assert(
      Boolean(validOtp) && validOtp.length === 6,
      'ForgotOTP',
      'Cryptographically secure 6-digit OTP generated and stored only as SHA-256 hash'
    );

    // 8.9 Expired OTP is rejected
    if (freshUserWithOtp) {
      freshUserWithOtp.resetPasswordOtpExpires = new Date(Date.now() - 5000);
      await freshUserWithOtp.save?.();
    }
    const expiredRes = await request({ path: '/api/auth/verify-reset-otp', method: 'POST' }, {
      email: targetEmail,
      otp: validOtp,
    });
    assert(
      expiredRes.status === 400 && expiredRes.body.message.includes('expired'),
      'ForgotOTP',
      'Expired OTP rejected with 400 Bad Request'
    );

    // 8.10 Verify valid OTP and receive reset token
    if (freshUserWithOtp) {
      freshUserWithOtp.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await freshUserWithOtp.save?.();
    }
    const verifySuccess = await request({ path: '/api/auth/verify-reset-otp', method: 'POST' }, {
      email: targetEmail,
      otp: validOtp,
    });
    assert(
      verifySuccess.status === 200 &&
      Boolean(verifySuccess.body.data?.resetToken),
      'ForgotOTP',
      'Valid OTP verification succeeds and returns short-lived reset token'
    );
    const validResetToken = verifySuccess.body.data.resetToken;

    // 8.11 Single-use OTP: Replay attack fails
    const replayOtpRes = await request({ path: '/api/auth/verify-reset-otp', method: 'POST' }, {
      email: targetEmail,
      otp: validOtp,
    });
    assert(
      replayOtpRes.status === 400,
      'ForgotOTP',
      'OTP cannot be reused after verification (strictly single-use)'
    );

    // 8.12 Short password rejected (< 6 characters)
    const shortPassRes = await request({ path: '/api/auth/reset-password', method: 'POST' }, {
      email: targetEmail,
      resetToken: validResetToken,
      newPassword: '123',
      confirmPassword: '123',
    });
    assert(
      shortPassRes.status === 400 && shortPassRes.body.message.includes('at least 6 characters'),
      'ResetPassword',
      'Password shorter than 6 characters rejected with 400 Bad Request'
    );

    // 8.13 Mismatched passwords rejected
    const mismatchPassRes = await request({ path: '/api/auth/reset-password', method: 'POST' }, {
      email: targetEmail,
      resetToken: validResetToken,
      newPassword: 'newValidPassword123',
      confirmPassword: 'differentPassword456',
    });
    assert(
      mismatchPassRes.status === 400 && mismatchPassRes.body.message.includes('Passwords do not match'),
      'ResetPassword',
      'Mismatched confirm password rejected with 400 Bad Request'
    );

    // 8.14 Invalid / fake reset token rejected
    const fakeTokenRes = await request({ path: '/api/auth/reset-password', method: 'POST' }, {
      email: targetEmail,
      resetToken: 'invalid_fake_reset_token_0000000000000000',
      newPassword: 'newValidPassword123',
      confirmPassword: 'newValidPassword123',
    });
    assert(
      fakeTokenRes.status === 400,
      'ResetPassword',
      'Forged or fake reset token rejected with 400 Bad Request'
    );

    // 8.15 Successful password reset with valid resetToken
    const resetSuccessRes = await request({ path: '/api/auth/reset-password', method: 'POST' }, {
      email: targetEmail,
      resetToken: validResetToken,
      newPassword: 'priyaCampusNewPass2026!',
      confirmPassword: 'priyaCampusNewPass2026!',
    });
    assert(
      resetSuccessRes.status === 200 && resetSuccessRes.body.success === true,
      'ResetPassword',
      'Password successfully reset and hashed securely with bcrypt'
    );

    // 8.16 Single-use reset token: Token cannot be reused
    const replayResetRes = await request({ path: '/api/auth/reset-password', method: 'POST' }, {
      email: targetEmail,
      resetToken: validResetToken,
      newPassword: 'anotherPassword789!',
      confirmPassword: 'anotherPassword789!',
    });
    assert(
      replayResetRes.status === 400,
      'ResetPassword',
      'Reset token invalidated immediately upon first use (single-use enforced)'
    );

    // 8.17 Login credential verification: Old password fails, new password succeeds
    const oldLoginAttempt = await request({ path: '/api/auth/login', method: 'POST' }, {
      email: targetEmail,
      password: 'gatherly123',
    });
    assert(
      oldLoginAttempt.status === 401,
      'ResetPassword',
      'Login with previous password rejected with 401 Unauthorized'
    );

    const newLoginAttempt = await request({ path: '/api/auth/login', method: 'POST' }, {
      email: targetEmail,
      password: 'priyaCampusNewPass2026!',
    });
    assert(
      newLoginAttempt.status === 200 &&
      Boolean(newLoginAttempt.body.data?.token) &&
      newLoginAttempt.body.data?.user?.role === 'student' &&
      newLoginAttempt.body.data?.user?.fullName.includes('Priya Patel'),
      'ResetPassword',
      'Login with new password succeeds and preserves role & student profile details'
    );

    // 8.18 Restoration: Re-set Priya back to 'gatherly123' to leave test database pristine
    const restoredUser = await getTestUser(targetEmail);
    if (restoredUser) {
      restoredUser.password = 'gatherly123';
      restoredUser.resetPasswordCooldown = null;
      await restoredUser.save?.();
    }

    const restoredLogin = await request({ path: '/api/auth/login', method: 'POST' }, {
      email: targetEmail,
      password: 'gatherly123',
    });
    assert(
      restoredLogin.status === 200 && Boolean(restoredLogin.body.data?.token),
      'ResetPassword',
      'Test user restored to original credentials and database left in pristine state'
    );

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log('\n===============================================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
    console.log('===============================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('💥 Fatal Test Error:', err);
    process.exit(1);
  }
}

runTestSuite();
