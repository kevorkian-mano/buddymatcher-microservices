import React from 'react';
import { motion } from 'framer-motion';

export const NavigationButtons = ({
  onBack,
  onContinue,
  canContinue = true
}) => {
  return (
    <nav className="flex w-full max-w-[1265px] mx-auto justify-between items-center mt-14 mb-10 max-md:mt-10 px-4 md:px-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center justify-center gap-2 w-40 md:w-60 h-[60px] bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] text-zinc-900 font-worksans text-lg md:text-xl font-bold transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </motion.button>

      <motion.button
        whileHover={canContinue ? { scale: 1.02 } : {}}
        whileTap={canContinue ? { scale: 0.95 } : {}}
        onClick={onContinue}
        disabled={!canContinue}
        className={`flex items-center justify-center gap-2 w-40 md:w-60 h-[60px] rounded-xl border-2 border-black font-worksans text-lg md:text-xl font-bold transition-all ${
          canContinue 
            ? 'bg-zinc-900 text-white shadow-[4px_4px_0px_#000] hover:bg-zinc-800' 
            : 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed'
        }`}
      >
        Continue
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </motion.button>
    </nav>
  );
};
