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
  Claim,
  EnrichedRoom,
  EnrichedBuilding,
  EnrichedLostItem,
  EnrichedFoundItem,
  EnrichedClaim,
  EnrichedItemMatch
} from '../types';
import {
  INITIAL_CAMPUSES,
  INITIAL_BUILDINGS,
  INITIAL_FLOORS,
  INITIAL_ROOMS,
  INITIAL_FACILITIES,
  INITIAL_USERS,
  INITIAL_LOST_ITEMS,
  INITIAL_FOUND_ITEMS,
  INITIAL_ITEM_MATCHES,
  INITIAL_CLAIMS
} from './campusData';

// Storage keys
const DB_STORAGE_KEY = 'iec_campus_relational_database_v2';

export interface DatabaseState {
  campuses: Campus[];
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];
  facilities: Facility[];
  users: User[];
  lost_items: LostItem[];
  found_items: FoundItem[];
  item_matches: ItemMatch[];
  claims: Claim[];
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Load initial database state from localStorage or seed
export function loadInitialDatabase(): DatabaseState {
  try {
    const saved = localStorage.getItem(DB_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed.campuses) &&
        Array.isArray(parsed.buildings) &&
        Array.isArray(parsed.rooms) &&
        Array.isArray(parsed.lost_items) &&
        Array.isArray(parsed.found_items)
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read saved database state, using default seeds:', e);
  }

  return {
    campuses: [...INITIAL_CAMPUSES],
    buildings: [...INITIAL_BUILDINGS],
    floors: [...INITIAL_FLOORS],
    rooms: [...INITIAL_ROOMS],
    facilities: [...INITIAL_FACILITIES],
    users: [...INITIAL_USERS],
    lost_items: [...INITIAL_LOST_ITEMS],
    found_items: [...INITIAL_FOUND_ITEMS],
    item_matches: [...INITIAL_ITEM_MATCHES],
    claims: [...INITIAL_CLAIMS]
  };
}

export function saveDatabaseToStorage(state: DatabaseState): void {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save database state to localStorage:', e);
  }
}

