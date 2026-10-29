import React, { useState } from 'react';
import { Tv, Bot, Radio } from 'lucide-react';
import { SmartRobot3DCanvas } from './SmartRobot3DCanvas';

interface FloatingRobotButtonProps {
  onClick: () => void;
}

export const FloatingRobotButton: React.FC<FloatingRobotButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 select-none">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center p-1.5 pr-4 rounded-full bg-[#0A0A0E]/95 hover:bg-[#12121A] border-2 border-[#D4AF37]/60 hover:border-[#F3D068] shadow-[0_10px_40px_rgba(212,175,55,0.4)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="Open 55-inch Digital 4K LED Screen AI Robot Fleet (५५ इंची डिजिटल AI रोबोट स्क्रीन)"
      >
        {/* Animated Outer Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D4AF37]/40 via-amber-400/20 to-[#00F2FE]/30 animate-pulse pointer-events-none" />

        {/* 3D Gold Robot Canvas Preview */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative flex items-center justify-center shrink-0">
          <SmartRobot3DCanvas
            specialistId="prime"
            size="sm"
            mood={isHovered ? 'listening' : 'idle'}
            enableTracking={true}
            interactive={false}
          />
        </div>

        {/* Text Label & 55" LED TV Badge */}
        <div className="text-left ml-1.5 sm:ml-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-cinzel font-bold text-white group-hover:text-[#F3D068] transition">
              AVA AI Robot
            </span>
            <span className="text-[9px] bg-gradient-to-r from-[#D4AF37] to-amber-400 text-black font-black px-1.5 py-0.2 rounded font-mono shadow-sm">
              55" 4K
            </span>
          </div>
          <span className="text-[10px] text-gray-300 flex items-center gap-1 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>११ रोबोट्स सज्ज • Click to Open</span>
          </span>
        </div>
      </button>
    </div>
  );
};
