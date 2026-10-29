import React, { useState } from 'react';
import { TalentProfile } from '../../types';
import {
  X,
  MapPin,
  Globe,
  Star,
  CalendarCheck,
  ShieldCheck,
  ExternalLink,
  Award,
  ArrowLeft,
  Download,
  FileText,
  Play,
  Pause,
  Video,
  Smartphone,
  Monitor,
  Camera,
  Film,
  Sparkles,
  Volume2,
  VolumeX,
  Crown
} from 'lucide-react';
import { InstagramVerifiedBadge } from '../common/InstagramVerifiedBadge';

interface TalentDetailModalProps {
  profile: TalentProfile | null;
  onClose: () => void;
  onBookTalent: (profile: TalentProfile) => void;
}

export const TalentDetailModal: React.FC<TalentDetailModalProps> = ({
  profile,
  onClose,
  onBookTalent,
}) => {
  const [mediaTab, setMediaTab] = useState<'photo' | 'video'>('photo');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  if (!profile) return null;

  const hasVideo = !!profile.videoUrl;
  const isVerticalVideo = profile.videoAspectRatio === '9:16';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="card-luxury w-full max-w-4xl rounded-2xl border-gold-glow my-6 sm:my-8 overflow-hidden bg-[#0C0C12] relative shadow-2xl">
        {/* Top Floating Back & Close Buttons */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-gray-200 hover:text-[#F3D068] border border-white/20 hover:border-[#D4AF37] transition flex items-center gap-1.5 text-xs font-cinzel font-bold shadow-xl cursor-pointer"
            title="मागे जा / Back"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>← Back / मागे जा</span>
          </button>

          <button
            onClick={onClose}
            className="pointer-events-auto p-2 rounded-full bg-black/80 hover:bg-black text-gray-300 hover:text-white border border-white/20 hover:border-[#D4AF37] transition cursor-pointer shadow-xl"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Photo / Video & Quick Specs */}
          <div className="md:col-span-2 relative bg-[#14141C] p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div>
              {/* Media Mode Toggle (Photo vs Video) if Video Exists */}
              {hasVideo && (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/70 border border-white/10 mb-3 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setMediaTab('photo')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      mediaTab === 'photo'
                        ? 'bg-[#D4AF37] text-black shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaTab('video')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      mediaTab === 'video'
                        ? 'bg-gradient-to-r from-pink-900 to-purple-900 text-pink-200 border border-pink-400/50 shadow-md'
                        : 'text-gray-400 hover:text-pink-300'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Video ({profile.videoAspectRatio || 'Reel'})</span>
                  </button>
                </div>
              )}

              {/* MEDIA DISPLAY CONTAINER */}
              {mediaTab === 'video' && hasVideo ? (
                /* VIDEO PLAYER MODE */
                <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl bg-black mb-4">
                  <div
                    className={`relative w-full ${
                      isVerticalVideo ? 'aspect-[9/16] max-h-[360px]' : 'aspect-video'
                    }`}
                  >
                    <video
                      src={profile.videoUrl}
                      autoPlay
                      playsInline
                      loop
                      muted={isVideoMuted}
                      className="w-full h-full object-cover"
                    />

                    {/* Top Video Tag */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] pointer-events-none z-10">
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur border border-pink-500/50 text-pink-300 font-mono font-bold">
                        {isVerticalVideo ? '9:16 Reel' : '16:9 Cinema'}
                      </span>
                      {profile.videoTag && (
                        <span className="px-2 py-0.5 rounded-full bg-black/80 text-[#D4AF37] font-semibold">
                          #{profile.videoTag}
                        </span>
                      )}
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
                      <span className="text-[10px] text-white font-mono bg-black/70 px-2 py-0.5 rounded">
                        {profile.videoDuration || 'Live'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsVideoMuted(!isVideoMuted)}
                        className="w-7 h-7 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
                        title={isVideoMuted ? 'Unmute' : 'Mute'}
                      >
                        {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    </div>
                  </div>

                  {profile.videoTitle && (
                    <div className="p-2.5 bg-[#101018] border-t border-white/10 text-xs">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Video Title</span>
                      <strong className="text-white font-cinzel line-clamp-1">{profile.videoTitle}</strong>
                    </div>
                  )}
                </div>
              ) : (
                /* PHOTO PORTFOLIO MODE */
                <div
                  className="rounded-xl overflow-hidden border border-gold-subtle relative mb-4 bg-[#0A0A0E] shadow-xl group"
                  style={{
                    aspectRatio:
                      profile.imageAspectRatio === '1:1'
                        ? '1/1'
                        : profile.imageAspectRatio === '4:5'
                        ? '4/5'
                        : profile.imageAspectRatio === '9:16'
                        ? '9/16'
                        : profile.imageAspectRatio === '16:9'
                        ? '16/9'
                        : '3/4'
                  }}
                >
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                      <div className="w-20 h-20 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-3xl font-cinzel text-gold-gradient mb-2">
                        {profile.name[0]}
                      </div>
                    </div>
                  )}

                  {profile.isFeatured && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-[#D4AF37]/50 text-[10px] font-bold text-[#F3D068] flex items-center gap-1 font-cinzel">
                      <Star className="w-2.5 h-2.5 fill-[#D4AF37]" />
                      FEATURED
                    </div>
                  )}

                  {/* Quick Watch Video Pill on Photo */}
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setMediaTab('video')}
                      className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-pink-900/90 to-purple-900/90 hover:from-pink-800 hover:to-purple-800 text-pink-200 border border-pink-400/60 text-xs font-bold font-cinzel flex items-center gap-1.5 shadow-xl transition transform hover:scale-105 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Watch Reel ({profile.videoAspectRatio || '9:16'})</span>
                    </button>
                  )}
                </div>
              )}

              {/* Specs & Attributes */}
              <div className="space-y-2 text-xs">
                {profile.talentType && (
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Talent Role:</span>
                    <span className="font-semibold text-[#F3D068] font-cinzel">
                      {profile.talentType}
                    </span>
                  </div>
                )}

                {profile.availability && (
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Availability:</span>
                    <span
                      className={`font-semibold ${
                        profile.availability === 'Available'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {profile.availability}
                    </span>
                  </div>
                )}

                {profile.city && (
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Base / City:</span>
                    <span className="text-gray-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      {profile.city}
                    </span>
                  </div>
                )}

                {profile.experience && (
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-gray-200">{profile.experience}</span>
                  </div>
                )}

                {(profile.instagramHandle || profile.socialHandle) && (
                  <div className="py-2 border-b border-white/5 space-y-1">
                    <span className="text-gray-400 block text-[10px] uppercase font-cinzel">Verified Instagram:</span>
                    <InstagramVerifiedBadge
                      handle={profile.instagramHandle || profile.socialHandle}
                      url={profile.instagramUrl}
                      followers={profile.instagramFollowers}
                      isVerified={profile.instagramVerified ?? true}
                      className="w-full justify-between"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 space-y-2">

              <button
                onClick={() => {
                  onClose();
                  onBookTalent(profile);
                }}
                className="btn-gold w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book This Talent</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-xs font-cinzel font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>← Back to Roster (मागे जा)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Bio, Skills, Video Media Details, Booking Types */}
          <div className="md:col-span-3 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel text-[#D4AF37] uppercase tracking-widest font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{profile.categoryName} • {profile.subcategory || 'Principal Artist'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  {profile.name}
                </h2>
                {profile.talentType && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-cinzel tracking-wider uppercase border shadow-sm ${
                      profile.talentType === 'Actress'
                        ? 'bg-pink-950/70 border-pink-500/50 text-pink-300'
                        : profile.talentType === 'Actor'
                        ? 'bg-amber-950/70 border-amber-500/50 text-[#F3D068]'
                        : profile.talentType === 'Influencer'
                        ? 'bg-purple-950/70 border-purple-500/50 text-purple-300'
                        : 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#F3D068]'
                    }`}
                  >
                    {profile.talentType === 'Actress' && '👑 '}
                    {profile.talentType === 'Actor' && '⭐ '}
                    {profile.talentType === 'Influencer' && '📱 '}
                    {profile.talentType}
                  </span>
                )}

                {/* Industry Affiliation Badge */}
                {profile.industry === 'Marathi' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-cinzel tracking-wider border shadow-sm bg-orange-950/80 border-orange-500/60 text-orange-200">
                    🚩 मराठी इंडस्ट्री (Marathi Cinema & Natak)
                  </span>
                ) : profile.industry === 'Hindi' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-cinzel tracking-wider border shadow-sm bg-purple-950/80 border-purple-500/60 text-purple-200">
                    🎬 हिंदी बॉलिवूड (Hindi Bollywood & OTT)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-cinzel tracking-wider border shadow-sm bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#F3D068]">
                    🌟 मराठी व हिंदी (Both Industries)
                  </span>
                )}
              </div>
            </div>

            {/* PERFORMANCE CREDITS: MARATHI INDUSTRY & HINDI BOLLYWOOD */}
            {(profile.marathiNatakOrTheatre || profile.marathiSerialsOrShows || profile.hindiFilmsOrBollywood || profile.hindiOttSeries || profile.notableAwards) && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#14141E] border border-[#D4AF37]/30 shadow-lg">
                <h4 className="font-cinzel text-xs uppercase text-[#F3D068] tracking-wider font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Industry Work & Project Highlights (कामगिरी व संदर्भ)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Marathi Theatre & Serials */}
                  {(profile.marathiNatakOrTheatre || profile.marathiSerialsOrShows) && (
                    <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/30 space-y-2">
                      <div className="text-xs font-cinzel font-bold text-orange-300 flex items-center gap-1.5">
                        <span className="text-sm">🚩</span>
                        <span>मराठी रंगभूमी व मालिका</span>
                      </div>
                      {profile.marathiNatakOrTheatre && (
                        <div className="text-xs">
                          <span className="text-gray-400 block text-[10px] uppercase font-mono">नाटक / रंगभूमी:</span>
                          <span className="text-white font-medium">{profile.marathiNatakOrTheatre}</span>
                        </div>
                      )}
                      {profile.marathiSerialsOrShows && (
                        <div className="text-xs">
                          <span className="text-gray-400 block text-[10px] uppercase font-mono">टीव्ही मालिका / शो:</span>
                          <span className="text-amber-200 font-medium">{profile.marathiSerialsOrShows}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hindi Bollywood & OTT */}
                  {(profile.hindiFilmsOrBollywood || profile.hindiOttSeries) && (
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                      <div className="text-xs font-cinzel font-bold text-purple-300 flex items-center gap-1.5">
                        <span className="text-sm">🎬</span>
                        <span>हिंदी बॉलिवूड व ओटीटी</span>
                      </div>
                      {profile.hindiFilmsOrBollywood && (
                        <div className="text-xs">
                          <span className="text-gray-400 block text-[10px] uppercase font-mono">बॉलिवूड चित्रपट:</span>
                          <span className="text-white font-medium">{profile.hindiFilmsOrBollywood}</span>
                        </div>
                      )}
                      {profile.hindiOttSeries && (
                        <div className="text-xs">
                          <span className="text-gray-400 block text-[10px] uppercase font-mono">ओटीटी सिरीज:</span>
                          <span className="text-purple-200 font-medium">{profile.hindiOttSeries}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Awards & Honors */}
                {profile.notableAwards && (
                  <div className="p-3 rounded-xl bg-black/50 border border-[#D4AF37]/30 flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="text-[#F3D068] font-bold block text-[10px] uppercase font-cinzel">पुरस्कार व सन्मान (Awards & Honors):</span>
                      <span className="text-gray-200 font-medium">{profile.notableAwards}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Performance Video Media Banner if Present */}
            {hasVideo && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/50 via-black to-[#D4AF37]/15 border border-purple-500/40 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-pink-400 shrink-0">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-pink-300 uppercase font-mono font-bold block">
                      Video Media Available ({profile.videoAspectRatio || '9:16'})
                    </span>
                    <strong className="text-xs text-white line-clamp-1">
                      {profile.videoTitle || `${profile.name} Performance Showreel`}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMediaTab('video')}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#F3D068] text-black text-xs font-cinzel font-bold flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 transition"
                >
                  <Play className="w-3 h-3 fill-black" />
                  <span>Watch Video</span>
                </button>
              </div>
            )}

            {/* Biography */}
            <div>
              <h4 className="font-cinzel text-xs uppercase text-gray-400 tracking-wider font-bold mb-2">
                Professional Biography
              </h4>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light whitespace-pre-line">
                {profile.bio || 'Represented exclusively by AVA Celebrity Management.'}
              </p>
            </div>

            {/* Skills & Specializations */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="font-cinzel text-xs uppercase text-gray-400 tracking-wider font-bold mb-2">
                  Skills & Specializations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#181822] border border-white/10 text-xs text-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Spoken Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div>
                <h4 className="font-cinzel text-xs uppercase text-gray-400 tracking-wider font-bold mb-2">
                  Languages Spoken
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  {profile.languages.map((lang, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#D4AF37]" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Supported Booking Types */}
            {profile.supportedBookingTypes && profile.supportedBookingTypes.length > 0 && (
              <div>
                <h4 className="font-cinzel text-xs uppercase text-gray-400 tracking-wider font-bold mb-2">
                  Available Engagement Formats
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.supportedBookingTypes.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#D4AF37]/10 text-[#F3D068] border border-[#D4AF37]/25"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Links & Direct Video Player */}
            {profile.portfolioUrls && profile.portfolioUrls.length > 0 && (
              <div className="pt-2 border-t border-white/10 space-y-3">
                <h4 className="font-cinzel text-xs uppercase text-gray-400 tracking-wider font-bold">
                  Official Showreel & Media Samples
                </h4>
                <div className="space-y-3">
                  {profile.portfolioUrls.map((url, idx) => {
                    const isVideo = url.includes('.mp4') || url.includes('.webm') || url.startsWith('blob:') || url.startsWith('data:video');
                    if (isVideo) {
                      return (
                        <div key={idx} className="rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-black shadow-lg">
                          <video
                            src={url}
                            controls
                            playsInline
                            className="w-full max-h-[360px] object-contain"
                          />
                          <div className="p-2 bg-[#0E0E14] text-[10px] text-gray-400 flex items-center justify-between">
                            <span className="text-[#D4AF37] font-semibold">Direct MP4 Showreel {idx + 1}</span>
                            <span className="font-mono">High Quality Master</span>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                      >
                        <span>Showreel / Portfolio Asset {idx + 1}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Privacy Protection Notice */}
            <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                Personal contact details and private credentials remain strictly protected. All engagements are routed through verified agency contracts.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
