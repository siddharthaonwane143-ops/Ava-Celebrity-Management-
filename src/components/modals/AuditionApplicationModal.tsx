import React, { useState } from 'react';
import { Audition } from '../../types';
import { submitAuditionApplication } from '../../services/dbService';
import { auth } from '../../firebase';
import { X, CheckCircle2, Clapperboard, AlertCircle, ArrowLeft } from 'lucide-react';

interface AuditionApplicationModalProps {
  audition: Audition | null;
  onClose: () => void;
}

export const AuditionApplicationModal: React.FC<AuditionApplicationModalProps> = ({
  audition,
  onClose,
}) => {
  const [fullName, setFullName] = useState(auth.currentUser?.displayName || '');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [reelUrl, setReelUrl] = useState('');
  const [headshotUrl, setHeadshotUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!audition) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !reelUrl.trim()) {
      setError('Please provide your name, email, phone, and self-tape/reel link.');
      return;
    }

    setLoading(true);
    try {
      const ref = await submitAuditionApplication({
        auditionId: audition.id,
        projectTitle: audition.projectTitle,
        applicantUid: auth.currentUser?.uid || undefined,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: experience.trim() || undefined,
        reelUrl: reelUrl.trim(),
        headshotUrl: headshotUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        status: 'Submitted',
      });
      setSubmittedRef(ref);
    } catch (err: any) {
      console.error('Audition application error:', err);
      setError(err.message || 'Failed to submit audition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="card-luxury w-full max-w-xl rounded-2xl border-gold-glow my-8 overflow-hidden bg-[#0C0C12]">
        <div className="px-6 py-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-gradient-to-r from-[#1B050B] via-[#0E0E14] to-[#1F180A]">
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
            <div>
              <span className="text-[10px] font-cinzel font-bold text-[#D4AF37] tracking-widest uppercase block">
                Official Casting Call
              </span>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                Audition Submission
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

        {submittedRef ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-cinzel text-2xl font-bold text-white mb-2">
                Audition Application Received
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Your self-tape and casting materials for <strong className="text-[#D4AF37]">{audition.projectTitle}</strong> have been submitted to casting directors.
              </p>
            </div>

            <div className="bg-[#121218] border border-gold-subtle rounded-xl p-4 max-w-md mx-auto">
              <span className="text-[11px] font-cinzel text-gray-400 uppercase tracking-widest block mb-1">
                Audition Submission Reference
              </span>
              <span className="text-xl font-mono font-bold text-gold-shimmer select-all">
                {submittedRef}
              </span>
            </div>

            <button
              onClick={handleResetAndClose}
              className="btn-gold px-8 py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Auditions (मागे जा)</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="bg-[#161622] p-3 rounded-xl border border-[#D4AF37]/30 flex items-start gap-3">
              <Clapperboard className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-white font-cinzel block text-sm">{audition.projectTitle}</strong>
                <span className="text-gray-400 block mt-0.5">
                  Category: {audition.category} • Format: {audition.auditionMethod}
                </span>
                <span className="text-amber-400 block mt-0.5">
                  Deadline: {audition.deadline} • Required: {audition.requiredMaterials}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Applicant Name *
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
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="applicant@email.com"
                className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Showreel / Self-Tape Link *
              </label>
              <input
                type="url"
                required
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                placeholder="https://youtube.com/watch?... or Vimeo link"
                className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Headshot Photo Link
              </label>
              <input
                type="url"
                value={headshotUrl}
                onChange={(e) => setHeadshotUrl(e.target.value)}
                placeholder="https://... headshot URL"
                className="w-full bg-[#121218] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                Experience / Representation Background
              </label>
              <textarea
                rows={2}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="List previous theater, film, TV or agency credits..."
                className="w-full bg-[#121218] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between sm:justify-end gap-3">
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
                className="btn-gold px-7 py-2.5 rounded text-xs font-bold uppercase tracking-wider disabled:opacity-40"
              >
                {loading ? 'Submitting...' : 'Submit Audition Reel'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
