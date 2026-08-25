import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Tag, 
  Camera, 
  ChevronRight,
  Eye,
  Lock,
  X
} from 'lucide-react';
import { LostFoundItem, ItemCategory, ItemType, User } from '../types';
import { BUILDINGS, ROOMS } from '../data/campusData';

interface LostFoundHubProps {
  items: LostFoundItem[];
  user: User | null;
  onReportItem: (item: Partial<LostFoundItem>) => void;
  onSubmitClaim: (itemId: string, proof: string, answer: string) => void;
  onSelectMatchingAnalysis?: (lostItemId: string) => void;
}

export const LostFoundHub: React.FC<LostFoundHubProps> = ({
  items,
  user,
  onReportItem,
  onSubmitClaim,
  onSelectMatchingAnalysis,
}) => {
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [claimTargetItem, setClaimTargetItem] = useState<LostFoundItem | null>(null);
  const [claimProof, setClaimProof] = useState('');
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimSubmittedSuccess, setClaimSubmittedSuccess] = useState(false);

  // New Item Form State
  const [reportType, setReportType] = useState<ItemType>('lost');
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<ItemCategory>('electronics');
  const [reportDescription, setReportDescription] = useState('');
  const [reportBuildingId, setReportBuildingId] = useState('block-e');
  const [reportRoomNumber, setReportRoomNumber] = useState('E-204');
  const [reportNearestLandmark, setReportNearestLandmark] = useState('Block E 2nd Floor NVIDIA AI Lab');
  const [reportUniqueIdentifiers, setReportUniqueIdentifiers] = useState('');
  const [reportImageUrl, setReportImageUrl] = useState('');

  const categories: { id: ItemCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'electronics', label: 'Electronics & Calculators' },
    { id: 'id_card', label: 'College ID & Cards' },
    { id: 'wallet_keys', label: 'Wallets & Keys' },
    { id: 'documents_books', label: 'Books & Notes' },
    { id: 'clothing_bags', label: 'Backpacks & Clothing' },
    { id: 'lab_equipment', label: 'Lab Kits & Hardware' },
    { id: 'other', label: 'Other Items' }
  ];

  const filteredItems = items.filter(item => {
    const matchesType = activeTypeTab === 'all' || item.type === activeTypeTab;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q ||
      ((item.title || '')).toLowerCase().includes(q) ||
      ((item.description || '')).toLowerCase().includes(q) ||
      ((item.location?.buildingName || '')).toLowerCase().includes(q) ||
      ((item.location?.roomNumber || '')).toLowerCase().includes(q) ||
      ((item.nearestLandmark || '')).toLowerCase().includes(q);

    return matchesType && matchesCategory && matchesSearch;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    const building = BUILDINGS.find(b => b.id === reportBuildingId) || BUILDINGS[0];
    const room = ROOMS.find(r => r.roomNumber === reportRoomNumber) || ROOMS[0];

    onReportItem({
      type: reportType,
      title: reportTitle,
      category: reportCategory,
      description: reportDescription,
      imageUrl: reportImageUrl || (reportCategory === 'electronics' ? 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'),
      location: {
        campusId: 'greater-noida-main',
        buildingId: building.id,
        buildingName: building.name,
        floor: room.floor,
        roomNumber: room.roomNumber,
        roomName: room.name,
        landmark: reportNearestLandmark
      },
      nearestLandmark: reportNearestLandmark,
      uniqueIdentifiers: reportUniqueIdentifiers,
      contactPrivacy: 'via_admin'
    });

    setIsReportModalOpen(false);
    // Reset
    setReportTitle('');
    setReportDescription('');
    setReportUniqueIdentifiers('');
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTargetItem || !claimProof.trim()) return;

    onSubmitClaim(claimTargetItem.id, claimProof, claimAnswer);
    setClaimSubmittedSuccess(true);
    setTimeout(() => {
      setClaimSubmittedSuccess(false);
      setClaimTargetItem(null);
      setClaimProof('');
      setClaimAnswer('');
    }, 1500);
  };

  return (
    <motion.div 
      id="lost-found-hub-container" 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header & Report Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>AI-Powered Campus Recovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Lost & Found Command Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Report lost possessions, claim found property, and cross-match items across Block E and all campus blocks
          </p>
        </div>

        <motion.button
          id="report-item-button"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsReportModalOpen(true)}
          className="py-3 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-2xl shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Lost or Found Item</span>
        </motion.button>
      </div>

      {/* Type Tabs & Category Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Lost / Found Segment Control with Spring Morph */}
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit relative">
            {(['all', 'lost', 'found'] as const).map(tabKey => {
              const isActive = activeTypeTab === tabKey;
              const label = tabKey === 'all' 
                ? `All Items (${items.length})` 
                : tabKey === 'lost' 
                ? `Lost Reports (${items.filter(i => i.type === 'lost').length})` 
                : `Found Items (${items.filter(i => i.type === 'found').length})`;

              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTypeTab(tabKey)}
                  className={`relative py-2 px-4 text-xs font-bold rounded-xl transition-colors cursor-pointer select-none ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="lost-found-tab-pill"
                      className={`absolute inset-0 rounded-xl shadow-md -z-10 ${
                        tabKey === 'all' ? 'bg-slate-800' : tabKey === 'lost' ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, room, landmark..."
              className="w-full py-2 pl-10 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Items Cards Grid with Stagger & Scale */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => {
              const isLost = item.type === 'lost';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6, borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col justify-between group"
                >
                  {/* Card Image Header */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md ${
                        isLost
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {isLost ? 'LOST' : 'FOUND'}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded-xl text-[10px] font-semibold text-slate-300 backdrop-blur-sm">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        item.status === 'open'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'claimed'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-100 group-hover:text-red-400 transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Location detail */}
                      <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl text-[11px] text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.location.buildingName} • Room {item.location.roomNumber}</span>
                        </div>
                        <div className="text-slate-400 truncate pl-5">
                          {item.nearestLandmark}
                        </div>
                      </div>
                    </div>

                    {/* Footer Timestamps & Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.dateReported}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* If lost item, allow running matching analysis */}
                        {isLost && onSelectMatchingAnalysis && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectMatchingAnalysis(item.id)}
                            className="py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border border-red-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>Match AI</span>
                          </motion.button>
                        )}

                        {/* If found item, allow claiming */}
                        {!isLost && item.status === 'open' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setClaimTargetItem(item)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Claim Item</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl"
            >
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-200">No matching items found</h4>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search keywords or switching category filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Report New Item Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Report Campus Property</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Submit item details to the IEC recovery database</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Type selector */}
              <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportType('lost')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    reportType === 'lost'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('found')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    reportType === 'found'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  I Found Something
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. Casio fx-991EX Scientific Calculator"
                    className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value as ItemCategory)}
                      className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                    >
                      <option value="electronics">Electronics</option>
                      <option value="id_card">College ID Card</option>
                      <option value="wallet_keys">Wallet / Keys</option>
                      <option value="documents_books">Books / Notes</option>
                      <option value="clothing_bags">Backpack / Apparel</option>
                      <option value="lab_equipment">Lab Hardware</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Building Location</label>
                    <select
                      value={reportBuildingId}
                      onChange={(e) => setReportBuildingId(e.target.value)}
                      className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                    >
                      {BUILDINGS.map(b => (
                        <option key={b.id} value={b.id}>{b.code} ({b.name.split('(')[0]})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Room & Specific Landmark</label>
                  <input
                    type="text"
                    value={reportNearestLandmark}
                    onChange={(e) => setReportNearestLandmark(e.target.value)}
                    placeholder="e.g. Block E Floor 2, NVIDIA AI Lab Row 3"
                    className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe color, brand, stickers, condition..."
                    className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Unique Identifiers (Secret verification clue for claims)
                  </label>
                  <input
                    type="text"
                    value={reportUniqueIdentifiers}
                    onChange={(e) => setReportUniqueIdentifiers(e.target.value)}
                    placeholder="e.g. Engraved initials 'AS', sticker on lid, keychain"
                    className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Submit Report to Campus Network
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Claim Submission Modal */}
      <AnimatePresence>
        {claimTargetItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                    FOUND ITEM CLAIM
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">{claimTargetItem.title}</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setClaimTargetItem(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {claimSubmittedSuccess ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-sm font-bold text-emerald-300">Claim Registered</h4>
                  <p className="text-xs text-slate-300">
                    Your verification details have been routed to the administration and finder for review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    To prevent unauthorized retrieval, provide specific proof of ownership (such as serial numbers, screen locks, stickers, or distinguishing marks).
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Proof Description / Specific Identifiers
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={claimProof}
                      onChange={(e) => setClaimProof(e.target.value)}
                      placeholder="e.g. My calculator has an orange IEC CSE sticker on the back sliding lid and initials engraved..."
                      className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Submit Official Claim
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
