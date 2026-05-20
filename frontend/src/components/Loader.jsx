import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const Loader = ({ message }) => (
  <div className="overlay-ready" style={{ flexDirection: 'column', gap: '24px', position: 'fixed', inset: 0, zIndex: 9999 }}>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2 }}
      style={{ 
        width: '80px', 
        height: '80px', 
        background: 'var(--accent-muted)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent)',
        boxShadow: '0 0 40px var(--accent-glow)'
      }}
    >
      <BrainCircuit size={40} />
    </motion.div>
    
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        fontFamily: 'var(--font-mono)', 
        fontSize: '12px', 
        letterSpacing: '0.2em', 
        color: 'var(--accent)',
        fontWeight: 700,
        marginBottom: '12px'
      }}>
        {message || 'SYSTEM INITIALIZING'}
      </div>
      <div style={{ width: '200px', height: '2px', background: 'var(--surface-alt)', borderRadius: '10px', overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [-200, 200] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          style={{ width: '100px', height: '100%', background: 'var(--accent)' }}
        />
      </div>
    </div>
  </div>
);

export default Loader;
