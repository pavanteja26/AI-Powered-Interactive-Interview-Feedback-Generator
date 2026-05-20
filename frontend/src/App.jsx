import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import SessionPage from './pages/SessionPage';
import FeedbackPage from './pages/FeedbackPage';
import HistoryPage from './pages/HistoryPage';
import ArchitecturePage from './pages/ArchitecturePage';
import WorkflowPage from './pages/WorkflowPage';
import Loader from './components/Loader';
import { generateQuestions } from './services/api';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [sessionConfig, setSessionConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleStartSession = async (config) => {
    setLoading(true);
    setLoadingMsg('INITIALIZING NEURAL BRIDGE...');
    
    try {
      const apiQuestions = await generateQuestions(config);
      setQuestions(apiQuestions);
      setSessionConfig(config);
      setCurrentPage('session');
    } catch (error) {
      console.error('Failed to generate questions:', error);
      // Fallback in case of API failure
      const count = parseInt(config.count) || 3;
      const fallbackQuestions = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1} regarding ${config.topic || 'your technical skills'}.`
      }));
      setQuestions(fallbackQuestions);
      setSessionConfig(config);
      setCurrentPage('session');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = (finalTranscript, evaluation) => {
    setTranscript(finalTranscript);
    setFeedback(evaluation);
    setCurrentPage('feedback');
  };

  const handleViewHistoryReport = (session) => {
    setSessionConfig(session.config);
    setTranscript(session.transcript);
    setFeedback(session.feedback);
    setCurrentPage('feedback');
  };

  return (
    <div className="app-container bg-gray-950 min-h-screen text-white">
      {loading && <Loader message={loadingMsg} />}
      
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage 
              onStartSession={handleStartSession}
              showToast={(msg) => console.log(msg)}
              onNavHistory={() => setCurrentPage('history')}
              onNavPage={(page) => setCurrentPage(page)}
            />
          </motion.div>
        )}

        {currentPage === 'session' && sessionConfig && (
          <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SessionPage 
              config={sessionConfig}
              questions={questions}
              onEndSession={handleEndSession}
              setLoading={setLoading}
              setLoadingMsg={setLoadingMsg}
              showToast={(msg) => console.log(msg)}
            />
          </motion.div>
        )}

        {currentPage === 'feedback' && feedback && (
          <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FeedbackPage 
              config={sessionConfig}
              transcript={transcript}
              feedback={feedback}
              onNewSession={() => setCurrentPage('landing')}
            />
          </motion.div>
        )}

        {currentPage === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HistoryPage 
              onBack={() => setCurrentPage('landing')}
              onViewReport={handleViewHistoryReport}
            />
          </motion.div>
        )}

        {currentPage === 'architecture' && (
          <motion.div key="architecture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ArchitecturePage onBack={() => setCurrentPage('landing')} />
          </motion.div>
        )}

        {currentPage === 'workflow' && (
          <motion.div key="workflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WorkflowPage onBack={() => setCurrentPage('landing')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
