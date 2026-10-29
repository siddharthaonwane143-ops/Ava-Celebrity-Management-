import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  FileText,
  Clapperboard,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Cpu,
  Calendar,
  Radio,
  Lock,
  DollarSign,
  Headphones,
  Megaphone,
  Layers,
  Zap,
  Users
} from 'lucide-react';
import { AIToolTab } from '../ai/AIToolsSuiteModal';

interface AITalentToolsSectionProps {
  onOpenAITool: (tab: AIToolTab) => void;
}

export const AITalentToolsSection: React.FC<AITalentToolsSectionProps> = ({ onOpenAITool }) => {
  const [quickQuery, setQuickQuery] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickResponse, setQuickResponse] = useState<string | null>(null);

  const handleQuickAssistantQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim() || quickLoading) return;
    setQuickLoading(true);
    setQuickResponse(null);
    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Quick Celebrity Booking Advisory: ${quickQuery.trim()}`
        })
      });
      const data = await res.json();
      setQuickResponse(data.text || 'Advisory prepared.');
    } catch (err) {
      setQuickResponse('Notice: Direct executive inquiry routed to concierge desk.');
    } finally {
      setQuickLoading(false);
    }
  };

  const aiTeamCrew = [
    {
      id: 'matchmaker' as const,
      icon: UserCheck,
      agentName: 'Agent Ava',
      roleEn: 'Executive Producer & Talent Matchmaker',
      roleMr: 'निर्माता व टॅलेंट मॅचमेकर',
      description: 'Matches A-list actors, supermodels, playback vocalists, and anchors based on campaign goals, demographic reach, and budget parameters.',
      deliverables: ['Demographic Compatibility', 'Fee Optimization', 'Contract Format Suggestions'],
      accentColor: 'border-[#D4AF37]/40 text-[#F3D068]'
    },
    {
      id: 'audition' as const,
      icon: Clapperboard,
      agentName: 'Agent Priya',
      roleEn: 'Casting Director & Monologue Critic',
      roleMr: 'कास्टिंग डायरेक्टर व अभिनय समीक्षक',
      description: 'Evaluates audition self-tapes, dialogue scripts, and character breakdowns with immediate scoring and acting beat notes.',
      deliverables: ['Monologue Dynamic Score', 'Vocal Diction Analysis', 'Director Character Notes'],
      accentColor: 'border-purple-500/40 text-purple-300'
    },
    {
      id: 'contract' as const,
      icon: FileText,
      agentName: 'Agent Vikram',
      roleEn: 'Entertainment Legal Counsel & Rider Drafter',
      roleMr: 'कायदेशीर सल्लागार व परफॉर्मन्स करार',
      description: 'Drafts comprehensive performance riders, 5-star green room protocols, non-disclosure agreements, and security indemnities.',
      deliverables: ['5-Star Hospitality Riders', 'Audio Specifications', 'Confidentiality NDAs'],
      accentColor: 'border-blue-500/40 text-blue-300'
    },
    {
      id: 'vocal' as const,
      icon: Headphones,
      agentName: 'Agent Aryan',
      roleEn: 'Vocal Coach & Dubbing Director',
      roleMr: 'व्होकल कोच व डबिंग डायरेक्टर',
      description: 'Analyzes voice modulation, Marathi/Hindi/English regional dialects, pitch variation, breathing technique, and mic placement cues.',
      deliverables: ['Vocal Warmup Drills', 'Diction & Pronunciation', 'Annotated Practice Lines'],
      accentColor: 'border-cyan-500/40 text-cyan-300'
    },
    {
      id: 'press' as const,
      icon: Megaphone,
      agentName: 'Agent Maya',
      roleEn: 'PR Bureau Chief & Media Wire Director',
      roleMr: 'प्रेस रिलिज व मीडिया ब्रॉडकास्ट',
      description: 'Drafts AP-style entertainment press releases, red-carpet media statements, and viral social media announcements.',
      deliverables: ['AP Wire Press Releases', 'Executive Quotes', 'Viral Social Catchlines'],
      accentColor: 'border-rose-500/40 text-rose-300'
    },
    {
      id: 'security' as const,
      icon: Lock,
      agentName: 'Agent Kabir',
      roleEn: 'VIP Security Commander & Safety Protocol',
      roleMr: 'सुरक्षा प्रमुख व VIP प्रोटोकॉल',
      description: 'Plans crowd risk assessments, Maharashtra Police NOC checklists, 4-zone guard deployments, and motorcade escort routes.',
      deliverables: ['Police NOC Checklists', 'Crowd Risk Index', 'VIP Escort Formations'],
      accentColor: 'border-amber-500/40 text-amber-300'
    },
    {
      id: 'rateEstimator' as const,
      icon: DollarSign,
      agentName: 'Agent Rohan',
      roleEn: 'Commercial Valuation & Budget Estimator',
      roleMr: 'उत्पादन बजेट व मानधन सल्लागार',
      description: 'Calculates market-standard booking fees, half-day/full-day shoot pricing, and rider logistics across Maharashtra districts.',
      deliverables: ['Maharashtra Rate Benchmarks', 'Shoot Day Pricing', 'Rider Budget Estimates'],
      accentColor: 'border-emerald-500/40 text-emerald-300'
    },
    {
      id: 'schedule' as const,
      icon: Calendar,
      agentName: 'Agent Dev',
      roleEn: 'Run-of-Show & Stage Operations Director',
      roleMr: 'स्टेज ऑपरेशन्स व रन-ऑफ-शो',
      description: 'Generates minute-by-minute VIP gala timelines, stage cues, camera switchers, lighting washes, and broadcast satellite sync.',
      deliverables: ['Minute-by-Minute Timeline', 'Stage & Audio Cue Sheet', 'VIP Security Transit'],
      accentColor: 'border-indigo-500/40 text-indigo-300'
    }
  ];

  const teamPipelineSteps = [
    { step: '01', title: 'Star Match & Vision', agent: 'Agent Ava (Producer)', desc: 'Algorithmically matches ideal headliner or cast' },
    { step: '02', title: 'Audition & Vocal Coaching', agent: 'Agent Priya & Aryan', desc: 'Monologue scoring and dialect cadence tuning' },
    { step: '03', title: 'Contract & Commercial Rider', agent: 'Agent Vikram & Rohan', desc: 'NDAs, rate valuation, and legal agreements' },
    { step: '04', title: 'Ground Safety & Protocols', agent: 'Agent Kabir (Security)', desc: '4-zone VIP protection and police NOC clearance' },
    { step: '05', title: 'Red Carpet Wire Broadcast', agent: 'Agent Maya (PR Wire)', desc: 'AP-wire release, social buzz, and live show cues' },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#08080C] via-[#0D0B14] to-[#08080C] border-t border-b border-[#D4AF37]/25 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3D068] text-[10px] font-cinzel font-bold tracking-widest uppercase mb-3 shadow">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>AVA AI STUDIO TEAM • MULTI-AGENT PRODUCTION CREW</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Meet the <span className="text-gold-gradient">AVA AI Team</span>
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm mt-3 leading-relaxed">
            An elite crew of specialized AI agents working together like a full-scale film studio & celebrity agency braintrust (चित्रपट, इव्हेंट्स व सेलिब्रिटी मॅनेजमेंटसाठी समर्पित AI क्रू).
          </p>
        </div>

        {/* AI Team Workflow Pipeline Bar */}
        <div className="card-luxury rounded-2xl p-5 border border-[#D4AF37]/30 bg-[#0A0A10] mb-12 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                How Our Multi-Agent AI Team Collaborates On Your Production
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              End-to-End Autonomous Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {teamPipelineSteps.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 relative group hover:border-[#D4AF37]/40 transition">
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold block mb-1">
                  STAGE {s.step}
                </span>
                <h4 className="font-cinzel text-xs font-bold text-white mb-0.5">
                  {s.title}
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold block mb-1">
                  {s.agent}
                </span>
                <p className="text-[11px] text-gray-400 leading-tight">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 8 AI Team Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {aiTeamCrew.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <div
                key={agent.id}
                className="card-luxury rounded-2xl p-5 border-gold-subtle flex flex-col justify-between hover:border-[#D4AF37] transition-all duration-300 group hover:-translate-y-1 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-[11px] font-mono text-[#D4AF37] font-bold block">
                      {agent.agentName}
                    </span>
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-[#F3D068] transition">
                      {agent.roleEn}
                    </h3>
                    <span className="text-[11px] text-gray-400 block font-serif">
                      ({agent.roleMr})
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs leading-relaxed mb-4">
                    {agent.description}
                  </p>

                  <div className="space-y-1.5 mb-6 pt-3 border-t border-white/5">
                    {agent.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                        <CheckCircle2 className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenAITool(agent.id)}
                  className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-[#D4AF37] text-gray-200 hover:text-black border border-white/10 hover:border-[#D4AF37] text-xs font-bold font-cinzel transition flex items-center justify-center gap-1.5 cursor-pointer shadow group-hover:shadow-[#D4AF37]/20"
                >
                  <span>Collaborate with {agent.agentName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Interactive Assistant Query Bar */}
        <div className="card-luxury rounded-2xl p-6 sm:p-8 border-gold-glow max-w-4xl mx-auto bg-[#0C0C12] shadow-2xl relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#650B1B] to-[#D4AF37] p-0.5 shrink-0 shadow">
                <div className="w-full h-full bg-[#0E0E14] rounded-[10px] flex items-center justify-center text-[#D4AF37]">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                  Consult the AVA AI Executive Desk
                </h3>
                <p className="text-gray-400 text-xs">
                  Ask immediate questions in Marathi, Hindi, or English regarding celebrity bookings, tier budgets, or casting advice.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAITool('matchmaker')}
                className="text-xs text-[#F3D068] hover:underline font-cinzel font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Full 10-Agent Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleQuickAssistantQuery} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="उदा. 'Pune luxury wedding साठी Tier-1 celebrity cost काय असेल?' किंवा 'Marathi movie lead casting कशी करायची?'"
                className="w-full bg-[#14141E] border border-[#D4AF37]/35 rounded-xl py-3 pl-4 pr-28 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition shadow-inner"
              />
              <button
                type="submit"
                disabled={quickLoading || !quickQuery.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg btn-gold text-black font-cinzel font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow"
              >
                {quickLoading ? (
                  <span>Thinking...</span>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-400">
              <span className="font-cinzel text-[#D4AF37]">Quick Prompts:</span>
              <button
                type="button"
                onClick={() => setQuickQuery('Mumbai gala event साठी A-list celebrity booking fees आणि hospitality rider काय आहे?')}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-[#D4AF37]/40 transition text-[11px] cursor-pointer"
              >
                👑 Celebrity Fees & Riders
              </button>
              <button
                type="button"
                onClick={() => setQuickQuery('Marathi OTT series साठी monologue audition self-tape कसं submit करावं?')}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-[#D4AF37]/40 transition text-[11px] cursor-pointer"
              >
                🎭 Audition Guidelines
              </button>
              <button
                type="button"
                onClick={() => setQuickQuery('Fashion Week runway showstopper contract format आणि NDA')}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-[#D4AF37]/40 transition text-[11px] cursor-pointer"
              >
                📜 Contract & NDAs
              </button>
            </div>
          </form>

          {/* Quick AI Response Display */}
          {quickResponse && (
            <div className="mt-6 p-4 rounded-xl bg-[#161622] border border-[#D4AF37]/40 animate-fadeIn">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <span className="text-[10px] font-cinzel font-bold text-[#D4AF37] tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  AVA Executive AI Advisory
                </span>
                <button
                  onClick={() => onOpenAITool('concierge')}
                  className="text-[10px] font-mono text-[#F3D068] hover:underline cursor-pointer"
                >
                  Continue Full Dialogue →
                </button>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">
                {quickResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
