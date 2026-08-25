// Relational Schema Types strictly conforming to PostgreSQL / Cloud SQL table definitions

export type UserRole = 'student' | 'faculty' | 'admin' | 'staff';
export type LostItemStatus = 'active' | 'matched' | 'claimed' | 'resolved' | 'cancelled' | 'open';
export type FoundItemStatus = 'available' | 'matched' | 'claimed' | 'returned' | 'cancelled' | 'open';
export type MatchStatus = 'pending' | 'approved' | 'rejected';
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'handed_over';

export type ItemType = 'lost' | 'found';
export type ItemCategory = 
  | 'electronics' 
  | 'books' 
  | 'cards_ids' 
  | 'bags' 
  | 'stationery' 
  | 'keys' 
  | 'accessories' 
  | 'sports' 
  | 'other'
  | 'id_card'
  | 'wallet_keys'
  | 'documents_books'
  | 'clothing_bags'
  | 'lab_equipment';
export type AiMode = 'campus' | 'general';

// 1. campuses
export interface Campus {
  id: string; // uuid
  name: string; // text NOT NULL
  address?: string | null; // text
  latitude?: number | null; // double precision
  longitude?: number | null; // double precision
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
}

// 2. buildings
export interface Building {
  id: string; // uuid
  campus_id?: string; // uuid NOT NULL (FK campuses.id)
  name: string; // text NOT NULL
  building_type?: string | null; // text
  description?: string | null; // text
  shortDescription?: string;
  latitude?: number | null; // double precision
  longitude?: number | null; // double precision
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
  // Optional UI helper properties
  code?: string;
  isBlockE?: boolean;
  colorTheme?: string;
  iconName?: string;
  floorsCount?: number;
  departments?: string[];
  headOffice?: string;
  coordinates?: { x: number; y: number };
}

// 3. floors
export interface Floor {
  id: string; // uuid
  building_id: string; // uuid NOT NULL (FK buildings.id)
  floor_number: number; // integer NOT NULL
  name: string; // text NOT NULL
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
}

// 4. rooms
export interface Room {
  id: string; // uuid
  floor_id?: string; // uuid NOT NULL (FK floors.id)
  room_name?: string; // text NOT NULL
  room_type?: string | null; // text
  department?: string | null; // text
  side?: string | null; // text
  description?: string | null; // text
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
  // UI Helpers & backward compatibility
  name?: string;
  roomNumber?: string;
  buildingId?: string;
  buildingName?: string;
  floor?: number;
  capacity?: number;
  equipment?: string[];
  inCharge?: string;
  inChargeContact?: string;
  status?: 'available' | 'occupied' | 'maintenance';
  type?: 'lecture_hall' | 'lab' | 'office' | 'library' | 'facility' | 'auditorium' | 'amenity';
}

// 5. facilities
export interface Facility {
  id: string; // uuid
  campus_id: string; // uuid NOT NULL (FK campuses.id)
  building_id?: string | null; // uuid (FK buildings.id)
  name: string; // text NOT NULL
  facility_type?: string | null; // text
  description?: string | null; // text
  latitude?: number | null; // double precision
  longitude?: number | null; // double precision
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
}

// 6. users
export interface User {
  id: string; // uuid NOT NULL
  name?: string | null; // text
  email?: string | null; // text UNIQUE
  role: UserRole; // text NOT NULL ('student' | 'faculty' | 'admin' | 'staff')
  department?: string | null; // text
  course?: string | null; // text
  year?: number | null; // integer
  semester?: number;
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
  // UI helpers
  rollNumber?: string;
  avatarUrl?: string;
  phone?: string;
}

// 6b. teachers (strictly Name, Teaching Subject, Department)
export interface Teacher {
  id: string;
  name: string;
  teachingSubject: string;
  department: string;
  created_at?: string;
}

// 7. lost_items
export interface LostItem {
  id: string; // uuid
  reported_by?: string; // uuid NOT NULL (FK users.id)
  title: string; // text NOT NULL
  description?: string | null; // text
  category?: string | null; // text
  image_url?: string | null; // text
  room_id?: string | null; // uuid (FK rooms.id)
  facility_id?: string | null; // uuid (FK facilities.id)
  lost_at?: string | null; // timestamp with time zone
  status?: LostItemStatus; // text NOT NULL
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
  date_lost?: string;
  unique_identifiers?: string;
}

// 8. found_items
export interface FoundItem {
  id: string; // uuid
  reported_by?: string; // uuid NOT NULL (FK users.id)
  title: string; // text NOT NULL
  description?: string | null; // text
  category?: string | null; // text
  image_url?: string | null; // text
  room_id?: string | null; // uuid (FK rooms.id)
  facility_id?: string | null; // uuid (FK facilities.id)
  found_at?: string | null; // timestamp with time zone
  date_found?: string;
  storage_location?: string;
  unique_identifiers?: string;
  status?: FoundItemStatus; // text NOT NULL
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
}

