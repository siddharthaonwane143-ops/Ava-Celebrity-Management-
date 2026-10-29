import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  FileText,
  Clapperboard,
  Bot,
  Copy,
  Check,
  Download,
  Send,
  Cpu,
  ShieldCheck,
  Crown,
  Calendar,
  Clock,
  Radio,
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  Newspaper,
  RefreshCw,
  Lock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Volume2,
  Video,
  Music
} from 'lucide-react';
import jsPDF from 'jspdf';
import { SmartRobot3DCanvas, RobotMood } from '../ai/SmartRobot3DCanvas';
import { RobotSpecialistId, ROBOT_FLEET } from '../ai/robotFleetData';
import { LiveCinematicRobotFeed, VideoOperationType } from '../ai/LiveCinematicRobotFeed';
import { getTalentProfiles } from '../../services/dbService';
import { VipMusicAnthemStudio } from '../music/VipMusicAnthemStudio';

export type AdminAITab =
  | 'securityGuard'
  | 'eventSecurity'
  | 'rateEstimator'
  | 'pressRelease'
  | 'matchmaker'
  | 'bio'
  | 'contract'
  | 'audition'
  | 'schedule'
  | 'anthemStudio';

export const AdminAIStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminAITab>('securityGuard');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 3D Smart AI Robot Copilot State
  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [adminFeedMode, setAdminFeedMode] = useState<'3d' | 'video'>('3d');
  const [robotStatusText, setRobotStatusText] = useState('AVA 3D Cybernetic Executive Copilot: All Systems Nominal. Ready for autonomous audits and management operations.');
  const [auditStats, setAuditStats] = useState<{ scanned: number; verified: number; flagged: number; details: string[] } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // 1. Tool: Profile Security Guard & Fraud Inspector
  const [secName, setSecName] = useState('Rahul Deshmukh (Lead Actor / Fashion)');
  const [secCategory, setSecCategory] = useState('Actors & Actresses');
  const [secCity, setSecCity] = useState('Mumbai Suburban (Andheri West)');
  const [secBio, setSecBio] = useState('Lead protagonist in 2 regional Marathi feature films and national ad campaigns.');
  const [secFollowers, setSecFollowers] = useState('450K Verified Followers (@rahul_deshmukh_act)');
  const [secExp, setSecExp] = useState('5 Years Active Feature Film & Web Series Experience');
  const [secEmail, setSecEmail] = useState('rahul.deshmukh.casting@agency.in');
  const [secPhone, setSecPhone] = useState('+91 98201 44552');
  const [secIdProvided, setSecIdProvided] = useState(true);
  const [secLoading, setSecLoading] = useState(false);
  const [secData, setSecData] = useState<any>(null);

  // 2. Tool: Event Security & Risk Planner
  const [evName, setEvName] = useState('AVA Maharashtra Grand Red Carpet Gala 2026');
  const [evVenue, setEvVenue] = useState('Jio World Convention Centre, Bandra Kurla Complex (BKC), Mumbai');
  const [evCrowd, setEvCrowd] = useState('2,500 VIP Guests, Media & Delegates');
  const [evVIPs, setEvVIPs] = useState('4 Bollywood A-List Stars, 16 Supermodels, Maharashtra State Dignitaries');
  const [evTelecast, setEvTelecast] = useState(true);
  const [evTier, setEvTier] = useState('Tier-1 Presidential Executive Security Protocol');
  const [evSecLoading, setEvSecLoading] = useState(false);
  const [evSecData, setEvSecData] = useState<any>(null);

  // 3. Tool: Commercial Rate Valuation & Benchmark
  const [rateTalent, setRateTalent] = useState('Siddharth Kapoor');
  const [rateCat, setRateCat] = useState('Supermodels & Runway');
  const [rateExp, setRateExp] = useState('4 Years (Lakme Fashion Week & Vogue Featured)');
  const [rateDistrict, setRateDistrict] = useState('Mumbai / Pune');
  const [rateType, setRateType] = useState('Showstopper Runway Walk & High-Fashion Commercial Campaign');
  const [rateDuration, setRateDuration] = useState('Full-Day (8 Hours)');
  const [rateLoading, setRateLoading] = useState(false);
  const [rateData, setRateData] = useState<any>(null);

  // 4. Tool: Press Release & Media Wire Generator
  const [prTopic, setPrTopic] = useState('Exclusive Global Representation Signing');
  const [prStar, setPrStar] = useState('A-List Celebrity Ensemble & Ranveer Kapoor');
  const [prCampaign, setPrCampaign] = useState('AVA 2026-27 National Runway Tour & Luxury Brand Ambassadorship');
  const [prDate, setPrDate] = useState('Immediate Release (October 2026)');
  const [prQuoteFrom, setPrQuoteFrom] = useState('Director of Artist Relations, AVA Celebrity Management');
  const [prLoading, setPrLoading] = useState(false);
  const [prData, setPrData] = useState<any>(null);

  // 5. Tool: Matchmaker
  const [matchEvent, setMatchEvent] = useState('Luxury Jewelry Brand Ambassador Launch');
  const [matchBudget, setMatchBudget] = useState('₹25,00,000 - ₹50,00,000');
  const [matchCity, setMatchCity] = useState('Mumbai (BKC Arena)');
  const [matchReqs, setMatchReqs] = useState('Bollywood A-list actress or supermodel with high elegance, fashion week presence, and 5M+ social reach');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);

  // 6. Tool: Bio
  const [bioName, setBioName] = useState('Rhea Sengupta');
  const [bioCat, setBioCat] = useState('Supermodel & Runway Icon');
  const [bioCreds, setBioCreds] = useState('Vogue India cover, Lakme Fashion Week showstopper, featured in international campaign across Dubai & Paris');
  const [bioTone, setBioTone] = useState('Luxury Haute Couture');
  const [bioLoading, setBioLoading] = useState(false);
  const [bioData, setBioData] = useState<any>(null);

  // 7. Tool: Contract Rider
  const [contractClient, setContractClient] = useState('Titan Luxury Group / Envy Events');
  const [contractTalent, setContractTalent] = useState('Ranveer Kapoor / A-List Star');
  const [contractEvent, setContractEvent] = useState('Headline Keynote & Product Ribbon-Cutting');
  const [contractVenue, setContractVenue] = useState('Jio World Convention Centre, Mumbai');
  const [contractSpecial, setContractSpecial] = useState('Strict NDA, armed bodyguard transit escort, 5-star suite hospitality, no unauthorized press photography before 7 PM');
  const [contractLoading, setContractLoading] = useState(false);
  const [contractData, setContractData] = useState<any>(null);

  // 8. Tool: Audition Evaluator
  const [audRole, setAudRole] = useState('Lead Detective / Film Noir Protagonist');
  const [audMedium, setAudMedium] = useState('Hindi Crime Web Series (Amazon / Netflix format)');
  const [audScript, setAudScript] = useState('Every criminal in this city thinks they are invisible until they see their reflection in my gun barrel. Sit down, we have three minutes before the Commissioner calls.');
  const [audLoading, setAudLoading] = useState(false);
  const [audData, setAudData] = useState<any>(null);

  // 9. Tool: Event Scheduler
  const [schedEvent, setSchedEvent] = useState('AVA Luxury Red Carpet Awards & Fashion Gala');
  const [schedDate, setSchedDate] = useState('Saturday, December 12, 2026');
  const [schedVenue, setSchedVenue] = useState('The St. Regis Grand Ballroom, Mumbai');
  const [schedTalent, setSchedTalent] = useState('A-List Celebrity Ensemble & Supermodel Lineup');
  const [schedDuration, setSchedDuration] = useState('4.5 Hours');
  const [schedHighlights, setSchedHighlights] = useState('VIP Arrivals, 4K Direct Satellite Live Broadcast, Runway Showstopper, Press Media Wall Interviews');
  const [schedLoading, setSchedLoading] = useState(false);
  const [schedData, setSchedData] = useState<any>(null);

  // Quick Preset Handlers
  const applySecPreset = (type: 'marathiActor' | 'unverified' | 'bollywoodStar') => {
    if (type === 'marathiActor') {
      setSecName('Subodh Bhave (Senior Marathi Cinema & Natak Lead)');
      setSecCategory('Actors & Actresses');
      setSecCity('Pune & Mumbai');
      setSecBio('National award winner, 25+ Marathi feature films, iconic theater plays across Maharashtra.');
      setSecFollowers('1.2M Verified Followers (@subodhbhave)');
      setSecExp('18 Years Professional Feature Film & Theater');
      setSecEmail('management@subodhbhave.in');
      setSecPhone('+91 98200 77881');
      setSecIdProvided(true);
    } else if (type === 'unverified') {
      setSecName('Viral Creator (Claiming 2.5M Followers)');
      setSecCategory('Influencers & Creators');
      setSecCity('Nagpur District');
      setSecBio('Viral sensation, claiming sudden burst of followers with no verifiable agency contract or guild card.');
      setSecFollowers('2.5M (Sudden unverified spike)');
      setSecExp('6 Months Social Media Reels');
      setSecEmail('creator999@tempmail.com');
      setSecPhone('+91 91234 56789');
      setSecIdProvided(false);
    } else {
      setSecName('Kareena Kapoor Khan (Bollywood A-List Superstar)');
      setSecCategory('Celebrities & Superstars');
      setSecCity('Bandra West, Mumbai');
      setSecBio('Legendary Indian cinema actress, global brand ambassador, international campaign headliner.');
      setSecFollowers('12.5M Verified Blue Tick (@kareenakapoorkhan)');
      setSecExp('24 Years A-List Feature Film Career');
      setSecEmail('representation@ava-agency.in');
      setSecPhone('+91 98201 11223');
      setSecIdProvided(true);
    }
  };

  const applyRatePreset = (type: 'marathiLead' | 'supermodel' | 'playbackSinger') => {
    if (type === 'marathiLead') {
      setRateTalent('Swapnil Joshi (Marathi Cinema Lead)');
      setRateCat('Actors & Actresses');
      setRateExp('15 Years Film & Television');
      setRateDistrict('Mumbai & Pune');
      setRateType('Corporate Festival Chief Guest & Red Carpet Inauguration');
      setRateDuration('Half-Day (4 Hours)');
    } else if (type === 'supermodel') {
      setRateTalent('Rhea Sengupta');
      setRateCat('Supermodels & Runway');
      setRateExp('5 Years Lakme Fashion Week & Vogue Cover');
      setRateDistrict('Mumbai (BKC)');
      setRateType('Haute Couture Showstopper & Brand Campaign Shoot');
      setRateDuration('Full-Day (8 Hours)');
    } else {
      setRateTalent('Adarsh Shinde (Folk & Playback Sensation)');
      setRateCat('Singers & Playback Musicians');
      setRateExp('12 Years Live Stage & Playback');
      setRateDistrict('Maharashtra Circuit (Pune/Nashik/Nagpur)');
      setRateType('Grand Live Concert Headline Performance (Live 8-Piece Band)');
      setRateDuration('90-Minute Live Concert');
    }
  };

  const applyContractPreset = (type: 'endorsement' | 'liveConcert' | 'filmShoot') => {
    if (type === 'endorsement') {
      setContractClient('Tanishq / Titan Luxury Jewelry Group');
      setContractTalent('A-List Celebrity Brand Ambassador');
      setContractVenue('Mehboob Studios, Bandra West, Mumbai');
      setContractSpecial('Strict Exclusivity in Jewelry Sector for 12 Months, 5-Star Greenroom Hospitality, Armed Security Transit Escort, Final Asset Approval.');
    } else if (type === 'liveConcert') {
      setContractClient('Maharashtra Tourism Cultural Directorate');
      setContractTalent('Headline Playback Vocalist & 10-Piece Ensemble');
      setContractVenue('Gateway of India Promenade, Mumbai');
      setContractSpecial('Full PA Line Array Soundcheck 4 Hours Prior, 100% Retainer Paid Prior to Stage Climb, 4 Suited Bodyguards, Greenroom Hospitality with Herbal Infusions.');
    } else {
      setContractClient('Zee Studios / Marathi Feature Co-Production');
      setContractTalent('Lead Protagonist Actor');
      setContractVenue('Film City Goregaon, Mumbai & Kolhapur Outdoor');
      setContractSpecial('First-Class Airfare & AC Vanity Van on Location, Tailored Wardrobe Retention Option, Per Diem Allowance ₹15,000/Day.');
    }
  };

  const applyBioPreset = (type: 'marathiIcon' | 'fashionModel' | 'musicArtist') => {
    if (type === 'marathiIcon') {
      setBioName('Amruta Khanvilkar');
      setBioCat('Actors & Actresses');
      setBioCreds('Natrang fame, Bollywood featured, Marathi Filmfare winner, celebrated classical and contemporary dance icon.');
      setBioTone('Luxury Haute Couture');
    } else if (type === 'fashionModel') {
      setBioName('Kabir Oberoi');
      setBioCat('Supermodels & Runway');
      setBioCreds('Milan and Lakme Fashion Week regular, GQ Best Dressed honoree, campaign face for leading luxury fragrance.');
      setBioTone('Commercial Brand Endorsement');
    } else {
      setBioName('Ajay-Atul Inspired Symphony Ensemble');
      setBioCat('Singers & Playback Musicians');
      setBioCreds('Blockbuster cinema orchestral arrangements, Royal Albert Hall sold-out concerts, national awards.');
      setBioTone('Film Director & Casting Bureau');
    }
  };

  const copyText = (txt: string, key: string) => {
    navigator.clipboard?.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadPdf = (title: string, data: any) => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(212, 175, 55);
      doc.text('AVA CELEBRITY MANAGEMENT', 20, 20);

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('ADMINISTRATOR INTELLIGENCE SUITE • CONFIDENTIAL', 20, 27);
      doc.text(`Exported: ${new Date().toLocaleDateString()}`, 130, 27);

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);

      doc.setFontSize(13);
      doc.setTextColor(20, 20, 20);
      doc.text(title, 20, 42);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);

      const formatted = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      const splitText = doc.splitTextToSize(formatted, 170);
      doc.text(splitText, 20, 52);

      doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error('PDF error', e);
    }
  };

  // Handlers
  const handleSecurityAudit = async () => {
    setSecLoading(true);
    setSecData(null);
    try {
      const res = await fetch('/api/gemini/security-guard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileName: secName,
          category: secCategory,
          bio: secBio,
          claimedFollowers: secFollowers,
          experience: secExp,
          contactEmail: secEmail,
          contactPhone: secPhone,
          idProvided: secIdProvided,
          cityLocation: secCity
        })
      });
      const data = await res.json();
      setSecData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSecLoading(false);
    }
  };

  const handleEventSecurity = async () => {
    setEvSecLoading(true);
    setEvSecData(null);
    try {
      const res = await fetch('/api/gemini/event-security-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: evName,
          venueLocation: evVenue,
          expectedCrowd: evCrowd,
          celebrityVIPs: evVIPs,
          isLiveTelecast: evTelecast,
          eventTier: evTier
        })
      });
      const data = await res.json();
      setEvSecData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvSecLoading(false);
    }
  };

  const handleRateEstimate = async () => {
    setRateLoading(true);
    setRateData(null);
    try {
      const res = await fetch('/api/gemini/rate-estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          talentName: rateTalent,
          category: rateCat,
          experienceYears: rateExp,
          locationDistrict: rateDistrict,
          deliverableType: rateType,
          eventDuration: rateDuration
        })
      });
      const data = await res.json();
      setRateData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRateLoading(false);
    }
  };

  const handlePressRelease = async () => {
    setPrLoading(true);
    setPrData(null);
    try {
      const res = await fetch('/api/gemini/press-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headlineTopic: prTopic,
          talentOrClientName: prStar,
          eventOrCampaign: prCampaign,
          announcementDate: prDate,
          keyQuotesFrom: prQuoteFrom
        })
      });
      const data = await res.json();
      setPrData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPrLoading(false);
    }
  };

  const handleMatch = async () => {
    setMatchLoading(true);
    setMatchData(null);
    try {
      const res = await fetch('/api/gemini/talent-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: matchEvent,
          budget: matchBudget,
          cityVenue: matchCity,
          requirements: matchReqs
        })
      });
      const data = await res.json();
      setMatchData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleBio = async () => {
    setBioLoading(true);
    setBioData(null);
    try {
      const res = await fetch('/api/gemini/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName: bioName,
          category: bioCat,
          achievements: bioCreds,
          tone: bioTone
        })
      });
      const data = await res.json();
      setBioData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBioLoading(false);
    }
  };

  const handleContract = async () => {
    setContractLoading(true);
    setContractData(null);
    try {
      const res = await fetch('/api/gemini/contract-drafter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: contractClient,
          talentName: contractTalent,
          eventType: contractEvent,
          venue: contractVenue,
          specialClauses: contractSpecial
        })
      });
      const data = await res.json();
      setContractData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setContractLoading(false);
    }
  };

  const handleAudition = async () => {
    setAudLoading(true);
    setAudData(null);
    try {
      const res = await fetch('/api/gemini/casting-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: audRole,
          projectType: audMedium,
          monologueText: audScript
        })
      });
      const data = await res.json();
      setAudData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAudLoading(false);
    }
  };

  const handleSchedule = async () => {
    setSchedLoading(true);
    setSchedData(null);
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
      setSchedData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSchedLoading(false);
    }
  };

  const runAutonomousDatabaseAudit = async () => {
    setIsAuditing(true);
    setRobotMood('thinking');
    setRobotStatusText('Scanning Cloud Firestore database... inspecting talent media items, verification tags, and security credentials...');

    try {
      const profiles = await getTalentProfiles(false);
      let verifiedCount = 0;
      let flaggedCount = 0;
      const issues: string[] = [];

      profiles.forEach((p) => {
        if (p.isVerified) verifiedCount++;
        if (!p.photoUrl || p.photoUrl.trim() === '') {
          flaggedCount++;
          issues.push(`${p.name}: Missing primary portfolio portrait`);
        } else if (!p.bio || p.bio.length < 20) {
          flaggedCount++;
          issues.push(`${p.name}: Short or unformatted biography`);
        } else if (!p.instagramHandle && !p.instagramUrl) {
          issues.push(`${p.name}: Social media verification handle not linked`);
        }
      });

      setAuditStats({
        scanned: profiles.length,
        verified: verifiedCount,
        flagged: flaggedCount,
        details: issues.slice(0, 5)
      });

      setRobotMood('success');
      const completionMsg = `Autonomous Audit Complete: Scanned ${profiles.length} profiles. ${verifiedCount} verified, ${flaggedCount} action recommendations.`;
      setRobotStatusText(completionMsg);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(completionMsg);
        ut.rate = 1.05;
        window.speechSynthesis.speak(ut);
      }
    } catch (e) {
      console.warn('Audit error:', e);
      setRobotMood('idle');
      setRobotStatusText('Autonomous Audit paused: Database sync pending.');
    } finally {
      setIsAuditing(false);
    }
  };

  const getSpecialistForTab = (tab: AdminAITab): RobotSpecialistId => {
    switch (tab) {
      case 'securityGuard':
      case 'eventSecurity':
        return 'security';
      case 'rateEstimator':
        return 'finance';
      case 'pressRelease':
        return 'media';
      case 'matchmaker':
        return 'matchmaker';
      case 'contract':
        return 'legal';
      case 'audition':
        return 'casting';
      case 'schedule':
        return 'telecast';
      case 'anthemStudio':
        return 'voice';
      default:
        return 'prime';
    }
  };

  const getOperationForTab = (tab: AdminAITab): VideoOperationType => {
    switch (tab) {
      case 'securityGuard':
        return 'profile_scan';
      case 'eventSecurity':
        return 'security_protocol';
      case 'rateEstimator':
        return 'rate_calc';
      case 'contract':
        return 'contract_draft';
      default:
        return 'profile_scan';
    }
  };

  const activeAdminSpecialistId = getSpecialistForTab(activeTab);
  const activeAdminSpecialist =
    ROBOT_FLEET.find((r) => r.id === activeAdminSpecialistId) || ROBOT_FLEET[0];

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-1">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>AI Executive Studio • Real Working Gemini AI Engine</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white">Smart AI Security & Production Command Hub</h2>
          <p className="text-gray-400 text-xs mt-1">
            Real-time profile fraud inspector, Maharashtra VIP event security planner, commercial rate valuation, press release wire generator, talent matchmaker, and telecast scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gemini AI Engine Active</span>
          </span>
        </div>
      </div>

      {/* 3D Gold Robot Executive Copilot Command Station */}
      <div className="card-luxury p-5 rounded-2xl border-gold-glow bg-gradient-to-r from-[#18060E] via-[#0E0E14] to-[#181206] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* 3D Gold Robot Visual Model / Live Video Telecast Container */}
          <div className="relative shrink-0 flex flex-col items-center justify-center">
            {adminFeedMode === '3d' ? (
              <div className="relative flex items-center justify-center">
                <SmartRobot3DCanvas
                  specialistId={activeAdminSpecialistId}
                  size="lg"
                  mood={robotMood}
                  enableTracking={true}
                  interactive={true}
                  className="drop-shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
                />
                <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-black/80 border border-[#D4AF37]/50 text-[10px] font-cinzel font-bold text-[#F3D068]">
                  {activeAdminSpecialist.channel} • {activeAdminSpecialist.code}
                </div>
              </div>
            ) : (
              <div className="w-72 h-48 rounded-xl overflow-hidden shadow-2xl border border-white/20">
                <LiveCinematicRobotFeed
                  specialistId={activeAdminSpecialistId}
                  language="en"
                  preferredOperation={getOperationForTab(activeTab)}
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Quick Switch Button */}
            <button
              onClick={() => setAdminFeedMode(adminFeedMode === '3d' ? 'video' : '3d')}
              className="mt-3 px-3 py-1 rounded-full bg-black/70 hover:bg-black text-[10px] font-mono text-[#F3D068] border border-[#D4AF37]/40 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
            >
              {adminFeedMode === '3d' ? (
                <>
                  <Video className="w-3 h-3 text-red-400 animate-pulse" />
                  <span>Watch 4K Video Telecast</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-[#D4AF37]" />
                  <span>Switch to 3D Hologram</span>
                </>
              )}
            </button>
          </div>

          {/* Autonomous Telemetry & Action Center */}
          <div className="flex-1 space-y-3.5 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3D068] text-xs font-cinzel font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                <span>{activeAdminSpecialist.nameEn}</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Autonomous Mode Online</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/5">
              {robotStatusText}
            </p>

            {/* Audit Results Bar if scanned */}
            {auditStats && (
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-cinzel">Scanned</span>
                  <span className="font-bold text-white font-mono text-sm">{auditStats.scanned}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-cinzel">Verified</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{auditStats.verified}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-cinzel">Flags</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">{auditStats.flagged}</span>
                </div>
              </div>
            )}

            {/* Autonomous Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              <button
                onClick={runAutonomousDatabaseAudit}
                disabled={isAuditing}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-cinzel font-bold text-black flex items-center gap-2 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>{isAuditing ? 'Auditing Database...' : 'Run Autonomous Profile Audit'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('rateEstimator');
                  setRobotStatusText('Configured Commercial Rate Valuation Engine. Calculating optimal Maharashtra appearance rates.');
                  setRobotMood('speaking');
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-[#F3D068] border border-white/15 hover:border-[#D4AF37]/50 text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Rate Valuation Benchmarker</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('contract');
                  setRobotStatusText('Performance Contract Generator Loaded. Ready to generate Maharashtra VIP legal agreements.');
                  setRobotMood('speaking');
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-[#F3D068] border border-white/15 hover:border-[#D4AF37]/50 text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Instant Contract Drafter</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('anthemStudio');
                  setRobotStatusText('Google Lyria AI Music Suite Activated. Ready to compose VIP entry fanfares and red carpet anthems.');
                  setRobotMood('speaking');
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-rose-950/40 hover:from-[#D4AF37]/30 text-[#F3D068] border border-[#D4AF37]/50 text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Lyria Music Anthem Studio</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#12121A] rounded-xl border border-white/10">
        <button
          onClick={() => setActiveTab('securityGuard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'securityGuard'
              ? 'bg-rose-500 text-white font-bold shadow'
              : 'text-rose-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>🛡️ AI Profile Security Guard</span>
        </button>

        <button
          onClick={() => setActiveTab('eventSecurity')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'eventSecurity'
              ? 'bg-amber-500 text-black font-bold shadow'
              : 'text-amber-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>🚨 Event Risk & Police NOC</span>
        </button>

        <button
          onClick={() => setActiveTab('rateEstimator')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'rateEstimator'
              ? 'bg-[#D4AF37] text-black font-bold shadow'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>💰 Commercial Rate Valuation</span>
        </button>

        <button
          onClick={() => setActiveTab('pressRelease')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'pressRelease'
              ? 'bg-[#D4AF37] text-black font-bold shadow'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>📰 Press Release Wire</span>
        </button>

        <button
          onClick={() => setActiveTab('matchmaker')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'matchmaker'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Talent Matchmaker</span>
        </button>

        <button
          onClick={() => setActiveTab('bio')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'bio'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Press Bio & Pitcher</span>
        </button>

        <button
          onClick={() => setActiveTab('contract')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'contract'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Contract Rider Drafter</span>
        </button>

        <button
          onClick={() => setActiveTab('audition')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'audition'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5" />
          <span>Audition Evaluator</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Telecast Scheduler</span>
        </button>

        <button
          onClick={() => setActiveTab('anthemStudio')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'anthemStudio'
              ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3D068] to-[#AA7C11] text-black font-bold shadow'
              : 'text-[#F3D068] hover:text-white hover:bg-white/5 border border-[#D4AF37]/30'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>🎵 VIP Anthem Studio (Lyria AI)</span>
        </button>
      </div>

      {/* 1. TAB: PROFILE SECURITY GUARD */}
      {activeTab === 'securityGuard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>AI Profile Fraud & Legitimacy Inspector</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Anti-Impersonation
              </span>
            </div>

            {/* Quick Presets */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">
                ⚡ 1-Click Test Scenarios (उदाहरणे):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applySecPreset('marathiActor')}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                >
                  🎭 Senior Marathi Actor
                </button>
                <button
                  type="button"
                  onClick={() => applySecPreset('unverified')}
                  className="px-2 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-[10px] text-rose-300 border border-rose-500/30 transition cursor-pointer"
                >
                  ⚠️ Suspicious Unverified
                </button>
                <button
                  type="button"
                  onClick={() => applySecPreset('bollywoodStar')}
                  className="px-2 py-1 rounded-md bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[10px] text-[#F3D068] border border-[#D4AF37]/30 transition cursor-pointer"
                >
                  👑 Bollywood A-Lister
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Artist / Profile Name</label>
                <input
                  type="text"
                  value={secName}
                  onChange={(e) => setSecName(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={secCategory}
                    onChange={(e) => setSecCategory(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Location / Hub</label>
                  <input
                    type="text"
                    value={secCity}
                    onChange={(e) => setSecCity(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Claimed Reach & Metrics</label>
                <input
                  type="text"
                  value={secFollowers}
                  onChange={(e) => setSecFollowers(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Claimed Experience / Credits</label>
                <input
                  type="text"
                  value={secExp}
                  onChange={(e) => setSecExp(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="secIdCheck"
                  checked={secIdProvided}
                  onChange={(e) => setSecIdProvided(e.target.checked)}
                  className="rounded border-gray-600 text-rose-500 focus:ring-0"
                />
                <label htmlFor="secIdCheck" className="text-xs text-gray-300 cursor-pointer">
                  Official Govt KYC / Guild Identification Uploaded
                </label>
              </div>

              <button
                onClick={handleSecurityAudit}
                disabled={secLoading}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {secLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>{secLoading ? 'Auditing Security Profile...' : 'Run Real-time AI Security Audit'}</span>
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Security Clearance Audit Report</span>
              {secData && (
                <button
                  onClick={() => downloadPdf('AVA_Security_Audit_Report', secData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {secData ? (
              <div className="space-y-4 text-xs overflow-y-auto max-h-[460px]">
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Trust Index</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">{secData.trustScore}/100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase">Risk Assessment</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {secData.riskLevel}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-white block mb-1">Integrity Evaluation:</span>
                  <p className="text-gray-300 text-[11px] leading-relaxed bg-[#14141E] p-3 rounded-lg border border-white/5">
                    {secData.identityIntegrityAssessment}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-white block mb-1.5">Verification Checklist:</span>
                  <div className="space-y-1.5">
                    {secData.verificationChecklist?.map((v: any, i: number) => (
                      <div key={i} className="p-2 rounded bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-gray-200">{v.item}</span>
                        <span className={`font-mono text-[10px] font-bold ${v.status === 'Passed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {v.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px]">
                  <strong>Action Directive:</strong> {secData.executiveActionRecommendation}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <ShieldCheck className="w-10 h-10 mb-2 text-rose-500/40" />
                <span>Execute an audit on the left to inspect applicant risk and legitimacy.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TAB: EVENT SECURITY & POLICE NOC PLANNER */}
      {activeTab === 'eventSecurity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Maharashtra Event Security & Police NOC Planner</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event Name & Production Title</label>
                <input
                  type="text"
                  value={evName}
                  onChange={(e) => setEvName(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Venue & District in Maharashtra</label>
                <input
                  type="text"
                  value={evVenue}
                  onChange={(e) => setEvVenue(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Expected Crowd Size</label>
                  <input
                    type="text"
                    value={evCrowd}
                    onChange={(e) => setEvCrowd(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">VIP & Dignitary Attendees</label>
                  <input
                    type="text"
                    value={evVIPs}
                    onChange={(e) => setEvVIPs(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Security Tier Protocol</label>
                <select
                  value={evTier}
                  onChange={(e) => setEvTier(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-gray-200"
                >
                  <option value="Tier-1 Presidential Executive Security Protocol">Tier-1 Presidential Executive Protocol</option>
                  <option value="Tier-2 Standard Red Carpet VIP Protection">Tier-2 Standard Red Carpet VIP Protection</option>
                  <option value="Tier-3 Concert & Arena Festival Crowd Control">Tier-3 Arena & Festival Crowd Control</option>
                </select>
              </div>

              <button
                onClick={handleEventSecurity}
                disabled={evSecLoading}
                className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {evSecLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{evSecLoading ? 'Formulating Security Protocol...' : 'Generate Police NOC & Security Grid'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Security Deployment Matrix</span>
              {evSecData && (
                <button
                  onClick={() => downloadPdf('AVA_Event_Security_Protocol', evSecData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {evSecData ? (
              <div className="space-y-3 text-xs overflow-y-auto max-h-[460px]">
                <div className="p-3 rounded-lg bg-black/60 border border-amber-500/30 flex items-center justify-between">
                  <span className="font-bold text-amber-400">{evSecData.overallSecurityLevel}</span>
                  <span className="font-mono text-gray-300">Guards: {evSecData.recommendedPersonnelCount}</span>
                </div>

                <div>
                  <span className="font-bold text-white block mb-1">Police & Municipal NOC Checklist:</span>
                  <ul className="space-y-1">
                    {evSecData.policeNocChecklist?.map((noc: string, i: number) => (
                      <li key={i} className="text-gray-300 text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{noc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-white block mb-1">Zone Deployment:</span>
                  <div className="space-y-2">
                    {evSecData.securityDeploymentZones?.map((z: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded bg-[#14141E] border border-white/5 text-[11px]">
                        <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                          <span>{z.zone}</span>
                          <span>{z.guardsRequired} Personnel</span>
                        </div>
                        <p className="text-gray-400">{z.protocol}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-white/5 border border-white/10 text-[11px] text-gray-300">
                  <strong className="text-amber-400">Emergency Extraction:</strong> {evSecData.emergencyEvacuationPlan}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <Lock className="w-10 h-10 mb-2 text-amber-500/40" />
                <span>Configure event parameters on the left to generate police NOC and guard deployment plan.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB: COMMERCIAL RATE ESTIMATOR */}
      {activeTab === 'rateEstimator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span>Commercial Talent Valuation & Rate Benchmark</span>
            </h3>

            {/* Quick Presets */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">
                ⚡ 1-Click Rate Presets (तपशील भरा):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyRatePreset('marathiLead')}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                >
                  🎭 Marathi Cinema Lead
                </button>
                <button
                  type="button"
                  onClick={() => applyRatePreset('supermodel')}
                  className="px-2 py-1 rounded-md bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[10px] text-[#F3D068] border border-[#D4AF37]/30 transition cursor-pointer"
                >
                  👗 Haute Couture Model
                </button>
                <button
                  type="button"
                  onClick={() => applyRatePreset('playbackSinger')}
                  className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
                >
                  🎤 Playback Sensation
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Artist Name</label>
                <input
                  type="text"
                  value={rateTalent}
                  onChange={(e) => setRateTalent(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={rateCat}
                    onChange={(e) => setRateCat(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Maharashtra District</label>
                  <input
                    type="text"
                    value={rateDistrict}
                    onChange={(e) => setRateDistrict(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Engagement Type & Scope</label>
                <input
                  type="text"
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <button
                onClick={handleRateEstimate}
                disabled={rateLoading}
                className="w-full py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {rateLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                <span>{rateLoading ? 'Calculating Valuation...' : 'Calculate Commercial Rate Benchmark'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Market Pricing Schedule</span>
              {rateData && (
                <button
                  onClick={() => downloadPdf('AVA_Rate_Valuation_Sheet', rateData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {rateData ? (
              <div className="space-y-4 text-xs overflow-y-auto max-h-[460px]">
                <div className="p-4 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-center space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Recommended Base Rate</span>
                  <span className="text-3xl font-bold font-mono text-[#F3D068]">{rateData.estimatedBaseRate}</span>
                  <span className="text-[11px] text-gray-400 block">{rateData.recommendedFeeBracket}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-gray-400 block mb-0.5">Half-Day Shoot (4 Hrs)</span>
                    <strong className="text-white text-xs">{rateData.halfDayRate}</strong>
                  </div>
                  <div className="p-3 rounded bg-white/5 border border-white/5">
                    <span className="text-gray-400 block mb-0.5">Full-Day Shoot (8 Hrs)</span>
                    <strong className="text-white text-xs">{rateData.fullDayRate}</strong>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#14141E] border border-white/5 space-y-1 text-[11px]">
                  <strong className="text-amber-400 block">Travel & Hospitality Rider:</strong>
                  <p className="text-gray-300">{rateData.travelHospitalityRiderCost}</p>
                </div>

                <div className="p-3 rounded bg-[#14141E] border border-white/5 space-y-1 text-[11px]">
                  <strong className="text-amber-400 block">Pricing Justification:</strong>
                  <p className="text-gray-300 leading-relaxed">{rateData.pricingJustification}</p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <DollarSign className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
                <span>Enter talent parameters to compute market rates and rider costs.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB: PRESS RELEASE WIRE */}
      {activeTab === 'pressRelease' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#D4AF37]" />
              <span>AI Press Release & Entertainment Wire Generator</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Headline Topic / Milestone</label>
                <input
                  type="text"
                  value={prTopic}
                  onChange={(e) => setPrTopic(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Talent / Agency Principal</label>
                <input
                  type="text"
                  value={prStar}
                  onChange={(e) => setPrStar(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Campaign / Event Title</label>
                <input
                  type="text"
                  value={prCampaign}
                  onChange={(e) => setPrCampaign(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <button
                onClick={handlePressRelease}
                disabled={prLoading}
                className="w-full py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {prLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Newspaper className="w-3.5 h-3.5" />}
                <span>{prLoading ? 'Drafting Press Wire...' : 'Generate Official Media Press Release'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Entertainment Wire Draft</span>
              {prData && (
                <button
                  onClick={() => downloadPdf('AVA_Official_Press_Release', prData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {prData ? (
              <div className="space-y-4 text-xs overflow-y-auto max-h-[460px]">
                <div className="p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 space-y-1">
                  <span className="text-[10px] text-amber-400 font-mono block">{prData.dateline}</span>
                  <h4 className="font-cinzel text-xs font-bold text-white leading-tight">{prData.officialHeadline}</h4>
                </div>

                <p className="text-gray-300 text-[11px] leading-relaxed bg-[#14141E] p-3 rounded-lg border border-white/5">
                  {prData.pressReleaseBody}
                </p>

                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-[#F3D068] italic">
                  {prData.executiveQuote}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-white text-[11px] block">Social Media Copy:</span>
                  {prData.socialMediaHeadlines?.map((sh: string, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-white/5 border border-white/5 text-[10px] text-gray-300">
                      {sh}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <Newspaper className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
                <span>Enter milestone details to generate an AP-style entertainment press release.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB: MATCHMAKER */}
      {activeTab === 'matchmaker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Event Brief & Casting Target</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event Type & Prestige Level</label>
                <input
                  type="text"
                  value={matchEvent}
                  onChange={(e) => setMatchEvent(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Target Budget Bracket</label>
                  <input
                    type="text"
                    value={matchBudget}
                    onChange={(e) => setMatchBudget(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">City / Venue</label>
                  <input
                    type="text"
                    value={matchCity}
                    onChange={(e) => setMatchCity(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Specific Persona & Audience Alignment</label>
                <textarea
                  rows={3}
                  value={matchReqs}
                  onChange={(e) => setMatchReqs(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white leading-relaxed"
                />
              </div>

              <button
                onClick={handleMatch}
                disabled={matchLoading}
                className="w-full py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {matchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{matchLoading ? 'Analyzing Roster...' : 'Execute AI Matchmaking'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Matchmaking Dossier</span>
              {matchData && (
                <button
                  onClick={() => downloadPdf('AVA_Talent_Match_Dossier', matchData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {matchData ? (
              <div className="space-y-4 text-xs overflow-y-auto max-h-[460px]">
                <p className="text-gray-300 text-[11px] leading-relaxed bg-[#14141E] p-3 rounded-lg border border-white/5">
                  {matchData.executiveSummary}
                </p>
                <div className="space-y-2.5">
                  {matchData.matches?.map((m: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{m.talentName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black">
                          {m.matchScore}% Match
                        </span>
                      </div>
                      <div className="text-[#F3D068] text-[11px]">{m.suggestedRole} • {m.estimatedFeeRange}</div>
                      <p className="text-gray-400 text-[10px]">{m.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <UserCheck className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
                <span>Execute an AI Matchmaking run on the left to review recommended artists.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB: PRESS BIO */}
      {activeTab === 'bio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Artist Career Parameters & PR Bio Suite</span>
            </h3>

            {/* Quick Presets */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">
                ⚡ 1-Click Artist Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyBioPreset('marathiIcon')}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                >
                  💃 Marathi Dance Icon
                </button>
                <button
                  type="button"
                  onClick={() => applyBioPreset('fashionModel')}
                  className="px-2 py-1 rounded-md bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[10px] text-[#F3D068] border border-[#D4AF37]/30 transition cursor-pointer"
                >
                  👗 GQ Fashion Model
                </button>
                <button
                  type="button"
                  onClick={() => applyBioPreset('musicArtist')}
                  className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
                >
                  🎼 Orchestral Ensemble
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Artist Name</label>
                <input
                  type="text"
                  value={bioName}
                  onChange={(e) => setBioName(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={bioCat}
                    onChange={(e) => setBioCat(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Tone</label>
                  <select
                    value={bioTone}
                    onChange={(e) => setBioTone(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-gray-200"
                  >
                    <option value="Luxury Haute Couture">Luxury Haute Couture</option>
                    <option value="Commercial Brand Endorsement">Commercial Brand Endorsement</option>
                    <option value="Film Director & Casting Bureau">Film Director & Casting Bureau</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Key Accolades & Milestones</label>
                <textarea
                  rows={3}
                  value={bioCreds}
                  onChange={(e) => setBioCreds(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white leading-relaxed"
                />
              </div>

              <button
                onClick={handleBio}
                disabled={bioLoading}
                className="w-full py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {bioLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{bioLoading ? 'Composing...' : 'Draft PR Suite'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Editorial Output</span>
              {bioData && (
                <button
                  onClick={() => downloadPdf('AVA_Artist_PR_Dossier', bioData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {bioData ? (
              <div className="space-y-3 text-xs overflow-y-auto max-h-[460px]">
                <div className="font-cinzel text-sm font-bold text-[#F3D068]">{bioData.headline}</div>
                <div className="p-3 rounded-lg bg-[#14141E] border border-white/5 text-gray-300 leading-relaxed text-[11px]">
                  {bioData.executiveBio}
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-[11px] text-gray-300">
                  <strong className="text-amber-400">Pitch Hook:</strong> {bioData.brandPitchHook}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <Sparkles className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
                <span>Fill parameters on the left to generate PR kits and executive bios.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. TAB: CONTRACT RIDER */}
      {activeTab === 'contract' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>Contract Rider & Legal Agreement Drafter</span>
            </h3>

            {/* Quick Presets */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">
                ⚡ 1-Click Contract Types (नमुने):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyContractPreset('endorsement')}
                  className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 hover:text-white border border-white/10 transition cursor-pointer"
                >
                  💍 Brand Endorsement
                </button>
                <button
                  type="button"
                  onClick={() => applyContractPreset('liveConcert')}
                  className="px-2 py-1 rounded-md bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[10px] text-[#F3D068] border border-[#D4AF37]/30 transition cursor-pointer"
                >
                  🎤 Live Gala Concert
                </button>
                <button
                  type="button"
                  onClick={() => applyContractPreset('filmShoot')}
                  className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
                >
                  🎬 Cinema Feature Shoot
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Client Entity</label>
                  <input
                    type="text"
                    value={contractClient}
                    onChange={(e) => setContractClient(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Headline Talent</label>
                  <input
                    type="text"
                    value={contractTalent}
                    onChange={(e) => setContractTalent(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Engagement & Venue</label>
                <input
                  type="text"
                  value={contractVenue}
                  onChange={(e) => setContractVenue(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Special Rider Requirements</label>
                <textarea
                  rows={3}
                  value={contractSpecial}
                  onChange={(e) => setContractSpecial(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white leading-relaxed"
                />
              </div>

              <button
                onClick={handleContract}
                disabled={contractLoading}
                className="w-full py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {contractLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{contractLoading ? 'Drafting Rider...' : 'Draft Legal Rider Schedule'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Binding Legal Rider</span>
              {contractData && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const fullText = `${contractData.agreementTitle}\n\n` + contractData.clauses?.map((c: any) => `${c.heading}:\n${c.clauseText}`).join('\n\n');
                      copyText(fullText, 'fullContract');
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                  >
                    {copiedKey === 'fullContract' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#D4AF37]" />}
                    <span>{copiedKey === 'fullContract' ? 'Copied' : 'Copy All'}</span>
                  </button>
                  <button
                    onClick={() => downloadPdf('AVA_Talent_Contract_Rider', contractData)}
                    className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-[#D4AF37]" />
                    <span>PDF</span>
                  </button>
                </div>
              )}
            </h3>

            {contractData ? (
              <div className="space-y-3 text-xs overflow-y-auto max-h-[460px]">
                <div className="font-cinzel text-xs font-bold text-[#F3D068]">{contractData.agreementTitle}</div>
                <div className="space-y-2">
                  {contractData.clauses?.map((c: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-[#14141E] border border-white/5 space-y-1 group relative">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white">{c.heading}</div>
                        <button
                          onClick={() => copyText(`${c.heading}\n${c.clauseText}`, `clause-${i}`)}
                          className="opacity-60 hover:opacity-100 text-gray-400 hover:text-white transition cursor-pointer p-1"
                          title="Copy Clause"
                        >
                          {copiedKey === `clause-${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-gray-400 text-[11px] leading-relaxed">{c.clauseText}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <FileText className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
                <span>Fill parameters on the left to draft full contract rider schedules.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. TAB: AUDITION EVALUATOR */}
      {activeTab === 'audition' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-[#D4AF37]" />
              <span>Audition Script & Character Profile</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Casting Role Title</label>
                <input
                  type="text"
                  value={audRole}
                  onChange={(e) => setAudRole(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Production Medium</label>
                <input
                  type="text"
                  value={audMedium}
                  onChange={(e) => setAudMedium(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Monologue Extract / Self-Tape Script</label>
                <textarea
                  rows={4}
                  value={audScript}
                  onChange={(e) => setAudScript(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white leading-relaxed"
                />
              </div>

              <button
                onClick={handleAudition}
                disabled={audLoading}
                className="w-full py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {audLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Clapperboard className="w-3.5 h-3.5" />}
                <span>{audLoading ? 'Analyzing Monologue...' : 'Evaluate Screen Audition'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Casting Bureau Verdict</span>
              {audData && (
                <button
                  onClick={() => downloadPdf('AVA_Audition_Evaluation', audData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {audData ? (
              <div className="space-y-3 text-xs overflow-y-auto max-h-[460px]">
                <div className="p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 flex items-center justify-between">
                  <span className="font-bold text-white">{audData.castingVerdict}</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#D4AF37] text-black">
                    Score: {audData.overallScore}/100
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#14141E] border border-white/5 text-[11px] text-gray-300">
                  <strong className="text-amber-400 block mb-1">Director Notes:</strong>
                  {audData.directorNotes}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <Clapperboard className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
                <span>Evaluate a self-tape monologue on the left to receive casting feedback.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. TAB: TELECAST SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Event Run-of-Show Protocol</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">Event Title</label>
                <input
                  type="text"
                  value={schedEvent}
                  onChange={(e) => setSchedEvent(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Venue</label>
                  <input
                    type="text"
                    value={schedVenue}
                    onChange={(e) => setSchedVenue(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={schedDuration}
                    onChange={(e) => setSchedDuration(e.target.value)}
                    className="w-full bg-[#14141E] border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSchedule}
                disabled={schedLoading}
                className="w-full py-2.5 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {schedLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                <span>{schedLoading ? 'Generating Schedule...' : 'Generate 4K Run-of-Show Timeline'}</span>
              </button>
            </div>
          </div>

          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-base font-bold text-white flex items-center justify-between">
              <span>Live Run-of-Show Sheet</span>
              {schedData && (
                <button
                  onClick={() => downloadPdf('AVA_Run_of_Show_Protocol', schedData)}
                  className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-300 flex items-center gap-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#D4AF37]" />
                  <span>PDF</span>
                </button>
              )}
            </h3>

            {schedData ? (
              <div className="space-y-3 text-xs overflow-y-auto max-h-[460px]">
                <div className="p-3 rounded-lg bg-black/60 border border-[#D4AF37]/30 text-white font-bold font-cinzel">
                  {schedData.masterTitle}
                </div>
                <div className="space-y-2">
                  {schedData.scheduleTimeline?.map((slot: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#14141E] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#D4AF37] font-mono">{slot.timeSlot}</span>
                        <span className="text-white font-medium">{slot.activity}</span>
                      </div>
                      <div className="text-gray-400 text-[10px]">Cue: {slot.stageCue}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 text-xs">
                <Calendar className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
                <span>Fill event parameters on the left to generate a master run-of-show schedule.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. TAB: VIP EVENT & ARTIST ANTHEM STUDIO (GOOGLE LYRIA AI) */}
      {activeTab === 'anthemStudio' && (
        <VipMusicAnthemStudio
          initialArtistName="Ranveer Kapoor"
          initialEventType="AVA Maharashtra Grand Red Carpet Gala 2026"
          isAdmin={true}
        />
      )}
    </div>
  );
};
