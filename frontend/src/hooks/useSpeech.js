import { useState, useRef, useEffect, useCallback } from 'react';

export const useSpeech = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isManuallyStoppedRef = useRef(false);

  // Initialize Speech Recognition
  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      console.warn('Speech Recognition not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new Recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        // Prevent loopback if AI is speaking
        if (window.speechSynthesis.speaking) return;

        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscriptRef.current += transcriptPart + ' ';
          } else {
            currentInterim += transcriptPart;
          }
        }
        
        setInterimTranscript(currentInterim);
        setTranscript(finalTranscriptRef.current + currentInterim);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsRecording(false);
          isManuallyStoppedRef.current = true;
        }
      };

      recognition.onend = () => {
        // Auto-restart if we are supposed to be recording and not speaking
        if (!isManuallyStoppedRef.current && !window.speechSynthesis.speaking) {
          try {
            recognition.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    
    // Safety check: stop any existing instances
    try {
      recognitionRef.current.stop();
    } catch (e) {}

    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    isManuallyStoppedRef.current = false;
    setIsRecording(true);

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Start error:', e);
    }
  }, []);

  const stopRecording = useCallback(() => {
    isManuallyStoppedRef.current = true;
    setIsRecording(false);
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const speak = (text, onFinish) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // Temporarily stop recognition to prevent it from "hearing" the computer
    const wasRecording = !isManuallyStoppedRef.current && isRecording;
    if (wasRecording) {
      try { recognitionRef.current?.stop(); } catch(e) {}
    }
    
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (wasRecording) {
        try { recognitionRef.current?.start(); } catch(e) {}
      }
      if (onFinish) onFinish();
    };

    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return { 
    isRecording, 
    isSpeaking, 
    transcript, 
    interimTranscript,
    startRecording, 
    stopRecording, 
    resetTranscript,
    speak, 
    stopSpeaking 
  };
};
