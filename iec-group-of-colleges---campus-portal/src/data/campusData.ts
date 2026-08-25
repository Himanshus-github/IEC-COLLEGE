import {
  Campus,
  Building,
  Floor,
  Room,
  Facility,
  User,
  LostItem,
  FoundItem,
  ItemMatch,
  Claim
} from '../types';

// ==========================================
// 1. CAMPUSES
// ==========================================
export const INITIAL_CAMPUSES: Campus[] = [
  {
    id: 'c0000001-0000-4000-8000-000000000001',
    name: 'IEC Group of Colleges, Greater Noida Main Campus',
    address: 'Plot No. 4, Knowledge Park III, Greater Noida, Uttar Pradesh 201310',
    latitude: 28.4728,
    longitude: 77.4893,
    created_at: '2026-01-01T08:00:00Z'
  },
  {
    id: 'c0000001-0000-4000-8000-000000000002',
    name: 'IEC Institute of Pharmacy & Allied Sciences',
    address: 'Plot No. 5, Institutional Area, Knowledge Park III, Greater Noida, UP',
    latitude: 28.4740,
    longitude: 77.4910,
    created_at: '2026-01-01T08:00:00Z'
  }
];

// ==========================================
// 2. BUILDINGS
// ==========================================
export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'b0000001-0000-4000-8000-000000000001',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    name: 'Block E - Centre of Excellence in AI & Computing',
    building_type: 'Academic & Research Tower',
    description: 'Premier high-tech 4-story facility housing NVIDIA AI & Deep Learning Lab, Robotics Arena, Cloud Computing Hub, and Startup Incubation Cell.',
    latitude: 28.4735,
    longitude: 77.4899,
    created_at: '2026-01-01T08:30:00Z',
    code: 'Block E',
    isBlockE: true,
    colorTheme: '#EF4444',
    iconName: 'Cpu'
  },
  {
    id: 'b0000001-0000-4000-8000-000000000002',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    name: 'Block A - Administrative & Corporate Relations Tower',
    building_type: 'Administrative Headquarters',
    description: 'Central administrative building housing Director General Office, Registrar, Admissions Center, Dean Academics, and Corporate Training & Placement Cell.',
    latitude: 28.4725,
    longitude: 77.4885,
    created_at: '2026-01-01T08:30:00Z',
    code: 'Block A',
    isBlockE: false,
    colorTheme: '#3B82F6',
    iconName: 'Building2'
  },
  {
    id: 'b0000001-0000-4000-8000-000000000003',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    name: 'Block B - Applied Sciences & Biotechnology Wing',
    building_type: 'Academic Laboratory Block',
    description: 'First year engineering sciences, Chemistry, Physics, Nanotechnology Research, and Biotechnology wet laboratories.',
    latitude: 28.4720,
    longitude: 77.4905,
    created_at: '2026-01-01T08:30:00Z',
    code: 'Block B',
    isBlockE: false,
    colorTheme: '#10B981',
    iconName: 'FlaskConical'
  },
  {
    id: 'b0000001-0000-4000-8000-000000000004',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    name: 'Block C - Core Engineering Workshops & Heavy Machinery',
    building_type: 'Engineering Workshops',
    description: 'Mechanical Engineering, Civil Structural Testing, CNC Machining Studio, Foundry, and CAD/CAM 3D Prototyping Centre.',
    latitude: 28.4742,
    longitude: 77.4880,
    created_at: '2026-01-01T08:30:00Z',
    code: 'Block C',
    isBlockE: false,
    colorTheme: '#F59E0B',
    iconName: 'Wrench'
  },
  {
    id: 'b0000001-0000-4000-8000-000000000005',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    name: 'Block D - Central Library & Vikram Sarabhai Auditorium',
    building_type: 'Library & Auditorium Complex',
    description: 'Central library with 75,000+ print volumes, IEEE digital archives, 24/7 exam reading hall, and 800-seat air-conditioned auditorium.',
    latitude: 28.4715,
    longitude: 77.4890,
    created_at: '2026-01-01T08:30:00Z',
    code: 'Block D',
    isBlockE: false,
    colorTheme: '#8B5CF6',
    iconName: 'BookOpen'
  },
  {
    id: 'b0000001-0000-4000-8000-000000000006',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    name: 'Block F - Student Activity Centre & Food Court',
    building_type: 'Amenities & Recreation',
    description: 'Multi-cuisine cafeteria, sports pavilion, 24/7 healthcare medical clinic with ambulance bay, and student welfare hub.',
    latitude: 28.4710,
    longitude: 77.4912,
    created_at: '2026-01-01T08:30:00Z',
    code: 'Block F',
    isBlockE: false,
    colorTheme: '#EC4899',
    iconName: 'Coffee'
  }
];

