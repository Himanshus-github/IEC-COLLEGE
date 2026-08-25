import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, MessageSquare, RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OtpDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OtpDemoModal: React.FC<OtpDemoModalProps> = ({ isOpen, onClose }) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFillingAnimation, setIsFillingAnimation] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const DEMO_CODE = ['4', '7', '1', '9'];

  useEffect(() => {
    if (isOpen) {
      handleReset();
      setToastVisible(true);
    }
  }, [isOpen]);

  const handleInputChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setIsError(false);

    // Auto-focus next input
    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // If 4 digits entered, verify
    if (newDigits.every(d => d !== '')) {
      checkVerification(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const checkVerification = (codeDigits: string[]) => {
    const entered = codeDigits.join('');
    if (entered === DEMO_CODE.join('')) {
      setIsVerified(true);
      setIsError(false);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6']
        });
      } catch (e) {
        // Fallback gracefully
      }
    } else {
      setIsError(true);
      setIsVerified(false);
    }
  };

  const triggerAnimatedFill = () => {
    if (isFillingAnimation) return;
    setIsFillingAnimation(true);
    setIsError(false);
    setDigits(['', '', '', '']);

    DEMO_CODE.forEach((digit, i) => {
      setTimeout(() => {
        setDigits(prev => {
          const next = [...prev];
          next[i] = digit;
          return next;
        });
        if (i === 3) {
          setIsFillingAnimation(false);
          setIsVerified(true);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.55 },
              colors: ['#EF4444', '#F59E0B', '#10B981']
            });
          } catch (e) {}
        }
      }, (i + 1) * 200);
    });
  };

  const handleReset = () => {
    setDigits(['', '', '', '']);
    setIsVerified(false);
    setIsError(false);
    setIsFillingAnimation(false);
    setTimeout(() => inputRefs[0].current?.focus(), 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="otp-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            id="otp-modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* SMS-style Toast Notification Banner with motion */}
            {toastVisible && (
              <motion.div
                id="otp-sms-toast"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 bg-slate-800/90 border border-red-500/30 rounded-2xl flex items-start gap-3 shadow-lg"
              >
                <div className="p-2 bg-red-500/10 text-red-400 rounded-xl shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">SMS • IEC-VERIFY</span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your IEC Secure Campus OTP is <strong className="text-red-400 font-mono text-sm tracking-wider">4719</strong>. Valid for 10 minutes.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-3 shadow-md"
              >
                <ShieldCheck className="w-6 h-6" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-100">Interactive OTP V3 Experience</h3>
              <p className="text-xs text-slate-400 mt-1">
                Physics-inspired auto-fill and validation micro-interaction
              </p>
            </div>

            {/* OTP Input Boxes or Verified State */}
            {!isVerified ? (
              <div className="space-y-6">
                <motion.div
                  id="otp-boxes-wrapper"
                  animate={isError ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex justify-center items-center gap-3 sm:gap-4"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <motion.input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digits[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isFillingAnimation}
                      whileFocus={{ scale: 1.08 }}
                      className={`w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl font-mono font-bold rounded-2xl border-2 transition-colors duration-200 outline-none ${
                        isError
                          ? 'border-red-500 bg-red-950/20 text-red-400 shadow-lg shadow-red-500/10'
                          : digits[index]
                          ? 'border-red-500/80 bg-slate-800 text-slate-100 shadow-md shadow-red-500/5'
                          : 'border-slate-700 bg-slate-800/60 text-slate-200 focus:border-red-400 focus:bg-slate-800'
                      }`}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </motion.div>

                {/* Error Message */}
                {isError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-medium"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Incorrect code. Try demo code <strong>4719</strong></span>
                  </motion.div>
                )}

                {/* Action Buttons with Spring Hover */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button
                    id="otp-autofill-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={triggerAnimatedFill}
                    disabled={isFillingAnimation}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Fill Code (4719)</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-2xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Collapsed into Verified Tile */
              <motion.div
                id="otp-verified-tile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl text-center space-y-4"
              >
                <motion.div 
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>

                <div>
                  <h4 className="text-lg font-bold text-emerald-300">Identity Successfully Verified</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    OTP <strong>4719</strong> matched cryptographic campus signature.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Demo</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Footer info banner */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
                Interactive Physics OTP Demo
              </span>
              <span className="text-slate-400">
                Mock local verification
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
