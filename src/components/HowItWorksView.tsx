import React from 'react';
import { BookOpen, ArrowLeftRight, ShieldCheck, ArrowRight, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowItWorksViewProps {
  onExplore: () => void;
  onPostSkill: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onExplore,
  onPostSkill
}) => {
  const steps = [
    {
      number: '1',
      icon: BookOpen,
      title: 'Share what you teach',
      description: 'Post what you love to share — from React and Figma to cooking homemade pasta or acoustic guitar.',
      tag: 'Step 1',
      accentBg: 'bg-[#FDF2EE]',
      accentText: 'text-[#D95338]',
      iconBorder: 'border-[#FAD5C8]'
    },
    {
      number: '2',
      icon: ArrowLeftRight,
      title: 'Find friendly matches',
      description: 'Trade skills for free with someone else, or book an affordable lesson if you want direct 1-on-1 tutoring.',
      tag: 'Step 2',
      accentBg: 'bg-[#FFF8EB]',
      accentText: 'text-[#B45309]',
      iconBorder: 'border-[#FDE68A]'
    },
    {
      number: '3',
      icon: ShieldCheck,
      title: 'Meet and learn safely',
      description: "Connect online or in person. Both deposits and lesson fees stay protected in escrow until you're both happy.",
      tag: 'Step 3',
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-700',
      iconBorder: 'border-emerald-200/80'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-200">
      {/* Top Banner / Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2EE] text-[#D95338] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple & Protected</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#2D2623] tracking-tight">
          How SwapTalent works
        </h1>
        <p className="text-sm sm:text-base text-[#6E645F] leading-relaxed">
          Learn any skill directly from real people. Trade your own knowledge for free, or book a relaxed lesson with complete peace of mind.
        </p>
      </div>

      {/* 3 Prominent Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D6] shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(44,37,35,0.09)] hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Number & Icon Pill */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${step.accentBg} ${step.accentText} border ${step.iconBorder} flex items-center justify-center shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#8C827A] font-mono">
                    0{step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#2D2623] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6E645F] leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="pt-4 border-t border-[#F2EBE0] flex items-center text-xs font-medium text-[#8C827A]">
                <span>{step.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Guarantees / Highlights */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
        <h3 className="text-base font-semibold text-[#2D2623] mb-4">
          Why learn with SwapTalent?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#6E645F]">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#2D2623] block font-semibold mb-0.5">100% Free Skill Trades</strong>
              <p className="leading-relaxed">Swap knowledge without spending a dime. Both members teach and learn together.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#2D2623] block font-semibold mb-0.5">Protected Escrow</strong>
              <p className="leading-relaxed">Funds stay in secure escrow and are only released when both parties confirm completion.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#2D2623] block font-semibold mb-0.5">Learn on Your Schedule</strong>
              <p className="leading-relaxed">Meet over 1-on-1 live video, pair-learning sessions, or local meetup on your own terms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="text-center pt-2 pb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onExplore}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#D95338]/20"
        >
          <span>Explore Teachers & Skills</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onPostSkill}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-[#2D2623] bg-[#F4EFE7] hover:bg-[#EAE3D6] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Teach a Skill</span>
        </button>
      </div>
    </div>
  );
};
