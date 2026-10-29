import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Radio,
  Sliders,
  CheckCircle2,
  Layers,
  Zap,
  Disc,
  Headphones,
  Award,
  Crown,
  Share2,
  Check
} from 'lucide-react';
import { generateAnthemTrack, GeneratedAnthemResponse } from '../../services/musicService';

interface PresetOption {
  id: string;
  name: string;
  genre: string;
  vibe: string;
  tempo: string;
  instruments: string;
  description: string;
  recommendedMode: 'clip' | 'full';
  icon: string;
}

const PRESETS: PresetOption[] = [
  {
    id: 'red-carpet',
    name: 'Royal Red Carpet Fanfare',
    genre: 'Cinematic Orchestral',
    vibe: 'Regal, Triumphant & Majestic',
    tempo: 'Maestoso (112 BPM)',
    instruments: 'Grand Horns, Orchestral Violins, Timpani, Tubular Bells',
    description: 'Awe-inspiring fanfare crafted for high-profile celebrity arrivals, flashbulbs, and step-and-repeat media walks.',
    recommendedMode: 'clip',
    icon: '🌟'
  },
  {
    id: 'bollywood-royalty',
    name: 'Bollywood Star Grandeur',
    genre: 'Modern Bollywood Cinematic',
    vibe: 'High-Energy, Opulent & Celebratory',
    tempo: 'Allegro (128 BPM)',
    instruments: 'Dhol-Tasha, Brass Stabs, Sitar Riffs, 808 Trap Sub Bass',
    description: 'Dynamic Indian fusion with pounding percussion and soaring brass stabs tailored for Bollywood icons.',
    recommendedMode: 'clip',
    icon: '🥁'
  },
  {
    id: 'runway-couture',
    name: 'Haute Couture Runway Chic',
    genre: 'Luxury Deep House & Ambient',
    vibe: 'Sophisticated, Hypnotic & Avant-Garde',
    tempo: 'Runway Pulse (124 BPM)',
    instruments: 'Analog Poly-Synths, Warm Bassline, Crisp Shakers, Velvet Pads',
    description: 'Pulsing international runway groove for high-fashion designer showcases and model strut intros.',
    recommendedMode: 'full',
    icon: '💎'
  },
  {
    id: 'maharashtra-epic',
    name: 'Maharashtra Heritage Epic',
    genre: 'Traditional Maharashtrian Fusion',
    vibe: 'Heroic, Resplendent & Historic',
    tempo: 'Presto (136 BPM)',
    instruments: 'Tutari Fanfare, Puneri Dhol, Shehnai, Symphonic Strings',
    description: 'Resonant state cultural anthem featuring traditional Maharashtrian war-horns and thunderous dhol rhythms.',
    recommendedMode: 'full',
    icon: '🔱'
  },
  {
    id: 'awards-gala',
    name: 'Prestigious Awards Countdown',
    genre: 'Dramatic Electronic Orchestral',
    vibe: 'Suspenseful, Climax-Driven & Grand',
    tempo: 'Climax Build (130 BPM)',
    instruments: 'Ticking Clocks, Heavy Taiko Drums, Soaring Choir, Brass Swells',
    description: 'Climactic theme for golden envelope unveilings, lifetime achievement honors, and trophy presentations.',
    recommendedMode: 'full',
    icon: '🏆'
  }
];

interface VipMusicAnthemStudioProps {
  initialArtistName?: string;
  initialEventType?: string;
  isAdmin?: boolean;
}

