import { Teacher } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  // Computer Science & Engineering (Block E)
  {
    id: 't-cse-01',
    name: 'Prof. Rajiv Ranjan',
    teachingSubject: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    created_at: '2026-01-10T09:00:00Z'
  },
  {
    id: 't-cse-02',
    name: 'Dr. Neha Verma',
    teachingSubject: 'Machine Learning & Artificial Intelligence',
    department: 'Computer Science & Engineering',
    created_at: '2026-01-10T09:15:00Z'
  },
  {
    id: 't-cse-03',
    name: 'Prof. Amit Kumar',
    teachingSubject: 'Cloud Computing & DevOps',
    department: 'Computer Science & Engineering',
    created_at: '2026-01-10T09:30:00Z'
  },
  {
    id: 't-cse-04',
    name: 'Prof. Preeti Saxena',
    teachingSubject: 'Database Management Systems (DBMS)',
    department: 'Computer Science & Engineering',
    created_at: '2026-01-10T09:45:00Z'
  },
  {
    id: 't-cse-05',
    name: 'Prof. Gaurav Srivastava',
    teachingSubject: 'Computer Networks & Security',
    department: 'Computer Science & Engineering',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 't-cse-06',
    name: 'Prof. Swati Gupta',
    teachingSubject: 'Web Technologies & Full Stack Development',
    department: 'Computer Science & Engineering',
    created_at: '2026-01-10T10:15:00Z'
  },

  // Information Technology (Block E)
  {
    id: 't-it-01',
    name: 'Dr. Sanjay Sharma',
    teachingSubject: 'Cyber Security & Cryptography',
    department: 'Information Technology',
    created_at: '2026-01-10T10:30:00Z'
  },
  {
    id: 't-it-02',
    name: 'Prof. Pooja Mishra',
    teachingSubject: 'Operating Systems & Distributed Architecture',
    department: 'Information Technology',
    created_at: '2026-01-10T10:45:00Z'
  },
  {
    id: 't-it-03',
    name: 'Prof. Vikas Singh',
    teachingSubject: 'Mobile Application Development & React Native',
    department: 'Information Technology',
    created_at: '2026-01-10T11:00:00Z'
  },

  // Electronics & Communication Engineering (Block B)
  {
    id: 't-ece-01',
    name: 'Dr. Alok Tripathi',
    teachingSubject: 'VLSI Design & Semiconductor Devices',
    department: 'Electronics & Communication Engineering',
    created_at: '2026-01-10T11:15:00Z'
  },
  {
    id: 't-ece-02',
    name: 'Prof. Meenakshi Sharma',
    teachingSubject: 'Digital Signal Processing (DSP)',
    department: 'Electronics & Communication Engineering',
    created_at: '2026-01-10T11:30:00Z'
  },
  {
    id: 't-ece-03',
    name: 'Prof. Rahul Tyagi',
    teachingSubject: 'Embedded Systems & Internet of Things (IoT)',
    department: 'Electronics & Communication Engineering',
    created_at: '2026-01-10T11:45:00Z'
  },

  // Electrical & Electronics Engineering (Block B)
  {
    id: 't-eee-01',
    name: 'Dr. R.K. Pandey',
    teachingSubject: 'Power Systems & Renewable Energy Integration',
    department: 'Electrical & Electronics Engineering',
    created_at: '2026-01-10T12:00:00Z'
  },
  {
    id: 't-eee-02',
    name: 'Prof. Sunita Rao',
    teachingSubject: 'Control Systems & Electrical Machines',
    department: 'Electrical & Electronics Engineering',
    created_at: '2026-01-10T12:15:00Z'
  },

  // Mechanical Engineering (Block C)
  {
    id: 't-me-01',
    name: 'Dr. Vinod Kumar',
    teachingSubject: 'Thermodynamics & Heat Transfer',
    department: 'Mechanical Engineering',
    created_at: '2026-01-10T12:30:00Z'
  },
  {
    id: 't-me-02',
    name: 'Prof. Deepak Chauhan',
    teachingSubject: 'CAD/CAM & Industrial Robotics',
    department: 'Mechanical Engineering',
    created_at: '2026-01-10T12:45:00Z'
  },
  {
    id: 't-me-03',
    name: 'Prof. Manoj Sharma',
    teachingSubject: 'Fluid Mechanics & Hydraulic Machinery',
    department: 'Mechanical Engineering',
    created_at: '2026-01-10T13:00:00Z'
  },

  // Civil Engineering (Block C)
  {
    id: 't-ce-01',
    name: 'Dr. Harish Chandra',
    teachingSubject: 'Structural Analysis & Design of Concrete Structures',
    department: 'Civil Engineering',
    created_at: '2026-01-10T13:15:00Z'
  },
  {
    id: 't-ce-02',
    name: 'Prof. Anjali Rawat',
    teachingSubject: 'Geotechnical Engineering & Advanced Surveying',
    department: 'Civil Engineering',
    created_at: '2026-01-10T13:30:00Z'
  },

  // Pharmacy / Pharmaceutical Sciences (Block D)
  {
    id: 't-pharm-01',
    name: 'Dr. S.P. Agarwal',
    teachingSubject: 'Pharmacology & Clinical Toxicology',
    department: 'Pharmacy & Pharmaceutical Sciences',
    created_at: '2026-01-10T13:45:00Z'
  },
  {
    id: 't-pharm-02',
    name: 'Prof. Ritu Bansal',
    teachingSubject: 'Pharmaceutics & Novel Drug Delivery Systems',
    department: 'Pharmacy & Pharmaceutical Sciences',
    created_at: '2026-01-10T14:00:00Z'
  },
  {
    id: 't-pharm-03',
    name: 'Dr. Nitin Sharma',
    teachingSubject: 'Medicinal & Pharmaceutical Chemistry',
    department: 'Pharmacy & Pharmaceutical Sciences',
    created_at: '2026-01-10T14:15:00Z'
  },

  // Management Studies / MBA (Block A)
  {
    id: 't-mba-01',
    name: 'Dr. Rohit Singhal',
    teachingSubject: 'Marketing Management & Consumer Analytics',
    department: 'Management Studies (MBA)',
    created_at: '2026-01-10T14:30:00Z'
  },
  {
    id: 't-mba-02',
    name: 'Prof. Shweta Joshi',
    teachingSubject: 'Financial Management & Corporate Accounting',
    department: 'Management Studies (MBA)',
    created_at: '2026-01-10T14:45:00Z'
  },
  {
    id: 't-mba-03',
    name: 'Prof. Anand Mishra',
    teachingSubject: 'Human Resource Management & Organizational Behavior',
    department: 'Management Studies (MBA)',
    created_at: '2026-01-10T15:00:00Z'
  },

  // Applied Sciences & Humanities (Block A)
  {
    id: 't-ash-01',
    name: 'Dr. Archana Dixit',
    teachingSubject: 'Engineering Mathematics & Numerical Methods',
    department: 'Applied Sciences & Humanities',
    created_at: '2026-01-10T15:15:00Z'
  },
  {
    id: 't-ash-02',
    name: 'Dr. K.P. Singh',
    teachingSubject: 'Engineering Physics & Quantum Optics',
    department: 'Applied Sciences & Humanities',
    created_at: '2026-01-10T15:30:00Z'
  },
  {
    id: 't-ash-03',
    name: 'Dr. Tanuja Roy',
    teachingSubject: 'Professional Communication & Technical English',
    department: 'Applied Sciences & Humanities',
    created_at: '2026-01-10T15:45:00Z'
  }
];

export const TEACHER_DEPARTMENTS = [
  'All Departments',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Pharmacy & Pharmaceutical Sciences',
  'Management Studies (MBA)',
  'Applied Sciences & Humanities'
];

const STORAGE_KEY = 'iec_teachers_data_v1';

export function loadTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load teachers from localStorage:', err);
  }
  return INITIAL_TEACHERS;
}

export function saveTeachers(teachers: Teacher[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  } catch (err) {
    console.warn('Failed to save teachers to localStorage:', err);
  }
}
