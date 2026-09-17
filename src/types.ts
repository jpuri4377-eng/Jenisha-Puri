export type SkillCategory = string;

export type EngagementMode = 'swap_only' | 'hire_only' | 'swap_or_hire';

export type SessionFormat = '1-on-1 Live Video' | 'Pair Programming / Live Collab' | 'Async Review & Feedback' | 'Interactive Workshop';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  joinedDate: string;
  cryptoWalletAddress?: string;
  badges: string[];
}

export interface TalentListing {
  id: string;
  userId: string;
  user: User;
  title: string; // What they teach
  category: string; // Dynamic category: free text or suggested
  description: string;
  topicsCovered: string[];
  teachSkills: string[];
  wantedSkills: string[]; // What they want in return (if swap is enabled)
  proficiencyLevel: ProficiencyLevel;
  format: SessionFormat;
  sessionDurationMins: number;
  experienceYears: number;
  availability: string;
  escrowDepositUSD: number; // Commitment deposit for swaps
  studentPrerequisites?: string;
  portfolioUrl?: string;
  createdAt: string;

  // Swap vs Hire (Pay to Learn) settings
  availableForSwap?: boolean;
  availableForHire?: boolean;
  hireRateUSD?: number; // e.g. 35
  hireRateType?: 'session' | 'hour'; // e.g. 'session' or 'hour'
}

export type SwapType = 'swap' | 'hire';

export type SwapStatus =
  | 'pending_acceptance'
  | 'escrow_deposit_required'
  | 'locked_in_escrow'
  | 'in_session'
  | 'delivered_pending_peer'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface SwapRequest {
  id: string;
  type?: SwapType; // 'swap' or 'hire'
  requesterId: string;
  requester: User;
  recipientId: string;
  recipient: User;
  talentListingId: string;
  talentListing: TalentListing;
  requesterOfferTitle: string; // What requester will teach in exchange, or "Pay to Learn (Direct Hire)"
  requesterOfferDescription: string;
  status: SwapStatus;
  sessionDateProposal: string;
  sessionNotes?: string;
  meetingLink?: string;
  escrowDepositUSD: number;
  hirePaymentUSD?: number; // real direct payment amount if hire mode
  hireRateType?: 'session' | 'hour';
  nowPaymentId?: string;
  nowPaymentStatus?: NowPaymentStatus;
  requesterDelivered: boolean;
  recipientDelivered: boolean;
  escrowReleased: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NowPaymentStatus =
  | 'waiting'
  | 'confirming'
  | 'confirmed'
  | 'sending'
  | 'finished'
  | 'failed'
  | 'refunded'
  | 'expired';

export interface NowPaymentTransaction {
  payment_id: string;
  swap_id: string;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  pay_address: string;
  payment_status: NowPaymentStatus;
  created_at: string;
  updated_at: string;
  network?: string;
  tx_hash?: string;
  is_sandbox: boolean;
}

export interface CryptoCurrencyOption {
  code: string;
  name: string;
  icon: string;
  network: string;
  rateVsUSD: number;
}
