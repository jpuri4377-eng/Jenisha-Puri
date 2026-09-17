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
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(44,37,35,0.2)] w-full max-w-lg flex flex-col my-8 overflow-hidden border border-[#EAE3D6]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F2EBE0] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#D95338] uppercase tracking-wider">
              Book a Lesson
            </p>
            <h2 className="text-lg font-semibold text-[#2D2623] tracking-normal mt-0.5">
              Book Session with {targetTalent.user.name}
            </h2>
          </div>
          <button
            id="close-hire-booking-modal"
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:text-[#2D2623] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 text-[#2D2623]">
          {error && (
            <div className="p-3 rounded-2xl bg-[#FDF2EE] text-[#D95338] border border-[#FAD5C8] text-xs font-medium">
              {error}
            </div>
          )}

          {/* Teacher & Session Summary Card */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={targetTalent.user.avatar}
                alt={targetTalent.user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#EAE3D6]"
              />
              <div>
                <p className="text-xs font-normal text-[#8C827A]">
                  {targetTalent.category} • {targetTalent.proficiencyLevel}
                </p>
                <h4 className="text-sm font-semibold text-[#2D2623] mt-0.5">
                  {targetTalent.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#6E645F] mt-0.5">
                  <span>{targetTalent.sessionDurationMins} mins</span>
                  <span>•</span>
                  <span>{targetTalent.format}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-normal text-[#8C827A] flex items-center justify-end">
                Fee <HelpTooltip term="Lesson Fee" text={FINANCE_EXPLANATIONS.lessonFee} />
              </span>
              <span className="text-lg font-semibold text-[#2D2623]">
                ${rate}
              </span>
              <span className="text-xs text-[#8C827A] block">/{rateType === 'hour' ? 'hr' : 'lesson'}</span>
            </div>
          </div>

          {/* Session Timing */}
          <div>
            <label className="block text-xs font-medium text-[#2D2623] mb-1.5">
              Preferred Date & Time *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3" />
              <input
                id="hire-session-date-input"
                type="text"
                value={sessionDateProposal}
                onChange={(e) => setSessionDateProposal(e.target.value)}
                placeholder="e.g. Saturday 2:00 PM UTC"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-[#EAE3D6] text-xs text-[#2D2623] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none bg-white transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-[#8C827A] mt-1">
              Teacher availability: {targetTalent.availability}
            </p>
          </div>

          {/* Learning Goals */}
          <div>
            <label className="block text-xs font-medium text-[#2D2623] mb-1.5">
              What would you like to explore or focus on? (optional)
            </label>
            <textarea
              id="hire-learner-goals-input"
              rows={3}
              value={learnerGoals}
              onChange={(e) => setLearnerGoals(e.target.value)}
              placeholder="e.g. I'd love help reviewing fundamentals and building real projects..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EAE3D6] text-xs text-[#2D2623] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Payment Safety Note */}
          <div className="p-4 rounded-2xl bg-[#FFF8EB] border border-[#FDE68A] flex items-start gap-3 text-xs text-[#6E645F]">
            <ShieldCheck className="w-4 h-4 text-[#D95338] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-[#2D2623] flex items-center">
                Protected Escrow Guarantee
                <HelpTooltip term="Payment Protection" text={FINANCE_EXPLANATIONS.escrow} />
              </span>
              <p className="text-[11px] text-[#6E645F] leading-relaxed">
                Your payment of ${rate}.00 is held safely until the session is completed, then released to {targetTalent.user.name} or promptly refunded if plans change.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#6E645F] hover:text-[#2D2623] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-hire-booking-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#D95338]/20 disabled:opacity-50"
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

