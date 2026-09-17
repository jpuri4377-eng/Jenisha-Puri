import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  Video, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Coins,
  Sparkles,
  Lock,
  Unlock,
  Check,
  UserCheck
} from 'lucide-react';
import { SwapRequest, User } from '../types';

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
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-indigo-600" />
            My Swaps & Escrow Agreements
          </h2>
          <p className="text-xs text-slate-700 mt-0.5">
            Track peer-to-peer delivery, video sessions, and NOWPayments cryptographic escrow status.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({userSwaps.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('pending_escrow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'pending_escrow' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Escrow
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Swaps List */}
      {filteredSwaps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No swaps found in this filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse the talent catalog to request a swap, or post what you want to teach to get discovered!
          </p>
          <div className="mt-4">
            <button
              onClick={onOpenPostModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer"
            >
              Post What You Teach
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => {
            const isRequester = swap.requesterId === currentUser.id;
            const peer = isRequester ? swap.recipient : swap.requester;
            const myDeliveryDone = isRequester ? swap.requesterDelivered : swap.recipientDelivered;
            const peerDeliveryDone = isRequester ? swap.recipientDelivered : swap.requesterDelivered;
            const isEscrowLocked = swap.status === 'locked_in_escrow' || swap.status === 'delivered_pending_peer' || swap.status === 'completed';

            return (
              <div
                key={swap.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 space-y-4"
              >
                {/* Header: Peer info and Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">
                          Swap with {peer.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">• {peer.location}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Proposed: {swap.sessionDateProposal}
                      </p>
                    </div>
                  </div>

                  {/* Escrow & Status Pill */}
                  <div className="flex items-center gap-2">
                    {swap.status === 'completed' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Completed & Escrow Refunded
                      </span>
                    ) : isEscrowLocked ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-600" />
                        Escrow Locked (${swap.escrowDepositUSD} USDT)
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Escrow Deposit Needed
                      </span>
                    )}
                  </div>
                </div>

                {/* Swap Exchange Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* What you are teaching */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                        You Teach {peer.name}:
                      </span>
                      {myDeliveryDone ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Delivered
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-600 bg-white px-2 py-0.5 rounded-full">
                          Pending Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {isRequester ? swap.requesterOfferTitle : swap.talentListing.title}
                    </p>
                  </div>

                  {/* What peer is teaching you */}
                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                        {peer.name} Teaches You:
                      </span>
                      {peerDeliveryDone ? (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Delivered
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-indigo-600 bg-white px-2 py-0.5 rounded-full">
                          Pending Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {isRequester ? swap.talentListing.title : swap.requesterOfferTitle}
                    </p>
                  </div>
                </div>

                {/* Interactive Transaction Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Escrow Guarantee Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      {swap.status === 'completed'
                        ? 'Transaction settled. Escrow was automatically released to both wallets.'
                        : isEscrowLocked
                        ? 'Funds safely held in NOWPayments smart vault until mutual session delivery.'
                        : 'Commitment deposit required to lock session schedule.'}
                    </span>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* If pending escrow deposit */}
                    {swap.status === 'escrow_deposit_required' && (
                      <button
                        id={`deposit-escrow-btn-${swap.id}`}
                        onClick={() => onOpenCheckout(swap)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        Deposit ${swap.escrowDepositUSD} via NOWPayments
                      </button>
                    )}

                    {/* If locked in escrow, allow joining session and confirming delivery */}
                    {isEscrowLocked && swap.status !== 'completed' && (
                      <>
                        {swap.meetingLink && (
                          <a
                            href={swap.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5 text-indigo-600" />
                            Join Video Room
                          </a>
                        )}

                        {!myDeliveryDone ? (
                          <button
                            id={`confirm-delivery-btn-${swap.id}`}
                            onClick={() => onConfirmDelivery(swap.id, isRequester ? 'requester' : 'recipient')}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirm I Taught My Session
                          </button>
                        ) : !peerDeliveryDone ? (
                          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-600 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            Awaiting {peer.name}'s Confirmation
                          </div>
                        ) : null}
                      </>
                    )}

                    {/* If completed */}
                    {swap.status === 'completed' && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                        Escrow 100% Settled
                      </span>
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
