import React, { useState, useMemo } from 'react';
import { TalentShow } from '../../types';
import { registerForEvent } from '../../services/dbService';
import { auth } from '../../firebase';
import {
  X,
  CheckCircle2,
  Trophy,
  AlertCircle,
  Download,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Search,
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowLeft,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MAHARASHTRA_CITIES } from '../../data/maharashtraCities';
import { downloadBookingPassPdf, BookingPdfData } from '../../utils/pdfGenerator';
import { DigitalEntryPassModal, DigitalPassData } from '../portal/DigitalEntryPass';

interface EventRegistrationModalProps {
  show: TalentShow | null;
  onClose: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  show,
  onClose,
}) => {
  const [fullName, setFullName] = useState(auth.currentUser?.displayName || '');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [selectedCity, setSelectedCity] = useState(show?.city || 'Mumbai');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [preferredSlot, setPreferredSlot] = useState('11:00 AM Call Time');
  const [performanceDetails, setPerformanceDetails] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<BookingPdfData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

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

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !performanceDetails.trim()) {
      setError('Please fill in your name, email, phone, and performance act details.');
      return;
    }

    setLoading(true);
    try {
      const ref = await registerForEvent({
        eventId: show.id,
        eventTitle: show.title,
        participantUid: auth.currentUser?.uid || undefined,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        age: age.trim() || undefined,
        city: selectedCity,
        category: show.category,
        performanceDetails: performanceDetails.trim(),
        portfolioLink: portfolioLink.trim() || undefined,
        status: 'Pending',
      });

      const pdfData: BookingPdfData = {
        referenceCode: ref,
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        bookingType: `Contestant Entry: ${show.category}`,
        eventName: show.title,
        eventDate: show.eventDate,
        eventTime: preferredSlot,
        cityVenue: `${selectedCity}, Maharashtra - ${show.venue || 'Main Stage'}`,
        maharashtraCity: selectedCity,
        talentName: show.title,
        budgetRange: show.feeType === 'Free' ? 'Complimentary Candidate Pass' : (show.feeAmount || 'Entry Fee Paid'),
        duration: 'Official Arena Showcase',
        serviceRequirements: `Performance Brief: ${performanceDetails.trim()}`,
        additionalNotes: portfolioLink ? `Portfolio Reel: ${portfolioLink.trim()}` : undefined,
      };

      setSubmittedRef(ref);
      setSubmittedData(pdfData);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#10B981', '#FFFFFF'],
        });
      } catch (err) {
        // ignore
      }

      setTimeout(() => {
        try {
          downloadBookingPassPdf(pdfData);
        } catch (downloadErr) {
          console.warn('Auto download error:', downloadErr);
        }
      }, 400);

    } catch (err: any) {
      console.error('Event registration error:', err);
      setError(err.message || 'Failed to submit registration. Please try again.');
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

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    setSubmittedData(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="card-luxury w-full max-w-xl rounded-2xl border-gold-glow my-6 sm:my-8 overflow-hidden bg-[#0C0C12] shadow-2xl">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-gradient-to-r from-[#1B050B] via-[#0E0E14] to-[#1F180A]">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-black/60 hover:bg-black text-gray-200 hover:text-[#F3D068] border border-white/20 hover:border-[#D4AF37] transition flex items-center gap-1.5 text-xs font-cinzel font-bold shadow-md cursor-pointer"
              title="मागे जा / Back"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">← Back</span>
            </button>
            <Trophy className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <span className="text-[10px] font-cinzel font-bold text-[#D4AF37] tracking-widest uppercase block">
                Official Contestant Entry
              </span>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-white">
                Talent Show & Arena Registration
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

        {submittedRef && submittedData ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-1.5">
                Participant Entry Confirmed!
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Your entry for <strong className="text-gold-shimmer">{show.title}</strong> has been officially approved.
              </p>
            </div>

            {/* Email dispatch notice */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2 text-center max-w-md mx-auto">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Official Contestant Pass PDF dispatched to: <strong className="text-white underline">{submittedData.customerEmail}</strong>
              </span>
            </div>

            <div className="bg-[#121218] border border-gold-subtle rounded-xl p-4 max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-cinzel text-gray-400 uppercase tracking-widest">
                  Participant Registration ID
                </span>
                <span className="text-xs text-white font-semibold">
                  {submittedData.maharashtraCity} (MH)
                </span>
              </div>
              <span className="text-lg font-mono font-bold text-gold-shimmer select-all block">
                {submittedRef}
              </span>
              <p className="text-[11px] text-gray-400">
                Event Date: {submittedData.eventDate} • Slot: {submittedData.eventTime}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowPassModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-black shadow-lg hover:brightness-110 transition"
              >
                <QrCode className="w-4 h-4 text-black" />
                <span>View Digital QR Pass (पास बघा)</span>
              </button>

              <button
                type="button"
                onClick={handleManualDownloadPdf}
                disabled={isDownloading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer bg-white/10 hover:bg-white/15 text-white border border-white/20 transition"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Downloading...' : 'Download PDF Pass'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                <span>← Back to Shows</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Show Banner Info */}
            <div className="bg-[#161622] p-3 rounded-xl border border-[#D4AF37]/30 flex items-start gap-3">
              <Trophy className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-white font-cinzel block text-sm">{show.title}</strong>
                <span className="text-gray-400 block mt-0.5">
                  Category: {show.category} • Date: {show.eventDate} • Venue: {show.venue || 'Official Arena'}
                </span>
                <span className="text-[#D4AF37] block mt-0.5">
                  Fee: {show.feeType === 'Free' ? 'Complimentary Entry' : show.feeAmount || 'Paid Entry'}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Participant Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Participant Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 24"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Email Address (For PDF Pass) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="participant@email.com"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Maharashtra City Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Maharashtra City / District *
                </label>
                <div
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white flex items-center justify-between cursor-pointer hover:border-[#D4AF37]"
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedCity}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">▼</span>
                </div>

                {isCityDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#101018] border border-[#D4AF37]/40 rounded-xl shadow-2xl p-2 max-h-52 overflow-y-auto">
                    <input
                      type="text"
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      placeholder="Search Maharashtra city..."
                      className="w-full bg-[#161622] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 mb-2 focus:outline-none focus:border-[#D4AF37]"
                      autoFocus
                    />
                    <div className="space-y-1">
                      {filteredCities.map((city) => (
                        <div
                          key={city.id}
                          onClick={() => {
                            setSelectedCity(city.name);
                            setIsCityDropdownOpen(false);
                          }}
                          className="p-1.5 rounded text-xs hover:bg-white/5 text-gray-300 cursor-pointer flex items-center justify-between"
                        >
                          <span>{city.name} ({city.marathiName})</span>
                          <span className="text-[9px] text-gray-500">{city.region}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Reporting Slot Preference
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="10:00 AM Call Time">10:00 AM (Morning Slot)</option>
                  <option value="02:30 PM Call Time">02:30 PM (Afternoon Slot)</option>
                  <option value="06:30 PM Call Time">06:30 PM (Evening Prime)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Performance / Act Overview *
              </label>
              <textarea
                required
                rows={3}
                value={performanceDetails}
                onChange={(e) => setPerformanceDetails(e.target.value)}
                placeholder="Describe your planned showcase, track choice, dance style, or vocal act..."
                className="w-full bg-[#121218] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Portfolio / Audition Tape URL
              </label>
              <input
                type="url"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                placeholder="Google Drive, YouTube, or Instagram portfolio link"
                className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

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
                className="btn-gold px-7 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                {loading ? 'Submitting...' : 'Register & Generate PDF Pass'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Digital Entry Pass Modal */}
      {submittedRef && submittedData && (
        <DigitalEntryPassModal
          isOpen={showPassModal}
          onClose={() => setShowPassModal(false)}
          pass={{
            passId: submittedRef,
            showTitle: show.title,
            category: show.category,
            attendeeName: fullName || auth.currentUser?.displayName || 'Registered Contestant',
            attendeePhone: phone,
            attendeeEmail: email,
            city: selectedCity,
            venue: show.venue || (selectedCity ? `${selectedCity} Cultural Stage Arena` : 'Bal Gandharva Rang Mandir, Pune'),
            eventDate: submittedData.eventDate || show.eventDate || 'Confirmed Event Date',
            eventTime: submittedData.eventTime || '06:00 PM IST',
            seatZone: 'Contestant & VIP Enclosure • Zone A',
            status: 'Approved',
            ticketTier: 'Contestant Pass',
            createdAt: new Date().toISOString()
          }}
        />
      )}
    </div>
  );
};