// ==========================================
// 3. FLOORS
// ==========================================
export const INITIAL_FLOORS: Floor[] = [
  // Block E Floors (1-4)
  {
    id: 'f0000001-0000-4000-8000-000000000001',
    building_id: 'b0000001-0000-4000-8000-000000000001',
    floor_number: 1,
    name: 'Ground & 1st Floor - Foundations of Computing',
    created_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'f0000001-0000-4000-8000-000000000002',
    building_id: 'b0000001-0000-4000-8000-000000000001',
    floor_number: 2,
    name: '2nd Floor - NVIDIA AI & Deep Learning Research Lab',
    created_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'f0000001-0000-4000-8000-000000000003',
    building_id: 'b0000001-0000-4000-8000-000000000001',
    floor_number: 3,
    name: '3rd Floor - Robotics, Drones & Cyber Security Sandbox',
    created_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'f0000001-0000-4000-8000-000000000004',
    building_id: 'b0000001-0000-4000-8000-000000000001',
    floor_number: 4,
    name: '4th Floor - Startup Incubation & Cloud DevOps Cell',
    created_at: '2026-01-01T09:00:00Z'
  },

  // Block A Floors (0-2)
  {
    id: 'f0000001-0000-4000-8000-000000000005',
    building_id: 'b0000001-0000-4000-8000-000000000002',
    floor_number: 0,
    name: 'Ground Floor - Admissions & Student Helpdesk',
    created_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'f0000001-0000-4000-8000-000000000006',
    building_id: 'b0000001-0000-4000-8000-000000000002',
    floor_number: 1,
    name: '1st Floor - Registrar & Accounts Cell',
    created_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'f0000001-0000-4000-8000-000000000007',
    building_id: 'b0000001-0000-4000-8000-000000000002',
    floor_number: 2,
    name: '2nd Floor - Corporate Placement & Training (CRPC)',
    created_at: '2026-01-01T09:00:00Z'
  },

  // Block B Floors (1-2)
  {
    id: 'f0000001-0000-4000-8000-000000000008',
    building_id: 'b0000001-0000-4000-8000-000000000003',
    floor_number: 1,
    name: '1st Floor - Engineering Physics & Optics',
    created_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'f0000001-0000-4000-8000-000000000009',
    building_id: 'b0000001-0000-4000-8000-000000000003',
    floor_number: 2,
    name: '2nd Floor - Applied Chemistry & Biotech Labs',
    created_at: '2026-01-01T09:00:00Z'
  },

  // Block C Floors (1)
  {
    id: 'f0000001-0000-4000-8000-000000000010',
    building_id: 'b0000001-0000-4000-8000-000000000004',
    floor_number: 1,
    name: '1st Floor - CNC Machining & Fluid Dynamics Flume',
    created_at: '2026-01-01T09:00:00Z'
  },

  // Block D Floors (1-2)
  {
    id: 'f0000001-0000-4000-8000-000000000011',
    building_id: 'b0000001-0000-4000-8000-000000000005',
    floor_number: 1,
    name: '1st Floor - Central Library & Digital Reading Lounge',
    created_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'f0000001-0000-4000-8000-000000000012',
    building_id: 'b0000001-0000-4000-8000-000000000005',
    floor_number: 2,
    name: '2nd Floor - Vikram Sarabhai Grand Auditorium',
    created_at: '2026-01-01T09:00:00Z'
  },

  // Block F Floors (1)
  {
    id: 'f0000001-0000-4000-8000-000000000013',
    building_id: 'b0000001-0000-4000-8000-000000000006',
    floor_number: 1,
    name: '1st Floor - Cafeteria & Wellness Clinic',
    created_at: '2026-01-01T09:00:00Z'
  }
];

