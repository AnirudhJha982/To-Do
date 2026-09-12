"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PandaWelcome() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show once per session to prevent annoyance on every navigation
    const hasSeenWelcome = sessionStorage.getItem("hasSeenPandaWelcome");
    if (hasSeenWelcome) {
      setShow(false);
      return;
    }

    // Set the flag
    sessionStorage.setItem("hasSeenPandaWelcome", "true");

    // Hide the panda after 3.5 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #E1C6C8 0%, #D4B8BB 40%, #C4A7AA 100%)'
          }}
        >
          {/* Panda bouncing animation */}
          <motion.div
            initial={{ y: 50, scale: 0.9 }}
            animate={{ 
              y: [20, -40, 0, -20, 0, -10, 0], // The jump sequence
              scale: [0.95, 1, 0.95, 1, 0.95, 1, 1], // Tiny squash effect when landing
              rotate: [0, 5, -5, 0, 0, 0, 0] // Slight tilt at the top
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
              repeat: 0
            }}
            className="mb-8"
          >
            {/* 
              User's requested Panda image. 
              The user should place their uploaded image in the public/ folder as panda.png 
            */}
            <img 
              src="/panda.png" 
              alt="Cute jumping panda mascot" 
              className="w-[140px] md:w-[180px] h-auto drop-shadow-xl" 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <h2 className="text-xl md:text-2xl font-serif font-black text-[#4D3935] tracking-wide">
              GET READY FOR YOUR QUEST...
            </h2>
            <div className="flex gap-2">
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 rounded-full bg-[#EAB62D]" 
              />
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-[#EAB62D]" 
              />
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-[#EAB62D]" 
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
