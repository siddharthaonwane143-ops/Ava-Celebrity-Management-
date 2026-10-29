import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Menu,
  X,
  Search,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronDown,
  LogOut,
  FolderKanban,
  Star,
  Users,
  Radio,
  FileSpreadsheet,
  ArrowLeft,
  Film,
  Volume2,
  UserCheck,
  Bot
} from 'lucide-react';
import { AvaLogo } from './AvaLogo';
import { googleSignIn, logout } from '../../firebase';
import { ViewerFeatureCustomization } from '../../types';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
  activeSection: string;
  onNavigate: (section: string, filterCategorySlug?: string) => void;
  onOpenBooking: () => void;
  onOpenJoinTalent?: () => void;
  onOpenVoiceConcierge: () => void;
  onOpenAdminLogin: () => void;
  onOpenVoiceGuide?: () => void;
  onOpenProfile?: () => void;
  onOpenViewerAuth?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onBack?: () => void;
  features?: ViewerFeatureCustomization;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isAdmin,
  activeSection,
  onNavigate,
  onOpenBooking,
  onOpenJoinTalent,
  onOpenVoiceConcierge,
  onOpenAdminLogin,
  onOpenVoiceGuide,
  onOpenProfile,
  onOpenViewerAuth,
  searchQuery,
  onSearchChange,
  onBack,
  features,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [talentDropdownOpen, setTalentDropdownOpen] = useState(false);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const [showsDropdownOpen, setShowsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Secret 3-Tap Gesture on Brand Logo for Administrative Access
  const logoTapCountRef = useRef(0);
  const lastLogoTapTimeRef = useRef(0);

  // Global Secret Shortcut: Ctrl + Shift + A or Cmd + Shift + A
  useEffect(() => {
    const handleAdminShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        onOpenAdminLogin();
      }
    };
    window.addEventListener('keydown', handleAdminShortcut);
    return () => window.removeEventListener('keydown', handleAdminShortcut);
  }, [onOpenAdminLogin]);

  const handleLogoTap = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    // Count taps occurring within 1.8 seconds of each other
    if (now - lastLogoTapTimeRef.current < 1800) {
      logoTapCountRef.current += 1;
    } else {
      logoTapCountRef.current = 1;
    }
    lastLogoTapTimeRef.current = now;

    // Secret admin entry triggered on exactly 3 quick taps on the brand logo
    if (logoTapCountRef.current >= 3) {
      logoTapCountRef.current = 0;
      if (navigator.vibrate) {
        try { navigator.vibrate([60, 40, 60]); } catch (err) {}
      }
      onOpenAdminLogin();
      return;
    }

    // Standard single tap behaviour: Navigate to home
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const talentCategories = [
    { name: 'All Talent Directory', slug: 'all' },
    { name: 'Celebrities', slug: 'celebrities' },
    { name: 'Actors & Actresses', slug: 'actors-actresses' },
    { name: 'Models', slug: 'models' },
    { name: 'Dancers', slug: 'dancers' },
    { name: 'Singers & Musicians', slug: 'singers-musicians' },
    { name: 'Anchors & Hosts', slug: 'anchors-hosts' },
    { name: 'Influencers', slug: 'influencers' },
    { name: 'Content Creators', slug: 'content-creators' },
  ];

  const partnerCategories = [
    { name: 'Cinematography & Videography', slug: 'cinematography-videography' },
    { name: 'Photography Partners', slug: 'photography-partners' },
    { name: 'Production Partners', slug: 'production-partners' },
    { name: 'Event Partners', slug: 'event-partners' },
    { name: 'Clothing & Fashion Partners', slug: 'clothing-fashion-partners' },
    { name: 'Makeup & Styling Partners', slug: 'makeup-styling-partners' },
    { name: 'Other Official Partners', slug: 'other-partners' },
    { name: 'Official Sponsors', slug: 'sponsors' },
  ];

  const handleSignIn = () => {
    if (onOpenViewerAuth) {
      onOpenViewerAuth();
    } else {
      googleSignIn().catch((err) => console.warn('Sign-in error:', err));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080C]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all duration-300">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Contextual Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoTap}
            className="text-left focus:outline-none cursor-pointer select-none active:scale-95 transition-transform"
            title="AVA Celebrity Management"
          >
            <AvaLogo size="md" />
          </button>

          {activeSection !== 'home' && (
            <button
              onClick={onBack || (() => onNavigate('home'))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14141C] hover:bg-[#1C1C28] text-gray-200 hover:text-[#F3D068] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-cinzel font-bold transition shadow cursor-pointer group"
              title="मागे जा / Back to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">← Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
          )}
        </div>

        {/* Search Bar (Desktop) */}
        {features?.showSearchBar !== false && (
          <div className="hidden lg:flex items-center relative w-64 xl:w-72">
            <Search className="w-4 h-4 absolute left-3 text-[#D4AF37]/60 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search stars, creators, skills..."
              className="w-full bg-[#121217] border border-[#D4AF37]/25 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
            />
          </div>
        )}

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium tracking-wide">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 rounded-md transition ${
              activeSection === 'home'
                ? 'text-[#F3D068] bg-[#D4AF37]/10'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>

          {/* Talent Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setTalentDropdownOpen(true)}
            onMouseLeave={() => setTalentDropdownOpen(false)}
          >
            <button
              onClick={() => onNavigate('talent')}
              className={`px-3 py-2 rounded-md flex items-center gap-1 transition ${
                activeSection === 'talent'
                  ? 'text-[#F3D068] bg-[#D4AF37]/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              Talent Roster
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            {talentDropdownOpen && (
              <div className="absolute top-full left-0 w-64 py-2 bg-[#0E0E14] border border-[#D4AF37]/30 rounded-lg shadow-2xl backdrop-blur-xl z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-cinzel text-[#D4AF37] font-semibold border-b border-white/5">
                  Verified Talent Categories
                </div>
                {talentCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      onNavigate('talent', cat.slug);
                      setTalentDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-[#F3D068] hover:bg-[#D4AF37]/10 transition flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Partners & Sponsors Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPartnerDropdownOpen(true)}
            onMouseLeave={() => setPartnerDropdownOpen(false)}
          >
            <button
              onClick={() => onNavigate('partners')}
              className={`px-3 py-2 rounded-md flex items-center gap-1 transition ${
                activeSection === 'partners'
                  ? 'text-[#F3D068] bg-[#D4AF37]/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              Partners & Sponsors
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            {partnerDropdownOpen && (
              <div className="absolute top-full left-0 w-64 py-2 bg-[#0E0E14] border border-[#D4AF37]/30 rounded-lg shadow-2xl backdrop-blur-xl z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-cinzel text-[#D4AF37] font-semibold border-b border-white/5">
                  Official Network
                </div>
                {partnerCategories.map((part) => (
                  <button
                    key={part.slug}
                    onClick={() => {
                      onNavigate('partners', part.slug);
                      setPartnerDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-[#F3D068] hover:bg-[#D4AF37]/10 transition"
                  >
                    {part.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shows & Casting Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowsDropdownOpen(true)}
            onMouseLeave={() => setShowsDropdownOpen(false)}
          >
            <button
              className={`px-3 py-2 rounded-md flex items-center gap-1 transition ${
                activeSection === 'shows' || activeSection === 'auditions'
                  ? 'text-[#F3D068] bg-[#D4AF37]/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              Shows & Auditions
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            {showsDropdownOpen && (
              <div className="absolute top-full left-0 w-56 py-2 bg-[#0E0E14] border border-[#D4AF37]/30 rounded-lg shadow-2xl backdrop-blur-xl z-50">
                <button
                  onClick={() => {
                    onNavigate('shows');
                    setShowsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-[#F3D068] hover:bg-[#D4AF37]/10 transition"
                >
                  Upcoming Talent Shows
                </button>
                <button
                  onClick={() => {
                    onNavigate('auditions');
                    setShowsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-[#F3D068] hover:bg-[#D4AF37]/10 transition"
                >
                  Auditions & Casting Calls
                </button>
              </div>
            )}
          </div>

          {/* Packages */}
          <button
            onClick={() => onNavigate('packages')}
            className={`px-3 py-2 rounded-md transition ${
              activeSection === 'packages'
                ? 'text-[#F3D068] bg-[#D4AF37]/10'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Packages
          </button>

          {/* Team Contact */}
          <button
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                document.getElementById('team-contact')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-3 py-2 rounded-md text-xs text-gray-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Team Contact</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Primary Book Talent Button */}
          <button
            onClick={onOpenBooking}
            className="btn-gold flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-cinzel font-bold text-black shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            title="Book Celebrity or Artist (कलाकार बुक करा)"
          >
            <Calendar className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Book Talent (बुकिंग)</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* User Auth Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-gold-subtle bg-[#121217] hover:border-[#D4AF37] transition"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#2A0812] border border-[#D4AF37] flex items-center justify-center text-xs font-bold text-gold-gradient">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-gray-400 mr-1" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0E0E14] border border-[#D4AF37]/30 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-xs font-semibold text-white truncate">
                      {user.displayName || 'Authorized User'}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>

                  {features?.allowViewerProfileEdit !== false && (
                    <button
                      onClick={() => {
                        if (onOpenProfile) onOpenProfile();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#F3D068] hover:text-white hover:bg-white/5 flex items-center gap-2 border-b border-white/5 font-semibold"
                    >
                      <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>माझी प्रोफाइल (Edit Profile & Verify)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onNavigate('portal');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <FolderKanban className="w-4 h-4 text-[#D4AF37]" />
                    My Bookings & Applications
                  </button>

                  <div className="border-t border-white/5 my-1" />

                  <button
                    onClick={async () => {
                      await logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#121217] border border-gold-subtle hover:border-[#D4AF37] text-xs font-medium text-gray-200 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#D4AF37]/20 bg-[#0A0A0E] px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          {activeSection !== 'home' && (
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3D068] text-xs font-cinzel font-bold shadow-md cursor-pointer mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Home (मुख्य पृष्ठावर परत जा)</span>
            </button>
          )}

          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search talent..."
              className="w-full bg-[#121217] border border-[#D4AF37]/25 rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 text-sm text-gray-200 hover:bg-white/5 rounded-md"
          >
            Home
          </button>



          {/* Official Event & Festival Videos in Mobile Menu */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById('events-festivals-videos')?.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            className="flex items-center justify-between w-full text-left py-2 px-3 text-sm text-[#F3D068] bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-md font-semibold"
          >
            <span className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#D4AF37]" />
              <span>Event & Festival Videos (इव्हेंट व उत्सव)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F3D068]">OFFICIAL</span>
          </button>

          {/* Team Contact in Mobile Menu */}
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById('team-contact')?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 rounded-md font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Team Contact & Google Sheets Sync</span>
          </button>

          <div className="py-2 border-t border-b border-white/5">
            <p className="px-3 text-[11px] font-cinzel text-[#D4AF37] uppercase font-bold mb-1">
              Talent Categories
            </p>
            {talentCategories.map((c) => (
              <button
                key={c.slug}
                onClick={() => {
                  onNavigate('talent', c.slug);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-1.5 px-3 text-xs text-gray-400 hover:text-white"
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="py-2 border-b border-white/5">
            <p className="px-3 text-[11px] font-cinzel text-[#D4AF37] uppercase font-bold mb-1">
              Partners & Sponsors
            </p>
            {partnerCategories.map((p) => (
              <button
                key={p.slug}
                onClick={() => {
                  onNavigate('partners', p.slug);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-1.5 px-3 text-xs text-gray-400 hover:text-white"
              >
                {p.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onNavigate('shows');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 text-sm text-gray-200 hover:bg-white/5 rounded-md"
          >
            Upcoming Talent Shows
          </button>

          <button
            onClick={() => {
              onNavigate('auditions');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 text-sm text-gray-200 hover:bg-white/5 rounded-md"
          >
            Auditions & Casting Calls
          </button>

          <button
            onClick={() => {
              onNavigate('packages');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 text-sm text-gray-200 hover:bg-white/5 rounded-md"
          >
            Packages & Pricing
          </button>





          {/* Viewer Profile Edit & Verification */}
          {features?.allowViewerProfileEdit !== false && (
            <button
              onClick={() => {
                if (onOpenProfile) onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 text-sm text-[#F3D068] font-bold bg-gradient-to-r from-[#200A14] to-[#12121C] hover:bg-[#200A14] rounded-md border border-[#D4AF37]/40 flex items-center gap-2.5"
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="block text-white text-xs font-cinzel">माझी प्रोफाईल व पडताळणी</span>
                <span className="block text-[10px] text-gray-400 font-normal">Edit Profile, Mobile OTP & Real Verify</span>
              </div>
            </button>
          )}

          {user && (
            <button
              onClick={() => {
                onNavigate('portal');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 text-sm text-[#D4AF37] hover:bg-white/5 rounded-md"
            >
              My Bookings / Applications
            </button>
          )}
        </div>
      )}
    </header>
  );
};
