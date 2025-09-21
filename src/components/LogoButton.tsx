'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isDarkMode?: boolean;
}

const LogoButton = ({ className = '', size = 'md', isDarkMode = false }: LogoButtonProps) => {

  const sizeClasses = {
    sm: 'w-24 h-16',
    md: 'w-32 h-20',
    lg: 'w-40 h-24'
  };

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClasses[size]} relative overflow-hidden rounded-lg transition-all duration-200 hover:shadow-lg`}
      >
        <Image
          src={isDarkMode ? "/logos/button.logo.darkened.png" : "/logos/button.logo.png"}
          alt="intention.ai Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </Link>
  );
};

export default LogoButton;
