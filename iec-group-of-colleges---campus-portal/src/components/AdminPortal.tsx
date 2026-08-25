import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Search, 
  Bell, 
  Layers, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Download, 
  Database,
  Lock,
  Sparkles,
  BarChart3,
  Server
} from 'lucide-react';
import { User, LostFoundItem, Claim, Notice } from '../types';
import { PlusCircle } from 'lucide-react';

interface AdminPortalProps {
  user: User | null;
  lostFoundItems: LostFoundItem[];
  claims: Claim[];
  notices: Notice[];
  onReviewClaim: (claimId: string, status: 'approved' | 'rejected' | 'handed_over', notes?: string) => void;
  onOpenPublishNotice: () => void;
  onRunDiagnostics: () => void;
  onOpenAddInfo?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  user,
  lostFoundItems,
  claims,
  notices,
  onReviewClaim,
  onOpenPublishNotice,
  onRunDiagnostics,
  onOpenAddInfo
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'items' | 'notices'>('overview');

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div id="admin-forbidden-view" className="p-8 sm:p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 animate-fade-in max-w-xl mx-auto my-12">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">Restricted Administrative Portal</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Access to campus moderation, claim resolutions, and broadcast publishing requires administrative authorization. Please sign in with an Administrator profile.
        </p>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
          Demo Admin Credentials: <strong className="text-red-400">admin@iec.edu.in</strong> / <strong className="text-red-400">iecAdmin2026</strong>
        </div>
      </div>
    );
  }

  const pendingClaims = claims.filter(c => c.status === 'pending');
  const approvedClaims = claims.filter(c => c.status === 'approved');
  const lostCount = lostFoundItems.filter(i => i.type === 'lost').length;
  const foundCount = lostFoundItems.filter(i => i.type === 'found').length;

  return (
    <div id="admin-portal-container" className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administration Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            IEC College Management Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Logged in as <strong className="text-slate-200">{user.name}</strong> • System Authority: Level 4 (Registrar & Admin)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAddInfo && (
            <button
              onClick={onOpenAddInfo}
              className="py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Info / Schema</span>
            </button>
          )}
          <button
            onClick={onRunDiagnostics}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Run Diagnostics</span>
          </button>
          <button
            onClick={onOpenPublishNotice}
            className="py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            <span>Broadcast Circular</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pending Claims</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{pendingClaims.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting ownership review</div>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Found Items Logged</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{foundCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">In campus custodial hold</div>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Lost Reports Active</span>
            <span className="p-2 bg-red-500/10 text-red-400 rounded-xl">
              <Search className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 mt-2">{lostCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Student submissions</div>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Live Circulars</span>
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Bell className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">{notices.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Broadcasted across portal</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Claims Review ({pendingClaims.length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`py-2 px-4 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'items'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Inventory ({lostFoundItems.length})
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`py-2 px-4 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'notices'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Notice Board ({notices.length})
        </button>
      </div>

      {/* Tab 1: Claims Review Queue */}
      {activeTab === 'overview' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100">Claims Verification Queue</h3>
          <div className="space-y-3">
            {claims.map(claim => (
              <div
                key={claim.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      claim.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : claim.status === 'handed_over'
                        ? 'bg-blue-500/20 text-blue-300'
                        : claim.status === 'rejected'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {claim.status}
                    </span>
                    <strong className="text-xs text-slate-100">{claim.itemTitle}</strong>
                  </div>
                  <div className="text-xs text-slate-300">
                    Claimant: {claim.claimantName} ({claim.claimantEmail}) • Phone: {claim.claimantPhone}
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl text-xs text-slate-300">
                    Proof: {claim.proofDescription}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {claim.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onReviewClaim(claim.id, 'approved', 'Admin authorized claim based on proof.')}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReviewClaim(claim.id, 'rejected', 'Verification failed.')}
                        className="py-1.5 px-3 bg-slate-800 text-red-400 hover:bg-red-950/40 text-xs font-semibold rounded-xl border border-slate-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {claim.status === 'approved' && (
                    <button
                      onClick={() => onReviewClaim(claim.id, 'handed_over', 'Item released at main reception desk.')}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
                    >
                      Confirm Physical Handover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Inventory */}
      {activeTab === 'items' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100">All Registered Items</h3>
          <div className="space-y-3">
            {lostFoundItems.map(item => (
              <div
                key={item.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.type === 'lost' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {item.type}
                    </span>
                    <h5 className="text-xs font-bold text-slate-100">{item.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.location.buildingName} (Room {item.location.roomNumber}) • Reported by {item.reportedBy.name}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono capitalize">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Notices */}
      {activeTab === 'notices' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Campus Notices Archive</h3>
            <button
              onClick={onOpenPublishNotice}
              className="py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
            >
              + New Circular
            </button>
          </div>

          <div className="space-y-3">
            {notices.map(notice => (
              <div
                key={notice.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-100">{notice.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{notice.department} • Audience: {notice.targetAudience}</p>
                </div>
                <span className="text-[11px] text-red-400 font-bold uppercase">{notice.priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
