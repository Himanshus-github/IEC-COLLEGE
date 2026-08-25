import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { RedShirtCharacter } from './RedShirtCharacter';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('student@iec.edu.in');
  const [password, setPassword] = useState('iec2026');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [rollNumber, setRollNumber] = useState('');

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickFill = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'student') {
      setEmail('student@iec.edu.in');
      setPassword('iec2026');
    } else if (targetRole === 'admin') {
      setEmail('admin@iec.edu.in');
      setPassword('iecAdmin2026');
    } else {
      setEmail('faculty@iec.edu.in');
      setPassword('faculty2026');
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegisterMode 
        ? { name, email, password, role, department, rollNumber }
        : { email, password, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(data.user);
        onClose();
        setIsSuccess(false);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to campus authentication server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Interactive Animated Red Shirt Character Mascot */}
        <RedShirtCharacter
          isPasswordFocused={isPasswordFocused}
          isTyping={isTyping}
          isSuccess={isSuccess}
          isError={!!errorMessage}
        />

        {/* Modal Heading */}
        <div className="text-center mt-3 mb-6">
          <h3 className="text-xl font-bold text-slate-100">
            {isRegisterMode ? 'Create Student Account' : 'IEC Campus Portal Sign In'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access Block E, Lost & Found Hub, Claims, Map, and Academic Notices
          </p>
        </div>

        {/* Quick Demo Switcher Tabs */}
        {!isRegisterMode && (
          <div className="flex gap-2 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'student'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'admin'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('faculty')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                role === 'faculty'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo Faculty
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-xs text-red-300 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full py-2.5 pl-10 pr-4 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="220010010024"
                    className="w-full py-2.5 px-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  >
                    <option value="Computer Science & Engineering">CSE & AI</option>
                    <option value="Information Technology">IT</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                    <option value="Civil Engineering">Civil</option>
                    <option value="Biotechnology">Biotech</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">College Email / Username</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@iec.edu.in"
                className="w-full py-2.5 pl-10 pr-4 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field with Eye Mask Shielding effect */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              {!isRegisterMode && (
                <span className="text-[11px] text-red-400 font-medium cursor-pointer hover:underline">
                  Default: iec2026
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 pl-10 pr-4 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Authenticated Successfully!</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>{isRegisterMode ? 'Complete Registration' : 'Authorize & Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Mode Switch Toggle */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegisterMode ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorMessage('');
                }}
                className="text-red-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to IEC Group of Colleges?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorMessage('');
                }}
                className="text-red-400 font-semibold hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
