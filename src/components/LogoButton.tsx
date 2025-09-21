import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LogoButtonProps {
  size?: 'sm' | 'md' | 'lg';
}

const LogoButton: React.FC<LogoButtonProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <Link href="/" className="group relative overflow-hidden">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Glowing effect */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(103, 125, 97, 0.3) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Main text with gradient */}
        <motion.span 
          className={`font-bold ${sizeClasses[size]} relative z-10 block px-4 py-2`}
          style={{
            backgroundImage: 'linear-gradient(135deg, #2c423f 0%, #4a6b66 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          whileHover={{
            opacity: 0.8
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 0px rgba(103, 125, 97, 0)',
                '0 0 10px rgba(103, 125, 97, 0.5)',
                '0 0 0px rgba(103, 125, 97, 0)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            intention.ai
          </motion.span>
        </motion.span>
        
        {/* Floating dots animation */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: '#677d61',
              left: `${20 + i * 30}%`,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            animate={{
              y: [-2, 2, -2],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </motion.div>
    </Link>
  );
};

export default LogoButton;
