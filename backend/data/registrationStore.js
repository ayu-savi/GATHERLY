/**
 * Temporary In-Memory Registration & Pass Store for Development
 * Used when MongoDB is disconnected, clearly flagged in API responses.
 */

const { generateQRCodeSVG } = require('../utils/qrGenerator');

// Pre-seeded registration for demo student
const samplePassId = 'PASS-GATH-2026-7891';
const sampleToken = `GATHERLY:PASS:${samplePassId}:DEV7891`;

const inMemoryRegistrations = [
  {
    _id: 'reg_mem_001',
    registrationId: 'REG-GATH-2026-001',
    passId: samplePassId,
    user: 'usr_student_01',
    event: 'evt-hacknexa-2026',
    eventSlug: 'hacknexa-2026',
    eventTitle: 'HackNexa 2026: 36-Hour National Campus Hackathon',
    eventCategory: 'Technical',
    eventDate: '2026-11-20',
    eventTime: '09:00 AM - 09:00 PM IST',
    eventVenue: 'Turing Computer Auditorium & Innovation Hub, Tech Block B',
    eventImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    participantName: 'Aarav Sharma',
    participantEmail: 'aarav.sharma@campus.edu',
    participantPhone: '+91 98765 43210',
    studentId: 'STU-2026-089',
    department: 'Computer Science & Engineering',
    registrationType: 'team',
    teamName: 'NeuralByte Hackers',
    teamMembers: [
      { name: 'Aarav Sharma', email: 'aarav.sharma@campus.edu', studentId: 'STU-2026-089' },
      { name: 'Rohan Mehra', email: 'rohan.m@campus.edu', studentId: 'STU-2026-092' },
    ],
    paymentStatus: 'completed',
    paymentAmount: 299,
    paymentReference: 'DEMO-TXN-8849201',
    isDemoPayment: true,
    status: 'confirmed',
    qrToken: sampleToken,
    qrSvg: generateQRCodeSVG(sampleToken),
    checkedIn: false,
    checkedInAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

module.exports = {
  inMemoryRegistrations,
};
