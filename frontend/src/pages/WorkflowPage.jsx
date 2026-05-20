import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, GitBranch, Mic2, FileSearch, BarChart4, ClipboardCheck } from 'lucide-react';

const WorkflowPage = ({ onBack }) => {
  const steps = [
    { title: 'Candidate Setup', icon: <UserCheck />, desc: 'Collection of candidate profile, role, and experience metrics.' },
    { title: 'Question Generation', icon: <GitBranch />, desc: 'Gemini-powered dynamic synthesis of context-aware interview questions.' },
    { title: 'Speech-to-Text', icon: <Mic2 />, desc: 'Real-time capture and transcription of candidate verbal responses via Web Speech API.' },
    { title: 'Semantic Analysis', icon: <FileSearch />, desc: 'Mistral LLM semantic evaluation of technical accuracy and depth.' },
    { title: 'Weighted Scoring', icon: <BarChart4 />, desc: 'Hybrid rule-based + AI scoring (TS, CQ, LF, RR, CF) to compute final grade.' },
    { title: 'Audit Synthesis', icon: <ClipboardCheck />, desc: 'Generation of a 360-degree performance report with actionable roadmap.' }
  ];

  return (
    <div style={{ padding: '64px', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '40px' }}>BACK</button>
      
      <div style={{ marginBottom: '64px' }}>
        <h1 className="hero-title" style={{ fontSize: '48px' }}>Project <span className="accent-text">Workflow.</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>The operational lifecycle of the automated assessment engine.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '32px', top: '20px', bottom: '20px', width: '1px', background: 'var(--border-strong)', zIndex: -1 }}></div>
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel"
            style={{ 
              padding: '24px 32px', 
              display: 'flex', 
              gap: '24px', 
              alignItems: 'center',
              borderLeft: i % 2 === 0 ? '4px solid var(--accent)' : '1px solid var(--border)'
            }}
          >
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'var(--surface-alt)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent)',
              border: '1px solid var(--border-strong)',
              flexShrink: 0
            }}>
              {step.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-dim)', marginRight: '8px' }}>0{i+1}</span>
                {step.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowPage;
