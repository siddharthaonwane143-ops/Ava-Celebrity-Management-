import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  UserCheck,
  FileText,
  Clapperboard,
  Mic,
  MicOff,
  Send,
  X,
  ArrowRight,
  Copy,
  Check,
  Star,
  ShieldCheck,
  TrendingUp,
  Volume2,
  VolumeX,
  Download,
  AlertCircle,
  Crown,
  ArrowLeft,
  Calendar,
  Clock,
  Radio,
  Tv,
  Lock,
  DollarSign,
  ShieldAlert,
  RefreshCw,
  Megaphone,
  Headphones,
  Users,
  Briefcase,
  Layers
} from 'lucide-react';
import jsPDF from 'jspdf';

export type AIToolTab =
  | 'matchmaker'
  | 'bio'
  | 'contract'
  | 'audition'
  | 'vocal'
  | 'press'
  | 'schedule'
  | 'concierge'
  | 'security'
  | 'rateEstimator';

interface AIToolsSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingWithDetails?: (details: { talentName?: string; eventType?: string; budget?: string }) => void;
  initialTab?: AIToolTab;
}

export const AIToolsSuiteModal: React.FC<AIToolsSuiteModalProps> = ({
  isOpen,
  onClose,
  onOpenBookingWithDetails,
  initialTab = 'matchmaker',
}) => {
  const [activeTab, setActiveTab] = useState<AIToolTab>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Clean up speech on close
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // ----------------------------------------------------
  // Tool 1: Talent Matchmaker State
  // ----------------------------------------------------
  const [matchEvent, setMatchEvent] = useState('Luxury Fashion Week Gala & Showstopper');
  const [matchBudget, setMatchBudget] = useState('₹15,00,000 - ₹35,00,000');
  const [matchCity, setMatchCity] = useState('Mumbai / BKC');
  const [matchCategory, setMatchCategory] = useState('Celebrities & Runway Models');
  const [matchRequirements, setMatchRequirements] = useState('A-List red carpet headliner with verified social presence and bilingual hosting ability');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleRunMatchmaker = async () => {
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const res = await fetch('/api/gemini/talent-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: matchEvent,
          budget: matchBudget,
          cityVenue: matchCity,
          preferredCategory: matchCategory,
          requirements: matchRequirements
        })
      });
      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMatchLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 2: Bio & Pitch Generator State
  // ----------------------------------------------------
  const [bioArtistName, setBioArtistName] = useState('Siddharth R.');
  const [bioCategory, setBioCategory] = useState('Supermodels & Actors');
  const [bioHighlights, setBioHighlights] = useState('GQ Best Dressed icon, Milan Fashion Week runway model, 1.2M Instagram followers, brand campaigns with luxury watch & auto labels');
  const [bioTone, setBioTone] = useState('Luxury Haute Couture');
  const [bioLoading, setBioLoading] = useState(false);
  const [bioResult, setBioResult] = useState<any>(null);

  const handleRunBioGenerator = async () => {
    setBioLoading(true);
    setBioResult(null);
    try {
      const res = await fetch('/api/gemini/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName: bioArtistName,
          category: bioCategory,
          achievements: bioHighlights,
          tone: bioTone
        })
      });
      const data = await res.json();
      setBioResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBioLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 3: Contract & Rider Drafter State
  // ----------------------------------------------------
  const [riderClient, setRiderClient] = useState('Armani Group India / Rel Event Media');
  const [riderTalent, setRiderTalent] = useState('A-List Celebrity Supermodel');
  const [riderEvent, setRiderEvent] = useState('Runway Showstopper & Red Carpet Launch');
  const [riderDate, setRiderDate] = useState('November 28, 2026');
  const [riderVenue, setRiderVenue] = useState('The St. Regis Hotel, Lower Parel, Mumbai');
  const [riderDeliverables, setRiderDeliverables] = useState('Opening ramp walk, grand finale showstopper, 3 official media soundbites, 2 Instagram collaborative posts');
  const [riderSpecial, setRiderSpecial] = useState('Strict non-disclosure NDA before 6 PM, 5-star presidential suite greenroom, 4 private security bodyguards');
  const [riderLoading, setRiderLoading] = useState(false);
  const [riderResult, setRiderResult] = useState<any>(null);

  const handleRunRiderDrafter = async () => {
    setRiderLoading(true);
    setRiderResult(null);
    try {
      const res = await fetch('/api/gemini/contract-drafter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: riderClient,
          talentName: riderTalent,
          eventType: riderEvent,
          eventDate: riderDate,
          venue: riderVenue,
          deliverables: riderDeliverables,
          specialClauses: riderSpecial
        })
      });
      const data = await res.json();
      setRiderResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRiderLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 4: Casting Script Evaluator State
  // ----------------------------------------------------
  const [castRole, setCastRole] = useState('Lead Antagonist / Corporate Tycoon');
  const [castProject, setCastProject] = useState('OTT Psychological Thriller (8 Episodes)');
  const [castScript, setCastScript] = useState('Power is never gifted in Mumbai; it is taken while everyone else is busy looking for permission. Look into my eyes and tell me who really runs this boardroom.');
  const [castBackground, setCastBackground] = useState('NSD graduate, 3 theater productions, 2 Hindi commercial ads');
  const [castLoading, setCastLoading] = useState(false);
  const [castResult, setCastResult] = useState<any>(null);

  const handleRunCastingAnalyzer = async () => {
    setCastLoading(true);
    setCastResult(null);
    try {
      const res = await fetch('/api/gemini/casting-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: castRole,
          projectType: castProject,
          monologueText: castScript,
          performerBackground: castBackground
        })
      });
      const data = await res.json();
      setCastResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCastLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 5: VIP Event Run-of-Show & Schedule Drafter
  // ----------------------------------------------------
  const [schedEvent, setSchedEvent] = useState('AVA Luxury Celebrity Red Carpet & Fashion Awards');
  const [schedDate, setSchedDate] = useState('Saturday, December 12, 2026');
  const [schedVenue, setSchedVenue] = useState('Jio World Convention Centre, BKC Mumbai');
  const [schedTalent, setSchedTalent] = useState('Ranveer Kapoor & Supermodel Ensemble');
  const [schedDuration, setSchedDuration] = useState('4.5 Hours');
  const [schedHighlights, setSchedHighlights] = useState('VIP Arrivals, Satellite 4K Live Broadcast, Step-and-Repeat media wall, Runway Showcase, Headline Performance');
  const [schedLoading, setSchedLoading] = useState(false);
  const [schedResult, setSchedResult] = useState<any>(null);

  const handleRunEventScheduler = async () => {
    setSchedLoading(true);
    setSchedResult(null);
    try {
      const res = await fetch('/api/gemini/event-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: schedEvent,
          eventDate: schedDate,
          venue: schedVenue,
          talentName: schedTalent,
          durationHours: schedDuration,
          specialHighlights: schedHighlights
        })
      });
      const data = await res.json();
      setSchedResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSchedLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 6: Concierge Quick Chat State
  // ----------------------------------------------------
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: 'Welcome to the AVA AI Executive Suite. Ask me anything regarding talent booking, contract negotiations, live stage riders, or Marathi & international casting.'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendChat = async (promptText?: string) => {
    const q = promptText || chatInput;
    if (!q.trim() || chatLoading) return;

    const userMessage = { role: 'user' as const, text: q.trim() };
    const updated = [...chatMessages, userMessage];
    setChatMessages(updated);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q.trim(),
          conversationHistory: updated
        })
      });
      const data = await res.json();
      const replyText = data.text || 'Advisory prepared.';
      setChatMessages((prev) => [...prev, { role: 'model', text: replyText }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'model', text: 'Executive concierge connected. Rerouting to verified booking desk.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 7: AI Security & Protocol Planner
  // ----------------------------------------------------
  const [secEventName, setSecEventName] = useState('AVA Luxury Red Carpet Gala & Celebrity Showcase');
  const [secVenue, setSecVenue] = useState('BKC Jio Convention Centre / St. Regis, Mumbai');
  const [secCrowd, setSecCrowd] = useState('1,500 VIP Guests');
  const [secVIPs, setSecVIPs] = useState('A-List Stars, Runway Supermodels & Dignitaries');
  const [secTier, setSecTier] = useState('Tier-1 Presidential Executive Security Protocol');
  const [secLoading, setSecLoading] = useState(false);
  const [secResult, setSecResult] = useState<any>(null);

  const handleRunEventSecurity = async () => {
    setSecLoading(true);
    setSecResult(null);
    try {
      const res = await fetch('/api/gemini/event-security-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: secEventName,
          venueLocation: secVenue,
          expectedCrowd: secCrowd,
          celebrityVIPs: secVIPs,
          isLiveTelecast: true,
          eventTier: secTier
        })
      });
      const data = await res.json();
      setSecResult(data);
    } catch (err) {
      console.warn('Security planner fallback:', err);
    } finally {
      setSecLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 8: AI Talent Rate & Valuation Estimator
  // ----------------------------------------------------
  const [rateTalentName, setRateTalentName] = useState('Professional Marquee Artist');
  const [rateCategory, setRateCategory] = useState('Actors & Actresses');
  const [rateExperience, setRateExperience] = useState('3-5 Years (Feature Films & Ad Campaigns)');
  const [rateDistrict, setRateDistrict] = useState('Mumbai / Pune');
  const [rateType, setRateType] = useState('Stage Performance & Brand Endorsement');
  const [rateLoading, setRateLoading] = useState(false);
  const [rateResult, setRateResult] = useState<any>(null);

  const handleRunRateEstimator = async () => {
    setRateLoading(true);
    setRateResult(null);
    try {
      const res = await fetch('/api/gemini/rate-estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          talentName: rateTalentName,
          category: rateCategory,
          experienceYears: rateExperience,
          locationDistrict: rateDistrict,
          deliverableType: rateType,
          eventDuration: '4 to 8 Hours'
        })
      });
      const data = await res.json();
      setRateResult(data);
    } catch (err) {
      console.warn('Rate estimator fallback:', err);
    } finally {
      setRateLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 9: AI Vocal Coach & Dubbing Director (Agent Aryan)
  // ----------------------------------------------------
  const [vocalScript, setVocalScript] = useState('काळजातली आग डोळ्यात उतरू दे, तेव्हाच पडद्यावरचा अभिनय जिवंत होतो.');
  const [vocalTone, setVocalTone] = useState('Intense Dramatic Resonant');
  const [vocalLanguage, setVocalLanguage] = useState('Marathi (शुद्ध प्रमाण भाषा)');
  const [vocalPerformer, setVocalPerformer] = useState('Dubbing Voice Artist / Lead Actor');
  const [vocalLoading, setVocalLoading] = useState(false);
  const [vocalResult, setVocalResult] = useState<any>(null);

  const handleRunVocalCoach = async () => {
    setVocalLoading(true);
    setVocalResult(null);
    try {
      const res = await fetch('/api/gemini/vocal-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptOrLyrics: vocalScript,
          targetTone: vocalTone,
          dialectOrLanguage: vocalLanguage,
          performerType: vocalPerformer
        })
      });
      const data = await res.json();
      setVocalResult(data);
    } catch (err) {
      console.warn('Vocal coach fallback:', err);
    } finally {
      setVocalLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 10: AI Press Release & Wire Media Bureau (Agent Maya)
  // ----------------------------------------------------
  const [pressHeadline, setPressHeadline] = useState('Exclusive Agency Signing & Grand 2026 Showcase');
  const [pressTalent, setPressTalent] = useState('A-List Celebrity Supermodel & Star Ensemble');
  const [pressEvent, setPressEvent] = useState('Headline National Tour & Global Brand Endorsement');
  const [pressDate, setPressDate] = useState('Immediate Release');
  const [pressQuotes, setPressQuotes] = useState('Managing Director, AVA Celebrity Management');
  const [pressLoading, setPressLoading] = useState(false);
  const [pressResult, setPressResult] = useState<any>(null);

  const handleRunPressRelease = async () => {
    setPressLoading(true);
    setPressResult(null);
    try {
      const res = await fetch('/api/gemini/press-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headlineTopic: pressHeadline,
          talentOrClientName: pressTalent,
          eventOrCampaign: pressEvent,
          announcementDate: pressDate,
          keyQuotesFrom: pressQuotes
        })
      });
      const data = await res.json();
      setPressResult(data);
    } catch (err) {
      console.warn('Press release fallback:', err);
    } finally {
      setPressLoading(false);
    }
  };

  // Speech Recognition
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // PDF Export
  const downloadPdfDocument = (title: string, content: string) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;

      // Dark luxury background
      doc.setFillColor(9, 9, 14);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Double gold borders
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1.2);
      doc.rect(6, 6, pageWidth - 12, pageHeight - 12);

      doc.setDrawColor(170, 124, 17);
      doc.setLineWidth(0.4);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

      // Header Banner
      doc.setFillColor(22, 18, 14);
      doc.rect(9, 9, contentWidth + 2, 26, 'F');
      doc.setFillColor(212, 175, 55);
      doc.rect(9, 35, contentWidth + 2, 1, 'F');

      // Emblem
      doc.setFillColor(10, 10, 15);
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.6);
      doc.roundedRect(14, 12, 20, 20, 2, 2, 'FD');
      doc.setTextColor(243, 208, 104);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('AVA', 24, 23, { align: 'center' });
      doc.setFontSize(6.5);
      doc.setTextColor(212, 175, 55);
      doc.text('AI SUITE', 24, 28, { align: 'center' });

      // Title & Subtitle
      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('AVA CELEBRITY MANAGEMENT', 38, 19);

      doc.setTextColor(230, 225, 215);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('PROPRIETARY ENTERTAINMENT AI INTELLIGENCE SUITE • EXECUTIVE DISPATCH', 38, 25);

      doc.setTextColor(160, 160, 175);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.text('CONFIDENTIAL EXECUTIVE BRIEF • LEGAL & COMMERCIAL PRODUCTION SPECIFICATION', 38, 30);

      // Reference Ribbon
      doc.setFillColor(16, 16, 24);
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, 38, contentWidth, 11, 1.5, 1.5, 'FD');

      doc.setTextColor(170, 170, 185);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('DOCUMENT TITLE / TOPIC:', margin + 4, 45);

      doc.setTextColor(255, 215, 60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(title.toUpperCase().slice(0, 48), margin + 46, 45);

      doc.setFillColor(13, 92, 58);
      doc.roundedRect(pageWidth - margin - 42, 39.5, 39, 7.5, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.text('✓ AI VERIFIED REPORT', pageWidth - margin - 22.5, 44.5, { align: 'center' });

      // Content Box (Takes majority of middle page)
      doc.setFillColor(14, 14, 20);
      doc.setDrawColor(50, 45, 30);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, 52, contentWidth, 202, 2, 2, 'FD');

      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, margin + 6, 61);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.3);
      doc.line(margin + 6, 64, margin + contentWidth - 6, 64);

      doc.setTextColor(225, 225, 235);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const splitText = doc.splitTextToSize(content, contentWidth - 14);
      doc.text(splitText.slice(0, 48), margin + 6, 71);

      // Bottom Directorate & Seals Box (y = 256 to 280)
      doc.setFillColor(18, 16, 24);
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, 256, contentWidth, 24, 1.5, 1.5, 'FD');

      const sigY = 271;
      doc.setDrawColor(120, 120, 140);
      doc.setLineWidth(0.3);
      doc.line(margin + 6, sigY, margin + 65, sigY);
      doc.setTextColor(243, 208, 104);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('Generated via AVA Gemini Neural Core', margin + 6, sigY - 2);
      doc.setTextColor(160, 160, 175);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.text('Artificial Intelligence Suite • Directorate Clearance', margin + 6, sigY + 3.5);

      // Center Seal
      doc.setDrawColor(212, 175, 55);
      doc.circle(pageWidth / 2, 268, 7.5, 'S');
      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4.5);
      doc.text('★ AVA SEAL ★', pageWidth / 2, 267, { align: 'center' });
      doc.text('VERIFIED 2026', pageWidth / 2, 269.5, { align: 'center' });

      // Right Directorate
      const rX = pageWidth - margin - 65;
      doc.line(rX, sigY, pageWidth - margin - 6, sigY);
      doc.setTextColor(243, 208, 104);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('AVA Celebrity Management Directorate', rX, sigY - 2);
      doc.setTextColor(160, 160, 175);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.text(`Official Dispatch: ${new Date().toLocaleDateString('en-IN')}`, rX, sigY + 3.5);

      // Bottom Footer Bar (y = 282 to 294)
      doc.setFillColor(14, 12, 18);
      doc.rect(9, 282, contentWidth + 2, 8, 'F');
      doc.setFillColor(212, 175, 55);
      doc.rect(9, 282, contentWidth + 2, 0.4, 'F');
      doc.setTextColor(190, 185, 170);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.8);
      doc.text(
        'AVA CELEBRITY MANAGEMENT  •  Bandra West, Mumbai & Koregaon Park, Pune  •  Web: www.avatalent.com  •  Email: concierge@avatalent.com',
        pageWidth / 2,
        285.5,
        { align: 'center' }
      );
      doc.setTextColor(130, 130, 140);
      doc.setFontSize(5.2);
      doc.text(
        'CONFIDENTIAL: This AI-generated brief contains privileged entertainment industry strategy. Unauthorized redistribution is prohibited.',
        pageWidth / 2,
        288.5,
        { align: 'center' }
      );

      doc.save(`${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_ava_official.pdf`);
    } catch (e) {
      console.error('PDF generation error', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="card-luxury w-full max-w-5xl rounded-2xl border-gold-glow overflow-hidden bg-[#0A0A0F] shadow-2xl relative my-auto max-h-[94vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#1E0812] via-[#0D0D14] to-[#1C1405] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
              title="मागे जा / Back"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-cinzel font-bold text-[#D4AF37] tracking-widest uppercase">
                  AVA AI PRODUCTION TEAM & STUDIO CREW
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
                  10 Multi-Agent Crew Online
                </span>
              </div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-white">
                Collaborative Entertainment & Production AI Team (AVA AI क्रू टीम)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Team Crew Sub-Banner */}
        <div className="px-4 py-2 bg-[#08080C] border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-gold-gradient font-bold">AI Team Workspace:</span>
            <span>Switch between specialized studio agents or chain outputs from Producer to PR Wire.</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
            <span>Powered by Gemini Neural Core</span>
            <span>•</span>
            <span className="text-emerald-400">Instant Cross-Agent Collaboration</span>
          </div>
        </div>

        {/* Tab Navigation - 10 Specialized AI Team Agents */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-[#0E0E16] border-b border-white/10 scrollbar-none shrink-0">
          {/* Agent 1 */}
          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'matchmaker'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Agent Ava (Producer)</span>
          </button>

          {/* Agent 2 */}
          <button
            onClick={() => setActiveTab('audition')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'audition'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Agent Priya (Casting)</span>
          </button>

          {/* Agent 3 */}
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'contract'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Agent Vikram (Legal)</span>
          </button>

          {/* Agent 4 - Vocal Coach */}
          <button
            onClick={() => setActiveTab('vocal')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'vocal'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agent Aryan (Vocal Coach)</span>
          </button>

          {/* Agent 5 - Press Release */}
          <button
            onClick={() => setActiveTab('press')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'press'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-rose-400" />
            <span>Agent Maya (PR Wire)</span>
          </button>

          {/* Agent 6 - Bio */}
          <button
            onClick={() => setActiveTab('bio')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agent Kiara (Media Bio)</span>
          </button>

          {/* Agent 7 - Security */}
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-black font-bold shadow'
                : 'text-amber-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Agent Kabir (Security)</span>
          </button>

          {/* Agent 8 - Rate Estimator */}
          <button
            onClick={() => setActiveTab('rateEstimator')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'rateEstimator'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Agent Rohan (Finance)</span>
          </button>

          {/* Agent 9 - Schedule */}
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agent Dev (Stage & Show)</span>
          </button>

          {/* Agent 10 - Concierge */}
          <button
            onClick={() => setActiveTab('concierge')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'concierge'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Agent Stella (Concierge)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: TALENT MATCHMAKER */}
          {activeTab === 'matchmaker' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 rounded-xl border border-[#D4AF37]/20">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Celebrity Matchmaker & Budget Optimization</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Provide your production or campaign parameters. Gemini AI evaluates your demographic, aesthetic requirements, and budget feasibility against AVA representation standards.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event or Campaign Type</label>
                    <input
                      type="text"
                      value={matchEvent}
                      onChange={(e) => setMatchEvent(e.target.value)}
                      placeholder="e.g. Luxury Wedding Sangeet / Fashion Week"
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Target Budget Range</label>
                    <input
                      type="text"
                      value={matchBudget}
                      onChange={(e) => setMatchBudget(e.target.value)}
                      placeholder="e.g. ₹10,00,000 - ₹25,00,000"
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">City / Venue</label>
                    <input
                      type="text"
                      value={matchCity}
                      onChange={(e) => setMatchCity(e.target.value)}
                      placeholder="Mumbai / Pune / Nagpur"
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Preferred Category</label>
                    <select
                      value={matchCategory}
                      onChange={(e) => setMatchCategory(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    >
                      <option value="Celebrities & Runway Models">Celebrities & Runway Models</option>
                      <option value="Actors & Actresses">Actors & Actresses</option>
                      <option value="Singers & Playback Musicians">Singers & Playback Musicians</option>
                      <option value="Anchors & Red Carpet Hosts">Anchors & Red Carpet Hosts</option>
                      <option value="Fashion Week Production">Fashion Week Production</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Key Deliverables & Brand Tone</label>
                  <textarea
                    rows={2}
                    value={matchRequirements}
                    onChange={(e) => setMatchRequirements(e.target.value)}
                    placeholder="Describe specific engagement requirements..."
                    className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  onClick={handleRunMatchmaker}
                  disabled={matchLoading}
                  className="mt-4 btn-gold w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {matchLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Analyzing AVA Roster with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Compute Optimal Talent Match</span>
                    </>
                  )}
                </button>
              </div>

              {/* Match Result Display */}
              {matchResult && (
                <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-[#D4AF37]/40 space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
                        {matchResult.budgetFeasibility || 'Feasible'}
                      </span>
                      <h4 className="font-cinzel text-sm sm:text-base font-bold text-white">
                        Recommended Tier: {matchResult.recommendedTier}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadPdfDocument('AVA_Talent_Match_Report', JSON.stringify(matchResult, null, 2))}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>PDF</span>
                      </button>
                      <span className="text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                        Agency Verified Match
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">
                    {matchResult.executiveSummary}
                  </p>

                  {/* Matches Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matchResult.matches?.map((m: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-[#14141E] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-cinzel font-bold text-white text-xs sm:text-sm">{m.talentName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-black">
                            {m.matchScore}% Match
                          </span>
                        </div>
                        <div className="text-[11px] text-[#D4AF37] font-medium">{m.suggestedRole}</div>
                        <div className="text-[10px] text-gray-400">Est. Fee: <span className="text-white font-mono">{m.estimatedFeeRange}</span></div>
                        <p className="text-gray-300 text-[11px] leading-snug">{m.rationale}</p>
                        <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
                          {m.deliverables?.map((d: string, dIdx: number) => (
                            <span key={dIdx} className="text-[9px] bg-white/5 text-gray-300 px-2 py-0.5 rounded">
                              ✓ {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {matchResult.agencyAdvice && (
                    <div className="p-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs text-amber-200">
                      <strong>Agency Advisory:</strong> {matchResult.agencyAdvice}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBookingWithDetails?.({
                          talentName: matchResult.matches?.[0]?.talentName,
                          eventType: matchEvent,
                          budget: matchBudget
                        });
                      }}
                      className="btn-gold px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>Proceed to Official Booking Contract</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BIO & PITCH GENERATOR */}
          {activeTab === 'bio' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 rounded-xl border border-[#D4AF37]/20">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Artist Press Bio & Brand Collaboration Pitcher</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Generate luxury agency-grade biographies, film director pitches, and high-converting commercial collaboration emails in seconds.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Artist / Talent Name</label>
                    <input
                      type="text"
                      value={bioArtistName}
                      onChange={(e) => setBioArtistName(e.target.value)}
                      placeholder="e.g. Siddharth R."
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Discipline & Category</label>
                    <input
                      type="text"
                      value={bioCategory}
                      onChange={(e) => setBioCategory(e.target.value)}
                      placeholder="Supermodel / Actor / Vocalist"
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Key Career Highlights & Credentials</label>
                  <textarea
                    rows={2}
                    value={bioHighlights}
                    onChange={(e) => setBioHighlights(e.target.value)}
                    placeholder="Notable shows, magazine covers, brand associations, follower metrics..."
                    className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Editorial Tone</label>
                  <select
                    value={bioTone}
                    onChange={(e) => setBioTone(e.target.value)}
                    className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                  >
                    <option value="Luxury Haute Couture">Luxury Haute Couture (Paris/Milan Prestige)</option>
                    <option value="Commercial Brand Endorsement">Commercial Brand Endorsement (High Conversion)</option>
                    <option value="Film Director & Casting Bureau">Film Director & Casting Bureau (Dramatic/Method)</option>
                  </select>
                </div>

                <button
                  onClick={handleRunBioGenerator}
                  disabled={bioLoading}
                  className="mt-4 btn-gold w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {bioLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Composing Executive Bio with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Professional Media Kit Suite</span>
                    </>
                  )}
                </button>
              </div>

              {bioResult && (
                <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-[#D4AF37]/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-cinzel text-base font-bold text-white">{bioResult.headline}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(bioResult.executiveBio)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                        title="Voice Audio Readout"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                        <span>{isSpeaking ? 'Stop Audio' : 'Play Audio'}</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(bioResult.executiveBio, 'execBio')}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                      >
                        {copiedKey === 'execBio' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'execBio' ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => downloadPdfDocument(`AVA_Bio_${bioArtistName}`, bioResult.executiveBio)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Short One-Liner (Social & Program Book)</span>
                    <p className="text-gray-200 text-xs italic bg-[#12121A] p-2.5 rounded border border-white/5">
                      "{bioResult.shortBio}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Full Executive Representation Bio</span>
                    <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line bg-[#12121A] p-3 rounded border border-white/5">
                      {bioResult.executiveBio}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">Brand Collaboration Pitch Hook</span>
                    <p className="text-amber-100 text-xs leading-relaxed bg-amber-950/20 p-2.5 rounded border border-[#D4AF37]/20">
                      {bioResult.brandPitchHook}
                    </p>
                  </div>

                  {bioResult.keyAccolades && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {bioResult.keyAccolades.map((a: string, aIdx: number) => (
                        <span key={aIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          ★ {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTRACT RIDER DRAFTER */}
          {activeTab === 'contract' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 rounded-xl border border-[#D4AF37]/20">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Contract Rider & VIP Hospitality Legal Drafter</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Generate formalized contract rider specifications, technical audio/lighting riders, and hospitality clauses protecting both agency talent and client production.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Client / Production Brand</label>
                    <input
                      type="text"
                      value={riderClient}
                      onChange={(e) => setRiderClient(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Artist / Headliner</label>
                    <input
                      type="text"
                      value={riderTalent}
                      onChange={(e) => setRiderTalent(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event Date</label>
                    <input
                      type="text"
                      value={riderDate}
                      onChange={(e) => setRiderDate(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Venue / City</label>
                    <input
                      type="text"
                      value={riderVenue}
                      onChange={(e) => setRiderVenue(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Special Security / Hospitality Clauses</label>
                  <textarea
                    rows={2}
                    value={riderSpecial}
                    onChange={(e) => setRiderSpecial(e.target.value)}
                    className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  onClick={handleRunRiderDrafter}
                  disabled={riderLoading}
                  className="mt-4 btn-gold w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {riderLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Legal Entertainment Clauses...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Draft Legal Contract Rider Suite</span>
                    </>
                  )}
                </button>
              </div>

              {riderResult && (
                <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-[#D4AF37]/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-cinzel text-base font-bold text-white">{riderResult.agreementTitle}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(riderResult, null, 2), 'riderAll')}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                      >
                        {copiedKey === 'riderAll' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'riderAll' ? 'Copied' : 'Copy Clauses'}</span>
                      </button>
                      <button
                        onClick={() => downloadPdfDocument('AVA_Contract_Rider', JSON.stringify(riderResult, null, 2))}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs">{riderResult.riderSummary}</p>

                  <div className="space-y-3">
                    {riderResult.clauses?.map((c: any, cIdx: number) => (
                      <div key={cIdx} className="p-3 rounded-lg bg-[#12121C] border border-white/5 space-y-1">
                        <div className="text-xs font-cinzel font-bold text-[#D4AF37]">{c.heading}</div>
                        <p className="text-gray-300 text-xs leading-relaxed">{c.clauseText}</p>
                        {c.criticalNotice && (
                          <div className="text-[10px] text-rose-300 font-mono pt-1">
                            ⚠️ {c.criticalNotice}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {riderResult.technicalRequirements && (
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <span className="text-[11px] font-bold text-cyan-400 block mb-1">Stage & Audio Technical Specifications:</span>
                      <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                        {riderResult.technicalRequirements.map((t: string, tIdx: number) => (
                          <li key={tIdx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {riderResult.hospitalityRider && (
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <span className="text-[11px] font-bold text-[#D4AF37] block mb-1">VIP Hospitality Specifications:</span>
                      <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                        {riderResult.hospitalityRider.map((h: string, hIdx: number) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CASTING & SCRIPT EVALUATOR */}
          {activeTab === 'audition' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 rounded-xl border border-[#D4AF37]/20">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Casting Director & Monologue Screenplay Evaluator</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Analyze self-tape monologues, character dialogue beats, camera delivery, and suitability scores for feature films, web series, and theatrical auditions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Character / Role</label>
                    <input
                      type="text"
                      value={castRole}
                      onChange={(e) => setCastRole(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Project Medium</label>
                    <input
                      type="text"
                      value={castProject}
                      onChange={(e) => setCastProject(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Audition Monologue / Script Extract</label>
                  <textarea
                    rows={3}
                    value={castScript}
                    onChange={(e) => setCastScript(e.target.value)}
                    placeholder="Paste monologue or dialogue lines..."
                    className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37] font-mono"
                  />
                </div>

                <button
                  onClick={handleRunCastingAnalyzer}
                  disabled={castLoading}
                  className="mt-4 btn-gold w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {castLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Evaluating Performance Metrics with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Clapperboard className="w-4 h-4" />
                      <span>Run Casting Bureau Evaluation</span>
                    </>
                  )}
                </button>
              </div>

              {castResult && (
                <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-[#D4AF37]/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-mono">Casting Verdict</span>
                      <h4 className="font-cinzel text-base font-bold text-white">{castResult.castingVerdict}</h4>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-2xl font-cinzel font-black text-gold-gradient">
                          {castResult.overallScore}/100
                        </span>
                        <span className="text-[9px] text-gray-400 block font-mono">Performance Score</span>
                      </div>
                      <button
                        onClick={() => downloadPdfDocument(`AVA_Casting_Score_${castRole}`, JSON.stringify(castResult, null, 2))}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                      <span className="font-bold text-emerald-400 block mb-1">Performance Strengths:</span>
                      <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                        {castResult.strengths?.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20">
                      <span className="font-bold text-amber-300 block mb-1">Director Notes & Polish:</span>
                      <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                        {castResult.areasForRefinement?.map((a: string, idx: number) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#14141E] border border-white/10 text-xs">
                    <span className="font-bold text-[#D4AF37] block mb-1">Camera & Diction Guidance:</span>
                    <p className="text-gray-300 leading-relaxed">{castResult.cameraAndDictionAdvice}</p>
                  </div>

                  {castResult.directorNotes && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs">
                      <span className="font-bold text-gray-400 block mb-1">Director Remarks:</span>
                      <p className="text-gray-300 italic">{castResult.directorNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EVENT RUN-OF-SHOW & BROADCAST SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 rounded-xl border border-[#D4AF37]/20">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI VIP Event Run-of-Show & 4K Satellite Broadcast Scheduler</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Generate professional minute-by-minute production schedules, stage cues, camera angles, lighting washes, and executive VIP security protocols for live gala events.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event Name</label>
                    <input
                      type="text"
                      value={schedEvent}
                      onChange={(e) => setSchedEvent(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Headline Talent / Host</label>
                    <input
                      type="text"
                      value={schedTalent}
                      onChange={(e) => setSchedTalent(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Venue / City</label>
                    <input
                      type="text"
                      value={schedVenue}
                      onChange={(e) => setSchedVenue(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Duration & Time Window</label>
                    <input
                      type="text"
                      value={schedDuration}
                      onChange={(e) => setSchedDuration(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Special Highlights & Broadcast Priorities</label>
                  <textarea
                    rows={2}
                    value={schedHighlights}
                    onChange={(e) => setSchedHighlights(e.target.value)}
                    className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  onClick={handleRunEventScheduler}
                  disabled={schedLoading}
                  className="mt-4 btn-gold w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {schedLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Generating Master Run-of-Show with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Generate Master Event Run-of-Show Protocol</span>
                    </>
                  )}
                </button>
              </div>

              {schedResult && (
                <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-[#D4AF37]/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-cinzel text-base font-bold text-white">{schedResult.masterTitle}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(schedResult, null, 2), 'schedAll')}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                      >
                        {copiedKey === 'schedAll' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'schedAll' ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => downloadPdfDocument('AVA_Run_of_Show_Schedule', JSON.stringify(schedResult, null, 2))}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">{schedResult.executiveOverview}</p>

                  <div className="space-y-3">
                    {schedResult.scheduleTimeline?.map((slot: any, sIdx: number) => (
                      <div key={sIdx} className="p-3.5 rounded-lg bg-[#14141E] border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                        <div className="md:col-span-1">
                          <span className="text-[#D4AF37] font-mono font-bold block">{slot.timeSlot}</span>
                          <span className="text-white font-semibold block mt-0.5">{slot.activity}</span>
                        </div>
                        <div className="md:col-span-1">
                          <span className="text-[10px] uppercase text-gray-400 font-mono block">Stage Cue</span>
                          <span className="text-gray-300">{slot.stageCue}</span>
                        </div>
                        <div className="md:col-span-1">
                          <span className="text-[10px] uppercase text-cyan-400 font-mono block">AV & Lighting</span>
                          <span className="text-gray-300">{slot.lightingSoundSetup}</span>
                        </div>
                        <div className="md:col-span-1">
                          <span className="text-[10px] uppercase text-rose-300 font-mono block">Security Protocol</span>
                          <span className="text-gray-300">{slot.securityProtocol}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {schedResult.telecastInstructions && (
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Live Broadcast Director Notice:</strong> {schedResult.telecastInstructions}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CONCIERGE CHAT */}
          {activeTab === 'concierge' && (
            <div className="flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-black/40 rounded-xl border border-white/10">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'model' && (
                      <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-xl max-w-[80%] text-xs leading-relaxed relative group ${
                        m.role === 'user'
                          ? 'bg-[#D4AF37] text-black font-medium'
                          : 'bg-[#14141E] text-gray-200 border border-white/10'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      {m.role === 'model' && (
                        <div className="mt-2 pt-1 border-t border-white/5 flex items-center gap-2">
                          <button
                            onClick={() => speakText(m.text)}
                            className="text-[10px] text-gray-400 hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Speak</span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(m.text, `chat-${idx}`)}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === `chat-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === `chat-${idx}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div className="p-3 rounded-xl bg-[#14141E] text-gray-400 text-xs flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                      <span>AVA Concierge is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Quick Prompts */}
              <div className="flex flex-wrap gap-1.5 py-2">
                {[
                  'What are the rates for Bollywood celebrity appearance?',
                  'How to book live event 4K video coverage?',
                  'How do actors apply for ongoing auditions?',
                  'Marathi & Hindi bilingual anchor availability'
                ].map((qp, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSendChat(qp)}
                    className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-full border border-white/10 transition cursor-pointer"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2 pt-2 border-t border-white/10"
              >
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-2.5 rounded-lg border transition cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-white/5 text-gray-300 hover:text-white border-white/10'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Voice Input (Click to speak)'}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-[#D4AF37]" />}
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about celebrity booking, talent riders, auditions..."
                  className="flex-1 bg-[#14141E] border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="btn-gold px-4 py-2.5 rounded-lg text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: EVENT SECURITY & VIP SAFETY PLANNER */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 rounded-xl border border-amber-500/30">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>AI Event Security & Safety Protocol Planner (महाराष्ट्र सुरक्षा नियोजन)</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Generate crowd safety matrices, local Maharashtra Police NOC checklists, and VIP convoy protection procedures.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event / Gala Title</label>
                    <input
                      type="text"
                      value={secEventName}
                      onChange={(e) => setSecEventName(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Venue / City in Maharashtra</label>
                    <input
                      type="text"
                      value={secVenue}
                      onChange={(e) => setSecVenue(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Expected Attendance</label>
                    <input
                      type="text"
                      value={secCrowd}
                      onChange={(e) => setSecCrowd(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">VIP & Celebrity Dignitaries</label>
                    <input
                      type="text"
                      value={secVIPs}
                      onChange={(e) => setSecVIPs(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunEventSecurity}
                  disabled={secLoading}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {secLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{secLoading ? 'Formulating Security Protocol...' : 'Generate Police NOC & Security Grid'}</span>
                </button>
              </div>

              {secResult && (
                <div className="bg-[#12121C] p-5 rounded-xl border border-gold-subtle space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-cinzel text-sm font-bold text-[#F3D068]">{secResult.overallSecurityLevel}</span>
                    <button
                      onClick={() => downloadPdfDocument('AVA_Event_Security_Protocol', JSON.stringify(secResult, null, 2))}
                      className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                      <strong className="text-amber-400 block mb-1">Required Security Personnel:</strong>
                      <span className="text-xl font-bold font-mono text-white">{secResult.recommendedPersonnelCount} Guards</span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/60 border border-white/10">
                      <strong className="text-amber-400 block mb-1">Crowd Risk Level:</strong>
                      <span className="text-xl font-bold font-mono text-emerald-400">{secResult.crowdRiskScore}/100 (Safe)</span>
                    </div>
                  </div>

                  <div>
                    <strong className="text-white text-xs block mb-1.5">Maharashtra Police NOC Checklist:</strong>
                    <div className="space-y-1">
                      {secResult.policeNocChecklist?.map((noc: string, i: number) => (
                        <div key={i} className="text-gray-300 text-xs flex items-center gap-2 p-1.5 rounded bg-white/5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{noc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: TALENT RATE & VALUATION ESTIMATOR */}
          {activeTab === 'rateEstimator' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 rounded-xl border border-[#D4AF37]/30">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Talent Rate & Fee Estimator (दर सल्लागार)</span>
                </h3>
                <p className="text-gray-400 text-xs">
                  Calculate market-standard commercial fees, shoot rates, and hospitality budgets across Maharashtra.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Artist / Talent Name</label>
                    <input
                      type="text"
                      value={rateTalentName}
                      onChange={(e) => setRateTalentName(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Category</label>
                    <input
                      type="text"
                      value={rateCategory}
                      onChange={(e) => setRateCategory(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Experience Level</label>
                    <input
                      type="text"
                      value={rateExperience}
                      onChange={(e) => setRateExperience(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">District / Location</label>
                    <input
                      type="text"
                      value={rateDistrict}
                      onChange={(e) => setRateDistrict(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunRateEstimator}
                  disabled={rateLoading}
                  className="mt-4 px-6 py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {rateLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                  <span>{rateLoading ? 'Analyzing Pricing...' : 'Estimate Fair Market Commercial Rates'}</span>
                </button>
              </div>

              {rateResult && (
                <div className="bg-[#12121C] p-5 rounded-xl border border-gold-subtle space-y-4">
                  <div className="p-4 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-center space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Recommended Base Fee</span>
                    <span className="text-3xl font-bold font-mono text-[#F3D068]">{rateResult.estimatedBaseRate}</span>
                    <span className="text-xs text-gray-300 block">{rateResult.recommendedFeeBracket}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-gray-400 block mb-1">Half-Day Shoot (Up to 4 Hrs)</span>
                      <strong className="text-white font-mono text-sm">{rateResult.halfDayRate}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-gray-400 block mb-1">Full-Day Shoot (Up to 8 Hrs)</span>
                      <strong className="text-white font-mono text-sm">{rateResult.fullDayRate}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#181824] border border-white/5 text-xs text-gray-300 space-y-1">
                    <strong className="text-amber-400 block">Travel & Hospitality Rider Estimate:</strong>
                    <p>{rateResult.travelHospitalityRiderCost}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: AI VOCAL COACH & DUBBING DIRECTOR (Agent Aryan) */}
          {activeTab === 'vocal' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 sm:p-5 rounded-xl border border-cyan-500/30">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>Agent Aryan • Vocal Coach & Dubbing Director</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          व्होकल कोच व डबिंग
                        </span>
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Expert vocal modulation, regional dialect coaching (Marathi/Hindi/English), and dubbing cadence analysis.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    Online • Neural Audio Core
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 my-3 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-cinzel text-gray-400">Quick Presets:</span>
                  <button
                    onClick={() => {
                      setVocalScript('काळजातली आग डोळ्यात उतरू दे, तेव्हाच पडद्यावरचा अभिनय जिवंत होतो.');
                      setVocalTone('Intense Dramatic Resonant');
                      setVocalLanguage('Marathi (शुद्ध प्रमाण भाषा)');
                      setVocalPerformer('Feature Film Lead / Dramatic Actor');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30"
                  >
                    🎭 Marathi Drama Monologue
                  </button>
                  <button
                    onClick={() => {
                      setVocalScript('हर धड़कन में एक दास्तान छुपी है, बस सुनने वाला दिल चाहिए।');
                      setVocalTone('Warm Poetic & Intimate');
                      setVocalLanguage('Hindi (शायराना बॉलीवूड)');
                      setVocalPerformer('Playback Vocalist / Voiceover');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30"
                  >
                    🎶 Hindi Poetic Romance
                  </button>
                  <button
                    onClick={() => {
                      setVocalScript('Excellence is not an accident. It is crafted in every single frame.');
                      setVocalTone('Crisp Luxury Commercial Authority');
                      setVocalLanguage('English (Contemporary Urban)');
                      setVocalPerformer('Commercial Brand Voice Artist');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30"
                  >
                    💎 Luxury Brand English
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-3 mt-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      Script Line, Monologue or Lyrics (संवाद / गाण्याचे बोल)
                    </label>
                    <textarea
                      rows={3}
                      value={vocalScript}
                      onChange={(e) => setVocalScript(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                      placeholder="Enter dialogue or lyrics to analyze..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-300 block mb-1">Target Tone</label>
                      <input
                        type="text"
                        value={vocalTone}
                        onChange={(e) => setVocalTone(e.target.value)}
                        className="w-full bg-[#181824] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-300 block mb-1">Language / Dialect</label>
                      <input
                        type="text"
                        value={vocalLanguage}
                        onChange={(e) => setVocalLanguage(e.target.value)}
                        className="w-full bg-[#181824] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-300 block mb-1">Performer Profile</label>
                      <input
                        type="text"
                        value={vocalPerformer}
                        onChange={(e) => setVocalPerformer(e.target.value)}
                        className="w-full bg-[#181824] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRunVocalCoach}
                  disabled={vocalLoading}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-400 text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 hover:brightness-110 active:scale-95 transition"
                >
                  {vocalLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" /> : <Headphones className="w-3.5 h-3.5 text-black" />}
                  <span>{vocalLoading ? 'Agent Aryan is Directing Vocal Cadence...' : 'Generate AI Vocal Coaching & Dubbing Notes'}</span>
                </button>
              </div>

              {/* Vocal Coach Results */}
              {vocalResult && (
                <div className="bg-[#12121C] p-5 rounded-xl border border-cyan-500/30 space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <h4 className="font-cinzel text-sm font-bold text-white">
                        Vocal Director Studio Analysis
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(`Vocal Warmup: ${vocalResult.vocalWarmupExercise}. Director Audio Cue: ${vocalResult.directorAudioCue}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-cyan-300 border border-cyan-500/30"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{isSpeaking ? 'Stop Voice' : 'Listen Coach'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(JSON.stringify(vocalResult, null, 2), 'vocal')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10"
                      >
                        {copiedKey === 'vocal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'vocal' ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => downloadPdfDocument('AVA VOCAL & DUBBING DIRECTION DISPATCH', `VOCAL WARMUP EXERCISE:\n${vocalResult.vocalWarmupExercise}\n\nPACING & CADENCE:\n${vocalResult.pacingAndRhythm}\n\nEMOTIONAL BEAT ANALYSIS:\n${vocalResult.emotionalBeatAnalysis}\n\nDIRECTOR AUDIO CUE:\n${vocalResult.directorAudioCue}\n\nANNOTATED PRACTICE LINE:\n${vocalResult.practiceLineMarked}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-xs text-cyan-200 border border-cyan-500/40"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Studio PDF</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs space-y-1">
                    <strong className="text-cyan-400 block font-cinzel">Vocal Warmup & Breath Exercise:</strong>
                    <p className="text-gray-200 leading-relaxed">{vocalResult.vocalWarmupExercise}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs space-y-1">
                    <strong className="text-amber-400 block font-cinzel">Annotated Practice Line (Pitch & Breath Marks):</strong>
                    <p className="text-emerald-300 font-mono text-sm leading-relaxed p-2 rounded bg-black/70 border border-emerald-500/20">
                      {vocalResult.practiceLineMarked}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <strong className="text-white block font-cinzel">Pacing & Rhythm:</strong>
                      <p className="text-gray-300">{vocalResult.pacingAndRhythm}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <strong className="text-white block font-cinzel">Emotional Subtext:</strong>
                      <p className="text-gray-300">{vocalResult.emotionalBeatAnalysis}</p>
                    </div>
                  </div>

                  {vocalResult.pronunciationNotes?.length > 0 && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <strong className="text-cyan-300 block mb-1.5 font-cinzel">Diction & Pronunciation Notes:</strong>
                      <ul className="space-y-1">
                        {vocalResult.pronunciationNotes.map((note: string, idx: number) => (
                          <li key={idx} className="text-gray-300 flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-[#14141E] border border-white/10 text-xs text-gray-300 space-y-1">
                    <strong className="text-gold-gradient block font-cinzel">Dubbing Engineer & Microphone Cue:</strong>
                    <p>{vocalResult.directorAudioCue}</p>
                  </div>

                  {/* Team Collaboration Action */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/5">
                    <span className="text-gray-400">Collaborate with AI Team:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTab('audition');
                          setCastScript(vocalScript);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-200 border border-white/10 flex items-center gap-1.5"
                      >
                        <Clapperboard className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Send to Agent Priya (Casting)</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('contract');
                          setRiderTalent('Voice Artist / Dubbing Performer');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-200 border border-white/10 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Draft Dubbing Contract</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: AI PRESS RELEASE & WIRE MEDIA BUREAU (Agent Maya) */}
          {activeTab === 'press' && (
            <div className="space-y-5">
              <div className="bg-[#12121C] p-4 sm:p-5 rounded-xl border border-rose-500/30">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-400">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>Agent Maya • PR Bureau Chief & Media Wire Director</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          प्रेस रिलिज व मीडिया
                        </span>
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Drafts AP-style entertainment press releases, red carpet wire dispatches, and viral social announcements.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    Wire Desk Active
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 my-3 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-cinzel text-gray-400">Press Angles:</span>
                  <button
                    onClick={() => {
                      setPressHeadline('Exclusive Multi-Year Representation & Global Brand Roster Announcement');
                      setPressTalent('Ranveer Kapoor & AVA Celebrity Ensemble');
                      setPressEvent('Global Brand Endorsements & 2026-27 World Arena Tour');
                      setPressDate('Immediate Release');
                      setPressQuotes('Managing Director, AVA Celebrity Management');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/30"
                  >
                    🌟 Major Star Signing
                  </button>
                  <button
                    onClick={() => {
                      setPressHeadline('Headline Red Carpet Gala & High-Impact Fashion Showstopper Unveiling');
                      setPressTalent('Top Supermodel Ensemble & Film Star Lead');
                      setPressEvent('AVA Annual Luxury Awards Gala at BKC Mumbai');
                      setPressDate('For Release on Event Morning');
                      setPressQuotes('Chief Creative Officer & Executive Producer');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/30"
                  >
                    🏆 Gala & Red Carpet
                  </button>
                  <button
                    onClick={() => {
                      setPressHeadline('OTT Feature Film Debut & Casting Director Announcement');
                      setPressTalent('Award-Winning Theater Performer');
                      setPressEvent('Premier Streaming Psychological Thriller Series');
                      setPressDate('Immediate Release');
                      setPressQuotes('Head of Casting & Talent Directorate');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/30"
                  >
                    🎬 Film & OTT Debut
                  </button>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Headline Topic</label>
                    <input
                      type="text"
                      value={pressHeadline}
                      onChange={(e) => setPressHeadline(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Talent / Client Name</label>
                    <input
                      type="text"
                      value={pressTalent}
                      onChange={(e) => setPressTalent(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event / Campaign Project</label>
                    <input
                      type="text"
                      value={pressEvent}
                      onChange={(e) => setPressEvent(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">Executive Quotes Attributed To</label>
                    <input
                      type="text"
                      value={pressQuotes}
                      onChange={(e) => setPressQuotes(e.target.value)}
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunPressRelease}
                  disabled={pressLoading}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 hover:brightness-110 active:scale-95 transition"
                >
                  {pressLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Megaphone className="w-3.5 h-3.5" />}
                  <span>{pressLoading ? 'Agent Maya is Dispatching Wire Story...' : 'Draft Official AP Entertainment Press Release'}</span>
                </button>
              </div>

              {/* Press Release Results */}
              {pressResult && (
                <div className="bg-[#12121C] p-5 rounded-xl border border-rose-500/30 space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <h4 className="font-cinzel text-sm font-bold text-white">
                        Official Wire Press Release
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(`${pressResult.officialHeadline}. ${pressResult.pressReleaseBody}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-rose-300 border border-rose-500/30"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
                        <span>{isSpeaking ? 'Stop Voice' : 'Listen Release'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(`${pressResult.officialHeadline}\n\n${pressResult.dateline}\n\n${pressResult.pressReleaseBody}\n\n${pressResult.executiveQuote}`, 'press')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10"
                      >
                        {copiedKey === 'press' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'press' ? 'Copied' : 'Copy Release'}</span>
                      </button>

                      <button
                        onClick={() => downloadPdfDocument('AVA CELEBRITY MANAGEMENT • OFFICIAL WIRE PRESS RELEASE', `${pressResult.officialHeadline}\n\nDATELINE:\n${pressResult.dateline}\n\nBODY:\n${pressResult.pressReleaseBody}\n\nEXECUTIVE QUOTE:\n${pressResult.executiveQuote}\n\nMEDIA CONTACT:\n${pressResult.mediaContactSection}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs text-rose-200 border border-rose-500/40"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Press Kit PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Wire Headline */}
                  <div className="p-4 rounded-xl bg-black/60 border border-rose-500/30">
                    <span className="text-[10px] text-rose-400 font-mono tracking-widest uppercase block mb-1">
                      {pressResult.dateline}
                    </span>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#F3D068] leading-snug">
                      {pressResult.officialHeadline}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-200 leading-relaxed space-y-3">
                    <p>{pressResult.pressReleaseBody}</p>
                    {pressResult.executiveQuote && (
                      <blockquote className="p-3 rounded-lg bg-black/40 border-l-2 border-rose-400 italic text-[#F3D068]">
                        {pressResult.executiveQuote}
                      </blockquote>
                    )}
                  </div>

                  {/* Viral Social Media Headlines */}
                  {pressResult.socialMediaHeadlines?.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#181824] border border-white/10 text-xs space-y-2">
                      <strong className="text-white block font-cinzel">Social Media Broadcast Catchlines:</strong>
                      <div className="space-y-1.5">
                        {pressResult.socialMediaHeadlines.map((tweet: string, i: number) => (
                          <div key={i} className="p-2 rounded bg-white/5 flex items-center justify-between text-gray-300">
                            <span>{tweet}</span>
                            <button
                              onClick={() => copyToClipboard(tweet, `tweet-${i}`)}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-rose-300 shrink-0 ml-2"
                            >
                              {copiedKey === `tweet-${i}` ? 'Copied' : 'Copy Post'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-gray-400">
                    <strong className="text-gray-300 block mb-0.5">Media & Agency Contacts:</strong>
                    <p>{pressResult.mediaContactSection}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
