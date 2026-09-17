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
      title: 'Post a skill',
      description: 'Share what you can teach — anything from coding to cooking.',
      tag: 'Step 1',
      accentBg: 'bg-[#FFF0F2]',
      accentText: 'text-[#FF385C]',
      iconBorder: 'border-[#FFE4E8]'
    },
    {
      number: '2',
      icon: ArrowLeftRight,
      title: 'Find a match',
      description: 'Trade skills for free with someone else, or pay for a lesson if you have nothing to offer in return.',
      tag: 'Step 2',
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-600',
      iconBorder: 'border-amber-100'
    },
    {
      number: '3',
      icon: ShieldCheck,
      title: 'Meet and learn',
      description: "Connect online or in person. Your payment stays protected until you're both happy.",
      tag: 'Step 3',
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      iconBorder: 'border-emerald-100'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-200">
      {/* Top Banner / Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F2] text-[#FF385C] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple & Protected</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#222222] tracking-tight">
          How it works
        </h1>
        <p className="text-sm sm:text-base text-[#717171] leading-relaxed">
          Learn any skill directly from real people. Trade your own knowledge for free, or book a flexible lesson with peace of mind.
        </p>
      </div>

      {/* 3 Prominent Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Number & Icon Pill */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${step.accentBg} ${step.accentText} border ${step.iconBorder} flex items-center justify-center shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-stone-400 font-mono">
                    0{step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#222222] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#717171] leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="pt-4 border-t border-stone-100 flex items-center text-xs font-medium text-stone-400">
                <span>{step.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Guarantees / Highlights */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
        <h3 className="text-base font-semibold text-[#222222] mb-4">
          Why learn with SwapTalent?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#717171]">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#222222] block font-semibold mb-0.5">100% Free Skill Trades</strong>
              <p>Swap knowledge without spending a dime. Both members teach and learn together.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#222222] block font-semibold mb-0.5">Protected Payments</strong>
              <p>Lesson fees stay in safe escrow and are only released when you confirm your lesson was delivered.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#222222] block font-semibold mb-0.5">Learn on Your Terms</strong>
              <p>Meet over 1-on-1 live video, pair-coding sessions, or message review on your own schedule.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="text-center pt-2 pb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onExplore}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#222222] hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Explore Teachers & Skills</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onPostSkill}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold text-[#222222] bg-stone-100 hover:bg-stone-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Teach a Skill</span>
        </button>
      </div>
    </div>
  );
};
