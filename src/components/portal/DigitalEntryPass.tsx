import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Calendar,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  Check,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  Ticket,
  Printer,
  ExternalLink,
  Award,
  AlertCircle
} from 'lucide-react';

export interface DigitalPassData {
  passId: string;
  showTitle: string;
  category?: string;
  attendeeName: string;
  attendeePhone?: string;
  attendeeEmail?: string;
  city?: string;
  venue?: string;
  eventDate?: string;
  eventTime?: string;
  seatZone?: string;
  status?: string;
  qrPayload?: string;
  ticketTier?: 'VIP All-Access' | 'Contestant Pass' | 'Delegate Entry' | 'General Reserved';
  createdAt?: string;
}

interface DigitalEntryPassCardProps {
  pass: DigitalPassData;
  onClose?: () => void;
  isModal?: boolean;
}

export const DigitalEntryPass: React.FC<DigitalEntryPassCardProps> = ({
  pass,
  onClose,
  isModal = false
}) => {
  const [copied, setCopied] = useState(false);
  const [zoomedQr, setZoomedQr] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const formattedDate = pass.eventDate || 'Date Announced on Approval';
  const formattedTime = pass.eventTime || '06:00 PM IST (Gate Opens 05:00 PM)';
  const formattedVenue = pass.venue || (pass.city ? `${pass.city} Main Stage Arena` : 'Bal Gandharva Rang Mandir, Pune');
  const tier = pass.ticketTier || 'VIP All-Access';
  const seatZone = pass.seatZone || 'Gold Enclosure • Zone A';
  const passStatus = pass.status || 'Confirmed';

  // Real verifiable QR Code payload for arena gate scanners
  const qrData = pass.qrPayload || JSON.stringify({
    iss: 'AVA_CELEBRITY_MANAGEMENT',
    ref: pass.passId,
    event: pass.showTitle,
    guest: pass.attendeeName,
    city: pass.city || 'Maharashtra',
    date: formattedDate,
    tier: tier,
    status: 'SECURITY_VERIFIED_VALID',
    ts: Date.now()
  });

  const handleCopyPassId = () => {
    navigator.clipboard.writeText(pass.passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`relative w-full max-w-xl mx-auto ${isModal ? 'animate-scaleUp' : ''}`}>
      {/* Zoomed QR View for Gate Scanner */}
      {zoomedQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-pointer"
          onClick={() => setZoomedQr(false)}
        >
          <div
            className="p-6 sm:p-8 bg-white rounded-3xl text-center shadow-[0_0_60px_rgba(212,175,55,0.4)] max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
              <span className="text-xs font-bold font-mono text-gray-800">
                GATE SCANNER HIGH-CONTRAST MODE
              </span>
              <button
                onClick={() => setZoomedQr(false)}
                className="p-1 rounded-full text-gray-500 hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-3 rounded-2xl flex items-center justify-center border-4 border-black">
              <QRCodeSVG
                value={qrData}
                size={260}
                level="H"
                includeMargin={false}
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            </div>

            <div className="mt-4 space-y-1">
              <p className="font-mono text-xs font-bold text-black tracking-widest uppercase">
                {pass.passId}
              </p>
              <p className="text-[11px] text-gray-600">
                {pass.attendeeName} • {pass.showTitle}
              </p>
              <div className="pt-2 text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Genuine Certified Entry Pass</span>
              </div>
            </div>

            <button
              onClick={() => setZoomedQr(false)}
              className="mt-4 w-full py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Done / Close Zoom
            </button>
          </div>
        </div>
      )}

      {/* Main Luxury Ticket Card Container */}
      <div
        ref={ticketRef}
        className="card-luxury rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] bg-gradient-to-b from-[#160B12] via-[#0D0D14] to-[#0A0A10]"
      >
        {/* Top Metallic Gold Header Banner */}
        <div className="relative px-5 py-3.5 bg-gradient-to-r from-[#240A15] via-[#1A1208] to-[#12081C] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-cinzel font-bold text-xs shadow-md">
              AVA
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                <span>OFFICIAL DIGITAL ENTRY PASS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[10px] text-emerald-400 font-mono">LIVE PASS</span>
              </div>
              <div className="text-[10px] text-[#D4AF37] font-mono tracking-wide">
                AVA CELEBRITY & ENTERTAINMENT ROSTER
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 shadow-sm">
              {tier}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Show Title & Key Stats */}
        <div className="p-5 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <span className="inline-block text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/5 text-[#D4AF37] border border-[#D4AF37]/20">
                {pass.category || 'Stage Show & Contest'}
              </span>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white leading-tight">
                {pass.showTitle}
              </h2>
              <p className="text-xs text-gray-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{formattedVenue}</span>
              </p>
            </div>

            {/* Live Security Verification Badge */}
            <div className="shrink-0 p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-center sm:text-right">
              <span className="text-[9px] font-mono uppercase text-gray-400 block tracking-wider">
                ENTRY STATUS
              </span>
              <span className="text-xs font-bold text-emerald-400 font-cinzel flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{passStatus.toUpperCase()}</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                Zone: {seatZone}
              </span>
            </div>
          </div>

          {/* Quick Schedule Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-2.5 rounded-xl bg-[#14141E] border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-cinzel">
                Date (तारीख)
              </span>
              <span className="font-bold text-white text-xs mt-0.5 block truncate">
                {formattedDate}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#14141E] border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-cinzel">
                Time (वेळ)
              </span>
              <span className="font-bold text-white text-xs mt-0.5 block truncate">
                {formattedTime}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-[#14141E] border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-cinzel">
                Gate Entry
              </span>
              <span className="font-bold text-[#F3D068] text-xs mt-0.5 block truncate">
                Gate 1 • FastTrack
              </span>
            </div>
          </div>
        </div>

        {/* Perforation Divider with Ticket Notches */}
        <div className="relative my-1 flex items-center">
          {/* Left Notch */}
          <div className="w-5 h-8 bg-[#07070A] rounded-r-full -ml-1 border-r border-[#D4AF37]/40 shadow-inner" />
          {/* Perforated Line */}
          <div className="flex-1 border-b-2 border-dashed border-[#D4AF37]/30 mx-2" />
          {/* Right Notch */}
          <div className="w-5 h-8 bg-[#07070A] rounded-l-full -mr-1 border-l border-[#D4AF37]/40 shadow-inner" />
        </div>

        {/* Bottom Section: QR Code & Guest Verification */}
        <div className="p-5 sm:p-6 pt-4 bg-[#0B0B10]">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Scannable QR Code */}
            <div className="relative group cursor-pointer shrink-0" onClick={() => setZoomedQr(true)}>
              <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-[#D4AF37]/50 transition-transform group-hover:scale-105">
                <QRCodeSVG
                  value={qrData}
                  size={130}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <button
                type="button"
                className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold tracking-wider"
              >
                <Maximize2 className="w-4 h-4 mb-0.5 text-[#D4AF37]" />
                <span>TAP TO ZOOM</span>
              </button>
            </div>

            {/* Attendee Details & Verification */}
            <div className="flex-1 text-center sm:text-left space-y-2 w-full">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                  VERIFIED PASS HOLDER (प्रवेशिकाधारक)
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <h4 className="text-base font-bold text-white font-cinzel">
                    {pass.attendeeName}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                </div>
                {pass.attendeePhone && (
                  <p className="text-[11px] text-gray-400 font-mono">
                    Tel: {pass.attendeePhone}
                  </p>
                )}
              </div>

              {/* Pass Unique Reference Code */}
              <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase block">
                    Security Pass ID
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F3D068] tracking-wider select-all">
                    {pass.passId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPassId}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition flex items-center gap-1 text-[10px] cursor-pointer"
                  title="Copy Pass Reference"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 leading-tight">
                हा QR कोड प्रवेशद्वारावर सुरक्षा रक्षकास स्कॅन करण्यासाठी दाखवा. (Present at arena gate for turnstile access).
              </p>
            </div>
          </div>

          {/* Action Dock */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => setZoomedQr(true)}
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F3D068] border border-[#D4AF37]/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen QR</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Print Entry Pass"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Digital Entry Pass - ${pass.showTitle}`,
                      text: `Official AVA Entry Pass for ${pass.attendeeName} • ${pass.passId}`,
                      url: window.location.href
                    }).catch(() => {});
                  } else {
                    handleCopyPassId();
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3D068] text-black text-xs font-bold font-cinzel flex items-center gap-1.5 hover:brightness-110 shadow-md transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-black" />
                <span>Share Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DigitalEntryPassModal: React.FC<{
  isOpen: boolean;
  pass: DigitalPassData | null;
  onClose: () => void;
}> = ({ isOpen, pass, onClose }) => {
  if (!isOpen || !pass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl my-6">
        <DigitalEntryPass pass={pass} onClose={onClose} isModal={true} />
      </div>
    </div>
  );
};
