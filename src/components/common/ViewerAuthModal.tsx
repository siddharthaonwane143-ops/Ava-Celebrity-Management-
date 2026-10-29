import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  LogOut,
  FolderKanban,
  UserCheck,
  ArrowRight,
  ExternalLink,
  Crown
} from 'lucide-react';
import { AvaLogo } from './AvaLogo';
import { googleSignIn, logout, signInAsGuest } from '../../firebase';

interface ViewerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onNavigateToPortal?: () => void;
  onOpenProfile?: () => void;
}

export const ViewerAuthModal: React.FC<ViewerAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onNavigateToPortal,
  onOpenProfile
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setUnauthorizedDomain(null);
    setLoading(true);

    try {
      const res = await googleSignIn();
      if (res?.user) {
        onClose();
      }
    } catch (err: any) {
      console.warn('Viewer Google sign in status:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.domain) {
        setUnauthorizedDomain(err?.domain || currentHost);
        setErrorMsg(`Netlify Domain Authorization Required: ${err?.domain || currentHost}`);
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by your browser. Attempting redirect sign-in...');
      } else {
        setErrorMsg(err?.message || 'Sign in encountered an issue. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDomain = () => {
    if (unauthorizedDomain || currentHost) {
      navigator.clipboard.writeText(unauthorizedDomain || currentHost);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleGuestSignIn = () => {
    try {
      signInAsGuest('VIP Guest Viewer');
      onClose();
      if (onNavigateToPortal) {
        onNavigateToPortal();
      }
    } catch (err) {
      console.warn('Guest sign-in note:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onClose();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="card-luxury w-full max-w-md rounded-2xl border-gold-glow overflow-hidden bg-[#0A0A0E] relative shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Close (बंद करा)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-8 pb-5 text-center border-b border-white/5 bg-gradient-to-b from-[#18060D] to-transparent">
          <div className="flex justify-center mb-3">
            <AvaLogo size="md" variant="stacked" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3D068] text-[10px] font-cinzel font-bold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Viewer Access Portal</span>
          </div>
          <h2 className="text-base sm:text-lg font-cinzel font-bold text-white mt-2">
            {user ? 'Welcome Back!' : 'Google ने साइन इन करा'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {user
              ? 'आपले अधिकृत व्ह्यूवर खाते सक्रिय आहे'
              : 'Sign in to access VIP bookings, track talent inquiries, and manage event passes.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-4">
          {/* If User is already signed in */}
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#121218] border border-white/10 flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Viewer'}
                    className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/60"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#200A15] border border-[#D4AF37] flex items-center justify-center text-sm font-bold text-[#F3D068]">
                    {user.displayName?.[0] || user.email?.[0] || 'V'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate block">
                      {user.displayName || 'Authorized Viewer'}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[11px] text-gray-400 truncate block">{user.email}</span>
                  <span className="text-[9px] font-mono text-[#D4AF37] block mt-0.5">
                    Google Verified Viewer Account
                  </span>
                </div>
              </div>

              {/* Actions for Signed-in Viewer */}
              <div className="space-y-2">
                {onOpenProfile && (
                  <button
                    onClick={() => {
                      onOpenProfile();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>माझी प्रोफाईल व पडताळणी (Edit Profile)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}

                {onNavigateToPortal && (
                  <button
                    onClick={() => {
                      onNavigateToPortal();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban className="w-4 h-4 text-[#D4AF37]" />
                      <span>माझे बुकिग्स व ॲप्लिकेशन्स (My Bookings)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-cinzel font-bold text-rose-400 hover:bg-rose-950/30 border border-rose-500/20 transition cursor-pointer mt-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out (खात्यातून बाहेर पडा)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Signed-out state: Professional Google Sign-In */
            <div className="space-y-4">
              {/* Error / Unauthorized Domain Banner */}
              {unauthorizedDomain && (
                <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-300">Firebase Netlify Domain Authorization</p>
                      <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                        या Netlify डोमेनवरून Google साइन-इन चालण्यासाठी हे डोमेन Firebase Console मध्ये ॲड करा:
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-amber-500/30">
                    <code className="text-[11px] text-amber-300 font-mono truncate flex-1">
                      {unauthorizedDomain}
                    </code>
                    <button
                      onClick={handleCopyDomain}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedDomain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDomain ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains &gt; Add Domain.
                  </p>
                </div>
              )}

              {errorMsg && !unauthorizedDomain && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Instant 1-Tap Guest Access */}
              <button
                type="button"
                onClick={handleGuestSignIn}
                className="btn-gold w-full py-3 px-4 rounded-xl text-black font-cinzel font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer hover:scale-[1.01]"
              >
                <Crown className="w-4 h-4 text-black" />
                <span>अतिथी म्हणून त्वरित प्रवेश करा / Continue as VIP Guest (1-Tap)</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">OR</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Primary Google Sign-In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold text-xs transition flex items-center justify-center gap-3 shadow-lg active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{loading ? 'Connecting to Google...' : 'Sign In with Google (गुगलने साइन इन करा)'}</span>
              </button>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-center">
                <p className="text-[11px] text-gray-300 font-medium">
                  केवळ व्ह्यूवर, प्रेक्षक आणि क्लायंटसाठी गुगल किंवा अतिथी लॉगिन
                </p>
                <p className="text-[10px] text-gray-500">
                  (ॲडमिन पॅनलमध्ये प्रवेश करण्यासाठी स्वतंत्र Username व Password आवश्यक आहे)
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg text-xs font-cinzel text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition text-center cursor-pointer"
          >
            Close (बंद करा)
          </button>
        </div>
      </div>
    </div>
  );
};
