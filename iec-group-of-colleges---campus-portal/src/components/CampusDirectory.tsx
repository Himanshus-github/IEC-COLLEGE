import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Layers, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Info,
  Cpu,
  FlaskConical,
  Wrench,
  BookOpen,
  Coffee,
  Home,
  PlusCircle
} from 'lucide-react';
import { BUILDINGS as DEFAULT_BUILDINGS, ROOMS as DEFAULT_ROOMS } from '../data/campusData';
import { Building, Room } from '../types';

interface CampusDirectoryProps {
  onSelectBuilding?: (buildingId: string) => void;
  onNavigateToMap?: (buildingId: string) => void;
  onOpenAddRoom?: () => void;
  customRooms?: Room[];
  customBuildings?: Building[];
}

export const CampusDirectory: React.FC<CampusDirectoryProps> = ({
  onSelectBuilding,
  onNavigateToMap,
  onOpenAddRoom,
  customRooms,
  customBuildings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  const buildingsToUse = customBuildings && customBuildings.length > 0 ? customBuildings : DEFAULT_BUILDINGS;
  const roomsToUse = customRooms && customRooms.length > 0 ? customRooms : DEFAULT_ROOMS;

  const iconMap: Record<string, any> = {
    Cpu,
    Building2,
    FlaskConical,
    Wrench,
    BookOpen,
    Coffee,
    Home
  };

  const departments = [
    'all',
    'Computer Science & Engineering',
    'Artificial Intelligence & Machine Learning',
    'Applied Sciences & Humanities',
    'Mechanical Engineering',
    'Civil Engineering',
    'Admissions',
    'Administration',
    'Library & Information Sciences',
    'Student Welfare'
  ];

  // Filtered rooms with dual schema resilience (supports room_name or name, roomNumber, etc.)
  const filteredRooms = roomsToUse.filter(r => {
    const rName = (r as any).room_name || r.name || '';
    const rNumber = r.roomNumber || (rName.split(' ')[0]) || '';
    const rDept = r.department || '';
    const rDesc = (r as any).description || '';
    const rEquip = r.equipment ? r.equipment.join(' ') : '';
    const q = (searchQuery || '').toLowerCase().trim();

    const matchesSearch = !q ||
      rName.toLowerCase().includes(q) ||
      rNumber.toLowerCase().includes(q) ||
      rDept.toLowerCase().includes(q) ||
      rDesc.toLowerCase().includes(q) ||
      rEquip.toLowerCase().includes(q);

    const matchesBuilding = !selectedBuildingId || selectedBuildingId === 'all' || 
      r.buildingId === selectedBuildingId || 
      (r as any).building_id === selectedBuildingId;

    const matchesDept = !selectedDepartment || selectedDepartment === 'all' || rDept.toLowerCase() === (selectedDepartment || '').toLowerCase();

    return matchesSearch && matchesBuilding && matchesDept;
  });

  return (
    <div id="campus-directory-container" className="space-y-8 animate-fade-in">
      {/* Directory Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Campus Infrastructure Directory
            </h2>
            <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg">
              {roomsToUse.length} Rooms Indexed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse all academic blocks, specialised laboratories, lecture halls, and offices
          </p>
        </div>

        {/* Action Controls: Add Room Button & Search Bar */}
        <div className="flex items-center gap-3">
          {onOpenAddRoom && (
            <button
              onClick={onOpenAddRoom}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Room / Block</span>
            </button>
          )}

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room (e.g. E-204, Library, CNC)..."
              className="w-full py-2.5 pl-10 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Buildings Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildingsToUse.map((building) => {
          const Icon = iconMap[building.iconName || 'Building2'] || Building2;
          const isSelected = selectedBuildingId === building.id;
          const bName = building.name || '';
          const bCode = building.code || bName.split(' - ')[0] || 'Block';
          const bDesc = (building as any).description || building.shortDescription || '';

          return (
            <div
              key={building.id}
              onClick={() => {
                setSelectedBuildingId(isSelected ? 'all' : building.id);
                if (onSelectBuilding) onSelectBuilding(building.id);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-red-500 shadow-xl shadow-red-950/30 ring-1 ring-red-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {building.isBlockE && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold rounded-full uppercase">
                  Flagship Hub
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: `${building.colorTheme || '#EF4444'}15`, color: building.colorTheme || '#EF4444' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {bCode}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">
                      {bName.split('(')[0]}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {bDesc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-md text-[10px] font-medium">
                    {building.building_type || 'Academic Tower'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {building.headOffice || 'Admin Point'}
                </span>
                <span className="text-xs font-semibold text-red-400 flex items-center gap-0.5">
                  <span>{isSelected ? 'Viewing Rooms' : 'Filter Rooms'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Department Filter:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="py-1.5 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing <strong className="text-slate-200">{filteredRooms.length}</strong> rooms & facilities
        </div>
      </div>

      {/* Rooms Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const rName = (room as any).room_name || room.name || 'Room';
          const rNumber = room.roomNumber || rName.split(' ')[0];
          const rBuilding = room.buildingName || (room as any).building_name || 'Academic Block';
          const rFloor = room.floor || (room as any).floor_number || 1;
          const rDept = room.department || 'Academic Department';
          const rDesc = (room as any).description || '';
          const rStatus = room.status || 'available';

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all cursor-pointer group hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold rounded">
                      {rNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 mt-1.5 group-hover:text-red-400 transition-colors">
                      {rName}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                    rStatus === 'available'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {rStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  {rBuilding} • Floor {rFloor} • <strong className="text-slate-300">{rDept}</strong>
                </p>

                {rDesc && (
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {rDesc}
                  </p>
                )}

                {/* Equipment preview */}
                {room.equipment && room.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {room.equipment.slice(0, 2).map((eq: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-md text-[10px]"
                      >
                        {eq}
                      </span>
                    ))}
                    {room.equipment.length > 2 && (
                      <span className="px-2 py-0.5 bg-slate-950 text-slate-500 text-[10px]">
                        +{room.equipment.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate max-w-[180px]">{room.inCharge || (room as any).side || 'IEC Faculty Desk'}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedRoom(null)}>
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono font-bold rounded-lg">
                  {selectedRoom.roomNumber || selectedRoom.name?.split(' ')[0] || (selectedRoom as any).room_name?.split(' ')[0] || 'Room'}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-2">{selectedRoom.name || (selectedRoom as any).room_name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRoom.buildingName || (selectedRoom as any).building_name || 'Block E'} • Floor {selectedRoom.floor || (selectedRoom as any).floor_number || 1}
                </p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-2">
                <div>Department: <strong className="text-slate-100">{selectedRoom.department || 'Engineering'}</strong></div>
                <div>Wing / Side: <strong className="text-slate-100">{(selectedRoom as any).side || 'Central Core'}</strong></div>
                <div>Room Type: <strong className="text-slate-100 capitalize">{selectedRoom.type || (selectedRoom as any).room_type || 'Lab'}</strong></div>
                <div>Status: <strong className="text-emerald-400 capitalize">{selectedRoom.status || 'Available'}</strong></div>
              </div>

              {(selectedRoom as any).description && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-semibold text-slate-400 mb-1">Room Description & Features:</div>
                  <p className="text-slate-200 text-xs leading-relaxed">{(selectedRoom as any).description}</p>
                </div>
              )}

              {selectedRoom.equipment && selectedRoom.equipment.length > 0 && (
                <div>
                  <div className="font-semibold text-slate-400 mb-1.5">Installed Equipment & Software:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRoom.equipment.map((eq: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-slate-400 mb-0.5">Faculty / Lab In-Charge:</div>
                <div className="text-slate-200 font-bold">{selectedRoom.inCharge || 'IEC Department Head'}</div>
                <div className="text-red-400 text-[11px]">{selectedRoom.inChargeContact || 'dean.tech@iec.edu.in'}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedRoom(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
