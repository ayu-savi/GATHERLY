/**
 * Temporary In-Memory Registration & Pass Store for Development
 * Used when MongoDB is disconnected, clearly flagged in API responses.
 */

const { generateQRCodeSVG } = require('../utils/qrGenerator');

const samplePassId1 = 'PASS-GATH-2026-7891';
const sampleToken1 = `GATHERLY:PASS:${samplePassId1}:DEV7891`;

const samplePassId2 = 'PASS-GATH-2026-5124';
const sampleToken2 = `GATHERLY:PASS:${samplePassId2}:DEV5124`;

const inMemoryRegistrations = [
  {
    _id: 'reg_mem_001',
    registrationId: 'REG-GATH-2026-001',
    passId: samplePassId1,
    user: 'usr_student_01',
    event: 'evt-hacknexa-2026',
    eventSlug: 'hacknexa-2026',
    eventTitle: 'HackNexa 2026: 36-Hour National Campus Hackathon',
    eventCategory: 'Technical',
    eventDate: '2026-11-20',
    eventEndDate: '2026-11-22',
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
    qrToken: sampleToken1,
    qrSvg: generateQRCodeSVG(sampleToken1),
    checkedIn: false,
    checkedInAt: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'reg_mem_002',
    registrationId: 'REG-GATH-2026-002',
    passId: samplePassId2,
    user: 'usr_student_01',
    event: 'evt-ai-orientation-2026',
    eventSlug: 'ai-student-orientation',
    eventTitle: 'Campus AI Circle: Fall Semester Orientation & Lab Demo',
    eventCategory: 'Workshops',
    eventDate: '2026-10-22',
    eventEndDate: '2026-10-22',
    eventTime: '02:00 PM - 05:00 PM IST',
    eventVenue: 'CS Department Auditorium, 2nd Floor',
    eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    participantName: 'Aarav Sharma',
    participantEmail: 'aarav.sharma@campus.edu',
    participantPhone: '+91 98765 43210',
    studentId: 'STU-2026-089',
    department: 'Computer Science & Engineering',
    registrationType: 'individual',
    teamName: null,
    teamMembers: [],
    paymentStatus: 'free',
    paymentAmount: 0,
    paymentReference: null,
    isDemoPayment: false,
    status: 'attended',
    qrToken: sampleToken2,
    qrSvg: generateQRCodeSVG(sampleToken2),
    checkedIn: true,
    checkedInAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

module.exports = {
  inMemoryRegistrations,
};
