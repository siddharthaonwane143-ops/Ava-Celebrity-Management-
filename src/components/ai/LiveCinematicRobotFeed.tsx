import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Tv,
  Radio,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  FileText,
  UserCheck,
  Volume2,
  VolumeX,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { RobotSpecialistId, ROBOT_FLEET } from './robotFleetData';

export type VideoOperationType = 'profile_scan' | 'rate_calc' | 'contract_draft' | 'security_protocol';

interface LiveCinematicRobotFeedProps {
  specialistId: RobotSpecialistId;
  language: 'mr' | 'hi' | 'en';
  preferredOperation?: VideoOperationType;
  onOperationChange?: (op: VideoOperationType) => void;
  className?: string;
}

export const LiveCinematicRobotFeed: React.FC<LiveCinematicRobotFeedProps> = ({
  specialistId,
  language,
  preferredOperation = 'profile_scan',
  onOperationChange,
  className = ''
}) => {
  const [activeOp, setActiveOp] = useState<VideoOperationType>(preferredOperation);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentSpecialist = ROBOT_FLEET.find((r) => r.id === specialistId) || ROBOT_FLEET[0];

  // Sync with prop when external query triggers operation change
  useEffect(() => {
    if (preferredOperation) {
      setActiveOp(preferredOperation);
      setProgressPercent(0);
      setStepIndex(0);
    }
  }, [preferredOperation]);

  // Operational Step Content (Strict 100% Pure Language - No Mixing)
  const operationSteps = {
    profile_scan: {
      titleMr: 'थेट बायोमेट्रिक व सेलिब्रिटी प्रोफाईल स्कॅनिंग',
      titleHi: 'लाइव बायोमेट्रिक एवं सेलिब्रिटी प्रोफाइल स्कैनिंग',
      titleEn: 'Live Biometric & Celebrity Profile Scanning',
      badgeMr: 'पडताळणी प्रक्रिया चालू',
      badgeHi: 'सत्यापन प्रक्रिया जारी',
      badgeEn: 'VERIFICATION ACTIVE',
      stepsMr: [
        '१. चेहरेपट्टी व बायोमेट्रिक प्रमाणीकरण सुरू...',
        '२. ५००+ अधिकृत मराठी व हिंदी सिनेसृष्टी डेटाबेस तपासणी...',
        '३. अधिकृत कलावंत गिल्ड व ओळखपत्र पडताळणी...',
        '४. पडताळणी १००% यशस्वी! अधिकृत सेलिब्रिटी प्रोफाईल सिद्ध.'
      ],
      stepsHi: [
        '१. मुखाकृति एवं बायोमेट्रिक प्रमाणीकरण प्रारंभ...',
        '२. 500+ आधिकारिक फिल्म एवं कला डेटाबेस जांच...',
        '३. आधिकारिक कलाकार संघ एवं पहचान पत्र सत्यापन...',
        '४. सत्यापन 100% सफल! आधिकारिक सेलिब्रिटी प्रोफाइल सिद्ध।'
      ],
      stepsEn: [
        '1. Initiating facial biometric geometry scan...',
        '2. Cross-referencing 500+ verified film & TV artist databases...',
        '3. Validating official artists guild credentials & credentials...',
        '4. Verification 100% Complete! Artist identity verified.'
      ]
    },
    rate_calc: {
      titleMr: 'व्यावसायिक मानधन व बजेट मोजणी प्रक्रिया',
      titleHi: 'व्यावसायिक मानदेय एवं बजट मूल्यांकन प्रक्रिया',
      titleEn: 'Commercial Appearance Fee & Budget Valuation',
      badgeMr: 'मानधन गणित चालू',
      badgeHi: 'मानदेय गणना जारी',
      badgeEn: 'FINANCE ALGORITHM',
      stepsMr: [
        '१. कार्यक्रम स्वरूप व शहर श्रेणी (मुंबई/पुणे) विश्लेषण...',
        '२. उपस्थिती वेळ (अर्धा दिवस ४ तास / पूर्ण दिवस ८ तास) तपासणी...',
        '३. कलाकार प्रवास, सुरक्षा व निवास भत्ते संयोजन...',
        '४. अधिकृत व्यावसायिक मानधन दरपत्रक अंतिम झाले.'
      ],
      stepsHi: [
        '१. आयोजन स्वरूप एवं शहर श्रेणी (मुंबई/पुणे) विश्लेषण...',
        '२. उपस्थिति समय (आधा दिन ४ घंटे / पूरा दिन ८ घंटे) जांच...',
        '३. कलाकार यात्रा, सुरक्षा एवं आवास भत्तों का संयोजन...',
        '४. आधिकारिक व्यावसायिक मानदेय दर सूची तैयार।'
      ],
      stepsEn: [
        '1. Evaluating event tier and venue location tier...',
        '2. Calculating engagement duration (Half-Day / Full-Day)...',
        '3. Factoring hospitality, VIP security transit, and per diem riders...',
        '4. Official commercial appearance quotation finalized.'
      ]
    },
    contract_draft: {
      titleMr: 'अधिकृत कामगिरी करारनामा व सुरक्षित अटी लेखन',
      titleHi: 'आधिकारिक प्रदर्शन अनुबंध पत्र एवं सुरक्षा नियम लेखन',
      titleEn: 'Performance Contract & Legal Rider Drafting',
      badgeMr: 'करारनामा तयार होत आहे',
      badgeHi: 'अनुबंध तैयार हो रहा है',
      badgeEn: 'LEGAL PROTOCOL',
      stepsMr: [
        '१. गोपनीय करार (NDA) व हक्क संरक्षण मसुदा...',
        '२. तारीख आरक्षण, वेळ मर्यादा व तांत्रिक अटी निश्चिती...',
        '३. मानधन देयक टप्पे व आगाऊ रक्कम सुरक्षितता...',
        '४. अधिकृत स्वाक्षरी व डिजिटल एजन्सी शिक्का प्रमाणित.'
      ],
      stepsHi: [
        '१. गोपनीयता अनुबंध (NDA) एवं अधिकार संरक्षण प्रारूप...',
        '२. तिथि आरक्षण, समय सीमा एवं तकनीकी शर्तें निर्धारण...',
        '३. मानदेय भुगतान चरण एवं अग्रिम राशि सुरक्षा...',
        '४. आधिकारिक हस्ताक्षर एवं डिजिटल मुहर प्रमाणित।'
      ],
      stepsEn: [
        '1. Drafting strict non-disclosure (NDA) and publicity boundaries...',
        '2. Locking calendar dates, staging requirements, and call times...',
        '3. Setting structured milestone escrow payouts...',
        '4. Cryptographic digital contract seal and agency approval certified.'
      ]
    },
    security_protocol: {
      titleMr: 'व्हीआयपी बंदोबस्त, बाउंसर व व्यासपीठ सुरक्षा',
      titleHi: 'वीआईपी सुरक्षा, बाउंसर एवं मंच व्यवस्था',
      titleEn: 'VIP Crowd Security & Bouncer Protocol',
      badgeMr: 'सुरक्षा कवच सक्रिय',
      badgeHi: 'सुरक्षा घेरा सक्रिय',
      badgeEn: 'SECURITY SHIELD',
      stepsMr: [
        '१. कार्यक्रम स्थळ नकाशा व प्रवेशद्वार नियंत्रण नियोजन...',
        '२. सशस्त्र अंगरक्षक व सेलिब्रिटी सुरक्षित मार्ग निश्चिती...',
        '३. रेड-कार्पेट बॅरिकेडिंग व गर्दी नियंत्रण यंत्रणा सज्ज...',
        '४. प्रथम श्रेणी व्हीआयपी सुरक्षा कवच पूर्णतः कार्यान्वित.'
      ],
      stepsHi: [
        '१. समारोह स्थल मानचित्र एवं प्रवेश द्वार नियंत्रण योजना...',
        '२. अंगरक्षक दल एवं सेलिब्रिटी सुरक्षित आवागमन मार्ग सुनिश्चित...',
        '३. रेड-कार्पेट बैरिकेडिंग एवं भीड़ नियंत्रण तंत्र तैयार...',
        '४. प्रथम श्रेणी वीआईपी सुरक्षा घेरा पूर्णतः सक्रिय।'
      ],
      stepsEn: [
        '1. Mapping tactical venue blueprints and ingress checkpoints...',
        '2. Positioning armed bodyguard escorts and protected transit route...',
        '3. Deploying heavy red-carpet perimeter barriers...',
        '4. Tier-1 VIP presidential security perimeter confirmed.'
      ]
    }
  };

  const currentOpData = operationSteps[activeOp];

  // 60FPS Cinematic Canvas Rendering Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const accentHex = currentSpecialist.accentHex;
    const borderHex = currentSpecialist.borderHex;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Cinematic Dark CRT / High-Tech Monitor Background
      ctx.fillStyle = '#06060A';
      ctx.fillRect(0, 0, w, h);

      // Subtle Cybernetic Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center Ambient Glow Emitter
      const radGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
      radGrad.addColorStop(0, `${accentHex}25`);
      radGrad.addColorStop(1, 'rgba(6, 6, 10, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Specific Real-Working Visual Simulation Graphics
      if (activeOp === 'profile_scan') {
        // FACIAL & BIOMETRIC WIREFRAME SCANNING
        const cx = w * 0.45;
        const cy = h * 0.48;

        // Outer Rotating Targeting Reticle
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((frame * 0.02 * playbackSpeed));
        ctx.strokeStyle = accentHex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 75, 0, Math.PI * 1.5);
        ctx.stroke();

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 85, Math.PI * 0.5, Math.PI * 1.8);
        ctx.stroke();
        ctx.restore();

        // Biometric Face Wireframe Silhouette
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = borderHex;
        ctx.lineWidth = 2;

        // Head Oval
        ctx.beginPath();
        ctx.ellipse(0, -5, 45, 58, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Facial Landmark Points
        ctx.fillStyle = '#10b981';
        const landmarks = [
          [-16, -18], [16, -18], // Eyes
          [0, -2],               // Nose
          [-18, 22], [18, 22], [0, 26], // Mouth
          [-35, -5], [35, -5],   // Temples
          [0, 50]                // Chin
        ];
        landmarks.forEach(([lx, ly]) => {
          ctx.beginPath();
          ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Connective Wireframe lines
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -2);
          ctx.lineTo(lx, ly);
          ctx.stroke();
        });

        // Vertical Laser Scanning Bar
        const scanY = (Math.sin(frame * 0.06 * playbackSpeed) * 60);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(-60, scanY);
        ctx.lineTo(60, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Telemetry Data Box on Right
        ctx.fillStyle = 'rgba(10, 10, 16, 0.85)';
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(w * 0.72, h * 0.2, w * 0.25, h * 0.6, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('NEURAL BIOMETRICS', w * 0.74, h * 0.28);

        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.fillText('CONFIDENCE: 99.8%', w * 0.74, h * 0.38);
        ctx.fillText('GUILD ID: MH-2026', w * 0.74, h * 0.46);
        ctx.fillText('STATUS: BLUE TICK', w * 0.74, h * 0.54);
        ctx.fillText('PORTFOLIO: 4K OK', w * 0.74, h * 0.62);

        // Green Success Check
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(w * 0.84, h * 0.72, 8, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeOp === 'rate_calc') {
        // RATE VALUATION & GRAPHIC TELEMETRY
        const startX = w * 0.12;
        const startY = h * 0.75;
        const chartW = w * 0.58;
        const chartH = h * 0.5;

        // Base Axis
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + chartW, startY);
        ctx.lineTo(startX + chartW, startY - chartH);
        ctx.stroke();

        // Animated Bar Columns (Appearance Tiers)
        const bars = [
          { val: 0.45, label: 'TIER-2' },
          { val: 0.72, label: 'HALF-DAY' },
          { val: 0.95, label: 'FULL-DAY' },
          { val: 0.60, label: 'KEYNOTE' }
        ];

        bars.forEach((bar, idx) => {
          const bx = startX + 25 + idx * (chartW / 4.2);
          const maxBarHeight = chartH * bar.val;
          const animHeight = maxBarHeight * (0.8 + Math.sin(frame * 0.05 + idx) * 0.2);
          const by = startY - animHeight;

          // Gradient fill
          const barGrad = ctx.createLinearGradient(bx, by, bx, startY);
          barGrad.addColorStop(0, accentHex);
          barGrad.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
          ctx.fillStyle = barGrad;
          ctx.fillRect(bx, by, 32, animHeight);

          // Top Cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx, by - 2, 32, 2);

          // Value Text
          ctx.fillStyle = '#F3D068';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`₹${Math.floor(bar.val * 50)}L`, bx + 2, by - 8);

          // Label
          ctx.fillStyle = '#9ca3af';
          ctx.font = '8px monospace';
          ctx.fillText(bar.label, bx + 2, startY + 14);
        });

        // Live Rate Summary Placard on Right
        ctx.fillStyle = 'rgba(10, 10, 16, 0.85)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(w * 0.73, h * 0.2, w * 0.24, h * 0.6, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('RATE BENCHMARK', w * 0.75, h * 0.28);

        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.fillText('BASE: ₹15,00,000', w * 0.75, h * 0.38);
        ctx.fillText('ESCORT: INCLUDED', w * 0.75, h * 0.46);
        ctx.fillText('DISPATCH: ACTIVE', w * 0.75, h * 0.54);
        ctx.fillText('VERIFIED SLAB', w * 0.75, h * 0.62);

      } else if (activeOp === 'contract_draft') {
        // LEGAL CONTRACT TYPEWRITER & DIGITAL SEAL
        const docX = w * 0.15;
        const docY = h * 0.18;
        const docW = w * 0.52;
        const docH = h * 0.64;

        // Parchment / Digital Document Panel
        ctx.fillStyle = 'rgba(18, 18, 24, 0.95)';
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(docX, docY, docW, docH, 8);
        ctx.fill();
        ctx.stroke();

        // Header Gold Line
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(docX + 15, docY + 28);
        ctx.lineTo(docX + docW - 15, docY + 28);
        ctx.stroke();

        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 11px Cinzel, serif';
        ctx.fillText('AVA VIP PERFORMANCE AGREEMENT', docX + 18, docY + 20);

        // Animated Legal Clause Lines
        const lineCount = 7;
        for (let i = 0; i < lineCount; i++) {
          const ly = docY + 44 + i * 16;
          const isRevealed = (frame * playbackSpeed) > i * 15;
          const lineW = isRevealed ? (docW - 45) * ((i % 2 === 0) ? 0.9 : 0.75) : 0;

          if (lineW > 0) {
            ctx.fillStyle = (i === 1 || i === 4) ? '#F3D068' : 'rgba(255, 255, 255, 0.45)';
            ctx.fillRect(docX + 18, ly, lineW, 4);
          }
        }

        // Digital Agency Gold Seal on Right
        const sealX = w * 0.82;
        const sealY = h * 0.5;

        ctx.save();
        ctx.translate(sealX, sealY);
        ctx.rotate((frame * 0.015 * playbackSpeed));
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.stroke();

        // Star notches
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#F3D068';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('OFFICIAL', sealX, sealY - 4);
        ctx.fillText('LEGAL SEAL', sealX, sealY + 8);
        ctx.textAlign = 'left';

      } else {
        // SECURITY PERIMETER & VENUE BLUEPRINT
        const cx = w * 0.45;
        const cy = h * 0.48;

        // Tactical Radar Grid Rings
        for (let r = 25; r <= 85; r += 20) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Sweeping Radar Line
        const angle = (frame * 0.04 * playbackSpeed);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 85, cy + Math.sin(angle) * 85);
        ctx.stroke();

        // VIP Stage Marker in Center
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('VIP STAGE', cx - 22, cy - 12);

        // Security Checkpoints
        const checkpoints = [
          [cx - 50, cy - 40],
          [cx + 55, cy - 35],
          [cx - 40, cy + 50],
          [cx + 45, cy + 45]
        ];
        checkpoints.forEach(([px, py], i) => {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#9ca3af';
          ctx.font = '8px monospace';
          ctx.fillText(`GATE ${i + 1}`, px - 12, py + 12);
        });
      }

      // 3. Audio Equalizer Waveform at Screen Bottom
      const waveH = h * 0.92;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, h * 0.86, w, h * 0.14);

      const barCount = 36;
      const barW = (w / barCount) - 3;
      for (let b = 0; b < barCount; b++) {
        const freq = Math.sin((frame * 0.1 * playbackSpeed) + (b * 0.3)) * 0.5 + 0.5;
        const bh = (h * 0.1) * freq;
        const bx = b * (barW + 3) + 2;
        const by = waveH - bh;

        ctx.fillStyle = (b % 4 === 0) ? '#D4AF37' : (b % 2 === 0) ? accentHex : 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(bx, by, barW, bh);
      }

      // Loop animation
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeOp, isPlaying, playbackSpeed, currentSpecialist]);

  // Operational Progress Timeline (Cycles through steps)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + (playbackSpeed === 2 ? 3 : 1.5);
        if (next >= 100) {
          setStepIndex((s) => (s + 1) % 4);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const currentStepText =
    language === 'mr'
      ? currentOpData.stepsMr[stepIndex]
      : language === 'hi'
      ? currentOpData.stepsHi[stepIndex]
      : currentOpData.stepsEn[stepIndex];

  return (
    <div className={`relative flex flex-col w-full h-full bg-[#050508] rounded-2xl overflow-hidden border border-white/10 ${className}`}>
      {/* 4K BROADCAST TOP OSD HEADER */}
      <div className="relative z-10 px-3.5 py-2 bg-gradient-to-r from-black/90 via-[#0A0A12] to-black/90 border-b border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
        {/* Live Broadcast Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/30 border border-red-500/50 text-red-400 font-bold text-[10px]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>4K LIVE VIDEO STREAM</span>
          </span>

          <span className="hidden sm:inline-block text-[10px] text-gray-400">
            {currentSpecialist.channel} • {currentSpecialist.code}
          </span>
        </div>

        {/* Video Mode Selector Buttons */}
        <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10 text-[10px]">
          <button
            onClick={() => {
              setActiveOp('profile_scan');
              onOperationChange?.('profile_scan');
            }}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              activeOp === 'profile_scan' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
            title="Profile Scan Video"
          >
            {language === 'mr' ? '१. स्कॅनिंग' : language === 'hi' ? '१. स्कैनिंग' : '1. Profile'}
          </button>
          <button
            onClick={() => {
              setActiveOp('rate_calc');
              onOperationChange?.('rate_calc');
            }}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              activeOp === 'rate_calc' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
            title="Rate Valuation Video"
          >
            {language === 'mr' ? '२. मानधन' : language === 'hi' ? '२. मानदेय' : '2. Rates'}
          </button>
          <button
            onClick={() => {
              setActiveOp('contract_draft');
              onOperationChange?.('contract_draft');
            }}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              activeOp === 'contract_draft' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
            title="Contract Draft Video"
          >
            {language === 'mr' ? '३. करार' : language === 'hi' ? '३. अनुबंध' : '3. Contract'}
          </button>
          <button
            onClick={() => {
              setActiveOp('security_protocol');
              onOperationChange?.('security_protocol');
            }}
            className={`px-2 py-1 rounded transition-all cursor-pointer ${
              activeOp === 'security_protocol' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
            title="Security Protocol Video"
          >
            {language === 'mr' ? '४. सुरक्षा' : language === 'hi' ? '४. सुरक्षा' : '4. Security'}
          </button>
        </div>
      </div>

      {/* 60FPS CINEMATIC HIGH-TECH CANVAS VIDEO VIEWPORT */}
      <div className="relative flex-1 min-h-[220px] sm:min-h-[260px] flex items-center justify-center overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-contain"
        />

        {/* Live Operational Step Overlay Subtitle Bar */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex flex-col gap-1.5 p-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/15">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="font-bold flex items-center gap-1.5" style={{ color: currentSpecialist.borderHex }}>
              <Zap className="w-3 h-3 animate-pulse" />
              <span>
                {language === 'mr'
                  ? currentOpData.titleMr
                  : language === 'hi'
                  ? currentOpData.titleHi
                  : currentOpData.titleEn}
              </span>
            </span>

            <span className="text-gray-400">
              {language === 'mr'
                ? `टप्पा ${stepIndex + 1}/४`
                : language === 'hi'
                ? `चरण ${stepIndex + 1}/४`
                : `STEP ${stepIndex + 1}/4`}
            </span>
          </div>

          <p className="text-xs text-white font-sans font-medium">{currentStepText}</p>

          {/* Progress Loading Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-150"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: currentSpecialist.borderHex
              }}
            />
          </div>
        </div>
      </div>

      {/* VIDEO BROADCAST PLAYBACK CONTROL DOCK */}
      <div className="relative z-10 px-3.5 py-2 bg-gradient-to-r from-black via-[#0E0E16] to-black border-t border-white/10 flex items-center justify-between text-xs font-mono">
        {/* Play / Pause / Replay Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37]/30 text-white hover:text-[#F3D068] transition cursor-pointer"
            title={isPlaying ? 'Pause Video' : 'Play Video'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              setProgressPercent(0);
              setStepIndex(0);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
            title="Replay Action"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle 1x / 2x */}
          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 hover:text-white border border-white/10 cursor-pointer font-bold"
            title="Toggle Speed"
          >
            {playbackSpeed}X
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="hidden sm:inline text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI DIRECT ENGINE</span>
          </span>

          <span className="text-[#F3D068] font-bold">AVA 55" OLED</span>
        </div>
      </div>
    </div>
  );
};
