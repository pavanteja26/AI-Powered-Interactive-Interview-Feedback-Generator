import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Settings,
  MessageSquare,
  Terminal,
  Mic,
  MicOff,
  LogOut,
  ChevronRight,
  SkipForward,
  BarChart,
  Circle
} from 'lucide-react';

// --- TYPES ---

interface InterviewEntry {
  role: 'ai' | 'user' | 'system';
  content: string;
}

interface InterviewSessionProps {
  config: {
    job_role: string;
    experience_level: string;
    company_name: string;
    question_count: number;
  };
  onEnd: (transcript: InterviewEntry[], evaluation: string) => void;
}

// --- COMPONENT ---

const InterviewSession: React.FC<InterviewSessionProps> = ({ config, onEnd }) => {
  // 🎯 State Management
  const [question, setQuestion] = useState<string>("");
  const [phase, setPhase] = useState(1);
  const [timer, setTimer] = useState(0);
  const [aiStatus, setAiStatus] = useState<"Listening" | "Thinking" | "Speaking">("Thinking");
  const [isInterviewActive, setIsInterviewActive] = useState(true);

  // 🎤 Speech & Transcript
  const [transcript, setTranscript] = useState("");
  const [sessionHistory, setSessionHistory] = useState<InterviewEntry[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // 🛠️ Refs
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finalTranscriptRef = useRef("");

  // --- LOGIC ---

  const addLog = (msg: string) => {
    setLogs(prev => [`${msg}`, ...prev].slice(0, 1));
  };

  const handleUserAnswer = useCallback(async (capturedAnswer: string) => {
    if (!capturedAnswer.trim() || aiStatus !== 'Listening') return;

    setAiStatus('Thinking');
    addLog(`User Response: "${capturedAnswer.slice(0, 50)}..." captured.`);

    const updatedHistory: InterviewEntry[] = [...sessionHistory, { role: 'user', content: capturedAnswer.trim() }];
    setSessionHistory(updatedHistory);

    if (phase >= config.question_count) {
      // Finish
      onEnd(updatedHistory, "Session analysis pending completion.");
    } else {
      setTimeout(() => generateQuestion(updatedHistory), 800);
    }
  }, [aiStatus, phase, config.question_count, sessionHistory, onEnd]);

  const generateQuestion = async (currentHistory: InterviewEntry[] = []) => {
    setAiStatus('Thinking');
    try {
      const response = await fetch('http://localhost:5000/api/interview/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_role: config.job_role,
          experience_level: config.experience_level,
          type: 'technical'
        })
      });
      const data = await response.json();
      const nextQ = data.question;

      setQuestion(nextQ);
      setSessionHistory([...currentHistory, { role: 'ai', content: nextQ }]);
      if (currentHistory.length > 0) setPhase(p => p + 1);

      addLog(`New Probe Issued: "${nextQ.slice(0, 60)}..."`);

      setAiStatus('Speaking');
      const utterance = new SpeechSynthesisUtterance(nextQ);
      utterance.onend = () => {
        setAiStatus('Listening');
        finalTranscriptRef.current = "";
        setTranscript("");
      };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      addLog("External AI Engine Timeout. Check connectivity.");
    }
  };

  // --- HARDWARE & TIMERS ---

  useEffect(() => {
    generateQuestion();
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        }, 
        audio: false 
      })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; });
    }
    const tInt = setInterval(() => setTimer(p => p + 1), 1000);
    return () => clearInterval(tInt);
  }, []);

  // --- SPEECH ENGINE ---

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: any) => {
      let interim = "";
      let finalText = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }

      finalTranscriptRef.current = finalText;
      setTranscript(finalText + interim);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        const full = (finalTranscriptRef.current + interim).trim();
        if (full.length > 5 && aiStatus === 'Listening') handleUserAnswer(full);
      }, 2000);
    };

    rec.onend = () => {
      if (isInterviewActive && aiStatus === 'Listening') try { rec.start(); } catch (e) { }
    };

    recognitionRef.current = rec;
    return () => rec.stop();
  }, [isInterviewActive, aiStatus, handleUserAnswer]);

  useEffect(() => {
    if (aiStatus === 'Listening' && isInterviewActive && recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) { }
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [aiStatus, isInterviewActive]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // --- RENDER ---

  return (
    <div className="flex flex-col min-h-screen bg-[#06080b] text-white font-sans overflow-y-auto p-6 gap-6">

      {/* 🟢 TOP BAR */}
      <header className="flex items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#5d51ff] rounded flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase whitespace-nowrap">TECHCORP</span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">SECURE LINK - {formatTime(timer)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <Circle size={8} fill="#10b981" className="text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">SYSTEM READY</span>
          </div>
          <button
            onClick={() => setIsInterviewActive(false)}
            className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-md transition-all font-black text-[10px] uppercase tracking-widest"
          >
            END SESSION
          </button>
        </div>
      </header>

      {/* 🔴 MAIN GRID */}
      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">

        {/* WEBCAM MODULE */}
        <div className="col-span-7 bg-[#0f1118] rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl">
          <video ref={videoRef} className="w-full h-full object-cover grayscale-[0.2] brightness-110" autoPlay muted />
          <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 bg-red-600 rounded-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span className="text-[9px] font-black tracking-widest uppercase text-white">REC LIVE</span>
          </div>
        </div>

        {/* ANALYTICS & PROBE MODULES */}
        <div className="col-span-5 flex flex-col gap-6">

          {/* TOP: CURRENT PROBE */}
          <div className="flex-1 bg-[#0e111a] border border-white/5 p-10 rounded-3xl flex flex-col gap-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5d51ff]">CURRENT PROBE</div>
              <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">
                PHASE {phase} / {config.question_count}
              </div>
            </div>
            <p className="text-xl font-bold leading-tight text-slate-100 tracking-tight">
              {question || "Initializing probe modules..."}
            </p>
          </div>

          {/* BOTTOM: SYSTEM OUTPUT */}
          <div className="flex-1 bg-[#0e111a] border border-white/5 p-10 rounded-3xl flex flex-col gap-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5d51ff]">SYSTEM OUTPUT</div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-[#5d51ff] border border-white/5 transition-all">
                  SKIP SPEAKING
                </button>
                <BarChart size={18} className="text-[#5d51ff] animate-pulse" />
              </div>
            </div>

            <div className="flex-1 bg-black/20 rounded-2xl p-6 border border-white/5 overflow-y-auto min-h-0">
              <p className="text-[14px] leading-loose text-slate-400 italic font-medium">
                Question: {question}
                <br /><br />
                <span className="text-white not-italic font-bold">Feedback:</span> {transcript || "Awaiting candidate vocal transmission..."}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 🔵 AUDIT LOG FOOTER */}
      <footer className="h-24 bg-[#0a0c12]/80 border-t border-white/5 rounded-t-[2rem] flex flex-col px-8 py-5 shrink-0 gap-4">
        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">NEURAL AUDIT LOG</div>
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#5d51ff]">SYSTEM</span>
          <div className="flex-1 text-[11px] font-medium text-slate-500 tracking-tight line-clamp-1">
            {logs[0] || "Ready for biometric and vocal synchronization."}
          </div>
          <span className="text-[9px] font-bold text-slate-800 font-mono">18:59 PM</span>
        </div>
      </footer>
    </div>
  );
};

export default InterviewSession;
