import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  Volume2,
  VolumeX,
  Bot,
  User as UserIcon,
  RotateCcw,
  Mic,
  MicOff,
  Calendar,
  FileText,
  PhoneCall,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Check,
  Download,
  Languages,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import jsPDF from 'jspdf';

interface AICelebrityChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenBooking: () => void;
  onNavigateRoster?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  actionType?: 'booking' | 'roster' | 'contact' | 'pdf';
  time: string;
  recommendedArtist?: string;
  estimatedFee?: string;
}

type SupportedLang = 'mr' | 'hi' | 'en';

const QUICK_PROMPTS_BY_LANG: Record<SupportedLang, Array<{ label: string; prompt: string }>> = {
  mr: [
    {
      label: '🎤 कलाकार कसा बुक करावा?',
      prompt: 'मला एका नामांकित सेलिब्रिटी/गायकाला इव्हेंटसाठी बुक करायचे आहे. संपूर्ण प्रक्रिया आणि अटी काय आहेत?',
    },
    {
      label: '💰 मानधन व फी अंदाज',
      prompt: 'मराठी व बॉलिवूड कलाकारांचे अंदाजे मानधन, ॲडव्हान्स टोकन आणि सिक्युरिटी रायडर्स काय असतात?',
    },
    {
      label: '📄 १-पाना PDF पास कसा मिळतो?',
      prompt: 'बुकिंग किंवा इन्क्वायरीनंतर १-पानाचा अधिकृत पीडीएफ डॉसियर कसा मिळतो आणि त्यात काय तपशील असतात?',
    },
    {
      label: '🎭 ऑडिशन कशी द्यावी?',
      prompt: 'नवीन कलाकारांसाठी ऑडिशन्स व प्रोफाइल कसे तयार करायचे?',
    },
    {
      label: '🌟 शोरील व व्हिडिओ पाहणे',
      prompt: 'कलाकारांचे ॲक्टिंग शोरील, मोनोलॉग आणि डान्स व्हिडिओ कुठे पाहता येतील?',
    },
    {
      label: '📞 थेट टीमशी संपर्क',
      prompt: 'मला AVA सेलिब्रिटी डायरेक्टोरेट टीमशी थेट संपर्क साधायचा आहे.',
    },
  ],
  hi: [
    {
      label: '🎤 सेलिब्रिटी कैसे बुक करें?',
      prompt: 'मुझे किसी सेलिब्रिटी, गायक या अभिनेता को इवेंट के लिए बुक करना है। पूरी बुकिंग प्रक्रिया क्या है?',
    },
    {
      label: '💰 फीस और बजट का अनुमान',
      prompt: 'कलाकारों की अनुमानित फीस, एडवांस टोकन और वीआईपी सिक्योरिटी राइडर्स क्या होते हैं?',
    },
    {
      label: '📄 1-पेज ऑफिशियल PDF पास',
      prompt: 'बुकिंग के बाद 1-पेज का ऑफिशियल पीडीएफ पास और डॉसियर कैसे मिलता है?',
    },
    {
      label: '🎭 ऑडिशन और कास्टिंग',
      prompt: 'नए कलाकारों के लिए ऑडिशन और प्रोफाइल सबमिशन की क्या प्रक्रिया है?',
    },
    {
      label: '📞 वीआईपी सपोर्ट टीम',
      prompt: 'मुझे AVA सेलिब्रिटी मैनेजमेंट टीम से सीधे बात करनी है।',
    },
  ],
  en: [
    {
      label: '🎤 How to Book VIP Artists?',
      prompt: 'How can I book a celebrity, singer, or anchor for our upcoming luxury event? Please guide me through the official procedure.',
    },
    {
      label: '💰 Commercial Rates & Budgeting',
      prompt: 'What are the commercial rate benchmarks, advance retainer, and hospitality riders for A-list talent?',
    },
    {
      label: '📄 1-Page Official PDF Dossier',
      prompt: 'How do I receive the official 1-page A4 booking dossier and contract rider pass?',
    },
    {
      label: '🎭 Auditions & Casting Calls',
      prompt: 'How do aspiring artists apply for auditions and submit their acting monologues or showreels?',
    },
    {
      label: '📞 Direct Agency Concierge',
      prompt: 'I want to speak directly with the AVA Celebrity Executive Director desk.',
    },
  ],
};

