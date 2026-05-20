import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInterviewSpeechProps {
  onSilenceDetection: (finalTranscript: string) => void;
  isActive: boolean;
}

export const useInterviewSpeech = ({ onSilenceDetection, isActive }: UseInterviewSpeechProps) => {
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isActive) return;

    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Web Speech API is not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let currentFinal = finalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interim);
        setFinalTranscript(currentFinal);
        finalTranscriptRef.current = currentFinal;

        // Reset silence timer on every result
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        silenceTimerRef.current = setTimeout(() => {
          if (finalTranscriptRef.current.trim()) {
            console.log('Silence detected');
            onSilenceDetection(finalTranscriptRef.current.trim());
          }
        }, 2000); // 2 seconds silence
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Restart if interview is active
          if (isActive) recognition.start();
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        if (isActive && isListening) {
          recognition.start();
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  }, [isActive, isListening, onSilenceDetection]);

  const resetTranscript = useCallback(() => {
    setFinalTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  useEffect(() => {
    if (isActive) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [isActive, startListening, stopListening]);

  return {
    interimTranscript,
    finalTranscript,
    isListening,
    resetTranscript,
    startListening,
    stopListening
  };
};
