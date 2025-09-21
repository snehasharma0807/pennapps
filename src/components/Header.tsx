'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import LogoButton from '@/components/LogoButton';

const Header = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <LogoButton size="md" />
          
          {/* Login Button */}
          <Link href="/auth">
            <motion.button
              className="px-6 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200 rounded-lg hover:bg-yellow-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log in
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
