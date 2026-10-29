import React from 'react';
import {
  Crown,
  Sparkles,
  Clapperboard,
  ShieldCheck,
  CalendarCheck,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AgencyDesksSectionProps {
  onOpenBooking: (deskType?: string) => void;
  onOpenJoinTalent: () => void;
  onNavigate: (section: string) => void;
}

export const AgencyDesksSection: React.FC<AgencyDesksSectionProps> = ({
  onOpenBooking,
  onOpenJoinTalent,
  onNavigate,
}) => {
  const desks = [
    {
      id: 'celebrity-desk',
      title: 'VIP Celebrity Booking Desk',
      badge: 'Marquee Talent',
      icon: Crown,
      description:
        'Direct representation and confidential booking for A-list actors, actresses, and celebrity keynote appearances.',
      sla: 'Response within 4 Hours',
      actionLabel: 'Submit VIP Booking',
      action: () => onOpenBooking('VIP Celebrity Appearance'),
      highlight: true,
    },
    {
      id: 'creator-desk',
      title: 'Creators & Influencers Bureau',
      badge: 'Digital Impact',
      icon: Sparkles,
      description:
        'High-converting brand endorsements, Instagram reels campaigns, YouTube integrations, and UGC content creators.',
      sla: 'Dedicated Campaign Manager',
      actionLabel: 'Book Creators',
      action: () => onOpenBooking('Content Creator Campaign'),
      highlight: false,
    },
    {
      id: 'representation-desk',
      title: 'Artist Representation Bureau',
      badge: 'Talent Scouting',
      icon: ShieldCheck,
      description:
        'Career management, legal contract protection, portfolio acceleration, and worldwide PR representation for rising stars.',
      sla: 'Open Applications',
      actionLabel: 'Join Roster',
      action: onOpenJoinTalent,
      highlight: false,
    },
    {
      id: 'casting-desk',
      title: 'Auditions & Casting Division',
      badge: 'Film & OTT',
      icon: Clapperboard,
      description:
        'Official casting calls, auditions, script readings, and talent scouting for feature films, web series, and TV commercials.',
      sla: 'Active Casting Calls',
      actionLabel: 'Explore Casting',
      action: () => onNavigate('auditions'),
      highlight: false,
    },
    {
      id: 'production-desk',
      title: 'Cinematic & Production Alliance',
      badge: 'Technical Crew',
      icon: Layers,
      description:
        'High-end cinematographers, directors of photography, equipment partners, and post-production editing houses.',
      sla: 'Global Production Ready',
      actionLabel: 'Partner Inquiries',
      action: () => onOpenBooking('Production Partnership'),
      highlight: false,
    },
    {
      id: 'events-desk',
      title: 'Talent Shows & Festivals',
      badge: 'Competitions & Tours',
      icon: CalendarCheck,
      description:
        'Official state and national talent shows, modeling pageants, dance championships, and celebrity concert tours.',
      sla: 'Upcoming Shows & Events',
      actionLabel: 'View Talent Shows',
      action: () => onNavigate('shows'),
      highlight: false,
    },
  ];

  return (
    <section className="py-20 bg-[#09090D] border-t border-[#D4AF37]/20 relative overflow-hidden">
      {/* Background glowing ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-[#2A0812]/20 via-[#D4AF37]/5 to-[#2A0812]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3D068] text-xs font-cinzel font-semibold tracking-widest uppercase mb-3">
            <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Representation Desks</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Direct Agency <span className="text-gold-gradient">Department Grid</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
            Connect directly with specialized management divisions. Dedicated coordinators handle your project with absolute confidentiality and rapid turnaround.
          </p>
        </div>

        {/* Responsive Grid Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {desks.map((desk) => {
            const IconComponent = desk.icon;
            return (
              <div
                key={desk.id}
                className={`card-luxury rounded-2xl p-6 flex flex-col justify-between border transition duration-300 relative group ${
                  desk.highlight
                    ? 'border-[#D4AF37]/60 bg-gradient-to-b from-[#16060D] via-[#0E0E14] to-[#0A0A0E] shadow-xl'
                    : 'border-white/10 hover:border-[#D4AF37]/40 bg-[#0C0C12] hover:bg-[#101018]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        desk.highlight
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F3D068]'
                          : 'bg-white/5 border border-white/10 text-[#D4AF37]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-cinzel font-bold px-2.5 py-1 rounded-full bg-white/5 text-[#E6C66E] border border-white/10">
                      {desk.badge}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-base font-bold text-white mb-2 group-hover:text-gold-gradient transition">
                    {desk.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">
                    {desk.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Status: Active
                    </span>
                    <span className="text-[#D4AF37]">{desk.sla}</span>
                  </div>

                  <button
                    onClick={desk.action}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
                      desk.highlight
                        ? 'btn-gold shadow-md'
                        : 'bg-[#151520] hover:bg-[#20202E] text-gray-200 hover:text-white border border-white/10 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <span>{desk.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
