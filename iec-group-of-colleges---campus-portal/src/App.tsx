import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MeniscusNav, NavTabId } from './components/MeniscusNav';
import { OverviewHero } from './components/OverviewHero';
import { BlockESpotlight } from './components/BlockESpotlight';
import { CampusDirectory } from './components/CampusDirectory';
import { InteractiveCampusMap } from './components/InteractiveCampusMap';
import { LostFoundHub } from './components/LostFoundHub';
import { MatchingEngineView } from './components/MatchingEngineView';
import { NoticesHub } from './components/NoticesHub';
import { AdminPortal } from './components/AdminPortal';
import { AiAssistant } from './components/AiAssistant';
import { AuthModal } from './components/AuthModal';
import { OtpDemoModal } from './components/OtpDemoModal';
import { DiagnosticsRunnerModal } from './components/DiagnosticsRunnerModal';
import { CommandPalette } from './components/CommandPalette';
import { AddInformationModal, EntityType } from './components/AddInformationModal';
import { TeachersDirectory } from './components/TeachersDirectory';

import { 
  User, 
  LostFoundItem, 
  Claim, 
  Notice, 
  Campus, 
  Building, 
  Floor, 
  Room, 
  Facility, 
  LostItem, 
  FoundItem, 
  ItemMatch,
  Teacher
} from './types';
import { 
  DatabaseState, 
  loadInitialDatabase, 
  saveDatabaseToStorage, 
  enrichRooms, 
  enrichBuildings, 
  enrichLostItems, 
  enrichFoundItems,
  calculateItemMatch
} from './data/databaseStore';
import { INITIAL_NOTICES } from './data/noticesData';
import { INITIAL_LOST_FOUND_ITEMS, INITIAL_CLAIMS } from './data/lostFoundData';
import { loadTeachers, saveTeachers, INITIAL_TEACHERS } from './data/teachersData';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTabId>('home');

  // Relational Database State (10 Supabase/Postgres tables synced in-memory and in localStorage)
  const [dbState, setDbState] = useState<DatabaseState>(() => loadInitialDatabase());

  // Teachers State (Persisted in localStorage with default IEC faculty roster)
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadTeachers());

  // User Auth State (Initialized with demo student by default for immediate exploration)
  const [user, setUser] = useState<User | null>({
    id: 'usr_student_01',
    email: 'student@iec.edu.in',
    name: 'Aarav Sharma',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: '220010010024',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  });

  // Data States
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(INITIAL_LOST_FOUND_ITEMS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);

  // Modals & Panels
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOtpDemoOpen, setIsOtpDemoOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAddInfoOpen, setIsAddInfoOpen] = useState(false);
  const [addInfoDefaultEntity, setAddInfoDefaultEntity] = useState<EntityType>('room');
  
  const [selectedMatchingItemId, setSelectedMatchingItemId] = useState<string | null>(null);
  const [aiDraftPrompt, setAiDraftPrompt] = useState<string>('');

  // Selected map building
  const [selectedMapBuildingId, setSelectedMapBuildingId] = useState<string>('block-e');

  // Toast banner for feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize dbState with persistence whenever it changes
  useEffect(() => {
    saveDatabaseToStorage(dbState);
  }, [dbState]);

  // Synchronize teachers with persistence whenever it changes
  useEffect(() => {
    saveTeachers(teachers);
  }, [teachers]);

  // Teacher Management CRUD Handlers
  const handleAddTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `TR-${Math.floor(100 + Math.random() * 900)}`
    };
    setTeachers(prev => [newTeacher, ...prev]);
    showToast(`Added ${newTeacher.name} to Faculty Directory!`);
  };

  const handleUpdateTeacher = (id: string, updatedData: { name: string; teachingSubject: string; department: string }) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...updatedData };
      }
      return t;
    }));
    showToast(`Updated details for faculty member.`);
  };

  const handleDeleteTeacher = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast(`Removed ${teacher?.name || 'Teacher'} from directory.`);
  };

  const handleResetTeachers = () => {
    setTeachers(INITIAL_TEACHERS);
    showToast('Reset faculty roster to default IEC staff list.');
  };

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key || '').toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ----------------------------------------------------
  // Relational Database CRUD & "Add Information" Handlers
  // ----------------------------------------------------
  const handleOpenAddInfo = (entity: EntityType = 'room') => {
    setAddInfoDefaultEntity(entity);
    setIsAddInfoOpen(true);
  };

  const handleAddCampus = (campus: Campus) => {
    setDbState(prev => ({
      ...prev,
      campuses: [campus, ...prev.campuses]
    }));
    showToast(`Campus "${campus.name}" registered successfully!`);
    syncRecordWithBackend('campus', campus);
  };

  const handleAddBuilding = (building: Building) => {
    setDbState(prev => ({
      ...prev,
      buildings: [building, ...prev.buildings]
    }));
    showToast(`Building "${building.name}" added to campus directory!`);
    syncRecordWithBackend('building', building);
  };

  const handleAddFloor = (floor: Floor) => {
    setDbState(prev => ({
      ...prev,
      floors: [floor, ...prev.floors]
    }));
    showToast(`Floor ${floor.floor_number} added successfully!`);
    syncRecordWithBackend('floor', floor);
  };

  const handleAddRoom = (room: Room) => {
    setDbState(prev => ({
      ...prev,
      rooms: [room, ...prev.rooms]
    }));
    showToast(`Room "${room.room_name || room.name}" indexed in directory!`);
    syncRecordWithBackend('room', room);
  };

  const handleAddFacility = (facility: Facility) => {
    setDbState(prev => ({
      ...prev,
      facilities: [facility, ...prev.facilities]
    }));
    showToast(`Facility "${facility.name}" added!`);
    syncRecordWithBackend('facility', facility);
  };

  const handleAddUser = (newUser: User) => {
    setDbState(prev => ({
      ...prev,
      users: [newUser, ...prev.users]
    }));
    showToast(`User profile created for "${newUser.name}"!`);
    syncRecordWithBackend('user', newUser);
  };

  const handleAddLostItem = (item: LostItem) => {
    setDbState(prev => {
      const nextLost = [item, ...prev.lost_items];
      // Auto match against existing found items
      const newMatches: ItemMatch[] = [];
      prev.found_items.forEach(found => {
        const match = calculateItemMatch(item, found);
        if (match.confidence_score >= 30) {
          newMatches.push(match);
        }
      });
      return {
        ...prev,
        lost_items: nextLost,
        item_matches: [...newMatches, ...prev.item_matches]
      };
    });

    // Also sync with UI LostFound state
    const flatItem: LostFoundItem = {
      id: item.id,
      type: 'lost',
      title: item.title,
      category: item.category as any,
      description: item.description,
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
      location: {
        campusId: 'campus_01',
        buildingId: 'bld_05_block_e',
        buildingName: 'Block E',
        floor: 2,
        roomNumber: 'E-204',
        roomName: 'NVIDIA AI Lab',
        landmark: 'Campus Area'
      },
      nearestLandmark: 'Block E Core',
      uniqueIdentifiers: item.unique_identifiers || '',
      dateReported: item.date_lost,
      status: 'open',
      reportedBy: {
        userId: user?.id || 'guest',
        name: user?.name || 'IEC Student',
        email: user?.email || 'student@iec.edu.in',
        role: user?.role || 'student'
      },
      contactPrivacy: 'via_admin'
    };
    setLostFoundItems(prev => [flatItem, ...prev]);

    showToast(`Lost item report for "${item.title}" created with auto-matching!`);
    syncRecordWithBackend('lost_item', item);
  };

  const handleAddFoundItem = (item: FoundItem) => {
    setDbState(prev => {
      const nextFound = [item, ...prev.found_items];
      const newMatches: ItemMatch[] = [];
      prev.lost_items.forEach(lost => {
        const match = calculateItemMatch(lost, item);
        if (match.confidence_score >= 30) {
          newMatches.push(match);
        }
      });
      return {
        ...prev,
        found_items: nextFound,
        item_matches: [...newMatches, ...prev.item_matches]
      };
    });

    const flatItem: LostFoundItem = {
      id: item.id,
      type: 'found',
      title: item.title,
      category: item.category as any,
      description: item.description,
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
      location: {
        campusId: 'campus_01',
        buildingId: 'bld_05_block_e',
        buildingName: 'Block E',
        floor: 2,
        roomNumber: 'E-204',
        roomName: 'NVIDIA AI Lab',
        landmark: 'Campus Area'
      },
      nearestLandmark: item.storage_location || 'Admin Custody',
      uniqueIdentifiers: item.unique_identifiers || '',
      dateReported: item.date_found,
      status: 'open',
      reportedBy: {
        userId: user?.id || 'guest',
        name: user?.name || 'IEC Security',
        email: user?.email || 'security@iec.edu.in',
        role: user?.role || 'admin'
      },
      contactPrivacy: 'via_admin'
    };
    setLostFoundItems(prev => [flatItem, ...prev]);

    showToast(`Found item "${item.title}" logged in custody!`);
    syncRecordWithBackend('found_item', item);
  };

  const handleAddItemMatch = (match: ItemMatch) => {
    setDbState(prev => ({
      ...prev,
      item_matches: [match, ...prev.item_matches]
    }));
    showToast(`Match link registered (${match.confidence_score}% confidence)!`);
    syncRecordWithBackend('item_match', match);
  };

  const handleAddClaim = (claim: Claim) => {
    setDbState(prev => ({
      ...prev,
      claims: [claim, ...prev.claims]
    }));
    setClaims(prev => [claim, ...prev]);
    showToast(`Claim logged for verification.`);
    syncRecordWithBackend('claim', claim);
  };

  const handleBulkImport = (entityType: EntityType, records: any[]) => {
    setDbState(prev => {
      const next = { ...prev };
      if (entityType === 'campus') next.campuses = [...records, ...prev.campuses];
      else if (entityType === 'building') next.buildings = [...records, ...prev.buildings];
      else if (entityType === 'floor') next.floors = [...records, ...prev.floors];
      else if (entityType === 'room') next.rooms = [...records, ...prev.rooms];
      else if (entityType === 'facility') next.facilities = [...records, ...prev.facilities];
      else if (entityType === 'user') next.users = [...records, ...prev.users];
      else if (entityType === 'lost_item') next.lost_items = [...records, ...prev.lost_items];
      else if (entityType === 'found_item') next.found_items = [...records, ...prev.found_items];
      else if (entityType === 'item_match') next.item_matches = [...records, ...prev.item_matches];
      else if (entityType === 'claim') next.claims = [...records, ...prev.claims];
      return next;
    });

    showToast(`Successfully imported ${records.length} records into ${entityType.toUpperCase()} table!`);
    
    // Sync bulk with backend
    fetch('/api/data/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, records })
    }).catch(err => console.warn('Bulk sync to backend deferred', err));
  };

  const syncRecordWithBackend = async (entityType: string, record: any) => {
    try {
      await fetch('/api/data/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, record })
      });
    } catch (err) {
      console.warn('Backend sync deferred to local database store', err);
    }
  };

  // Handlers for data actions (Lost/Found, Claims, Notices)
  const handleReportItem = async (newItemData: Partial<LostFoundItem>) => {
    const item: LostFoundItem = {
      id: `item_${Date.now()}`,
      type: newItemData.type || 'lost',
      title: newItemData.title || 'Untitled Item',
      category: newItemData.category || 'electronics',
      description: newItemData.description || '',
      imageUrl: newItemData.imageUrl || 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80',
      location: newItemData.location || {
        campusId: 'campus_01',
        buildingId: 'bld_05_block_e',
        buildingName: 'Block E (Centre of Excellence in AI & Computing)',
        floor: 2,
        roomNumber: 'E-204',
        roomName: 'NVIDIA AI Lab',
        landmark: 'Near GPU rack 2'
      },
      nearestLandmark: newItemData.nearestLandmark || 'Block E 2nd Floor',
      uniqueIdentifiers: newItemData.uniqueIdentifiers || '',
      dateReported: new Date().toISOString().split('T')[0],
      status: 'open',
      reportedBy: {
        userId: user?.id || 'guest',
        name: user?.name || 'Anonymous Student',
        email: user?.email || 'student@iec.edu.in',
        role: user?.role || 'student'
      },
      contactPrivacy: 'via_admin'
    };

    setLostFoundItems(prev => [item, ...prev]);
    showToast(`Successfully registered ${item.type.toUpperCase()} report: "${item.title}"`);

    // Sync with backend API
    try {
      await fetch('/api/lost-found/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch (err) {
      console.warn('Backend sync deferred to local state', err);
    }
  };

  const handleSubmitClaim = async (itemId: string, proof: string, answer: string) => {
    const targetItem = lostFoundItems.find(i => i.id === itemId);
    const newClaim: Claim = {
      id: `clm_${Date.now()}`,
      itemId,
      itemTitle: targetItem?.title || 'Campus Item',
      claimantId: user?.id || 'guest',
      claimantName: user?.name || 'Anonymous Claimant',
      claimantEmail: user?.email || 'student@iec.edu.in',
      claimantPhone: '+91 98712 34567',
      proofDescription: proof,
      securityAnswers: { verificationClue: answer },
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setClaims(prev => [newClaim, ...prev]);
    showToast(`Claim submitted for "${newClaim.itemTitle}". Awaiting Admin Review.`);

    try {
      await fetch('/api/claims/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClaim)
      });
    } catch (err) {
      console.warn('Backend sync deferred', err);
    }
  };

  const handleReviewClaim = async (claimId: string, status: 'approved' | 'rejected' | 'handed_over', notes?: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status,
          reviewNotes: notes || '',
          reviewedBy: user?.name || 'Campus Administrator',
          reviewedAt: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));

    if (status === 'handed_over') {
      const claim = claims.find(c => c.id === claimId);
      if (claim) {
        setLostFoundItems(prev => prev.map(i => {
          if (i.id === claim.itemId) {
            return { ...i, status: 'returned' };
          }
          return i;
        }));
      }
    }

    showToast(`Claim status updated to ${status.toUpperCase().replace('_', ' ')}`);

    try {
      await fetch(`/api/claims/${claimId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes: notes, reviewedBy: user?.name })
      });
    } catch (err) {
      console.warn('Backend sync deferred', err);
    }
  };

  const handlePublishNotice = async (noticeData: Partial<Notice>) => {
    const notice: Notice = {
      id: `not_${Date.now()}`,
      title: noticeData.title || 'Official Circular',
      category: noticeData.category || 'academic',
      priority: noticeData.priority || 'normal',
      content: noticeData.content || '',
      publishDate: new Date().toISOString().split('T')[0],
      isPinned: noticeData.isPinned || false,
      author: {
        id: user?.id || 'adm_01',
        name: user?.name || 'Registrar Office',
        role: 'admin'
      },
      department: noticeData.department || 'Administration & Examination Cell',
      targetAudience: noticeData.targetAudience || 'All Students & Faculty'
    };

    setNotices(prev => [notice, ...prev]);
    showToast(`Notice broadcasted: "${notice.title}"`);

    try {
      await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice)
      });
    } catch (err) {
      console.warn('Backend sync deferred', err);
    }
  };

  const handleOpenAiDraft = (promptText: string) => {
    setAiDraftPrompt(promptText);
    setActiveTab('ai-assistant');
  };

  const handleSelectMatchingFromLost = (lostItemId: string) => {
    setSelectedMatchingItemId(lostItemId);
    setActiveTab('claims');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white pb-20 md:pb-8">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 border border-red-500/50 rounded-2xl shadow-2xl text-xs text-slate-100 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar with Add Info Action */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          setUser(null);
          showToast('Signed out of IEC Campus Portal');
        }}
        onOpenOtpDemo={() => setIsOtpDemoOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenAiAssistant={() => setActiveTab('ai-assistant')}
        onOpenAddInfo={() => handleOpenAddInfo('room')}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Meniscus Fluid Navigation Bar */}
      <MeniscusNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={user?.role === 'admin'}
        claimsCount={claims.filter(c => c.status === 'pending').length}
        noticesCount={notices.length}
        teachersCount={teachers.length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <OverviewHero
            user={user}
            notices={notices}
            lostFoundItems={lostFoundItems}
            onNavigateTab={setActiveTab}
            onOpenOtpDemo={() => setIsOtpDemoOpen(true)}
            onOpenAiAssistant={() => setActiveTab('ai-assistant')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'directory' && (
          <CampusDirectory
            customRooms={dbState.rooms}
            customBuildings={dbState.buildings}
            onOpenAddRoom={() => handleOpenAddInfo('room')}
            onSelectBuilding={(bId) => {
              setSelectedMapBuildingId(bId);
            }}
            onNavigateToMap={(bId) => {
              setSelectedMapBuildingId(bId);
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersDirectory
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onResetTeachers={handleResetTeachers}
          />
        )}

        {activeTab === 'block-e' && (
          <BlockESpotlight
            onOpenAiDraft={handleOpenAiDraft}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveCampusMap
            preSelectedBuildingId={selectedMapBuildingId}
            teachers={teachers}
            onSelectRoom={(roomId) => {
              showToast(`Navigated to room ${roomId}`);
            }}
          />
        )}

        {activeTab === 'lost-found' && (
          <LostFoundHub
            items={lostFoundItems}
            user={user}
            onReportItem={handleReportItem}
            onSubmitClaim={handleSubmitClaim}
            onSelectMatchingAnalysis={handleSelectMatchingFromLost}
          />
        )}

        {activeTab === 'claims' && (
          <MatchingEngineView
            claims={claims}
            lostFoundItems={lostFoundItems}
            user={user}
            onReviewClaim={handleReviewClaim}
            selectedLostItemId={selectedMatchingItemId}
          />
        )}

        {activeTab === 'notices' && (
          <NoticesHub
            notices={notices}
            user={user}
            onPublishNotice={handlePublishNotice}
            onOpenAiDraft={handleOpenAiDraft}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            user={user}
            lostFoundItems={lostFoundItems}
            claims={claims}
            notices={notices}
            onReviewClaim={handleReviewClaim}
            onOpenPublishNotice={() => setActiveTab('notices')}
            onRunDiagnostics={() => setIsDiagnosticsOpen(true)}
            onOpenAddInfo={() => handleOpenAddInfo('room')}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <div className="max-w-4xl mx-auto">
            <AiAssistant
              user={user}
              initialPrompt={aiDraftPrompt}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="font-bold text-slate-300">IEC Group of Colleges</div>
            <div className="text-[11px] text-slate-400">Plot 4, Knowledge Park III, Greater Noida, UP • AKTU Code 090</div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => handleOpenAddInfo('room')} className="hover:text-red-400 text-red-400/90 font-semibold cursor-pointer">
              + Add Campus Information
            </button>
            <button onClick={() => setIsOtpDemoOpen(true)} className="hover:text-slate-200 underline decoration-dotted">
              OTP V3 Micro-Interaction
            </button>
            <button onClick={() => setIsDiagnosticsOpen(true)} className="hover:text-slate-200 underline decoration-dotted">
              Phase 1-19 Diagnostics Suite
            </button>
            <span>© 2026 IEC Group • All Rights Reserved</span>
          </div>
        </div>
      </footer>

      {/* Global Add Information Modal (Handles 10 Relational Entities + Bulk Importer/Exporter) */}
      <AddInformationModal
        isOpen={isAddInfoOpen}
        onClose={() => setIsAddInfoOpen(false)}
        dbState={dbState}
        defaultEntity={addInfoDefaultEntity}
        campuses={dbState.campuses}
        buildings={dbState.buildings}
        floors={dbState.floors}
        rooms={dbState.rooms}
        facilities={dbState.facilities}
        users={dbState.users}
        lostItems={dbState.lost_items}
        foundItems={dbState.found_items}
        onAddCampus={handleAddCampus}
        onAddBuilding={handleAddBuilding}
        onAddFloor={handleAddFloor}
        onAddRoom={handleAddRoom}
        onAddFacility={handleAddFacility}
        onAddUser={handleAddUser}
        onAddLostItem={handleAddLostItem}
        onAddFoundItem={handleAddFoundItem}
        onAddItemMatch={handleAddItemMatch}
        onAddClaim={handleAddClaim}
        onBulkImport={handleBulkImport}
      />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          showToast(`Welcome back, ${loggedInUser.name}!`);
        }}
      />

      <OtpDemoModal
        isOpen={isOtpDemoOpen}
        onClose={() => setIsOtpDemoOpen(false)}
      />

      <DiagnosticsRunnerModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={setActiveTab}
        onSelectBuilding={(bId) => setSelectedMapBuildingId(bId)}
        onOpenOtpDemo={() => setIsOtpDemoOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenAiAssistant={() => setActiveTab('ai-assistant')}
        onOpenAddInfo={() => handleOpenAddInfo('room')}
        lostFoundItems={lostFoundItems}
        notices={notices}
      />
    </div>
  );
}
export default App;
