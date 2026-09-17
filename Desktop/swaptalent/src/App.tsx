import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ArrowLeftRight, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  SlidersHorizontal,
  Layers,
  Coins,
  BookOpen,
  CheckCircle2,
  Lock
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { TalentCard } from './components/TalentCard';
import { PostTalentModal } from './components/PostTalentModal';
import { SwapProposalModal } from './components/SwapProposalModal';
import { NowPaymentsCheckoutModal } from './components/NowPaymentsCheckoutModal';
import { MySwapsView } from './components/MySwapsView';
import { NowPaymentsVaultView } from './components/NowPaymentsVaultView';
import { DjangoReferenceView } from './components/DjangoReferenceView';

import { TalentListing, SwapRequest, User, SkillCategory } from './types';

const CATEGORIES: ('All' | SkillCategory)[] = [
  'All',
  'Programming & Tech',
  'Languages',
  'Design & Creative',
  'Music & Audio',
  'Business & Finance',
  'Fitness & Wellness',
  'Academics & Science',
  'Crafts & DIY'
];

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [talents, setTalents] = useState<TalentListing[]>([]);
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  
  const [activeTab, setActiveTab] = useState<'explore' | 'swaps' | 'vault' | 'django'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [proposalTargetTalent, setProposalTargetTalent] = useState<TalentListing | null>(null);
  const [checkoutSwap, setCheckoutSwap] = useState<SwapRequest | null>(null);

  const [loading, setLoading] = useState(true);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersRes, talentsRes, swapsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/talents'),
        fetch('/api/swaps')
      ]);

      if (usersRes.ok) {
        const uList = await usersRes.json();
        setUsers(uList);
        if (uList.length > 0 && !currentUser) {
          setCurrentUser(uList[0]);
        }
      }

      if (talentsRes.ok) {
        setTalents(await talentsRes.json());
      }

      if (swapsRes.ok) {
        setSwaps(await swapsRes.json());
      }
    } catch (err) {
      console.error('Failed to load SwapTalent data', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter talents
  const filteredTalents = talents.filter((t) => {
    const matchesSearch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teachSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.wantedSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesFormat = selectedFormat === 'All' || t.format === selectedFormat;

    return matchesSearch && matchesCategory && matchesFormat;
  });

  // Handlers
  const handleTalentCreated = (newTalent: TalentListing) => {
    setTalents([newTalent, ...talents]);
    setBannerNotice(`Your teaching offer "${newTalent.title}" was published!`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleSwapProposed = (newSwap: SwapRequest) => {
    setSwaps([newSwap, ...swaps]);
    setActiveTab('swaps');
    // Prompt to deposit escrow right away
    setCheckoutSwap(newSwap);
    setBannerNotice(`Swap proposed with ${newSwap.recipient.name}! Please deposit the commitment escrow.`);
    setTimeout(() => setBannerNotice(null), 6000);
  };

  const handlePaymentConfirmed = (swapId: string) => {
    setSwaps(prev => prev.map(s => {
      if (s.id === swapId) {
        return {
          ...s,
          status: 'locked_in_escrow',
          nowPaymentStatus: 'finished'
        };
      }
      return s;
    }));
    setBannerNotice('Commitment deposit locked in NOWPayments vault! Sessions can now proceed.');
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleConfirmDelivery = async (swapId: string, role: 'requester' | 'recipient') => {
    try {
      const res = await fetch(`/api/swaps/${swapId}/confirm-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });

      if (res.ok) {
        const data = await res.json();
        setSwaps(prev => prev.map(s => s.id === swapId ? data.swap : s));

        if (data.bothCompleted) {
          setBannerNotice('Both peers confirmed! Escrow funds have been successfully released.');
        } else {
          setBannerNotice('Delivery confirmed! Awaiting peer session delivery.');
        }
        setTimeout(() => setBannerNotice(null), 5000);
      }
    } catch (err) {
      console.error('Error confirming delivery', err);
    }
  };

  const handleReleaseEscrow = async (swapId: string) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}/release-escrow`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSwaps(prev => prev.map(s => s.id === swapId ? data.swap : s));
        setBannerNotice('Escrow released back to participants.');
        setTimeout(() => setBannerNotice(null), 5000);
      }
    } catch (err) {
      console.error('Error releasing escrow', err);
    }
  };

  const handleDeleteTalent = async (talentId: string) => {
    try {
      const res = await fetch(`/api/talents/${talentId}`, { method: 'DELETE' });
      if (res.ok) {
        setTalents(prev => prev.filter(t => t.id !== talentId));
        setBannerNotice('Talent listing removed.');
        setTimeout(() => setBannerNotice(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting talent', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Starting SwapTalent...</span>
        </div>
      </div>
    );
  }

  const activeSwapsCount = swaps.filter(
    s => (s.requesterId === currentUser.id || s.recipientId === currentUser.id) &&
         (s.status === 'locked_in_escrow' || s.status === 'escrow_deposit_required')
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        activeSwapsCount={activeSwapsCount}
      />

      {/* Floating Notice Toast */}
      {bannerNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <p className="font-medium">{bannerNotice}</p>
          <button
            onClick={() => setBannerNotice(null)}
            className="text-slate-400 hover:text-white ml-2 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* TAB 1: EXPLORE TALENTS */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Peer-to-Peer Talent Barter
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Teach what you love. <br className="hidden sm:inline" />
                  Learn what you want. <span className="text-indigo-600">No money needed.</span>
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Swap skills directly with verified mentors, creators, and engineers. Every exchange is protected by <strong className="text-slate-900">NOWPayments crypto escrow</strong> to guarantee mutual commitment and eradicate ghosting.
                </p>

                {/* Search Bar */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="explore-search-input"
                      type="text"
                      placeholder="Search skills to learn or teach (e.g. Django, Spanish, Figma, Yoga)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <button
                    id="btn-open-post-teach-hero"
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Post What You Teach
                  </button>
                </div>
              </div>

              {/* Badges footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Peer-to-Peer Barter
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Refundable Escrow Deposits via NOWPayments
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Zero Platform Commission Fees
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Browse by Skill Category
                </h3>
                <span className="text-xs text-slate-500">
                  {filteredTalents.length} teaching offers available
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Talent Cards Grid */}
            {loading ? (
              <div className="py-16 text-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Loading talent listings...</p>
              </div>
            ) : filteredTalents.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No talents found matching your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search terms, selecting "All" categories, or be the first to post what you teach!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer"
                  >
                    Post What You Teach
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredTalents.map((talent) => (
                  <TalentCard
                    key={talent.id}
                    talent={talent}
                    currentUser={currentUser}
                    onInitiateSwap={(t) => setProposalTargetTalent(t)}
                    onDeleteTalent={handleDeleteTalent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY SWAPS & ESCROW TRANSACTIONS */}
        {activeTab === 'swaps' && (
          <MySwapsView
            swaps={swaps}
            currentUser={currentUser}
            onOpenCheckout={(s) => setCheckoutSwap(s)}
            onConfirmDelivery={handleConfirmDelivery}
            onReleaseEscrow={handleReleaseEscrow}
            onOpenPostModal={() => setIsPostModalOpen(true)}
          />
        )}

        {/* TAB 3: NOWPAYMENTS VAULT */}
        {activeTab === 'vault' && (
          <NowPaymentsVaultView />
        )}

        {/* TAB 4: DJANGO REFERENCE */}
        {activeTab === 'django' && (
          <DjangoReferenceView />
        )}
      </main>

      {/* MODAL 1: Post What You Teach */}
      <PostTalentModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        currentUser={currentUser}
        onTalentCreated={handleTalentCreated}
      />

      {/* MODAL 2: Propose Swap */}
      <SwapProposalModal
        isOpen={Boolean(proposalTargetTalent)}
        onClose={() => setProposalTargetTalent(null)}
        targetTalent={proposalTargetTalent}
        currentUser={currentUser}
        onSwapProposed={handleSwapProposed}
      />

      {/* MODAL 3: NOWPayments Escrow Checkout */}
      <NowPaymentsCheckoutModal
        isOpen={Boolean(checkoutSwap)}
        onClose={() => setCheckoutSwap(null)}
        swap={checkoutSwap}
        onPaymentConfirmed={handlePaymentConfirmed}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SwapTalent</span>
            <span>•</span>
            <span>Peer-to-Peer Service Exchange</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> NOWPayments Protected
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('explore')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Explore
            </button>
            <button onClick={() => setActiveTab('swaps')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              My Swaps
            </button>
            <button onClick={() => setActiveTab('vault')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              NOWPayments Vault
            </button>
            <button onClick={() => setActiveTab('django')} className="hover:text-indigo-600 transition-colors cursor-pointer">
              Django Specs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
