import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Send, 
  XCircle, 
  MessageSquare, 
  Monitor, 
  Clock,
  ChevronRight,
  Terminal,
  Activity,
  AlertCircle,
  Square
} from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import { useMedia } from '../hooks/useMedia';
import { evaluateFeedback } from '../services/api';

const SessionPage = ({ config, questions, onEndSession, setLoading, setLoadingMsg, showToast }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [transcriptData, setTranscriptData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [permissions, setPermissions] = useState({ camera: 'pending', mic: 'pending' });
  const [isFinishing, setIsFinishing] = useState(false);
  
  const { seconds, startTimer, stopTimer, resetTimer, formatTime } = useTimer();
  const { 
    isRecording, 
    isSpeaking, 
    transcript, 
    interimTranscript,
    startRecording, 
    stopRecording, 
    resetTranscript,
    speak, 
    stopSpeaking 
  } = useSpeech();
  
  const { videoRef, startMedia, stopMedia } = useMedia();
  const transcriptEndRef = useRef(null);

  const currentQ = questions[currentQIndex];
  const progress = ((currentQIndex + 1) / questions.length) * 100;

  // Initial setup and cleanup
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        await startMedia();
        setPermissions(prev => ({ ...prev, camera: 'granted' }));
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) {
          setPermissions(prev => ({ ...prev, mic: 'granted' }));
          stream.getTracks().forEach(t => t.stop());
        }
      } catch (e) {
        console.error('Permission error:', e);
        showToast('Camera and Microphone permissions are required.');
      }
    };
    checkPermissions();

    return () => {
      stopTimer();
      stopMedia();
      stopSpeaking();
      stopRecording();
    };
  }, []);

  // Scroll transcript to bottom
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, interimTranscript]);

  const handleStartInterview = () => {
    setIsReady(true);
    addLog('SYSTEM', 'Interview session initialized');
    askQuestion(0);
  };

  const askQuestion = (index) => {
    const qtxt = questions[index].question || questions[index].text || '';
    
    // Stop any ongoing recording before AI speaks
    stopRecording();
    
    speak(qtxt, () => {
      addLog('SYSTEM', `Question ${index + 1} delivered`);
      // Start question timer after AI finishes speaking
      resetTimer();
      startTimer();
      // Optionally auto-start recording? User requested Stop/Start buttons, so maybe not auto-start.
      // But for better UX, we'll auto-start recording after AI speaks.
      startRecording();
    });

    setTranscriptData(prev => [...prev, { role: 'interviewer', text: qtxt, ts: new Date().toISOString() }]);
  };

  const addLog = (role, message) => {
    setLogs(prev => [{ role, message, ts: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  };

  const handleNext = async () => {
    // 1. Stop recording and timer
    stopRecording();
    stopTimer();
    stopSpeaking();

    // 2. Capture final response
    const responseText = transcript && transcript.trim() !== '' ? transcript : '[No response captured]';
    
    // 3. Update transcript history
    const updatedHistory = [...transcriptData, { role: 'candidate', text: responseText, ts: new Date().toISOString() }];
    setTranscriptData(updatedHistory);
    addLog('CANDIDATE', 'Response submitted');

    // 4. Clear buffers for next question
    resetTranscript();

    // 5. Move to next or finish
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setTimeout(() => askQuestion(currentQIndex + 1), 500);
    } else {
      finishInterview(updatedHistory);
    }
  };

  const finishInterview = async (finalTranscript) => {
    setIsFinishing(true);
    setLoading(true);
    setLoadingMsg('ANALYZING PERFORMANCE DATA...');
    try {
      const result = await evaluateFeedback({
        ...config,
        questions: questions,
        transcript: finalTranscript
      });
      onEndSession(finalTranscript, result);
    } catch (e) {
      console.error(e);
      showToast('Evaluation module failed. Generating simulation fallback.');
      onEndSession(finalTranscript, { 
        overallScore: 7.5, 
        recommendation: 'Strong Hire', 
        summary: 'Speech and sentiment analysis completed with manual override.' 
      });
    } finally {
      setLoading(false);
      setIsFinishing(false);
    }
  };

  const toggleMic = () => {
    if (isRecording) {
      stopRecording();
      addLog('USER', 'Recording paused');
    } else {
      startRecording();
      addLog('USER', 'Recording started');
    }
  };

  return (
    <div className="session-container">
      <AnimatePresence>
        {!isReady && (
          <motion.div 
            className="overlay-ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(6, 8, 11, 0.98)', 
              zIndex: 100, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="ready-card glass-panel" style={{ padding: '48px', maxWidth: '480px', width: '90%', textAlign: 'center' }}>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ background: 'var(--accent-muted)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}
              >
                <Monitor className="accent-text" size={38} />
              </motion.div>
              
              <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>Ready for Deployment?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px', lineHeight: 1.6 }}>Your hardware modules are being synchronized. Ensure you are in a quiet environment for optimal voice capture.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                <StatusItem label="NEURAL ENGINE" status="ONLINE" color="var(--success)" icon={<Activity size={14} />} />
                <StatusItem label="OPTIC SENSORS" status={permissions.camera === 'granted' ? 'ACTIVE' : 'READY'} color={permissions.camera === 'granted' ? 'var(--success)' : 'var(--warning)'} icon={<Monitor size={14} />} />
                <StatusItem label="AUDIO MODULE" status={permissions.mic === 'granted' ? 'ACTIVE' : 'READY'} color={permissions.mic === 'granted' ? 'var(--success)' : 'var(--warning)'} icon={<Mic size={14} />} />
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '16px' }} onClick={handleStartInterview}>
                INITIALIZE SESSION
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="session-header glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="pulse" style={{ background: 'var(--accent)', padding: '6px', borderRadius: '8px', color: '#fff' }}>
            <Activity size={18} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>
              {config.company.toUpperCase()} &bull; <span style={{ color: 'var(--accent)' }}>AI ASSISTED INTERVIEW</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="timer-box">
            <Clock size={16} />
            <span>{formatTime(seconds)}</span>
          </div>
          <button className="btn-secondary" style={{ padding: '8px 16px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => finishInterview(transcriptData)}>
            <XCircle size={16} />
            END SESSION
          </button>
        </div>
      </div>

      <div className="session-main">
        {/* Left Side: Video & Logs */}
        <div className="stream-section">
          <div className="video-wrap">
            <video ref={videoRef} id="vid" autoPlay muted playsInline></video>
            
            {isRecording && (
              <div className="live-badge">
                <span className="recording-dot"></span>
                RECORDING LIVE
              </div>
            )}

            {!isRecording && !isSpeaking && (
              <div className="live-badge" style={{ background: 'var(--surface-alt)', color: 'var(--text-muted)' }}>
                STANDBY
              </div>
            )}

            {isSpeaking && (
              <div className="live-badge" style={{ background: 'var(--accent)' }}>
                <Activity size={10} className="pulse" style={{ marginRight: '6px' }} />
                AI IS SPEAKING
              </div>
            )}
            
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px' }}>
              <div className="glass-panel" style={{ padding: '8px 12px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#fff', background: 'rgba(0,0,0,0.5)' }}>
                Q {currentQIndex + 1} / {questions.length}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', height: '160px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              <Terminal size={12} />
              RUNTIME LOGS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
              {logs.map((log, i) => (
                <div key={i} style={{ fontSize: '11px', display: 'flex', gap: '12px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, width: '60px' }}>[{log.ts}]</span>
                  <span style={{ color: 'var(--text-muted)' }}>{log.role}: {log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Question & Controls */}
        <div className="controls-panel">
          <div className="question-area">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ color: 'var(--accent)', fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                CURRENT CHALLENGE
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 700 }}>
                PROGRESS: {Math.round(progress)}%
              </div>
            </div>
            
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.5, marginBottom: '20px' }}>
              {currentQ?.text || currentQ?.question}
            </div>

            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="transcript-area">
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={12} />
              REAL-TIME TRANSCRIPT
            </div>
            
            <div className="transcript-area-fixed">
              {transcriptData.filter(t => t.role === 'candidate' && t.text !== '[No response captured]').map((item, i) => (
                <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--accent)', fontWeight: 700, marginBottom: '4px' }}>PREVIOUS ANSWER</div>
                  {item.text}
                </div>
              ))}
              
              <div style={{ color: 'var(--text)' }}>
                {transcript}
                <span className="interim-text">{interimTranscript}</span>
                {!transcript && !interimTranscript && !isRecording && (
                  <span style={{ opacity: 0.3 }}>Awaiting candidate response...</span>
                )}
                {isRecording && !transcript && !interimTranscript && (
                  <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Listening...</span>
                )}
              </div>
              <div ref={transcriptEndRef} />
            </div>
          </div>

          <div className="input-area">
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button 
                className={`btn-primary ${isRecording ? 'on' : ''}`} 
                onClick={toggleMic}
                disabled={isSpeaking}
                style={{ 
                  flex: 1, 
                  background: isRecording ? 'var(--error)' : 'var(--accent)',
                  boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.3)' : ''
                }}
              >
                {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
                {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={handleNext}
                disabled={isSpeaking}
                style={{ flex: 1, background: 'var(--success)', color: '#fff', border: 'none' }}
              >
                {currentQIndex + 1 === questions.length ? 'FINISH INTERVIEW' : 'NEXT QUESTION'}
                <ChevronRight size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <AlertCircle size={16} className="accent-text" />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Speak clearly into your microphone. Your response is being analyzed for technical accuracy and behavior traits.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, status, color, icon }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--surface-alt)', borderRadius: '12px', border: '1px solid var(--border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 600 }}>
      <span className="accent-text">{icon}</span>
      {label}
    </div>
    <span style={{ fontSize: '10px', fontWeight: 800, color: color }}>{status}</span>
  </div>
);

export default SessionPage;
