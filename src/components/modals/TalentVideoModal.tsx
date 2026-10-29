import React, { useState, useRef, useEffect } from 'react';
import { TalentProfile } from '../../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Film,
  Sparkles,
  CalendarCheck,
  RotateCcw,
  Crown,
  Smartphone,
  Monitor
} from 'lucide-react';

interface TalentVideoModalProps {
  isOpen: boolean;
  profile: TalentProfile | null;
  onClose: () => void;
  onBookTalent?: (talent: TalentProfile) => void;
}

export const TalentVideoModal: React.FC<TalentVideoModalProps> = ({
  isOpen,
  profile,
  onClose,
  onBookTalent
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [isOpen, profile]);

  if (!isOpen || !profile || !profile.videoUrl) return null;

  const isVertical = profile.videoAspectRatio === '9:16';

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);
    if (dur > 0) {
      setProgress((cur / dur) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || !duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const requestFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`relative z-10 w-full flex flex-col items-center justify-center max-h-[96vh] ${
          isVertical ? 'max-w-md' : 'max-w-4xl'
        }`}
      >
        {/* Floating Top Bar */}
        <div className="w-full flex items-center justify-between py-2 px-3 text-white mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-cinzel tracking-wider uppercase flex items-center gap-1 shadow-md ${
                isVertical
                  ? 'bg-gradient-to-r from-purple-900/80 to-pink-900/80 text-pink-300 border border-pink-500/40'
                  : 'bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/50'
              }`}
            >
              {isVertical ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
              <span>{isVertical ? '9:16 Vertical Reel' : '16:9 Cinematic Widescreen'}</span>
            </span>

            {profile.talentType && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-gray-300 border border-white/15 font-cinzel">
                {profile.talentType}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div
          className={`relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-black w-full group flex items-center justify-center ${
            isVertical ? 'aspect-[9/16] max-h-[76vh]' : 'aspect-video max-h-[70vh]'
          }`}
        >
          <video
            ref={videoRef}
            src={profile.videoUrl}
            autoPlay
            playsInline
            loop={isLooping}
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Central Play/Pause Watermark when paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center shadow-2xl transform scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Top Title Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none flex items-start justify-between">
            <div>
              <div className="text-[11px] text-[#D4AF37] font-cinzel font-bold flex items-center gap-1.5 uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>{profile.name}</span>
                {profile.videoTag && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-300 lowercase font-mono">#{profile.videoTag}</span>
                  </>
                )}
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base drop-shadow mt-0.5">
                {profile.videoTitle || `${profile.name} Performance Reel`}
              </h3>
            </div>
          </div>

          {/* Bottom Player Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-2 opacity-95 group-hover:opacity-100 transition-opacity">
            {/* Scrubber Bar */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-[#D4AF37] h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-gray-300 font-mono shrink-0">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </span>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono flex items-center gap-1 cursor-pointer transition ${
                    isLooping ? 'bg-[#D4AF37]/25 text-[#F3D068] border border-[#D4AF37]/50' : 'bg-white/5 text-gray-400'
                  }`}
                  title="Toggle Repeat"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Loop</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={requestFullscreen}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Booking Action Card */}
        {onBookTalent && (
          <div className="w-full mt-3 p-3 rounded-xl bg-[#14141E] border border-white/10 flex items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2.5 truncate">
              {profile.photoUrl && (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40 shrink-0"
                />
              )}
              <div className="truncate">
                <div className="text-xs font-cinzel font-bold text-white truncate">{profile.name}</div>
                <div className="text-[10px] text-gray-400 truncate">{profile.subcategory || profile.categoryName}</div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookTalent(profile);
              }}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Artist Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
