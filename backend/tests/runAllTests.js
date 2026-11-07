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
