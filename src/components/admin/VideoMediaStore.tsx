import React, { useState, useRef } from 'react';
import { TalentCategory, TalentProfile, VideoMediaItem, PROFESSIONAL_VIDEO_CATEGORIES } from '../../types';
import { saveVideoMediaItem, deleteVideoMediaItem } from '../../services/dbService';
import {
  Video,
  Plus,
  X,
  Upload,
  Check,
  Search,
  RefreshCw,
  Play,
  Edit,
  Eye,
  Trash2,
  Film,
  Sparkles,
  Flame,
  Award,
  Smartphone,
  Monitor
} from 'lucide-react';
import { VideoGridPreview } from './VideoGridPreview';

interface VideoMediaStoreProps {
  categories: TalentCategory[];
  profiles: TalentProfile[];
  videoMediaItems: VideoMediaItem[];
  onDataChange: () => void;
  setNotice: (msg: string | null) => void;
  setError: (msg: string | null) => void;
}

export const VideoMediaStore: React.FC<VideoMediaStoreProps> = ({
  categories,
  profiles,
  videoMediaItems,
  onDataChange,
  setNotice,
  setError
}) => {
  const [editingVideoMedia, setEditingVideoMedia] = useState<Partial<VideoMediaItem> | null>(null);
  const [videoRatioFilter, setVideoRatioFilter] = useState<'all' | '9:16' | '16:9'>('all');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState<string>('all');
  const [videoCategoryTypeFilter, setVideoCategoryTypeFilter] = useState<string>('all');
  const [videoSearchQuery, setVideoSearchQuery] = useState<string>('');
  const [activeVideoModal, setActiveVideoModal] = useState<VideoMediaItem | null>(null);
  const [uploadedVideoFileName, setUploadedVideoFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setUploadedVideoFileName(file.name);

    // Read metadata from offscreen video element
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = blobUrl;
    tempVideo.onloadedmetadata = () => {
      const isVertical = tempVideo.videoHeight > tempVideo.videoWidth;
      const detectedRatio: '9:16' | '16:9' = isVertical ? '9:16' : '16:9';
      const totalSecs = Math.floor(tempVideo.duration) || 0;
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      const durationFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      const resolution = `${tempVideo.videoWidth}x${tempVideo.videoHeight} (${detectedRatio === '9:16' ? '9:16 Vertical Reel' : '16:9 Widescreen'})`;

      setEditingVideoMedia((prev) => ({
        ...(prev || {}),
        videoUrl: blobUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
        aspectRatio: prev?.aspectRatio || detectedRatio,
        resolution,
        durationFormatted: durationFormatted !== '00:00' ? durationFormatted : '01:00'
      }));
    };

    setEditingVideoMedia((prev) => {
      if (prev) {
        return {
          ...prev,
          videoUrl: blobUrl,
          fileName: file.name,
          fileSizeBytes: file.size,
        };
      }
      return {
        id: `vid-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        aspectRatio: '16:9',
        categorySlug: categories[0]?.slug || 'actors',
        categoryName: categories[0]?.name || 'Actors & Actresses',
        videoUrl: blobUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
        durationFormatted: '01:00',
        isPublished: true,
        videoTag: 'Showreel'
      };
    });
  };

  const handleSaveVideo = async () => {
    if (!editingVideoMedia?.title?.trim()) {
      alert('Please enter a video title (व्हिडिओचे शीर्षक आवश्यक आहे).');
      return;
    }
    if (!editingVideoMedia?.videoUrl?.trim()) {
      alert('Please upload an MP4 file or provide a video URL.');
      return;
    }

    setLoading(true);
    try {
      await saveVideoMediaItem(editingVideoMedia);
      setNotice(`Video "${editingVideoMedia.title}" saved successfully with ${editingVideoMedia.aspectRatio} ratio!`);
      setEditingVideoMedia(null);
      setUploadedVideoFileName(null);
      onDataChange();
    } catch (err: any) {
      setError(err.message || 'Error saving video media item.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered video media items
  const filteredVideos = videoMediaItems.filter((v) => {
    if (videoRatioFilter !== 'all' && v.aspectRatio !== videoRatioFilter) return false;
    if (videoCategoryFilter !== 'all' && v.categorySlug !== videoCategoryFilter) return false;
    if (videoCategoryTypeFilter !== 'all') {
      if (videoCategoryTypeFilter === 'showreels') {
        if (v.videoType !== 'showreel' && !v.videoTag?.toLowerCase().includes('showreel')) return false;
      } else if (videoCategoryTypeFilter === 'monologues') {
        if (v.videoType !== 'monologue' && !v.videoTag?.toLowerCase().includes('monologue') && !v.title?.toLowerCase().includes('monologue')) return false;
      } else if (videoCategoryTypeFilter === 'dance') {
        if (v.videoType !== 'dance' && v.categorySlug !== 'dancers' && !v.videoTag?.toLowerCase().includes('dance')) return false;
      } else if (videoCategoryTypeFilter === 'fashion') {
        if (v.videoType !== 'fashion' && v.categorySlug !== 'models' && !v.videoTag?.toLowerCase().includes('fashion')) return false;
      } else if (videoCategoryTypeFilter === 'reels') {
        if (v.aspectRatio !== '9:16' && v.videoType !== 'reel' && !v.videoTag?.toLowerCase().includes('reel')) return false;
      } else if (videoCategoryTypeFilter === 'highlights') {
        if (v.videoType !== 'event' && !v.videoTag?.toLowerCase().includes('event') && !v.videoTag?.toLowerCase().includes('highlight')) return false;
      } else if (videoCategoryTypeFilter === 'bts') {
        if (v.videoType !== 'bts' && !v.videoTag?.toLowerCase().includes('bts')) return false;
      } else if (videoCategoryTypeFilter === 'commercials') {
        if (v.videoType !== 'commercial' && !v.videoTag?.toLowerCase().includes('commercial') && !v.videoTag?.toLowerCase().includes('ad')) return false;
      }
    }
    if (videoSearchQuery.trim()) {
      const q = videoSearchQuery.toLowerCase();
      const titleMatch = v.title.toLowerCase().includes(q);
      const artistMatch = v.artistName?.toLowerCase().includes(q);
      const tagMatch = v.videoTag?.toLowerCase().includes(q);
      const catMatch = v.categoryName?.toLowerCase().includes(q);
      return titleMatch || artistMatch || tagMatch || catMatch;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-1">
            <Video className="w-4 h-4 text-[#D4AF37]" />
            <span>AVA Video Production & Talent Media Library</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white">
            Video Media Studio (9:16 & 16:9 MP4 Upload)
          </h2>
          <p className="text-gray-400 text-xs mt-1 max-w-2xl">
            सर्व कॅटेगरीसाठी (All Categories) प्रोफेशन्ल्स व्हिडिओ मीडिया फाइल्स (MP4) अपलोड करा. 9:16 (Vertical Reels / Shorts) आणि 16:9 (Landscape Cinematic Masters) दोन्ही रेशो सपोर्टसह.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingVideoMedia({
                id: `vid-${Date.now()}`,
                title: '',
                aspectRatio: '16:9',
                categorySlug: categories[0]?.slug || 'actors',
                categoryName: categories[0]?.name || 'Actors & Actresses',
                videoUrl: '',
                fileName: '',
                durationFormatted: '',
                resolution: '',
                artistName: '',
                videoTag: 'Showreel',
                description: '',
                isPublished: true
              });
              setUploadedVideoFileName(null);
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold font-cinzel flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New MP4 Video (नवीन व्हिडिओ)</span>
          </button>
        </div>
      </div>

      {/* Video Upload & Edit Studio Modal / Panel */}
      {editingVideoMedia && (
        <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-6 bg-gradient-to-br from-[#12121A] via-[#0D0D14] to-[#0A0A10] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-white">
                  {editingVideoMedia.id && videoMediaItems.some(v => v.id === editingVideoMedia.id)
                    ? 'Edit Video Media Asset'
                    : 'Upload & Configure Video Media (MP4)'}
                </h3>
                <span className="text-[11px] text-gray-400">
                  Configure title, category, 9:16 / 16:9 ratio, artist tags, and MP4 video file
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingVideoMedia(null);
                setUploadedVideoFileName(null);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: Select Aspect Ratio (9:16 Vertical vs 16:9 Landscape) */}
          <div className="space-y-2">
            <label className="text-xs font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider block">
              1. Select Video Aspect Ratio (व्हिडिओ रेशो निवडा) <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 9:16 Vertical Reel Card */}
              <div
                onClick={() => setEditingVideoMedia({
                  ...editingVideoMedia,
                  aspectRatio: '9:16',
                  resolution: editingVideoMedia.resolution?.includes('1920')
                    ? editingVideoMedia.resolution
                    : '1080x1920 (9:16 Vertical HD)'
                })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  editingVideoMedia.aspectRatio === '9:16'
                    ? 'bg-gradient-to-r from-violet-950/60 to-[#181824] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    : 'bg-[#12121A] border-white/10 hover:border-white/30 text-gray-400'
                }`}
              >
                <div className={`w-10 h-14 rounded-lg border-2 flex flex-col items-center justify-between p-1 shrink-0 ${
                  editingVideoMedia.aspectRatio === '9:16'
                    ? 'border-violet-400 bg-violet-950/80 text-violet-300'
                    : 'border-gray-600 bg-black/40 text-gray-500'
                }`}>
                  <div className="w-2 h-0.5 rounded-full bg-current opacity-60" />
                  <span className="text-[9px] font-bold font-mono">9:16</span>
                  <div className="w-1.5 h-1.5 rounded-full border border-current opacity-60" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-sm font-bold text-white">
                      9:16 Vertical Reel / Shorts
                    </span>
                    {editingVideoMedia.aspectRatio === '9:16' && (
                      <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/40 text-[10px] font-bold">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Designed for mobile phones, Instagram Reels, YouTube Shorts, vertical talent monologues, and dancer reels (1080×1920).
                  </p>
                </div>
              </div>

              {/* 16:9 Landscape Cinema Card */}
              <div
                onClick={() => setEditingVideoMedia({
                  ...editingVideoMedia,
                  aspectRatio: '16:9',
                  resolution: editingVideoMedia.resolution?.includes('3840')
                    ? editingVideoMedia.resolution
                    : '1920x1080 (16:9 Cinematic HD)'
                })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  editingVideoMedia.aspectRatio === '16:9'
                    ? 'bg-gradient-to-r from-amber-950/60 to-[#181824] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-[#12121A] border-white/10 hover:border-white/30 text-gray-400'
                }`}
              >
                <div className={`w-14 h-9 rounded-lg border-2 flex items-center justify-center p-1 shrink-0 ${
                  editingVideoMedia.aspectRatio === '16:9'
                    ? 'border-[#D4AF37] bg-[#251806] text-[#F3D068]'
                    : 'border-gray-600 bg-black/40 text-gray-500'
                }`}>
                  <span className="text-[9px] font-bold font-mono">16:9</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-sm font-bold text-white">
                      16:9 Landscape / Cinematic
                    </span>
                    {editingVideoMedia.aspectRatio === '16:9' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/30 text-[#F3D068] border border-[#D4AF37]/50 text-[10px] font-bold">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Designed for desktop screens, 4K film teasers, live orchestra concert broadcasts, and widescreen director masters (1920×1080 / 4K).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Video File Upload & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Form: Details and Upload Dropzone */}
            <div className="lg:col-span-7 space-y-4">
              {/* Direct MP4 File Upload Dropzone */}
              <div>
                <label className="text-xs font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider block mb-1.5">
                  2. Upload Video Media File (MP4, WebM, MOV) <span className="text-red-400">*</span>
                </label>

                <input
                  type="file"
                  ref={videoFileInputRef}
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/m4v"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => videoFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#151520]/80 hover:bg-[#1A1A26] rounded-xl p-5 text-center cursor-pointer transition group shadow-inner"
                >
                  <Upload className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition" />
                  <div className="font-semibold text-xs text-white">
                    क्लिक करून थेट MP4 फाईल निवडा (Click to Browse Video File)
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Supports .mp4, .webm, .mov direct video files. Instant local preview without external server lag.
                  </p>

                  {uploadedVideoFileName && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs">
                      <Check className="w-3.5 h-3.5" />
                      <span className="font-mono truncate max-w-xs">{uploadedVideoFileName}</span>
                      {editingVideoMedia.fileSizeBytes && (
                        <span className="text-[10px] text-emerald-400">
                          ({(editingVideoMedia.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Video URL Input Field */}
                <div className="mt-2.5">
                  <label className="text-[11px] text-gray-400 block mb-1">
                    Or direct MP4 Video URL (किंवा थेट व्हिडिओ URL लिंक):
                  </label>
                  <input
                    type="url"
                    value={editingVideoMedia.videoUrl || ''}
                    onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, videoUrl: e.target.value })}
                    placeholder="https://domain.com/video.mp4"
                    className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white font-mono"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    Direct MP4 or WebM video file URL for production media playback.
                  </p>
                </div>
              </div>

              {/* STEP 3: Metadata Details */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Video Title (व्हिडिओचे शीर्षक) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editingVideoMedia.title || ''}
                  onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, title: e.target.value })}
                  placeholder="उदा. Aarav Deshmukh - Intense Dramatic Monologue (4K Reel)"
                  className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category Selector (All categories supported) */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Talent Category (कॅटेगरी) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={editingVideoMedia.categorySlug || 'actors'}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const matched = categories.find((c) => c.slug === slug);
                      setEditingVideoMedia({
                        ...editingVideoMedia,
                        categorySlug: slug,
                        categoryName: matched ? matched.name : slug
                      });
                    }}
                    className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white cursor-pointer"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name} ({c.slug})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="actors">Actors & Actresses (अभिनेते व अभिनेत्री)</option>
                        <option value="dancers">Dancers & Choreographers (नृत्यकार)</option>
                        <option value="musicians">Singers & Music Artists (गायक व संगीतकार)</option>
                        <option value="comedians">Stand-up Comedians (हास्य कलाकार)</option>
                        <option value="models">Fashion Models (मॉडेल)</option>
                        <option value="anchors">TV Anchors & Emcees (निवेदक)</option>
                        <option value="directors">Directors & Cinematographers (दिग्दर्शक)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Video Type / Format Category */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Video Purpose & Format (व्हिडिओ प्रकार) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={editingVideoMedia.videoType || (editingVideoMedia.videoTag === 'Festival Video' ? 'festival' : editingVideoMedia.videoTag === 'Long Video' ? 'long_video' : editingVideoMedia.videoTag === 'Event Video' ? 'event' : 'event')}
                    onChange={(e) => {
                      const vType = e.target.value as any;
                      let defaultTag = editingVideoMedia.videoTag;
                      if (vType === 'event') defaultTag = 'Event Video';
                      if (vType === 'festival') defaultTag = 'Festival Video';
                      if (vType === 'long_video') defaultTag = 'Long Video';
                      if (vType === 'showreel') defaultTag = 'Showreel';
                      if (vType === 'performance') defaultTag = 'Stage Performance';
                      setEditingVideoMedia({
                        ...editingVideoMedia,
                        videoType: vType,
                        videoTag: defaultTag,
                        isLongVideo: vType === 'long_video' ? true : editingVideoMedia.isLongVideo
                      });
                    }}
                    className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="event">🎪 Event Video / Coverage (इव्हेंट व्हिडिओ / कव्हरेज)</option>
                    <option value="festival">🪔 Festival Celebration (सण व सांस्कृतिक उत्सव)</option>
                    <option value="long_video">🎬 Long Video / Full Coverage (लाँग व्हिडिओ - १०+ मिनिटे)</option>
                    <option value="showreel">👑 Artist Showreel / Monologue (शोरील व अभिनय)</option>
                    <option value="performance">🎤 Stage Concert / Performance (स्टेज परफॉर्मन्स)</option>
                  </select>
                </div>
              </div>

              {/* Specific Event / Festival / Long Video Metadata */}
              <div className="p-3.5 rounded-xl bg-[#141420] border border-[#D4AF37]/30 space-y-3">
                <span className="text-[11px] font-cinzel font-bold text-[#F3D068] uppercase tracking-wider block">
                  Event & Festival Highlights (इव्हेंट व सण-उत्सव तपशील)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-300 block mb-1">
                      Event / Festival Name (उत्सव किंवा इव्हेंटचे नाव)
                    </label>
                    <input
                      type="text"
                      value={editingVideoMedia.festivalName || ''}
                      onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, festivalName: e.target.value })}
                      placeholder="उदा. पुणे आंतरराष्ट्रीय महोत्सव / गणेशोत्सव 2026 / दिवाळी गाला"
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 block mb-1">
                      Venue / City (स्थळ / शहर)
                    </label>
                    <input
                      type="text"
                      value={editingVideoMedia.eventVenue || ''}
                      onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, eventVenue: e.target.value })}
                      placeholder="उदा. षण्मुखानंद सभागृह, मुंबई / बालगंधर्व, पुणे"
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 block mb-1">
                      Event Date / Year (तारीख किंवा वर्ष)
                    </label>
                    <input
                      type="text"
                      value={editingVideoMedia.eventDate || ''}
                      onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, eventDate: e.target.value })}
                      placeholder="उदा. ऑक्टोबर 2026 / दिवाळी 2026"
                      className="w-full bg-[#181824] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="chkLongVideo"
                    checked={editingVideoMedia.isLongVideo ?? false}
                    onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, isLongVideo: e.target.checked })}
                    className="w-4 h-4 text-[#D4AF37] rounded border-white/20 focus:ring-[#D4AF37]"
                  />
                  <label htmlFor="chkLongVideo" className="text-xs text-gray-200 cursor-pointer font-medium flex items-center gap-1.5">
                    <span>Mark as Long Video / Full-Length Master Recording (लाँग व्हिडिओ - १०+ मिनिटे)</span>
                    <span className="text-[10px] font-mono text-[#F3D068] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/30">LONG FORMAT</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Featured Artist */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Featured Artist Name (कलाकाराचे नाव)
                  </label>
                  <input
                    type="text"
                    value={editingVideoMedia.artistName || ''}
                    onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, artistName: e.target.value })}
                    placeholder="उदा. Karan Deshmukh किंवा Pooja Sawant"
                    className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white"
                  />
                  {profiles.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="text-[10px] text-gray-500">Pick from talent:</span>
                      {profiles.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setEditingVideoMedia({ ...editingVideoMedia, artistName: p.name, categorySlug: p.categorySlug, categoryName: p.categoryName })}
                          className="text-[10px] text-gray-400 hover:text-[#D4AF37] underline"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Duration (कालावधी)
                  </label>
                  <input
                    type="text"
                    value={editingVideoMedia.durationFormatted || '01:00'}
                    onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, durationFormatted: e.target.value })}
                    placeholder="01:30"
                    className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Resolution & Quality */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Resolution / Video Quality
                </label>
                <input
                  type="text"
                  value={editingVideoMedia.resolution || (editingVideoMedia.aspectRatio === '9:16' ? '1080x1920 (9:16 Vertical HD)' : '1920x1080 (16:9 Cinematic HD)')}
                  onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, resolution: e.target.value })}
                  className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Description & Details (व्हिडिओचे सविस्तर वर्णन)
                </label>
                <textarea
                  rows={3}
                  value={editingVideoMedia.description || ''}
                  onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, description: e.target.value })}
                  placeholder="Describe the performance act, character breakdown, lighting and scene context..."
                  className="w-full bg-[#181824] border border-white/10 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              {/* Publish status */}
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                  <input
                    type="checkbox"
                    checked={editingVideoMedia.isPublished ?? true}
                    onChange={(e) => setEditingVideoMedia({ ...editingVideoMedia, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#D4AF37] rounded border-white/20 focus:ring-[#D4AF37]"
                  />
                  <span className="font-semibold">Publish on Website & Directory (वेबसाइटवर तात्काळ प्रकाशित करा)</span>
                </label>
              </div>
            </div>

            {/* Right Form: Live Responsive Aspect Ratio Preview Player */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#0A0A0E] rounded-2xl border border-white/10">
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    editingVideoMedia.aspectRatio === '9:16'
                      ? 'bg-violet-950 text-violet-300 border border-violet-500/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                  }`}>
                    {editingVideoMedia.aspectRatio} RATIO PREVIEW
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {editingVideoMedia.aspectRatio === '9:16' ? 'Mobile Phone Mockup' : 'Widescreen Cinema Player'}
                </span>
              </div>

              {/* Video Player Container */}
              <div className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                editingVideoMedia.aspectRatio === '9:16'
                  ? 'aspect-[9/16] w-full max-w-[250px] border-violet-500/60 shadow-[0_0_30px_rgba(139,92,246,0.25)] bg-black'
                  : 'aspect-[16/9] w-full border-[#D4AF37]/60 shadow-[0_0_30px_rgba(212,175,55,0.25)] bg-black'
              }`}>
                {editingVideoMedia.videoUrl ? (
                  <video
                    key={editingVideoMedia.videoUrl + editingVideoMedia.aspectRatio}
                    src={editingVideoMedia.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-gray-500">
                    <Video className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs">No Video Loaded</span>
                    <span className="text-[10px] mt-1 text-gray-600">Select an MP4 file or paste a video link</span>
                  </div>
                )}

                {/* Aspect Ratio Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase backdrop-blur-md ${
                    editingVideoMedia.aspectRatio === '9:16'
                      ? 'bg-violet-950/80 text-violet-300 border border-violet-500/60'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-500/60'
                  }`}>
                    {editingVideoMedia.aspectRatio === '9:16' ? '9:16 REEL' : '16:9 CINEMA'}
                  </span>
                </div>
              </div>

              {/* Quick Meta Footer */}
              <div className="mt-4 text-center space-y-1">
                <div className="text-xs font-bold text-white truncate max-w-xs">
                  {editingVideoMedia.title || 'Untitled Video Title'}
                </div>
                <div className="text-[11px] text-[#D4AF37]">
                  {editingVideoMedia.categoryName || 'General Category'} • {editingVideoMedia.videoTag || 'Showreel'}
                </div>
                {editingVideoMedia.artistName && (
                  <div className="text-[10px] text-gray-400">
                    Artist: {editingVideoMedia.artistName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setEditingVideoMedia(null);
                setUploadedVideoFileName(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              Cancel (रद्द करा)
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSaveVideo}
              className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold font-cinzel flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save & Publish MP4 Video (व्हिडिओ सेव्ह करा)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters & Control Bar */}
      <div className="card-luxury rounded-2xl p-4 border-gold-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Ratio Filter Switcher */}
        <div className="flex items-center p-1 bg-[#12121A] rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setVideoRatioFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition cursor-pointer ${
              videoRatioFilter === 'all'
                ? 'bg-[#D4AF37] text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Ratios ({videoMediaItems.length})
          </button>
          <button
            onClick={() => setVideoRatioFilter('9:16')}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition flex items-center gap-1.5 cursor-pointer ${
              videoRatioFilter === '9:16'
                ? 'bg-violet-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>9:16 Vertical Reels</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">
              {videoMediaItems.filter(v => v.aspectRatio === '9:16').length}
            </span>
          </button>
          <button
            onClick={() => setVideoRatioFilter('16:9')}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-bold transition flex items-center gap-1.5 cursor-pointer ${
              videoRatioFilter === '16:9'
                ? 'bg-[#D4AF37] text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>16:9 Cinema Masters</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">
              {videoMediaItems.filter(v => v.aspectRatio === '16:9').length}
            </span>
          </button>
        </div>

        {/* Category & Search Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={videoCategoryFilter}
            onChange={(e) => setVideoCategoryFilter(e.target.value)}
            className="bg-[#12121A] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="all">All Categories (सर्व कॅटेगरी)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={videoSearchQuery}
              onChange={(e) => setVideoSearchQuery(e.target.value)}
              placeholder="Search title or artist..."
              className="bg-[#12121A] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Professional Video Categories Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#0E0E14] border border-[#D4AF37]/25 shadow-md">
        <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold px-2 py-1 bg-[#D4AF37]/10 rounded-lg">
          Category Focus:
        </span>
        {PROFESSIONAL_VIDEO_CATEGORIES.map((cat) => {
          const isSelected = videoCategoryTypeFilter === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setVideoCategoryTypeFilter(cat.slug)}
              className={`px-3 py-1 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-black border-[#D4AF37] shadow-sm font-extrabold'
                  : 'bg-black/40 hover:bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
      {filteredVideos.length === 0 ? (
        <div className="card-luxury rounded-2xl p-12 text-center border-gold-subtle">
          <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h4 className="font-cinzel text-base font-bold text-white mb-1">
            No Video Media Items Found
          </h4>
          <p className="text-gray-400 text-xs mb-4">
            Try clearing search filters or click upload to add an MP4 video file.
          </p>
          <button
            onClick={() => {
              setVideoRatioFilter('all');
              setVideoCategoryFilter('all');
              setVideoSearchQuery('');
            }}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold font-cinzel inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <VideoGridPreview
          videos={filteredVideos}
          categories={categories}
          onEdit={async (video) => {
            if (video.id) {
              await saveVideoMediaItem(video);
              setNotice(`Updated details for "${video.title}" in database.`);
              onDataChange();
            } else {
              setEditingVideoMedia(video);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onUpdateTitle={async (video, newTitle) => {
            if (!newTitle.trim()) return;
            await saveVideoMediaItem({ ...video, title: newTitle.trim() });
            setNotice(`Updated video title to "${newTitle.trim()}" in database.`);
            onDataChange();
          }}
          onTogglePublish={async (video) => {
            const updated = !video.isPublished;
            await saveVideoMediaItem({ ...video, isPublished: updated });
            setNotice(`Video "${video.title}" ${updated ? 'published' : 'moved to draft'}.`);
            onDataChange();
          }}
          onDelete={async (video) => {
            await deleteVideoMediaItem(video.id);
            setNotice(`Permanently removed media file "${video.title}" from database.`);
            onDataChange();
          }}
          onWatch={(video) => setActiveVideoModal(video)}
        />
      )}

      {/* Fullscreen Video Player Modal */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative bg-[#0E0E14] border border-[#D4AF37]/50 rounded-2xl overflow-hidden max-w-4xl w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono mr-2 ${
                  activeVideoModal.aspectRatio === '9:16'
                    ? 'bg-violet-950 text-violet-300 border border-violet-500/50'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                }`}>
                  {activeVideoModal.aspectRatio === '9:16' ? '9:16 VERTICAL REEL' : '16:9 CINEMA MASTER'}
                </span>
                <h3 className="font-cinzel text-base font-bold text-white inline">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Centered Video Player Container */}
            <div className="flex items-center justify-center bg-black rounded-xl overflow-hidden p-2">
              <div className={`overflow-hidden rounded-xl border border-white/10 ${
                activeVideoModal.aspectRatio === '9:16'
                  ? 'aspect-[9/16] w-full max-w-[320px] max-h-[70vh]'
                  : 'aspect-[16/9] w-full max-h-[70vh]'
              }`}>
                <video
                  src={activeVideoModal.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400 pt-2 border-t border-white/10">
              <div>
                <span className="text-white font-semibold">{activeVideoModal.categoryName}</span>
                {activeVideoModal.artistName && ` • Artist: ${activeVideoModal.artistName}`}
                {activeVideoModal.videoTag && ` • ${activeVideoModal.videoTag}`}
              </div>
              <div className="font-mono text-gray-500">
                {activeVideoModal.resolution} • {activeVideoModal.durationFormatted}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
