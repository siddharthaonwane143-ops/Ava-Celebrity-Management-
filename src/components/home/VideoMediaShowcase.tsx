import React, { useState } from 'react';
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
  Download
} from 'lucide-react';

interface VideoMediaShowcaseProps {
  videos: VideoMediaItem[];
  onBookTalent?: (subject?: string) => void;
}

export const VideoMediaShowcase: React.FC<VideoMediaShowcaseProps> = ({
  videos,
  onBookTalent,
}) => {
  const [selectedRatio, setSelectedRatio] = useState<'all' | '9:16' | '16:9'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeWatchModal, setActiveWatchModal] = useState<VideoMediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  // If no genuine videos uploaded by admin, do not render any demo content
  if (!videos || videos.length === 0) {
    return null;
  }

  // Filter published genuine videos only
  const publishedVideos = videos.filter((v) => v.isPublished !== false);

  if (publishedVideos.length === 0) {
    return null;
  }

  // Extract available categories
  const categoriesMap = new Map<string, string>();
  publishedVideos.forEach((v) => {
    if (v.categorySlug && v.categoryName) {
      categoriesMap.set(v.categorySlug, v.categoryName);
    }
  });
  const categoriesList = Array.from(categoriesMap.entries()).map(([slug, name]) => ({
    slug,
    name,
  }));

  const filteredVideos = publishedVideos.filter((v) => {
    if (selectedRatio !== 'all' && v.aspectRatio !== selectedRatio) return false;
    if (selectedCategory !== 'all' && v.categorySlug !== selectedCategory) return false;
    return true;
  });

  const count916 = publishedVideos.filter((v) => v.aspectRatio === '9:16').length;
  const count169 = publishedVideos.filter((v) => v.aspectRatio === '16:9').length;

  const handleCopyLink = (video: VideoMediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(video.videoUrl);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="relative py-16 sm:py-24 bg-[#0A0A10] border-t border-b border-[#D4AF37]/20 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F3D068] text-xs font-cinzel font-bold mb-3 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Official Video Media & Showreels</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide">
            Verified Talent Media
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base font-light">
            Genuine audition reels, runway walks, and cinematic showreels uploaded directly by AVA Talent Management.
          </p>

          {/* Filter Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <div className="p-1 rounded-xl bg-[#141420] border border-white/10 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setSelectedRatio('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition ${
                  selectedRatio === 'all'
                    ? 'bg-[#D4AF37] text-black shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                All Videos ({publishedVideos.length})
              </button>
              {count916 > 0 && (
                <button
                  onClick={() => setSelectedRatio('9:16')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition flex items-center gap-1.5 ${
                    selectedRatio === '9:16'
                      ? 'bg-violet-600 text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 Reels ({count916})</span>
                </button>
              )}
              {count169 > 0 && (
                <button
                  onClick={() => setSelectedRatio('16:9')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition flex items-center gap-1.5 ${
                    selectedRatio === '16:9'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>16:9 Cinema ({count169})</span>
                </button>
              )}
            </div>

            {/* Category Dropdown / Tags if more than 1 */}
            {categoriesList.length > 1 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#141420] border border-white/10 text-xs text-gray-200 focus:border-[#D4AF37] outline-none"
              >
                <option value="all">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 card-luxury rounded-2xl border-white/10 max-w-md mx-auto p-6">
            <p className="text-gray-400 text-sm">No videos found for this filter selection.</p>
            <button
              onClick={() => {
                setSelectedRatio('all');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-[#F3D068] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isVertical = video.aspectRatio === '9:16';
              return (
                <div
                  key={video.id}
                  className="card-luxury rounded-2xl border-gold-subtle overflow-hidden flex flex-col bg-[#12121A] hover:border-[#D4AF37]/50 transition-all duration-300 group shadow-xl"
                >
                  {/* Video Viewport Container */}
                  <div
                    onClick={() => setActiveWatchModal(video)}
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
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

                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] text-gray-300 font-mono">
                        {video.durationFormatted || '01:00'}
                      </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-14 h-14 rounded-full bg-[#D4AF37]/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-black ml-1" />
                      </div>
                    </div>

                    {/* Video Tag */}
                    {video.videoTag && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-white/20 text-[10px] font-cinzel font-semibold text-[#F3D068]">
                          {video.videoTag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Video Details Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span className="text-[#D4AF37] font-cinzel font-semibold">
                          {video.categoryName}
                        </span>
                        {video.artistName && (
                          <span className="flex items-center gap-1 text-gray-300 truncate max-w-[150px]">
                            <User className="w-3 h-3 text-gray-500" />
                            {video.artistName}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setActiveWatchModal(video)}
                        className="font-cinzel text-base font-bold text-white group-hover:text-[#F3D068] transition cursor-pointer line-clamp-2"
                        title={video.title}
                      >
                        {video.title}
                      </h3>

                      {video.description && (
                        <p className="mt-1.5 text-xs text-gray-400 font-light line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => setActiveWatchModal(video)}
                        className="text-[#F3D068] hover:text-white font-cinzel font-bold flex items-center gap-1 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch Now</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleCopyLink(video, e)}
                          title="Copy Video Link"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                        >
                          {copiedId === video.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {onBookTalent && (
                          <button
                            onClick={() => onBookTalent(video.title)}
                            className="p-1 px-2.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#F3D068] font-cinzel font-bold transition flex items-center gap-1 text-[11px]"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Enquire</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Video Player Modal */}
      {activeWatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0F0F17] border border-[#D4AF37]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#141420] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeWatchModal.aspectRatio === '9:16'
                      ? 'bg-violet-900/80 text-violet-300'
                      : 'bg-amber-900/80 text-[#F3D068]'
                  }`}
                >
                  {activeWatchModal.aspectRatio}
                </span>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {activeWatchModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveWatchModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Area */}
            <div
              className={`relative bg-black flex items-center justify-center overflow-hidden ${
                activeWatchModal.aspectRatio === '9:16' ? 'max-h-[65vh] py-2' : 'aspect-video'
              }`}
            >
              <video
                src={activeWatchModal.videoUrl}
                controls
                autoPlay
                playsInline
                className={`max-h-[65vh] ${
                  activeWatchModal.aspectRatio === '9:16' ? 'w-auto h-full object-contain' : 'w-full h-full object-contain'
                }`}
              />
            </div>

            {/* Modal Footer Specs & Booking */}
            <div className="p-4 bg-[#12121C] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="text-gray-300 font-medium">
                  {activeWatchModal.artistName ? `${activeWatchModal.artistName} • ` : ''}
                  <span className="text-[#D4AF37]">{activeWatchModal.categoryName}</span>
                </div>
                {activeWatchModal.description && (
                  <p className="text-gray-400 text-[11px] max-w-xl font-light">
                    {activeWatchModal.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeWatchModal.videoUrl && (
                  <a
                    href={activeWatchModal.videoUrl}
                    download={activeWatchModal.fileName || `${activeWatchModal.title}.mp4`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-cinzel font-bold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}

                {onBookTalent && (
                  <button
                    onClick={() => {
                      const title = activeWatchModal.title;
                      setActiveWatchModal(null);
                      onBookTalent(title);
                    }}
                    className="btn-gold px-4 py-1.5 rounded-lg text-xs font-bold font-cinzel uppercase flex items-center gap-1.5 shadow"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Representation</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
