import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlusCircle,
  Building2,
  Layers,
  DoorOpen,
  Zap,
  UserCheck,
  Search,
  Package,
  Link2,
  ShieldCheck,
  X,
  Sparkles,
  Check,
  AlertCircle,
  QrCode,
  MapPin,
  Clock,
  FileSpreadsheet,
  UploadCloud,
  Download,
  Copy,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
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
  UserRole,
  LostItemStatus,
  FoundItemStatus,
  MatchStatus,
  ClaimStatus
} from '../types';
import { DatabaseState, generateUUID, calculateItemMatch } from '../data/databaseStore';

export type EntityType = 
  | 'room' 
  | 'building' 
  | 'floor' 
  | 'facility' 
  | 'campus' 
  | 'user' 
  | 'lost_item' 
  | 'found_item' 
  | 'item_match' 
  | 'claim';

interface AddInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbState?: DatabaseState;
  campuses?: Campus[];
  buildings?: Building[];
  floors?: Floor[];
  rooms?: Room[];
  facilities?: Facility[];
  users?: User[];
  lostItems?: LostItem[];
  foundItems?: FoundItem[];
  itemMatches?: ItemMatch[];
  claims?: Claim[];
  onAddCampus: (campus: Campus) => void;
  onAddBuilding: (building: Building) => void;
  onAddFloor: (floor: Floor) => void;
  onAddRoom: (room: Room) => void;
  onAddFacility: (facility: Facility) => void;
  onAddUser: (user: User) => void;
  onAddLostItem: (item: LostItem) => void;
  onAddFoundItem: (item: FoundItem) => void;
  onAddItemMatch: (match: ItemMatch) => void;
  onAddClaim: (claim: Claim) => void;
  onBulkImport: (tableName: EntityType, records: any[]) => void;
  defaultEntity?: EntityType;
  initialEntityType?: EntityType;
}

