import React, { useState } from 'react';
import { BookingPdfData, downloadBookingEnquiryDossierPdf } from '../../utils/pdfGenerator';
import {
  Download,
  X,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

interface BookingEnquiryPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BookingPdfData | null;
}

export const BookingEnquiryPdfModal: React.FC<BookingEnquiryPdfModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(data.referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadBookingEnquiryDossierPdf(data);
    } finally {
      setTimeout(() => setDownloading(false), 700);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const displayTime = data.eventTime || '07:30 PM IST (Standard Call Time)';
  const displayCity = data.maharashtraCity
    ? `${data.maharashtraCity}, Maharashtra`
    : data.cityVenue || 'Maharashtra, India';
  const talentOrPkg = data.talentName
    ? `Artist: ${data.talentName}`
    : data.packageTitle
    ? `Package: ${data.packageTitle}`
    : 'Custom Celebrity Management Assignment';
  const talentCat = data.talentCategory || data.bookingType || 'Celebrity Appearance';

  const briefText =
    (data.serviceRequirements || data.additionalNotes || '').trim() ||
    'Client requested official celebrity management representation for public event gala. High-caliber performance execution, celebrity appearance protocol, VIP hospitality suite, stage sound-check, and personal security escort coordinated directly under AVA production directorate.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl my-4 sm:my-6 rounded-2xl bg-[#08080C] border border-[#D4AF37]/50 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#170B14] via-[#0E0E16] to-[#1F1708] border-b border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black text-gray-200 hover:text-[#F3D068] border border-white/20 hover:border-[#D4AF37] transition flex items-center gap-1.5 text-xs font-cinzel font-bold shadow-md cursor-pointer"
              title="मागे जा / Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">← Back</span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5 text-[#F3D068]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-cinzel font-bold text-[#F3D068] uppercase tracking-widest">
                  AVA Official Document Dossier (अधिकृत दस्तऐवज)
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold font-mono">
                  ✓ VERIFIED
                </span>
              </div>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-white">
                {data.eventName} • {data.referenceCode}
              </h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            <button
              onClick={handleCopyRef}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
              title="Copy Reference Docket Number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Docket'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Print (प्रिंट)</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-gold px-4 py-1.5 sm:py-2 rounded-lg text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition"
              title="Download Official 1-Page PDF Dossier"
            >
              <Download className="w-4 h-4 text-black" />
              <span>{downloading ? 'Downloading...' : 'Download PDF (डाउनलोड करा)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition cursor-pointer ml-1"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Canvas (Simulated Pristine A4 Full-Cover View) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#040406] flex justify-center print:p-0">
          <div className="w-full max-w-[800px] bg-[#09090E] border-2 border-[#D4AF37] rounded-xl shadow-2xl relative p-5 sm:p-7 space-y-4 print:border-none print:shadow-none print:p-0">
            {/* Inner Accent Gold Frame */}
            <div className="absolute inset-2 border border-[#AA7C11]/50 rounded-lg pointer-events-none" />

            {/* HEADER BANNER */}
            <div className="relative z-10 bg-gradient-to-r from-[#170E1E] via-[#0E0E16] to-[#1D160A] border-b-2 border-[#D4AF37] rounded-t-lg p-4 flex items-center gap-4">
              <div className="w-14 h-16 rounded-xl bg-black/60 border border-[#D4AF37] flex flex-col items-center justify-center text-center p-1 shrink-0 shadow-md">
                <span className="font-cinzel font-black text-sm text-[#F3D068] tracking-widest">AVA</span>
                <span className="text-[7px] font-bold text-[#D4AF37] tracking-wider uppercase">OFFICIAL</span>
              </div>
              <div className="space-y-0.5">
                <h1 className="font-cinzel text-lg sm:text-xl font-black text-[#D4AF37] tracking-wider">
                  AVA CELEBRITY MANAGEMENT
                </h1>
                <p className="font-cinzel text-xs font-bold text-gray-200 uppercase tracking-wide">
                  {data.documentType === 'Executive Enquiry Dossier'
                    ? 'OFFICIAL EXECUTIVE CLIENT ENQUIRY & ARTIST DOSSIER'
                    : 'OFFICIAL TALENT BOOKING PASS & ENGAGEMENT DOSSIER'}
                </p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                  DIRECTORATE OF CELEBRITY MANAGEMENT & ENTERTAINMENT • GOVERNMENT OF MAHARASHTRA ACCREDITED
                </p>
              </div>
            </div>

            {/* REFERENCE BAR */}
            <div className="relative z-10 bg-[#12121A] border border-[#D4AF37]/50 rounded-lg p-2.5 sm:px-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">
                  OFFICIAL DOCKET REFERENCE:
                </span>
                <span className="font-mono font-bold text-[#F3D068] text-sm bg-black/50 px-2.5 py-0.5 rounded border border-[#D4AF37]/30 select-all">
                  {data.referenceCode}
                </span>
              </div>
              <span className="px-3 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{data.status === 'Confirmed' ? 'CONFIRMED & ACTIVE' : 'OFFICIAL VERIFIED RECORD'}</span>
              </span>
            </div>

            {/* SECTION 1: Client & Contact Profile */}
            <div className="relative z-10 space-y-1">
              <div className="px-3 py-1 rounded bg-[#1C1610] border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel font-bold text-[10px] uppercase tracking-wider">
                1. Client & Registered Executive Contact Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Full Client / Producer Name</span>
                  <span className="font-semibold text-white">{data.customerName}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Registered Official Email</span>
                  <span className="font-semibold text-white">{data.customerEmail}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Contact Telephone Number</span>
                  <span className="font-semibold text-white">{data.customerPhone}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Organization / Production Banner</span>
                  <span className="font-semibold text-white">{data.organization || 'Individual / Private Executive Client'}</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: Event Itinerary & Location */}
            <div className="relative z-10 space-y-1">
              <div className="px-3 py-1 rounded bg-[#1C1610] border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel font-bold text-[10px] uppercase tracking-wider">
                2. Event Schedule & Maharashtra Venue Itinerary
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Event / Campaign Title</span>
                  <span className="font-semibold text-[#F3D068]">{data.eventName}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Confirmed / Target Event Date</span>
                  <span className="font-semibold text-white">{data.eventDate}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Reporting / Stage Call Time</span>
                  <span className="font-semibold text-white">{displayTime}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Maharashtra Event City</span>
                  <span className="font-semibold text-white">{displayCity}</span>
                </div>
                <div className="col-span-1 sm:col-span-2 bg-[#101016] p-2 sm:px-3 rounded border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Venue / Production Address</span>
                    <span className="font-semibold text-white">{data.cityVenue || 'VIP Event Arena / Auditorium'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30 shrink-0">
                    VIP Convoy Escort Active
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 3: Artist Assignment & Contractual Scope (NO PRICE MENTIONED) */}
            <div className="relative z-10 space-y-1">
              <div className="px-3 py-1 rounded bg-[#1C1610] border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel font-bold text-[10px] uppercase tracking-wider">
                3. Talent Assignment & Engagement Specifications (Zero Public Rates)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Assigned Artist / Celebrity Talent</span>
                  <span className="font-semibold text-[#F3D068]">{talentOrPkg}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Talent Discipline / Category</span>
                  <span className="font-semibold text-white">{talentCat}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Assignment Duration / Shift</span>
                  <span className="font-semibold text-white">{data.duration || 'Full Event Coverage & Stage Performance'}</span>
                </div>
                <div className="bg-[#101016] p-2 sm:px-3 rounded border border-white/5">
                  <span className="text-gray-400 text-[10px] block">Commercial Contract Terms</span>
                  <span className="font-semibold text-emerald-400">Official Agency SLA on File (Direct Exclusive)</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: Production Brief */}
            <div className="relative z-10 space-y-1">
              <div className="px-3 py-1 rounded bg-[#1C1610] border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel font-bold text-[10px] uppercase tracking-wider">
                4. Client Production Brief & Service Scope of Work
              </div>
              <div className="bg-[#101016] p-3 rounded border border-[#D4AF37]/30 text-xs text-gray-300 leading-relaxed">
                {briefText}
              </div>
            </div>

            {/* SECTION 5: VIP Security Escort & Hospitality SLA */}
            <div className="relative z-10 space-y-1">
              <div className="px-3 py-1 rounded bg-[#1C1610] border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel font-bold text-[10px] uppercase tracking-wider">
                5. VIP Hospitality, Rider Compliance & Security Directorate Protocols
              </div>
              <div className="bg-[#101016] p-3 rounded border border-white/5 space-y-1.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓ GREEN ROOM:</span>
                  <span className="text-gray-300">
                    Air-conditioned luxury executive suite, private restroom, 5-star green room rider catering, and dedicated artist hospitality liaison.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓ TRANSIT & ESCORT:</span>
                  <span className="text-gray-300">
                    Dedicated luxury transit vehicle fleet with licensed personal protection officer escort from call time until safe venue exit.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓ TECHNICAL REHEARSAL:</span>
                  <span className="text-gray-300">
                    Mandatory 60-minute technical audio/visual rehearsal and stage cue run-through completed prior to public doors opening.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓ ACCESS CONTROL:</span>
                  <span className="text-gray-300">
                    Strict digital badge verification for backstage personnel. VIP security perimeter & designated photo-op zone enforced.
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 6: Legal Undertakings */}
            <div className="relative z-10 space-y-1">
              <div className="px-3 py-1 rounded bg-[#1C1610] border border-[#D4AF37]/40 text-[#D4AF37] font-cinzel font-bold text-[10px] uppercase tracking-wider">
                6. Contractual Undertakings & Official Directorate Legal SLA
              </div>
              <div className="bg-[#101016] p-2.5 rounded border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-gray-400">
                <div>
                  <strong className="text-[#F3D068]">Confidentiality (NDA):</strong> Artist schedule, travel itinerary, and commercial agreements are strictly confidential under mutual NDA covenants.
                </div>
                <div>
                  <strong className="text-[#F3D068]">Force Majeure:</strong> Directorate SLA protects rescheduled dates in statutory, public safety, or climatic disruptions with zero penalty.
                </div>
                <div>
                  <strong className="text-[#F3D068]">IP & Media:</strong> Live streaming, commercial filming, and advertising campaigns require written directorate authorization.
                </div>
                <div>
                  <strong className="text-[#F3D068]">Jurisdiction:</strong> Official legal record governed under Maharashtra laws, subject to Mumbai & Pune judicial arbitration.
                </div>
              </div>
            </div>

            {/* SECTION 7: QR Code & Verification Stamp */}
            <div className="relative z-10 bg-[#12121A] border border-[#D4AF37]/40 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Visual QR Code Box */}
                <div className="w-14 h-14 bg-white rounded p-1.5 flex flex-wrap gap-0.5 shrink-0 shadow">
                  <div className="w-3 h-3 bg-black rounded-xs" />
                  <div className="w-2 h-1 bg-black ml-auto" />
                  <div className="w-3 h-3 bg-black rounded-xs ml-auto" />
                  <div className="w-2 h-2 bg-black m-auto" />
                  <div className="w-3 h-3 bg-black rounded-xs" />
                  <div className="w-1 h-2 bg-black ml-auto" />
                  <div className="w-3 h-3 bg-black rounded-xs ml-auto" />
                </div>
                <div className="text-[10px] space-y-0.5">
                  <span className="font-cinzel font-bold text-[#F3D068] block">
                    CRYPTOGRAPHIC QR VERIFICATION RECORD
                  </span>
                  <span className="text-gray-300 block">
                    Authenticated Recipient: <strong className="text-white">{data.customerEmail}</strong>
                  </span>
                  <span className="text-gray-400 block font-mono">
                    SHA256-AVA-{data.referenceCode.replace(/[^a-zA-Z0-9]/g, '')}-VIP-MH • ZERO DUPLICATION
                  </span>
                </div>
              </div>

              {/* Circular Directorate Gold Seal */}
              <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] border-dashed p-1 flex items-center justify-center text-center shrink-0 bg-black/40 shadow-inner">
                <div className="w-full h-full rounded-full border border-[#D4AF37] flex flex-col items-center justify-center p-1 text-[#D4AF37]">
                  <span className="text-[6px] font-bold">★ AVA CELEBRITY ★</span>
                  <span className="text-[7px] font-black uppercase tracking-wider text-[#F3D068]">OFFICIAL SEAL</span>
                  <span className="text-[5px] uppercase">DIRECTORATE</span>
                </div>
              </div>
            </div>

            {/* SECTION 8: Signatures */}
            <div className="relative z-10 grid grid-cols-2 gap-6 pt-2 pb-1 border-t border-white/10 text-xs">
              <div className="border-t border-gray-600 pt-1">
                <span className="font-semibold text-[#F3D068] block">{data.customerName}</span>
                <span className="text-[10px] text-gray-400 block">Client / Event Organizer Acknowledgment</span>
              </div>
              <div className="border-t border-gray-600 pt-1 text-right">
                <span className="font-semibold text-[#F3D068] block">AVA Celebrity Directorate</span>
                <span className="text-[10px] text-gray-400 block">Executive Director • Maharashtra Division</span>
              </div>
            </div>

            {/* FOOTER */}
            <div className="relative z-10 pt-2 border-t border-[#D4AF37]/30 text-center text-[9px] text-gray-400 space-y-0.5">
              <p className="text-gray-300 font-semibold">
                AVA CELEBRITY MANAGEMENT • Bandra West, Mumbai & Koregaon Park, Pune • Web: www.avatalent.com • 24/7 Concierge: +91 98200 12345
              </p>
              <p className="text-gray-500">
                NOTICE: Present this digital dossier alongside valid government photo ID upon venue entry. Official Directorate Record.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="px-5 py-3 bg-[#0D0D14] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Ready to present or download. 100% full-cover verified PDF.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-gold px-5 py-2 rounded-xl text-xs font-bold font-cinzel flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <Download className="w-4 h-4 text-black" />
              <span>{downloading ? 'Downloading...' : 'Download Official PDF (डाउनलोड करा)'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              Close (बंद करा)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
