import React, { useState, useRef } from 'react';
import { VideoMediaItem } from '../../types';
import {
  Play,
  Pause,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Calendar,
  Share2,
  Check,
  User,
  Clock,
  Sparkles,
  MapPin,
  Film,
  Flame,
  Award,
  ArrowRight,
  Info
} from 'lucide-react';

interface EventFestivalVideoSectionProps {
  videos: VideoMediaItem[];
  onBookTalent?: (subject?: string) => void;
  onOpenJoinTalent?: () => void;
}

export const EventFestivalVideoSection: React.FC<EventFestivalVideoSectionProps> = ({
  videos,
  onBookTalent,
  onOpenJoinTalent,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<
    | 'all'
    | 'showreels'
    | 'monologues'
    | 'dance'
    | 'fashion'
    | 'reels'
    | 'highlights'
    | 'bts'
    | 'commercials'
    | 'festival'
    | 'long_video'
  >('all');
  const [activeTheaterModal, setActiveTheaterModal] = useState<VideoMediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [featuredPlaying, setFeaturedPlaying] = useState<boolean>(false);
  const [featuredMuted, setFeaturedMuted] = useState<boolean>(true);
  const featuredVideoRef = useRef<HTMLVideoElement | null>(null);

  // Filter only genuine, published videos uploaded by admin (No demo stock items)
  const publishedVideos = (videos || []).filter((v) => {
    if (v.isPublished === false) return false;
    // Exclude any legacy sample links
    if (v.videoUrl && v.videoUrl.includes('commondatastorage.googleapis.com/gtv-videos-bucket/sample/')) {
      return false;
    }
    return true;
  });

  // Filter logic based on user selection
  const filteredVideos = publishedVideos.filter((v) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'showreels') {
      return v.videoType === 'showreel' || v.videoTag?.toLowerCase().includes('showreel');
    }
    if (selectedFilter === 'monologues') {
      return v.videoType === 'monologue' || v.videoTag?.toLowerCase().includes('monologue') || v.title?.toLowerCase().includes('monologue');
    }
    if (selectedFilter === 'dance') {
      return v.videoType === 'dance' || v.categorySlug === 'dancers' || v.videoTag?.toLowerCase().includes('dance') || v.videoTag?.toLowerCase().includes('choreo');
    }
    if (selectedFilter === 'fashion') {
      return v.videoType === 'fashion' || v.categorySlug === 'models' || v.videoTag?.toLowerCase().includes('fashion') || v.videoTag?.toLowerCase().includes('runway');
    }
    if (selectedFilter === 'reels') {
      return v.aspectRatio === '9:16' || v.videoType === 'reel' || v.videoTag?.toLowerCase().includes('reel');
    }
    if (selectedFilter === 'highlights') {
      return v.videoType === 'event' || v.videoTag?.toLowerCase().includes('event') || v.videoTag?.toLowerCase().includes('highlight') || v.videoTag?.toLowerCase().includes('award');
    }
    if (selectedFilter === 'bts') {
      return v.videoType === 'bts' || v.videoTag?.toLowerCase().includes('bts') || v.videoTag?.toLowerCase().includes('behind');
    }
    if (selectedFilter === 'commercials') {
      return v.videoType === 'commercial' || v.videoTag?.toLowerCase().includes('commercial') || v.videoTag?.toLowerCase().includes('ad');
    }
    if (selectedFilter === 'festival') {
      return v.videoType === 'festival' || v.videoTag?.toLowerCase().includes('festival') || Boolean(v.festivalName);
    }
    if (selectedFilter === 'long_video') {
      return v.videoType === 'long_video' || v.isLongVideo || (v.durationFormatted && parseInt(v.durationFormatted.split(':')[0], 10) >= 10);
    }
    return true;
  });

  // Top featured hero video (default to first long video or event video if available, else first item)
  const featuredVideo =
    publishedVideos.find((v) => v.isLongVideo || v.videoType === 'event' || v.videoType === 'festival') ||
    publishedVideos[0];

  const handleCopyLink = (video: VideoMediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(video.videoUrl);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFeaturedPlay = () => {
    if (!featuredVideoRef.current) return;
    if (featuredPlaying) {
      featuredVideoRef.current.pause();
      setFeaturedPlaying(false);
    } else {
      featuredVideoRef.current.play();
      setFeaturedPlaying(true);
    }
  };

  return (
    <section id="events-festivals-videos" className="relative py-16 sm:py-24 bg-[#09090E] border-t border-b border-[#D4AF37]/25 overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#D4AF37]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#F3D068] text-xs font-cinzel font-bold mb-3 tracking-widest uppercase shadow-sm">
            <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Event & Festival Videos (इव्हेंट व उत्सव व्हिडिओ)</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide">
            Curated Event & Festival Showcase
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base font-light leading-relaxed">
            ॲडमिनिस्ट्रेशनने अपलोड केलेले अधिकृत इव्हेंट कव्हरेज, सांस्कृतिक सण व उत्सव (दिवाळी, गणेशोत्सव), आणि संपूर्ण लाँग-फॉर्मेट परफॉर्मन्स व्हिडिओ.
          </p>

          {/* Quick Filter Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: `सर्व व्हिडिओ (All - ${publishedVideos.length})`, icon: Sparkles },
              { id: 'showreels', label: '👑 अभिनय शोरील्स (Showreels)', icon: Award },
              { id: 'monologues', label: '🎭 ऑडिशन मोनोलॉग्स (Monologues)', icon: Film },
              { id: 'dance', label: '💃 नृत्य व कोरियोग्राफी (Dance)', icon: Flame },
              { id: 'fashion', label: '👗 फॅशन व रॅम्प वॉक (Fashion)', icon: Sparkles },
              { id: 'reels', label: '📱 व्हायरल रील्स (9:16 Reels)', icon: Smartphone },
              { id: 'highlights', label: '🎪 इव्हेंट हायलाइट्स (Highlights)', icon: Award },
              { id: 'bts', label: '🎬 पडद्यामागे (BTS)', icon: Film },
              { id: 'commercials', label: '📢 ब्रँड जाहिराती (Commercials)', icon: Sparkles },
              { id: 'festival', label: '🪔 सण व उत्सव (Festivals)', icon: Flame },
              { id: 'long_video', label: '🖥️ लाँग व्हिडिओ (Long Format)', icon: Monitor },
            ].map((tab) => {
              const isSelected = selectedFilter === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105'
                      : 'bg-[#14141E] hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. If NO videos uploaded by admin yet */}
        {publishedVideos.length === 0 ? (
          <div className="card-luxury rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto border border-[#D4AF37]/30 bg-gradient-to-b from-[#14141E] to-[#0A0A10] space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37] shadow-inner">
              <Film className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Event & Festival Video Gallery (अधिकृत व्हिडिओ दालन)
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                सध्या ॲडमिन पॅनेलमधून नवीन इव्हेंट, सण-उत्सव आणि लाँग व्हिडिओ अपलोड करण्याची प्रक्रिया सुरू आहे. केवळ ॲडमिनने अपलोड केलेले अधिकृत व्हिडिओ येथे प्रेक्षकांसाठी प्रदर्शित केले जातात.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onBookTalent && (
                <button
                  onClick={() => onBookTalent('Event Video & Festival Coverage Inquiry')}
                  className="btn-gold px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Book Event / Festival Coverage (इव्हेंट कव्हरेज बुकिंग)</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* 2. Featured Cinema Spotlight Video if available */}
            {featuredVideo && selectedFilter === 'all' && (
              <div className="card-luxury rounded-3xl overflow-hidden border border-[#D4AF37]/50 bg-gradient-to-br from-[#12121A] via-[#0E0E16] to-black mb-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  {/* Left: Cinema Video Player (7 Cols) */}
                  <div className="lg:col-span-7 relative bg-black aspect-video overflow-hidden group">
                    <video
                      ref={featuredVideoRef}
                      src={featuredVideo.videoUrl}
                      playsInline
                      muted={featuredMuted}
                      onPlay={() => setFeaturedPlaying(true)}
                      onPause={() => setFeaturedPlaying(false)}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-cinzel bg-[#D4AF37] text-black shadow">
                          ⭐ FEATURED SPOTLIGHT
                        </span>
                        {featuredVideo.festivalName && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-950/80 text-pink-300 border border-pink-500/50">
                            🪔 {featuredVideo.festivalName}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-[#F3D068] border border-white/10">
                          {featuredVideo.aspectRatio}
                        </span>
                      </div>

                      {featuredVideo.durationFormatted && (
                        <span className="px-2.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold border border-white/20">
                          {featuredVideo.durationFormatted}
                        </span>
                      )}
                    </div>

                    {/* Center Play Button Overlay */}
                    <div
                      onClick={handleToggleFeaturedPlay}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                    >
                      {!featuredPlaying && (
                        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/90 hover:bg-[#F3D068] text-black flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition duration-300">
                          <Play className="w-7 h-7 fill-black ml-1" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleToggleFeaturedPlay}
                          className="px-3 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
                        >
                          {featuredPlaying ? <Pause className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />}
                          <span>{featuredPlaying ? 'Pause' : 'Play Video'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFeaturedMuted(!featuredMuted)}
                          className="p-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs transition cursor-pointer border border-white/10"
                          title={featuredMuted ? 'Unmute' : 'Mute'}
                        >
                          {featuredMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTheaterModal(featuredVideo)}
                        className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#F3D068] border border-[#D4AF37]/60 text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Theater Mode</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Featured Video Metadata & Story (5 Cols) */}
                  <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider">
                        <Award className="w-4 h-4 text-[#D4AF37]" />
                        <span>{featuredVideo.videoTag || 'Event Coverage'} • {featuredVideo.categoryName}</span>
                      </div>
                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-tight">
                        {featuredVideo.title}
                      </h3>
                    </div>

                    {/* Venue & Date metadata */}
                    <div className="space-y-1.5 text-xs text-gray-300">
                      {featuredVideo.festivalName && (
                        <div className="flex items-center gap-2 text-pink-300 font-semibold">
                          <Flame className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span>Festival: {featuredVideo.festivalName}</span>
                        </div>
                      )}
                      {featuredVideo.eventVenue && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>Venue: {featuredVideo.eventVenue}</span>
                        </div>
                      )}
                      {featuredVideo.artistName && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>Featuring: <strong className="text-white">{featuredVideo.artistName}</strong></span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
                      {featuredVideo.description ||
                        'अधिकृत AVA सेलिब्रिटी मॅनेजमेंटने चित्रित केलेले हाय-डेफिनिशन कव्हरेज व लाँग-फॉर्मेट सादरीकरण.'}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTheaterModal(featuredVideo)}
                        className="btn-gold px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Watch Full Coverage (संपूर्ण व्हिडिओ पहा)</span>
                      </button>

                      {onBookTalent && (
                        <button
                          type="button"
                          onClick={() => onBookTalent(featuredVideo.title)}
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-cinzel font-semibold transition cursor-pointer"
                        >
                          Book Similar Act
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Grid of Event, Festival and Long Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => {
                const isVertical = video.aspectRatio === '9:16';
                const isLong = video.isLongVideo || video.videoType === 'long_video';
                return (
                  <div
                    key={video.id}
                    className="card-luxury rounded-2xl border-gold-subtle overflow-hidden flex flex-col bg-[#12121A] hover:border-[#D4AF37] transition-all duration-300 group shadow-xl hover:-translate-y-1"
                  >
                    {/* Media Card Thumbnail / Preview */}
                    <div
                      onClick={() => setActiveTheaterModal(video)}
                      className={`relative w-full overflow-hidden bg-black flex items-center justify-center cursor-pointer ${
                        isVertical ? 'aspect-[9/14]' : 'aspect-video'
                      }`}
                    >
                      <video
                        src={video.videoUrl}
                        playsInline
                        muted
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md ${
                              isVertical
                                ? 'bg-violet-900/90 text-violet-200 border border-violet-500/40'
                                : 'bg-amber-900/90 text-amber-200 border border-amber-500/40'
                            }`}
                          >
                            {isVertical ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                            <span>{video.aspectRatio}</span>
                          </span>

                          {isLong && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                              LONG FORMAT
                            </span>
                          )}
                        </div>

                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] text-gray-200 font-mono font-semibold">
                          {video.durationFormatted || '01:00'}
                        </span>
                      </div>

                      {/* Center Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-13 h-13 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 fill-black ml-1" />
                        </div>
                      </div>

                      {/* Bottom Tag Badges */}
                      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                        {video.festivalName ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-950/90 backdrop-blur border border-pink-500/40 text-[10px] font-bold text-pink-300 truncate max-w-[200px]">
                            🪔 {video.festivalName}
                          </span>
                        ) : video.videoTag ? (
                          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-white/20 text-[10px] font-cinzel font-semibold text-[#F3D068]">
                            {video.videoTag}
                          </span>
                        ) : (
                          <span />
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span className="text-[#D4AF37] font-cinzel font-semibold truncate">
                            {video.categoryName}
                          </span>
                          {video.artistName && (
                            <span className="flex items-center gap-1 text-gray-300 truncate max-w-[140px]">
                              <User className="w-3 h-3 text-gray-500 shrink-0" />
                              <span className="truncate">{video.artistName}</span>
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => setActiveTheaterModal(video)}
                          className="font-cinzel text-base font-bold text-white group-hover:text-[#F3D068] transition cursor-pointer line-clamp-2 leading-snug"
                        >
                          {video.title}
                        </h3>

                        {video.eventVenue && (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2 truncate">
                            <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <span className="truncate">{video.eventVenue}</span>
                          </div>
                        )}

                        {video.description && (
                          <p className="text-gray-400 text-xs line-clamp-2 mt-2 leading-relaxed">
                            {video.description}
                          </p>
                        )}
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTheaterModal(video)}
                          className="flex-1 btn-gold py-2 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>Watch Video (पहा)</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleCopyLink(video, e)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition cursor-pointer shrink-0"
                          title="Copy Video Link"
                        >
                          {copiedId === video.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Cinema Theater Modal for Viewer */}
      {activeTheaterModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-[#0E0E14] border border-[#D4AF37]/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#14141E] border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-white truncate">
                    {activeTheaterModal.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 block truncate">
                    {activeTheaterModal.categoryName} • {activeTheaterModal.aspectRatio} • {activeTheaterModal.videoTag || 'Performance'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleCopyLink(activeTheaterModal, e)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-200 border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedId === activeTheaterModal.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTheaterModal(null)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                  title="Close Theater"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Main Viewport */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[65vh]">
              <div
                className={`relative w-full h-full flex items-center justify-center ${
                  activeTheaterModal.aspectRatio === '9:16' ? 'max-w-[340px] aspect-[9/16]' : 'aspect-video'
                }`}
              >
                <video
                  src={activeTheaterModal.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Bottom Metadata & Booking Footer */}
            <div className="p-4 sm:p-5 bg-[#12121A] border-t border-white/10 shrink-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {activeTheaterModal.festivalName && (
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-500/40 font-semibold">
                        🪔 {activeTheaterModal.festivalName}
                      </span>
                    )}
                    {activeTheaterModal.eventVenue && (
                      <span className="text-gray-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {activeTheaterModal.eventVenue}
                      </span>
                    )}
                    {activeTheaterModal.durationFormatted && (
                      <span className="text-gray-400 font-mono">
                        Duration: {activeTheaterModal.durationFormatted}
                      </span>
                    )}
                  </div>
                  {activeTheaterModal.description && (
                    <p className="text-xs text-gray-300 max-w-2xl line-clamp-2">
                      {activeTheaterModal.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onBookTalent && (
                    <button
                      type="button"
                      onClick={() => {
                        const title = activeTheaterModal.title;
                        setActiveTheaterModal(null);
                        onBookTalent(title ? `Inquiry for ${title}` : 'Video Media Booking');
                      }}
                      className="btn-gold px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      <span>Book Event / Talent</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTheaterModal(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold cursor-pointer border border-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
