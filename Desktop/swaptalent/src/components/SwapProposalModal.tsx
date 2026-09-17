import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  Check
} from 'lucide-react';
import { TalentListing, User } from '../types';

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
      setError('Please specify what skill you offer to teach in exchange.');
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
        throw new Error('Failed to submit swap proposal');
      }

      const createdSwap = await response.json();
      onSwapProposed(createdSwap);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error proposing swap. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Propose a Talent Swap</h2>
              <p className="text-xs text-slate-500">Exchange skills peer-to-peer with zero middleman fees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* What you're requesting */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
            <img
              src={targetTalent.user.avatar}
              alt={targetTalent.user.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                You want to learn from {targetTalent.user.name}:
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{targetTalent.title}</h4>
              <p className="text-xs text-slate-500 mt-1">
                Format: {targetTalent.format} • {targetTalent.sessionDurationMins} minutes
              </p>
            </div>
          </div>

          {/* What you offer to teach them */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              What will you teach in return? *
            </label>
            <input
              id="swap-offer-title-input"
              type="text"
              required
              placeholder="e.g., Conversational Spanish Fluency, or Modern React & Tailwind CSS"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Offer Overview & What You Will Cover *
            </label>
            <textarea
              id="swap-offer-desc-input"
              rows={3}
              required
              placeholder="Describe what you will teach, your experience with this skill, and how you will structure your session with them..."
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Proposed Schedule / Availability
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="swap-schedule-input"
                type="text"
                placeholder="e.g., Saturday 2:00 PM UTC or Weekday evenings"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
              />
            </div>
          </div>

          {/* NOWPayments Escrow Guarantee banner */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Peer-to-Peer Security Escrow: ${targetTalent.escrowDepositUSD} USD
                  </h4>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Powered by NOWPayments
                  </span>
                </div>
                <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                  Upon proposing this swap, you will be invited to lock this commitment deposit in crypto (USDT, BTC, ETH, SOL). Once both you and {targetTalent.user.name} confirm your teaching sessions are delivered, this deposit is 100% unlocked and refunded!
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-proposal-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? 'Sending Proposal...' : 'Send Swap Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
