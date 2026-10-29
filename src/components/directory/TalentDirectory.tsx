import React, { useState, useMemo } from 'react';
import { TalentCategory, TalentProfile, TalentShow } from '../../types';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Eye,
  CalendarCheck,
  Sparkles,
  X,
  ChevronDown,
  ArrowLeft,
  Compass,
  LayoutGrid,
  Radio,
  Map as MapIcon,
  Download,
  FileText,
  Play,
  Film,
  Smartphone,
  Video
} from 'lucide-react';
import { MaharashtraTalentEventMap } from './MaharashtraTalentEventMap';
import { TalentVideoModal } from '../modals/TalentVideoModal';

interface TalentDirectoryProps {
  categories: TalentCategory[];
  profiles: TalentProfile[];
  shows?: TalentShow[];
  initialCategorySlug?: string;
  onViewProfile: (profile: TalentProfile) => void;
  onBookTalent: (profile: TalentProfile) => void;
  onBack?: () => void;
  onOpenJoinTalent?: () => void;
}

export const TalentDirectory: React.FC<TalentDirectoryProps> = ({
  categories,
  profiles,
  shows = [],
  initialCategorySlug = 'all',
  onViewProfile,
  onBookTalent,
  onBack,
  onOpenJoinTalent,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [selectedIndustry, setSelectedIndustry] = useState<'all' | 'marathi' | 'hindi'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'alphabetical'>('featured');
  const [activeVideoTalent, setActiveVideoTalent] = useState<TalentProfile | null>(null);
  const [videoOnlyFilter, setVideoOnlyFilter] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Published profiles only!
  const publishedProfiles = useMemo(
    () => profiles.filter((p) => p.status === 'published'),
    [profiles]
  );

  // Available unique cities, languages, subcategories for filtering
  const cities = useMemo(() => {
    const set = new Set<string>();
    publishedProfiles.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set);
  }, [publishedProfiles]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    publishedProfiles.forEach((p) => {
      p.languages?.forEach((l) => set.add(l));
    });
    return Array.from(set);
  }, [publishedProfiles]);

  // Current category subcategories
  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const subcategories = currentCategoryObj?.subcategories || [];

  // Filtered & Sorted profiles
  const filteredProfiles = useMemo(() => {
    return publishedProfiles
      .filter((p) => {
        // Industry check
        if (selectedIndustry === 'marathi') {
          const isMarathi = p.industry === 'Marathi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Marathi') || p.city?.includes('Maharashtra') || p.city?.includes('Mumbai') || p.city?.includes('Pune')));
          if (!isMarathi) return false;
        } else if (selectedIndustry === 'hindi') {
          const isHindi = p.industry === 'Hindi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Hindi') || p.categorySlug === 'actors'));
          if (!isHindi) return false;
        }

        // Category check
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
          return false;
        }
        // Subcategory check
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
          return false;
        }
        // City check
        if (selectedCity !== 'all' && p.city !== selectedCity) {
          return false;
        }
        // Availability check
        if (selectedAvailability !== 'all' && p.availability !== selectedAvailability) {
          return false;
        }
        // Language check
        if (selectedLanguage !== 'all' && !p.languages?.includes(selectedLanguage)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBio = p.bio?.toLowerCase().includes(q);
          const matchSkills = p.skills?.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchBio && !matchSkills) return false;
        }

        // Video reels only filter
        if (videoOnlyFilter && !p.videoUrl) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'alphabetical') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [
    publishedProfiles,
    selectedCategory,
    selectedSubcategory,
    selectedCity,
    selectedAvailability,
    selectedLanguage,
    searchQuery,
    sortBy,
    videoOnlyFilter,
  ]);

  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage) || 1;
  const paginatedProfiles = filteredProfiles.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedIndustry('all');
    setSelectedSubcategory('all');
    setSelectedCity('all');
    setSelectedAvailability('all');
    setSelectedLanguage('all');
    setSearchQuery('');
    setPage(1);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back to Home Navigation Bar & View Mode Switcher */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onBack || (() => window.history.back())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14141C] hover:bg-[#1E1E2C] text-gray-200 hover:text-[#F3D068] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-cinzel font-bold transition-all shadow-md group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Home (मुख्य पृष्ठावर परत जा)</span>
          </button>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs border border-white/10 font-cinzel transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>View All Categories (सर्व कॅटेगरी)</span>
            </button>
          )}
        </div>

        {/* View Mode Switcher & Create Profile Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenJoinTalent && (
            <button
              onClick={onOpenJoinTalent}
              className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition cursor-pointer"
              title="Create your artist / talent profile with full features"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>✨ Create Profile (नवीन प्रोफाईल बनवा)</span>
            </button>
          )}

          <div className="flex items-center p-1 bg-[#12121A] rounded-xl border border-white/10 shadow-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Roster Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer relative ${
                viewMode === 'map'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-[#F3D068] hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Maharashtra D3 Map</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Title & Category Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Talent Directory & Geographic Visualization</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {currentCategoryObj ? (
            <span>{currentCategoryObj.name}</span>
          ) : (
            <span>All <span className="text-gold-gradient">Celebrities & Talent</span></span>
          )}
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl">
          {currentCategoryObj?.description ||
            'Explore certified profiles across cinema, musical arts, high fashion, choreography, and top digital creators across Maharashtra.'}
        </p>
      </div>

      {/* Maharashtra Geographic D3 Map Feature Card / Banner */}
      {viewMode === 'grid' ? (
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#1B050B] via-[#0E0E18] to-[#1F1808] border border-[#D4AF37]/35 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-black border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow">
              <Compass className="w-6 h-6 text-[#F3D068]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#F3D068] font-cinzel">
                  Interactive Geographic Visualization
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  D3 Vector Engine
                </span>
              </div>
              <h2 className="font-cinzel text-sm sm:text-base font-bold text-white mt-0.5">
                Maharashtra Talent Locations & Booked Events Map (महाराष्ट्र कलाकार व इव्हेंट नकाशा)
              </h2>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                Geographically visualize talent bases and booked live concert galas across Mumbai, Pune, Nagpur, Nashik, Kolhapur, and all 36 districts with interactive D3 cartography.
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewMode('map')}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg"
          >
            <Compass className="w-4 h-4 text-black" />
            <span>Launch D3 Interactive Map</span>
          </button>
        </div>
      ) : (
        <div className="mb-10 animate-fadeIn">
          <MaharashtraTalentEventMap
            profiles={publishedProfiles}
            shows={shows}
            onViewProfile={onViewProfile}
            onBookTalent={onBookTalent}
            onFilterByCity={(cityName) => {
              setSelectedCity(cityName);
              setViewMode('grid');
            }}
            onCloseMap={() => setViewMode('grid')}
          />
        </div>
      )}

      {/* Industry Tabs Bar (मराठी नाटक/सिनेमा vs हिंदी बॉलिवूड/OTT) */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-1.5 rounded-2xl bg-[#12121A] border border-white/10 shadow-lg">
        <button
          onClick={() => {
            setSelectedIndustry('all');
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-1.5 cursor-pointer ${
            selectedIndustry === 'all'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>All Industries (सर्व कलाकार)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedIndustry === 'all' ? 'bg-black/30 text-black font-extrabold' : 'bg-white/10 text-gray-400'}`}>
            {publishedProfiles.length}
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedIndustry('marathi');
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-1.5 cursor-pointer border ${
            selectedIndustry === 'marathi'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-400 shadow-md'
              : 'text-orange-300 hover:text-white hover:bg-white/5 border-orange-500/20'
          }`}
        >
          <span className="text-sm">🚩</span>
          <span>मराठी इंडस्ट्री (Natak & Serials)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedIndustry === 'marathi' ? 'bg-black/30 text-white font-extrabold' : 'bg-white/10 text-orange-300'}`}>
            {publishedProfiles.filter(p => p.industry === 'Marathi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Marathi') || p.city?.includes('Maharashtra') || p.city?.includes('Mumbai') || p.city?.includes('Pune')))).length}
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedIndustry('hindi');
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-1.5 cursor-pointer border ${
            selectedIndustry === 'hindi'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white border-purple-400 shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-white/5 border-purple-500/20'
          }`}
        >
          <span className="text-sm">🎬</span>
          <span>हिंदी बॉलिवूड (Bollywood & OTT)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedIndustry === 'hindi' ? 'bg-black/30 text-white font-extrabold' : 'bg-white/10 text-purple-300'}`}>
            {publishedProfiles.filter(p => p.industry === 'Hindi' || p.industry === 'Both' || (!p.industry && (p.languages?.includes('Hindi') || p.categorySlug === 'actors'))).length}
          </span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none border-b border-white/5">
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSelectedSubcategory('all');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-cinzel whitespace-nowrap transition border ${
            selectedCategory === 'all'
              ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-black shadow-md'
              : 'bg-[#121217] text-gray-300 border-white/10 hover:border-[#D4AF37]/50'
          }`}
        >
          All Roster ({publishedProfiles.length})
        </button>
        {categories.map((cat) => {
          const count = publishedProfiles.filter((p) => p.categorySlug === cat.slug).length;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setSelectedSubcategory('all');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-cinzel whitespace-nowrap transition border ${
                selectedCategory === cat.slug
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-black shadow-md'
                  : 'bg-[#121217] text-gray-300 border-white/10 hover:border-[#D4AF37]/50'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="card-luxury rounded-xl p-4 sm:p-5 mb-8 space-y-4 border-gold-subtle">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, skill, bio..."
              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Subcategory Filter (if available) */}
          <div>
            <select
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                setPage(1);
              }}
              disabled={subcategories.length === 0}
              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
            >
              <option value="all">All Subcategories</option>
              {subcategories.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* City / Area Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Cities & Regions</option>
              {cities.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              value={selectedAvailability}
              onChange={(e) => {
                setSelectedAvailability(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">Any Availability</option>
              <option value="Available">Available Now</option>
              <option value="Limited">Limited Dates</option>
              <option value="Booked">Booked</option>
            </select>
          </div>
        </div>

        {/* Secondary row: Languages, Sort & Clear Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="flex items-center gap-3">
            {languages.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-[11px]">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setPage(1);
                  }}
                  className="bg-[#0A0A0E] border border-white/10 rounded py-1 px-2 text-xs text-gray-300 focus:outline-none"
                >
                  <option value="all">All Languages</option>
                  {languages.map((l, i) => (
                    <option key={i} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setVideoOnlyFilter(!videoOnlyFilter);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition border ${
                videoOnlyFilter
                  ? 'bg-gradient-to-r from-pink-900 to-purple-900 border-pink-400 text-pink-200 shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
              }`}
              title="Filter artists with uploaded video reels"
            >
              <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>🎬 Video Reels ({publishedProfiles.filter((p) => p.videoUrl).length})</span>
            </button>

            {(selectedCategory !== 'all' ||
              selectedSubcategory !== 'all' ||
              selectedCity !== 'all' ||
              selectedAvailability !== 'all' ||
              selectedLanguage !== 'all' ||
              searchQuery ||
              videoOnlyFilter) && (
              <button
                onClick={clearAllFilters}
                className="text-rose-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-[11px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0A0A0E] border border-white/10 rounded py-1 px-2.5 text-xs text-[#D4AF37] focus:outline-none font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Recently Added</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profile Cards Grid or Empty State */}
      {paginatedProfiles.length === 0 ? (
        <div className="card-luxury rounded-2xl p-10 sm:p-14 text-center max-w-xl mx-auto border-gold-subtle my-12 space-y-4">
          <Sparkles className="w-12 h-12 text-[#D4AF37]/60 mx-auto" />
          <h3 className="font-cinzel text-xl font-bold text-white">
            Real Artist Profiles Directory
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Only real certified profiles added by administration or verified artists registered on AVA are listed here. No demo profiles.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onOpenJoinTalent && (
              <button
                onClick={onOpenJoinTalent}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold inline-flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>✨ Create Profile (नवीन प्रोफाईल बनवा)</span>
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold cursor-pointer transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
          {paginatedProfiles.map((item) => (
            <div
              key={item.id}
              className="group card-luxury rounded-2xl overflow-hidden flex flex-col justify-between border-gold-subtle hover:border-[#D4AF37] transition duration-300 shadow-xl"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181820]">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181822] to-[#0E0E14]">
                    <div className="w-16 h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-xl font-cinzel font-bold text-gold-gradient mb-2">
                      {item.name[0]}
                    </div>
                    <span className="font-cinzel text-xs text-gray-400">{item.name}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E14] via-transparent to-transparent opacity-85" />

                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between gap-1.5 z-10">
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.isFeatured && (
                      <div className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-[#D4AF37]/50 text-[9px] sm:text-[10px] font-bold text-[#F3D068] flex items-center gap-1 font-cinzel">
                        <Star className="w-2.5 h-2.5 fill-[#D4AF37]" />
                        <span className="hidden xs:inline">FEATURED</span>
                      </div>
                    )}

                    {item.industry === 'Marathi' ? (
                      <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold font-cinzel backdrop-blur shadow-sm border bg-orange-950/90 border-orange-500/70 text-orange-200">
                        🚩 मराठी
                      </span>
                    ) : item.industry === 'Hindi' ? (
                      <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold font-cinzel backdrop-blur shadow-sm border bg-purple-950/90 border-purple-500/70 text-purple-200">
                        🎬 हिंदी
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold font-cinzel backdrop-blur shadow-sm border bg-[#D4AF37]/25 border-[#D4AF37]/50 text-[#F3D068]">
                        🌟 मराठी+हिंदी
                      </span>
                    )}

                    {item.talentType && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-cinzel backdrop-blur shadow-sm border ${
                          item.talentType === 'Actress'
                            ? 'bg-pink-950/80 border-pink-500/60 text-pink-300'
                            : item.talentType === 'Actor'
                            ? 'bg-amber-950/80 border-amber-500/60 text-[#F3D068]'
                            : item.talentType === 'Influencer'
                            ? 'bg-purple-950/80 border-purple-500/60 text-purple-300'
                            : 'bg-white/15 border-white/20 text-white'
                        }`}
                      >
                        {item.talentType === 'Actress' && '👑 '}
                        {item.talentType === 'Actor' && '⭐ '}
                        {item.talentType === 'Influencer' && '📱 '}
                        {item.talentType}
                      </span>
                    )}
                  </div>

                  {item.availability && (
                    <div
                      className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold backdrop-blur-md shrink-0 ${
                        item.availability === 'Available'
                          ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                          : 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                      }`}
                    >
                      {item.availability}
                    </div>
                  )}
                </div>

                {/* Video Play Overlay if item has videoUrl */}
                {item.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/40 backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVideoTalent(item);
                      }}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-cinzel font-bold text-[11px] flex items-center gap-1.5 shadow-xl hover:scale-105 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Watch Reel ({item.videoAspectRatio || '9:16'})</span>
                    </button>
                  </div>
                )}

                <div className="absolute bottom-2 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] sm:text-[10px] font-cinzel font-semibold tracking-wider text-[#D4AF37] uppercase block truncate">
                      {item.subcategory || item.categoryName}
                    </span>
                    {item.videoUrl && (
                      <span className="px-1.5 py-0.2 rounded bg-pink-950/80 border border-pink-500/40 text-[8px] font-mono font-bold text-pink-300 shrink-0">
                        🎬 {item.videoAspectRatio || '9:16'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-cinzel text-xs sm:text-lg font-bold text-white group-hover:text-gold-gradient transition leading-tight line-clamp-1">
                    {item.name}
                  </h3>
                  {item.city && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-300 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{item.city}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                {/* Regional Credits & Awards Chips */}
                {(item.marathiNatakOrTheatre || item.marathiSerialsOrShows || item.hindiFilmsOrBollywood || item.hindiOttSeries || item.notableAwards) && (
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {item.marathiNatakOrTheatre && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-950/70 text-orange-200 border border-orange-500/30 truncate max-w-full" title={item.marathiNatakOrTheatre}>
                        🎭 {item.marathiNatakOrTheatre}
                      </span>
                    )}
                    {item.marathiSerialsOrShows && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-200 border border-amber-500/30 truncate max-w-full" title={item.marathiSerialsOrShows}>
                        📺 {item.marathiSerialsOrShows}
                      </span>
                    )}
                    {item.hindiFilmsOrBollywood && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-200 border border-purple-500/30 truncate max-w-full" title={item.hindiFilmsOrBollywood}>
                        🎬 {item.hindiFilmsOrBollywood}
                      </span>
                    )}
                    {item.hindiOttSeries && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950/70 text-indigo-200 border border-indigo-500/30 truncate max-w-full" title={item.hindiOttSeries}>
                        📱 {item.hindiOttSeries}
                      </span>
                    )}
                    {item.notableAwards && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#F3D068] border border-[#D4AF37]/35 truncate max-w-full" title={item.notableAwards}>
                        🏆 {item.notableAwards}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-gray-400 text-[10px] sm:text-xs line-clamp-2 leading-relaxed mb-3 sm:mb-4 hidden sm:block">
                  {item.bio || 'Represented exclusively by AVA Celebrity Management.'}
                </p>

                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3 hidden sm:flex">
                    {item.skills.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-1 sm:gap-1.5 pt-1 sm:pt-2 border-t border-white/10">
                  {item.videoUrl ? (
                    <button
                      onClick={() => setActiveVideoTalent(item)}
                      className="py-1.5 sm:py-2 px-1.5 rounded-lg bg-gradient-to-r from-pink-950/70 to-purple-950/70 hover:from-pink-900 hover:to-purple-900 text-[10px] sm:text-xs text-pink-200 font-medium transition flex items-center justify-center gap-1 border border-pink-500/40 touch-press cursor-pointer shadow"
                      title="Watch Performance Reel"
                    >
                      <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      <span>Reel</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewProfile(item)}
                      className="py-1.5 sm:py-2 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] sm:text-xs text-gray-200 font-medium transition flex items-center justify-center gap-1 border border-white/10 touch-press cursor-pointer"
                      title="View Artist Portfolio"
                    >
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>View</span>
                    </button>
                  )}

                  <button
                    onClick={() => onBookTalent(item)}
                    className="btn-gold py-1.5 sm:py-2 px-3 rounded-lg text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 touch-press cursor-pointer flex-1"
                    title="Direct VIP Booking"
                  >
                    <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Book / Enquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 rounded border border-white/10 text-xs text-gray-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-xs font-bold transition ${
                page === i + 1
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-[#121217] text-gray-400 border border-white/10 hover:border-[#D4AF37]/50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-1.5 rounded border border-white/10 text-xs text-gray-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5"
          >
            Next
          </button>
        </div>
      )}

      {/* Talent Video Modal */}
      <TalentVideoModal
        isOpen={!!activeVideoTalent}
        profile={activeVideoTalent}
        onClose={() => setActiveVideoTalent(null)}
        onBookTalent={onBookTalent}
      />
    </div>
  );
};
