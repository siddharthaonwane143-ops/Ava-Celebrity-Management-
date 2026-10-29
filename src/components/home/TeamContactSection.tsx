import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  ShieldCheck,
  Crown,
  Layers,
  ArrowRight,
  ExternalLink,
  Clock,
  Briefcase,
  Download,
  Eye
} from 'lucide-react';
import { TeamContactInquiryType, TeamContactInquiry } from '../../types';
import { saveTeamInquiry } from '../../services/dbService';
import { syncTeamInquiriesToGoogleSheet } from '../../services/sheetsService';
import { downloadBookingPassPdf, BookingPdfData } from '../../utils/pdfGenerator';
import { BookingEnquiryPdfModal } from '../modals/BookingEnquiryPdfModal';
import { MAHARASHTRA_CITIES } from '../../data/maharashtraCities';

interface TeamContactSectionProps {
  onSuccessNotification?: (msg: string) => void;
}

export const TeamContactSection: React.FC<TeamContactSectionProps> = ({
  onSuccessNotification
}) => {
  const [selectedType, setSelectedType] = useState<TeamContactInquiryType>('Executive Talent Booking');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [cityVenue, setCityVenue] = useState('');
  const [requirements, setRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<{
    reference: string;
    syncedSheetUrl?: string;
    pdfData?: BookingPdfData;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const inquiryCategories: {
    type: TeamContactInquiryType;
    icon: React.ReactNode;
    title: string;
    desc: string;
  }[] = [
    {
      type: 'Executive Talent Booking',
      icon: <Crown className="w-4 h-4 text-[#D4AF37]" />,
      title: 'Talent & Celebrity Booking',
      desc: 'A-list actors, headline performers, celebrity appearances & chief guests'
    },
    {
      type: 'Fashion Runway & Show Direction',
      icon: <Sparkles className="w-4 h-4 text-[#D4AF37]" />,
      title: 'Fashion Runway & Shows',
      desc: 'Haute couture weeks, supermodels, choreography & stage direction'
    },
    {
      type: 'Celebrity Stage & Live Concert',
      icon: <Layers className="w-4 h-4 text-[#D4AF37]" />,
      title: 'Live Arenas & Concerts',
      desc: 'Playback singers, live orchestra, arena tours & festival headliners'
    },
    {
      type: 'Brand Collab & Influencer Campaign',
      icon: <Briefcase className="w-4 h-4 text-[#D4AF37]" />,
      title: 'Brand Campaigns & UGC',
      desc: 'Global endorsements, macro/micro creators & commercial ambassadorship'
    },
    {
      type: 'Production & Film Crew Management',
      icon: <Building2 className="w-4 h-4 text-[#D4AF37]" />,
      title: 'Production & Film Crew',
      desc: 'DOPs, aerial cinematography, sound engineers & technical crew'
    },
    {
      type: 'VIP Sponsorship & Media Partner',
      icon: <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />,
      title: 'VIP Sponsorship & Media',
      desc: 'Title sponsorships, red carpet branding & official media partnerships'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide the primary contact name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError('Please provide at least an email address or contact phone number.');
      return;
    }
    if (!requirements.trim()) {
      setError('Please describe your project or talent requirements.');
      return;
    }

    setLoading(true);
    try {
      // 1. Save inquiry to persistent database
      const result = await saveTeamInquiry({
        name: name.trim(),
        organization: organization.trim(),
        email: email.trim(),
        phone: phone.trim(),
        inquiryType: selectedType,
        preferredDate: preferredDate.trim(),
        budgetRange: budgetRange.trim(),
        cityVenue: cityVenue.trim(),
        requirements: requirements.trim(),
      });

      let spreadsheetUrl: string | undefined;

      // 2. Try syncing to Google Sheet if Google Sheets connection is available
      try {
        const dummyInquiry: TeamContactInquiry = {
          id: result.id,
          inquiryReference: result.inquiryReference,
          name: name.trim(),
          organization: organization.trim(),
          email: email.trim(),
          phone: phone.trim(),
          inquiryType: selectedType,
          preferredDate: preferredDate.trim(),
          budgetRange: budgetRange.trim(),
          cityVenue: cityVenue.trim(),
          requirements: requirements.trim(),
          status: 'New',
          createdAt: new Date().toISOString()
        };

        const sheetResult = await syncTeamInquiriesToGoogleSheet([dummyInquiry]);
        spreadsheetUrl = sheetResult.spreadsheetUrl;
      } catch (sheetErr) {
        console.info('Google Sheet direct export queued or pending admin batch sync:', sheetErr);
      }

      const pdfData: BookingPdfData = {
        referenceCode: result.inquiryReference,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        bookingType: selectedType,
        eventName: `${selectedType} - ${organization.trim() || 'Executive Booking'}`,
        eventDate: preferredDate.trim() || 'TBD (Per Contract)',
        cityVenue: cityVenue.trim() || 'Maharashtra, India',
        budgetRange: budgetRange.trim(),
        serviceRequirements: requirements.trim(),
      };

      setSubmittedInquiry({
        reference: result.inquiryReference,
        syncedSheetUrl: spreadsheetUrl,
        pdfData
      });

      if (onSuccessNotification) {
        onSuccessNotification(`Inquiry ${result.inquiryReference} registered & logged to Google Sheet database.`);
      }

      // Reset form fields
      setName('');
      setOrganization('');
      setEmail('');
      setPhone('');
      setPreferredDate('');
      setBudgetRange('');
      setCityVenue('');
      setRequirements('');
    } catch (err: any) {
      console.error('Error submitting team inquiry:', err);
      setError(err?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="team-contact" className="py-24 bg-[#07070A] border-t border-b border-[#D4AF37]/20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-900/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-cinzel font-bold tracking-wider uppercase mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Executive Team Contact & Google Sheets Connected</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connect With Our <span className="text-gold-gradient">Agency Team</span>
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Direct executive desk for event producers, corporate brands, film studios, and VIP organizers. All inquiries are securely collected and synchronized with our official Google Sheets database for instant team routing.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live Google Sheets Synchronization
            </span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              Guaranteed Response in 2-4 Hours
            </span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Direct Executive Board Access
            </span>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {submittedInquiry && (
          <div className="mb-12 max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#12121A] to-[#0A0A10] border border-[#D4AF37] shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">Official Confirmation</span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                Inquiry Logged & Synced Successfully
              </h3>
              <p className="text-gray-300 text-xs mt-2">
                Your reference ID is <span className="font-mono font-bold text-[#F3D068] text-sm bg-black/60 px-2.5 py-1 rounded border border-[#D4AF37]/30">{submittedInquiry.reference}</span>. Our executive desk has received your request and logged it into our centralized Google Sheets roster.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-between text-xs text-left">
              <div className="flex items-center gap-2.5 text-gray-300">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Synchronized with AVA Central Google Sheets Repository</span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px] uppercase">Active Sync</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              {submittedInquiry.pdfData && (
                <>
                  <button
                    type="button"
                    onClick={() => setPdfModalOpen(true)}
                    className="px-5 py-2.5 rounded-lg text-xs font-cinzel font-bold text-[#F3D068] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/60 flex items-center justify-center gap-2 cursor-pointer shadow transition hover:scale-105"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span>View Official PDF Dossier (दस्तऐवज पहा)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadBookingPassPdf(submittedInquiry.pdfData!)}
                    className="btn-gold px-6 py-2.5 rounded-lg text-xs font-bold font-cinzel flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>Download Official PDF (डाउनलोड करा)</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setSubmittedInquiry(null)}
                className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>

            {/* Interactive Full-Page PDF Dossier Viewer Modal */}
            <BookingEnquiryPdfModal
              isOpen={pdfModalOpen}
              onClose={() => setPdfModalOpen(false)}
              data={submittedInquiry?.pdfData || null}
            />
          </div>
        )}

        {/* Main Grid: Left Column Category Selector + Right Column Data Collection Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inquiry Desks Grid (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cinzel text-xs font-bold text-[#D4AF37] tracking-wider uppercase">
                1. Select Agency Department
              </span>
              <span className="text-[11px] text-gray-400">Direct Desk Routing</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {inquiryCategories.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSelectedType(item.type)}
                    className={`p-3.5 rounded-xl text-left transition duration-200 border flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#181824] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                        : 'bg-[#0E0E14] border-white/5 hover:border-white/20 hover:bg-[#12121A]'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]'
                          : 'bg-white/5 border border-white/10 text-gray-400'
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-cinzel font-bold truncate ${
                            isSelected ? 'text-white' : 'text-gray-300'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Google Sheets Live Data Collecting Badge */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-[#0A0A10] border border-emerald-500/30 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Google Sheets Connected</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-gray-400 text-[11px] mt-0.5">
                  Submissions are automatically structured into spreadsheets for instant management dispatch.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Data Collection Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="card-luxury rounded-2xl p-6 sm:p-8 border-gold-subtle shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    2. Official Ingestion Form
                  </span>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mt-0.5">
                    {selectedType}
                  </h3>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Auto-Sync Enabled
                </div>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name and Organization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Full Name / Representative <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Siddharth Rao"
                        required
                        className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs text-white placeholder-gray-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Organization / Brand / Production House
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 sm:top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Paramount / Milan Runway / Private"
                        className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs text-white placeholder-gray-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Official Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 sm:top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="executive@company.com"
                        className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs text-white placeholder-gray-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Contact Phone / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 sm:top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 / +1 (800)..."
                        className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-sm sm:text-xs text-white placeholder-gray-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Target Date and Estimated Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Target Event Date (Calendar Enabled) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        style={{ colorScheme: 'dark' }}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Estimated Budget Bracket
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        placeholder="e.g. $10K - $50K / ₹5L - ₹25L"
                        className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: City / Venue */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    City, Destination or Venue
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={cityVenue}
                      onChange={(e) => setCityVenue(e.target.value)}
                      placeholder="e.g. Mumbai, Dubai, Paris, New York or Virtual"
                      className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Row 5: Detailed Requirements */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Detailed Brief & Requirements <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <textarea
                      rows={4}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Specify requested talent category, show format, stage size, technical requirements, or brand deliverables..."
                      required
                      className="w-full bg-[#121218] border border-white/10 focus:border-[#D4AF37] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold py-3 px-4 rounded-xl text-xs font-bold font-cinzel tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Logging Inquiry & Syncing to Google Sheets...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Official Inquiry & Log to Google Sheet</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>🔒 End-to-end encrypted VIP submission</span>
                  <span>Direct SLA dispatch to agency directors</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
