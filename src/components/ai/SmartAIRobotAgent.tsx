import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Send,
  Bot,
  Volume2,
  VolumeX,
  ExternalLink,
  CalendarCheck,
  Search,
  CheckCircle2,
  ChevronRight,
  Tv,
  Radio,
  Cpu,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe,
  Layers,
  ArrowRight,
  Video,
  Eye,
  Film
} from 'lucide-react';
import { SmartRobot3DCanvas, RobotMood } from './SmartRobot3DCanvas';
import { ROBOT_FLEET, RobotSpecialist, RobotSpecialistId } from './robotFleetData';
import { LiveCinematicRobotFeed, VideoOperationType } from './LiveCinematicRobotFeed';
import { TalentProfile } from '../../types';
import { getTalentProfiles } from '../../services/dbService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'robot';
  text: string;
  timestamp: string;
  language: 'mr' | 'hi' | 'en';
  robotId: RobotSpecialistId;
  recommendedTalent?: TalentProfile[];
  actionType?: 'booking' | 'talent' | 'rates' | 'auditions' | 'shows';
}

interface SmartAIRobotAgentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (talentTitle?: string) => void;
  onNavigateToTalent: (slug?: string) => void;
}

export const SmartAIRobotAgent: React.FC<SmartAIRobotAgentProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onNavigateToTalent
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'mr' | 'hi' | 'en'>('mr');
  const [activeRobotId, setActiveRobotId] = useState<RobotSpecialistId>('prime');
  const [tvViewMode, setTvViewMode] = useState<'3d' | 'video' | 'split'>('3d');
  const [activeVideoOp, setActiveVideoOp] = useState<VideoOperationType>('profile_scan');
  const [mood, setMood] = useState<RobotMood>('idle');
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [workingProgress, setWorkingProgress] = useState<string | null>(null);
  const [currentTimecode, setCurrentTimecode] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const activeRobot: RobotSpecialist =
    ROBOT_FLEET.find((r) => r.id === activeRobotId) || ROBOT_FLEET[0];

  // Real-time TV Timecode Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setCurrentTimecode(`${timeStr}:${ms}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 100);
    return () => clearInterval(interval);
  }, []);

  // Fetch verified talent database
  useEffect(() => {
    getTalentProfiles(true)
      .then((data) => setTalents(data))
      .catch(() => {});
  }, []);

  // Reset or Switch Welcome Message when Language or Initial Mount occurs (PURE LANGUAGE - NO MIXING)
  useEffect(() => {
    const welcomeText =
      selectedLanguage === 'mr'
        ? 'सप्रेम नमस्कार! मी AVA स्वायत्त ५५ इंची डिजिटल एलईडी स्क्रीनवरील स्मार्ट AI रोबोट आहे. आमच्या ११ विशेष सायबरनेटिक रोबोट्सचे जाळे थेट तुमच्या सेवेसाठी सज्ज आहे. सांगा, मी आपल्यासाठी कोणते कार्य करू?'
        : selectedLanguage === 'hi'
        ? 'सादर प्रणाम! मैं AVA 55 इंच डिजिटल एलईडी स्क्रीन का स्मार्ट AI रोबोट हूँ। हमारे 11 विशेषज्ञ रोबोट्स का नेटवर्क आपकी सेवा के लिए तत्पर है। कृपया बताएं, आज मैं आपकी क्या सहायता कर सकता हूँ?'
        : 'Greetings! I am the AVA 55-inch Digital 4K LED Smart AI Executive Robot. Our fleet of 11 cybernetic specialists is online and ready to assist you. How may I serve your booking needs today?';

    setChatMessages([
      {
        id: `welcome-${selectedLanguage}`,
        sender: 'robot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
        robotId: 'prime'
      }
    ]);

    // Setup Web Speech API with STRICT Language locale
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        selectedLanguage === 'mr' ? 'mr-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMood('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setMood('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (mood === 'listening') setMood('idle');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, mood, workingProgress, tvViewMode]);

  // Pure Voice Speech Synthesis (Strict Language enforcement)
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        selectedLanguage === 'mr' ? 'mr-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => setMood('speaking');
      utterance.onend = () => setMood('idle');
      utterance.onerror = () => setMood('idle');

      window.speechSynthesis.speak(utterance);
    } catch {
      setMood('idle');
    }
  };

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      const alertMsg =
        selectedLanguage === 'mr'
          ? 'तुमच्या ब्राउझरमध्ये ध्वनी ओळख प्रणाली उपलब्ध नाही. कृपया टायपिंगचा वापर करा.'
          : selectedLanguage === 'hi'
          ? 'आपके ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है। कृपया टाइप करें।'
          : 'Speech recognition is not supported in this browser. Please use text typing.';
      alert(alertMsg);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setMood('idle');
    } else {
      try {
        recognitionRef.current.lang =
          selectedLanguage === 'mr' ? 'mr-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Voice recognition notice:', err);
      }
    }
  };

  // Autonomous Working Agent with NLP Intent & Robot Fleet Dispatcher (Zero-Mix Pure Language)
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    setInputQuery('');
    setMood('thinking');

    // Add User Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
      robotId: activeRobotId
    };
    setChatMessages((prev) => [...prev, userMsg]);

    const lower = query.toLowerCase();
    let targetRobotId: RobotSpecialistId = 'prime';
    let targetVideoOp: VideoOperationType = 'profile_scan';
    let replyText = '';
    let matchedTalent: TalentProfile[] = [];
    let actionType: 'booking' | 'talent' | 'rates' | 'auditions' | 'shows' = 'booking';
    let progressStep = '';

    // 1. Intent: Rate & Valuation (Apex-Finance Robot)
    if (
      lower.includes('rate') ||
      lower.includes('मानधन') ||
      lower.includes('किंमत') ||
      lower.includes('बजेट') ||
      lower.includes('फीस') ||
      lower.includes('रुपये') ||
      lower.includes('खर्च') ||
      lower.includes('दर') ||
      lower.includes('मानदेय')
    ) {
      targetRobotId = 'finance';
      targetVideoOp = 'rate_calc';
      actionType = 'rates';
      progressStep =
        selectedLanguage === 'mr'
          ? 'मानधन आणि प्रवास भत्त्यांचे व्यावसायिक विश्लेषण पूर्ण झाले...'
          : selectedLanguage === 'hi'
          ? 'मानदेय एवं यात्रा भत्तों का व्यावसायिक विश्लेषण संपन्न हुआ...'
          : 'Calculating verified commercial appearance rates & logistical riders...';

      if (selectedLanguage === 'mr') {
        replyText =
          'कलाकारांचे मानधन हे कार्यक्रमाचे स्वरूप, कालावधी आणि शहर यावर निर्धारित असते. आमच्याकडे अर्धा दिवस, पूर्ण दिवस आणि थेट उपस्थितीचे अधिकृत व्यावसायिक दर उपलब्ध आहेत. मी थेट आरक्षण करण्यासाठी मदत करू शकतो.';
      } else if (selectedLanguage === 'hi') {
        replyText =
          'कलाकारों का मानदेय कार्यक्रम के स्वरूप, समय और शहर के आधार पर तय होता है। हमारे पास आधे दिन, पूरे दिन और लाइव उपस्थिति के आधिकारिक व्यावसायिक दर उपलब्ध हैं। मैं सीधे बुकिंग में आपकी मदद कर सकता हूँ।';
      } else {
        replyText =
          'Celebrity appearance fees are benchmarked by event tier, duration, and Maharashtra location. Verified full-day, half-day, and keynote rates are ready for direct confirmation.';
      }
    }
    // 2. Intent: Auditions & Casting (Chrono-Casting Robot)
    else if (
      lower.includes('audition') ||
      lower.includes('ऑडिशन') ||
      lower.includes('कास्टिंग') ||
      lower.includes('निवड चाचणी') ||
      lower.includes('पात्रता') ||
      lower.includes('रोल') ||
      lower.includes('भूमिका')
    ) {
      targetRobotId = 'casting';
      targetVideoOp = 'profile_scan';
      actionType = 'auditions';
      progressStep =
        selectedLanguage === 'mr'
          ? 'आगामी चित्रपट व मालिका ऑडिशन नियमावली तपासली जात आहे...'
          : selectedLanguage === 'hi'
          ? 'आगामी फिल्मों और नाटकों के लिए ऑडिशन नियमों की जांच की जा रही है...'
          : 'Scanning active casting calls, role criteria, and script submission guidelines...';

      if (selectedLanguage === 'mr') {
        replyText =
          'कास्टिंग आणि ऑडिशन विभागाशी संपर्क जोडला गेला आहे. येथे आगामी मराठी चित्रपट, नाटक आणि वेब मालिकेच्या अधिकृत निवड चाचण्यांची संपूर्ण माहिती आणि नियम उपलब्ध आहेत.';
      } else if (selectedLanguage === 'hi') {
        replyText =
          'कास्टिंग और ऑडिशन विभाग से सीधा संपर्क स्थापित हो गया है। आगामी फिल्मों, नाटकों और धारावाहिकों के लिए ऑडिशन नियमों और पात्रता की संपूर्ण जानकारी उपलब्ध है।';
      } else {
        replyText =
          'Casting and audition registry engaged. Access verified casting calls, audition criteria, and performance requirements for upcoming cinematic productions.';
      }
    }
    // 3. Intent: Talent Search & Matchmaking (Neural-Match / Opti-Lens)
    else if (
      lower.includes('actor') ||
      lower.includes('अभिनेता') ||
      lower.includes('अभिनेत्री') ||
      lower.includes('singer') ||
      lower.includes('गायक') ||
      lower.includes('गाणी') ||
      lower.includes('model') ||
      lower.includes('मॉडेल') ||
      lower.includes('dancer') ||
      lower.includes('नर्तक') ||
      lower.includes('कलाकार')
    ) {
      targetRobotId = 'matchmaker';
      targetVideoOp = 'profile_scan';
      actionType = 'talent';
      progressStep =
        selectedLanguage === 'mr'
          ? '५००+ पडताळणी झालेल्या अधिकृत कलाकारांमधून योग्य निवड केली जात आहे...'
          : selectedLanguage === 'hi'
          ? '500+ सत्यापित कलाकारों में से उपयुक्त चयन किया जा रहा है...'
          : 'Filtering 500+ verified talent profiles for matching genre and availability...';

      // Find real matching talent
      matchedTalent = talents
        .filter((t) => {
          const cat = (t.categorySlug || '').toLowerCase();
          if (lower.includes('actor') || lower.includes('अभिनेता') || lower.includes('अभिनेत्री')) {
            return cat.includes('actor');
          }
          if (lower.includes('singer') || lower.includes('गायक') || lower.includes('गाणी')) {
            return cat.includes('singer');
          }
          if (lower.includes('model') || lower.includes('मॉडेल')) {
            return cat.includes('model');
          }
          if (lower.includes('dancer') || lower.includes('नर्तक')) {
            return cat.includes('dance');
          }
          return true;
        })
        .slice(0, 3);

      if (matchedTalent.length > 0) {
        const names = matchedTalent.map((m) => m.name).join(', ');
        if (selectedLanguage === 'mr') {
          replyText = `तुमच्या कार्यक्रमासाठी हे अव्वल कलाकार उपलब्ध आहेत: ${names}. खालील कार्डवरून आपण त्यांची संपूर्ण माहिती पाहू शकता किंवा थेट आरक्षण करू शकता.`;
        } else if (selectedLanguage === 'hi') {
          replyText = `आपके आयोजन के लिए ये शीर्ष कलाकार उपलब्ध हैं: ${names}. नीचे दिए गए विवरण से आप सीधे आरक्षण कर सकते हैं।`;
        } else {
          replyText = `Here are the top verified artists available for your event: ${names}. You may inspect their profiles or proceed to direct VIP booking.`;
        }
      } else {
        if (selectedLanguage === 'mr') {
          replyText =
            'आमच्याकडे ५०० पेक्षा अधिक पडताळणी झालेले नामांकित कलाकार उपलब्ध आहेत. कृपया आपल्याला कोणत्या शैलीतील कलाकार हवा आहे ते सांगा.';
        } else if (selectedLanguage === 'hi') {
          replyText =
            'हमारे पास 500 से अधिक सत्यापित कलाकार उपलब्ध हैं। कृपया बताएं कि आपको किस विधा के कलाकार की आवश्यकता है।';
        } else {
          replyText =
            'We represent over 500 verified A-list celebrities and regional headliners. Please specify the preferred performance genre.';
        }
      }
    }
    // 4. Intent: Security & Protocol (Aegis-Shield Robot)
    else if (
      lower.includes('security') ||
      lower.includes('सुरक्षा') ||
      lower.includes('बाउंसर') ||
      lower.includes('बंदोबस्त') ||
      lower.includes('संरक्षण')
    ) {
      targetRobotId = 'security';
      targetVideoOp = 'security_protocol';
      actionType = 'booking';
      progressStep =
        selectedLanguage === 'mr'
          ? 'व्हीआयपी सुरक्षा आणि व्यासपीठ बंदोबस्त नियमावली सक्रिय झाली...'
          : selectedLanguage === 'hi'
          ? 'वीआईपी सुरक्षा एवं मंच व्यवस्था नियमावली सक्रिय हो गई...'
          : 'Deploying Tier-1 VIP perimeter escort and red-carpet crowd protection protocol...';

      if (selectedLanguage === 'mr') {
        replyText =
          'व्हीआयपी सुरक्षा आणि गर्दी नियंत्रण कक्ष सक्रिय झाला आहे. सेलिब्रिटींची सुरक्षित ने-आण, अंगरक्षक आणि रेड-कार्पेट सुरक्षेचे संपूर्ण नियोजन केले जाईल.';
      } else if (selectedLanguage === 'hi') {
        replyText =
          'वीआईपी सुरक्षा एवं भीड़ नियंत्रण विभाग सक्रिय हो गया है। सेलिब्रिटीज की सुरक्षित आवाजाही, अंगरक्षकों और रेड-कार्पेट सुरक्षा की पूर्ण योजना तैयार की जाएगी।';
      } else {
        replyText =
          'VIP security and crowd protection protocol engaged. Coordinating executive bodyguards, private transit corridors, and green-room isolation.';
      }
    }
    // 5. Intent: Legal Contracts & NDAs (Cyber-Juris Robot)
    else if (
      lower.includes('contract') ||
      lower.includes('करार') ||
      lower.includes('करारनामा') ||
      lower.includes('अनुबंध') ||
      lower.includes('नियम') ||
      lower.includes('अटी')
    ) {
      targetRobotId = 'legal';
      targetVideoOp = 'contract_draft';
      actionType = 'booking';
      progressStep =
        selectedLanguage === 'mr'
          ? 'कायदेशीर करारनामा व अटींचे प्रारूप तयार केले जात आहे...'
          : selectedLanguage === 'hi'
          ? 'विधिक अनुबंध पत्र एवं शर्तों का प्रारूप तैयार किया जा रहा है...'
          : 'Compiling legally binding artist performance rider and non-disclosure clauses...';

      if (selectedLanguage === 'mr') {
        replyText =
          'कायदेशीर करार कक्ष सज्ज आहे. कलाकार आणि आयोजक यांच्यात १००% सुरक्षित, गोपनीय आणि अधिकृत कामगिरी करारनामा तयार केला जातो.';
      } else if (selectedLanguage === 'hi') {
        replyText =
          'विधिक अनुबंध विभाग तैयार है। कलाकार और आयोजक के मध्य 100% सुरक्षित, गोपनीय और आधिकारिक अनुबंध पत्र तैयार किया जाता है।';
      } else {
        replyText =
          'Legal contract and rider division active. Generating comprehensive performance agreements, non-disclosure riders, and copyright terms.';
      }
    }
    // 6. Intent: Direct Booking (FastTrack-VIP Robot)
    else if (
      lower.includes('book') ||
      lower.includes('बुकिंग') ||
      lower.includes('आरक्षण') ||
      lower.includes('तारीख') ||
      lower.includes('संपर्क') ||
      lower.includes('नोंदणी')
    ) {
      targetRobotId = 'checkout';
      targetVideoOp = 'contract_draft';
      actionType = 'booking';
      progressStep =
        selectedLanguage === 'mr'
          ? 'थेट व्हीआयपी आरक्षण प्रपत्र आणि व्हॉट्सॲप प्रणाली जोडली जात आहे...'
          : selectedLanguage === 'hi'
          ? 'सीधा वीआईपी आरक्षण प्रपत्र एवं व्हाट्सएप प्रणाली जोड़ी जा रही है...'
          : 'Connecting VIP reservation dispatch with direct WhatsApp confirmation...';

      if (selectedLanguage === 'mr') {
        replyText =
          'उत्कृष्ट! थेट व्हीआयपी आरक्षण कक्ष सक्रिय करण्यात आला आहे. "थेट आरक्षण करा" बटण दाबून आपण आपली तारीख सुरक्षित करू शकता. आमचे प्रतिनिधी २ तासांत संपर्क साधतील.';
      } else if (selectedLanguage === 'hi') {
        replyText =
          'उत्तम! सीधा वीआईपी आरक्षण विभाग सक्रिय कर दिया गया है। "सीधा आरक्षण करें" बटन दबाकर आप तिथि सुरक्षित कर सकते हैं। हमारे अधिकारी 2 घंटे के भीतर संपर्क करेंगे।';
      } else {
        replyText =
          'Priority VIP Reservation desk engaged. Click the booking button below to lock in event dates. Our artist coordination desk will respond within two hours.';
      }
    }
    // 7. General / Prime Protocol
    else {
      targetRobotId = 'prime';
      targetVideoOp = 'profile_scan';
      actionType = 'booking';
      progressStep =
        selectedLanguage === 'mr'
          ? 'एव्हीए स्वायत्त प्रणाली संपूर्ण तपासणी करत आहे...'
          : selectedLanguage === 'hi'
          ? 'एवीए स्वायत्त प्रणाली संपूर्ण जांच कर रही है...'
          : 'Executing autonomous talent coordination query on 55" LED TV terminal...';

      if (selectedLanguage === 'mr') {
        replyText =
          'मी समजलो! ५५ इंची डिजिटल स्क्रीनवरून आपण सेलिब्रिटी आरक्षण, मानधन अंदाज आणि थेट कार्यक्रमांचे नियोजन करू शकता. कृपया सांगा, आज कोणत्या कलाकाराची निवड करायची आहे?';
      } else if (selectedLanguage === 'hi') {
        replyText =
          'मैं समझ गया! 55 इंच डिजिटल स्क्रीन से आप सेलिब्रिटी आरक्षण, मानदेय का अनुमान और आयोजनों की योजना बना सकते हैं। कृपया बताएं कि आज किस कलाकार का चयन करना है?';
      } else {
        replyText =
          'Understood. Through this 55" Digital 4K LED Command Display, you can coordinate celebrity bookings, rate benchmarks, and VIP riders. How may I guide your booking today?';
      }
    }

    // Switch active 3D robot and active video action
    setActiveRobotId(targetRobotId);
    setActiveVideoOp(targetVideoOp);
    setWorkingProgress(progressStep);

    // Simulate real-time processing and speak pure text
    setTimeout(() => {
      setWorkingProgress(null);
      const robotMsg: ChatMessage = {
        id: `rob-${Date.now()}`,
        sender: 'robot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
        robotId: targetRobotId,
        recommendedTalent: matchedTalent.length > 0 ? matchedTalent : undefined,
        actionType
      };
      setChatMessages((prev) => [...prev, robotMsg]);
      speakText(replyText);
    }, 600);
  };

  // Quick pure-language prompt chips
  const quickPrompts = [
    {
      label:
        selectedLanguage === 'mr'
          ? '🎭 आघाडीचे अभिनेते'
          : selectedLanguage === 'hi'
          ? '🎭 प्रमुख अभिनेता'
          : '🎭 Leading Actors',
      query:
        selectedLanguage === 'mr'
          ? 'आघाडीचे मराठी आणि हिंदी अभिनेते दाखवा'
          : selectedLanguage === 'hi'
          ? 'प्रमुख मराठी और हिंदी अभिनेता दिखाइए'
          : 'Show leading Marathi and Bollywood actors'
    },
    {
      label:
        selectedLanguage === 'mr'
          ? '🎤 गायक व संगीतकार'
          : selectedLanguage === 'hi'
          ? '🎤 गायक एवं संगीतकार'
          : '🎤 Playback Singers',
      query:
        selectedLanguage === 'mr'
          ? 'कार्यक्रमासाठी प्रसिद्ध गायक व संगीतकार सुचवा'
          : selectedLanguage === 'hi'
          ? 'आयोजन के लिए प्रसिद्ध गायक एवं संगीतकार सुझाइए'
          : 'Recommend top playback singers and musical ensembles'
    },
    {
      label:
        selectedLanguage === 'mr'
          ? '💰 अधिकृत मानधन व दर'
          : selectedLanguage === 'hi'
          ? '💰 आधिकारिक मानदेय दर'
          : '💰 Commercial Rates',
      query:
        selectedLanguage === 'mr'
          ? 'कलाकारांचे मानधन आणि व्यावसायिक दर काय आहेत?'
          : selectedLanguage === 'hi'
          ? 'कलाकारों के मानदेय और व्यावसायिक दर क्या हैं?'
          : 'What are the commercial rate benchmarks for celebrity booking?'
    },
    {
      label:
        selectedLanguage === 'mr'
          ? '🛡️ व्हीआयपी सुरक्षा व्यवस्था'
          : selectedLanguage === 'hi'
          ? '🛡️ वीआईपी सुरक्षा व्यवस्था'
          : '🛡️ VIP Security',
      query:
        selectedLanguage === 'mr'
          ? 'कार्यक्रमातील सेलिब्रिटी सुरक्षा आणि बंदोबस्त कसा असेल?'
          : selectedLanguage === 'hi'
          ? 'समारोह में सेलिब्रिटी सुरक्षा एवं मंच व्यवस्था कैसी होगी?'
          : 'Explain VIP venue security protocol and bouncer escort'
    },
    {
      label:
        selectedLanguage === 'mr'
          ? '🎬 आगामी ऑडिशन माहिती'
          : selectedLanguage === 'hi'
          ? '🎬 आगामी ऑडिशन विवरण'
          : '🎬 Casting Calls',
      query:
        selectedLanguage === 'mr'
          ? 'चित्रपट व मालिकांसाठी चालू असलेल्या ऑडिशनची माहिती द्या'
          : selectedLanguage === 'hi'
          ? 'फिल्मों और नाटकों के लिए वर्तमान ऑडिशन की जानकारी दीजिए'
          : 'Provide details on upcoming casting calls and auditions'
    },
    {
      label:
        selectedLanguage === 'mr'
          ? '📝 थेट व्हीआयपी आरक्षण'
          : selectedLanguage === 'hi'
          ? '📝 सीधा वीआईपी आरक्षण'
          : '📝 VIP Booking',
      query:
        selectedLanguage === 'mr'
          ? 'मला त्वरित एका कार्यक्रमासाठी कलाकार बुक करायचा आहे'
          : selectedLanguage === 'hi'
          ? 'मुझे तुरंत एक समारोह के लिए कलाकार बुक करना है'
          : 'I need to initiate immediate VIP booking for my event'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl overflow-hidden animate-in fade-in duration-300">
      {/* 55-INCH DIGITAL LED TV HARDWARE ENCLOSURE */}
      <div
        className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-[#1E1E28] via-[#101018] to-[#0A0A10] border-2 border-[#D4AF37]/50 shadow-[0_20px_80px_rgba(0,0,0,0.9)] transition-all duration-500"
        style={{
          boxShadow: `0 0 60px ${activeRobot.accentHex}33, 0 25px 90px rgba(0,0,0,0.95)`
        }}
      >
        {/* AMBILIGHT PROJECTION GLOW BEHIND TV SCREEN */}
        <div
          className="absolute -inset-2 rounded-3xl blur-2xl opacity-40 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: activeRobot.accentHex }}
        />

        {/* 55-INCH OLED TV TOP BEZEL & BRAND BADGE */}
        <div className="relative z-10 px-4 py-2 border-b border-white/10 bg-gradient-to-r from-black/80 via-[#0A0A10] to-black/80 rounded-t-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* TV Signal & Source OSD */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3D068] font-mono text-[10px] font-bold">
              <Tv className="w-3.5 h-3.5 text-[#F3D068]" />
              <span>AVA CYBER-VISION 55" OLED 4K PRO</span>
            </div>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>OPTICAL FIBER 120Hz HDR10+</span>
            </span>
            <span className="text-[10px] font-mono text-gray-400 hidden xl:inline">
              TIMECODE: <span className="text-[#F3D068]">{currentTimecode}</span>
            </span>
          </div>

          {/* TV Top Controls: View Mode Switcher, Language (NO MIXING), Audio & Power */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher (3D Hologram vs 4K Live Video Telecast vs Split-View) */}
            <div className="flex items-center bg-black/80 rounded-xl p-0.5 border border-white/15 text-xs font-mono">
              <button
                onClick={() => setTvViewMode('3d')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  tvViewMode === '3d'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="3D Hologram Robot Mode"
              >
                <Bot className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {selectedLanguage === 'mr' ? '३D रोबोट' : selectedLanguage === 'hi' ? '3D रोबोट' : '3D Robot'}
                </span>
              </button>
              <button
                onClick={() => setTvViewMode('video')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  tvViewMode === 'video'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Live 4K Working Video Stream Mode"
              >
                <Video className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {selectedLanguage === 'mr' ? '४K व्हिडिओ' : selectedLanguage === 'hi' ? '4K वीडियो' : '4K Video'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping hidden sm:inline" />
              </button>
              <button
                onClick={() => setTvViewMode('split')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  tvViewMode === 'split'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Split Screen Dual Telecast"
              >
                <Layers className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {selectedLanguage === 'mr' ? 'स्प्लिट' : selectedLanguage === 'hi' ? 'स्प्लिट' : 'Split'}
                </span>
              </button>
            </div>

            {/* Pure Language Selector */}
            <div className="flex items-center bg-black/80 rounded-xl p-0.5 border border-[#D4AF37]/40">
              <button
                onClick={() => setSelectedLanguage('mr')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLanguage === 'mr'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="शुद्ध मराठी भाषा"
              >
                मराठी
              </button>
              <button
                onClick={() => setSelectedLanguage('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLanguage === 'hi'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="शुद्ध हिंदी भाषा"
              >
                हिंदी
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLanguage === 'en'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Pure English"
              >
                EN
              </button>
            </div>

            {/* Mute / Unmute TV Audio */}
            <button
              onClick={() => {
                if (speechEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                setSpeechEnabled(!speechEnabled);
              }}
              className="p-1.5 rounded-lg bg-black/60 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
              title={speechEnabled ? 'Mute TV Sound' : 'Unmute TV Sound'}
            >
              {speechEnabled ? (
                <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* Power / Close TV Display */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-500/30 transition cursor-pointer"
              title="Close 55-inch Display"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 11 SPECIALIZED ROBOTS FLEET CHANNELS STRIP (SMARTLY CONNECTED) */}
        <div className="relative z-10 px-3 py-2 bg-black/90 border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="shrink-0 flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#F3D068] uppercase pr-2 border-r border-white/10">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">11 ROBOTS GRID:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {ROBOT_FLEET.map((robot) => {
              const isActive = robot.id === activeRobotId;
              const name =
                selectedLanguage === 'mr'
                  ? robot.nameMr
                  : selectedLanguage === 'hi'
                  ? robot.nameHi
                  : robot.nameEn;

              return (
                <button
                  key={robot.id}
                  onClick={() => {
                    setActiveRobotId(robot.id);
                    // Match operation based on default action of robot
                    if (robot.id === 'finance') setActiveVideoOp('rate_calc');
                    else if (robot.id === 'legal') setActiveVideoOp('contract_draft');
                    else if (robot.id === 'security') setActiveVideoOp('security_protocol');
                    else setActiveVideoOp('profile_scan');

                    const taskMsg =
                      selectedLanguage === 'mr'
                        ? robot.activeTaskMr
                        : selectedLanguage === 'hi'
                        ? robot.activeTaskHi
                        : robot.activeTaskEn;
                    setWorkingProgress(taskMsg);
                    setTimeout(() => setWorkingProgress(null), 1800);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r font-bold text-black shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: robot.accentHex,
                          color: '#000000',
                          border: `1px solid ${robot.borderHex}`
                        }
                      : {}
                  }
                  title={name}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-black animate-ping' : 'bg-gray-500'
                    }`}
                  />
                  <span>{robot.channel}</span>
                  <span className="hidden md:inline font-sans font-medium">{robot.code}</span>
                  {isActive && (
                    <span className="bg-black/80 text-[#F3D068] text-[8px] font-bold px-1 rounded">
                      ON AIR
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 55-INCH MAIN SCREEN STAGE (SPLIT VIEW: 3D HOLOGRAPHIC CHAMBER / 4K VIDEO FEED + TELEPROMPTER) */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-[#06060A] overflow-hidden">
          {/* LEFT: 3D ROBOT HOLOGRAPHIC CHAMBER OR 4K LIVE VIDEO TELECAST (50% Width on Desktop) */}
          <div
            className={`lg:col-span-6 relative flex flex-col items-center justify-between p-3 sm:p-4 bg-gradient-to-b ${activeRobot.bgGradient} border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden`}
          >
            {/* Holographic Projection Ambient Glow */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle at center, ${activeRobot.accentHex}44 0%, transparent 75%)`
              }}
            />

            {/* Stage Header: Channel, Video Status & View Mode Quick Toggle */}
            <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-mono pb-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/15 text-white">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: activeRobot.accentHex }}
                />
                <span className="font-bold">{activeRobot.channel}</span>
                <span className="text-gray-400">|</span>
                <span className="text-[#F3D068]">{activeRobot.code}</span>
              </div>

              {/* Mode indicator badge */}
              <div className="flex items-center gap-1">
                {tvViewMode === 'video' ? (
                  <span className="px-2 py-0.5 rounded bg-red-600/30 border border-red-500/40 text-red-400 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    <span>4K VIDEO BROADCAST</span>
                  </span>
                ) : tvViewMode === 'split' ? (
                  <span className="px-2 py-0.5 rounded bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                    SPLIT TELECAST
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3D068] text-[10px] font-bold">
                    3D HOLOGRAPHIC
                  </span>
                )}
              </div>
            </div>

            {/* MAIN VISUAL VIEWPORT (DYNAMICALLY SWITCHABLE) */}
            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center min-h-[240px] sm:min-h-[290px]">
              {/* MODE 1: 3D HOLOGRAPHIC ROBOT */}
              {tvViewMode === '3d' && (
                <div className="my-auto py-2 flex flex-col items-center animate-in fade-in duration-200">
                  <SmartRobot3DCanvas
                    specialistId={activeRobot.id}
                    size="hero"
                    mood={mood}
                    enableTracking={true}
                    interactive={true}
                    className="drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                  />

                  {/* Holographic Ring Base Emitter */}
                  <div
                    className="w-36 h-3 rounded-full blur-sm opacity-80 -mt-2 transition-all duration-500"
                    style={{ backgroundColor: activeRobot.accentHex }}
                  />

                  {/* Robot Identity Placard */}
                  <div className="mt-3 text-center">
                    <h4
                      className="font-cinzel text-xs sm:text-sm font-bold tracking-wide"
                      style={{ color: activeRobot.borderHex }}
                    >
                      {selectedLanguage === 'mr'
                        ? activeRobot.nameMr
                        : selectedLanguage === 'hi'
                        ? activeRobot.nameHi
                        : activeRobot.nameEn}
                    </h4>
                    <p className="text-[10px] text-gray-300 font-sans mt-0.5">
                      {selectedLanguage === 'mr'
                        ? activeRobot.roleMr
                        : selectedLanguage === 'hi'
                        ? activeRobot.roleHi
                        : activeRobot.roleEn}
                    </p>
                  </div>

                  {/* Quick Switch Button to 4K Video Telecast */}
                  <button
                    onClick={() => setTvViewMode('video')}
                    className="mt-3 px-3 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-white border border-red-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-105"
                  >
                    <Video className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>
                      {selectedLanguage === 'mr'
                        ? 'थेट व्हिडिओ टेलीकास्ट पहा (Watch 4K Video)'
                        : selectedLanguage === 'hi'
                        ? 'लाइव वीडियो प्रसारण देखें (Watch 4K Video)'
                        : 'Watch Live 4K Video Telecast'}
                    </span>
                  </button>
                </div>
              )}

              {/* MODE 2: 4K LIVE CINEMATIC VIDEO TELECAST STREAM */}
              {tvViewMode === 'video' && (
                <div className="w-full h-full flex flex-col animate-in fade-in duration-200">
                  <LiveCinematicRobotFeed
                    specialistId={activeRobot.id}
                    language={selectedLanguage}
                    preferredOperation={activeVideoOp}
                    onOperationChange={setActiveVideoOp}
                    className="w-full flex-1 shadow-2xl"
                  />

                  {/* Quick Switch Back to 3D Hologram Button */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setTvViewMode('3d')}
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#F3D068] border border-white/10 text-[10px] font-mono inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Bot className="w-3 h-3 text-[#D4AF37]" />
                      <span>
                        {selectedLanguage === 'mr'
                          ? '३D हॉलोग्राम मोडवर परत जा'
                          : selectedLanguage === 'hi'
                          ? '3D होलोग्राम मोड पर लौटें'
                          : 'Return to 3D Hologram'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* MODE 3: SPLIT-VIEW (3D ROBOT ON TOP + LIVE VIDEO STREAM BELOW) */}
              {tvViewMode === 'split' && (
                <div className="w-full h-full flex flex-col gap-2 animate-in fade-in duration-200">
                  {/* Top: 3D Robot Chamber */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/10">
                    <div className="flex items-center gap-2">
                      <SmartRobot3DCanvas
                        specialistId={activeRobot.id}
                        size="sm"
                        mood={mood}
                        enableTracking={true}
                        interactive={false}
                      />
                      <div>
                        <h5 className="font-cinzel text-xs font-bold" style={{ color: activeRobot.borderHex }}>
                          {selectedLanguage === 'mr' ? activeRobot.nameMr : selectedLanguage === 'hi' ? activeRobot.nameHi : activeRobot.nameEn}
                        </h5>
                        <p className="text-[10px] text-gray-400">
                          {selectedLanguage === 'mr' ? '३D हॉलोग्राम कक्ष सक्रिय' : selectedLanguage === 'hi' ? '3D होलोग्राम सक्रिय' : '3D Hologram Active'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      SYNC 100%
                    </span>
                  </div>

                  {/* Bottom: 4K Live Video Stream */}
                  <div className="flex-1 min-h-[190px]">
                    <LiveCinematicRobotFeed
                      specialistId={activeRobot.id}
                      language={selectedLanguage}
                      preferredOperation={activeVideoOp}
                      onOperationChange={setActiveVideoOp}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Telemetry & Audio Equalizer Bar */}
            <div className="relative z-10 w-full flex flex-col items-center gap-1.5 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/20 text-[10px] font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    mood === 'speaking'
                      ? 'bg-emerald-400 animate-ping'
                      : mood === 'listening'
                      ? 'bg-cyan-400 animate-pulse'
                      : mood === 'thinking'
                      ? 'bg-amber-400 animate-spin'
                      : 'bg-[#D4AF37]'
                  }`}
                />
                <span className="text-gray-200">
                  {mood === 'speaking'
                    ? selectedLanguage === 'mr'
                      ? 'रोबोट ध्वनी संवाद सुरू आहे...'
                      : selectedLanguage === 'hi'
                      ? 'रोबोट संवाद बोल रहा है...'
                      : 'Audio Speech Synthesis Active...'
                    : mood === 'listening'
                    ? selectedLanguage === 'mr'
                      ? 'आपला आवाज ऐकत आहे...'
                      : selectedLanguage === 'hi'
                      ? 'आपकी आवाज सुन रहा है...'
                      : 'Listening to your microphone...'
                    : mood === 'thinking'
                    ? selectedLanguage === 'mr'
                      ? 'डेटाबेस विश्लेषण चालू आहे...'
                      : selectedLanguage === 'hi'
                      ? 'डेटाबेस विश्लेषण जारी है...'
                      : 'Analyzing database algorithms...'
                    : selectedLanguage === 'mr'
                    ? '५५" स्क्रीन सज्ज • आदेश द्या'
                    : selectedLanguage === 'hi'
                    ? '55" स्क्रीन तैयार • आदेश दें'
                    : '55" LED TV Connected • Ready'}
                </span>
              </div>

              {/* Live Audio Visualizer Equalizer Bar when Speaking */}
              {mood === 'speaking' && (
                <div className="flex items-center gap-1 h-3">
                  {[40, 80, 60, 100, 70, 90, 50, 85, 65, 95].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-emerald-400 animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: DIGITAL TV TELEPROMPTER & INTERACTIVE CHAT TERMINAL (50% Width) */}
          <div className="lg:col-span-6 flex flex-col min-h-0 bg-[#08080C] relative">
            {/* Real-time Working Pipeline Banner (Triggered when robot executes) */}
            {workingProgress && (
              <div
                className="px-4 py-2 border-b text-xs font-mono font-bold flex items-center justify-between animate-in slide-in-from-top-2"
                style={{
                  backgroundColor: `${activeRobot.accentHex}20`,
                  borderColor: `${activeRobot.borderHex}40`,
                  color: activeRobot.borderHex
                }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 animate-bounce" />
                  <span>{workingProgress}</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded">
                  EXECUTING
                </span>
              </div>
            )}

            {/* Chat & Broadcast Dialogue Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              {chatMessages.map((msg) => {
                const isRobot = msg.sender === 'robot';
                const senderRobot =
                  ROBOT_FLEET.find((r) => r.id === msg.robotId) || activeRobot;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isRobot ? 'justify-start' : 'justify-end'}`}
                  >
                    {isRobot && (
                      <div
                        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-md"
                        style={{
                          backgroundColor: `${senderRobot.accentHex}25`,
                          border: `1px solid ${senderRobot.borderHex}60`
                        }}
                      >
                        <Bot className="w-4 h-4" style={{ color: senderRobot.borderHex }} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-lg ${
                        isRobot
                          ? 'bg-[#111118] border border-white/10 text-gray-100'
                          : 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold shadow-gold'
                      }`}
                    >
                      {/* Teleprompter Message Header */}
                      {isRobot && (
                        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/5 text-[10px] font-mono text-gray-400">
                          <span
                            className="font-bold font-cinzel"
                            style={{ color: senderRobot.borderHex }}
                          >
                            {selectedLanguage === 'mr'
                              ? senderRobot.nameMr
                              : selectedLanguage === 'hi'
                              ? senderRobot.nameHi
                              : senderRobot.nameEn}
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm font-sans whitespace-pre-wrap">{msg.text}</p>

                      {/* Matching Talent Showcase Cards */}
                      {msg.recommendedTalent && msg.recommendedTalent.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                          <p className="text-[10px] font-cinzel font-bold text-[#F3D068] uppercase tracking-wider">
                            {selectedLanguage === 'mr'
                              ? 'अव्वल पडताळणी झालेले कलाकार:'
                              : selectedLanguage === 'hi'
                              ? 'शीर्ष सत्यापित कलाकार:'
                              : 'Verified Talent Matches:'}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.recommendedTalent.map((talent) => (
                              <div
                                key={talent.id}
                                className="p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all flex items-center gap-2.5"
                              >
                                {talent.photoUrl ? (
                                  <img
                                    src={talent.photoUrl}
                                    alt={talent.name}
                                    className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37]/40 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5 text-[#D4AF37]" />
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <h5 className="font-bold text-white text-xs truncate font-cinzel">
                                    {talent.name}
                                  </h5>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    {talent.categoryName || 'Celebrity Artist'}
                                  </p>
                                  <button
                                    onClick={() => {
                                      onOpenBooking(`VIP Booking for ${talent.name}`);
                                      onClose();
                                    }}
                                    className="mt-1 text-[10px] font-bold text-[#F3D068] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>
                                      {selectedLanguage === 'mr'
                                        ? 'थेट बुक करा'
                                        : selectedLanguage === 'hi'
                                        ? 'सीधा बुक करें'
                                        : 'Book Now'}
                                    </span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Direct Booking Button */}
                      {msg.actionType && isRobot && (
                        <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              onOpenBooking(
                                selectedLanguage === 'mr'
                                  ? '५५" AI स्क्रीन थेट आरक्षण'
                                  : selectedLanguage === 'hi'
                                  ? '55" AI स्क्रीन सीधा आरक्षण'
                                  : '55" LED TV VIP Reservation'
                              );
                              onClose();
                            }}
                            className="btn-gold px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold text-black flex items-center gap-1.5 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-black" />
                            <span>
                              {selectedLanguage === 'mr'
                                ? 'थेट व्हीआयपी आरक्षण करा'
                                : selectedLanguage === 'hi'
                                ? 'सीधा वीआईपी आरक्षण करें'
                                : 'Direct VIP Booking'}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              onNavigateToTalent();
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/15 text-xs font-cinzel transition cursor-pointer"
                          >
                            <span>
                              {selectedLanguage === 'mr'
                                ? 'सर्व कलाकार डिरेक्टरी पहा'
                                : selectedLanguage === 'hi'
                                ? 'सभी कलाकार डायरेक्टरी देखें'
                                : 'Explore All Talents'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Pure-Language Recommendation Chips */}
            <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold shrink-0">
                {selectedLanguage === 'mr'
                  ? 'त्वरित प्रश्न:'
                  : selectedLanguage === 'hi'
                  ? 'त्वरित प्रश्न:'
                  : 'QUICK PROMPTS:'}
              </span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-[11px] text-gray-300 hover:text-[#F3D068] transition-all cursor-pointer whitespace-nowrap"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Bottom TV Console Input Bar */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-gradient-to-r from-black via-[#0E0E14] to-black">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input Microphone Button */}
                <button
                  type="button"
                  onClick={toggleVoiceListening}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/15 text-gray-300 hover:text-[#F3D068]'
                  }`}
                  title={
                    isListening
                      ? 'Listening... Click to stop'
                      : selectedLanguage === 'mr'
                      ? 'माईकवर बोला (शुद्ध मराठी)'
                      : selectedLanguage === 'hi'
                      ? 'माइक पर बोलें (शुद्ध हिंदी)'
                      : 'Click to speak'
                  }
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-red-400" />
                  ) : (
                    <Mic className="w-4 h-4 text-[#D4AF37]" />
                  )}
                </button>

                {/* Pure Language Input Field */}
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    selectedLanguage === 'mr'
                      ? '५५" स्क्रीनवर प्रश्न विचारा किंवा कलाकार नाव सांगा...'
                      : selectedLanguage === 'hi'
                      ? '55" स्क्रीन पर प्रश्न पूछें या कलाकार का नाम बताएं...'
                      : 'Ask 55" LED TV Robot or state artist booking requirements...'
                  }
                  className="flex-1 bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-2xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition"
                />

                {/* Send Query Button */}
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || mood === 'thinking'}
                  className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  title="Send Query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 55-INCH OLED TV BOTTOM HARDWARE CHASSIS & GLOWING STAND */}
        <div className="relative z-10 px-4 py-1.5 bg-black rounded-b-2xl border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeRobot.accentHex }}
            />
            <span>
              STATUS: {activeRobot.nameEn.toUpperCase()} • {activeRobot.channel} ENGAGED
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">DOLBY ATMOS 7.1 PRO</span>
            <span className="text-[#D4AF37] font-bold">AVA CELEBRITY MANAGEMENT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
