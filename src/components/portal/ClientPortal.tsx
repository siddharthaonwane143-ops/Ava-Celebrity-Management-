import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Booking, EventRegistration, AuditionApplication, TalentApplication, VideoMediaItem } from '../../types';
import {
  getBookings,
  getEventRegistrations,
  getAuditionApplications,
  getTalentApplications,
  updateBooking,
  updateEventRegistration,
} from '../../services/dbService';
import { googleSignIn } from '../../firebase';
import {
  FolderKanban,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  RefreshCw,
  LogOut,
  AlertCircle,
  Video,
  Tv,
  Camera,
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  ShieldCheck,
  Layers,
  Radio,
  Compass,
  Maximize2,
  Eye,
  Film,
  QrCode,
  Ticket,
  Music
} from 'lucide-react';
import {
  downloadBookingEnquiryDossierPdf,
  downloadTalentProfilePdf,
  convertTalentProfileToPdfData,
  BookingPdfData
} from '../../utils/pdfGenerator';
import { BookingEnquiryPdfModal } from '../modals/BookingEnquiryPdfModal';
import { DigitalEntryPass, DigitalEntryPassModal, DigitalPassData } from './DigitalEntryPass';
import { VipMusicAnthemStudio } from '../music/VipMusicAnthemStudio';

interface ClientPortalProps {
  user: User | null;
  onNavigateHome: () => void;
  onOpenBooking: () => void;
  onOpenJoinTalent?: () => void;
  onOpenProfile?: () => void;
  videos?: VideoMediaItem[];
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  user,
  onNavigateHome,
  onOpenBooking,
  onOpenJoinTalent,
  onOpenProfile,
  videos = [],
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'events' | 'passes' | 'auditions' | 'talent' | 'videoCoverage' | 'anthemStudio'>(
    'bookings'
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<EventRegistration[]>([]);
  const [auditions, setAuditions] = useState<AuditionApplication[]>([]);
  const [talentApps, setTalentApps] = useState<TalentApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedPdfData, setSelectedPdfData] = useState<BookingPdfData | null>(null);
  const [selectedPass, setSelectedPass] = useState<DigitalPassData | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // VIP Video Coverage State (Pure direct MP4 feeds, genuine admin uploads only)
  const publishedVideos = videos.filter((v) => v.isPublished !== false);
  const vipVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [vipActiveVideoId, setVipActiveVideoId] = useState<string>('');
  const [vipVideoPlaying, setVipVideoPlaying] = useState<boolean>(true);
  const [vipVideoMuted, setVipVideoMuted] = useState<boolean>(true);
  const [vipSnapshotNotice, setVipSnapshotNotice] = useState<string | null>(null);

  const activeVipCamera = publishedVideos.find((c) => c.id === vipActiveVideoId) || publishedVideos[0] || null;

