import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Calendar, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { TalentListing, User } from '../types';
import { HelpTooltip } from './HelpTooltip';
import { FINANCE_EXPLANATIONS } from '../utils/plainLanguage';

interface SwapProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTalent: TalentListing | null;
  currentUser: User;
  onSwapProposed: (swap: any) => void;
}

export const SwapProposalModal: React.FC<SwapProposalModalProps> = ({
  isOpen,
  onClose,
  targetTalent,
  currentUser,
  onSwapProposed
}) => {
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [proposedDate, setProposedDate] = useState('This Saturday at 2:00 PM UTC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !targetTalent) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim() || !offerDescription.trim()) {
      setError('Please specify what skill you can teach in exchange.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: currentUser.id,
          recipientId: targetTalent.userId,
          talentListingId: targetTalent.id,
          requesterOfferTitle: offerTitle,
          requesterOfferDescription: offerDescription,
          sessionDateProposal: proposedDate,
          escrowDepositUSD: targetTalent.escrowDepositUSD
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit trade proposal');
      }

      const createdSwap = await response.json();
      onSwapProposed(createdSwap);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error proposing trade. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col my-8 overflow-hidden border-0">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#FF385C] uppercase tracking-wider">
              Free Skill Trade
            </p>
            <h2 className="text-lg font-semibold text-[#222222] tracking-normal mt-0.5">
              Trade Skills with {targetTalent.user.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 text-[#222222]">
          {error && (
            <div className="p-3 rounded-2xl bg-[#FFF0F2] text-[#FF385C] text-xs font-medium">
              {error}
            </div>
          )}

          {/* Target talent info */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-start gap-3">
            <img
              src={targetTalent.user.avatar}
              alt={targetTalent.user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-100 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-normal text-[#717171] uppercase tracking-wider block">
                You will learn from {targetTalent.user.name} ({targetTalent.proficiencyLevel})
              </span>
              <p className="font-medium text-[#222222] text-sm mt-0.5 leading-snug truncate">
                {targetTalent.title}
              </p>
              <p className="text-xs text-[#717171] mt-1">
                {targetTalent.sessionDurationMins} mins • {targetTalent.format}
              </p>
            </div>
          </div>

          {/* What you offer */}
          <div>
            <label className="block text-xs font-medium text-[#222222] mb-1.5">
              What skill can you teach in exchange? *
            </label>
            <input
              id="swap-offer-title-input"
              type="text"
              required
              placeholder="e.g. Conversational Spanish or Cooking Italian Pasta"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#222222] focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#222222] mb-1.5">
              Briefly describe what you'll teach *
            </label>
            <textarea
              id="swap-offer-desc-input"
              rows={3}
              required
              placeholder="Tell them a little about your experience with this skill and how you can help them..."
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#222222] focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#222222] mb-1.5">
              Preferred Date & Time
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#717171] absolute left-3.5 top-3" />
              <input
                id="swap-schedule-input"
                type="text"
                placeholder="e.g. Saturday 2:00 PM UTC"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#222222] focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Refundable deposit note */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-[#717171] space-y-1">
            <div className="flex items-center justify-between font-semibold text-[#222222]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF385C]" />
                Refundable Deposit: ${targetTalent.escrowDepositUSD}
                <HelpTooltip term="Refundable Deposit" text={FINANCE_EXPLANATIONS.deposit} />
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">100% Refundable</span>
            </div>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              Both people put down a small security deposit so no one flakes. Once you both finish teaching, your deposit is returned to you immediately.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#717171] hover:text-[#222222] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-proposal-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              {isSubmitting ? 'Sending Request...' : 'Send Trade Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
