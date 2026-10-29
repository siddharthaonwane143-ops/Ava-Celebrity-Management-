import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Bot,
  User as UserIcon,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

interface VoiceConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const VoiceConciergeModal: React.FC<VoiceConciergeModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Greetings. I am the AVA Celebrity Concierge. How may I assist your agency booking, talent search, or audition inquiry today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Speech Recognition if browser supports it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            handleSendMessage(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: textToSend.trim() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          conversationHistory: updatedHistory,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from AI Concierge');
      }

      const data = await res.json();
      const modelText = data.text || 'I apologize, but I could not formulate a response.';
      setMessages((prev) => [...prev, { role: 'model', text: modelText }]);
      speakText(modelText);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'I apologize, an error occurred communicating with the concierge service. Please submit a direct booking inquiry via our booking desk.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I book a celebrity appearance?',
    'What categories of talent are available?',
    'How can artists join the AVA roster?',
    'What are the requirements for auditions?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="card-luxury w-full max-w-xl rounded-2xl border-gold-glow flex flex-col h-[650px] max-h-[90vh] bg-[#0A0A0E] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D4AF37]/25 flex items-center justify-between bg-gradient-to-r from-[#200A12] via-[#0E0E14] to-[#1F180A]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
                onClose();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/60 hover:bg-black text-gray-300 hover:text-[#F3D068] border border-white/20 hover:border-[#D4AF37] text-xs font-cinzel font-bold transition flex items-center gap-1 cursor-pointer"
              title="मागे जा / Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">← Back</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#181824] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
                AVA AI Voice Concierge
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/30">
                  LIVE
                </span>
              </h3>
              <span className="text-[11px] text-gray-400 block font-light">
                Intelligent Agency & Booking Advisory
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                if (speechEnabled && typeof window !== 'undefined') {
                  window.speechSynthesis?.cancel();
                }
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#D4AF37] transition"
              title={speechEnabled ? 'Mute Voice' : 'Enable Voice'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
                onClose();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-full bg-[#1A1A24] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-medium shadow-md'
                    : 'bg-[#14141C] text-gray-200 border border-gold-subtle'
                }`}
              >
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#350B16] border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5 text-xs font-bold">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-full bg-[#1A1A24] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#14141C] border border-gold-subtle px-4 py-3 rounded-2xl text-xs text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span>Consulting agency roster & database...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#0C0C12] overflow-x-auto scrollbar-none flex gap-2">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-[#161620] hover:bg-[#20202E] border border-white/10 hover:border-[#D4AF37]/50 text-gray-300 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="p-4 border-t border-white/10 bg-[#0A0A0E] flex items-center gap-2">
          {/* Voice Mic Toggle */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full border transition flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-[#161620] text-[#D4AF37] border-gold-subtle hover:border-[#D4AF37]'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to Speak'}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={isListening ? 'Listening to your speech...' : 'Ask about bookings, stars, auditions...'}
            className="flex-1 bg-[#14141C] border border-white/10 rounded-full py-2.5 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || loading}
            className="btn-gold p-3 rounded-full text-black disabled:opacity-40 disabled:pointer-events-none shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
