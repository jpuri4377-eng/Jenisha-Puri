import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  Video, 
  Check, 
  Clock, 
  Coins,
  Unlock,
  CreditCard
} from 'lucide-react';
import { SwapRequest, User } from '../types';
import { HelpTooltip } from './HelpTooltip';
import { FINANCE_EXPLANATIONS } from '../utils/plainLanguage';

interface MySwapsViewProps {
  swaps: SwapRequest[];
  currentUser: User;
  onOpenCheckout: (swap: SwapRequest) => void;
  onConfirmDelivery: (swapId: string, role: 'requester' | 'recipient') => void;
  onReleaseEscrow: (swapId: string) => void;
  onOpenPostModal: () => void;
}

export const MySwapsView: React.FC<MySwapsViewProps> = ({
  swaps,
  currentUser,
  onOpenCheckout,
  onConfirmDelivery,
  onReleaseEscrow,
  onOpenPostModal
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending_escrow' | 'completed'>('all');

  // Filter swaps where current user is requester or recipient
  const userSwaps = swaps.filter(
    s => s.requesterId === currentUser.id || s.recipientId === currentUser.id
  );

  const filteredSwaps = userSwaps.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'pending_escrow') return s.status === 'escrow_deposit_required';
    if (filter === 'active') return s.status === 'locked_in_escrow' || s.status === 'delivered_pending_peer';
    if (filter === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <p className="text-xs font-semibold text-[#FF385C] uppercase tracking-wider">
            My Learning Sessions
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight mt-1">
            My Sessions
          </h2>
          <p className="text-xs text-[#717171] mt-1">
            Track your upcoming lessons, skill trades, video links, and payment protection.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap self-start md:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
              filter === 'all' 
                ? 'bg-[#222222] text-white font-semibold' 
                : 'bg-stone-100 text-[#717171] hover:text-[#222222]'
            }`}
          >
            All ({userSwaps.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
              filter === 'active' 
                ? 'bg-[#222222] text-white font-semibold' 
                : 'bg-stone-100 text-[#717171] hover:text-[#222222]'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('pending_escrow')}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
              filter === 'pending_escrow' 
                ? 'bg-[#222222] text-white font-semibold' 
                : 'bg-stone-100 text-[#717171] hover:text-[#222222]'
            }`}
          >
            Pending Payment
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
              filter === 'completed' 
                ? 'bg-[#222222] text-white font-semibold' 
                : 'bg-stone-100 text-[#717171] hover:text-[#222222]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Swaps List */}
      {filteredSwaps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-100 shadow-sm space-y-3">
          <h3 className="text-base font-semibold text-[#222222]">No sessions or trades found</h3>
          <p className="text-xs text-[#717171] max-w-sm mx-auto">
            Browse the explore feed to trade skills for free or book a lesson, or teach a skill to receive offers.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenPostModal}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all cursor-pointer shadow-xs"
            >
              Teach a Skill
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => {
            const isRequester = swap.requesterId === currentUser.id;
            const isHire = swap.type === 'hire';
            const peer = isRequester ? swap.recipient : swap.requester;
            const myDeliveryDone = isRequester ? swap.requesterDelivered : swap.recipientDelivered;
            const peerDeliveryDone = isRequester ? swap.recipientDelivered : swap.requesterDelivered;
            const isEscrowLocked = swap.status === 'locked_in_escrow' || swap.status === 'delivered_pending_peer' || swap.status === 'completed';

            return (
              <div
                key={swap.id}
                className="bg-white rounded-3xl border border-stone-100 p-6 sm:p-7 space-y-5 transition-all shadow-sm"
              >
                {/* Peer Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-stone-100"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-[#222222]">
                          {isHire 
                            ? (isRequester ? `Lesson with ${peer.name}` : `Teaching ${peer.name}`)
                            : `Skill Trade with ${peer.name}`
                          }
                        </h4>
                        <span 
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isHire 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-stone-100 text-[#222222]'
                          }`}
                        >
                          {isHire ? 'Paid Lesson' : 'Free Skill Trade'}
                        </span>
                        <span className="text-xs text-[#717171]">• {peer.location}</span>
                      </div>
                      <p className="text-xs text-[#717171] mt-0.5">
                        Planned time: {swap.sessionDateProposal}
                      </p>
                    </div>
                  </div>

                  {/* Escrow Status with Tooltip */}
                  <div className="flex items-center gap-2">
                    {swap.status === 'completed' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-[#222222] flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {isHire ? 'Completed • Payment Released' : 'Completed • Deposit Refunded'}
                        <HelpTooltip text={isHire ? FINANCE_EXPLANATIONS.escrowRelease : FINANCE_EXPLANATIONS.refund} />
                      </span>
                    ) : isEscrowLocked ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#222222] text-white flex items-center gap-1.5">
                        {isHire ? `Payment Protected ($${swap.escrowDepositUSD})` : `Deposit Protected ($${swap.escrowDepositUSD})`}
                        <HelpTooltip text={FINANCE_EXPLANATIONS.escrow} />
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFF0F2] text-[#FF385C] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {isHire ? `Payment Needed ($${swap.escrowDepositUSD})` : `Deposit Needed ($${swap.escrowDepositUSD})`}
                        <HelpTooltip text={FINANCE_EXPLANATIONS.deposit} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Session / Swap Details */}
                {isHire ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Session topic & teacher */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-normal text-[#717171]">
                          {isRequester ? `Teacher: ${swap.recipient.name}` : `Student: ${swap.requester.name}`}
                        </span>
                        {swap.recipientDelivered ? (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Session Delivered
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#717171]">
                            Pending Session
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#222222]">
                        {swap.talentListing.title}
                      </p>
                      <p className="text-xs text-[#717171]">
                        {swap.talentListing.sessionDurationMins} min session • {swap.talentListing.format}
                      </p>
                    </div>

                    {/* Payment & release status */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-normal text-[#717171] flex items-center">
                          Lesson Fee
                          <HelpTooltip term="Lesson Fee" text={FINANCE_EXPLANATIONS.lessonFee} />
                        </span>
                        {swap.status === 'completed' ? (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Paid to Teacher
                          </span>
                        ) : isEscrowLocked ? (
                          <span className="text-[10px] text-[#FF385C] font-semibold flex items-center">
                            Protected in Escrow
                            <HelpTooltip text={FINANCE_EXPLANATIONS.escrow} />
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#717171]">
                            Awaiting Payment
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#222222]">
                        ${swap.escrowDepositUSD}.00 USD
                      </p>
                      <p className="text-xs text-[#717171]">
                        {isRequester 
                          ? 'Held safely until you confirm the lesson took place.' 
                          : 'Funds will be transferred to you once the session is confirmed.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* You teach */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-normal text-[#717171]">
                          You teach {peer.name}
                        </span>
                        {myDeliveryDone ? (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#717171]">
                            Upcoming Lesson
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#222222]">
                        {isRequester ? swap.requesterOfferTitle : swap.talentListing.title}
                      </p>
                    </div>

                    {/* Peer teaches */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-normal text-[#717171]">
                          {peer.name} teaches you
                        </span>
                        {peerDeliveryDone ? (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#717171]">
                            Upcoming Lesson
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#222222]">
                        {isRequester ? swap.talentListing.title : swap.requesterOfferTitle}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#717171] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF385C]" />
                    <span>
                      {swap.status === 'completed'
                        ? isHire ? 'Lesson fee released to teacher.' : 'Security deposit returned to you.'
                        : isEscrowLocked
                        ? isHire ? 'Payment held safely until the session is confirmed.' : 'Deposit held safely until both teachers confirm completion.'
                        : isHire ? 'Payment required to secure your teacher.' : 'Refundable deposit required to confirm time.'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {swap.status === 'escrow_deposit_required' && (
                      isHire ? (
                        isRequester ? (
                          <button
                            id={`pay-hire-fee-btn-${swap.id}`}
                            onClick={() => onOpenCheckout(swap)}
                            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay ${swap.escrowDepositUSD}
                          </button>
                        ) : (
                          <span className="text-xs text-[#717171]">
                            Awaiting payment from student
                          </span>
                        )
                      ) : (
                        <button
                          id={`deposit-escrow-btn-${swap.id}`}
                          onClick={() => onOpenCheckout(swap)}
                          className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          Put Down ${swap.escrowDepositUSD} Deposit
                        </button>
                      )
                    )}

                    {isEscrowLocked && swap.status !== 'completed' && (
                      <>
                        {swap.meetingLink && (
                          <a
                            href={swap.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full text-xs font-medium text-[#222222] bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Join Video Call
                          </a>
                        )}

                        {isHire ? (
                          // Hire completion controls
                          isRequester ? (
                            // Learner can confirm session and release payment
                            <button
                              id={`confirm-hire-completed-btn-${swap.id}`}
                              onClick={() => onConfirmDelivery(swap.id, 'requester')}
                              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Confirm Lesson Finished (Release Payment)
                            </button>
                          ) : (
                            // Teacher marks session delivered
                            !swap.recipientDelivered ? (
                              <button
                                id={`mark-hire-delivered-btn-${swap.id}`}
                                onClick={() => onConfirmDelivery(swap.id, 'recipient')}
                                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Mark Lesson Taught
                              </button>
                            ) : (
                              <div className="px-4 py-2 rounded-full bg-stone-100 text-xs font-medium text-[#717171] flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Awaiting Student Confirmation
                              </div>
                            )
                          )
                        ) : (
                          // Peer swap completion controls
                          !myDeliveryDone ? (
                            <button
                              id={`confirm-delivery-btn-${swap.id}`}
                              onClick={() => onConfirmDelivery(swap.id, isRequester ? 'requester' : 'recipient')}
                              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Confirm I Taught My Lesson
                            </button>
                          ) : !peerDeliveryDone ? (
                            <div className="px-4 py-2 rounded-full bg-stone-100 text-xs font-medium text-[#717171] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Awaiting {peer.name}'s Confirmation
                            </div>
                          ) : null
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
