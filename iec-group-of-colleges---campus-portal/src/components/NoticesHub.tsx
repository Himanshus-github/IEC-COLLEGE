import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Pin, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Download, 
  PlusCircle, 
  Filter, 
  Share2, 
  ChevronRight, 
  Sparkles,
  Users
} from 'lucide-react';
import { Notice, NoticeCategory, NoticePriority, User } from '../types';

interface NoticesHubProps {
  notices: Notice[];
  user: User | null;
  onPublishNotice: (notice: Partial<Notice>) => void;
  onOpenAiDraft?: (prompt: string) => void;
}

export const NoticesHub: React.FC<NoticesHubProps> = ({
  notices,
  user,
  onPublishNotice,
  onOpenAiDraft
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // New notice form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NoticeCategory>('academic');
  const [newPriority, setNewPriority] = useState<NoticePriority>('normal');
  const [newContent, setNewContent] = useState('');
  const [newTargetAudience, setNewTargetAudience] = useState('All Students & Faculty');
  const [newDepartment, setNewDepartment] = useState('CSE & AI Department');

  const categories: { id: NoticeCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Notices' },
    { id: 'urgent', label: 'Urgent Circulars' },
    { id: 'academic', label: 'Academic & Classes' },
    { id: 'exam', label: 'Exams & Schedules' },
    { id: 'placement', label: 'Placements & Internships' },
    { id: 'events', label: 'Events & Hackathons' },
    { id: 'hostel', label: 'Hostel & Mess' }
  ];

  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q ||
      ((n.title || '')).toLowerCase().includes(q) ||
      ((n.content || '')).toLowerCase().includes(q) ||
      ((n.department || '')).toLowerCase().includes(q) ||
      ((n.targetAudience || '')).toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onPublishNotice({
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      content: newContent,
      department: newDepartment,
      targetAudience: newTargetAudience,
      isPinned: newPriority === 'urgent'
    });

    setIsPublishModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div id="notices-hub-container" className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>Official Campus Bulletins</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Academic & Administrative Notices
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time circulars, examination schedules, hackathon invitations, and placement updates
          </p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="py-3 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-2xl shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Campus Circular</span>
          </button>
        )}
      </div>

      {/* Toolbar & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars, hackathons..."
            className="w-full py-2 pl-10 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Notices Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotices.map(notice => {
          const isUrgent = notice.priority === 'urgent';

          return (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isUrgent
                  ? 'bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-red-500/50 hover:border-red-400 shadow-xl shadow-red-950/20'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isPinned && (
                      <span className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
                        <Pin className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isUrgent
                        ? 'bg-red-600 text-white'
                        : notice.priority === 'high'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {notice.priority}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-md text-[10px] capitalize">
                      {notice.category}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{notice.publishDate}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-red-400 transition-colors leading-snug">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>

                {/* Target Audience & Dept */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{notice.department}</span>
                  <span className="text-slate-300 font-medium">{notice.targetAudience}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Issued by: <strong className="text-slate-200">{notice.author.name}</strong>
                </span>
                <span className="text-xs font-semibold text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Notice</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice Detail Reader Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase">
                    {selectedNotice.category}
                  </span>
                  <span className="text-xs text-slate-400">Ref: IEC/NOT/{selectedNotice.id.slice(0, 6).toUpperCase()}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100">{selectedNotice.title}</h2>
                <div className="text-xs text-slate-400 mt-1">
                  Published on {selectedNotice.publishDate} by {selectedNotice.author.name} ({selectedNotice.department})
                </div>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedNotice.content}
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>Target Audience: <strong className="text-slate-200">{selectedNotice.targetAudience}</strong></div>
              <div>Priority: <strong className="text-red-400 capitalize">{selectedNotice.priority}</strong></div>
            </div>

            {/* Quick AI Action: Draft response / query to this notice */}
            {onOpenAiDraft && (
              <div className="p-4 bg-gradient-to-r from-red-950/40 to-slate-950 border border-red-500/30 rounded-2xl flex items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-red-300">Need clarification or exemption?</span>
                  <div className="text-slate-400">Use Campus AI to draft an official email or query to {selectedNotice.department}.</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedNotice(null);
                    onOpenAiDraft(`Draft an official student query regarding notice: "${selectedNotice.title}" addressed to ${selectedNotice.department}`);
                  }}
                  className="py-2 px-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Email</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedNotice(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              Close Circular
            </button>
          </div>
        </div>
      )}

      {/* Publish Notice Modal for Admin */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Publish Campus Notice</h3>
                <p className="text-xs text-slate-400 mt-0.5">Broadcast circular to students, departments, or hostels</p>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Schedule for AKTU End-Semester Practical Examinations 2026"
                  className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NoticeCategory)}
                    className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="academic">Academic</option>
                    <option value="urgent">Urgent</option>
                    <option value="exam">Examinations</option>
                    <option value="placement">Placements</option>
                    <option value="events">Events & Hackathons</option>
                    <option value="hostel">Hostel & Mess</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as NoticePriority)}
                    className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent Circular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newTargetAudience}
                  onChange={(e) => setNewTargetAudience(e.target.value)}
                  placeholder="e.g. B.Tech CSE & IT 2nd & 3rd Year Students"
                  className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notice Body / Content</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detailed guidelines, dates, room numbers, reporting times..."
                  className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                Publish Notice Live
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
