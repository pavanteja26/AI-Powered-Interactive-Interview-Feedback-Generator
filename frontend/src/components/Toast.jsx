import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const Toast = ({ show, message }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ y: 50, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        exit={{ y: 20, opacity: 0, x: '-50%' }}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          padding: '12px 20px',
          borderRadius: '12px',
          color: 'var(--text)',
          fontSize: '13px',
          fontWeight: 600,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <AlertCircle size={16} className="accent-text" />
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Toast;