// ==========================================
// 4. ROOMS
// ==========================================
export const INITIAL_ROOMS: Room[] = [
  // Block E Rooms
  {
    id: 'r0000001-0000-4000-8000-000000000001',
    floor_id: 'f0000001-0000-4000-8000-000000000001',
    room_name: 'E-101 Alan Turing Smart Lecture Theatre',
    room_type: 'lecture_hall',
    department: 'Computer Science & Engineering',
    side: 'East Wing',
    description: '150-seat tiered smart theatre with dual 4K laser projectors, directional audio, and acoustic treatment for keynotes and CS lectures.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000002',
    floor_id: 'f0000001-0000-4000-8000-000000000001',
    room_name: 'E-102 Algorithms & Competitive Programming Studio',
    room_type: 'lab',
    department: 'Computer Science & Engineering',
    side: 'West Wing',
    description: '60 high-performance workstations with dual monitors configured for LeetCode, Codeforces, and ICPC collegiate practice.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000003',
    floor_id: 'f0000001-0000-4000-8000-000000000002',
    room_name: 'E-201 Dean of Technology & Computer Sciences Office',
    room_type: 'admin_office',
    department: 'Computer Science & Engineering',
    side: 'North Wing',
    description: 'Office of Dr. V. K. Chaudhary, Dean of Technology. Open for student academic consultations and research supervision.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000004',
    floor_id: 'f0000001-0000-4000-8000-000000000002',
    room_name: 'E-204 NVIDIA AI & Deep Learning Research Lab',
    room_type: 'lab',
    department: 'Artificial Intelligence & Machine Learning',
    side: 'South-East Wing',
    description: 'Flagship laboratory equipped with NVIDIA DGX A100 station, 24x RTX 4090 rigs, liquid cooling, and TensorRT pipelines. In-charge: Dr. Smriti Verma.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000005',
    floor_id: 'f0000001-0000-4000-8000-000000000003',
    room_name: 'E-301 Autonomous Robotics & Drones Arena',
    room_type: 'lab',
    department: 'Artificial Intelligence & Robotics',
    side: 'Central Core',
    description: '3D net obstacle arena for autonomous drone navigation, ROS2 workstations, LiDAR mapping benches, and 3D printing arms. In-charge: Er. Rohit Tripathi.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000006',
    floor_id: 'f0000001-0000-4000-8000-000000000003',
    room_name: 'E-305 Cyber Security & Ethical Hacking Sandbox',
    room_type: 'lab',
    department: 'Cyber Security & Data Science',
    side: 'West Wing',
    description: 'Air-gapped penetration testing lab with dedicated firewall testbenches, Kali Linux nodes, and packet analysis displays.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000007',
    floor_id: 'f0000001-0000-4000-8000-000000000004',
    room_name: 'E-401 IEC Innovation & Startup Incubation Hub',
    room_type: 'seminar_hall',
    department: 'Innovation & Entrepreneurship',
    side: 'North Wing',
    description: 'Venture pitch stage, modular brainstorming pods, investor meeting rooms, and prototyping support for student tech founders.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000008',
    floor_id: 'f0000001-0000-4000-8000-000000000004',
    room_name: 'E-404 High Performance Cloud & DevOps Research Pod',
    room_type: 'lab',
    department: 'Information Technology',
    side: 'East Wing',
    description: 'Kubernetes cluster monitoring console, CI/CD automated pipeline server, and hybrid-cloud test pods.',
    created_at: '2026-01-01T09:30:00Z'
  },

  // Block A Rooms
  {
    id: 'r0000001-0000-4000-8000-000000000009',
    floor_id: 'f0000001-0000-4000-8000-000000000005',
    room_name: 'A-001 Central Admissions & Student Helpdesk',
    room_type: 'admin_office',
    department: 'Admissions & Student Welfare',
    side: 'Ground Floor Entry',
    description: 'Primary inquiry counter for new admissions, student ID card issuance, bonafide certificates, and lost & found intake.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000010',
    floor_id: 'f0000001-0000-4000-8000-000000000006',
    room_name: 'A-102 Registrar Office & Examination Secretariat',
    room_type: 'admin_office',
    department: 'Administration & AKTU Cell',
    side: 'First Floor North',
    description: 'Office of Col. Sanjeev Dewan, Registrar. AKTU examination coordination, degree verification, and institutional governance.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000011',
    floor_id: 'f0000001-0000-4000-8000-000000000007',
    room_name: 'A-205 Corporate Relations & Training & Placement Cell',
    room_type: 'admin_office',
    department: 'Corporate Relations & Placement',
    side: 'Second Floor South',
    description: 'Head of Placements: Mr. Pradeep Kapoor. Pre-placement training suites, interview cabins, and corporate recruiting boards.',
    created_at: '2026-01-01T09:30:00Z'
  },

  // Block D Rooms
  {
    id: 'r0000001-0000-4000-8000-000000000012',
    floor_id: 'f0000001-0000-4000-8000-000000000011',
    room_name: 'D-101 Central Library & Digital Reference Lounge',
    room_type: 'library',
    department: 'Library & Information Sciences',
    side: 'Ground Floor Central',
    description: 'Over 75,000 reference volumes, IEEE/Springer journal access, digital OPAC kiosks, and quiet study pods #1 to #30.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000013',
    floor_id: 'f0000001-0000-4000-8000-000000000012',
    room_name: 'D-201 Dr. Vikram Sarabhai Grand Auditorium',
    room_type: 'auditorium',
    department: 'Cultural & Academic Affairs',
    side: 'Second Floor Stage',
    description: '800-seat state-of-the-art auditorium with central air-conditioning, Dolby acoustic surround system, and motorized green rooms.',
    created_at: '2026-01-01T09:30:00Z'
  },

  // Block F Rooms
  {
    id: 'r0000001-0000-4000-8000-000000000014',
    floor_id: 'f0000001-0000-4000-8000-000000000013',
    room_name: 'F-101 Central Multi-Cuisine Food Court & Cafeteria',
    room_type: 'cafeteria',
    department: 'Student Welfare & Hospitality',
    side: 'Ground Floor Dining Area',
    description: '500-seat student cafeteria with Nescafe specialty kiosk, healthy lunch meal counters, juice bars, and outdoor shaded patio.',
    created_at: '2026-01-01T09:30:00Z'
  },
  {
    id: 'r0000001-0000-4000-8000-000000000015',
    floor_id: 'f0000001-0000-4000-8000-000000000013',
    room_name: 'F-105 Campus Health & Emergency First Aid Clinic',
    room_type: 'amenity',
    department: 'Health Services',
    side: 'Ground Floor Medical Bay',
    description: '24/7 licensed medical practitioner (Dr. Anita Joshi), emergency first-aid station, oxygen concentrators, and dedicated campus ambulance.',
    created_at: '2026-01-01T09:30:00Z'
  }
];