export const AICelebrityChatbot: React.FC<AICelebrityChatbotProps> = ({
  isOpen,
  onToggle,
  onOpenBooking,
  onNavigateRoster,
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLang>('mr');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'model',
      text: 'नमस्कार! मी **आर्या (Arya)**, AVA सेलिब्रिटी मॅनेजमेंटची अधिकृत व्हर्च्युअल एआय असिस्टंट. ✨\n\nआपल्या इव्हेंटसाठी नामांकित सेलिब्रिटी, अभिनेता, अभिनेत्री, गायक किंवा इन्फ्लुएन्सर बुकिंग, १-पाना अधिकृत पीडीएफ पास, फी अंदाज किंवा इतर कोणत्याही सेवेबद्दल मी आपल्याला मदत करू शकते. आपण मराठी, Hindi किंवा English मध्ये बोलू किंवा विचारू शकता.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Speech Recognition Setup mapped to language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLang === 'mr' ? 'mr-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-US';

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
  }, [selectedLang]);

  const toggleMic = (startImmediate = false) => {
    if (!recognitionRef.current) {
      alert('Speech-to-text is not supported in this browser. Please type your query in the text box.');
      return;
    }

    if (isListening && !startImmediate) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (!isOpen) {
        onToggle();
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Speak AI response in high-fidelity female voice
  const speakResponse = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean markdown asterisks for speech
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    const langCode = selectedLang === 'mr' ? 'mr-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('neerja') ||
          v.name.toLowerCase().includes('zira')) &&
        (v.lang.startsWith(selectedLang) || v.lang.startsWith('en'))
    ) || voices.find((v) => v.lang.startsWith(selectedLang)) || voices.find((v) => v.lang === 'en-IN') || voices[0];

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: prompt.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          conversationHistory: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const data = await res.json();
      const replyText =
        data.text ||
        'नक्कीच! AVA सेलिब्रिटी मॅनेजमेंटच्या अधिकृत डेस्कवर आपण कलाकारांची माहिती व बुकिंग थेट करू शकता.';

      // Determine context action button
      let action: 'booking' | 'roster' | 'contact' | 'pdf' | undefined;
      const lower = prompt.toLowerCase();
      if (lower.includes('book') || lower.includes('बुकिंग') || lower.includes('किंमत') || lower.includes('cost') || lower.includes('hire') || lower.includes('बुक')) {
        action = 'booking';
      } else if (lower.includes('roster') || lower.includes('कलाकार') || lower.includes('actor') || lower.includes('singer') || lower.includes('व्हिडिओ') || lower.includes('शोरील')) {
        action = 'roster';
      } else if (lower.includes('pdf') || lower.includes('दस्तऐवज') || lower.includes('pass') || lower.includes('पास')) {
        action = 'pdf';
      } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('संपर्क') || lower.includes('मदत')) {
        action = 'contact';
      }

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: replyText,
        actionType: action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
      speakResponse(replyText);
    } catch (err: any) {
      console.warn('Using intelligent local concierge response:', err?.message);
      let localReply =
        'AVA सेलिब्रिटी मॅनेजमेंटमध्ये आपले स्वागत आहे! आमच्या अधिकृत रोस्टरवर महाराष्ट्रातील व भारतातील अव्वल कलाकार उपलब्ध आहेत. कोणत्याही कलाकारासाठी अधिकृत कोटेशन व १-पाना पीडीएफ डॉसियर मिळवण्यासाठी कृपया बुकिंग फॉर्म भरा.';

      const lower = prompt.toLowerCase();
      if (lower.includes('book') || lower.includes('बुकिंग') || lower.includes('बुक')) {
        localReply =
          'कलाकार बुकिंगसाठी प्रक्रिया अतिशय सोपी आहे:\n१. खालील "Book Celebrity Now" बटणावर क्लिक करा.\n२. इव्हेंट तारीख, वेळ, शहर व आवश्यक कलाकार निवडा.\n३. सबमिट करताच संपूर्ण माहितीसह एक-पानाचा अधिकृत पीडीएफ पास त्वरित डाऊनलोडसाठी उपलब्ध होईल!';
      } else if (lower.includes('pdf') || lower.includes('दस्तऐवज') || lower.includes('pass') || lower.includes('पास')) {
        localReply =
          'होय! व्ह्यूअर पॅनलमध्ये कोठेही दर किंवा किमती दाखवल्या जात नाहीत. परंतु जेव्हा आपण बुकिंग किंवा इन्क्वायरी सबमिट करता, तेव्हा आपल्यासाठी १-पानाचा पूर्ण कव्हर (A4 size) अधिकृत पीडीएफ डॉसियर तयार होतो. यामध्ये क्लायंट माहिती, इव्हेंट शेड्युल, सिक्युरिटी प्रोटोकॉल आणि क्यूआर कोड सील असतो.';
      } else if (lower.includes('फी') || lower.includes('fee') || lower.includes('किंमत')) {
        localReply =
          'कलाकारांची फी त्यांच्या कॅटेगरी, इव्हेंट स्वरूप (लाईव्ह परफॉर्मन्स, उद्घाटन, जाहिरात), आणि वेळेनुसार ठरवली जाते. खालील "Book Celebrity Now" फॉर्ममध्ये आपले बजेट नमूद करून त्वरित अधिकृत कोटेशन मागवू शकता.';
      }

      const modelMsg: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: localReply,
        actionType: 'booking',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
      speakResponse(localReply);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDossier = (title = 'AVA_Booking_Guidance_Pass') => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(212, 175, 55);
      doc.text('AVA CELEBRITY MANAGEMENT', 20, 22);

      doc.setFontSize(10);
      doc.setTextColor(140, 140, 140);
      doc.text('OFFICIAL VIP ARTIST DOSSIER & BOOKING PASS • A4 PROTOCOL', 20, 28);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 130, 28);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.6);
      doc.line(20, 32, 190, 32);

      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('1. OFFICIAL BOOKING & CONTRACT PROTOCOLS', 20, 42);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);

      const guidanceText = [
        '• Engagement Integrity: All AVA artist appearances are formalized via standard bipartite agency agreements.',
        '• Retainer & Hold: A 50% advance retainer confirms non-exclusive or exclusive calendar block.',
        '• Security & Transit: Tier-1 and Tier-2 celebrity packages include certified security details and airport escort.',
        '• Confidentiality: Non-disclosure provisions protect all promotional campaign agreements prior to public reveal.',
        '• Verified Quotes: To finalize verified quotes, submit your dates through our official VIP Booking Desk.'
      ];

      let yPos = 50;
      guidanceText.forEach((line) => {
        doc.text(line, 20, yPos);
        yPos += 7;
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(20, 20, 20);
      doc.text('2. AGENCY HEADQUARTERS & DIRECT ACCESS', 20, yPos + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text('Directorate of Talent Relations, AVA Celebrity Management', 20, yPos + 14);
      doc.text('Location: Bandra Kurla Complex (BKC) & Andheri West, Mumbai, Maharashtra', 20, yPos + 20);
      doc.text('Official Contact: VIP Artist Booking Directorate Desk', 20, yPos + 26);

      doc.setDrawColor(220, 220, 220);
      doc.rect(20, yPos + 34, 170, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(212, 175, 55);
      doc.text('[ OFFICIAL AGENCY VERIFICATION SEAL ]', 25, yPos + 44);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Authenticated via AVA Central Database Bridge. Present this document during contract signing.', 25, yPos + 52);

      doc.save(`${title}.pdf`);
    } catch (e) {
      console.error('PDF error', e);
    }
  };

  const handleResetChat = () => {
    const greetingText =
      selectedLang === 'mr'
        ? 'नमस्कार! मी **आर्या (Arya)**, AVA सेलिब्रिटी मॅनेजमेंटची अधिकृत व्हर्च्युअल असिस्टंट. मी आपल्या सेवेसाठी सदैव तत्पर आहे. नवीन प्रश्न विचारू शकता.'
        : selectedLang === 'hi'
        ? 'नमस्ते! मैं **आर्या (Arya)**, AVA सेलिब्रिटी मैनेजमेंट की ऑफिशियल वर्चुअल असिस्टेंट हूँ। आपकी क्या सहायता करूँ?'
        : 'Hello! I am **Arya**, the official AVA Celebrity AI Concierge. How may I assist your booking, talent search, or event schedule today?';

    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'model',
        text: greetingText,
        time: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Interactive Luxury Concierge Dock (Minimized State) */}
      {!isOpen && (
        <aside
          aria-label="Floating Interactive AI Concierge Dock"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 transition-all duration-300"
        >
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#0B0B14]/90 border border-[#D4AF37]/50 shadow-[0_8px_32px_rgba(212,175,55,0.35)] backdrop-blur-2xl">
            {/* Main Interactive Capsule Button */}
            <button
              onClick={onToggle}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3D068] flex items-center justify-center text-black font-black shadow-md group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B0B14] animate-pulse" />
              </div>

              <div className="text-left pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-cinzel text-xs font-bold text-[#F3D068] whitespace-nowrap">
                    Arya AI
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F3D068] uppercase font-mono">
                    {selectedLang}
                  </span>
                </div>
                <span className="text-[10px] text-gray-300 block font-light whitespace-nowrap">
                  {selectedLang === 'mr' ? 'व्हॉईस असिस्टंट' : selectedLang === 'hi' ? 'वॉइस असिस्टेंट' : 'Voice Concierge'}
                </span>
              </div>
            </button>

            {/* Direct 1-Tap Mic Action */}
            <button
              onClick={() => toggleMic(true)}
              className="p-2.5 rounded-full bg-[#1A1A26] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/60 text-[#F3D068] transition cursor-pointer shadow-sm"
              title="Speak Now (माईकवर बोला)"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Direct 1-Tap Booking Launcher */}
            <button
              onClick={onOpenBooking}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full btn-gold text-black text-[10px] font-bold font-cinzel cursor-pointer transition shadow"
              title="Quick Booking Desk"
            >
              <Calendar className="w-3 h-3 text-black" />
              <span>बुकिंग</span>
            </button>
          </div>
        </aside>
      )}

      {/* Interactive Chat Window Modal (Expanded State) */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[650px] z-50 flex flex-col bg-[#0B0B14] sm:rounded-2xl border-2 border-[#D4AF37]/80 shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-3xl">
          {/* Header Bar */}
          <div className="p-3.5 bg-gradient-to-r from-[#1A1220] via-[#0F0F1A] to-[#1C150A] border-b border-[#D4AF37]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6212] flex items-center justify-center text-black font-black shadow">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B0B14]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-cinzel text-xs font-black text-[#F3D068] tracking-wider uppercase">
                    Arya • AI Concierge
                  </h3>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-semibold">
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 block font-light">
                    Smart Talent & Booking Assistant
                  </span>
                  {/* Realtime Waveform animation when listening or speaking */}
                  {(isListening || isSpeaking) && (
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-3 bg-[#D4AF37] animate-pulse rounded-full" />
                      <span className="w-0.5 h-2 bg-[#F3D068] animate-pulse rounded-full delay-75" />
                      <span className="w-0.5 h-3.5 bg-emerald-400 animate-pulse rounded-full delay-150" />
                      <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls: Reset, Audio, Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  speechEnabled
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#F3D068]'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
                title={speechEnabled ? 'Mute AI Voice' : 'Enable AI Voice Output'}
              >
                {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                title="Close Concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multilingual Selector Segmented Bar */}
          <div className="px-3 py-1.5 bg-[#0D0D16] border-b border-white/5 flex items-center justify-between shrink-0 text-xs">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Languages className="w-3 h-3 text-[#D4AF37]" />
              <span>Language:</span>
            </span>

            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setSelectedLang('mr')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedLang === 'mr' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setSelectedLang('hi')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedLang === 'hi' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setSelectedLang('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  selectedLang === 'en' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Quick Questions Carousel */}
          <div className="px-3 py-2 bg-[#0E0E16] border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_PROMPTS_BY_LANG[selectedLang].map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37]/15 text-gray-300 hover:text-[#F3D068] border border-white/10 hover:border-[#D4AF37]/40 text-[10px] transition cursor-pointer shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 space-y-3.5 overflow-y-auto bg-[radial-gradient(#D4AF37_0.5px,transparent_0.5px)] [background-size:24px_24px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6212] flex items-center justify-center text-black shrink-0 shadow-md">
                    <Bot className="w-3.5 h-3.5 text-black" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#B38728] to-[#8C6212] text-black font-medium rounded-tr-none'
                      : 'bg-[#151520] border border-[#D4AF37]/30 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Context Action Buttons inside message */}
                  {msg.actionType === 'booking' && (
                    <div className="pt-2.5 mt-2 border-t border-white/10 flex flex-wrap gap-2">
                      <button
                        onClick={onOpenBooking}
                        className="btn-gold px-3 py-1.5 rounded-lg font-cinzel text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer"
                      >
                        <Calendar className="w-3 h-3 text-black" />
                        <span>Book Celebrity Now (बुकिंग फॉर्म)</span>
                      </button>

                      <button
                        onClick={() => handleDownloadDossier('AVA_Celebrity_Booking_Pass')}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-[#D4AF37]" />
                        <span>१-पाना PDF पास</span>
                      </button>
                    </div>
                  )}

                  {msg.actionType === 'roster' && (
                    <div className="pt-2.5 mt-2 border-t border-white/10 flex flex-wrap gap-2">
                      {onNavigateRoster && (
                        <button
                          onClick={onNavigateRoster}
                          className="btn-gold px-3 py-1.5 rounded-lg font-cinzel text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-black" />
                          <span>View VIP Roster (कलाकार यादी)</span>
                        </button>
                      )}
                      <button
                        onClick={onOpenBooking}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        <span>Book Directly</span>
                      </button>
                    </div>
                  )}

                  {msg.actionType === 'pdf' && (
                    <div className="pt-2.5 mt-2 border-t border-white/10 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDownloadDossier('AVA_Official_Artist_Dossier')}
                        className="btn-gold px-3 py-1.5 rounded-lg font-cinzel text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-black" />
                        <span>Download 1-Page PDF Dossier</span>
                      </button>
                      <button
                        onClick={onOpenBooking}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        <span>Inquire Now</span>
                      </button>
                    </div>
                  )}

                  {msg.actionType === 'contact' && (
                    <div className="pt-2.5 mt-2 border-t border-white/10 flex flex-wrap gap-2">
                      <a
                        href="https://wa.me/919820012345"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] flex items-center gap-1 shadow cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp VIP Desk</span>
                      </a>
                      <button
                        onClick={onOpenBooking}
                        className="btn-gold px-3 py-1.5 rounded-lg font-cinzel text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer"
                      >
                        <Calendar className="w-3 h-3 text-black" />
                        <span>Official Booking Desk</span>
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-black/60 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 shrink-0">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6212] flex items-center justify-center text-black shrink-0">
                  <Bot className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="bg-[#151520] border border-[#D4AF37]/30 rounded-2xl p-3 text-xs text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                  <span>Arya is analyzing & typing... (उत्तर तयार करत आहे...)</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Listening Live Indicator Strip */}
          {isListening && (
            <div className="px-3.5 py-2 bg-rose-950/60 border-t border-rose-500/40 flex items-center justify-between text-xs text-rose-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>
                  {selectedLang === 'mr' ? 'ऐकत आहे... बोला' : selectedLang === 'hi' ? 'सुन रहे हैं... बोलिए' : 'Listening... speak clearly'}
                </span>
              </div>
              <button
                onClick={() => toggleMic(false)}
                className="text-[10px] text-rose-200 underline cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Message Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0F0F18] border-t border-[#D4AF37]/30 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={() => toggleMic(false)}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              title="Speak into mic (माईकवर बोला)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#D4AF37]" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedLang === 'mr'
                  ? 'प्रश्न विचारा (उदा. कलाकार फी, ऑडिशन, बुकिंग)...'
                  : selectedLang === 'hi'
                  ? 'सवाल पूछें (उदा. सेलिब्रिटी बुकिंग, फीस, ऑडिशन)...'
                  : 'Ask anything (e.g. artist fee, bookings, audition)...'
              }
              className="flex-1 bg-black/60 border border-white/10 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn-gold p-2.5 rounded-xl text-black disabled:opacity-40 transition cursor-pointer shadow-md"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
