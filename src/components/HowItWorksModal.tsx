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
      title: 'Post a skill',
      description: 'Share what you can teach — anything from coding to cooking.',
      icon: BookOpen,
      color: 'bg-[#FFF0F2] text-[#FF385C]'
    },
    {
      number: '2',
      title: 'Find a match',
      description: 'Trade skills for free with someone else, or pay for a lesson if you have nothing to offer in return.',
      icon: Users,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      number: '3',
      title: 'Meet and learn',
      description: "Connect online or in person. Your payment stays protected until you're both happy.",
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col my-6 overflow-hidden border border-stone-200/80">
        
        {/* Header */}
        <div className="px-6 sm:px-7 pt-6 pb-4 flex items-center justify-between border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#FF385C] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#222222]">
                Welcome to SwapTalent
              </h2>
              <p className="text-xs text-[#717171]">Here is how it works in 3 easy steps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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
                className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50/80 border border-stone-100/90 transition-all hover:bg-stone-50"
              >
                <div className={`w-10 h-10 rounded-2xl ${step.color} flex items-center justify-center shrink-0 shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#222222] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#717171] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-7 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-[#717171] hover:text-[#222222] font-medium cursor-pointer transition-colors"
          >
            Skip for now
          </button>
          
          <button
            onClick={() => {
              onClose();
              if (onGetStarted) onGetStarted();
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#222222] hover:bg-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Got it, let's explore!</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
