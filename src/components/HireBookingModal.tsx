import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  User as UserIcon,
  Check
} from 'lucide-react';
import { TalentListing, User, SwapRequest } from '../types';
import { HelpTooltip } from './HelpTooltip';
import { FINANCE_EXPLANATIONS } from '../utils/plainLanguage';

interface HireBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTalent: TalentListing | null;
  currentUser: User;
  onHireBooked: (swap: SwapRequest) => void;
}

export const HireBookingModal: React.FC<HireBookingModalProps> = ({
  isOpen,
  onClose,
  targetTalent,
  currentUser,
  onHireBooked
}) => {
  const [sessionDateProposal, setSessionDateProposal] = useState('Tomorrow at 3:00 PM UTC');
  const [learnerGoals, setLearnerGoals] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !targetTalent) return null;

  const rate = targetTalent.hireRateUSD || 35;
  const rateType = targetTalent.hireRateType || 'session';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          type: 'hire',
          requesterOfferTitle: `Paid Learning Session with ${targetTalent.user.name}`,
          requesterOfferDescription: learnerGoals.trim() || 'Paid 1-on-1 learning session',
          sessionDateProposal,
          escrowDepositUSD: rate,
          hireRateUSD: rate,
          hireRateType: rateType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book session');
      }

      const createdHireBooking = await response.json();
      onHireBooked(createdHireBooking);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error booking session. Please try again.');
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
              Book a Lesson
            </p>
            <h2 className="text-lg font-semibold text-[#222222] tracking-normal mt-0.5">
              Book Session with {targetTalent.user.name}
            </h2>
          </div>
          <button
            id="close-hire-booking-modal"
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

          {/* Teacher & Session Summary Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={targetTalent.user.avatar}
                alt={targetTalent.user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-100"
              />
              <div>
                <p className="text-xs font-normal text-[#717171]">
                  {targetTalent.category} • {targetTalent.proficiencyLevel}
                </p>
                <h4 className="text-sm font-medium text-[#222222] mt-0.5">
                  {targetTalent.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#717171] mt-0.5">
                  <span>{targetTalent.sessionDurationMins} mins</span>
                  <span>•</span>
                  <span>{targetTalent.format}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-normal text-[#717171] flex items-center justify-end">
                Fee <HelpTooltip term="Lesson Fee" text={FINANCE_EXPLANATIONS.lessonFee} />
              </span>
              <span className="text-lg font-semibold text-[#222222]">
                ${rate}
              </span>
              <span className="text-xs text-[#717171] block">/{rateType === 'hour' ? 'hr' : 'lesson'}</span>
            </div>
          </div>

          {/* Session Timing */}
          <div>
            <label className="block text-xs font-medium text-[#222222] mb-1.5">
              Preferred Date & Time *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#717171] absolute left-3.5 top-3" />
              <input
                id="hire-session-date-input"
                type="text"
                value={sessionDateProposal}
                onChange={(e) => setSessionDateProposal(e.target.value)}
                placeholder="e.g. Saturday 2:00 PM UTC"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#222222] focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] focus:outline-none bg-white transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-[#717171] mt-1">
              Teacher availability: {targetTalent.availability}
            </p>
          </div>

          {/* Learning Goals */}
          <div>
            <label className="block text-xs font-medium text-[#222222] mb-1.5">
              What would you like help with or focus on? (optional)
            </label>
            <textarea
              id="hire-learner-goals-input"
              rows={3}
              value={learnerGoals}
              onChange={(e) => setLearnerGoals(e.target.value)}
              placeholder="e.g. I need help debugging an issue and reviewing best practices..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-[#222222] focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C] focus:outline-none bg-white transition-all"
            />
          </div>

          {/* Payment Safety Note */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3 text-xs text-[#717171]">
            <ShieldCheck className="w-4 h-4 text-[#FF385C] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-[#222222] flex items-center">
                100% Payment Protection
                <HelpTooltip term="Payment Protection" text={FINANCE_EXPLANATIONS.escrow} />
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                Your payment of ${rate}.00 is held safely until the session is confirmed, then released to {targetTalent.user.name} or refunded automatically if either of you cancels.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#717171] hover:text-[#222222] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-hire-booking-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <CreditCard className="w-3.5 h-3.5" />
              {isSubmitting ? 'Booking...' : `Proceed to Payment ($${rate})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

