import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Tag, 
  ArrowRight, 
  Layers, 
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { Claim, LostFoundItem, User } from '../types';

interface MatchingEngineViewProps {
  claims: Claim[];
  lostFoundItems: LostFoundItem[];
  user: User | null;
  onReviewClaim: (claimId: string, status: 'approved' | 'rejected' | 'handed_over', notes?: string) => void;
  selectedLostItemId?: string | null;
}

export const MatchingEngineView: React.FC<MatchingEngineViewProps> = ({
  claims,
  lostFoundItems,
  user,
  onReviewClaim,
  selectedLostItemId
}) => {
  const [activeLostItemId, setActiveLostItemId] = useState<string>(
    selectedLostItemId || (lostFoundItems.find(i => i.type === 'lost')?.id || '')
  );

  const lostItems = lostFoundItems.filter(i => i.type === 'lost');
  const foundItems = lostFoundItems.filter(i => i.type === 'found' && i.status !== 'returned');

  const currentLost = lostItems.find(i => i.id === activeLostItemId);

  // Compute matches for the active lost item
  const computedMatches = currentLost
    ? foundItems.map(found => {
        let score = 0;
        const reasons: string[] = [];

        // Category match
        if (currentLost.category && found.category && currentLost.category === found.category) {
          score += 40;
          reasons.push(`Exact category match: ${currentLost.category.replace('_', ' ').toUpperCase()}`);
        }

        // Keywords in title/description
        const lostKeywords = ((currentLost.title || '') + ' ' + (currentLost.description || '')).toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const foundKeywords = ((found.title || '') + ' ' + (found.description || '')).toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const common = lostKeywords.filter(w => foundKeywords.includes(w));
        if (common.length > 0) {
          score += Math.min(30, common.length * 10);
          reasons.push(`Shared identifiers: ${Array.from(new Set(common)).slice(0, 3).join(', ')}`);
        }

        // Location proximity
        if (currentLost.location?.buildingId && found.location?.buildingId && currentLost.location.buildingId === found.location.buildingId) {
          score += 15;
          reasons.push(`Same building location: ${currentLost.location.buildingName || 'Campus Building'}`);
          if (currentLost.location?.floor !== undefined && currentLost.location?.floor === found.location?.floor) {
            score += 10;
            reasons.push(`Same floor tier (Floor ${currentLost.location.floor})`);
          }
        }

        return {
          foundItem: found,
          confidenceScore: Math.min(96, score),
          reasons
        };
      }).filter(m => m.confidenceScore >= 25).sort((a, b) => b.confidenceScore - a.confidenceScore)
    : [];

  return (
    <motion.div 
      id="matching-engine-container" 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Cross-Item Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          Claims & Smart Matching Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Automated correlation between reported lost possessions and turned-in campus property
        </p>
      </div>

      {/* Matching Matrix Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Select Lost Item */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            <span>Select Lost Report</span>
            <span className="text-xs text-slate-500 font-semibold">{lostItems.length} active</span>
          </h3>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {lostItems.map(item => {
              const isSelected = item.id === activeLostItemId;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveLostItemId(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-red-500 shadow-md ring-1 ring-red-500'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">{item.title}</span>
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                      LOST
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">{item.location.buildingName} • Room {item.location.roomNumber}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right 2 cols: Real-Time Correlated Matches with animated reveal */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          {currentLost ? (
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Target Query</span>
                  <h4 className="text-base font-bold text-slate-100">{currentLost.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{currentLost.location.buildingName} • Reported by {currentLost.reportedBy.name}</p>
                </div>
                <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold rounded-xl shrink-0">
                  {computedMatches.length} Candidate Matches
                </div>
              </motion.div>

              {/* Matches List */}
              <div className="space-y-4">
                {computedMatches.length > 0 ? (
                  computedMatches.map((m, idx) => (
                    <motion.div
                      key={m.foundItem.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.foundItem.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                                FOUND ITEM #{idx + 1}
                              </span>
                              <span className="text-xs text-slate-400">Turned in by {m.foundItem.reportedBy.name}</span>
                            </div>
                            <h5 className="text-sm font-bold text-slate-100 mt-0.5">{m.foundItem.title}</h5>
                          </div>
                        </div>

                        {/* Match Confidence Score with Animated Ring */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-xs font-semibold text-slate-400">Match Probability</div>
                            <div className="text-lg font-black text-red-400">{m.confidenceScore}%</div>
                          </div>
                          <motion.div 
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 rounded-full border-4 border-red-500/20 border-t-red-500 flex items-center justify-center font-bold text-xs text-slate-100 shadow-md shadow-red-500/10"
                          >
                            {m.confidenceScore}
                          </motion.div>
                        </div>
                      </div>

                      {/* Explainable reasons */}
                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs space-y-1">
                        <div className="font-semibold text-slate-400 text-[11px]">Matching Evidence:</div>
                        {m.reasons.map((r, ri) => (
                          <div key={ri} className="text-slate-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
                    No high-confidence found matches recorded yet for this item. Check back as new campus items are logged.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a lost report on the left to analyze matching correlations.
            </div>
          )}
        </div>
      </div>

      {/* Claims Triage & Verification Workflow */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Official Ownership Claims & Verification Queue</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review claimant statements and issue campus handover authorizations
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">
            {claims.length} Claims Logged
          </span>
        </div>

        <div className="space-y-4">
          {claims.map(claim => (
            <motion.div
              key={claim.id}
              whileHover={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
              className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    claim.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : claim.status === 'handed_over'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : claim.status === 'rejected'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {claim.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">Claim for: <strong className="text-slate-200">{claim.itemTitle}</strong></span>
                </div>

                <div className="text-xs text-slate-300">
                  Claimant: <strong className="text-slate-100">{claim.claimantName}</strong> ({claim.claimantEmail}) • Phone: {claim.claimantPhone}
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <strong className="text-red-400">Provided Ownership Proof:</strong> {claim.proofDescription}
                </div>

                {claim.reviewNotes && (
                  <div className="text-[11px] text-emerald-400">
                    Reviewer Note: {claim.reviewNotes} ({claim.reviewedBy})
                  </div>
                )}
              </div>

              {/* Action Controls for Admin or Finder */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {claim.status === 'pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onReviewClaim(claim.id, 'approved', 'Ownership credentials verified successfully.')}
                      className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Claim</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onReviewClaim(claim.id, 'rejected', 'Proof did not match item serial/stickers.')}
                      className="py-2 px-3 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </motion.button>
                  </>
                )}

                {claim.status === 'approved' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReviewClaim(claim.id, 'handed_over', 'Item physically handed over to student at Admin Desk.')}
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Handover</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
