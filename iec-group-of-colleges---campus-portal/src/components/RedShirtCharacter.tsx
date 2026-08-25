import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RedShirtCharacterProps {
  isPasswordFocused?: boolean;
  isTyping?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  reducedMotion?: boolean;
}

export const RedShirtCharacter: React.FC<RedShirtCharacterProps> = ({
  isPasswordFocused = false,
  isTyping = false,
  isSuccess = false,
  isError = false,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // Mouse tracking for pupil movement with smoothing
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Limit pupil displacement to max +-8px
      const dx = Math.max(-8, Math.min(8, (e.clientX - centerX) / 24));
      const dy = Math.max(-6, Math.min(6, (e.clientY - centerY) / 24));
      setMousePos({ x: dx, y: dy });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // Natural periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  const pupilX = isPasswordFocused ? 0 : mousePos.x;
  const pupilY = isPasswordFocused ? 4 : mousePos.y;

  return (
    <div
      ref={containerRef}
      id="red-shirt-avatar-container"
      className="relative flex flex-col items-center justify-center select-none py-2"
    >
      <div className="relative w-44 h-48 flex items-center justify-center">
        {/* Ambient Pulsing Glow behind Character */}
        <motion.div 
          animate={{
            scale: isSuccess ? [1, 1.4, 1.2] : [1, 1.15, 1],
            opacity: isSuccess ? [0.2, 0.4, 0.25] : [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-full blur-2xl -z-10 ${
            isSuccess ? 'bg-emerald-500/30' : isError ? 'bg-red-600/30' : 'bg-red-500/15'
          }`}
        />

        {/* Mascot SVG Character with Spring Physics Transitions */}
        <motion.svg
          viewBox="0 0 200 220"
          className="w-full h-full drop-shadow-2xl"
          animate={{
            rotate: isTyping ? [0, 2.5, -2.5, 0] : isSuccess ? [0, -3, 3, 0] : isError ? [0, -5, 5, -3, 0] : 0,
            y: isTyping ? [0, -2, 0] : isSuccess ? [0, -4, 0] : [0, -1.5, 0],
          }}
          transition={{
            duration: isTyping ? 0.6 : isSuccess ? 0.8 : 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Defs for gradients & shadows */}
          <defs>
            <linearGradient id="redShirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Shoulders & Red T-Shirt Body */}
          <g id="avatar-red-shirt">
            {/* T-Shirt Torso */}
            <path
              d="M 45 160 C 45 140, 70 135, 100 135 C 130 135, 155 140, 155 160 L 165 220 L 35 220 Z"
              fill="url(#redShirtGrad)"
              filter="url(#softShadow)"
            />
            {/* T-Shirt Crew Neck Collar */}
            <path
              d="M 78 135 C 85 148, 115 148, 122 135 C 115 142, 85 142, 78 135 Z"
              fill="#991B1B"
            />
            {/* IEC Logo on Red Shirt */}
            <circle cx="125" cy="170" r="10" fill="#FFFFFF" opacity="0.9" />
            <text
              x="125"
              y="173"
              textAnchor="middle"
              fontSize="7"
              fontWeight="900"
              fill="#B91C1C"
              fontFamily="system-ui, sans-serif"
            >
              IEC
            </text>
          </g>

          {/* Neck */}
          <rect x="86" y="115" width="28" height="25" rx="6" fill="#F59E0B" />

          {/* Head & Ears */}
          <g id="avatar-head">
            {/* Left Ear */}
            <ellipse cx="58" cy="85" rx="8" ry="12" fill="#F59E0B" />
            {/* Right Ear */}
            <ellipse cx="142" cy="85" rx="8" ry="12" fill="#F59E0B" />

            {/* Face Base */}
            <rect
              x="62"
              y="45"
              width="76"
              height="80"
              rx="38"
              fill="url(#skinGrad)"
              filter="url(#softShadow)"
            />

            {/* Stylish Hair */}
            <path
              d="M 58 55 C 58 25, 90 20, 100 20 C 120 20, 142 30, 142 55 C 135 48, 125 45, 110 44 C 95 44, 75 48, 58 55 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M 60 50 C 70 38, 90 35, 110 38 C 125 40, 138 48, 140 54 C 132 46, 118 42, 102 43 C 86 44, 72 48, 60 50 Z"
              fill="#334155"
            />

            {/* Eyebrows */}
            <g id="avatar-eyebrows">
              <path
                d={isError ? "M 72 68 Q 80 72 88 68" : isSuccess ? "M 72 64 Q 80 60 88 64" : "M 72 66 Q 80 62 88 66"}
                stroke="#1E293B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={isError ? "M 112 68 Q 120 72 128 68" : isSuccess ? "M 112 64 Q 120 60 128 64" : "M 112 66 Q 120 62 128 66"}
                stroke="#1E293B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Eyes */}
            {!isPasswordFocused ? (
              <g id="avatar-eyes">
                {/* Left Eye Sclera */}
                <ellipse cx="78" cy="78" rx="10" ry={blink ? 1 : 8} fill="#FFFFFF" />
                {/* Right Eye Sclera */}
                <ellipse cx="122" cy="78" rx="10" ry={blink ? 1 : 8} fill="#FFFFFF" />

                {!blink && (
                  <>
                    {/* Left Pupil */}
                    <circle
                      cx={78 + pupilX}
                      cy={78 + pupilY}
                      r="4.5"
                      fill="#0F172A"
                    />
                    <circle
                      cx={78 + pupilX - 1.5}
                      cy={78 + pupilY - 1.5}
                      r="1.5"
                      fill="#FFFFFF"
                    />

                    {/* Right Pupil */}
                    <circle
                      cx={122 + pupilX}
                      cy={78 + pupilY}
                      r="4.5"
                      fill="#0F172A"
                    />
                    <circle
                      cx={122 + pupilX - 1.5}
                      cy={78 + pupilY - 1.5}
                      r="1.5"
                      fill="#FFFFFF"
                    />
                  </>
                )}
              </g>
            ) : (
              // Password Focused State: Shy / Peeking Closed Eyes
              <g id="avatar-eyes-hidden">
                <path
                  d="M 68 80 Q 78 86 88 80"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 112 80 Q 122 86 132 80"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}

            {/* Nose */}
            <path
              d="M 98 84 Q 100 92 104 92"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mouth / Smile */}
            <g id="avatar-mouth">
              {isSuccess ? (
                // Big Happy Smile
                <path
                  d="M 84 98 Q 100 115 116 98 Z"
                  fill="#991B1B"
                  stroke="#7F1D1D"
                  strokeWidth="1.5"
                />
              ) : isPasswordFocused ? (
                // Small Shy Smile
                <path
                  d="M 90 102 Q 100 108 110 102"
                  stroke="#78350F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Friendly Standard Smile
                <path
                  d="M 88 100 Q 100 110 112 100"
                  stroke="#78350F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>

            {/* Cheeks / Blush */}
            <ellipse cx="68" cy="92" rx="5" ry="3" fill="#EF4444" opacity="0.35" />
            <ellipse cx="132" cy="92" rx="5" ry="3" fill="#EF4444" opacity="0.35" />
          </g>

          {/* Hands Covering Eyes (When Password field is focused) */}
          {isPasswordFocused && (
            <g id="avatar-hands-cover">
              {/* Left Hand */}
              <g className="transition-all duration-300">
                <ellipse cx="76" cy="80" rx="16" ry="12" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
                <circle cx="70" cy="74" r="4" fill="#FCD34D" />
                <circle cx="78" cy="72" r="4" fill="#FCD34D" />
                <circle cx="86" cy="74" r="4" fill="#FCD34D" />
              </g>
              {/* Right Hand */}
              <g className="transition-all duration-300">
                <ellipse cx="124" cy="80" rx="16" ry="12" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
                <circle cx="114" cy="74" r="4" fill="#FCD34D" />
                <circle cx="122" cy="72" r="4" fill="#FCD34D" />
                <circle cx="130" cy="74" r="4" fill="#FCD34D" />
              </g>
            </g>
          )}

          {/* Thumbs up on success */}
          {isSuccess && (
            <g id="avatar-thumbs-up" className="animate-bounce">
              <ellipse cx="160" cy="140" rx="12" ry="10" fill="#F59E0B" />
              <rect x="156" y="125" width="8" height="15" rx="4" fill="#F59E0B" />
            </g>
          )}
        </motion.svg>

        {/* Floating animated status tag */}
        <motion.div 
          layout
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/95 border border-slate-700/80 rounded-full flex items-center gap-1.5 shadow-xl backdrop-blur-md whitespace-nowrap"
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-300">Verified & Authenticated</span>
            </>
          ) : isPasswordFocused ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-medium text-amber-300">Privacy Shield Active</span>
            </>
          ) : isTyping ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-300">Listening to input...</span>
            </>
          ) : isError ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-medium text-red-300">Invalid Credentials</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-medium text-slate-300">IEC Student Mascot</span>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
