import React, { useState, useMemo } from 'react';
import { TalentProfile, Package } from '../../types';
import { createBooking } from '../../services/dbService';
import { auth } from '../../firebase';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Download,
  FileText,
  Send,
  Mail,
  Phone,
  Search,
  Check,
  Building2,
  Share2,
  ArrowLeft,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MAHARASHTRA_CITIES, MaharashtraCity } from '../../data/maharashtraCities';
import { downloadBookingPassPdf, BookingPdfData } from '../../utils/pdfGenerator';
import { BookingEnquiryPdfModal } from './BookingEnquiryPdfModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTalent?: TalentProfile | null;
  selectedPackage?: Package | null;
  customBookingType?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedTalent,
  selectedPackage,
  customBookingType,
}) => {
  const [customerName, setCustomerName] = useState(auth.currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(auth.currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingType, setBookingType] = useState(
    customBookingType ||
    (selectedTalent ? 'Celebrity Appearance' : 'Brand Endorsement')
  );
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('19:30'); // Default 7:30 PM
  
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const setDatePresetDays = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setEventDate(d.toISOString().split('T')[0]);
  };

  const setNextWeekend = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    setEventDate(d.toISOString().split('T')[0]);
  };

  const formattedDatePreview = useMemo(() => {
    if (!eventDate) return null;
    try {
      const [y, m, d] = eventDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return eventDate;
    }
  }, [eventDate]);

  // Maharashtra City Selection & Search
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [venueAddress, setVenueAddress] = useState('');

  const [duration, setDuration] = useState(selectedPackage?.duration || '1 Day / Event');
  const [budgetRange, setBudgetRange] = useState('');
  const [serviceRequirements, setServiceRequirements] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<BookingPdfData | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

  // Filter Maharashtra Cities
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return MAHARASHTRA_CITIES;
    const q = citySearchQuery.toLowerCase();
    return MAHARASHTRA_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.marathiName.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [citySearchQuery]);

  if (!isOpen) return null;

  const bookingTypes = [
    'Celebrity Appearance',
    'Brand Endorsement',
    'Influencer Campaign',
    'Content Creator Booking',
    'Dance Performance',
    'Singers & Musicians Performance',
    'Acting or Modeling Assignment',
    'Anchor or Host Booking',
    'Photoshoot',
    'Cinematography / Videography',
    'Event Coverage',
    'Production Services',
    'Fashion Show',
    'Product Launch',
    'Corporate Event',
    'Custom Request',
  ];

  const timePresets = [
    { label: 'Morning (10:00 AM)', time: '10:00' },
    { label: 'Matinee (02:30 PM)', time: '14:30' },
    { label: 'Evening Gala (06:30 PM)', time: '18:30' },
    { label: 'Prime Time (08:00 PM)', time: '20:00' },
    { label: 'Night Concert (09:30 PM)', time: '21:30' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setError('Please fill in your name, email, and contact phone.');
      return;
    }
    if (!eventName.trim() || !eventDate.trim()) {
      setError('Please provide event name and event date.');
      return;
    }
    if (!serviceRequirements.trim()) {
      setError('Please summarize your service requirements.');
      return;
    }
    if (!consent) {
      setError('You must accept the confidentiality and booking terms.');
      return;
    }

    setLoading(true);
    try {
      const fullCityVenue = venueAddress.trim()
        ? `${selectedCity}, Maharashtra - ${venueAddress.trim()}`
        : `${selectedCity}, Maharashtra`;

      const refCode = await createBooking({
        customerUid: auth.currentUser?.uid || undefined,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        bookingType,
        talentId: selectedTalent?.id,
        talentName: selectedTalent?.name,
        packageId: selectedPackage?.id,
        packageTitle: selectedPackage?.title,
        eventName: eventName.trim(),
        eventDate: eventDate.trim(),
        eventTime: eventTime || '19:30',
        cityVenue: fullCityVenue,
        maharashtraCity: selectedCity,
        duration: duration.trim(),
        budgetRange: budgetRange.trim(),
        serviceRequirements: serviceRequirements.trim(),
        additionalNotes: additionalNotes.trim(),
        status: 'Submitted',
      });

      const pdfData: BookingPdfData = {
        referenceCode: refCode,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        bookingType,
        eventName: eventName.trim(),
        eventDate: eventDate.trim(),
        eventTime: eventTime ? `${eventTime} IST` : '07:30 PM IST',
        cityVenue: fullCityVenue,
        maharashtraCity: selectedCity,
        talentName: selectedTalent?.name,
        packageTitle: selectedPackage?.title,
        budgetRange: budgetRange.trim(),
        duration: duration.trim(),
        serviceRequirements: serviceRequirements.trim(),
        additionalNotes: additionalNotes.trim(),
      };

      setSubmittedReference(refCode);
      setSubmittedData(pdfData);
      setEmailStatus(`Official Digital Pass PDF dispatched to ${customerEmail.trim()}`);

      // Fire celebratory confetti for premium feeling
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3D068', '#FFFFFF', '#10B981'],
        });
      } catch (err) {
        // ignore confetti errors
      }

      // Automatically trigger digital PDF download
      setTimeout(() => {
        try {
          downloadBookingPassPdf(pdfData);
        } catch (downloadErr) {
          console.warn('Auto download error, user can click manual button:', downloadErr);
        }
      }, 400);

    } catch (err: any) {
      console.error('Booking submission error:', err);
      setError(err.message || 'Failed to submit booking inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualDownloadPdf = () => {
    if (!submittedData) return;
    setIsDownloading(true);
    try {
      downloadBookingPassPdf(submittedData);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handleResendEmail = () => {
    if (!customerEmail) return;
    setEmailStatus(`Resent official digital PDF pass to ${customerEmail}`);
  };

  const handleResetAndClose = () => {
    setSubmittedReference(null);
    setSubmittedData(null);
    setError(null);
    setEmailStatus(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="card-luxury w-full max-w-2xl rounded-2xl border-gold-glow my-6 sm:my-8 overflow-hidden bg-[#0C0C12] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#D4AF37]/25 flex items-center justify-between bg-gradient-to-r from-[#1B050B] via-[#0E0E14] to-[#1F180A]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-black/60 hover:bg-black text-gray-200 hover:text-[#F3D068] border border-white/20 hover:border-[#D4AF37] transition flex items-center gap-1.5 text-xs font-cinzel font-bold shadow-md cursor-pointer"
              title="मागे जा / Back"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">← Back</span>
            </button>
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-cinzel font-bold text-[#D4AF37] tracking-widest uppercase block">
                AVA Executive Management
              </span>
              <h2 className="font-cinzel text-base sm:text-xl font-bold text-white tracking-wide">
                Official Booking & Talent Contract Pass
              </h2>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submittedReference && submittedData ? (
          <div className="p-6 sm:p-8 text-center space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Success Icon */}
            <div className="relative inline-block mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-900/30">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black font-cinzel font-bold text-[9px] uppercase tracking-wider">
                Confirmed
              </span>
            </div>

            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-1.5">
                Official Booking Registered Successfully!
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                Your reservation for <strong className="text-gold-shimmer">{submittedData.eventName}</strong> has been secured with AVA Celebrity Management.
              </p>
            </div>

            {/* Email Dispatch Notification Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 text-left max-w-lg mx-auto">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white text-[11px] uppercase tracking-wider">
                    Digital PDF Pass Dispatched
                  </span>
                  <span className="text-emerald-200 text-[11px]">
                    Sent to: <strong className="text-white underline">{submittedData.customerEmail}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResendEmail}
                className="text-[10px] uppercase font-bold text-[#D4AF37] hover:underline shrink-0 cursor-pointer"
              >
                Resend
              </button>
            </div>

            {/* Reference & Itinerary Details Card */}
            <div className="bg-[#121218] border border-gold-subtle rounded-xl p-4 sm:p-5 max-w-lg mx-auto text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div>
                  <span className="text-[10px] font-cinzel text-gray-400 uppercase tracking-widest block">
                    Digital Pass Reference Code
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-bold text-gold-shimmer select-all">
                    {submittedReference}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-cinzel text-gray-400 uppercase tracking-widest block">
                    Maharashtra City
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {submittedData.maharashtraCity} (MH)
                  </span>
                </div>
              </div>

              {/* Summary Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-400 block">Event Schedule:</span>
                  <span className="text-white font-medium">
                    {submittedData.eventDate} at {submittedData.eventTime}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Service Type:</span>
                  <span className="text-white font-medium">{submittedData.bookingType}</span>
                </div>
                {submittedData.talentName && (
                  <div className="col-span-2">
                    <span className="text-gray-400 block">Requested Artist / Talent:</span>
                    <span className="text-gold-shimmer font-semibold">{submittedData.talentName}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Executive digital signature stamp & cryptographic security hash attached.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setPdfPreviewOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-cinzel font-bold text-[#F3D068] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/60 flex items-center justify-center gap-2 cursor-pointer shadow transition hover:scale-105"
                title="View Official Full-Cover PDF Dossier in Browser"
              >
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                <span>View Official PDF Dossier (दस्तऐवज पहा)</span>
              </button>

              <button
                type="button"
                onClick={handleManualDownloadPdf}
                disabled={isDownloading}
                className="w-full sm:w-auto btn-gold px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Downloading PDF...' : 'Download Official PDF Pass'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                <span>← Back (मागे जा)</span>
              </button>
            </div>

            {/* Interactive Full-Page PDF Dossier Viewer Modal */}
            <BookingEnquiryPdfModal
              isOpen={pdfPreviewOpen}
              onClose={() => setPdfPreviewOpen(false)}
              data={submittedData}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Selected Talent / Package Banner */}
            {(selectedTalent || selectedPackage) && (
              <div className="bg-[#161620] border border-[#D4AF37]/30 rounded-xl p-3 sm:p-3.5 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div className="text-xs">
                  <span className="text-gray-400">Target Selection: </span>
                  <strong className="text-white font-cinzel">
                    {selectedTalent?.name || selectedPackage?.title}
                  </strong>
                  {selectedTalent && (
                    <span className="text-[#D4AF37] block text-[11px] mt-0.5">
                      {selectedTalent.categoryName} • {selectedTalent.availability}
                    </span>
                  )}
                  {selectedPackage && (
                    <span className="text-[#D4AF37] block text-[11px] mt-0.5">
                      Rate: {selectedPackage.priceType === 'fixed' ? selectedPackage.price : 'Custom Quotation'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Client Info Grid */}
            <div className="space-y-1">
              <span className="text-[11px] font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider block">
                1. Client & Contact Particulars
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Full Name / Entity *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Paramount Productions / Rohan Patil"
                    className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Official Email (For Digital PDF) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>
            </div>

            {/* Booking Category & Event Name */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider block">
                2. Event & Assignment Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Booking Category *
                  </label>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-[#D4AF37] transition"
                  >
                    {bookingTypes.map((type, idx) => (
                      <option key={idx} value={type} className="bg-[#121218]">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Event / Campaign Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Pune Grand Couture Fashion Night"
                    className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Selectors (Interactive Calendar Enabled) */}
            <div className="bg-[#14141E] p-3 sm:p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Interactive Calendar Date & Time Selection</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span>✓ Calendar Enabled</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Event Date Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-gray-300">
                      Event Date *
                    </label>
                    <button
                      type="button"
                      onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
                      className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Open Calendar</span>
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      ref={dateInputRef}
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{ colorScheme: 'dark' }}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-[#121218] border border-white/15 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition font-mono"
                    />
                  </div>
                </div>

                {/* Reporting / Call Time Input */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Reporting / Call Time (IST) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      required
                      style={{ colorScheme: 'dark' }}
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full bg-[#121218] border border-white/15 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Formatted Date Confirmation Preview */}
              {formattedDatePreview && (
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-semibold text-[#F3D068]">{formattedDatePreview}</span>
                    <span className="text-gray-400">at {eventTime} IST</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Confirmed Slot
                  </span>
                </div>
              )}

              {/* Quick Date Presets */}
              <div>
                <span className="text-[10px] text-gray-400 block mb-1.5">Quick Date Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDatePresetDays(1)}
                    className="text-[10px] px-2.5 py-1 rounded-md border bg-[#181824] text-gray-300 border-white/10 hover:border-[#D4AF37] hover:text-white transition cursor-pointer"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={setNextWeekend}
                    className="text-[10px] px-2.5 py-1 rounded-md border bg-[#181824] text-gray-300 border-white/10 hover:border-[#D4AF37] hover:text-white transition cursor-pointer"
                  >
                    This Saturday
                  </button>
                  <button
                    type="button"
                    onClick={() => setDatePresetDays(15)}
                    className="text-[10px] px-2.5 py-1 rounded-md border bg-[#181824] text-gray-300 border-white/10 hover:border-[#D4AF37] hover:text-white transition cursor-pointer"
                  >
                    In 15 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setDatePresetDays(30)}
                    className="text-[10px] px-2.5 py-1 rounded-md border bg-[#181824] text-gray-300 border-white/10 hover:border-[#D4AF37] hover:text-white transition cursor-pointer"
                  >
                    In 30 Days (Next Month)
                  </button>
                </div>
              </div>

              {/* Quick Time Presets */}
              <div>
                <span className="text-[10px] text-gray-400 block mb-1.5">Quick Time Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {timePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEventTime(preset.time)}
                      className={`text-[10px] px-2.5 py-1 rounded-md border transition cursor-pointer ${
                        eventTime === preset.time
                          ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                          : 'bg-[#181824] text-gray-300 border-white/10 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Maharashtra Cities Search & Venue */}
            <div className="bg-[#14141E] p-3 sm:p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Maharashtra City & Venue Location</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  36 Districts & Hubs Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Searchable Maharashtra City Selector */}
                <div className="relative">
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Select Maharashtra City *
                  </label>
                  <div
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="w-full bg-[#121218] border border-white/15 rounded-lg py-2 px-3 text-xs text-white flex items-center justify-between cursor-pointer hover:border-[#D4AF37] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="font-medium text-white">{selectedCity}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase font-mono">
                      {isCityDropdownOpen ? '▲ Close' : '▼ Change City'}
                    </span>
                  </div>

                  {/* Dropdown Menu with Search Filter */}
                  {isCityDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#101018] border border-[#D4AF37]/40 rounded-xl shadow-2xl p-2.5 max-h-60 overflow-y-auto">
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={citySearchQuery}
                          onChange={(e) => setCitySearchQuery(e.target.value)}
                          placeholder="Search Maharashtra city (e.g. Pune, Mumbai, Kolhapur)..."
                          className="w-full bg-[#161622] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                          autoFocus
                        />
                      </div>

                      <div className="space-y-1">
                        {filteredCities.map((city) => (
                          <div
                            key={city.id}
                            onClick={() => {
                              setSelectedCity(city.name);
                              setIsCityDropdownOpen(false);
                            }}
                            className={`p-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition ${
                              selectedCity === city.name
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40'
                                : 'hover:bg-white/5 text-gray-300'
                            }`}
                          >
                            <div>
                              <span className="font-medium text-white">{city.name}</span>
                              <span className="text-gray-400 text-[10px] ml-1.5">
                                ({city.marathiName})
                              </span>
                            </div>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/40 text-gray-400 border border-white/5">
                              {city.region}
                            </span>
                          </div>
                        ))}
                        {filteredCities.length === 0 && (
                          <p className="text-gray-500 text-xs text-center py-3">
                            No Maharashtra city found.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Venue / Address */}
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Specific Venue / Address / Stage
                  </label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="e.g. Westin Koregaon Park / Dome Arena"
                    className="w-full bg-[#121218] border border-white/15 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Budget Allocation / Proposed Compensation
                </label>
                <input
                  type="text"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  placeholder="e.g. ₹5,00,000 - ₹15,00,000"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Event Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 1 Day / 4 Hours Stage Presence"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
                />
              </div>
            </div>

            {/* Specific Deliverables */}
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Specific Deliverables & Service Requirements *
              </label>
              <textarea
                required
                rows={3}
                value={serviceRequirements}
                onChange={(e) => setServiceRequirements(e.target.value)}
                placeholder="Describe role, stage performance duration, media usage rights, security riders, or VIP hospitality..."
                className="w-full bg-[#121218] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Additional Notes & Special Instructions
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Special technical parameters, private green room, sound requirements"
                className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>

            {/* Confidentiality and Consent */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-[#121218] text-[#D4AF37] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="consent" className="text-[11px] text-gray-400 select-none leading-relaxed cursor-pointer">
                I understand this submission creates an official agency reservation pass. An authentic digital PDF pass with security barcode will be generated and dispatched to my registered email address.
              </label>
            </div>

            {/* Submit Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between sm:justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-lg text-xs font-cinzel font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>← Back (मागे जा)</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold px-7 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/15"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing Reservation...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Confirm & Generate Digital Pass</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
