import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Building2, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  X,
  UserCheck,
  Sparkles,
  Filter
} from 'lucide-react';
import { Teacher } from '../types';
import { TEACHER_DEPARTMENTS, INITIAL_TEACHERS } from '../data/teachersData';

interface TeachersDirectoryProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (id: string, updatedData: { name: string; teachingSubject: string; department: string }) => void;
  onDeleteTeacher: (id: string) => void;
  onResetTeachers?: () => void;
}

export const TeachersDirectory: React.FC<TeachersDirectoryProps> = ({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onResetTeachers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDepartment, setFormDepartment] = useState('Computer Science & Engineering');
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered teachers list
  const filteredTeachers = teachers.filter(t => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q || 
      (t.name || '').toLowerCase().includes(q) ||
      (t.teachingSubject || '').toLowerCase().includes(q) ||
      (t.department || '').toLowerCase().includes(q);

    const matchesDept = selectedDept === 'All Departments' || t.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  // Calculate unique subjects & departments
  const uniqueSubjectsCount = new Set(teachers.map(t => t.teachingSubject)).size;
  const uniqueDeptsCount = new Set(teachers.map(t => t.department)).size;

  const handleOpenAddModal = () => {
    setFormName('');
    setFormSubject('');
    setFormDepartment(selectedDept !== 'All Departments' ? selectedDept : 'Computer Science & Engineering');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormName(teacher.name);
    setFormSubject(teacher.teachingSubject);
    setFormDepartment(teacher.department);
    setFormError(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Please enter teacher name');
      return;
    }
    if (!formSubject.trim()) {
      setFormError('Please enter teaching subject');
      return;
    }
    if (!formDepartment.trim()) {
      setFormError('Please select or specify department');
      return;
    }

    onAddTeacher({
      name: formName.trim(),
      teachingSubject: formSubject.trim(),
      department: formDepartment.trim(),
      created_at: new Date().toISOString()
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    if (!formName.trim()) {
      setFormError('Please enter teacher name');
      return;
    }
    if (!formSubject.trim()) {
      setFormError('Please enter teaching subject');
      return;
    }
    if (!formDepartment.trim()) {
      setFormError('Please select department');
      return;
    }

    onUpdateTeacher(editingTeacher.id, {
      name: formName.trim(),
      teachingSubject: formSubject.trim(),
      department: formDepartment.trim()
    });

    setEditingTeacher(null);
  };

  const handleConfirmDelete = () => {
    if (deletingTeacher) {
      onDeleteTeacher(deletingTeacher.id);
      setDeletingTeacher(null);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teachers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `iec_faculty_roster_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="teachers-directory-section" className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>IEC Group of Colleges • Faculty & Teachers Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            Faculty Directory & Subject Allocation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, manage, add, update, and remove faculty teaching assignments across engineering, pharmacy, and management departments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Export Teachers as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Roster</span>
          </motion.button>

          {onResetTeachers && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onResetTeachers}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Reset to default IEC Faculty"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Teacher</span>
          </motion.button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Teachers</div>
            <div className="text-2xl font-black text-slate-100 mt-1">{teachers.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Teaching Subjects</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{uniqueSubjectsCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Departments</div>
            <div className="text-2xl font-black text-blue-400 mt-1">{uniqueDeptsCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 backdrop-blur-md shadow-lg">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Teacher Name, Subject (e.g. Algorithms, VLSI, CAD), or Department..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 pr-1 select-none">
            <Filter className="w-3 h-3 text-red-400" />
            <span>Dept:</span>
          </span>
          {TEACHER_DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTeachers.map((teacher, index) => {
            // Department badge color helper
            const isCSE = teacher.department.includes('Computer Science') || teacher.department.includes('Information Tech');
            const isECE = teacher.department.includes('Electronics') || teacher.department.includes('Electrical');
            const isME = teacher.department.includes('Mechanical') || teacher.department.includes('Civil');
            const isPharm = teacher.department.includes('Pharmacy');
            const isMBA = teacher.department.includes('Management') || teacher.department.includes('MBA');

            const colorClass = isCSE ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400' :
              isECE ? 'border-amber-500/20 bg-amber-500/5 text-amber-400' :
              isME ? 'border-orange-500/20 bg-orange-500/5 text-orange-400' :
              isPharm ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' :
              isMBA ? 'border-purple-500/20 bg-purple-500/5 text-purple-400' :
              'border-blue-500/20 bg-blue-500/5 text-blue-400';

            const avatarBg = isCSE ? 'bg-cyan-600' :
              isECE ? 'bg-amber-600' :
              isME ? 'bg-orange-600' :
              isPharm ? 'bg-emerald-600' :
              isMBA ? 'bg-purple-600' :
              'bg-red-600';

            const initials = teacher.name
              .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '')
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'TR';

            return (
              <motion.div
                key={teacher.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                className="bg-slate-900/90 border border-slate-800 hover:border-red-500/40 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Row: Avatar & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-md flex-shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-red-400 transition-colors">
                          {teacher.name}
                        </h3>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${colorClass}`}>
                          {teacher.department}
                        </span>
                      </div>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenEditModal(teacher)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Update Teacher Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeletingTeacher(teacher)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Remove Teacher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Teaching Subject Box */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-red-400" />
                      <span>Teaching Subject</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">
                      {teacher.teachingSubject}
                    </div>
                  </div>
                </div>

                {/* Footer with metadata */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>IEC Faculty Code: <span className="font-mono text-slate-300">{teacher.id}</span></span>
                  <span className="text-emerald-400/90 font-medium">Active Assignment</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredTeachers.length === 0 && (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No teachers found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No faculty match the search query "{searchQuery}" or department filter "{selectedDept}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All Departments');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Add New Teacher</h3>
                    <p className="text-[11px] text-slate-400">Specify Name, Teaching Subject, and Department</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teacher Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Dr. Priya Saxena, Prof. Rahul Verma"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teaching Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Artificial Intelligence & Deep Learning, Compiler Design"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {TEACHER_DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                  >
                    Save Teacher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT / UPDATE TEACHER MODAL */}
      <AnimatePresence>
        {editingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Update Teacher Data</h3>
                    <p className="text-[11px] text-slate-400">Modify teacher name, subject, or department</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingTeacher(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teacher Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Teaching Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {TEACHER_DEPARTMENTS.filter(d => d !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                  >
                    Update Teacher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE MODAL */}
      <AnimatePresence>
        {deletingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-100">Remove Teacher?</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to remove <strong className="text-slate-200">{deletingTeacher.name}</strong> from teaching <strong className="text-red-400">{deletingTeacher.teachingSubject}</strong> in {deletingTeacher.department}?
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeletingTeacher(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