// Intelligent automatic match calculator
export function calculateItemMatch(
  lost: LostItem,
  found: FoundItem,
  state?: DatabaseState
): ItemMatch {
  let score = 0;
  const reasons: string[] = [];

  // Category match
  if (lost.category && found.category && lost.category.toLowerCase() === found.category.toLowerCase()) {
    score += 40;
    reasons.push(`Matching category: ${lost.category.replace('_', ' ').toUpperCase()}`);
  }

  // Location Proximity
  let locationScore = 0;
  if (lost.room_id && found.room_id && lost.room_id === found.room_id) {
    locationScore += 35;
    const room = state?.rooms.find(r => r.id === lost.room_id);
    reasons.push(`Identical room location: ${room ? (room.room_name || room.name) : 'Room matched'}`);
  } else if (lost.room_id && found.room_id && state) {
    const lostRoom = state.rooms.find(r => r.id === lost.room_id);
    const foundRoom = state.rooms.find(r => r.id === found.room_id);
    if (lostRoom && foundRoom) {
      const lostFloor = state.floors.find(f => f.id === lostRoom.floor_id);
      const foundFloor = state.floors.find(f => f.id === foundRoom.floor_id);
      if (lostFloor && foundFloor && lostFloor.building_id === foundFloor.building_id) {
        locationScore += 20;
        const b = state.buildings.find(b => b.id === lostFloor.building_id);
        reasons.push(`Same building: ${b ? b.name : 'Campus block'}`);
        if (lostFloor.floor_number === foundFloor.floor_number) {
          locationScore += 10;
          reasons.push(`Same floor level (Floor ${lostFloor.floor_number})`);
        }
      }
    }
  } else if (lost.facility_id && found.facility_id && lost.facility_id === found.facility_id) {
    locationScore += 30;
    const fac = state?.facilities.find(f => f.id === lost.facility_id);
    reasons.push(`Same facility area: ${fac ? fac.name : 'Facility match'}`);
  }
  score += locationScore;

  // Text keyword overlap
  const cleanTokens = (str?: string | null) => 
    (str || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
  
  const lostTokens = cleanTokens(lost.title + ' ' + (lost.description || ''));
  const foundTokens = cleanTokens(found.title + ' ' + (found.description || ''));
  const shared = lostTokens.filter(t => foundTokens.includes(t));
  const uniqueShared = Array.from(new Set(shared));

  if (uniqueShared.length > 0) {
    const textScore = Math.min(30, uniqueShared.length * 10);
    score += textScore;
    reasons.push(`Keywords matched: ${uniqueShared.slice(0, 3).join(', ')}`);
  }

  // Temporal proximity
  if ((lost.lost_at || lost.date_lost) && (found.found_at || found.date_found)) {
    const lostTime = new Date(lost.lost_at || lost.date_lost || '').getTime();
    const foundTime = new Date(found.found_at || found.date_found || '').getTime();
    if (!isNaN(lostTime) && !isNaN(foundTime)) {
      const diffHours = Math.abs(foundTime - lostTime) / (1000 * 60 * 60);
      if (diffHours <= 24) {
        score += 10;
        reasons.push(`Reported within ${Math.round(diffHours)} hours`);
      }
    }
  }

  const confidenceScore = Math.min(99, Math.max(0, score));
  return {
    id: generateUUID(),
    lost_item_id: lost.id,
    found_item_id: found.id,
    confidence_score: confidenceScore,
    score: confidenceScore,
    reason: reasons.length > 0 ? reasons.join(' • ') : 'General category proximity',
    status: confidenceScore >= 70 ? 'approved' : 'pending',
    created_at: new Date().toISOString()
  };
}

// Join Enriched Entities Helpers
export function enrichRooms(rooms: Room[], floors: Floor[], buildings: Building[]): EnrichedRoom[] {
  return rooms.map(r => {
    const floor = floors.find(f => f.id === r.floor_id);
    const building = floor ? buildings.find(b => b.id === floor.building_id) : undefined;
    return {
      ...r,
      floor_number: floor?.floor_number,
      floor_name: floor?.name,
      building_id: building?.id,
      building_name: building?.name,
      building_code: building?.code || building?.name
    };
  });
}

export function enrichBuildings(
  buildings: Building[],
  campuses: Campus[],
  floors: Floor[],
  rooms: Room[],
  facilities: Facility[]
): EnrichedBuilding[] {
  const enrichedRooms = enrichRooms(rooms, floors, buildings);

  return buildings.map(b => {
    const campus = campuses.find(c => c.id === b.campus_id);
    const bFloors = floors.filter(f => f.building_id === b.id).sort((a, b) => a.floor_number - b.floor_number);
    const bRooms = enrichedRooms.filter(r => r.building_id === b.id);
    const bFacilities = facilities.filter(f => f.building_id === b.id);

    return {
      ...b,
      campus_name: campus?.name,
      floors: bFloors,
      rooms: bRooms,
      facilities: bFacilities
    };
  });
}

export function enrichLostItems(
  lostItems: LostItem[],
  users: User[],
  rooms: Room[],
  floors: Floor[],
  buildings: Building[],
  facilities: Facility[],
  matches: ItemMatch[]
): EnrichedLostItem[] {
  const enrichedRooms = enrichRooms(rooms, floors, buildings);

  return lostItems.map(item => {
    const reporter = users.find(u => u.id === item.reported_by);
    const room = item.room_id ? enrichedRooms.find(r => r.id === item.room_id) : undefined;
    const facility = item.facility_id ? facilities.find(f => f.id === item.facility_id) : undefined;
    const itemMatches = matches.filter(m => m.lost_item_id === item.id);

    return {
      ...item,
      reporter_name: reporter?.name || 'IEC Student',
      reporter_email: reporter?.email || '',
      reporter_role: reporter?.role || 'student',
      room_name: room?.room_name,
      building_name: room?.building_name,
      floor_number: room?.floor_number,
      facility_name: facility?.name,
      matches_count: itemMatches.length
    };
  });
}

export function enrichFoundItems(
  foundItems: FoundItem[],
  users: User[],
  rooms: Room[],
  floors: Floor[],
  buildings: Building[],
  facilities: Facility[],
  claims: Claim[]
): EnrichedFoundItem[] {
  const enrichedRooms = enrichRooms(rooms, floors, buildings);

  return foundItems.map(item => {
    const reporter = users.find(u => u.id === item.reported_by);
    const room = item.room_id ? enrichedRooms.find(r => r.id === item.room_id) : undefined;
    const facility = item.facility_id ? facilities.find(f => f.id === item.facility_id) : undefined;
    const itemClaims = claims.filter(c => c.found_item_id === item.id);

    return {
      ...item,
      reporter_name: reporter?.name || 'IEC Campus Desk',
      reporter_email: reporter?.email || '',
      reporter_role: reporter?.role || 'staff',
      room_name: room?.room_name,
      building_name: room?.building_name,
      floor_number: room?.floor_number,
      facility_name: facility?.name,
      claims_count: itemClaims.length
    };
  });
}

export function enrichClaims(
  claims: Claim[],
  foundItems: FoundItem[],
  users: User[],
  rooms: Room[],
  facilities: Facility[]
): EnrichedClaim[] {
  return claims.map(claim => {
    const foundItem = foundItems.find(fi => fi.id === claim.found_item_id);
    const claimant = users.find(u => u.id === claim.claimant_id);
    const room = foundItem?.room_id ? rooms.find(r => r.id === foundItem.room_id) : undefined;
    const facility = foundItem?.facility_id ? facilities.find(f => f.id === foundItem.facility_id) : undefined;

    return {
      ...claim,
      found_item_title: foundItem?.title || 'Campus Item',
      found_item_category: foundItem?.category || 'general',
      found_item_image: foundItem?.image_url || undefined,
      claimant_name: claimant?.name || 'IEC Student',
      claimant_email: claimant?.email || '',
      claimant_role: claimant?.role || 'student',
      room_name: room?.room_name,
      facility_name: facility?.name
    };
  });
}

export function enrichItemMatches(
  matches: ItemMatch[],
  lostItems: LostItem[],
  foundItems: FoundItem[],
  rooms: Room[],
  facilities: Facility[]
): EnrichedItemMatch[] {
  return matches.map(match => {
    const lost = lostItems.find(l => l.id === match.lost_item_id);
    const found = foundItems.find(f => f.id === match.found_item_id);

    const lostRoom = lost?.room_id ? rooms.find(r => r.id === lost.room_id) : undefined;
    const lostFac = lost?.facility_id ? facilities.find(f => f.id === lost.facility_id) : undefined;
    const foundRoom = found?.room_id ? rooms.find(r => r.id === found.room_id) : undefined;
    const foundFac = found?.facility_id ? facilities.find(f => f.id === found.facility_id) : undefined;

    return {
      ...match,
      lost_item: lost,
      found_item: found,
      lost_title: lost?.title || 'Unknown Lost Item',
      found_title: found?.title || 'Unknown Found Item',
      lost_category: lost?.category || undefined,
      found_category: found?.category || undefined,
      lost_location: lostRoom?.room_name || lostFac?.name || 'Campus Grounds',
      found_location: foundRoom?.room_name || foundFac?.name || 'Campus Desk'
    };
  });
}
