import {
  Home,
  Users,
  Film,
  Trophy,
  Mail,
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { AIToolTab } from '../ai/AIToolsSuiteModal';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenBooking: () => void;
  onOpenVoiceConcierge: () => void;
  onOpenAITools?: (tab?: AIToolTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigate,
  onOpenBooking,
  onOpenVoiceConcierge,
  onOpenAITools
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0f]/90 backdrop-blur-2xl border-t border-[#D4AF37]/30 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl touch-press transition ${
            activeSection === 'home'
              ? 'text-[#F3D068]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-cinzel font-bold tracking-tight">Home</span>
          {activeSection === 'home' && (
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-0.5" />
          )}
        </button>

        {/* Talent */}
        <button
          onClick={() => onNavigate('talent')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl touch-press transition ${
            activeSection === 'talent'
              ? 'text-[#F3D068]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-cinzel font-bold tracking-tight">Talent</span>
          {activeSection === 'talent' && (
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-0.5" />
          )}
        </button>

        {/* Center Event & Festival Videos Button */}
        <button
          onClick={() => {
            onNavigate('home');
            setTimeout(() => {
              document.getElementById('events-festivals-videos')?.scrollIntoView({ behavior: 'smooth' });
            }, 120);
          }}
          className="flex flex-col items-center justify-center relative -top-3 p-2 rounded-2xl bg-gradient-to-tr from-[#1B0B1B] via-[#D4AF37] to-[#F3D068] text-black shadow-lg shadow-[#D4AF37]/30 touch-press border-2 border-[#0a0a0f]"
          title="Watch Official Event & Festival Videos"
        >
          <div className="relative">
            <Film className="w-5 h-5 text-black" />
          </div>
          <span className="text-[9px] font-cinzel font-extrabold uppercase mt-0.5">Videos</span>
        </button>

        {/* Shows */}
        <button
          onClick={() => onNavigate('shows')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl touch-press transition ${
            activeSection === 'shows'
              ? 'text-[#F3D068]'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-cinzel font-bold tracking-tight">Shows</span>
          {activeSection === 'shows' && (
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-0.5" />
          )}
        </button>

        {/* Team Contact / Sheets */}
        <button
          onClick={() => {
            onNavigate('home');
            setTimeout(() => {
              document.getElementById('team-contact')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl touch-press text-gray-400 hover:text-gray-200 transition"
        >
          <Mail className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-cinzel font-bold tracking-tight">Contact</span>
        </button>

        {/* VIP Booking */}
        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl touch-press text-amber-300 hover:text-white transition"
          title="Book Celebrity or Artist (कलाकार बुकिंग)"
        >
          <CalendarCheck className="w-5 h-5 mb-0.5 text-[#D4AF37]" />
          <span className="text-[10px] font-cinzel font-bold tracking-tight text-[#F3D068]">VIP Book</span>
        </button>
      </div>
    </nav>
  );
};
