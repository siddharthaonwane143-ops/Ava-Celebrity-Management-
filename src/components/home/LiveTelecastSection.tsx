import React, { useState, useEffect, useRef } from 'react';
import { LiveTelecast } from '../../types';
import {
  Tv,
  Radio,
  Eye,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Flame,
  Heart,
  Share2,
  Calendar,
  UserCheck,
  Crown,
  Send,
  Play,
  Pause,
  Camera,
  Sliders,
  Shield,
  Video,
  CheckCircle2,
  Compass,
  Download,
  Layers,
  PictureInPicture2
} from 'lucide-react';

interface LiveTelecastSectionProps {
  telecast: LiveTelecast;
  onBookTalent?: () => void;
  onViewShowDetails?: () => void;
}

interface LiveComment {
  id: string;
  author: string;
  role: string;
  text: string;
  time: string;
  isVip?: boolean;
}

// Multi-angle direct feeds for authentic high-production live event coverage (without YouTube)
const MULTI_CAMERA_FEEDS = [
  {
    id: 'stage',
    name: 'Main Stage 4K',
    icon: Tv,
    description: 'Center-stage high dynamic range feed (Direct Satellite Master)',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'redcarpet',
    name: 'Red Carpet VIP',
    icon: Camera,
    description: 'Celebrity arrivals, step-and-repeat & VIP interviews',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'runway',
    name: 'Runway Close-Up',
    icon: Video,
    description: 'Designer couture detail & model pacing',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyblazes.mp4'
  },
  {
    id: 'backstage',
    name: 'Backstage Lounge',
    icon: Sparkles,
    description: 'Hair, makeup & pre-show greenroom preparations',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
  },
  {
    id: 'drone',
    name: 'Arena Drone 4K',
    icon: Compass,
    description: 'Sweeping stadium aerial perspective & crowd atmosphere',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  }
];

