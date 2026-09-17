export type SkillCategory =
  | 'Programming & Tech'
  | 'Languages'
  | 'Design & Creative'
  | 'Music & Audio'
  | 'Business & Finance'
  | 'Fitness & Wellness'
  | 'Academics & Science'
  | 'Crafts & DIY';

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
  category: SkillCategory;
  description: string;
  topicsCovered: string[];
  teachSkills: string[];
  wantedSkills: string[]; // What they want in return
  proficiencyLevel: ProficiencyLevel;
  format: SessionFormat;
  sessionDurationMins: number;
  experienceYears: number;
  availability: string;
  escrowDepositUSD: number; // Commitment deposit handled via NOWPayments
  studentPrerequisites?: string;
  portfolioUrl?: string;
  createdAt: string;
}

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
  requesterId: string;
  requester: User;
  recipientId: string;
  recipient: User;
  talentListingId: string;
  talentListing: TalentListing;
  requesterOfferTitle: string; // What requester will teach in exchange
  requesterOfferDescription: string;
  status: SwapStatus;
  sessionDateProposal: string;
  sessionNotes?: string;
  meetingLink?: string;
  escrowDepositUSD: number;
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
