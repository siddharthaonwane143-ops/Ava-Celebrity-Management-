import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, Send } from 'lucide-react';
import { ViewerFeatureCustomization } from '../../types';

interface FloatingWhatsAppButtonProps {
  features?: ViewerFeatureCustomization;
  onOpenBooking?: () => void;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  features,
  onOpenBooking,
}) => {
  const [showQuickCard, setShowQuickCard] = useState(false);

  if (features?.showFloatingWhatsApp === false) return null;

  const rawPhone = features?.whatsAppNumber || '+91 98200 12345';
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '').replace('+', '');
  const defaultMsg = features?.whatsAppDefaultMessage || 'नमस्ते AVA Celebrity Management! मला कलाकार व शोज बुकिंग संदर्भात अधिक माहिती हवी आहे.';

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(defaultMsg);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowQuickCard(false);
  };

  return (
    <aside aria-label="WhatsApp Quick Assistance" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Quick Greeting Popover */}
      {showQuickCard && (
        <div className="mb-3 w-72 rounded-2xl bg-[#0D0D14] border border-[#25D366]/40 shadow-2xl p-4 text-white animate-scaleUp">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-black">
                <MessageCircle className="w-3.5 h-3.5 fill-black" />
              </div>
              <span className="text-xs font-bold font-cinzel text-[#25D366]">AVA VIP WhatsApp</span>
            </div>
            <button
              onClick={() => setShowQuickCard(false)}
              className="text-gray-400 hover:text-white p-1 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
            {defaultMsg}
          </p>

          <div className="space-y-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start WhatsApp Chat (चॅट सुरू करा)</span>
            </button>

            {onOpenBooking && (
              <button
                onClick={() => {
                  setShowQuickCard(false);
                  onOpenBooking();
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <span>Or Request VIP Booking Dossier</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Floating Pulse Button */}
      <button
        onClick={() => {
          if (!showQuickCard) {
            setShowQuickCard(true);
          } else {
            handleOpenWhatsApp();
          }
        }}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#20ba59] to-[#25D366] text-black font-bold text-xs shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Direct WhatsApp VIP Desk"
      >
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping pointer-events-none" />
        <MessageCircle className="w-5 h-5 fill-black shrink-0" />
        <span className="hidden sm:inline font-cinzel tracking-wider text-[11px]">WhatsApp Desk</span>
      </button>
    </aside>
  );
};
