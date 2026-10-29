import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface OpeningLogoAnimationProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OpeningLogoAnimation: React.FC<OpeningLogoAnimationProps> = ({
  onComplete,
  onSkip,
}) => {
  const [animStage, setAnimStage] = useState<'flare' | 'letters' | 'full'>('flare');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Synthesize signature JioHotstar/ZEE5 style metallic impact sweep sound
  const playOttSweepSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const now = ctx.currentTime;

      // 1. Deep Sub-Bass OTT Thump (120Hz -> 38Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(130, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.7);

      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.38, now + 0.06);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.4);

      // 2. Metallic Flare Whoosh (900Hz -> 2600Hz high sweep)
      const whooshOsc = ctx.createOscillator();
      const whooshGain = ctx.createGain();
      whooshOsc.type = 'sine';
      whooshOsc.frequency.setValueAtTime(440, now + 0.1);
      whooshOsc.frequency.exponentialRampToValueAtTime(3200, now + 0.8);

      whooshGain.gain.setValueAtTime(0.001, now + 0.1);
      whooshGain.gain.linearRampToValueAtTime(0.14, now + 0.35);
      whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      whooshOsc.connect(whooshGain);
      whooshGain.connect(ctx.destination);
      whooshOsc.start(now + 0.1);
      whooshOsc.stop(now + 1.2);

      // 3. Golden Harmonic Chord Shimmer (528Hz Solfeggio + 880Hz octave)
      [528, 660, 792, 1056].forEach((f, i) => {
        const hOsc = ctx.createOscillator();
        const hGain = ctx.createGain();
        hOsc.type = 'sine';
        hOsc.frequency.setValueAtTime(f, now + 0.2);
        hOsc.frequency.exponentialRampToValueAtTime(f * 1.02, now + 1.2);

        hGain.gain.setValueAtTime(0.001, now + 0.2);
        hGain.gain.linearRampToValueAtTime(0.08 - i * 0.015, now + 0.4);
        hGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        hOsc.connect(hGain);
        hGain.connect(ctx.destination);
        hOsc.start(now + 0.2);
        hOsc.stop(now + 1.8);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Pure OTT Timing Sequence: 2.5 seconds total duration
  useEffect(() => {
    // Stage 1: Flare Sweep -> Letters reveal
    const t1 = setTimeout(() => {
      setAnimStage('letters');
    }, 280);

    // Stage 2: Full Title & Tagline Reveal
    const t2 = setTimeout(() => {
      setAnimStage('full');
    }, 800);

    // Stage 3: Smooth Auto-Dissolve into Main Site
    const tAuto = setTimeout(() => {
      handleComplete();
    }, 2500);

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tAuto);
    };
  }, []);

  const handleComplete = () => {
    playOttSweepSound();
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  const handleSkip = () => {
    playOttSweepSound();
    setIsFadingOut(true);
    setTimeout(() => {
      onSkip();
    }, 200);
  };

  // Keyboard shortcut: Space / Enter / Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleComplete();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onClick={handleComplete}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center p-6 bg-[#020204] text-white select-none transition-all duration-500 overflow-hidden cursor-pointer ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background JioHotstar / ZEE5 Style Lens Flare & Glow (Pure atmosphere, zero harsh lines) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Ruby & Gold Nebula Atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-[#800A15]/25 via-[#D4AF37]/20 to-transparent rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/95 pointer-events-none" />
      </div>

      {/* Pure Central High-Impact 3D Metallic Typography Showcase (No top function text, no bottom lines) */}
      <div className="relative z-20 text-center max-w-4xl px-4 flex flex-col items-center justify-center my-auto">
        {/* Bold 3D Metallic "A • V • A" Letters (Hotstar / ZEE5 Signature Metallic Style) */}
        <div className="relative overflow-hidden py-2">
          <div
            className={`flex items-center justify-center gap-4 sm:gap-8 font-cinzel font-black text-7xl sm:text-9xl md:text-[11rem] tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#F3D068] via-[#D4AF37] to-[#6E4708] drop-shadow-[0_16px_45px_rgba(212,175,55,0.7)] transition-all duration-700 transform ${
              animStage !== 'flare'
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-90'
            }`}
          >
            <span>A</span>
            <span className="text-[#FFE58F] drop-shadow-[0_0_35px_rgba(255,229,143,0.95)]">V</span>
            <span>A</span>
          </div>

          {/* OTT Specular Chrome Wipe Beam */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-25 transition-transform duration-1000 pointer-events-none ${
              animStage === 'full' ? 'translate-x-[250%]' : '-translate-x-[250%]'
            }`}
          />
        </div>

        {/* Subtitle: CELEBRITY MANAGEMENT */}
        <div
          className={`space-y-2 mt-1 sm:mt-2 transition-all duration-600 transform ${
            animStage === 'full'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="font-cinzel text-lg sm:text-2xl md:text-3xl font-black tracking-[0.3em] uppercase bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#D4AF37] to-[#AA771C] bg-clip-text text-transparent drop-shadow-[0_4px_15px_rgba(212,175,55,0.4)]">
            AVA CELEBRITY MANAGEMENT
          </h1>

          <p className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-gray-300">
            BUILDING STARS. CREATING LEGACIES.
          </p>
        </div>
      </div>
    </div>
  );
};
