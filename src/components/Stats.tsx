'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      value: '99%',
      label: 'Accuracy',
      description: 'Emotion detection precision',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      value: '24/7',
      label: 'Monitoring',
      description: 'Continuous analysis',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      value: '3x',
      label: 'Productivity',
      description: 'Average improvement',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          className="grid md:grid-cols-3 gap-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <motion.div
                className="text-6xl md:text-7xl font-bold mb-4"
                style={{
                  background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, ${stat.gradient.split(' ')[3]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {stat.value}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors duration-300">
                {stat.label}
              </h3>
              
              <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