export const LiveTelecastSection: React.FC<LiveTelecastSectionProps> = ({
  telecast,
  onBookTalent,
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    love: 1420,
    fire: 4180,
    applause: 2650
  });
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; icon: string; left: number }[]>([]);
  const [copied, setCopied] = useState(false);
  const [viewerCount, setViewerCount] = useState(telecast.viewerCount || 18450);

  // Video playback & audio controls
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCameraId, setActiveCameraId] = useState<string>('stage');
  const [streamQuality, setStreamQuality] = useState<string>(telecast.streamQuality || '4K UHD (60fps)');
  const [snapshotNotice, setSnapshotNotice] = useState<string | null>(null);

  // Chat State
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [comments, setComments] = useState<LiveComment[]>([
    {
      id: 'c1',
      author: 'Siddharth (Agency Director)',
      role: 'Executive Host',
      text: 'Welcome global viewers & Maharashtra partners to the AVA 2026 Grand Finale direct satellite feed!',
      time: 'Just now',
      isVip: true
    },
    {
      id: 'c2',
      author: 'Aarti K. (Pune)',
      role: 'Fashion Producer',
      text: 'The 4K direct coverage and couture runway lighting is breathtaking! No stream delays.',
      time: '1 min ago'
    },
    {
      id: 'c3',
      author: 'Milan Couture Rep',
      role: 'International Scout',
      text: 'Stunning opening sequence on the BKC main arena stage. Video clarity is incredible.',
      time: '2 mins ago',
      isVip: true
    },
    {
      id: 'c4',
      author: 'Vikram Joshi (Nagpur)',
      role: 'Event Director',
      text: 'Watching live multi-camera coverage in 4K! Direct booking inquiry prepared.',
      time: '3 mins ago'
    }
  ]);

  // Organic live viewer fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 11) - 4;
        return Math.max(12000, prev + delta);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Determine active video source URL (Direct master feed, zero YouTube dependency)
  const currentCamera = MULTI_CAMERA_FEEDS.find((c) => c.id === activeCameraId);
  const activeVideoUrl =
    activeCameraId === 'stage'
      ? telecast.videoUrl || MULTI_CAMERA_FEEDS[0].videoUrl
      : currentCamera?.videoUrl || telecast.videoUrl || MULTI_CAMERA_FEEDS[0].videoUrl;

  const isDirectVideo = true; // Always direct HTML5 video stream, zero YouTube links

  // Handle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Capture high-res frame snapshot from direct video stream
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Agency watermark
        ctx.font = 'bold 22px "Cinzel", serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.fillText('AVA CELEBRITY MANAGEMENT • 4K DIRECT EVENT COVERAGE', 36, canvas.height - 36);
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `AVA-Live-Coverage-4K-Snapshot-${Date.now()}.png`;
        a.click();
        setSnapshotNotice('📸 4K Live Coverage Snapshot saved!');
        setTimeout(() => setSnapshotNotice(null), 3500);
      }
    } catch (e) {
      console.warn('Snapshot error:', e);
    }
  };

  // Toggle Picture-in-Picture floating mode
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current.requestPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP error:', err);
    }
  };

  // Fullscreen trigger
  const toggleFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  const handleReaction = (type: string, iconSymbol: string) => {
    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));
    setUserReacted(type);

    const newHeart = {
      id: Date.now() + Math.random(),
      icon: iconSymbol,
      left: Math.floor(Math.random() * 60) + 20
    };
    setFloatingHearts((prev) => [...prev.slice(-12), newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1800);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: telecast.showTitle,
        text: `Watch the official live video coverage: ${telecast.showTitle}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC: LiveComment = {
      id: `comm-${Date.now()}`,
      author: commentAuthor.trim() || 'VIP Viewer (Live Mobile)',
      role: 'Audience Member',
      text: newCommentText.trim(),
      time: 'Just now'
    };

    setComments((prev) => [newC, ...prev]);
    setNewCommentText('');
  };

  return (
    <section id="live-telecast" className="py-14 sm:py-20 bg-gradient-to-b from-[#08080C] via-[#0E0C16] to-[#08080C] border-t border-b border-[#D4AF37]/25 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D4AF37]/5 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Floating Animated Reaction Particles */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            style={{ left: `${heart.left}%` }}
            className="absolute bottom-20 text-2xl animate-float-up pointer-events-none drop-shadow-md select-none transition"
          >
            {heart.icon}
          </div>
        ))}
      </div>

      <div className={`${isTheater ? 'max-w-[98%]' : 'max-w-7xl'} mx-auto px-3 sm:px-6 lg:px-8 transition-all duration-500 relative z-10`}>
        {/* Mobile Viewport Live Banner */}
        <div className="sm:hidden mb-4 p-2.5 rounded-xl bg-gradient-to-r from-red-950/80 via-black to-[#1A1408] border border-red-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] font-bold font-cinzel text-red-400 tracking-wider">
              DIRECT 4K SATELLITE FEED ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-mono bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
            <Eye className="w-3 h-3 text-red-400" />
            <span>{viewerCount.toLocaleString()} watching</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-red-600/20 border border-red-500/40 text-red-400 shadow-sm shadow-red-900/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{telecast.status || 'LIVE NOW'}</span>
              </span>

              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                {telecast.category || 'VIP Live Event Coverage'}
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-gray-300 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/10">
                <Eye className="w-3.5 h-3.5 text-red-400" />
                <span className="text-white font-bold font-mono">
                  {viewerCount.toLocaleString()}
                </span>
                <span>watching</span>
              </span>

              {/* Direct Satellite Quality Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono shadow-sm">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold">{streamQuality}</span>
                <span className="text-emerald-500/70 hidden sm:inline">• Direct Feed</span>
              </div>
            </div>

            {/* Main Show Title */}
            <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl text-white font-extrabold tracking-tight leading-tight">
              {telecast.showTitle}
            </h2>

            {telecast.editionSubtitle && (
              <p className="text-[#D4AF37] text-xs sm:text-base font-cinzel font-medium mt-1 flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0" />
                <span>{telecast.editionSubtitle}</span>
              </p>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsTheater(!isTheater)}
              className="p-2 sm:p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs flex items-center gap-1.5 transition cursor-pointer"
              title={isTheater ? 'Exit Cinema View' : 'Cinema Mode'}
            >
              {isTheater ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="text-[11px] sm:text-xs">{isTheater ? 'Exit' : 'Cinema'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 sm:p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[11px] sm:text-xs">{copied ? 'Copied Link!' : 'Share Feed'}</span>
            </button>

            {onBookTalent && (
              <button
                onClick={onBookTalent}
                className="btn-gold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold font-cinzel tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#D4AF37]/15 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book Live Event Coverage</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Broadcast Announcement Ticker */}
        {telecast.announcement && (
          <div className="mb-5 sm:mb-6 p-3 rounded-xl bg-gradient-to-r from-red-950/50 via-amber-950/30 to-black/80 border border-red-500/30 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs text-amber-200 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-ping" />
              <span className="font-semibold text-white tracking-wide shrink-0">DIRECT BROADCAST:</span>
              <span className="text-gray-300 truncate">{telecast.announcement}</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#D4AF37] shrink-0 font-medium">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Studio Master Dolby Sound</span>
            </div>
          </div>
        )}

        {/* Video Player & Live Stage Arena Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Main Player Container (3 cols) */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-[#D4AF37]/35 bg-black shadow-2xl relative group">
            {/* Multi-Camera Angle Selector Bar (Direct Broadcast Switching) */}
            <div className="bg-[#0C0C14] px-3 sm:px-4 py-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[11px] uppercase font-cinzel font-bold text-[#F3D068]">
                  Camera Feeds:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {MULTI_CAMERA_FEEDS.map((feed) => {
                  const FeedIcon = feed.icon;
                  const isActive = activeCameraId === feed.id;
                  return (
                    <button
                      key={feed.id}
                      onClick={() => setActiveCameraId(feed.id)}
                      className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isActive
                          ? 'bg-[#D4AF37] text-black shadow-sm font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                      title={feed.description}
                    >
                      <FeedIcon className="w-3 h-3" />
                      <span>{feed.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 16:9 Responsive Video Viewport */}
            <div className="relative aspect-video w-full bg-[#07070B] flex items-center justify-center overflow-hidden">
              {isDirectVideo ? (
                <>
                  <video
                    ref={videoRef}
                    src={activeVideoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Top-left Watermark Logo & Live Badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-[#D4AF37]/40 shadow-lg">
                      <Crown className="w-3 h-3 text-[#D4AF37]" />
                      <span className="font-cinzel text-[10px] sm:text-xs font-bold text-white tracking-widest">
                        AVA 4K DIRECT FEED
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-bold tracking-wider uppercase animate-pulse flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE
                    </span>
                  </div>

                  {/* Top-right Camera Name & Audio VU Visualizer */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] text-gray-300 font-mono">
                      <Camera className="w-3 h-3 text-[#D4AF37]" />
                      <span>{currentCamera?.name || 'Main Stage'}</span>
                    </div>

                    {/* Audio status badge */}
                    {isMuted && (
                      <button
                        onClick={toggleMute}
                        className="px-3 py-1 rounded-full bg-[#D4AF37] hover:bg-[#F3D068] text-black text-[10px] font-bold flex items-center gap-1.5 shadow-lg animate-pulse cursor-pointer"
                        title="Click to activate live master sound"
                      >
                        <VolumeX className="w-3 h-3" />
                        <span>Tap to Unmute Audio</span>
                      </button>
                    )}
                  </div>

                  {/* Center Play/Pause Overlay Button when hovered */}
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-95 hover:scale-105 cursor-pointer shadow-2xl backdrop-blur-sm"
                    aria-label={isPlaying ? 'Pause broadcast' : 'Play broadcast'}
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-[#D4AF37] ml-0.5" />}
                  </button>

                  {/* Snapshot Saved Toast Notice */}
                  {snapshotNotice && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-black/90 border border-[#D4AF37] text-[#F3D068] text-xs font-cinzel font-bold shadow-2xl flex items-center gap-2 animate-bounce">
                      <Camera className="w-4 h-4 text-[#D4AF37]" />
                      <span>{snapshotNotice}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-6 sm:p-8">
                  <Tv className="w-14 h-14 text-[#D4AF37]/50 mx-auto mb-3" />
                  <p className="font-cinzel text-white text-base sm:text-lg font-bold">
                    Official Video Coverage Feed Online
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Connecting to live direct satellite feed...
                  </p>
                </div>
              )}
            </div>

            {/* Video Controls & Live Reaction Bar */}
            <div className="p-3 sm:p-4 bg-[#101018] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              {/* Playback & Audio Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-[#D4AF37]" /> : <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition flex items-center gap-1.5 text-xs cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="hidden sm:inline text-[11px] text-gray-300">
                    {isMuted ? 'Muted' : 'Sound On'}
                  </span>
                </button>

                {/* Live Snapshot Capture Tool */}
                <button
                  onClick={handleCaptureSnapshot}
                  className="p-1.5 px-2.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F3D068] border border-[#D4AF37]/40 transition flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  title="Capture 4K Frame Snapshot"
                >
                  <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden md:inline">Capture 4K Snapshot</span>
                </button>

                {/* PiP Floating Window */}
                <button
                  onClick={togglePiP}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                  title="Picture-in-Picture Floating Window"
                >
                  <PictureInPicture2 className="w-4 h-4" />
                </button>

                {/* Simulated Audio Spectrum Wave */}
                <div className="hidden lg:flex items-center gap-0.5 px-2 py-1 rounded bg-black/60 border border-white/5">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
                  <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse delay-100" />
                  <span className="w-1 h-3 bg-[#D4AF37] rounded-full animate-pulse delay-200" />
                </div>
              </div>

              {/* Reaction Cheers */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-gray-400 font-medium hidden md:inline">
                  Cheer:
                </span>

                <button
                  onClick={() => handleReaction('love', '❤️')}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                    userReacted === 'love'
                      ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>{reactions.love}</span>
                </button>

                <button
                  onClick={() => handleReaction('fire', '🔥')}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                    userReacted === 'fire'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{reactions.fire}</span>
                </button>

                <button
                  onClick={() => handleReaction('applause', '✨')}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                    userReacted === 'applause'
                      ? 'bg-[#D4AF37]/25 text-yellow-300 border border-[#D4AF37]/50'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{reactions.applause}</span>
                </button>
              </div>

              {/* Quality & Fullscreen */}
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-gray-400 font-mono hidden sm:flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Zero YouTube Latency • Direct Sat Feed</span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Broadcast Studio Info & Live Chat (1 col) */}
          <div className="space-y-4">
            {/* Show Details Card */}
            <div className="card-luxury rounded-2xl p-4 sm:p-5 border-gold-subtle space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-cinzel text-xs font-bold text-white tracking-wider flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#D4AF37]" />
                  <span>LIVE EVENT DETAILS</span>
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  4K Direct
                </span>
              </div>

              {telecast.description && (
                <p className="text-gray-300 text-xs leading-relaxed">
                  {telecast.description}
                </p>
              )}

              <div className="space-y-2 text-xs">
                {telecast.presenter && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] uppercase text-gray-400">Show Presenter</div>
                      <div className="text-white font-medium text-[11px]">{telecast.presenter}</div>
                    </div>
                  </div>
                )}

                {telecast.featuredTalent && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2">
                    <Crown className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] uppercase text-gray-400">Featured Artists</div>
                      <div className="text-white font-medium text-[11px]">{telecast.featuredTalent}</div>
                    </div>
                  </div>
                )}

                {telecast.scheduledTime && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[9px] uppercase text-gray-400">Broadcast Schedule</div>
                      <div className="text-[#F3D068] font-medium text-[11px]">{telecast.scheduledTime}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={onBookTalent}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold font-cinzel transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book VIP Event Coverage Crew</span>
                </button>
              </div>
            </div>

            {/* Interactive Live Chat & VIP Commentary */}
            <div className="card-luxury rounded-2xl p-4 border-gold-subtle bg-[#0c0c12]">
              <div className="flex items-center justify-between text-xs font-cinzel font-bold text-gray-300 mb-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Audience Feed</span>
                </span>
                <span className="text-[9px] text-gray-400 uppercase font-mono">Realtime</span>
              </div>

              {/* Comments Scrollable Stream */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs scrollbar-thin">
                {comments.map((c) => (
                  <div key={c.id} className="p-2 rounded-lg bg-black/50 border border-white/5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[11px] font-semibold ${c.isVip ? 'text-[#D4AF37]' : 'text-gray-300'}`}>
                        {c.author}
                      </span>
                      <span className="text-[9px] text-gray-500">{c.time}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-snug">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="mt-3 pt-2.5 border-t border-white/10 flex gap-1.5">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Post cheer / commentary..."
                  className="flex-1 bg-[#14141E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs disabled:opacity-40 hover:bg-[#F3D068] transition cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
