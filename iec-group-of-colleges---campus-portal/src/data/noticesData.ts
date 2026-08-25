import { Notice } from '../types';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'Urgent: Odd Semester Final Examination Schedule 2026 Released (AKTU)',
    summary: 'Detailed date sheet and examination centre allotment guidelines for B.Tech, MCA, and MBA candidates.',
    content: `All students of 2nd, 3rd, and 4th years are hereby notified that the AKTU End-Semester Theory Examinations for Odd Semester 2026 will commence from March 12, 2026.\n\nKey Guidelines:\n1. Admit cards can be downloaded from the student portal starting March 01, 2026.\n2. Entry to examination halls (Block A & Block E) requires a mandatory physical Student ID Card & printed Admit Card.\n3. Digital smart watches and mobile devices are strictly forbidden inside examination halls.\n\nFor any clash or discrepancies, immediately contact the Examination Cell in Room A-102.`,
    category: 'exam',
    priority: 'urgent',
    isPinned: true,
    department: 'Examination Cell',
    targetAudience: 'All Students & Faculty',
    publishDate: '2026-08-20',
    publishedAt: '2026-08-20T09:30:00Z',
    author: {
      id: 'adm_verma',
      name: 'Dr. S. K. Verma (Controller of Exams)',
      role: 'admin'
    },
    authorName: 'Dr. S. K. Verma',
    authorDesignation: 'Controller of Examinations',
    attachmentName: 'AKTU_DateSheet_Odd_2026_Final.pdf',
    viewsCount: 2840
  },
  {
    id: 'notice-2',
    title: 'NVIDIA Generative AI Hackathon 2026 @ Block E Innovation Hub',
    summary: '48-hour National AI Hackathon with ₹2,50,000 prize pool and direct placement interviews with top tech firms.',
    content: `The Department of Computer Science & Artificial Intelligence in association with NVIDIA & AWS is hosting the annual 'IEC HackStorm 2026' in Block E Innovation Hub (Floor 4, E-401).\n\nTracks:\n- Autonomous Robotics & Computer Vision\n- Edge LLMs & Healthcare AI\n- Smart Campus Sustainability IoT\n\nRegistration deadline: March 05, 2026. Teams of 3-4 members may register through the portal. Free high-speed GPU cluster access will be provisioned in Room E-204 for all shortlisted finalists.`,
    category: 'academic',
    priority: 'high',
    isPinned: true,
    department: 'Computer Science & AI',
    targetAudience: 'All B.Tech & MCA Students',
    publishDate: '2026-08-22',
    publishedAt: '2026-08-22T14:15:00Z',
    author: {
      id: 'fac_smriti',
      name: 'Dr. Smriti Verma (HOD CSE-AI)',
      role: 'faculty'
    },
    authorName: 'Dr. Smriti Verma',
    authorDesignation: 'HOD Artificial Intelligence & Machine Learning',
    attachmentName: 'IEC_HackStorm_2026_Rulebook.pdf',
    viewsCount: 1950
  },
  {
    id: 'notice-3',
    title: 'Campus Placement Drive: Google Cloud & Microsoft India (2026 Batch)',
    summary: 'On-campus recruitment for Software Engineers, Cloud Associates, and Data Analysts.',
    content: `The Corporate Resource & Placement Centre is pleased to announce the joint on-campus hiring drive for Google Cloud and Microsoft India scheduled for March 15-18, 2026.\n\nEligibility:\n- B.Tech CSE / IT / AI / ECE & MCA with 7.0+ CGPA with no active backlogs.\n- Venue: Dr. Vikram Sarabhai Auditorium (Block D) & Block E Computer Labs.\n\nMandatory attendance for pre-placement talk in Block D at 09:30 AM sharp in formal attire.`,
    category: 'placement',
    priority: 'high',
    isPinned: false,
    department: 'Corporate Relations & Placement',
    targetAudience: 'Final Year Graduating Students',
    publishDate: '2026-08-23',
    publishedAt: '2026-08-23T11:00:00Z',
    author: {
      id: 'adm_kapoor',
      name: 'Mr. Pradeep Kapoor (Head Placements)',
      role: 'admin'
    },
    authorName: 'Mr. Pradeep Kapoor',
    authorDesignation: 'Head - Corporate Relations & Placement',
    attachmentName: 'Eligibility_Criteria_JD_2026.pdf',
    viewsCount: 3120
  },
  {
    id: 'notice-4',
    title: 'Central Library Extended 24x7 Digital Reading Room Access Notice',
    summary: 'Block D Central Library and digital lounge will operate 24 hours daily during exam preparatory weeks.',
    content: `In view of the upcoming semester examinations, the Central Library (Block D) will remain open 24x7 from February 25 to March 31, 2026.\n\nSecurity protocols, high-speed Wi-Fi, and coffee vending points in the foyer will be active throughout the night. Entry between 10:00 PM and 06:00 AM requires biometric tap at the main portal.`,
    category: 'academic',
    priority: 'normal',
    isPinned: false,
    department: 'Library & Information Sciences',
    targetAudience: 'All Campus Students',
    publishDate: '2026-08-18',
    publishedAt: '2026-08-18T16:00:00Z',
    author: {
      id: 'fac_shailendra',
      name: 'Dr. Shailendra Nath (Chief Librarian)',
      role: 'faculty'
    },
    authorName: 'Dr. Shailendra Nath',
    authorDesignation: 'Chief Librarian',
    attachmentName: 'Library_Night_Rules_2026.pdf',
    viewsCount: 1420
  },
  {
    id: 'notice-5',
    title: 'Annual Inter-College Sports & Cultural Fest: "IGNITE 2026"',
    summary: '3 days of high-octane sports tournaments, battle of bands, hack competitions, and celebrity night.',
    content: `IEC Group of Colleges invites all departments to register for 'IGNITE 2026' to be held across Block F Sports Complex, Main Stadium, and Block D Auditorium from April 08-10, 2026.\n\nInter-college events include Cricket, Football, Basketball, Robotics War, Street Play, and Fashion Symphony. Auditions begin next Monday in Room F-102.`,
    category: 'events',
    priority: 'normal',
    isPinned: false,
    department: 'Cultural & Sports Committee',
    targetAudience: 'All College Students & Faculty',
    publishDate: '2026-08-15',
    publishedAt: '2026-08-15T10:00:00Z',
    author: {
      id: 'fac_alok',
      name: 'Prof. Alok Rastogi (Dean Student Welfare)',
      role: 'faculty'
    },
    authorName: 'Prof. Alok Rastogi',
    authorDesignation: 'Dean Student Welfare',
    attachmentName: 'Ignite_2026_Schedule_Events.pdf',
    viewsCount: 2280
  }
];