export const VipMusicAnthemStudio: React.FC<VipMusicAnthemStudioProps> = ({
  initialArtistName = 'Ranveer Kapoor',
  initialEventType = 'AVA Maharashtra Grand Red Carpet Gala',
  isAdmin = false,
}) => {
  // Generation parameters
  const [mode, setMode] = useState<'clip' | 'full'>('clip');
  const [artistName, setArtistName] = useState(initialArtistName);
  const [eventType, setEventType] = useState(initialEventType);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(PRESETS[0]);
  const [genre, setGenre] = useState(PRESETS[0].genre);
  const [vibe, setVibe] = useState(PRESETS[0].vibe);
  const [tempo, setTempo] = useState(PRESETS[0].tempo);
  const [instruments, setInstruments] = useState(PRESETS[0].instruments);
  const [customPrompt, setCustomPrompt] = useState('');

  // Status & output
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnthem, setGeneratedAnthem] = useState<GeneratedAnthemResponse | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Audio Playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // Apply preset
  const handleSelectPreset = (p: PresetOption) => {
    setSelectedPreset(p);
    setGenre(p.genre);
    setVibe(p.vibe);
    setTempo(p.tempo);
    setInstruments(p.instruments);
    setMode(p.recommendedMode);
  };

  // Generate anthem handler
  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusNotice(null);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const response = await generateAnthemTrack({
        mode,
        prompt: customPrompt,
        eventType,
        artistName,
        genre,
        tempo,
        instruments,
        vibe,
      });

      setGeneratedAnthem(response);

      // Create playable audio URL from base64
      const binary = atob(response.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: response.mimeType || 'audio/wav' });
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      const newUrl = URL.createObjectURL(blob);
      setAudioUrl(newUrl);

      // Auto play newly generated anthem
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 300);
    } catch (err: any) {
      console.warn('Anthem generation notice:', err?.message || err);
      setStatusNotice(err?.message || 'Composition request completed with studio harmonic synthesis.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download anthem file
  const handleDownload = () => {
    if (!audioUrl || !generatedAnthem) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    const cleanFileName = `${generatedAnthem.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.wav`;
    a.download = cleanFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    if (!generatedAnthem) return;
    navigator.clipboard.writeText(
      `AVA VIP Anthem: ${generatedAnthem.title} (${generatedAnthem.modelUsed}) | ${generatedAnthem.lyricsOrNotes || ''}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || generatedAnthem?.duration || 30);
    const onEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl, isLooping, generatedAnthem]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Visualizer Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const numBars = 48;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / numBars - 2;

      // Draw frequency bars
      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);
        // Harmonic waveform simulation with energy driven by playback state
        const centerDistance = Math.abs(i - numBars / 2) / (numBars / 2);
        const envelope = Math.cos((centerDistance * Math.PI) / 2);

        let barHeight = 4;
        if (isPlaying) {
          const wave1 = Math.sin(i * 0.35 + phase * 4);
          const wave2 = Math.cos(i * 0.15 - phase * 2.5);
          const dynamicAmp = 0.5 + 0.5 * Math.sin(phase * 1.5 + i * 0.2);
          barHeight = Math.max(6, (wave1 * 0.5 + wave2 * 0.5 + 1.2) * (height * 0.38) * envelope * dynamicAmp);
        } else if (audioUrl) {
          // Static resting wave
          barHeight = Math.max(4, 18 * envelope * (1 + 0.2 * Math.sin(i * 0.4)));
        }

        const y = (height - barHeight) / 2;

        // Gradient for bars (Gold to Crimson/Amber)
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#F3D068');
        grad.addColorStop(0.5, '#D4AF37');
        grad.addColorStop(1, '#8C1D40');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      if (isPlaying) {
        phase += 0.05;
      }

      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, audioUrl]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <div className="card-luxury rounded-2xl p-6 sm:p-8 border-gold-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D4AF37]/15 via-rose-900/10 to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#200A12] to-[#12050B] border border-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 flex-shrink-0">
              <Disc className={`w-8 h-8 text-[#D4AF37] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  Google Lyria AI Music Suite
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-600/40">
                  {isAdmin ? 'Admin Master Deck' : 'VIP Client Studio'}
                </span>
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                VIP Event & Artist Anthem Studio
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Generate tailored 30-second grand entry clips and full-length symphonic anthems for red carpets, runway intros, and galas.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 flex-shrink-0 self-stretch sm:self-auto">
            <button
              onClick={() => setMode('clip')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-cinzel font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'clip'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>30s Entry Clip (Lyria Clip)</span>
            </button>
            <button
              onClick={() => setMode('full')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-cinzel font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'full'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Full Event Theme (Lyria Pro)</span>
            </button>
          </div>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <span>{statusNotice}</span>
          <button
            onClick={() => setStatusNotice(null)}
            className="text-amber-400 hover:text-white font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Studio Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Palette & Custom Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Selector */}
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#D4AF37]" />
                Curated Signature Soundscapes
              </h3>
              <span className="text-[11px] text-gray-400">Select signature preset</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESETS.map((p) => {
                const isSelected = selectedPreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`text-left p-3.5 rounded-xl border transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#200A12]/90 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-lg'
                        : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">{p.icon}</span>
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            p.recommendedMode === 'clip'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {p.recommendedMode === 'clip' ? '30s Clip' : 'Full Track'}
                        </span>
                      </div>
                      <h4 className="font-cinzel text-xs font-bold text-white mb-1">{p.name}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                      <span>{p.genre}</span>
                      <span className="text-[#F3D068] font-mono">{p.tempo.split(' ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Composition Customizer */}
          <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              Track Specifications & Context
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                  VIP Headliner / Artist Name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="e.g. Ranveer Kapoor, Rhea Sengupta"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                  Event / Occasion Name
                </label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="e.g. Maharashtra Grand Red Carpet Gala 2026"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                  Musical Genre / Style
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                  Tempo & Beat Pace
                </label>
                <select
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="Largo / Chillout (90 BPM)">Largo / Ambient Chillout (90 BPM)</option>
                  <option value="Maestoso (112 BPM)">Maestoso / Grand Majestic (112 BPM)</option>
                  <option value="Runway Pulse (124 BPM)">Runway Pulse / Fashion Strut (124 BPM)</option>
                  <option value="Allegro (128 BPM)">Allegro / High-Energy Red Carpet (128 BPM)</option>
                  <option value="Presto (136 BPM)">Presto / Maharashtrian Dhol Festival (136 BPM)</option>
                  <option value="Vivace (144 BPM)">Vivace / High-Octane Climax (144 BPM)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                  Primary Instrumentation & Fanfare Elements
                </label>
                <input
                  type="text"
                  value={instruments}
                  onChange={(e) => setInstruments(e.target.value)}
                  placeholder="e.g. Orchestral Horns, Puneri Dhol, Timpani, Sitar, Analog Synths"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                  Custom Creative Prompt (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe unique cues (e.g. dramatic sub-drop at second 10, soaring brass crescendo as artist steps out of limousine, thunderous applause riser)"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs focus:border-[#D4AF37] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3.5 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer ${
                isGenerating
                  ? 'bg-[#AA7C11]/50 text-black cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#D4AF37] via-[#F3D068] to-[#AA7C11] text-black shadow-lg shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Audio via Google Lyria ({mode === 'full' ? 'Lyria Pro' : 'Lyria Clip'})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>
                    Compose {mode === 'full' ? 'Full Event Anthem' : '30s Grand Entry Clip'} ({mode === 'full' ? 'Lyria Pro' : 'Lyria Clip'})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Audio Workstation Player & Waveform Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Workstation Console */}
          <div className="card-luxury rounded-2xl p-6 border-gold-glow flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-xs font-cinzel font-bold text-white tracking-wide">
                    {isPlaying ? 'Now Broadcasting' : audioUrl ? 'Track Ready' : 'Studio Standby'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {generatedAnthem?.modelUsed || (mode === 'full' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview')}
                </span>
              </div>

              {/* Dynamic Canvas Visualizer */}
              <div className="relative rounded-xl overflow-hidden bg-black/80 border border-white/10 p-4 mb-4">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={120}
                  className="w-full h-28 object-contain"
                />

                {!audioUrl && !isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs">
                    <Music className="w-8 h-8 text-[#D4AF37]/50 mb-1" />
                    <span className="text-xs text-gray-400 font-cinzel">Select soundscape & hit Compose</span>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs">
                    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs text-[#F3D068] font-cinzel animate-pulse">
                      Synthesizing Harmonics...
                    </span>
                  </div>
                )}
              </div>

              {/* Track Title & Metadata */}
              <div className="mb-4">
                <h4 className="font-cinzel text-base font-bold text-white mb-0.5 truncate">
                  {generatedAnthem?.title || `${artistName} - ${eventType}`}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>{genre}</span>
                  <span>•</span>
                  <span>{tempo}</span>
                  <span>•</span>
                  <span className="text-[#D4AF37]">{mode === 'full' ? 'Full Theme' : '30s VIP Entry'}</span>
                </div>
              </div>

              {/* Progress Scrubber */}
              <div className="space-y-1 mb-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 30}
                  step={0.1}
                  value={currentTime}
                  disabled={!audioUrl}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCurrentTime(val);
                    if (audioRef.current) audioRef.current.currentTime = val;
                  }}
                  className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || (mode === 'full' ? 45 : 30))}</span>
                </div>
              </div>

              {/* Playback Controls Bar */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-black/40 border border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        setCurrentTime(0);
                      }
                    }}
                    disabled={!audioUrl}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                    title="Restart Track"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    disabled={!audioUrl}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black flex items-center justify-center shadow-md hover:scale-105 transition disabled:opacity-40 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    disabled={!audioUrl}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      isLooping ? 'text-[#F3D068] bg-[#D4AF37]/20 border border-[#D4AF37]/40' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Toggle Loop"
                  >
                    <Radio className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Musical Director Review / Composition Notes */}
              {generatedAnthem?.lyricsOrNotes && (
                <div className="p-3.5 rounded-xl bg-[#200A12]/80 border border-[#D4AF37]/30 text-xs text-gray-300 leading-relaxed space-y-1 mb-4">
                  <div className="flex items-center gap-1.5 text-[#F3D068] font-cinzel font-bold text-[11px] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>AVA Musical Director Review</span>
                  </div>
                  <p className="text-[11px] text-gray-300 italic">"{generatedAnthem.lyricsOrNotes}"</p>
                </div>
              )}
            </div>

            {/* Action Buttons (Download & Share) */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={!audioUrl}
                className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-cinzel font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 disabled:opacity-30 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Download Audio (.WAV)</span>
              </button>

              <button
                onClick={handleCopyLink}
                disabled={!generatedAnthem}
                className="px-4 py-2.5 rounded-lg bg-black/60 hover:bg-black text-gray-300 border border-white/15 text-xs font-cinzel font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 disabled:opacity-30 cursor-pointer"
                title="Copy Anthem Details"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-gray-400" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            {/* Hidden native audio element */}
            {audioUrl && <audio ref={audioRef} src={audioUrl} loop={isLooping} preload="auto" />}
          </div>
        </div>
      </div>
    </div>
  );
};
