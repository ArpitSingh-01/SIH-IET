'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function LogoLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' as any }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' as any }}
          >
            <motion.div
              className="w-24 h-24 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as any }}
            >
              <img 
                src="/images/sih-logo.png" 
                alt="SIH Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                SIH 2026
              </h1>
              <p className="text-sm text-slate-500 mt-1">IET DDUGU</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
