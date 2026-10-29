import React, { useState, useEffect } from 'react';
import { AvaLogo } from '../common/AvaLogo';
import {
  Lock,
  User,
  KeyRound,
  ShieldCheck,
  X,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminIdentifier: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [showUsername, setShowUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setUsername('');
      setPassword('');
      setShowUsername(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // Verify authorized administrator credentials
    const isUserValid =
      cleanUser.toLowerCase() === 'sidd7276' ||
      cleanUser.toLowerCase() === 'siddharthaonwane143@gmail.com' ||
      cleanUser.toLowerCase() === 'siddharthsonwane7276@gmail.com' ||
      cleanUser.toLowerCase() === 'admin@avatalent.com';
    const isPassValid = cleanPass === 'Sidd358@';

    if (isUserValid && isPassValid) {
      // Store session strictly for current browser session (mandatory on every visit)
      sessionStorage.setItem('ava_admin_session', 'active');
      sessionStorage.setItem('ava_admin_active', 'true');
      sessionStorage.setItem('ava_admin_user', cleanUser);
      onLoginSuccess(cleanUser);
      onClose();
    } else {
      setError('अवैध युझरनेम किंवा पासवर्ड! (Invalid Admin Credentials. Access restricted to authorized personnel).');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="card-luxury w-full max-w-md rounded-2xl border-gold-glow overflow-hidden bg-[#0A0A0E] relative shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Back & Close Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-[#F3D068] border border-white/10 hover:border-[#D4AF37] transition flex items-center gap-1.5 text-xs font-cinzel font-bold shadow cursor-pointer"
            title="मागे जा / Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>← Back</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="p-8 pb-4 text-center border-b border-white/5 bg-gradient-to-b from-[#18060D] to-transparent">
          <div className="flex justify-center mb-3">
            <AvaLogo size="lg" variant="stacked" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3D068] text-[10px] font-cinzel font-bold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administration Workspace</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            ॲडमिन पॅनलमध्ये प्रवेश करण्यासाठी Username आणि Password भरणे बंधनकारक आहे.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Strict Username & Password Form */}
          <form onSubmit={handleCredentialLogin} autoComplete="off" className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Admin Username (युझरनेम)
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]/70" />
                <input
                  type={showUsername ? 'text' : 'password'}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="युझरनेम टाका / Enter Admin Username"
                  autoComplete="username"
                  className="w-full bg-[#121218] border border-white/15 rounded-lg py-2.5 pl-9 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowUsername(!showUsername)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition cursor-pointer"
                  title={showUsername ? 'युझरनेम लपवा / Hide username' : 'युझरनेम दाखवा / Show username'}
                >
                  {showUsername ? (
                    <EyeOff className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Admin Security Password (पासवर्ड)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#D4AF37]/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#121218] border border-white/15 rounded-lg py-2.5 pl-9 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="btn-gold w-full py-3 rounded-lg text-xs font-cinzel font-bold text-black uppercase tracking-wider transition shadow-lg mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-black" />
              <span>{loading ? 'Verifying...' : 'Verify & Enter Admin Workspace (प्रवेश करा)'}</span>
            </button>
          </form>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[10px] text-gray-400 text-center">
            सुरक्षेसाठी ॲडमिन पॅनलमध्ये प्रत्येक वेळी युझरनेम व पासवर्ड लॉगिन अनिवार्य आहे.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg text-xs font-cinzel text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Return to Public Website (मागे जा)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