export const AddInformationModal: React.FC<AddInformationModalProps> = ({
  isOpen,
  onClose,
  dbState,
  campuses,
  buildings,
  floors,
  rooms,
  facilities,
  users,
  lostItems,
  foundItems,
  itemMatches,
  claims,
  onAddCampus,
  onAddBuilding,
  onAddFloor,
  onAddRoom,
  onAddFacility,
  onAddUser,
  onAddLostItem,
  onAddFoundItem,
  onAddItemMatch,
  onAddClaim,
  onBulkImport,
  defaultEntity,
  initialEntityType
}) => {
  const safeDbState: DatabaseState = dbState || {
    campuses: campuses || [],
    buildings: buildings || [],
    floors: floors || [],
    rooms: rooms || [],
    facilities: facilities || [],
    users: users || [],
    lost_items: lostItems || [],
    found_items: foundItems || [],
    item_matches: itemMatches || [],
    claims: claims || []
  };

  const initialTab = defaultEntity || initialEntityType || 'room';
  const [activeEntity, setActiveEntity] = useState<EntityType>(initialTab);
  const [activeTabMode, setActiveTabMode] = useState<'form' | 'importer'>('form');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States for all 10 schema models
  // 1. Campus Form
  const [campusName, setCampusName] = useState('');
  const [campusAddress, setCampusAddress] = useState('');
  const [campusLat, setCampusLat] = useState('28.4728');
  const [campusLng, setCampusLng] = useState('77.4893');

  // 2. Building Form
  const [buildingCampusId, setBuildingCampusId] = useState(safeDbState.campuses?.[0]?.id || '');
  const [buildingName, setBuildingName] = useState('');
  const [buildingType, setBuildingType] = useState('Academic & Research Block');
  const [buildingDescription, setBuildingDescription] = useState('');
  const [buildingLat, setBuildingLat] = useState('28.4735');
  const [buildingLng, setBuildingLng] = useState('77.4899');
  const [buildingCode, setBuildingCode] = useState('');

  // 3. Floor Form
  const [floorBuildingId, setFloorBuildingId] = useState(safeDbState.buildings?.[0]?.id || '');
  const [floorNumber, setFloorNumber] = useState('1');
  const [floorName, setFloorName] = useState('');

  // 4. Room Form
  const [roomBuildingId, setRoomBuildingId] = useState(safeDbState.buildings?.[0]?.id || '');
  const [roomFloorId, setRoomFloorId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('lab');
  const [roomDepartment, setRoomDepartment] = useState('Computer Science & Engineering');
  const [roomSide, setRoomSide] = useState('East Wing');
  const [roomDescription, setRoomDescription] = useState('');

  // 5. Facility Form
  const [facilityCampusId, setFacilityCampusId] = useState(safeDbState.campuses?.[0]?.id || '');
  const [facilityBuildingId, setFacilityBuildingId] = useState(safeDbState.buildings?.[0]?.id || '');
  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState('Laboratory & Research');
  const [facilityDescription, setFacilityDescription] = useState('');
  const [facilityLat, setFacilityLat] = useState('28.4730');
  const [facilityLng, setFacilityLng] = useState('77.4895');

  // 6. User Form
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userDepartment, setUserDepartment] = useState('Computer Science & Engineering');
  const [userCourse, setUserCourse] = useState('B.Tech CSE');
  const [userYear, setUserYear] = useState('3');

  // 7. Lost Item Form
  const [lostReportedBy, setLostReportedBy] = useState(safeDbState.users?.[0]?.id || '');
  const [lostTitle, setLostTitle] = useState('');
  const [lostDescription, setLostDescription] = useState('');
  const [lostCategory, setLostCategory] = useState('electronics');
  const [lostImageUrl, setLostImageUrl] = useState('https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80');
  const [lostLocationType, setLostLocationType] = useState<'room' | 'facility'>('room');
  const [lostRoomId, setLostRoomId] = useState(safeDbState.rooms?.[0]?.id || '');
  const [lostFacilityId, setLostFacilityId] = useState(safeDbState.facilities?.[0]?.id || '');
  const [lostAt, setLostAt] = useState(new Date().toISOString().slice(0, 16));
  const [lostStatus, setLostStatus] = useState<LostItemStatus>('active');

  // 8. Found Item Form
  const [foundReportedBy, setFoundReportedBy] = useState(safeDbState.users?.[0]?.id || '');
  const [foundTitle, setFoundTitle] = useState('');
  const [foundDescription, setFoundDescription] = useState('');
  const [foundCategory, setFoundCategory] = useState('electronics');
  const [foundImageUrl, setFoundImageUrl] = useState('https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80');
  const [foundLocationType, setFoundLocationType] = useState<'room' | 'facility'>('room');
  const [foundRoomId, setFoundRoomId] = useState(safeDbState.rooms?.[0]?.id || '');
  const [foundFacilityId, setFoundFacilityId] = useState(safeDbState.facilities?.[0]?.id || '');
  const [foundAt, setFoundAt] = useState(new Date().toISOString().slice(0, 16));
  const [foundStatus, setFoundStatus] = useState<FoundItemStatus>('available');

  // 9. Item Match Form
  const [matchLostId, setMatchLostId] = useState(safeDbState.lost_items?.[0]?.id || '');
  const [matchFoundId, setMatchFoundId] = useState(safeDbState.found_items?.[0]?.id || '');
  const [matchConfidence, setMatchConfidence] = useState('85');
  const [matchReason, setMatchReason] = useState('Matching category, building location, and matching keyword description');
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('pending');

  // 10. Claim Form
  const [claimFoundId, setClaimFoundId] = useState(safeDbState.found_items?.[0]?.id || '');
  const [claimClaimantId, setClaimClaimantId] = useState(safeDbState.users?.[0]?.id || '');
  const [claimVerificationCode, setClaimVerificationCode] = useState('IEC-VERIFY-' + Math.floor(1000 + Math.random() * 9000));
  const [claimQrToken, setClaimQrToken] = useState('qr_token_' + Math.random().toString(36).substring(2, 10));
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('pending');

  // Raw Importer State
  const [rawJsonText, setRawJsonText] = useState('');

  // Update room floors when building changes
  const availableFloorsForBuilding = (safeDbState.floors || []).filter(f => f.building_id === roomBuildingId);

  const notifySuccess = (msg: string) => {
    setSuccessNotice(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // Submit Handler
  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (activeEntity === 'campus') {
        if (!campusName.trim()) throw new Error('Campus Name is required');
        const newCampus: Campus = {
          id: generateUUID(),
          name: campusName.trim(),
          address: campusAddress.trim() || null,
          latitude: campusLat ? parseFloat(campusLat) : null,
          longitude: campusLng ? parseFloat(campusLng) : null,
          created_at: new Date().toISOString()
        };
        onAddCampus(newCampus);
        notifySuccess(`Campus "${newCampus.name}" added successfully!`);
        setCampusName('');
        setCampusAddress('');
      } else if (activeEntity === 'building') {
        if (!buildingName.trim()) throw new Error('Building Name is required');
        if (!buildingCampusId) throw new Error('Campus is required');
        const newBuilding: Building = {
          id: generateUUID(),
          campus_id: buildingCampusId,
          name: buildingName.trim(),
          building_type: buildingType.trim() || null,
          description: buildingDescription.trim() || null,
          latitude: buildingLat ? parseFloat(buildingLat) : null,
          longitude: buildingLng ? parseFloat(buildingLng) : null,
          created_at: new Date().toISOString(),
          code: buildingCode.trim() || buildingName.slice(0, 8),
          colorTheme: '#EF4444',
          iconName: 'Building2'
        };
        onAddBuilding(newBuilding);
        notifySuccess(`Building "${newBuilding.name}" added to campus!`);
        setBuildingName('');
        setBuildingDescription('');
      } else if (activeEntity === 'floor') {
        if (!floorBuildingId) throw new Error('Building is required');
        if (!floorName.trim()) throw new Error('Floor Name is required');
        const newFloor: Floor = {
          id: generateUUID(),
          building_id: floorBuildingId,
          floor_number: parseInt(floorNumber, 10) || 0,
          name: floorName.trim(),
          created_at: new Date().toISOString()
        };
        onAddFloor(newFloor);
        notifySuccess(`Floor "${newFloor.name}" created for building!`);
        setFloorName('');
      } else if (activeEntity === 'room') {
        const floorIdToUse = roomFloorId || availableFloorsForBuilding[0]?.id;
        if (!floorIdToUse) throw new Error('Please select or create a floor for this building first');
        if (!roomName.trim()) throw new Error('Room Name is required');
        const newRoom: Room = {
          id: generateUUID(),
          floor_id: floorIdToUse,
          room_name: roomName.trim(),
          room_type: roomType || null,
          department: roomDepartment || null,
          side: roomSide || null,
          description: roomDescription.trim() || null,
          created_at: new Date().toISOString()
        };
        onAddRoom(newRoom);
        notifySuccess(`Room "${newRoom.room_name}" added to directory!`);
        setRoomName('');
        setRoomDescription('');
      } else if (activeEntity === 'facility') {
        if (!facilityName.trim()) throw new Error('Facility Name is required');
        if (!facilityCampusId) throw new Error('Campus is required');
        const newFacility: Facility = {
          id: generateUUID(),
          campus_id: facilityCampusId,
          building_id: facilityBuildingId || null,
          name: facilityName.trim(),
          facility_type: facilityType || null,
          description: facilityDescription.trim() || null,
          latitude: facilityLat ? parseFloat(facilityLat) : null,
          longitude: facilityLng ? parseFloat(facilityLng) : null,
          created_at: new Date().toISOString()
        };
        onAddFacility(newFacility);
        notifySuccess(`Facility "${newFacility.name}" created!`);
        setFacilityName('');
        setFacilityDescription('');
      } else if (activeEntity === 'user') {
        if (!userName.trim()) throw new Error('User Name is required');
        if (!userEmail.trim()) throw new Error('User Email is required');
        const newUser: User = {
          id: generateUUID(),
          name: userName.trim(),
          email: userEmail.trim().toLowerCase(),
          role: userRole,
          department: userDepartment || null,
          course: userCourse || null,
          year: userYear ? parseInt(userYear, 10) : null,
          created_at: new Date().toISOString()
        };
        onAddUser(newUser);
        notifySuccess(`User "${newUser.name}" (${newUser.role}) added!`);
        setUserName('');
        setUserEmail('');
      } else if (activeEntity === 'lost_item') {
        if (!lostTitle.trim()) throw new Error('Item Title is required');
        if (!lostReportedBy) throw new Error('Reporter User is required');
        const newLost: LostItem = {
          id: generateUUID(),
          reported_by: lostReportedBy,
          title: lostTitle.trim(),
          description: lostDescription.trim() || null,
          category: lostCategory || null,
          image_url: lostImageUrl.trim() || null,
          room_id: lostLocationType === 'room' ? lostRoomId || null : null,
          facility_id: lostLocationType === 'facility' ? lostFacilityId || null : null,
          lost_at: lostAt ? new Date(lostAt).toISOString() : new Date().toISOString(),
          status: lostStatus,
          created_at: new Date().toISOString()
        };
        onAddLostItem(newLost);
        notifySuccess(`Lost item "${newLost.title}" registered in database!`);
        setLostTitle('');
        setLostDescription('');
      } else if (activeEntity === 'found_item') {
        if (!foundTitle.trim()) throw new Error('Item Title is required');
        if (!foundReportedBy) throw new Error('Reporter User is required');
        const newFound: FoundItem = {
          id: generateUUID(),
          reported_by: foundReportedBy,
          title: foundTitle.trim(),
          description: foundDescription.trim() || null,
          category: foundCategory || null,
          image_url: foundImageUrl.trim() || null,
          room_id: foundLocationType === 'room' ? foundRoomId || null : null,
          facility_id: foundLocationType === 'facility' ? foundFacilityId || null : null,
          found_at: foundAt ? new Date(foundAt).toISOString() : new Date().toISOString(),
          status: foundStatus,
          created_at: new Date().toISOString()
        };
        onAddFoundItem(newFound);
        notifySuccess(`Found item "${newFound.title}" logged in database!`);
        setFoundTitle('');
        setFoundDescription('');
      } else if (activeEntity === 'item_match') {
        if (!matchLostId) throw new Error('Lost Item selection is required');
        if (!matchFoundId) throw new Error('Found Item selection is required');
        const score = parseFloat(matchConfidence);
        if (isNaN(score) || score < 0 || score > 100) throw new Error('Confidence Score must be between 0 and 100');
        const newMatch: ItemMatch = {
          id: generateUUID(),
          lost_item_id: matchLostId,
          found_item_id: matchFoundId,
          confidence_score: score,
          reason: matchReason.trim() || null,
          status: matchStatus,
          created_at: new Date().toISOString()
        };
        onAddItemMatch(newMatch);
        notifySuccess(`Item match created with ${newMatch.confidence_score}% confidence!`);
      } else if (activeEntity === 'claim') {
        if (!claimFoundId) throw new Error('Found Item is required');
        if (!claimClaimantId) throw new Error('Claimant User is required');
        const newClaim: Claim = {
          id: generateUUID(),
          found_item_id: claimFoundId,
          claimant_id: claimClaimantId,
          status: claimStatus,
          verification_code: claimVerificationCode.trim() || null,
          qr_token: claimQrToken.trim() || null,
          created_at: new Date().toISOString(),
          verified_at: claimStatus === 'approved' || claimStatus === 'completed' ? new Date().toISOString() : null
        };
        onAddClaim(newClaim);
        notifySuccess(`Claim submitted with QR Token "${newClaim.qr_token}"!`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Validation error');
    }
  };

  // Sample data autofill helper
  const handleAutoFillSample = () => {
    if (activeEntity === 'room') {
      setRoomName('E-208 Edge AI & Drone Telemetry Studio');
      setRoomType('lab');
      setRoomDepartment('Artificial Intelligence & Machine Learning');
      setRoomSide('South Wing');
      setRoomDescription('Equipped with edge inference benches, Jetson Orin boards, and dual 4K monitors.');
    } else if (activeEntity === 'building') {
      setBuildingName('Block G - Entrepreneurship & Incubation Hub');
      setBuildingType('Innovation Tower');
      setBuildingDescription('Co-working workstations, startup incubation units, and venture meeting rooms.');
      setBuildingCode('Block G');
    } else if (activeEntity === 'lost_item') {
      setLostTitle('Logitech MX Master 3S Wireless Mouse (Space Grey)');
      setLostDescription('Left on computer desk #12 after the Computer Vision lab. Has small silver IEC label.');
      setLostCategory('electronics');
    } else if (activeEntity === 'found_item') {
      setFoundTitle('Fastrack Smartwatch with Black Silicone Strap');
      setFoundDescription('Found near the library study table #08. Charged at 40%.');
      setFoundCategory('electronics');
    } else if (activeEntity === 'user') {
      setUserName('Priyanka Sharma');
      setUserEmail(`priyanka.sharma${Math.floor(100 + Math.random() * 900)}@iec.edu.in`);
      setUserRole('student');
      setUserDepartment('Artificial Intelligence & Machine Learning');
      setUserCourse('B.Tech AI/ML');
      setUserYear('2');
    }
  };

  // Auto calculate match score for match form
  const handleAutoScoreMatch = () => {
    const lost = (safeDbState.lost_items || []).find(l => l.id === matchLostId);
    const found = (safeDbState.found_items || []).find(f => f.id === matchFoundId);
    if (lost && found) {
      const calc = calculateItemMatch(lost, found, safeDbState);
      setMatchConfidence(calc.score.toString());
      setMatchReason(calc.reason);
    }
  };

  // Entity List Navigation Tabs
  const entityTabs: { id: EntityType; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    { id: 'room', label: 'Rooms', icon: DoorOpen, count: (safeDbState.rooms || []).length },
    { id: 'building', label: 'Buildings', icon: Building2, count: (safeDbState.buildings || []).length },
    { id: 'floor', label: 'Floors', icon: Layers, count: (safeDbState.floors || []).length },
    { id: 'facility', label: 'Facilities', icon: Zap, count: (safeDbState.facilities || []).length },
    { id: 'campus', label: 'Campuses', icon: MapPin, count: (safeDbState.campuses || []).length },
    { id: 'user', label: 'Users', icon: UserCheck, count: (safeDbState.users || []).length },
    { id: 'lost_item', label: 'Lost Items', icon: Search, count: (safeDbState.lost_items || []).length },
    { id: 'found_item', label: 'Found Items', icon: Package, count: (safeDbState.found_items || []).length },
    { id: 'item_match', label: 'Matches', icon: Link2, count: (safeDbState.item_matches || []).length },
    { id: 'claim', label: 'Claims', icon: ShieldCheck, count: (safeDbState.claims || []).length }
  ];

  // Bulk Importer / Exporter
  const handleExportJson = () => {
    const dataToExport = safeDbState[activeEntity === 'campus' ? 'campuses' :
      activeEntity === 'building' ? 'buildings' :
      activeEntity === 'floor' ? 'floors' :
      activeEntity === 'room' ? 'rooms' :
      activeEntity === 'facility' ? 'facilities' :
      activeEntity === 'user' ? 'users' :
      activeEntity === 'lost_item' ? 'lost_items' :
      activeEntity === 'found_item' ? 'found_items' :
      activeEntity === 'item_match' ? 'item_matches' : 'claims'] || [];

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iec_${activeEntity}_table_${Date.now()}.json`;
    a.click();
  };

  const handleParseAndImportJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      onBulkImport(activeEntity, list);
      notifySuccess(`Imported ${list.length} records into "${activeEntity}" table!`);
      setRawJsonText('');
    } catch (e: any) {
      setErrorMessage(`JSON Parse Error: ${e.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="add-information-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        id="add-information-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-lg shadow-red-600/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                  Add Information to Campus System
                </h2>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-md uppercase">
                  Schema v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Register rooms, infrastructure, users, lost/found items, matches & claims directly into the database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillSample}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Fill Sample</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Entity Tabs Navigation Ribbon */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {entityTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeEntity === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveEntity(tab.id);
                  setErrorMessage(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>+ Add {tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-red-900/60 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Success & Error Banners */}
        {successNotice && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-200 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successNotice}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-950/80 border border-red-600/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-200 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* View Switcher: Interactive Form vs Bulk Importer */}
        <div className="px-6 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTabMode('form')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                activeTabMode === 'form' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Form
            </button>
            <button
              onClick={() => setActiveTabMode('importer')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                activeTabMode === 'importer' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Bulk JSON / Schema Importer</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Table: <span className="text-slate-300 font-bold">{activeEntity}s</span>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTabMode === 'importer' ? (
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Bulk Importer & Exporter for `{activeEntity}`</h3>
                  <p className="text-xs text-slate-400">Paste an array of objects matching the PostgreSQL schema definition.</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-red-400" />
                  <span>Export Table JSON</span>
                </button>
              </div>

              <textarea
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                placeholder={`[\n  {\n    "name": "Sample",\n    ...\n  }\n]`}
                rows={8}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500 placeholder-slate-600"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleParseAndImportJson}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Execute Bulk Insert</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateRecord} className="space-y-5">
              {/* ---------------- 1. CAMPUS FORM ---------------- */}
              {activeEntity === 'campus' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Campus Name *</label>
                    <input
                      type="text"
                      required
                      value={campusName}
                      onChange={(e) => setCampusName(e.target.value)}
                      placeholder="e.g. IEC Main Campus, Knowledge Park III"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Address</label>
                    <input
                      type="text"
                      value={campusAddress}
                      onChange={(e) => setCampusAddress(e.target.value)}
                      placeholder="Plot No. 4, Knowledge Park III, Greater Noida, UP"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={campusLat}
                        onChange={(e) => setCampusLat(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={campusLng}
                        onChange={(e) => setCampusLng(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 2. BUILDING FORM ---------------- */}
              {activeEntity === 'building' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Parent Campus *</label>
                      <select
                        value={buildingCampusId}
                        onChange={(e) => setBuildingCampusId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.campuses || []).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Building Code / Short Name</label>
                      <input
                        type="text"
                        value={buildingCode}
                        onChange={(e) => setBuildingCode(e.target.value)}
                        placeholder="e.g. Block E"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Building Full Name *</label>
                    <input
                      type="text"
                      required
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      placeholder="e.g. Block E - Centre of Excellence in AI & Computing"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Building Type</label>
                      <input
                        type="text"
                        value={buildingType}
                        onChange={(e) => setBuildingType(e.target.value)}
                        placeholder="Academic & Research Tower"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={buildingLat}
                          onChange={(e) => setBuildingLat(e.target.value)}
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={buildingLng}
                          onChange={(e) => setBuildingLng(e.target.value)}
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Description</label>
                    <textarea
                      value={buildingDescription}
                      onChange={(e) => setBuildingDescription(e.target.value)}
                      placeholder="Specialized labs, NVIDIA GPU racks, departments housed..."
                      rows={3}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* ---------------- 3. FLOOR FORM ---------------- */}
              {activeEntity === 'floor' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Target Building *</label>
                      <select
                        value={floorBuildingId}
                        onChange={(e) => setFloorBuildingId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.buildings || []).map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Floor Number (Integer) *</label>
                      <input
                        type="number"
                        required
                        value={floorNumber}
                        onChange={(e) => setFloorNumber(e.target.value)}
                        placeholder="0 for Ground, 1, 2, 3..."
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Floor Display Name *</label>
                    <input
                      type="text"
                      required
                      value={floorName}
                      onChange={(e) => setFloorName(e.target.value)}
                      placeholder="e.g. 2nd Floor - NVIDIA AI & Deep Learning Research Lab"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* ---------------- 4. ROOM FORM ---------------- */}
              {activeEntity === 'room' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Building *</label>
                      <select
                        value={roomBuildingId}
                        onChange={(e) => {
                          setRoomBuildingId(e.target.value);
                          const floors = (safeDbState.floors || []).filter(f => f.building_id === e.target.value);
                          if (floors.length > 0) setRoomFloorId(floors[0].id);
                        }}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.buildings || []).map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Floor Level *</label>
                      <select
                        value={roomFloorId || (availableFloorsForBuilding[0]?.id || '')}
                        onChange={(e) => setRoomFloorId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {availableFloorsForBuilding.map(f => (
                          <option key={f.id} value={f.id}>Floor {f.floor_number} - {f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Room Name & Code *</label>
                    <input
                      type="text"
                      required
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="e.g. E-204 NVIDIA AI & Deep Learning Research Lab"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Room Type</label>
                      <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="lab">Research Laboratory</option>
                        <option value="lecture_hall">Lecture Theatre</option>
                        <option value="admin_office">Administrative Office</option>
                        <option value="seminar_hall">Seminar / Pitch Hall</option>
                        <option value="library">Library / Study Pod</option>
                        <option value="cafeteria">Cafeteria / Dining</option>
                        <option value="auditorium">Grand Auditorium</option>
                        <option value="amenity">Healthcare Clinic / Amenity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Department</label>
                      <input
                        type="text"
                        value={roomDepartment}
                        onChange={(e) => setRoomDepartment(e.target.value)}
                        placeholder="e.g. Computer Science & Engineering"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Wing / Side</label>
                      <input
                        type="text"
                        value={roomSide}
                        onChange={(e) => setRoomSide(e.target.value)}
                        placeholder="e.g. East Wing / 2nd Floor"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Description & Equipment</label>
                    <textarea
                      value={roomDescription}
                      onChange={(e) => setRoomDescription(e.target.value)}
                      placeholder="Workstations, server racks, projector, capacity, lab in-charge..."
                      rows={3}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* ---------------- 5. FACILITY FORM ---------------- */}
              {activeEntity === 'facility' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Campus *</label>
                      <select
                        value={facilityCampusId}
                        onChange={(e) => setFacilityCampusId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.campuses || []).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Associated Building (Optional)</label>
                      <select
                        value={facilityBuildingId}
                        onChange={(e) => setFacilityBuildingId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="">None (Open Campus Facility)</option>
                        {(safeDbState.buildings || []).map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Facility Name *</label>
                    <input
                      type="text"
                      required
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="e.g. NVIDIA DGX A100 High-Performance Computing Cluster"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Facility Type</label>
                      <input
                        type="text"
                        value={facilityType}
                        onChange={(e) => setFacilityType(e.target.value)}
                        placeholder="Research Computing Supercluster"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={facilityLat}
                          onChange={(e) => setFacilityLat(e.target.value)}
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={facilityLng}
                          onChange={(e) => setFacilityLng(e.target.value)}
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Description</label>
                    <textarea
                      value={facilityDescription}
                      onChange={(e) => setFacilityDescription(e.target.value)}
                      placeholder="Specifications, services offered, access hours..."
                      rows={3}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* ---------------- 6. USER FORM ---------------- */}
              {activeEntity === 'user' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Institutional Email *</label>
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="e.g. aarav.sharma@iec.edu.in"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Role (Schema Constraint)</label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value as UserRole)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Department</label>
                      <input
                        type="text"
                        value={userDepartment}
                        onChange={(e) => setUserDepartment(e.target.value)}
                        placeholder="Computer Science & Engineering"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Course & Year</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={userCourse}
                          onChange={(e) => setUserCourse(e.target.value)}
                          placeholder="B.Tech"
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="number"
                          value={userYear}
                          onChange={(e) => setUserYear(e.target.value)}
                          placeholder="Year 1-4"
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 7. LOST ITEM FORM ---------------- */}
              {activeEntity === 'lost_item' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Reported By User *</label>
                      <select
                        value={lostReportedBy}
                        onChange={(e) => setLostReportedBy(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.users || []).map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.role}) - {u.email}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Item Title *</label>
                      <input
                        type="text"
                        required
                        value={lostTitle}
                        onChange={(e) => setLostTitle(e.target.value)}
                        placeholder="e.g. Casio fx-991EX Classwiz Scientific Calculator"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Category</label>
                      <select
                        value={lostCategory}
                        onChange={(e) => setLostCategory(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="electronics">Electronics & Gadgets</option>
                        <option value="wallet_keys">Wallet, IDs & Keys</option>
                        <option value="clothing_bags">Bags & Clothing</option>
                        <option value="documents_books">Books & Notes</option>
                        <option value="accessories">Accessories</option>
                        <option value="lab_equipment">Lab Equipment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Location Anchor</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setLostLocationType('room')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                            lostLocationType === 'room' ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Room
                        </button>
                        <button
                          type="button"
                          onClick={() => setLostLocationType('facility')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                            lostLocationType === 'facility' ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Facility
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                        {lostLocationType === 'room' ? 'Select Room' : 'Select Facility'}
                      </label>
                      {lostLocationType === 'room' ? (
                        <select
                          value={lostRoomId}
                          onChange={(e) => setLostRoomId(e.target.value)}
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                        >
                          {(safeDbState.rooms || []).map(r => (
                            <option key={r.id} value={r.id}>{r.room_name}</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={lostFacilityId}
                          onChange={(e) => setLostFacilityId(e.target.value)}
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                        >
                          {(safeDbState.facilities || []).map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Lost Timestamp</label>
                      <input
                        type="datetime-local"
                        value={lostAt}
                        onChange={(e) => setLostAt(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Status</label>
                      <select
                        value={lostStatus}
                        onChange={(e) => setLostStatus(e.target.value as LostItemStatus)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="active">Active (Open)</option>
                        <option value="matched">Matched</option>
                        <option value="claimed">Claimed</option>
                        <option value="resolved">Resolved</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Description & Identifiers</label>
                    <textarea
                      value={lostDescription}
                      onChange={(e) => setLostDescription(e.target.value)}
                      placeholder="Color, unique stickers, serial numbers, case markings..."
                      rows={3}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* ---------------- 8. FOUND ITEM FORM ---------------- */}
              {activeEntity === 'found_item' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Finder User *</label>
                      <select
                        value={foundReportedBy}
                        onChange={(e) => setFoundReportedBy(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.users || []).map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.role}) - {u.email}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Found Item Title *</label>
                      <input
                        type="text"
                        required
                        value={foundTitle}
                        onChange={(e) => setFoundTitle(e.target.value)}
                        placeholder="e.g. Scientific Calculator (Casio Scientific Model)"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Category</label>
                      <select
                        value={foundCategory}
                        onChange={(e) => setFoundCategory(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="electronics">Electronics & Gadgets</option>
                        <option value="wallet_keys">Wallet, IDs & Keys</option>
                        <option value="clothing_bags">Bags & Clothing</option>
                        <option value="documents_books">Books & Notes</option>
                        <option value="accessories">Accessories</option>
                        <option value="lab_equipment">Lab Equipment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Location Anchor</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFoundLocationType('room')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                            foundLocationType === 'room' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Room
                        </button>
                        <button
                          type="button"
                          onClick={() => setFoundLocationType('facility')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                            foundLocationType === 'facility' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Facility
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                        {foundLocationType === 'room' ? 'Found in Room' : 'Found in Facility'}
                      </label>
                      {foundLocationType === 'room' ? (
                        <select
                          value={foundRoomId}
                          onChange={(e) => setFoundRoomId(e.target.value)}
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                        >
                          {(safeDbState.rooms || []).map(r => (
                            <option key={r.id} value={r.id}>{r.room_name}</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={foundFacilityId}
                          onChange={(e) => setFoundFacilityId(e.target.value)}
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                        >
                          {(safeDbState.facilities || []).map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Found Timestamp</label>
                      <input
                        type="datetime-local"
                        value={foundAt}
                        onChange={(e) => setFoundAt(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Status</label>
                      <select
                        value={foundStatus}
                        onChange={(e) => setFoundStatus(e.target.value as FoundItemStatus)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="available">Available (Waiting for Claim)</option>
                        <option value="matched">Matched</option>
                        <option value="claimed">Claimed</option>
                        <option value="returned">Returned to Owner</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Found Condition & Safeguard Notes</label>
                    <textarea
                      value={foundDescription}
                      onChange={(e) => setFoundDescription(e.target.value)}
                      placeholder="Condition, deposited at admin office, safe custody notes..."
                      rows={3}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* ---------------- 9. ITEM MATCH FORM ---------------- */}
              {activeEntity === 'item_match' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Lost Item *</label>
                      <select
                        value={matchLostId}
                        onChange={(e) => setMatchLostId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.lost_items || []).map(l => (
                          <option key={l.id} value={l.id}>{l.title} ({l.status})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Found Item *</label>
                      <select
                        value={matchFoundId}
                        onChange={(e) => setMatchFoundId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.found_items || []).map(f => (
                          <option key={f.id} value={f.id}>{f.title} ({f.status})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">Auto AI Match Analysis</div>
                      <div className="text-[11px] text-slate-400">Compute confidence score based on category, token overlap & timestamps</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoScoreMatch}
                      className="px-3 py-1.5 bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-red-400" />
                      <span>Compute Match</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                        Confidence Score: <span className="text-red-400 font-mono">{matchConfidence}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={matchConfidence}
                        onChange={(e) => setMatchConfidence(e.target.value)}
                        className="w-full accent-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Status</label>
                      <select
                        value={matchStatus}
                        onChange={(e) => setMatchStatus(e.target.value as MatchStatus)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved Match</option>
                        <option value="rejected">Rejected Match</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Reason & Match Notes</label>
                    <textarea
                      value={matchReason}
                      onChange={(e) => setMatchReason(e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* ---------------- 10. CLAIM FORM ---------------- */}
              {activeEntity === 'claim' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Found Item to Claim *</label>
                      <select
                        value={claimFoundId}
                        onChange={(e) => setClaimFoundId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.found_items || []).map(f => (
                          <option key={f.id} value={f.id}>{f.title} ({f.status})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Claimant User *</label>
                      <select
                        value={claimClaimantId}
                        onChange={(e) => setClaimClaimantId(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                      >
                        {(safeDbState.users || []).map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Verification Code</label>
                        <button
                          type="button"
                          onClick={() => setClaimVerificationCode('IEC-VERIFY-' + Math.floor(1000 + Math.random() * 9000))}
                          className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Auto
                        </button>
                      </div>
                      <input
                        type="text"
                        value={claimVerificationCode}
                        onChange={(e) => setClaimVerificationCode(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">QR Token (Unique)</label>
                        <button
                          type="button"
                          onClick={() => setClaimQrToken('qr_token_' + Math.random().toString(36).substring(2, 10))}
                          className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> Auto
                        </button>
                      </div>
                      <input
                        type="text"
                        value={claimQrToken}
                        onChange={(e) => setClaimQrToken(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Claim Status</label>
                    <select
                      value={claimStatus}
                      onChange={(e) => setClaimStatus(e.target.value as ClaimStatus)}
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    >
                      <option value="pending">Pending Approval</option>
                      <option value="approved">Approved (Ready for Handover)</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed (Handed Over)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit & Action Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Save {entityTabs.find(t => t.id === activeEntity)?.label.slice(0, -1) || 'Record'} to Website</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
