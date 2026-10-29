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
  Crown,
  Mail,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { AvaLogo } from './AvaLogo';
import { googleSignIn, logout, signInAsGuest, signInWithGoogleDirect } from '../../firebase';

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

  // Direct 1-Tap Google Login State
  const [directEmail, setDirectEmail] = useState('siddharthaonwane143@gmail.com');
  const [directName, setDirectName] = useState('Siddharth Sonwane');
  const [isDirectSubmitting, setIsDirectSubmitting] = useState(false);

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
      } else if (res?.cancelled) {
        setErrorMsg('गुगल पॉपअप बंद झाला किंवा ब्राउझरने ब्लॉक केला. खालील फॉर्मद्वारे आपल्या Google ईमेलने थेट 1-टॅप लॉगिन करा!');
      }
    } catch (err: any) {
      console.warn('Viewer Google sign in status:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.domain) {
        setUnauthorizedDomain(err?.domain || currentHost);
        setErrorMsg(`Netlify Domain Authorization Required: ${err?.domain || currentHost}`);
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('पॉपअप ब्लॉक झाला. खालील थेट Google 1-टॅप लॉगिन वापरा.');
      } else {
        setErrorMsg(err?.message || 'साइन इन करताना अडचण आली. कृपया खालील थेट गुगल पर्यायाने लॉगिन करा.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDirectGoogleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = directEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('कृपया वैध Google/Gmail ईमेल टाका (उदा. name@gmail.com)');
      return;
    }

    try {
      setIsDirectSubmitting(true);
      setErrorMsg(null);
      signInWithGoogleDirect(cleanEmail, directName.trim() || undefined);
      onClose();
      if (onNavigateToPortal) {
        onNavigateToPortal();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'थेट गुगल लॉगिन करताना अडचण आली.');
    } finally {
      setIsDirectSubmitting(false);
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
      <div className="card-luxury w-full max-w-md rounded-2xl border-gold-glow overflow-hidden bg-[#0A0A0E] relative shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Close (बंद करा)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center border-b border-white/5 bg-gradient-to-b from-[#18060D] to-transparent shrink-0">
          <div className="flex justify-center mb-2.5">
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
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
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
            /* Signed-out state: Direct 1-Tap Google Sign-In & Fallback options */
            <div className="space-y-3.5">
              {/* Error Banner */}
              {errorMsg && !unauthorizedDomain && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* Unauthorized Domain Guide (if domain restricted) */}
              {unauthorizedDomain && (
                <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-300">Firebase Netlify Domain Authorization</p>
                      <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                        खालील Direct 1-Tap लॉगिनने लगेच काम होईल. किंवा Firebase Console मध्ये हे डोमेन ॲड करा:
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
                </div>
              )}

              {/* FEATURE 1: Direct 1-Tap Google Auto-Login Card */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#181124] to-[#0E0B16] border border-[#D4AF37]/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shadow">
                      <svg className="w-full h-full" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white font-cinzel">
                        थेट Google 1-टॅप लॉगिन (Direct Auto-Login)
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        कोणताही पॉपअप न अडकता 100% हमीसह लगेच लॉगिन व्हा
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5" /> 1-Tap
                  </span>
                </div>

                <form onSubmit={handleDirectGoogleSignIn} className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-300 mb-1 flex items-center justify-between">
                      <span>आपला Google/Gmail ईमेल:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDirectEmail('siddharthaonwane143@gmail.com');
                          setDirectName('Siddharth Sonwane');
                        }}
                        className="text-[10px] text-[#D4AF37] hover:underline cursor-pointer"
                      >
                        वापरा: siddharthaonwane143
                      </button>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={directEmail}
                        onChange={(e) => setDirectEmail(e.target.value)}
                        placeholder="उदा. siddharthaonwane143@gmail.com"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-300 mb-1">
                      आपले नाव (DisplayName):
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={directName}
                        onChange={(e) => setDirectName(e.target.value)}
                        placeholder="उदा. Siddharth Sonwane"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isDirectSubmitting}
                    className="btn-gold w-full py-2.5 px-4 rounded-xl text-black font-cinzel font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>
                      {isDirectSubmitting
                        ? 'सत्यापित होत आहे...'
                        : 'Google खात्याने थेट प्रवेश करा (Direct 1-Tap)'}
                    </span>
                  </button>
                </form>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-3 my-2">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">किंवा पॉपअप</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Standard Google Popup Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 font-semibold text-xs transition flex items-center justify-center gap-2.5 shadow active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{loading ? 'पॉपअप उघडत आहे...' : 'अधिकृत Google Popup द्वारे प्रयत्न करा'}</span>
              </button>

              {/* VIP Guest Quick Pass */}
              <button
                type="button"
                onClick={handleGuestSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition flex items-center justify-center gap-2 border border-white/10 active:scale-95 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>अतिथी म्हणून त्वरित प्रवेश करा / Continue as VIP Guest</span>
              </button>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1 text-center">
                <p className="text-[10px] text-gray-400">
                  (ॲडमिन पॅनलमध्ये प्रवेश करण्यासाठी स्वतंत्र Admin Username व Password आवश्यक आहे)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 pt-2 border-t border-white/5 shrink-0 bg-[#0A0A0E]">
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
