import React from 'react';
import { AvaLogo } from './AvaLogo';
import { ShieldCheck, Mail, Phone, MapPin, Award, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string, slug?: string) => void;
  onOpenBooking: () => void;
  onOpenJoinTalent?: () => void;
  isAdmin: boolean;
  onReplayIntro?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenJoinTalent,
  isAdmin,
  onReplayIntro,
  onOpenAdminLogin,
}) => {
  const secretTapCount = React.useRef(0);
  const lastSecretTapTime = React.useRef(0);

  const handleSecretCopyrightTap = () => {
    const now = Date.now();
    if (now - lastSecretTapTime.current < 2000) {
      secretTapCount.current += 1;
    } else {
      secretTapCount.current = 1;
    }
    lastSecretTapTime.current = now;

    // Secret entry on 3 quick taps on the copyright text
    if (secretTapCount.current >= 3) {
      secretTapCount.current = 0;
      if (onOpenAdminLogin) {
        onOpenAdminLogin();
      }
    }
  };
  return (
    <footer className="bg-[#050507] border-t border-[#D4AF37]/25 text-gray-400 text-xs relative overflow-hidden">
      {/* Decorative luxury gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#650B1B]/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <AvaLogo size="lg" showTagline={true} />
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm pt-2">
              AVA Celebrity Management is an elite full-stack talent agency orchestrating premier representation, exclusive bookings, high-impact brand endorsements, film production partnerships, and casting calls worldwide.
            </p>
            <div className="flex flex-wrap gap-4 pt-3 text-[11px] text-gray-400">
              <span className="flex items-center gap-1 text-[#D4AF37]">
                <Award className="w-3.5 h-3.5" />
                Licensed Agency
              </span>
              <span className="flex items-center gap-1 text-[#D4AF37]">
                <Lock className="w-3.5 h-3.5" />
                Secure Contracts
              </span>
              <span className="flex items-center gap-1 text-[#D4AF37]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Roster
              </span>
            </div>
          </div>

          {/* Column 1: Talent Roster */}
          <div>
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-3">
              Talent Categories
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Celebrities', slug: 'celebrities' },
                { name: 'Actors & Actresses', slug: 'actors-actresses' },
                { name: 'Models', slug: 'models' },
                { name: 'Dancers', slug: 'dancers' },
                { name: 'Singers & Musicians', slug: 'singers-musicians' },
                { name: 'Anchors & Hosts', slug: 'anchors-hosts' },
                { name: 'Influencers & Creators', slug: 'influencers' },
              ].map((item) => (
                <li key={item.slug}>
                  <button
                    onClick={() => onNavigate('talent', item.slug)}
                    className="hover:text-[#F3D068] transition"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Partners & Shows */}
          <div>
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-3">
              Network & Events
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('partners')} className="hover:text-[#F3D068] transition">
                  Cinematography Partners
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('partners')} className="hover:text-[#F3D068] transition">
                  Production Houses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('partners', 'sponsors')} className="hover:text-[#F3D068] transition">
                  Official Sponsors
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#F3D068] transition"
                >
                  Success Stories & Testimonials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shows')} className="hover:text-[#F3D068] transition">
                  Upcoming Talent Shows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('auditions')} className="hover:text-[#F3D068] transition">
                  Auditions & Casting Calls
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-[#F3D068] transition">
                  Packages & Pricing
                </button>
              </li>
              {onReplayIntro && (
                <li>
                  <button
                    onClick={onReplayIntro}
                    className="text-[#D4AF37] hover:text-[#F3D068] transition flex items-center gap-1 font-semibold text-[11px]"
                  >
                    ✨ Replay Logo Animation (लोगो ॲनिमेशन)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Structured Agency Inquiry Desks Grid */}
          <div>
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-3">
              Official Inquiry Desks
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenBooking}
                className="w-full text-left p-2.5 rounded-lg bg-[#101016] border border-white/10 hover:border-[#D4AF37]/50 transition group"
              >
                <span className="text-white font-cinzel text-[11px] font-bold block group-hover:text-gold-gradient">
                  VIP Booking Desk
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Celebrity appearances & endorsements
                </span>
              </button>

              <button
                onClick={() => {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('team-contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left p-2.5 rounded-lg bg-[#101016] border border-white/10 hover:border-[#D4AF37]/50 transition group"
              >
                <span className="text-white font-cinzel text-[11px] font-bold block group-hover:text-gold-gradient">
                  Agency Representation & Inquiries
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Direct directorate contact & brand campaigns
                </span>
              </button>

              <button
                onClick={() => onNavigate('auditions')}
                className="w-full text-left p-2.5 rounded-lg bg-[#101016] border border-white/10 hover:border-[#D4AF37]/50 transition group"
              >
                <span className="text-white font-cinzel text-[11px] font-bold block group-hover:text-gold-gradient">
                  Casting Bureau
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Auditions & self-tape submissions
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Discreet Secret Admin Trigger (No visible Admin button anywhere) */}
        <div className="pt-6 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <p
            onClick={handleSecretCopyrightTap}
            className="cursor-default select-none transition-colors hover:text-gray-400"
            title=""
          >
            © {new Date().getFullYear()} AVA Celebrity Management Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-gray-400">
            <span>Mumbai • Beverly Hills • Dubai</span>
            <span className="text-gray-600">|</span>
            <span>Cryptographic Digital Verification Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
