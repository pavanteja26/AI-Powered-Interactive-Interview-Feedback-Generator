import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Zap, 
  ShieldCheck,
  BrainCircuit,
  Settings,
  ChevronRight,
  User,
  Briefcase,
  Layers,
  ListOrdered,
  CalendarDays,
  Activity,
  Network,
  Cpu
} from 'lucide-react';


const LandingPage = ({ onStartSession, onNavHistory, onNavPage, showToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    exp: 'mid',
    type: 'Technical',
    topic: '',
    count: 5,
    gkey: '',
    mkey: ''
  });

  const isFormIncomplete = !formData.name || !formData.role || !formData.company || !formData.topic;

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace('f-', '');
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const initSession = () => {
    const required = {
      name: 'Candidate Name',
      role: 'Job Role',
      company: 'Target Company',
      topic: 'Core Topics'
    };

    for (const [key, label] of Object.entries(required)) {
      if (!formData[key] || !formData[key].trim()) {
        showToast(`Please complete the ${label} field`);
        return;
      }
    }

    onStartSession(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="landing-grid">
      <motion.div 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button className="btn-secondary" onClick={onNavHistory}>
            <History size={16} />
            VAULT
          </button>
          <button className="btn-secondary" onClick={() => onNavPage('architecture')}>
            <Network size={16} />
            ARCHITECTURE
          </button>
          <button className="btn-secondary" onClick={() => onNavPage('workflow')}>
            <Cpu size={16} />
            WORKFLOW
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-tag">
          <BrainCircuit size={14} />
          <span>v5.0 AI INTERVIEWER</span>
        </motion.div>
        
        <motion.h1 className="hero-title">
          Master your <br />
          <span className="accent-text">Technical Interview.</span>
        </motion.h1>

        <motion.p className="hero-description">
          Experience a high-fidelity simulation of professional job interviews. 
          Powered by state-of-the-art LLMs for dynamic questioning and deep performance analytics.
        </motion.p>

        <div className="stat-row" style={{ display: 'flex', gap: '40px' }}>
          <div className="stat">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '4px' }}>
              <Zap size={16} />
              <span style={{ fontWeight: 800, fontSize: '18px' }}>REAL-TIME</span>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.1em', fontWeight: 700 }}>VOICE ANALYSIS</span>
          </div>
          <div className="stat">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', marginBottom: '4px' }}>
              <ShieldCheck size={16} />
              <span style={{ fontWeight: 800, fontSize: '18px' }}>DETAILED</span>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.1em', fontWeight: 700 }}>NEURAL AUDITS</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="config-panel"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--accent)', padding: '10px', borderRadius: '12px', color: '#fff', boxShadow: '0 8px 20px var(--accent-muted)' }}>
            <Settings size={22} />
          </div>
          <h2 className="config-title" style={{ marginBottom: 0, fontSize: '22px' }}>Session Configuration</h2>
        </div>

        <div className="form-grid" style={{ gap: '20px' }}>
          <div className="form-group full-width">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="form-input" style={{ paddingLeft: '40px' }} id="f-name" value={formData.name} onChange={handleChange} placeholder="e.g. Alex Henderson" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Role</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="form-input" style={{ paddingLeft: '40px' }} id="f-role" value={formData.role} onChange={handleChange} placeholder="e.g. SDE II" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company</label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="form-input" style={{ paddingLeft: '40px' }} id="f-company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Experience</label>
            <div style={{ position: 'relative' }}>
              <CalendarDays size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
              <select className="form-select" style={{ paddingLeft: '40px' }} id="f-exp" value={formData.exp} onChange={handleChange}>
                <option value="entry">Entry (0-1y)</option>
                <option value="junior">Junior (1-3y)</option>
                <option value="mid">Mid (3-5y)</option>
                <option value="senior">Senior (5+y)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <div style={{ position: 'relative' }}>
              <Activity size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
              <select className="form-select" style={{ paddingLeft: '40px' }} id="f-type" value={formData.type} onChange={handleChange}>
                <option>Technical</option>
                <option>HR Screening</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Core Topics</label>
            <div style={{ position: 'relative' }}>
              <Layers size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="form-input" style={{ paddingLeft: '40px' }} id="f-topic" value={formData.topic} onChange={handleChange} placeholder="e.g. React, DS" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Questions</label>
            <div style={{ position: 'relative' }}>
              <ListOrdered size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
              <select className="form-select" style={{ paddingLeft: '40px' }} id="f-count" value={formData.count} onChange={handleChange}>
                <option value="3">3 Rapid</option>
                <option value="5">5 Standard</option>
                <option value="10">10 Full</option>
              </select>
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={!isFormIncomplete ? { scale: 1.01 } : {}}
          whileTap={!isFormIncomplete ? { scale: 0.99 } : {}}
          className={`btn-primary ${isFormIncomplete ? 'disabled' : ''}`} 
          onClick={initSession} 
          disabled={isFormIncomplete}
          style={{ 
            padding: '16px', 
            fontSize: '15px', 
            marginTop: '12px',
            opacity: isFormIncomplete ? 0.4 : 1,
            cursor: isFormIncomplete ? 'not-allowed' : 'pointer',
            pointerEvents: isFormIncomplete ? 'none' : 'auto'
          }}
        >
          START INTERVIEW SESSION
          <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
