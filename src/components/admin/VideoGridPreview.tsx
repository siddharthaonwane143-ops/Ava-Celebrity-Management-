import React, { useState } from 'react';
import { TalentCategory, VideoMediaItem } from '../../types';
import {
  Smartphone,
  Monitor,
  Play,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Maximize2,
  User,
  Clock,
  HardDrive,
  LayoutGrid,
  Columns,
  X,
  Save,
  AlertTriangle,
  FileVideo
} from 'lucide-react';

interface VideoGridPreviewProps {
  videos: VideoMediaItem[];
  categories?: TalentCategory[];
  onEdit: (video: VideoMediaItem) => void;
  onUpdateTitle?: (video: VideoMediaItem, newTitle: string) => Promise<void>;
  onTogglePublish: (video: VideoMediaItem) => void;
  onDelete: (video: VideoMediaItem) => void;
  onWatch: (video: VideoMediaItem) => void;
}

export const VideoGridPreview: React.FC<VideoGridPreviewProps> = ({
  videos,
  categories = [],
  onEdit,
  onUpdateTitle,
  onTogglePublish,
  onDelete,
  onWatch,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');

  // Inline Title Editing state
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineTitleValue, setInlineTitleValue] = useState<string>('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  // Quick Edit Modal state
  const [quickEditModalVideo, setQuickEditModalVideo] = useState<VideoMediaItem | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategorySlug, setModalCategorySlug] = useState('');
  const [modalArtistName, setModalArtistName] = useState('');
  const [modalAspectRatio, setModalAspectRatio] = useState<'9:16' | '16:9'>('16:9');
  const [modalDescription, setModalDescription] = useState('');

  // Delete Confirmation Modal state
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState<VideoMediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyVideoUrl = (video: VideoMediaItem) => {
    navigator.clipboard.writeText(video.videoUrl);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startInlineEdit = (video: VideoMediaItem) => {
    setInlineEditingId(video.id);
    setInlineTitleValue(video.title);
  };

  const cancelInlineEdit = () => {
    setInlineEditingId(null);
    setInlineTitleValue('');
  };

  const saveInlineTitle = async (video: VideoMediaItem) => {
    if (!inlineTitleValue.trim()) return;
    setIsSavingTitle(true);
    try {
      if (onUpdateTitle) {
        await onUpdateTitle(video, inlineTitleValue.trim());
      } else {
        onEdit({ ...video, title: inlineTitleValue.trim() });
      }
      setInlineEditingId(null);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const openQuickEditModal = (video: VideoMediaItem) => {
    setQuickEditModalVideo(video);
    setModalTitle(video.title);
    setModalCategorySlug(video.categorySlug);
    setModalArtistName(video.artistName || '');
    setModalAspectRatio(video.aspectRatio);
    setModalDescription(video.description || '');
  };

  const handleSaveQuickEditModal = async () => {
    if (!quickEditModalVideo) return;
    if (!modalTitle.trim()) {
      alert('Please enter a video title.');
      return;
    }

    const matchedCat = categories.find((c) => c.slug === modalCategorySlug);
    const updatedVideo: VideoMediaItem = {
      ...quickEditModalVideo,
      title: modalTitle.trim(),
      categorySlug: modalCategorySlug || quickEditModalVideo.categorySlug,
      categoryName: matchedCat ? matchedCat.name : quickEditModalVideo.categoryName,
      artistName: modalArtistName.trim(),
      aspectRatio: modalAspectRatio,
      description: modalDescription.trim(),
      resolution: modalAspectRatio === '9:16' ? '1080x1920 (9:16 Vertical HD)' : '1920x1080 (16:9 Cinematic HD)'
    };

    setIsSavingTitle(true);
    try {
      onEdit(updatedVideo);
      setQuickEditModalVideo(null);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmVideo) return;
    setIsDeleting(true);
    try {
      onDelete(deleteConfirmVideo);
      setDeleteConfirmVideo(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const verticalVideos = videos.filter((v) => v.aspectRatio === '9:16');
  const landscapeVideos = videos.filter((v) => v.aspectRatio === '16:9');

  const renderVideoCard = (video: VideoMediaItem) => {
    const isVertical = video.aspectRatio === '9:16';
    const isPlaying = playingId === video.id;
    const isInlineEditing = inlineEditingId === video.id;

    return (
      <div
        key={video.id}
        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
          isVertical
            ? 'bg-gradient-to-b from-[#161224] via-[#100D1A] to-[#0A0812] border-2 border-violet-500/40 hover:border-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]'
            : 'bg-gradient-to-b from-[#1C1608] via-[#131006] to-[#0B0904] border-2 border-[#D4AF37]/40 hover:border-[#F3D068] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
        }`}
      >
        {/* Top Video Preview & Aspect Ratio Frame */}
        <div className="relative">
          {/* Framed Video Container */}
          <div
            className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
              isVertical ? 'aspect-[9/16] max-h-[360px]' : 'aspect-[16/9]'
            }`}
          >
            <video
              id={`video-player-${video.id}`}
              src={video.videoUrl}
              controls={isPlaying}
              playsInline
              preload="metadata"
              onPlay={() => setPlayingId(video.id)}
              onPause={() => setPlayingId((prev) => (prev === video.id ? null : prev))}
              className="w-full h-full object-cover"
            />

            {/* Play Overlay Button if not playing */}
            {!isPlaying && (
              <div
                onClick={() => {
                  const el = document.getElementById(`video-player-${video.id}`) as HTMLVideoElement;
                  if (el) {
                    el.play();
                    setPlayingId(video.id);
                  }
                }}
                className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center cursor-pointer transition group/play"
              >
                <div className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/play:scale-110 group-hover/play:bg-[#D4AF37] group-hover/play:text-black text-white transition shadow-2xl">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>
            )}

            {/* Visual Aspect Ratio Label Badge */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
              {isVertical ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-950/95 text-violet-200 border border-violet-400/80 shadow-[0_0_15px_rgba(139,92,246,0.6)] backdrop-blur-md">
                  <Smartphone className="w-3.5 h-3.5 text-violet-300 animate-pulse" />
                  <span className="font-mono text-[10px] font-black tracking-wider uppercase">
                    9:16 VERTICAL REEL
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/95 text-[#F3D068] border border-[#D4AF37]/80 shadow-[0_0_15px_rgba(212,175,55,0.6)] backdrop-blur-md">
                  <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-mono text-[10px] font-black tracking-wider uppercase">
                    16:9 CINEMA MASTER
                  </span>
                </div>
              )}
            </div>

            {/* Publication Status Badge */}
            <div className="absolute top-3 right-3 pointer-events-none z-10">
              <span
                className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-md ${
                  video.isPublished
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                    : 'bg-zinc-900/90 text-zinc-400 border-zinc-700'
                }`}
              >
                {video.isPublished ? '● PUBLISHED' : '○ DRAFT'}
              </span>
            </div>

            {/* Video Specs Ribbon at bottom of player */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 pointer-events-none">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                {video.durationFormatted || '01:00'}
              </span>
              <span className="truncate max-w-[120px] text-gray-300">
                {video.resolution || (isVertical ? '1080x1920' : '1920x1080')}
              </span>
              {video.fileSizeBytes && (
                <span className="flex items-center gap-1 text-gray-400">
                  <HardDrive className="w-3 h-3" />
                  {(video.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body & Associated Title Information */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* Category & Video Tag Pills */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-[#D4AF37] truncate">
                {video.categoryName}
              </span>
              {video.videoTag && (
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] text-gray-300 font-mono border border-white/10">
                  {video.videoTag}
                </span>
              )}
            </div>

            {/* ASSOCIATED TITLE SECTION (With Inline Edit capability) */}
            {isInlineEditing ? (
              <div className="space-y-2 p-2 rounded-xl bg-black/60 border border-[#D4AF37]/50 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] text-[#D4AF37] font-semibold">
                  <span>Edit Video Title:</span>
                  <span className="text-gray-400">{inlineTitleValue.length} chars</span>
                </div>
                <input
                  type="text"
                  autoFocus
                  value={inlineTitleValue}
                  onChange={(e) => setInlineTitleValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveInlineTitle(video);
                    if (e.key === 'Escape') cancelInlineEdit();
                  }}
                  className="w-full bg-[#181824] border border-[#D4AF37] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  placeholder="Enter video title..."
                />
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={cancelInlineEdit}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSavingTitle}
                    onClick={() => saveInlineTitle(video)}
                    className="px-2.5 py-1 rounded bg-[#D4AF37] hover:bg-[#F3D068] text-black font-bold text-[10px] flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    <span>{isSavingTitle ? 'Saving...' : 'Save Title'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="group/title relative">
                <h4
                  title={video.title}
                  onDoubleClick={() => startInlineEdit(video)}
                  className="font-cinzel text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-gold-gradient transition"
                >
                  {video.title}
                </h4>
              </div>
            )}

            {/* Featured Artist / Performer */}
            {video.artistName ? (
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <User className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="font-medium truncate">{video.artistName}</span>
              </div>
            ) : (
              <div className="text-[11px] text-gray-500 italic">
                AVA Master Entertainment Asset
              </div>
            )}

            {/* Description Snippet */}
            {video.description && (
              <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed pt-0.5">
                {video.description}
              </p>
            )}
          </div>

          {/* DEDICATED EDIT & DELETE BUTTONS ACTION BAR */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {/* Primary Action Buttons: Edit and Delete */}
            <div className="grid grid-cols-2 gap-2">
              {/* EDIT BUTTON (Opens Title & Metadata Editor) */}
              <button
                type="button"
                onClick={() => openQuickEditModal(video)}
                className="w-full py-1.5 px-2.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#F3D068] border border-[#D4AF37]/50 text-xs font-bold font-cinzel flex items-center justify-center gap-1.5 transition shadow-sm hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] cursor-pointer"
                title="Update Video Title & Details"
              >
                <Edit className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Edit Video</span>
              </button>

              {/* DELETE BUTTON (Removes Media File from Database) */}
              <button
                type="button"
                onClick={() => setDeleteConfirmVideo(video)}
                className="w-full py-1.5 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 hover:border-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm hover:shadow-[0_0_12px_rgba(244,63,94,0.25)] cursor-pointer"
                title="Remove Media File from Database"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete</span>
              </button>
            </div>

            {/* Secondary Controls: Watch, Copy URL, Publish Toggle */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <button
                type="button"
                onClick={() => onWatch(video)}
                className="hover:text-white flex items-center gap-1 transition cursor-pointer text-[11px]"
                title="Watch in Fullscreen Player"
              >
                <Maximize2 className="w-3 h-3 text-[#D4AF37]" />
                <span>Fullscreen</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => copyVideoUrl(video)}
                  className="p-1 rounded hover:bg-white/10 hover:text-white transition cursor-pointer"
                  title="Copy Video MP4 URL"
                >
                  {copiedId === video.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onTogglePublish(video)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition cursor-pointer ${
                    video.isPublished
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/70'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                  }`}
                  title={video.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {video.isPublished ? 'Live' : 'Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Ratio Summary & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0E0E14] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <span className="font-semibold text-white">Ratio Roster:</span>
            <span className="px-2 py-0.5 rounded-md bg-violet-950/80 text-violet-300 border border-violet-500/40 font-mono text-[10px] font-bold">
              9:16 Vertical ({verticalVideos.length})
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-950/80 text-[#F3D068] border border-[#D4AF37]/40 font-mono text-[10px] font-bold">
              16:9 Cinema ({landscapeVideos.length})
            </span>
          </div>
        </div>

        {/* View Switcher: Unified Grid vs Split Columns by Ratio */}
        <div className="flex items-center p-1 bg-[#181824] rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Unified Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'split'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare Ratios (9:16 vs 16:9)</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: UNIFIED RESPONSIVE GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(renderVideoCard)}
        </div>
      )}

      {/* VIEW MODE 2: SPLIT SECTIONS BY RATIO (9:16 VERTICAL & 16:9 LANDSCAPE) */}
      {viewMode === 'split' && (
        <div className="space-y-8">
          {/* Section 1: 9:16 Vertical Reels */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#140E20] to-[#0A0710] border border-violet-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-950 border border-violet-500/50 flex items-center justify-center text-violet-300">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                    <span>9:16 Vertical Reels & Mobile Shorts</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/40 font-mono">
                      {verticalVideos.length} Assets
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Optimized for smartphone feeds, Instagram Reels, and vertical artist monologues (1080×1920)
                  </p>
                </div>
              </div>
            </div>

            {verticalVideos.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs">
                No 9:16 vertical videos found. Click upload to add mobile reels.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {verticalVideos.map(renderVideoCard)}
              </div>
            )}
          </div>

          {/* Section 2: 16:9 Landscape Cinema Masters */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C1608] to-[#0D0A04] border border-[#D4AF37]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#251806] border border-[#D4AF37]/50 flex items-center justify-center text-[#F3D068]">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                    <span>16:9 Landscape & Cinema Masters</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 font-mono">
                      {landscapeVideos.length} Assets
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Optimized for widescreen monitors, cinema trailers, and arena concert broadcasts (1920×1080 / 4K)
                  </p>
                </div>
              </div>
            </div>

            {landscapeVideos.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs">
                No 16:9 widescreen cinema videos found. Click upload to add landscape trailers.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {landscapeVideos.map(renderVideoCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK TITLE & DETAILS EDIT MODAL */}
      {quickEditModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setQuickEditModalVideo(null)}
        >
          <div
            className="relative bg-gradient-to-b from-[#161622] to-[#0E0E16] border border-[#D4AF37]/60 rounded-2xl overflow-hidden max-w-lg w-full p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white">
                    Edit Video Title & Details
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Update video title, category, and display metadata in database
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickEditModalVideo(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Fields */}
            <div className="space-y-4">
              {/* Video Title */}
              <div>
                <label className="text-xs font-semibold text-gray-200 block mb-1">
                  Video Title (व्हिडिओचे शीर्षक) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="Enter video title..."
                  className="w-full bg-[#101018] border border-white/15 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              {/* Aspect Ratio Switcher */}
              <div>
                <label className="text-xs font-semibold text-gray-200 block mb-1.5">
                  Aspect Ratio (व्हिडिओ रेशो)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModalAspectRatio('9:16')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                      modalAspectRatio === '9:16'
                        ? 'bg-violet-950/80 border-violet-500 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                        : 'bg-[#101018] border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>9:16 Vertical Reel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalAspectRatio('16:9')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                      modalAspectRatio === '16:9'
                        ? 'bg-amber-950/80 border-[#D4AF37] text-[#F3D068] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-[#101018] border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>16:9 Cinema Master</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-gray-200 block mb-1">
                    Category (कॅटेगरी)
                  </label>
                  <select
                    value={modalCategorySlug}
                    onChange={(e) => setModalCategorySlug(e.target.value)}
                    className="w-full bg-[#101018] border border-white/15 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Artist Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-200 block mb-1">
                    Featured Artist (कलाकार)
                  </label>
                  <input
                    type="text"
                    value={modalArtistName}
                    onChange={(e) => setModalArtistName(e.target.value)}
                    placeholder="e.g. Karan Deshmukh"
                    className="w-full bg-[#101018] border border-white/15 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-200 block mb-1">
                  Description & Context
                </label>
                <textarea
                  rows={2}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Scene breakdown, director's notes..."
                  className="w-full bg-[#101018] border border-white/15 focus:border-[#D4AF37] rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setQuickEditModalVideo(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingTitle}
                onClick={handleSaveQuickEditModal}
                className="btn-gold px-5 py-2 rounded-lg text-xs font-bold font-cinzel flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingTitle ? 'Saving Changes...' : 'Save Video Details'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT DATABASE DELETION CONFIRMATION MODAL */}
      {deleteConfirmVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setDeleteConfirmVideo(null)}
        >
          <div
            className="relative bg-[#160B0E] border-2 border-rose-500/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/90 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-cinzel text-base font-bold text-white">
                  Remove Video from Database?
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  तुम्हाला खात्री आहे का? खालील व्हिडिओ फाईल आणि रेकॉर्ड डेटाबेसमधून कायमचा काढून टाकला जाईल:
                </p>
              </div>
            </div>

            {/* Video preview card in deletion modal */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3">
              <FileVideo className="w-8 h-8 text-[#D4AF37] shrink-0" />
              <div className="truncate">
                <div className="font-bold text-xs text-white truncate">
                  {deleteConfirmVideo.title}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                  Ratio: {deleteConfirmVideo.aspectRatio} • {deleteConfirmVideo.categoryName}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-rose-300/80 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/20">
              Notice: This operation removes the media file record from Firestore and localStorage. It will no longer appear on the website or directory.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmVideo(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                Cancel (रद्द करा)
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-lg shadow-rose-950/60 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete (हटवा)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