// 9. item_matches
export interface ItemMatch {
  id: string; // uuid
  lost_item_id: string; // uuid NOT NULL (FK lost_items.id)
  found_item_id: string; // uuid NOT NULL (FK found_items.id)
  confidence_score?: number | null; // numeric 0 - 100
  score?: number;
  reason?: string | null; // text
  status?: MatchStatus; // text NOT NULL ('pending' | 'approved' | 'rejected')
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
}

// 10. claims
export interface Claim {
  id: string; // uuid
  found_item_id?: string; // uuid (FK found_items.id)
  claimant_id?: string; // uuid (FK users.id)
  itemId?: string;
  itemTitle?: string;
  claimantId?: string;
  claimantName?: string;
  claimantEmail?: string;
  claimantPhone?: string;
  claimantRole?: UserRole;
  proofDescription?: string;
  proofAnswer?: string;
  securityAnswers?: { verificationClue?: string };
  status: ClaimStatus; // text NOT NULL
  verification_code?: string | null; // text
  qr_token?: string | null; // text UNIQUE
  created_at?: string; // timestamp with time zone NOT NULL
  createdAt?: string;
  submittedAt?: string;
  verified_at?: string | null; // timestamp with time zone
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Unified LostFoundItem interface for UI hub
export interface LostFoundItem {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  imageUrl?: string;
  location: {
    campusId: string;
    buildingId: string;
    buildingName: string;
    floor?: number;
    roomNumber?: string;
    roomName?: string;
    landmark?: string;
  };
  nearestLandmark?: string;
  uniqueIdentifiers?: string;
  dateReported: string;
  timeReported?: string;
  status: 'open' | 'claimed' | 'returned' | 'resolved';
  reportedBy: {
    id?: string;
    userId?: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
  };
  contactPrivacy: 'public' | 'via_admin' | 'masked';
  matchScore?: number;
  matchedWithId?: string;
  resolvedAt?: string;
}

// Enriched join models for UI convenience
export interface EnrichedRoom extends Room {
  floor_number?: number;
  floor_name?: string;
  building_id?: string;
  building_name?: string;
  building_code?: string;
}

export interface EnrichedBuilding extends Building {
  campus_name?: string;
  floors?: Floor[];
  rooms?: EnrichedRoom[];
  facilities?: Facility[];
}

export interface EnrichedLostItem extends LostItem {
  reporter_name?: string;
  reporter_email?: string;
  reporter_role?: UserRole;
  room_name?: string;
  building_name?: string;
  floor_number?: number;
  facility_name?: string;
  matches_count?: number;
}

export interface EnrichedFoundItem extends FoundItem {
  reporter_name?: string;
  reporter_email?: string;
  reporter_role?: UserRole;
  room_name?: string;
  building_name?: string;
  floor_number?: number;
  facility_name?: string;
  claims_count?: number;
}

export interface EnrichedClaim extends Claim {
  found_item_title?: string;
  found_item_category?: string;
  found_item_image?: string;
  claimant_name?: string;
  claimant_email?: string;
  claimant_role?: UserRole;
  room_name?: string;
  facility_name?: string;
}

export interface EnrichedItemMatch extends ItemMatch {
  lost_item?: LostItem;
  found_item?: FoundItem;
  lost_title?: string;
  found_title?: string;
  lost_category?: string;
  found_category?: string;
  lost_location?: string;
  found_location?: string;
}

// Notice and AI types for campus portal features
export type NoticePriority = 'urgent' | 'high' | 'normal';
export type NoticeCategory = 
  | 'urgent' 
  | 'academic' 
  | 'examination' 
  | 'exam' 
  | 'placement' 
  | 'cultural' 
  | 'events' 
  | 'hostel' 
  | 'sports' 
  | 'general';

export interface Notice {
  id: string;
  title: string;
  summary?: string;
  content: string;
  category: NoticeCategory;
  priority: NoticePriority;
  isPinned: boolean;
  department: string;
  targetAudience: string;
  publishedAt?: string;
  publishDate?: string;
  authorName?: string;
  authorDesignation?: string;
  attachmentName?: string;
  viewsCount?: number;
  author?: {
    id: string;
    name: string;
    role: UserRole;
  };
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: AiMode;
  groundedSources?: {
    type: 'building' | 'room' | 'policy' | 'notice' | 'facility';
    title: string;
    location?: string;
  }[];
}
