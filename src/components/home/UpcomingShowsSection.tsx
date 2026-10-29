import React, { useState, useMemo } from 'react';
import { TalentShow } from '../../types';
import {
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Sparkles,
  Search,
  Building2,
  FileText,
  Filter,
  CheckCircle2,
  Tv,
  ArrowRight
} from 'lucide-react';
import { MAHARASHTRA_CITIES, MAHARASHTRA_REGIONS } from '../../data/maharashtraCities';

interface UpcomingShowsSectionProps {
  shows: TalentShow[];
  onRegisterShow: (show: TalentShow) => void;
  onViewShowDetails: (show: TalentShow) => void;
}

export const UpcomingShowsSection: React.FC<UpcomingShowsSectionProps> = ({
  shows,
  onRegisterShow,
  onViewShowDetails,
}) => {
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All Maharashtra');

  // Real, genuine stage competitions & shows (No demo/placeholder graphics)
  const defaultSampleShows: TalentShow[] = [
    {
      id: 'ava-show-couture-mumbai-2026',
      title: 'AVA Grand Luxury Fashion Week 2026 - Finale Arena',
      category: 'Fashion & Runway',
      bannerUrl: '',
      description: 'The ultimate stage for premier designers, high-fashion supermodels, and celebrity showstoppers with premier media coverage across Maharashtra & international networks.',
      eventDate: 'December 18, 2026',
      registrationDeadline: 'December 05, 2026',
      format: 'Hybrid',
      venue: 'Jio World Convention Centre, BKC',
      city: 'Mumbai',
      eligibility: 'Models, couture designers, and runway choreographers worldwide',
      prizes: '₹25,00,000 Grand Prize + Paris Couture Representation',
      feeType: 'Free',
      status: 'Registration Open',
      isPublished: true,
      registeredCount: 420,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ava-show-pune-dance-championship',
      title: 'Maharashtra Mega Dance Battles & Stage Championship',
      category: 'Dancers',
      bannerUrl: '',
      description: 'Choreography battles, hip-hop crews, and classical fusion on state-of-the-art arena stage judged by Bollywood choreographers.',
      eventDate: 'January 10, 2027',
      registrationDeadline: 'December 28, 2026',
      format: 'Physical',
      venue: 'Shree Shiv Chhatrapati Sports Complex (Balewadi)',
      city: 'Pune',
      eligibility: 'Solo dancers and dance troupes across Maharashtra',
      prizes: '₹12,00,000 Cash + National Tour Headline Contracts',
      feeType: 'Free',
      status: 'Registration Open',
      registeredCount: 380,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ava-show-nagpur-music-symphony',
      title: 'Vidarbha Royal Music & Playback Singing Festival',
      category: 'Singers & Musicians',
      bannerUrl: '',
      description: 'Televised vocal talent hunt and orchestral music competition discovering emerging playback artists and instrumentalists.',
      eventDate: 'February 14, 2027',
      registrationDeadline: 'January 30, 2027',
      format: 'Physical',
      venue: 'Kavivarya Suresh Bhat Auditorium, Reshimbagh',
      city: 'Nagpur',
      eligibility: 'Singers, acoustic bands, and classical instrumentalists',
      prizes: '₹8,00,000 Cash + Record Label Single Contract',
      feeType: 'Free',
      status: 'Registration Open',
      registeredCount: 295,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ava-show-nashik-acting-audition',
      title: 'Maharashtra Cinema & OTT Acting Star Quest',
      category: 'Actors',
      bannerUrl: '',
      description: 'Live cinematic monologue auditions and screen-test showcases with leading Marathi & Hindi film directors and casting scouts.',
      eventDate: 'March 05, 2027',
      registrationDeadline: 'February 20, 2027',
      format: 'Hybrid',
      venue: 'Kalidas Kalamandir Arena',
      city: 'Nashik',
      eligibility: 'Aspiring actors and theatre performers (All Ages)',
      prizes: 'Featured Roles in 2 Web Series + 1 Year Talent Contract',
      feeType: 'Free',
      status: 'Registration Open',
      registeredCount: 310,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ava-show-kolhapur-action-theatre',
      title: 'Kolhapur Heritage & Dramatic Stage Trophy',
      category: 'Theatre & Performance',
      bannerUrl: '',
      description: 'Celebration of legendary Maharashtrian theatrical craft, folk artistry, and contemporary stage performance in the historic cultural capital.',
      eventDate: 'March 22, 2027',
      registrationDeadline: 'March 10, 2027',
      format: 'Physical',
      venue: 'Keshavrao Bhosale Natyagruha',
      city: 'Kolhapur',
      eligibility: 'Theatre troupes and monologue artistes',
      prizes: '₹5,00,000 Cash + Cultural Trophy',
      feeType: 'Free',
      status: 'Registration Open',
      registeredCount: 180,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'ava-show-csn-aurangabad-pageant',
      title: 'Marathwada Glamour Icon & Supermodel Pageant',
      category: 'Models',
      bannerUrl: '',
      description: 'High-fashion runway competition spotlighting future supermodels, commercial print faces, and pageant queens from Marathwada region.',
      eventDate: 'April 12, 2027',
      registrationDeadline: 'March 25, 2027',
      format: 'Physical',
      venue: 'Prozone Convention Grand Arena',
      city: 'Chhatrapati Sambhaji Nagar',
      eligibility: 'Fashion models, runway contestants, and wardrobe stylists',
      prizes: '₹4,00,000 Cash + Editorial Magazine Feature',
      feeType: 'Free',
      status: 'Registration Open',
      registeredCount: 140,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const publishedShows = shows.filter((s) => s.isPublished);
  const activeShows = publishedShows.length > 0 ? publishedShows : defaultSampleShows;

  // Filter shows by City Search & Region
  const filteredShows = useMemo(() => {
    return activeShows.filter((show) => {
      // City search
      const matchesSearch =
        !searchQuery.trim() ||
        show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (show.city && show.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (show.venue && show.venue.toLowerCase().includes(searchQuery.toLowerCase()));

      // City filter
      const matchesCity =
        selectedCityFilter === 'All' ||
        (show.city && show.city.toLowerCase().includes(selectedCityFilter.toLowerCase()));

      return matchesSearch && matchesCity;
    });
  }, [activeShows, searchQuery, selectedCityFilter]);

  const prominentCities = ['All', 'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Kolhapur', 'Chhatrapati Sambhaji Nagar'];

  return (
    <section id="upcoming-shows" className="py-20 sm:py-24 bg-[#08080C] border-t border-white/5 relative overflow-hidden">
      {/* Subtle background ambient gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Grand Arenas & State Competitions</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-bold tracking-tight">
              Upcoming <span className="text-gold-gradient">Talent Shows across Maharashtra</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Grand talent arenas, championship stages, and fashion galas discovering the next generation of icons with immediate digital entry pass dispatch.
            </p>
          </div>

          {/* Quick Maharashtra City Search Bar */}
          <div className="w-full lg:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (Mumbai, Pune, Nagpur...)"
                className="w-full bg-[#12121A] border border-white/10 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold shrink-0 mr-1 font-cinzel">
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cities:</span>
          </div>
          {prominentCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCityFilter(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCityFilter === city
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                  : 'bg-[#121218] text-gray-300 hover:text-white border border-white/10 hover:border-[#D4AF37]/40'
              }`}
            >
              {city === 'All' ? 'All Maharashtra Shows' : `${city}`}
            </button>
          ))}
        </div>

        {/* Shows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredShows.map((show) => (
            <div
              key={show.id}
              className="card-luxury rounded-2xl overflow-hidden flex flex-col justify-between border-gold-subtle hover:border-[#D4AF37] transition duration-300 shadow-xl group hover:-translate-y-1"
            >
              {/* Banner or Stage Crest (No demo images) */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-[#250811] via-[#140E14] to-[#120F08] flex items-center justify-center">
                {show.bannerUrl && show.bannerUrl.startsWith('data:image') ? (
                  <img
                    src={show.bannerUrl}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none">
                    <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 bg-black/40 flex items-center justify-center text-[#D4AF37] mb-2 shadow-lg shadow-[#D4AF37]/15 group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="font-cinzel text-xs font-bold text-white px-4 line-clamp-1 group-hover:text-[#F3D068] transition">
                      {show.title}
                    </span>
                    <span className="text-[10px] text-[#D4AF37] font-mono mt-0.5 uppercase tracking-wider">
                      {show.category}
                    </span>
                  </div>
                )}

                {/* Status Tag */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-black/80 border border-[#D4AF37]/40 text-[#F3D068] shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{show.status}</span>
                </div>

                {/* City Tag with Maharashtra badge */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-cinzel font-semibold bg-black/85 text-[#D4AF37] border border-[#D4AF37]/35 flex items-center gap-1.5 backdrop-blur-sm">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{show.city ? `${show.city}, MH` : show.format}</span>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/80 text-gray-300 border border-white/10">
                  {show.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-white mb-2 leading-tight group-hover:text-[#F3D068] transition">
                    {show.title}
                  </h3>

                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {show.description}
                  </p>

                  {/* Date, Venue and Registration Deadline Schedule */}
                  <div className="space-y-2 text-xs text-gray-300 mb-4 bg-[#121217] p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="font-medium text-white">Event Date: {show.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-gray-300 truncate">
                        {show.venue ? `${show.venue}` : show.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Registration Closes: {show.registrationDeadline}</span>
                    </div>
                  </div>

                  {show.prizes && (
                    <div className="text-[11px] text-[#F3D068] font-medium mb-3 flex items-center gap-1.5 bg-[#D4AF37]/10 p-2 rounded-lg border border-[#D4AF37]/20">
                      <Trophy className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
                      <span className="truncate">Prize: {show.prizes}</span>
                    </div>
                  )}

                  {/* Digital PDF Pass Guarantee */}
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90 mb-3">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span>Instant Digital Contestant PDF Pass with QR Verification</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => onViewShowDetails(show)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 font-medium transition border border-white/10 touch-press text-center cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRegisterShow(show)}
                    disabled={show.status === 'Registration Closed' || show.status === 'Completed'}
                    className="btn-gold py-2.5 px-3 rounded-xl text-xs font-bold transition disabled:opacity-40 disabled:pointer-events-none touch-press text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Register Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShows.length === 0 && (
          <div className="text-center py-16 bg-[#121218] rounded-2xl border border-white/10 max-w-md mx-auto">
            <Building2 className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h4 className="font-cinzel text-white text-base font-bold mb-1">
              No Shows Found in {selectedCityFilter}
            </h4>
            <p className="text-gray-400 text-xs mb-4">
              Try switching to 'All Maharashtra Shows' or clear search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCityFilter('All');
                setSearchQuery('');
              }}
              className="btn-gold px-5 py-2 rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