// ==========================================
// 5. FACILITIES
// ==========================================
export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fc000001-0000-4000-8000-000000000001',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    building_id: 'b0000001-0000-4000-8000-000000000001',
    name: 'NVIDIA DGX A100 High-Performance Computing Cluster',
    facility_type: 'Research Computing Supercluster',
    description: 'GPU accelerated neural network training supercomputer dedicated to Computer Vision, LLM fine-tuning, and autonomous vehicle simulations.',
    latitude: 28.4735,
    longitude: 77.4899,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'fc000001-0000-4000-8000-000000000002',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    building_id: 'b0000001-0000-4000-8000-000000000005',
    name: '24x7 Digital Reading Lounge & E-Journal Terminal',
    facility_type: 'Library Learning Hub',
    description: 'Quiet study pods with gigabit fiber LAN connections, IEEE/ACM digital access, and power outlets for laptops.',
    latitude: 28.4715,
    longitude: 77.4890,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'fc000001-0000-4000-8000-000000000003',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    building_id: 'b0000001-0000-4000-8000-000000000006',
    name: 'Campus Nescafe Coffee Lounge & Dining Patio',
    facility_type: 'Cafeteria & Dining',
    description: 'Popular student meeting spot serving fresh beverages, snacks, and snacks near the central lawn.',
    latitude: 28.4710,
    longitude: 77.4912,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'fc000001-0000-4000-8000-000000000004',
    campus_id: 'c0000001-0000-4000-8000-000000000001',
    building_id: 'b0000001-0000-4000-8000-000000000006',
    name: 'Emergency Medical Care Unit & Ambulance Dispatch',
    facility_type: 'Healthcare & Wellness',
    description: 'Equipped with basic life-support, ECG, defibrillators, and direct transfer connection to nearby Greater Noida hospitals.',
    latitude: 28.4709,
    longitude: 77.4914,
    created_at: '2026-01-01T10:00:00Z'
  }
];

