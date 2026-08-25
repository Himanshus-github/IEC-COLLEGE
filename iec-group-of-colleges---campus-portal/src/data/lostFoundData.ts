import { LostFoundItem, Claim } from '../types';

export const INITIAL_LOST_FOUND_ITEMS: LostFoundItem[] = [
  {
    id: 'item-1',
    type: 'lost',
    title: 'Casio fx-991EX Classwiz Scientific Calculator',
    description: 'Black scientific calculator with solar panel strip. Has an orange "IEC CSE" sticker on the protective sliding back lid.',
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
    location: {
      campusId: 'greater-noida-main',
      buildingId: 'block-e',
      buildingName: 'Block E - Tech Tower',
      floor: 2,
      roomNumber: 'E-204',
      roomName: 'NVIDIA AI & Deep Learning Research Lab',
      landmark: 'Row 3, Workstation #14 near the DGX Server rack'
    },
    nearestLandmark: 'Block E 2nd Floor NVIDIA AI Lab',
    dateReported: '2026-08-23',
    timeReported: '15:30',
    status: 'open',
    reportedBy: {
      id: 'usr-student-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma24@iec.edu.in',
      phone: '+91 98765 43210',
      role: 'student'
    },
    contactPrivacy: 'via_admin',
    uniqueIdentifiers: 'Orange "IEC CSE" sticker and initials "AS" etched on the battery cover.'
  },
  {
    id: 'item-2',
    type: 'found',
    title: 'Scientific Calculator (Casio Scientific Model)',
    description: 'Found a black Casio calculator left on the lab table after the Machine Learning lab session.',
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
    location: {
      campusId: 'greater-noida-main',
      buildingId: 'block-e',
      buildingName: 'Block E - Tech Tower',
      floor: 2,
      roomNumber: 'E-204',
      roomName: 'NVIDIA AI & Deep Learning Research Lab',
      landmark: 'Left near the server station desk'
    },
    nearestLandmark: 'Block E 2nd Floor Lab',
    dateReported: '2026-08-23',
    timeReported: '17:15',
    status: 'open',
    reportedBy: {
      id: 'usr-faculty-1',
      name: 'Dr. Smriti Verma',
      email: 'smriti.verma@iec.edu.in',
      phone: '+91 98111 22334',
      role: 'faculty'
    },
    contactPrivacy: 'public',
    uniqueIdentifiers: 'Cover has a college department sticker.'
  },
  {
    id: 'item-3',
    type: 'lost',
    title: 'Navy Blue Fastrack Leather Wallet with ID Cards',
    description: 'Dark blue bi-fold leather wallet containing College ID Card (Roll # 220010010045), Metro Smart Card, and PAN card.',
    category: 'wallet_keys',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    location: {
      campusId: 'greater-noida-main',
      buildingId: 'block-f',
      buildingName: 'Block F - Student Centre',
      floor: 1,
      roomNumber: 'F-101',
      roomName: 'Central Food Court',
      landmark: 'Table near the Nescafe coffee kiosk'
    },
    nearestLandmark: 'Block F Cafeteria Nescafe counter',
    dateReported: '2026-08-22',
    timeReported: '13:10',
    status: 'claimed',
    reportedBy: {
      id: 'usr-student-2',
      name: 'Rohan Gupta',
      email: 'rohan.gupta23@iec.edu.in',
      phone: '+91 98712 34567',
      role: 'student'
    },
    contactPrivacy: 'via_admin',
    uniqueIdentifiers: 'Contains IEC ID for Rohan Gupta and a folded ₹500 note inside the zipped slot.'
  },
  {
    id: 'item-4',
    type: 'found',
    title: 'Boat Rockerz 550 Wireless Bluetooth Headphones',
    description: 'Army green over-ear wireless headphones with minor scuffs on the left cushion.',
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    location: {
      campusId: 'greater-noida-main',
      buildingId: 'block-d',
      buildingName: 'Block D - Library & Auditorium',
      floor: 1,
      roomNumber: 'D-101',
      roomName: 'Central Library Reference Hall',
      landmark: 'Study Pod #18 in the quiet corner'
    },
    nearestLandmark: 'Block D Library 1st Floor Study Pod',
    dateReported: '2026-08-24',
    timeReported: '11:45',
    status: 'open',
    reportedBy: {
      id: 'usr-admin-1',
      name: 'Shailendra Nath (Librarian)',
      email: 'library@iec.edu.in',
      role: 'admin'
    },
    contactPrivacy: 'public',
    uniqueIdentifiers: 'Bluetooth device name shows "RITIK_BEATS".'
  },
  {
    id: 'item-5',
    type: 'lost',
    title: 'HP 15.6-inch Waterproof Laptop Backpack (Grey/Black)',
    description: 'Grey HP backpack containing Data Structures notebook, blue Parker fountain pen, and Logitech wireless mouse.',
    category: 'clothing_bags',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    location: {
      campusId: 'greater-noida-main',
      buildingId: 'block-e',
      buildingName: 'Block E - Tech Tower',
      floor: 1,
      roomNumber: 'E-101',
      roomName: 'Alan Turing Smart Lecture Theatre',
      landmark: 'Left on the 4th bench right wing'
    },
    nearestLandmark: 'Block E Ground Floor Lecture Theatre',
    dateReported: '2026-08-24',
    timeReported: '09:20',
    status: 'open',
    reportedBy: {
      id: 'usr-student-3',
      name: 'Pooja Verma',
      email: 'pooja.verma25@iec.edu.in',
      phone: '+91 97112 99887',
      role: 'student'
    },
    contactPrivacy: 'via_admin',
    uniqueIdentifiers: 'Has a silver keychain with the letter "P" attached to the main zip pull.'
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'claim-1',
    itemId: 'item-2',
    itemTitle: 'Scientific Calculator (Casio Scientific Model)',
    claimantId: 'usr-student-1',
    claimantName: 'Aarav Sharma',
    claimantEmail: 'aarav.sharma24@iec.edu.in',
    claimantPhone: '+91 98765 43210',
    claimantRole: 'student',
    proofDescription: 'I left my Casio 991EX calculator during the 3:00 PM AI Lab practical. It has an orange IEC CSE sticker on the back and "AS" engraved.',
    proofAnswer: 'Orange IEC CSE sticker and initials "AS"',
    status: 'approved',
    createdAt: '2026-08-23T18:00:00Z',
    reviewedBy: 'Dr. Smriti Verma (Faculty)',
    reviewNotes: 'Verified sticker and initials on device. Ready for collection from E-204.',
    reviewedAt: '2026-08-24T09:00:00Z'
  },
  {
    id: 'claim-2',
    itemId: 'item-4',
    itemTitle: 'Boat Rockerz 550 Wireless Bluetooth Headphones',
    claimantId: 'usr-student-4',
    claimantName: 'Ritik Srivastava',
    claimantEmail: 'ritik.s@iec.edu.in',
    claimantPhone: '+91 99887 66554',
    claimantRole: 'student',
    proofDescription: 'Forgot my green Boat headphones at study pod 18 while studying algorithms for exam.',
    proofAnswer: 'Device Bluetooth broadcast name is set to "RITIK_BEATS"',
    status: 'pending',
    createdAt: '2026-08-24T12:30:00Z'
  }
];
