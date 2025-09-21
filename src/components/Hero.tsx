'use client';

import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-green-100/20" />
        
        {/* Glowing orb behind headline */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
          style={{
            background: 'linear-gradient(135deg, #677d61, #93a57b)',
            filter: 'blur(120px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered, Intentional Productivity
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            AI-Powered,
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 bg-clip-text text-transparent">
            Intentional Productivity
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Intentional, AI-Powered Productivity insights for your workflow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link href="/extension">
            <motion.button
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #677d61, #93a57b)',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(103, 125, 97, 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Download className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Download Chrome Extension</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#677d61'}} />
            <span>Privacy-first</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#93a57b'}} />
            <span>Real-time analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#fffd7a'}} />
            <span>AI-powered insights</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
