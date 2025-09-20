'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const LogoAnimation = () => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  
  const logos = [
    '/logos/intention.logo.3 (3).png',
    '/logos/intention.logo.1.png', 
    '/logos/intention.logo.2.png',
    '/logos/intention.logo.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 3100); // 0.8s fade-in + 1.5s visible + 0.8s fade-out = 3.1s total

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div className="w-1/2 h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200"></div>
      
      {/* Logo container */}
      <div className="relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLogoIndex}
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0,
              transition: { duration: 0.8, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              x: 50,
              transition: { duration: 0.8, ease: "easeIn" }
            }}
            whileHover={{ scale: 1.05 }}
            className="transition-transform duration-300"
          >
            <Image
              src={logos[currentLogoIndex]}
              alt={`Logo ${currentLogoIndex + 1}`}
              width={600}
              height={300}
              className="max-w-[600px] w-full h-auto object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gray-400"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-gray-400"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-gray-400"></div>
      </div>
    </div>
  );
};

export default LogoAnimation;
