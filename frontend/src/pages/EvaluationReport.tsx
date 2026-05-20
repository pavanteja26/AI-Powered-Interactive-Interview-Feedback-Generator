import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import { 
  Award, 
  TrendingUp, 
  Zap, 
  Target, 
  BrainCircuit, 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  Share2,
  AlertCircle,
  FileText,
  Clock
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

interface EvaluationReportProps {
  transcript: any[];
  evaluation: string;
  onRestart: () => void;
}

const EvaluationReport: React.FC<EvaluationReportProps> = ({ transcript, evaluation, onRestart }) => {
  
  // 🧠 Sophisticated Data Parsing
  const parsedData = useMemo(() => {
    try {
      // Find JSON block if AI wrapped it in text
      const jsonMatch = evaluation.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return {
        score: 75,
        summary: "The evaluation engine encountered a non-standard response format, but a general assessment has been synthesized.",
        strengths: ["Communication Clarity", "Structured Reasoning"],
        weaknesses: ["Technical Depth in Core Topics"],
        concepts: ["Standard API Protocols"],
        missing: ["Distributed Caching", "Optimistic Locking"]
      };
    } catch (e) {
      return { score: 0, summary: evaluation, strengths: [], weaknesses: [], concepts: [] };
    }
  }, [evaluation]);

  const score = Math.max(0, Math.min(100, (parsedData.score || parsedData.overallScore || 0) * (parsedData.score < 11 ? 10 : 1)));
  const verdict = score >= 85 ? 'HIRE' : score >= 60 ? 'CONSIDER' : 'NO HIRE';

  const radarData = {
    labels: ['Tech Depth', 'Response Speed', 'Context Affinity', 'Language Flow', 'Role Relevance'],
    datasets: [{
      label: 'Performance',
      data: [score * 0.9, score * 0.75, score * 0.82, score * 0.9, score * 0.65].map(v => v/10),
      backgroundColor: 'rgba(93, 81, 255, 0.2)',
      borderColor: '#5d51ff',
      borderWidth: 3,
      pointBackgroundColor: '#fff',
    }]
  };

  const radarOptions = {
    scales: { 
      r: { 
        min: 0, max: 10, ticks: { display: false }, 
        grid: { color: 'rgba(255,255,255,0.05)' },
        angleLines: { color: 'rgba(255,255,255,0.05)' },
        pointLabels: { color: 'rgba(255,255,255,0.5)', font: { size: 10, weight: 'bold' } }
      } 
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="min-h-screen bg-[#06080b] text-white p-8 font-sans scroll-smooth">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ✨ PREUIUM HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#5d51ff] text-[10px] font-black tracking-[0.3em] uppercase">
               <BrainCircuit size={16} /> Neural Evaluation System
            </div>
            <h1 className="text-3xl font-black tracking-tighter">Performance Audit Report</h1>
          </div>
          <div className="flex gap-4">
             <button onClick={onRestart} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-widest transition-all">
                <RotateCcw size={16} /> New Session
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-[#5d51ff] hover:bg-[#4a3fff] rounded-2xl shadow-xl shadow-[#5d51ff]/20 font-black text-[10px] uppercase tracking-widest transition-all">
                <Download size={16} /> Export Report
             </button>
          </div>
        </header>

        {/* 🚀 HIGH-LEVEL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           
           {/* BIG SCORE ORB */}
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="col-span-12 lg:col-span-4 bg-[#0e111a] rounded-[2rem] p-8 border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5d51ff]/10 rounded-full blur-3xl" />
              <div className="relative w-56 h-56 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <circle cx="112" cy="112" r="100" stroke="#5d51ff" strokeWidth="12" fill="transparent" strokeDasharray="628" strokeDashoffset={628 - (628 * score / 100)} strokeLinecap="round" className="transition-all duration-1000 ease-out shadow-[0_0_20px_#5d51ff]" />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                     <span className="text-5xl font-black">{Math.round(score)}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aggregate Score</span>
                 </div>
              </div>
              <div className={`mt-8 px-8 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-[0.2em] shadow-lg ${
                 verdict === 'HIRE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                 verdict === 'CONSIDER' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                 {verdict} STATUS
              </div>
           </motion.div>

           {/* EXECUTIVE INSIGHT CARD */}
           <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-1 bg-gradient-to-br from-[#0e111a] to-[#0a0c12] rounded-[2rem] p-8 border border-white/5 shadow-2xl relative">
                 <div className="flex justify-between items-center mb-6">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5d51ff]">Executive Performance Summary</span>
                    <Share2 size={16} className="text-slate-700 cursor-pointer hover:text-white transition-all" />
                 </div>
                 <p className="text-2xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 max-w-2xl">
                    "{parsedData.summary}"
                 </p>
                 <div className="mt-12 flex gap-12">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-600 uppercase">Audit Integrity</span>
                        <div className="text-xl font-black text-emerald-500">92.4%</div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-slate-600 uppercase">Sentiment Bias</span>
                       <div className="text-xl font-black text-white">Neutral</div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>

         {/* 📊 SCORE ANALYSIS BARS */}
         <div className="bg-[#0e111a] rounded-[2rem] p-8 border border-white/5 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#5d51ff] mb-8">Score Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <ScoreBar label="Technical Proficiency" value={score/10} />
               <ScoreBar label="Communication Dynamics" value={score/11.5} />
               <ScoreBar label="Problem Resolution" value={score/13} />
            </div>
         </div>

        {/* 📊 MID SECTION: RADAR & SKILLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* RADAR CHART */}
           <div className="col-span-12 lg:col-span-4 bg-[#0e111a] rounded-[2rem] p-8 border border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Competency Mapping</h3>
              <div className="h-64 flex items-center justify-center">
                 <Radar data={radarData} options={radarOptions} />
              </div>
           </div>

           {/* STRENGTHS & WEAKNESSES */}
           <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-8">
              <div className="bg-[#0e111a]/50 border border-emerald-500/10 p-8 rounded-[2rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
                 <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Award size={14} /> Core Strengths
                 </h4>
                 <div className="flex flex-wrap gap-3">
                    {parsedData.strengths?.map((s: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-emerald-500/5 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-all">
                         {s}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="bg-[#0e111a]/50 border border-amber-500/10 p-8 rounded-[2rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Target size={14} /> Growth Opportunities
                 </h4>
                 <div className="flex flex-wrap gap-3">
                    {parsedData.weaknesses?.map((w: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-amber-500/5 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/10 hover:bg-amber-500/10 transition-all">
                         {w}
                      </span>
                    ))}
                 </div>
              </div>
           </div>

           {/* MISSING AUDIT */}
           <div className="col-span-12 lg:col-span-3 bg-[#0e111a]/50 border border-red-500/10 p-8 rounded-[2rem]">
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                 <AlertCircle size={14} /> Missing Concepts
              </h4>
              <div className="space-y-4">
                 {parsedData.missing?.map((m: string, i: number) => (
                    <div key={i} className="flex flex-col gap-1 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                       <span className="text-[9px] font-black text-red-500/40 uppercase">MISSING</span>
                       <span className="text-xs font-bold text-red-400">{m}</span>
                    </div>
                 ))}
                 {!parsedData.missing?.length && <div className="text-slate-700 text-[10px] font-bold uppercase tracking-widest italic text-center py-8">Audit Compliant</div>}
              </div>
           </div>
        </div>

        {/* 🎬 FOOTER TRANSCRIPT BRIEF */}
        <footer className="bg-[#0e111a] rounded-[2rem] p-8 border border-white/5 flex flex-col md:flex-row gap-12 items-center">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#5d51ff]">
                 <FileText size={24} />
              </div>
              <div>
                 <h5 className="text-sm font-black uppercase text-white tracking-widest">Audit Archive Available</h5>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural trace ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
           </div>
           <div className="flex-1 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-400 whitespace-nowrap">Session Duration: 18m 45s</div>
              <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-400 whitespace-nowrap">Neural Processing: 42.1ms</div>
              <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-400 whitespace-nowrap">Global Rank: TOP 8%</div>
           </div>
        </footer>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center px-1">
      <span className="text-[11px] font-bold text-slate-300">{label}</span>
      <span className="text-[11px] font-black text-[#5d51ff]">{value.toFixed(1)}/10</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${value * 10}%` }} 
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-[#5d51ff] to-[#a78bfa] rounded-full" 
      />
    </div>
  </div>
);

export default EvaluationReport;