// ==========================================
// 6. USERS
// ==========================================
export const INITIAL_USERS: User[] = [
  {
    id: 'u0000001-0000-4000-8000-000000000001',
    name: 'Aarav Sharma',
    email: 'student@iec.edu.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE (Artificial Intelligence)',
    year: 3,
    created_at: '2026-01-10T10:00:00Z',
    rollNumber: '220010010024',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'u0000001-0000-4000-8000-000000000002',
    name: 'Dr. Smriti Verma',
    email: 'admin@iec.edu.in',
    role: 'admin',
    department: 'Artificial Intelligence & Machine Learning',
    course: 'PhD Computer Science',
    year: 12,
    created_at: '2026-01-05T08:30:00Z',
    phone: '+91 98111 22334',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'u0000001-0000-4000-8000-000000000003',
    name: 'Prof. Rajesh Sharma',
    email: 'faculty@iec.edu.in',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    course: 'M.Tech Distributed Systems',
    year: 8,
    created_at: '2026-01-08T09:15:00Z',
    phone: '+91 98222 33445',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'u0000001-0000-4000-8000-000000000004',
    name: 'Rohan Gupta',
    email: 'rohan.gupta23@iec.edu.in',
    role: 'student',
    department: 'Information Technology',
    course: 'B.Tech IT',
    year: 3,
    created_at: '2026-01-12T11:00:00Z',
    rollNumber: '220010010045',
    phone: '+91 98712 34567'
  },
  {
    id: 'u0000001-0000-4000-8000-000000000005',
    name: 'Pooja Verma',
    email: 'pooja.verma25@iec.edu.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    year: 2,
    created_at: '2026-01-15T14:20:00Z',
    rollNumber: '230010010088',
    phone: '+91 97112 99887'
  },
  {
    id: 'u0000001-0000-4000-8000-000000000006',
    name: 'Ramesh Kumar',
    email: 'staff.helpdesk@iec.edu.in',
    role: 'staff',
    department: 'Campus Security & Facilities',
    course: 'Facilities Management',
    year: 5,
    created_at: '2026-01-02T08:00:00Z',
    phone: '+91 98999 11223'
  }
];

// ==========================================
// 7. LOST ITEMS
// ==========================================
export const INITIAL_LOST_ITEMS: LostItem[] = [
  {
    id: 'li000001-0000-4000-8000-000000000001',
    reported_by: 'u0000001-0000-4000-8000-000000000001', // Aarav Sharma
    title: 'Casio fx-991EX Classwiz Scientific Calculator',
    description: 'Black scientific calculator with solar panel strip. Has an orange "IEC CSE" sticker on the protective sliding back lid and initials "AS" scratched near battery latch.',
    category: 'electronics',
    image_url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
    room_id: 'r0000001-0000-4000-8000-000000000004', // E-204 NVIDIA AI Lab
    facility_id: 'fc000001-0000-4000-8000-000000000001',
    lost_at: '2026-08-23T15:30:00Z',
    status: 'matched',
    created_at: '2026-08-23T15:45:00Z'
  },
  {
    id: 'li000001-0000-4000-8000-000000000002',
    reported_by: 'u0000001-0000-4000-8000-000000000004', // Rohan Gupta
    title: 'Navy Blue Fastrack Leather Wallet with ID Cards',
    description: 'Dark blue bi-fold leather wallet containing College ID Card (Roll # 220010010045), Metro Smart Card, and PAN card.',
    category: 'wallet_keys',
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    room_id: 'r0000001-0000-4000-8000-000000000014', // F-101 Cafeteria
    facility_id: 'fc000001-0000-4000-8000-000000000003',
    lost_at: '2026-08-22T13:10:00Z',
    status: 'active',
    created_at: '2026-08-22T13:30:00Z'
  },
  {
    id: 'li000001-0000-4000-8000-000000000003',
    reported_by: 'u0000001-0000-4000-8000-000000000005', // Pooja Verma
    title: 'HP 15.6-inch Waterproof Laptop Backpack (Grey/Black)',
    description: 'Grey HP backpack containing Data Structures notebook, blue Parker fountain pen, and Logitech wireless mouse with silver "P" keychain.',
    category: 'clothing_bags',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    room_id: 'r0000001-0000-4000-8000-000000000001', // E-101 Alan Turing Lecture Theatre
    facility_id: null,
    lost_at: '2026-08-24T09:20:00Z',
    status: 'active',
    created_at: '2026-08-24T09:40:00Z'
  }
];

