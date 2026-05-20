import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, Cpu, Layout, Server, ArrowRight } from 'lucide-react';

const ArchitecturePage = ({ onBack }) => {
  const layers = [
    { 
      title: 'Presentation Layer (React.js)', 
      icon: <Layout className="accent-text" />, 
      details: 'Vite-powered SPA, Framer Motion for UI/UX, Recharts for data visualization.' 
    },
    { 
      title: 'Application Logic Layer (Node/Express)', 
      icon: <Server className="accent-text" />, 
      details: 'RESTful API controllers, JWT authentication, Request validation, Winston logging.' 
    },
    { 
      title: 'AI Intelligence Layer', 
      icon: <Cpu className="accent-text" />, 
      details: 'Gemini 2.0 (Dynamic Questions), Mistral Small (Semantic Analysis), Web Speech (STT).' 
    },
    { 
      title: 'Data Persistence Layer', 
      icon: <Database className="accent-text" />, 
      details: 'MongoDB Cloud for reports/users, IndexedDB for local session state.' 
    }
  ];

  return (
    <div style={{ padding: '64px', maxWidth: '1200px', margin: '0 auto' }}>
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '40px' }}>BACK</button>
      
      <div style={{ marginBottom: '64px' }}>
        <h1 className="hero-title" style={{ fontSize: '48px' }}>System <span className="accent-text">Architecture.</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>High-level structural design of the AI Interview Platform.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {layers.map((layer, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel"
            style={{ padding: '32px' }}
          >
            <div style={{ marginBottom: '16px' }}>{layer.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{layer.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>{layer.details}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '64px', padding: '48px', background: 'var(--surface)', borderRadius: '32px', border: '1px solid var(--border-strong)', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '24px' }}>Data Flow Diagram</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', color: 'var(--text-dim)', fontSize: '12px' }}>
          <span>CANDIDATE</span> <ArrowRight size={14} />
          <span>API GATEWAY</span> <ArrowRight size={14} />
          <span>LLM ENGINE</span> <ArrowRight size={14} />
          <span>SCORING ALGO</span> <ArrowRight size={14} />
          <span>MONGO DB</span>
        </div>
      </div>
    </div>
  );
};

export default ArchitecturePage;
