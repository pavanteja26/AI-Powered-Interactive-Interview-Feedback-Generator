import React from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import {
  Download,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Zap,
  FileText,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Target,
  BrainCircuit
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const FeedbackPage = ({ config, transcript, feedback, onNewSession }) => {
  if (!feedback) return null;

  // Normalizing scores for the radar chart (ensuring they are between 0-10)
  const radarData = {
    labels: ['Technical', 'Communication', 'Problem Solving', 'Relevance', 'Integrity', 'Overall'],
    datasets: [{
      label: 'Performance Metrics',
      data: [
        feedback.technical_score || 0,
        feedback.communication_score || 0,
        feedback.problem_solving_score || 0,
        feedback.relevance_score || 0,
        (feedback.audit_integrity / 10) || 5, // Scaling 0-100 to 0-10
        feedback.overall_score || 0
      ],
      backgroundColor: 'rgba(93, 81, 255, 0.15)',
      borderColor: '#5d51ff',
      borderWidth: 2,
      pointBackgroundColor: '#5d51ff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#5d51ff',
      pointRadius: 4,
    }]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        beginAtZero: true,
        ticks: { display: false, stepSize: 2 },
        grid: { color: 'rgba(255,255,255,0.08)' },
        angleLines: { color: 'rgba(255,255,255,0.08)' },
        pointLabels: { 
          color: '#94a3b8', 
          font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' },
          padding: 10
        }
      }
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(14, 18, 26, 0.9)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Rating: ${context.raw}/10`
        }
      }
    }
  };

  const recommendationColor = () => {
    const rec = feedback.recommendation?.toLowerCase() || '';
    if (rec.includes('strong')) return 'var(--success)';
    if (rec.includes('hire')) return 'var(--accent)';
    if (rec.includes('consider')) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="report-container" style={{ 
      minHeight: '100vh',
      overflowY: 'auto', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'var(--bg)',
      position: 'relative'
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <header style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(6, 8, 11, 0.5)', backdropFilter: 'blur(10px)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '4px' }}>
              <TrendingUp size={14} />
              NEURAL PERFORMANCE AUDIT
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
              Report: <span className="accent-text">{config.name}</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => window.print()} style={{ padding: '8px 20px', fontSize: '12px' }}>
              <Download size={14} /> EXPORT PDF
            </button>
            <button className="btn-primary" onClick={onNewSession} style={{ padding: '8px 20px', fontSize: '12px' }}>
              <RotateCcw size={14} /> RESTART
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="feedback-dashboard" style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
          padding: '40px',
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%',
          overflowY: 'auto'
        }}>
          {/* Column 1: Core Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--accent-glow)', filter: 'blur(50px)', opacity: 0.3 }}></div>
              <div style={{ 
                width: '140px', 
                height: '140px', 
                borderRadius: '50%', 
                border: '8px solid var(--accent-muted)', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px', 
                color: 'var(--text)',
                background: 'rgba(255,255,255,0.02)',
                boxShadow: '0 0 30px var(--accent-glow)'
              }}>
                <span style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1 }}>{feedback.overall_score?.toFixed(1)}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 700 }}>SCORING</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 800, letterSpacing: '0.2em', marginBottom: '20px' }}>NEURAL EVALUATION</div>
              <div style={{ 
                padding: '10px 24px', 
                borderRadius: '100px', 
                background: `${recommendationColor()}15`, 
                color: recommendationColor(), 
                border: `1px solid ${recommendationColor()}40`,
                fontSize: '13px', 
                fontWeight: 800, 
                display: 'inline-block',
                letterSpacing: '0.1em'
              }}>
                {feedback.recommendation?.toUpperCase() || 'EVALUATING'}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '24px', letterSpacing: '0.1em' }}>
                <BarChart3 size={16} className="accent-text" /> COMPETENCY MAPPING
              </div>
              <div style={{ height: '240px', width: '100%' }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.1em' }}>SCORE ANALYSIS</h3>
              <ScoreBar label="Technical Proficiency" score={feedback.technical_score} />
              <ScoreBar label="Communication Dynamics" score={feedback.communication_score} />
              <ScoreBar label="Problem Resolution" score={feedback.problem_solving_score} />
            </motion.div>
          </div>

          {/* Column 2: Detailed Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ padding: '40px', borderLeft: '6px solid var(--accent)', background: 'linear-gradient(to bottom right, rgba(14, 18, 26, 0.8), rgba(6, 8, 11, 0.5))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em' }}>EXECUTIVE INTELLIGENCE SUMMARY</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>UUID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              </div>
              <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--text)', fontWeight: 500, fontStyle: 'italic', marginBottom: '32px', letterSpacing: '-0.01em' }}>
                "{feedback.final_feedback || feedback.summary}"
              </p>
              
              <div style={{ paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>NEURAL INTEGRITY MATCH</span>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: 'var(--accent)' }}>{feedback.audit_integrity}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden', padding: '1px' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${feedback.audit_integrity}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #a78bfa)', borderRadius: '3px' }} />
                </div>
              </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '32px', background: 'rgba(16, 185, 129, 0.03)', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--success)', marginBottom: '20px', fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em' }}>
                  <Trophy size={18} /> CORE STRENGTHS
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {feedback.strengths?.map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} /> {s}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '32px', background: 'rgba(245, 158, 11, 0.03)', borderColor: 'rgba(245, 158, 11, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning)', marginBottom: '20px', fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em' }}>
                  <Zap size={18} /> GROWTH AREAS
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {feedback.weaknesses?.map((w, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} /> {w}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--accent-muted)', padding: '8px', borderRadius: '10px' }}>
                  <FileText size={20} className="accent-text" />
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em' }}>CRITICAL ENGAGEMENT LOG</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {transcript.filter(t => t.text.length > 10).slice(-3).map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{t.role.toUpperCase()}</span>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>"{t.text}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Column 3: Roadmap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.15em' }}>VOCABULARY AUDIT</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {(feedback.matched_keywords || feedback.concepts || []).map((k, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '8px 16px', background: 'var(--accent-muted)', border: '1px solid var(--accent)', borderRadius: '10px', color: 'var(--accent)', fontWeight: 700 }}>{k}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '11px', color: 'var(--error)', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.15em' }}>MISSING CONCEPTS</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {feedback.missing_concepts?.map((k, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '8px 16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--error)', borderRadius: '10px', color: 'var(--error)', fontWeight: 700 }}>{k}</span>
                ))}
                {!feedback.missing_concepts?.length && <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontStyle: 'italic' }}>No critical gaps identified.</div>}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h3 style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.15em' }}>IMPROVEMENT BLUEPRINT</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(feedback.improvement_suggestions || []).map((s, i) => (
                  <div key={i} style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--border)', transition: 'transform 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-muted)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <BrainCircuit size={18} />
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{s}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score }) => (
  <div className="glass-panel" style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px', fontWeight: 700 }}>
      <span style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{score.toFixed(1)}/10</span>
    </div>
    <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '100px', overflow: 'hidden', padding: '1.5px' }}>
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${score * 10}%` }} 
        style={{ 
          height: '100%', 
          background: 'linear-gradient(90deg, var(--accent), #a78bfa)', 
          borderRadius: '100px',
          boxShadow: '0 0 10px var(--accent-glow)'
        }} 
      />
    </div>
  </div>
);

export default FeedbackPage;
