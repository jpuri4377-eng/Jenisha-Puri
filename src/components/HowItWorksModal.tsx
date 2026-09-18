import React from 'react';
import { X, Sparkles, ArrowRight, BookOpen, Users, ShieldCheck, Check } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted?: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onGetStarted
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      number: '1',
      title: 'Share a skill',
      description: 'Post what you love to teach — whether that is coding, guitar, baking, or conversational Italian.',
      icon: BookOpen,
      color: 'bg-[#FDF2EE] text-[#D95338]'
    },
    {
      number: '2',
      title: 'Find friendly matches',
      description: 'Trade skills for free with another learner, or book a paid lesson if you just want to learn.',
      icon: Users,
      color: 'bg-[#FFF8EB] text-[#B45309]'
    },
    {
      number: '3',
      title: 'Meet and learn safely',
      description: "Connect online or in person. Both deposits and lesson fees stay protected in escrow until you're both happy.",
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-violet-50/30 rounded-3xl shadow-[0_20px_50px_-12px_rgba(44,37,35,0.2)] w-full max-w-lg flex flex-col my-6 overflow-hidden border border-violet-200">
        
        {/* Header */}
        <div className="px-6 sm:px-7 pt-6 pb-4 flex items-center justify-between border-b border-[#F2EBE0]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#FDF2EE] text-[#D95338] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#2E1065]">
                Welcome to SwapTalent
              </h2>
              <p className="text-xs text-[#6E645F]">Here is how skill sharing works in 3 easy steps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:text-[#2E1065] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            aria-label="Close walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Simple Steps */}
        <div className="p-6 sm:p-7 space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-violet-200 transition-all hover:border-[#DDD4C5]"
              >
                <div className={`w-10 h-10 rounded-2xl ${step.color} flex items-center justify-center shrink-0 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#8C827A] uppercase tracking-wider">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#2E1065] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6E645F] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-7 py-4 bg-[#FAF7F2] border-t border-[#F2EBE0] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-[#6E645F] hover:text-[#2E1065] font-medium cursor-pointer transition-colors"
          >
            Skip for now
          </button>
          
          <button
            onClick={() => {
              onClose();
              if (onGetStarted) onGetStarted();
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#D95338]/20"
          >
            <span>Got it, let's explore!</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
