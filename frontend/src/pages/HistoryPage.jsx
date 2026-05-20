import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { getAllSessions } from '../services/db';

const HistoryPage = ({ onBack, onViewReport }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getAllSessions();
        setSessions(data.reverse());
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    loadHistory();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '4vh 24px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{ flexShrink: 0 }}>
        <button 
          className="btn-secondary" 
          style={{ marginBottom: '24px', border: 'none', background: 'none', padding: 0 }}
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          BACK TO DASHBOARD
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 className="hero-title" style={{ fontSize: '32px', marginBottom: '4px' }}>Recording <span className="accent-text">Vault.</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Securely archived performance data from your previous interview sessions.</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          flex: 1,
          overflowY: 'auto',
          paddingRight: '8px',
          paddingBottom: '20px'
        }}
        className="history-list-scroll"
      >
        {sessions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '24px' }}>
            <Clock size={24} style={{ color: 'var(--text-dim)', marginBottom: '12px' }} />
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No session logs found in the vault.</div>
          </div>
        ) : (
          sessions.map((it, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              className="glass-panel" 
              style={{ 
                padding: '16px 20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                background: 'rgba(255,255,255,0.02)',
                flexShrink: 0
              }}
              onClick={() => onViewReport(it)}
              whileHover={{ scale: 1.01, background: 'rgba(255,255,255,0.04)' }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'var(--accent-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--accent)'
                }}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{it.config.role}</div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={10} />
                      {new Date(it.date).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={10} />
                      {it.config.company}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)' }}>{(it.feedback?.overallScore || 0).toFixed(1)}</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>AUDIT SCORE</div>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-dim)' }} />
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default HistoryPage;
