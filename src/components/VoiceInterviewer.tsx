import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Volume2, Play, Square, Loader2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInterviewerProps {
  questions: string[];
  jobPost: string;
}

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const VoiceInterviewer: React.FC<VoiceInterviewerProps> = ({ questions, jobPost }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();
  
  // New refs for improved speech handling
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>('');
  const isProcessingRef = useRef<boolean>(false);
  const minimumListeningTimeRef = useRef<NodeJS.Timeout | null>(null);
  const canStopListeningRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        // Don't process if already processing or AI is speaking
        if (isProcessingRef.current || isSpeaking) {
          return;
        }

        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        const finalTranscript = Array.from(event.results)
          .filter(result => result.isFinal)
          .map(result => result[0].transcript)
          .join('');

        // Clear existing silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // If we have a final result and it's different from the last one
        if (finalTranscript && finalTranscript.trim() !== lastTranscriptRef.current.trim()) {
          lastTranscriptRef.current = finalTranscript;
          handleUserSpeech(finalTranscript);
        } else if (transcript) {
          // Set a timer for silence detection (5 seconds minimum)
          silenceTimerRef.current = setTimeout(() => {
            if (canStopListeningRef.current && transcript.trim() && !isProcessingRef.current) {
              lastTranscriptRef.current = transcript;
              handleUserSpeech(transcript);
            }
          }, 5000); // 5 second pause detection
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        canStopListeningRef.current = false;
        
        // Set minimum listening time of 5 seconds
        minimumListeningTimeRef.current = setTimeout(() => {
          canStopListeningRef.current = true;
        }, 5000);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        canStopListeningRef.current = false;
        
        // Clear timers
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        if (minimumListeningTimeRef.current) {
          clearTimeout(minimumListeningTimeRef.current);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        isProcessingRef.current = false;
        
        // Don't show error for aborted recognition (normal when stopping)
        if (event.error !== 'aborted') {
          toast({
            title: "Speech recognition error",
            description: "Please try again or check your microphone permissions.",
            variant: "destructive",
          });
        }
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (minimumListeningTimeRef.current) {
        clearTimeout(minimumListeningTimeRef.current);
      }
    };
  }, [isSpeaking]);

  const handleUserSpeech = async (transcript: string) => {
    if (!transcript.trim() || isProcessingRef.current) return;

    console.log("User said:", transcript);
    setIsListening(false);
    setIsProcessing(true);
    isProcessingRef.current = true;

    // Stop recognition to prevent picking up AI response
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Add user message
    const userMessage: Message = {
      type: 'user',
      content: transcript.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Process the response
    setTimeout(() => {
      const aiResponse = generateAIResponse(transcript);
      const aiMessage: Message = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      isProcessingRef.current = false;
      
      // Speak the AI response
      speakText(aiResponse);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // Enhanced responses with more variety
    const responses = [
      "That's very insightful. Can you elaborate on that aspect a bit more?",
      "I understand. Let me ask you about another important detail...",
      "Great point! This helps clarify the requirements. What about the team dynamics for this role?",
      "Thank you for that clarification. Moving on to the next aspect - what challenges do you anticipate?",
      "Excellent. That gives me a much better picture. How do you measure success in this position?",
      "Interesting perspective. What would you say are the deal-breakers for this role?",
      "That's helpful context. Can you tell me more about the company culture expectations?",
      "I see. What specific skills or experience would make someone stand out for this position?",
      "Good to know. What does the career progression look like for someone in this role?",
      "Thank you for sharing that. What would you say is the most challenging aspect of this position?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakText = (text: string) => {
    if (synthRef.current && text) {
      setIsSpeaking(true);
      
      // Cancel any existing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        // Small delay before allowing new recognition to avoid picking up end of AI speech
        setTimeout(() => {
          console.log('AI finished speaking');
        }, 500);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing && !isSpeaking) {
      lastTranscriptRef.current = '';
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      canStopListeningRef.current = false;
      recognitionRef.current.stop();
      
      // Clear timers
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (minimumListeningTimeRef.current) {
        clearTimeout(minimumListeningTimeRef.current);
      }
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    const welcomeMessage = "Hello! I'm your AI recruitment assistant. I'll be asking you some questions to better understand your hiring needs. Let's start with the first question.";
    const aiMessage: Message = {
      type: 'ai',
      content: welcomeMessage,
      timestamp: new Date(),
    };
    setMessages([aiMessage]);
    speakText(welcomeMessage);
  };

  const stopInterview = () => {
    setInterviewStarted(false);
    setMessages([]);
    setCurrentQuestionIndex(0);
    isProcessingRef.current = false;
    
    // Stop all speech processes
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Clear all timers
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (minimumListeningTimeRef.current) {
      clearTimeout(minimumListeningTimeRef.current);
    }
    
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    canStopListeningRef.current = false;
    lastTranscriptRef.current = '';
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border-2 border-blue-400/40">
          <Mic className="h-12 w-12 text-blue-200" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Ready for Voice Interview</h3>
        <p className="text-slate-200 max-w-md mx-auto text-lg">
          Generate survey questions first to start the AI-powered voice interview.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Interview Controls */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/60 to-blue-800/40 rounded-xl border border-blue-400/30">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Voice Interview Session</h3>
          <p className="text-slate-200 text-lg">
            {interviewStarted ? 'Interview in progress' : 'Ready to start voice interview'}
          </p>
        </div>
        <div className="flex gap-3">
          {!interviewStarted ? (
            <Button 
              onClick={startInterview} 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Interview
            </Button>
          ) : (
            <Button 
              onClick={stopInterview} 
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Square className="h-5 w-5 mr-2" />
              End Interview
            </Button>
          )}
        </div>
      </div>

      {interviewStarted && (
        <>
          {/* Voice Controls */}
          <Card className="bg-gradient-to-br from-slate-700/80 to-blue-700/60 border-2 border-blue-400/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="flex items-center justify-center p-10">
              <div className="flex items-center gap-10">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing || isSpeaking}
                  className={`w-24 h-24 rounded-full shadow-2xl transition-all duration-300 font-bold ${
                    isListening 
                      ? 'bg-gradient-to-br from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 animate-pulse scale-110' 
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:scale-110'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-10 w-10 text-white" />
                  ) : (
                    <Mic className="h-10 w-10 text-white" />
                  )}
                </Button>
                
                <div className="text-center">
                  <div className="flex items-center gap-4 mb-4">
                    {isListening && (
                      <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white animate-pulse border-0 px-4 py-2 text-sm font-semibold">
                        🎤 Listening... (5s minimum)
                      </Badge>
                    )}
                    {isProcessing && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-2 text-sm font-semibold">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </Badge>
                    )}
                    {isSpeaking && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 text-sm font-semibold">
                        <Volume2 className="h-4 w-4 mr-2" />
                        AI Speaking...
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl text-white font-medium">
                    {isListening 
                      ? 'Speak now... (pause 5 seconds to finish)' 
                      : isProcessing 
                        ? 'Processing your response...'
                        : isSpeaking
                          ? 'AI is responding...'
                          : 'Click microphone to speak'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card className="bg-gradient-to-br from-slate-700/90 to-blue-700/70 border-2 border-blue-400/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="border-b border-blue-400/30">
              <CardTitle className="text-white text-xl flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                Conversation History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-5 rounded-xl shadow-lg border ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-400/30'
                            : 'bg-gradient-to-br from-slate-600 to-slate-500 text-white border-slate-400/30'
                        }`}
                      >
                        <p className="text-base leading-relaxed font-medium">{message.content}</p>
                        <p className="text-sm opacity-80 mt-3 font-normal">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-300 text-lg">No messages yet. Start the conversation by speaking!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Current Questions Context */}
          <Card className="bg-gradient-to-br from-amber-700/80 to-yellow-700/60 border-2 border-amber-400/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="border-b border-amber-400/30">
              <CardTitle className="text-white text-xl">Available Questions Context</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {questions.slice(0, 3).map((question, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-amber-200 font-bold text-lg mt-1">•</span>
                    <p className="text-amber-100 text-base leading-relaxed font-medium">
                      {question}
                    </p>
                  </div>
                ))}
                {questions.length > 3 && (
                  <p className="text-amber-200 text-sm font-semibold mt-4 pl-6">
                    +{questions.length - 3} more questions available
                  </p>
                )}
                {questions.length === 0 && (
                  <p className="text-amber-200 text-center py-4">No questions generated yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VoiceInterviewer;