  const handleCaptureVipSnapshot = () => {
    if (!vipVideoRef.current) return;
    try {
      const video = vipVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 22px "Cinzel", serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.fillText('AVA VIP CLIENT PORTAL • DIRECT 4K EVENT COVERAGE', 36, canvas.height - 36);
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `AVA-VIP-Media-${activeVipCamera?.id || 'frame'}-${Date.now()}.png`;
        a.click();
        setVipSnapshotNotice('📸 4K Press Snapshot downloaded!');
        setTimeout(() => setVipSnapshotNotice(null), 3000);
      }
    } catch (err) {
      console.warn('VIP Snapshot error:', err);
    }
  };

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [bData, evData, audData, talData] = await Promise.all([
        getBookings(user.uid),
        getEventRegistrations(user.uid),
        getAuditionApplications(user.uid),
        getTalentApplications(user.uid),
      ]);
      setBookings(bData);
      setEvents(evData);
      setAuditions(audData);
      setTalentApps(talData);
    } catch (err) {
      console.error('Portal fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const convertEventToPassData = (ev: EventRegistration): DigitalPassData => {
    return {
      passId: ev.registrationReference,
      showTitle: ev.eventTitle,
      category: ev.category,
      attendeeName: ev.fullName || user?.displayName || 'Registered Guest',
      attendeePhone: ev.phone,
      attendeeEmail: ev.email || user?.email || '',
      city: ev.city || 'Maharashtra',
      venue: ev.city ? `${ev.city} Cultural Auditorium & Arena` : 'Bal Gandharva Rang Mandir, Pune',
      eventDate: 'Event Scheduled • Official Slot',
      eventTime: '06:00 PM IST (Gate Opens 05:00 PM)',
      seatZone: 'Contestant & Delegate Enclosure • Row A',
      status: ev.status,
      ticketTier: 'Contestant Pass',
      createdAt: ev.createdAt
    };
  };

  const convertBookingToPassData = (b: Booking): DigitalPassData => {
    return {
      passId: b.bookingReference,
      showTitle: b.talentName ? `${b.talentName} - Live VIP Session` : (b.eventName || 'AVA VIP Session'),
      category: b.bookingType || 'VIP Booking',
      attendeeName: b.customerName || user?.displayName || 'VIP Client',
      attendeePhone: b.customerPhone,
      attendeeEmail: b.customerEmail || user?.email || '',
      city: b.maharashtraCity || 'Mumbai',
      venue: b.cityVenue || 'AVA Private Celebrity Lounge & Arena',
      eventDate: b.eventDate || 'Scheduled Booking Date',
      eventTime: b.eventTime || 'Confirmed Timing (FastTrack Entry)',
      seatZone: 'Exclusive VIP All-Access Enclosure',
      status: b.status,
      ticketTier: 'VIP All-Access',
      createdAt: b.createdAt
    };
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCancelBooking = async (booking: Booking) => {
    if (!window.confirm(`Request cancellation for booking reference ${booking.bookingReference}?`)) {
      return;
    }
    try {
      await updateBooking(booking.id, { status: 'Cancelled' });
      setActionMessage(`Booking ${booking.bookingReference} status updated to Cancelled.`);
      fetchData();
    } catch (err: any) {
      alert(`Error cancelling booking: ${err.message}`);
    }
  };

  const handleWithdrawEvent = async (eventReg: EventRegistration) => {
    if (!window.confirm(`Withdraw registration for ${eventReg.eventTitle}?`)) {
      return;
    }
    try {
      await updateEventRegistration(eventReg.id, { status: 'Withdrawn' });
      setActionMessage(`Registration ${eventReg.registrationReference} withdrawn.`);
      fetchData();
    } catch (err: any) {
      alert(`Error withdrawing: ${err.message}`);
    }
  };

  if (!user) {
    return (
      <div className="py-24 px-4 max-w-xl mx-auto text-center">
        <div className="card-luxury rounded-2xl p-10 border-gold-glow">
          <FolderKanban className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="font-cinzel text-2xl font-bold text-white mb-2">
            Client & Artist Portal
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Please authenticate with your authorized Google Account to securely view your booking inquiries, quotation statuses, audition tapes, and event passes.
          </p>
          <button
            onClick={googleSignIn}
            className="btn-gold px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Approved':
      case 'Selected':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      case 'Quote Prepared':
      case 'Shortlisted':
      case 'Awaiting Customer Response':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'Cancelled':
      case 'Rejected':
      case 'Withdrawn':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/50';
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Profile Header */}
      <div className="card-luxury rounded-2xl p-6 sm:p-8 mb-8 border-gold-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-16 h-16 rounded-full border border-[#D4AF37] object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#200A12] border border-[#D4AF37] flex items-center justify-center text-2xl font-cinzel text-gold-gradient font-bold">
              {user.displayName?.[0] || 'U'}
            </div>
          )}
          <div>
            <span className="text-[10px] font-cinzel text-[#D4AF37] uppercase tracking-widest font-bold">
              Authenticated Client
            </span>
            <h1 className="font-cinzel text-2xl font-bold text-white">
              {user.displayName || 'Authorized User'}
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition"
            title="Refresh records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {onOpenJoinTalent && (
            <button
              onClick={onOpenJoinTalent}
              className="btn-gold px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 transition"
              title="Create new artist profile on AVA roster"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Create Profile (प्रोफाईल बनवा)</span>
            </button>
          )}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#2A101C] to-[#1E1608] hover:brightness-110 text-[#F3D068] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 transition"
              title="Edit personal details, mobile OTP verification & Instagram reach"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Edit & Verify Profile (प्रोफाईल व्हेरिफाय करा)</span>
            </button>
          )}
          <button
            onClick={onOpenBooking}
            className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold uppercase tracking-wider cursor-pointer transition"
          >
            New Booking Request
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-400 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-t-lg text-xs font-cinzel font-bold whitespace-nowrap transition border-b-2 ${
            activeTab === 'bookings'
              ? 'border-[#D4AF37] text-[#F3D068] bg-[#D4AF37]/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          My Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-t-lg text-xs font-cinzel font-bold whitespace-nowrap transition border-b-2 ${
            activeTab === 'events'
              ? 'border-[#D4AF37] text-[#F3D068] bg-[#D4AF37]/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Event Registrations ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('passes')}
          className={`px-4 py-2 rounded-t-lg text-xs font-cinzel font-bold whitespace-nowrap transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'passes'
              ? 'border-[#D4AF37] text-[#F3D068] bg-[#D4AF37]/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Digital Entry Passes ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('auditions')}
          className={`px-4 py-2 rounded-t-lg text-xs font-cinzel font-bold whitespace-nowrap transition border-b-2 ${
            activeTab === 'auditions'
              ? 'border-[#D4AF37] text-[#F3D068] bg-[#D4AF37]/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Audition Applications ({auditions.length})
        </button>
        <button
          onClick={() => setActiveTab('talent')}
          className={`px-4 py-2 rounded-t-lg text-xs font-cinzel font-bold whitespace-nowrap transition border-b-2 ${
            activeTab === 'talent'
              ? 'border-[#D4AF37] text-[#F3D068] bg-[#D4AF37]/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Talent Submissions ({talentApps.length})
        </button>
        <button
          onClick={() => setActiveTab('videoCoverage')}
          className={`px-4 py-2 rounded-t-lg text-xs font-cinzel font-bold whitespace-nowrap transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'videoCoverage'
              ? 'border-[#D4AF37] text-[#F3D068] bg-[#D4AF37]/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>VIP Live Video Coverage</span>
        </button>
        <button
          onClick={() => setActiveTab('anthemStudio')}
          className={`px-4 py-2 rounded-t-lg text-xs font-cinzel font-bold whitespace-nowrap transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'anthemStudio'
              ? 'border-[#D4AF37] text-[#F3D068] bg-[#D4AF37]/10'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>VIP Anthem Studio (Lyria AI)</span>
        </button>
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="card-luxury rounded-xl p-12 text-center border-gold-subtle">
              <FolderKanban className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
              <h3 className="font-cinzel text-base font-bold text-white mb-1">
                No Bookings Recorded
              </h3>
              <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6">
                You currently have no active or archived talent booking enquiries.
              </p>
              <button onClick={onOpenBooking} className="btn-gold px-6 py-2 rounded text-xs font-bold">
                Book Agency Talent
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="card-luxury rounded-xl p-6 border-gold-subtle hover:border-[#D4AF37] transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#D4AF37] block">
                          REF: {b.bookingReference}
                        </span>
                        <h3 className="font-cinzel text-lg font-bold text-white mt-0.5">
                          {b.eventName}
                        </h3>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-300 bg-[#101016] p-3 rounded-lg border border-white/5 mb-4">
                      {b.talentName && (
                        <div>
                          <span className="text-gray-400">Target Artist: </span>
                          <strong className="text-[#D4AF37]">{b.talentName}</strong>
                        </div>
                      )}
                      {b.packageTitle && (
                        <div>
                          <span className="text-gray-400">Package: </span>
                          <strong className="text-white">{b.packageTitle}</strong>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Format: </span>
                        <span>{b.bookingType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Event Date: </span>
                        <span>{b.eventDate} ({b.cityVenue})</span>
                      </div>
                      {b.quotationAmount && (
                        <div className="pt-2 border-t border-white/5 text-emerald-400 font-semibold">
                          Official Quote: {b.quotationAmount}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 text-xs line-clamp-2 mb-4">
                      <strong>Requirements:</strong> {b.serviceRequirements}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const pdfData: BookingPdfData = {
                            referenceCode: b.bookingReference,
                            customerName: b.customerName,
                            customerEmail: b.customerEmail,
                            customerPhone: b.customerPhone,
                            bookingType: b.bookingType,
                            eventName: b.eventName,
                            eventDate: b.eventDate,
                            cityVenue: b.cityVenue,
                            maharashtraCity: b.maharashtraCity,
                            talentName: b.talentName,
                            packageTitle: b.packageTitle,
                            serviceRequirements: b.serviceRequirements,
                            status: b.status,
                            documentType: 'Official Booking Dossier'
                          };
                          setSelectedPdfData(pdfData);
                        }}
                        className="px-2.5 py-1 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#F3D068] text-[11px] font-bold border border-[#D4AF37]/40 flex items-center gap-1 cursor-pointer transition"
                        title="View Official 1-Page PDF Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View PDF Dossier (पहा)</span>
                      </button>

                      <button
                        onClick={() => {
                          const pdfData: BookingPdfData = {
                            referenceCode: b.bookingReference,
                            customerName: b.customerName,
                            customerEmail: b.customerEmail,
                            customerPhone: b.customerPhone,
                            bookingType: b.bookingType,
                            eventName: b.eventName,
                            eventDate: b.eventDate,
                            cityVenue: b.cityVenue,
                            maharashtraCity: b.maharashtraCity,
                            talentName: b.talentName,
                            packageTitle: b.packageTitle,
                            serviceRequirements: b.serviceRequirements,
                            status: b.status,
                            documentType: 'Official Booking Dossier'
                          };
                          downloadBookingEnquiryDossierPdf(pdfData);
                        }}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-semibold border border-white/10 flex items-center gap-1 cursor-pointer transition"
                        title="Download Official PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Download</span>
                      </button>
                    </div>

                    {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                      <button
                        onClick={() => handleCancelBooking(b)}
                        className="text-rose-400 hover:underline text-[11px]"
                      >
                        Request Cancellation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Event Registrations */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="card-luxury rounded-xl p-12 text-center border-gold-subtle">
              <Calendar className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
              <h3 className="font-cinzel text-base font-bold text-white mb-1">
                No Event Registrations
              </h3>
              <p className="text-gray-400 text-xs">
                You have not registered for any upcoming talent showcases or competitions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((ev) => (
                <div key={ev.id} className="card-luxury rounded-xl p-6 border-gold-subtle">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37]">
                        REF: {ev.registrationReference}
                      </span>
                      <h3 className="font-cinzel text-base font-bold text-white mt-0.5">
                        {ev.eventTitle}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(
                        ev.status
                      )}`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mb-3">
                    <strong>Act:</strong> {ev.performanceDetails}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPass(convertEventToPassData(ev));
                        setIsPassModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#200A14] to-[#14121E] hover:from-[#2A101C] hover:to-[#1C182A] text-[#F3D068] border border-[#D4AF37]/50 text-[11px] font-cinzel font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>View Digital QR Pass (पास बघा)</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-[11px]">Category: {ev.category}</span>
                      {ev.status !== 'Withdrawn' && (
                        <button
                          onClick={() => handleWithdrawEvent(ev)}
                          className="text-rose-400 hover:underline text-[11px]"
                        >
                          Withdraw Entry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Digital Entry Passes & QR Codes */}
      {activeTab === 'passes' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1E0D16] via-[#120C18] to-[#0A0A10] border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-cinzel mb-1">
                <QrCode className="w-4 h-4 text-[#D4AF37]" />
                <span>Instant Arena Entry • डिजिटल प्रवेशिका व क्यूआर कोड</span>
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>My Official Digital Entry Passes</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  {events.length} Active
                </span>
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                प्रत्येक बुक केलेल्या शोसाठी युनिक QR कोड पास उपलब्ध आहे. ऑडिटोरियम किंवा स्टेडियमच्या प्रवेशद्वारावर हा QR कोड स्कॅन करून थेट प्रवेश मिळवा.
              </p>
            </div>

            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold font-cinzel transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>+ Register New Show</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="card-luxury rounded-2xl p-8 sm:p-12 text-center border-gold-subtle max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1A1208] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37] shadow-xl">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white mb-1">
                  No Digital Entry Passes Yet
                </h3>
                <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
                  आपण अद्याप कोणत्याही आगामी शो किंवा स्पर्धेसाठी नोंदणी केलेली नाही. शो नोंदणी केल्यानंतर येथे युनिक स्कॅन करण्याजोगा QR कोड पास जनरेट होईल.
                </p>
              </div>

              {/* Sample Ticket Preview Card */}
              <div className="p-4 rounded-xl bg-black/60 border border-dashed border-[#D4AF37]/30 text-left space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                  <span>SAMPLE PASS PREVIEW</span>
                  <span className="text-emerald-400">● LIVE DEMO PASS</span>
                </div>
                <h4 className="font-cinzel text-sm font-bold text-white">
                  Maharashtra Super Idol Arena 2026
                </h4>
                <p className="text-[11px] text-gray-400">
                  Venue: Bal Gandharva Rang Mandir, Pune • Zone: VIP Gold Pass
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">Pass: AVA-EV-SAMPLE-9901</span>
                  <button
                    onClick={() => {
                      setSelectedPass({
                        passId: 'AVA-PASS-PREVIEW-2026',
                        showTitle: 'Maharashtra Superstar Arena Live 2026',
                        category: 'Celebrity Gala & Contest',
                        attendeeName: user?.displayName || 'VIP Delegate Guest',
                        attendeePhone: '+91 98200 12345',
                        attendeeEmail: user?.email || 'guest@avacelebrity.com',
                        city: 'Mumbai',
                        venue: 'Shanmukhananda Chandrasekarendra Saraswathi Auditorium, Mumbai',
                        eventDate: 'Saturday, Nov 28, 2026',
                        eventTime: '06:30 PM IST',
                        seatZone: 'VIP Prime Box • Row A',
                        status: 'Approved',
                        ticketTier: 'VIP All-Access',
                        createdAt: new Date().toISOString()
                      });
                      setIsPassModalOpen(true);
                    }}
                    className="px-3 py-1 rounded bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-[#D4AF37]/30 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Sample Pass</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onNavigateHome}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Explore Upcoming Shows & Register</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="w-full">
                  <DigitalEntryPass pass={convertEventToPassData(ev)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Auditions */}
      {activeTab === 'auditions' && (
        <div className="space-y-4">
          {auditions.length === 0 ? (
            <div className="card-luxury rounded-xl p-12 text-center border-gold-subtle">
              <FileText className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
              <h3 className="font-cinzel text-base font-bold text-white mb-1">
                No Audition Submissions
              </h3>
              <p className="text-gray-400 text-xs">
                You have not submitted any casting reels or self-tapes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditions.map((aud) => (
                <div key={aud.id} className="card-luxury rounded-xl p-6 border-gold-subtle">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37]">
                        REF: {aud.applicationReference}
                      </span>
                      <h3 className="font-cinzel text-base font-bold text-white mt-0.5">
                        {aud.projectTitle}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(
                        aud.status
                      )}`}
                    >
                      {aud.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1 mb-3">
                    <div>
                      <span className="text-gray-400">Reel Submitted: </span>
                      <a
                        href={aud.reelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#D4AF37] hover:underline"
                      >
                        View Audition Reel
                      </a>
                    </div>
                  </div>

                  <div className="text-gray-500 text-[11px] pt-2 border-t border-white/5">
                    Date: {new Date(aud.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Talent Applications */}
      {activeTab === 'talent' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#121218] border border-white/10">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white">Artist Representation & Profiles</h3>
              <p className="text-gray-400 text-xs mt-0.5">Manage your applications and create new artist profiles with full studio features.</p>
            </div>
            {onOpenJoinTalent && (
              <button
                onClick={onOpenJoinTalent}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer hover:scale-105 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>+ Create Profile (नवीन प्रोफाईल बनवा)</span>
              </button>
            )}
          </div>

          {talentApps.length === 0 ? (
            <div className="card-luxury rounded-xl p-12 text-center border-gold-subtle space-y-4">
              <UserCheck className="w-10 h-10 text-[#D4AF37]/50 mx-auto" />
              <h3 className="font-cinzel text-base font-bold text-white">
                No Talent Joining Applications Yet
              </h3>
              <p className="text-gray-400 text-xs max-w-sm mx-auto">
                You have not submitted an artist representation application to join the AVA roster. Create your verified profile with photos, showreels, and bio.
              </p>
              {onOpenJoinTalent && (
                <button
                  onClick={onOpenJoinTalent}
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold inline-flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Create Your Artist Profile (प्रोफाईल तयार करा)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {talentApps.map((tal) => (
                <div key={tal.id} className="card-luxury rounded-xl p-6 border-gold-subtle">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37]">
                        REF: {tal.applicationReference}
                      </span>
                      <h3 className="font-cinzel text-base font-bold text-white mt-0.5">
                        {tal.stageName ? `${tal.stageName} (${tal.fullName})` : tal.fullName}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(
                        tal.status
                      )}`}
                    >
                      {tal.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mb-3">
                    <strong>Discipline:</strong> {tal.category}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-gray-500 text-[11px]">
                      Submitted on {new Date(tal.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        const pdfData = convertTalentProfileToPdfData(
                          {
                            id: tal.id,
                            name: tal.fullName,
                            stageName: tal.stageName || tal.fullName,
                            categorySlug: tal.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            categoryName: tal.category,
                            bio: tal.bio,
                            photoUrl: tal.headshotUrl || tal.portfolioUrl || '',
                            city: tal.city,
                            status: 'published',
                          } as any,
                          tal.applicationReference
                        );
                        downloadTalentProfilePdf(pdfData);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#F3D068] hover:text-black border border-[#D4AF37]/40 text-xs font-cinzel transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title="Download Full Master Portfolio PDF (अधिकृत पोर्टफोलिओ PDF)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Master PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: VIP Live Event Coverage (Zero YouTube Requirement) */}
      {activeTab === 'videoCoverage' && (
        <div className="space-y-6">
          {/* Top Banner Notice */}
          <div className="card-luxury rounded-2xl p-6 border-gold-glow bg-gradient-to-r from-[#1A050D] via-[#0E0C18] to-[#1F1808]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-cinzel text-xs font-bold text-[#F3D068] uppercase tracking-wider">
                    Executive Direct Satellite Feed • Zero YouTube Links
                  </span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  VIP Live Event Coverage & 4K Master Feeds
                </h2>
                <p className="text-gray-300 text-xs mt-1 max-w-2xl">
                  Exclusive uncompressed multi-camera event broadcasts for authorized brand partners, celebrity talent, and media directors. Broadcasts stream directly via encrypted high-speed master CDNs.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Direct Broadcast</span>
                </span>
              </div>
            </div>
          </div>

          {publishedVideos.length === 0 ? (
            <div className="card-luxury rounded-2xl p-10 sm:p-14 text-center border-gold-subtle max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white">
                No Video Media Published Yet
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm font-light">
                Official audition reels, runway recordings, and 4K showreels uploaded by AVA administration will be streamable and downloadable here.
              </p>
              <button
                onClick={onNavigateHome}
                className="btn-gold px-6 py-2 rounded-lg text-xs font-bold font-cinzel uppercase tracking-wider cursor-pointer"
              >
                Return to Home (मुख्य पृष्ठ)
              </button>
            </div>
          ) : (
            <>
              {/* Multi-Camera / Video Switcher Bar */}
              <div className="card-luxury rounded-xl p-3 border-gold-subtle bg-[#0D0D14] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Camera className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-cinzel font-bold text-[#F3D068]">Switch Official Media Reel:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {publishedVideos.map((vid) => {
                    const isSelected = activeVipCamera?.id === vid.id;
                    return (
                      <button
                        key={vid.id}
                        onClick={() => setVipActiveVideoId(vid.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer truncate max-w-[200px] ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                        }`}
                        title={vid.title}
                      >
                        <Video className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{vid.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4K Direct Master Video Viewport */}
              {activeVipCamera && (
                <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-black shadow-2xl relative group">
                  <div className={`relative w-full bg-[#08080E] flex items-center justify-center overflow-hidden ${
                    activeVipCamera.aspectRatio === '9:16' ? 'max-h-[70vh] aspect-[9/16]' : 'aspect-video'
                  }`}>
                    <video
                      key={activeVipCamera.id}
                      ref={vipVideoRef}
                      src={activeVipCamera.videoUrl}
                      autoPlay
                      loop
                      muted={vipVideoMuted}
                      playsInline
                      className="w-full h-full object-contain"
                      onPlay={() => setVipVideoPlaying(true)}
                      onPause={() => setVipVideoPlaying(false)}
                    />

                    {/* Watermark & Camera Badge */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      <div className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-white font-cinzel text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <Tv className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>AVA OFFICIAL MEDIA</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-700/80 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {activeVipCamera.aspectRatio}
                      </span>
                    </div>

                    {/* Top-right Title */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                      <div className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-xs text-[#F3D068] font-mono shadow-lg flex items-center gap-1.5 truncate max-w-xs">
                        <Camera className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{activeVipCamera.title}</span>
                      </div>
                    </div>

                    {/* Center Play/Pause button on hover */}
                    <button
                      onClick={() => {
                        if (!vipVideoRef.current) return;
                        if (vipVideoRef.current.paused) {
                          vipVideoRef.current.play().catch(() => {});
                          setVipVideoPlaying(true);
                        } else {
                          vipVideoRef.current.pause();
                          setVipVideoPlaying(false);
                        }
                      }}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-95 hover:scale-105 cursor-pointer shadow-2xl backdrop-blur-sm"
                    >
                      {vipVideoPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-[#D4AF37] ml-0.5" />}
                    </button>

                    {/* Snapshot Toast */}
                    {vipSnapshotNotice && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-black/95 border border-[#D4AF37] text-[#F3D068] text-xs font-cinzel font-bold shadow-2xl flex items-center gap-2 animate-bounce">
                        <Camera className="w-4 h-4 text-[#D4AF37]" />
                        <span>{vipSnapshotNotice}</span>
                      </div>
                    )}
                  </div>

                  {/* Video Controls Bar */}
                  <div className="p-3 sm:p-4 bg-[#101018] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          if (!vipVideoRef.current) return;
                          if (vipVideoPlaying) {
                            vipVideoRef.current.pause();
                            setVipVideoPlaying(false);
                          } else {
                            vipVideoRef.current.play().catch(() => {});
                            setVipVideoPlaying(true);
                          }
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
                        title={vipVideoPlaying ? 'Pause' : 'Play'}
                      >
                        {vipVideoPlaying ? <Pause className="w-4 h-4 text-[#D4AF37]" /> : <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />}
                      </button>

                      <button
                        onClick={() => {
                          if (!vipVideoRef.current) return;
                          const next = !vipVideoMuted;
                          vipVideoRef.current.muted = next;
                          setVipVideoMuted(next);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition flex items-center gap-1.5 text-xs cursor-pointer"
                      >
                        {vipVideoMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                        <span className="text-[11px] text-gray-300">{vipVideoMuted ? 'Muted' : 'Sound Live'}</span>
                      </button>

                      <button
                        onClick={handleCaptureVipSnapshot}
                        className="p-1.5 px-3 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F3D068] border border-[#D4AF37]/40 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Capture Frame Snapshot</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
                        {activeVipCamera.resolution || activeVipCamera.aspectRatio} • {activeVipCamera.durationFormatted || '01:00'}
                      </span>
                      <button
                        onClick={() => {
                          if (!vipVideoRef.current) return;
                          if (document.fullscreenElement) {
                            document.exitFullscreen().catch(() => {});
                          } else if (vipVideoRef.current.requestFullscreen) {
                            vipVideoRef.current.requestFullscreen().catch(() => {});
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Master Video Downloads from Real Published Media */}
              <div className="card-luxury rounded-2xl p-6 border-gold-subtle space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="font-cinzel text-base font-bold text-white">
                      Official Talent & Media Downloads ({publishedVideos.length} Files)
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Genuine Media Records
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {publishedVideos.map((video) => (
                    <div key={video.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-cinzel font-bold text-white truncate max-w-[160px]">{video.title}</span>
                          <span className="text-[#D4AF37] font-mono text-[10px]">{video.aspectRatio}</span>
                        </div>
                        {video.description ? (
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            {video.description}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-xs mt-1 italic">
                            Category: {video.categoryName}
                          </p>
                        )}
                      </div>
                      <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-2">
                        <span className="text-[10px] text-gray-400">
                          {video.durationFormatted || '01:00'}
                          {video.fileSizeBytes ? ` • ${(video.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : ''}
                        </span>
                        <a
                          href={video.videoUrl}
                          download={video.fileName || `${video.title}.mp4`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 px-2.5 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#F3D068] text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download MP4</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 7: VIP Event & Artist Anthem Studio (Google Lyria) */}
      {activeTab === 'anthemStudio' && (
        <VipMusicAnthemStudio
          initialArtistName={user.displayName || 'AVA VIP Talent'}
          initialEventType="Exclusive AVA Gala & Red Carpet"
          isAdmin={false}
        />
      )}

      {/* Interactive Full-Page PDF Dossier Viewer Modal */}
      <BookingEnquiryPdfModal
        isOpen={Boolean(selectedPdfData)}
        onClose={() => setSelectedPdfData(null)}
        data={selectedPdfData}
      />

      {/* Interactive Digital Entry Pass Modal with Unique QR Code */}
      <DigitalEntryPassModal
        isOpen={isPassModalOpen}
        pass={selectedPass}
        onClose={() => {
          setIsPassModalOpen(false);
          setSelectedPass(null);
        }}
      />
    </div>
  );
};