// ==========================================
// 8. FOUND ITEMS
// ==========================================
export const INITIAL_FOUND_ITEMS: FoundItem[] = [
  {
    id: 'fi000001-0000-4000-8000-000000000001',
    reported_by: 'u0000001-0000-4000-8000-000000000002', // Dr. Smriti Verma
    title: 'Scientific Calculator (Casio Scientific Model Classwiz)',
    description: 'Found a black Casio calculator left on the lab table after the Machine Learning lab session. Has orange sticker on the protective cover.',
    category: 'electronics',
    image_url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
    room_id: 'r0000001-0000-4000-8000-000000000004', // E-204 NVIDIA AI Lab
    facility_id: 'fc000001-0000-4000-8000-000000000001',
    found_at: '2026-08-23T17:15:00Z',
    status: 'claimed',
    created_at: '2026-08-23T17:30:00Z'
  },
  {
    id: 'fi000001-0000-4000-8000-000000000002',
    reported_by: 'u0000001-0000-4000-8000-000000000006', // Ramesh Kumar (Staff)
    title: 'Boat Rockerz 550 Wireless Bluetooth Headphones',
    description: 'Army green over-ear wireless headphones with minor scuffs on the left cushion left at study pod 18 in library.',
    category: 'electronics',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    room_id: 'r0000001-0000-4000-8000-000000000012', // D-101 Library
    facility_id: 'fc000001-0000-4000-8000-000000000002',
    found_at: '2026-08-24T11:45:00Z',
    status: 'available',
    created_at: '2026-08-24T12:00:00Z'
  },
  {
    id: 'fi000001-0000-4000-8000-000000000003',
    reported_by: 'u0000001-0000-4000-8000-000000000006', // Ramesh Kumar
    title: 'Milton Thermosteel Insulated Water Bottle 750ml (Matte Silver)',
    description: 'Silver stainless steel water bottle with black cap found on cafeteria table near Nescafe kiosk.',
    category: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    room_id: 'r0000001-0000-4000-8000-000000000014', // F-101 Cafeteria
    facility_id: 'fc000001-0000-4000-8000-000000000003',
    found_at: '2026-08-24T14:30:00Z',
    status: 'available',
    created_at: '2026-08-24T14:45:00Z'
  }
];

// ==========================================
// 9. ITEM MATCHES
// ==========================================
export const INITIAL_ITEM_MATCHES: ItemMatch[] = [
  {
    id: 'im000001-0000-4000-8000-000000000001',
    lost_item_id: 'li000001-0000-4000-8000-000000000001', // Casio 991EX lost by Aarav
    found_item_id: 'fi000001-0000-4000-8000-000000000001', // Casio found by Dr. Smriti
    confidence_score: 96.5,
    reason: 'Exact category match (Electronics), matching building & room (Block E-204 NVIDIA AI Lab), identical title keywords and temporal correlation within 2 hours.',
    status: 'approved',
    created_at: '2026-08-23T17:35:00Z'
  }
];

// ==========================================
// 10. CLAIMS
// ==========================================
export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'cl000001-0000-4000-8000-000000000001',
    found_item_id: 'fi000001-0000-4000-8000-000000000001', // Casio Calculator
    claimant_id: 'u0000001-0000-4000-8000-000000000001', // Aarav Sharma
    status: 'approved',
    verification_code: 'IEC-V991-AS-204',
    qr_token: 'qr_token_clm_casio_991ex_aarav',
    created_at: '2026-08-23T18:00:00Z',
    verified_at: '2026-08-24T09:00:00Z'
  },
  {
    id: 'cl000001-0000-4000-8000-000000000002',
    found_item_id: 'fi000001-0000-4000-8000-000000000002', // Boat Headphones
    claimant_id: 'u0000001-0000-4000-8000-000000000004', // Rohan Gupta
    status: 'pending',
    verification_code: 'IEC-BOAT-550-RG',
    qr_token: 'qr_token_clm_boat_headphones_rohan',
    created_at: '2026-08-24T13:00:00Z',
    verified_at: null
  }
];

// Convenience Aliases for backward compatibility in views
export const CAMPUSES = INITIAL_CAMPUSES;
export const BUILDINGS = INITIAL_BUILDINGS;
export const FLOORS = INITIAL_FLOORS;
export const ROOMS = INITIAL_ROOMS;
export const FACILITIES = INITIAL_FACILITIES;
export const USERS = INITIAL_USERS;
export const LOST_ITEMS = INITIAL_LOST_ITEMS;
export const FOUND_ITEMS = INITIAL_FOUND_ITEMS;
export const ITEM_MATCHES = INITIAL_ITEM_MATCHES;
export const CLAIMS = INITIAL_CLAIMS;
