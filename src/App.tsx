import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowLeftRight, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  SlidersHorizontal,
  X,
  Compass,
  Code2,
  Globe2,
  Palette,
  Music,
  Briefcase,
  Heart,
  GraduationCap,
  Scissors
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { TalentCard } from './components/TalentCard';
import { PostTalentModal } from './components/PostTalentModal';
import { SwapProposalModal } from './components/SwapProposalModal';
import { HireBookingModal } from './components/HireBookingModal';
import { NowPaymentsCheckoutModal } from './components/NowPaymentsCheckoutModal';
import { MySwapsView } from './components/MySwapsView';
import { NowPaymentsVaultView } from './components/NowPaymentsVaultView';
import { DjangoReferenceView } from './components/DjangoReferenceView';
import { HowItWorksModal } from './components/HowItWorksModal';
import { HowItWorksView } from './components/HowItWorksView';
import { SearchWithSuggestions } from './components/SearchWithSuggestions';

import { TalentListing, SwapRequest, User, SkillCategory, ProficiencyLevel } from './types';

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

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'All': Compass,
  'Programming & Tech': Code2,
  'Languages': Globe2,
  'Design & Creative': Palette,
  'Music & Audio': Music,
  'Business & Finance': Briefcase,
  'Fitness & Wellness': Heart,
  'Academics & Science': GraduationCap,
  'Crafts & DIY': Scissors
};

const SKILL_LEVELS: ('All' | ProficiencyLevel)[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [talents, setTalents] = useState<TalentListing[]>([]);
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  
  const [activeTab, setActiveTab] = useState<'explore' | 'swaps' | 'vault' | 'django'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | ProficiencyLevel>('All');
  const [selectedMode, setSelectedMode] = useState<'All' | 'swap' | 'hire'>('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [proposalTargetTalent, setProposalTargetTalent] = useState<TalentListing | null>(null);
  const [hireTargetTalent, setHireTargetTalent] = useState<TalentListing | null>(null);
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
    const matchesLevel = selectedLevel === 'All' || t.proficiencyLevel === selectedLevel;
    const matchesFormat = selectedFormat === 'All' || t.format === selectedFormat;
    const matchesMode = selectedMode === 'All' || 
      (selectedMode === 'swap' && (t.engagementMode === 'swap_only' || t.engagementMode === 'swap_or_hire' || !t.engagementMode)) ||
      (selectedMode === 'hire' && (t.engagementMode === 'hire_only' || t.engagementMode === 'swap_or_hire'));

    return matchesSearch && matchesCategory && matchesLevel && matchesFormat && matchesMode;
  });

  // Handlers
  const handleTalentCreated = (newTalent: TalentListing) => {
    setTalents([newTalent, ...talents]);
    setBannerNotice(`Your teaching offer "${newTalent.title}" is now live.`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleSwapProposed = (newSwap: SwapRequest) => {
    setSwaps([newSwap, ...swaps]);
    setActiveTab('swaps');
    setCheckoutSwap(newSwap);
    setBannerNotice(`Swap proposal sent to ${newSwap.recipient.name}.`);
    setTimeout(() => setBannerNotice(null), 6000);
  };

  const handleHireBooked = (newHire: SwapRequest) => {
    setSwaps([newHire, ...swaps]);
    setActiveTab('swaps');
    setCheckoutSwap(newHire);
    setBannerNotice(`Session booked with ${newHire.recipient.name}. Please complete payment in escrow to confirm.`);
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
    setBannerNotice('Commitment deposit confirmed in escrow.');
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
          setBannerNotice('Both peers confirmed! Escrow funds released.');
        } else {
          setBannerNotice('Session delivery confirmed.');
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
        setBannerNotice('Listing removed.');
        setTimeout(() => setBannerNotice(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting talent', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-600">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-neutral-900" />
          <span className="text-sm font-medium">Loading SwapTalent...</span>
        </div>
      </div>
    );
  }

  const activeSwapsCount = swaps.filter(
    s => (s.requesterId === currentUser.id || s.recipientId === currentUser.id) &&
         (s.status === 'locked_in_escrow' || s.status === 'escrow_deposit_required')
  ).length;

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedFormat !== 'All' || selectedMode !== 'All';

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + 
                            (selectedMode !== 'All' ? 1 : 0) + 
                            (selectedLevel !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedMode('All');
    setSelectedFormat('All');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#222222] flex flex-col font-sans selection:bg-[#FFE0E6] selection:text-[#FF385C]">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        activeSwapsCount={activeSwapsCount}
      />

      {/* Floating Notice Toast */}
      {bannerNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#222222] text-[#FAF8F5] px-5 py-3 rounded-full shadow-xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <p className="font-normal">{bannerNotice}</p>
          <button
            onClick={() => setBannerNotice(null)}
            className="text-stone-400 hover:text-white ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content with generous side breathing room */}
      <main className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-16 flex-1 w-full">
        {/* TAB 1: EXPLORE TALENTS */}
        {activeTab === 'explore' && (
          <div className="space-y-12 sm:space-y-16">
            {/* Hero Section: Single essential line with generous spacing */}
            <header className="text-center max-w-2xl mx-auto space-y-3 pb-2 sm:pb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#222222] leading-tight">
                Teach what you know. Learn what you want.
              </h1>
              <p className="text-sm sm:text-base text-[#717171] font-normal leading-relaxed">
                Exchange skills 1-on-1 with verified peers or hire teachers directly.
              </p>
            </header>

            {/* Streamlined Search & Collapsed Filter Control */}
            <div className="max-w-2xl mx-auto w-full space-y-3">
              {/* Primary Search Bar with single Filters button */}
              <div className="flex items-center gap-2.5">
                <SearchWithSuggestions
                  id="explore-search-input"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  availableTalents={talents}
                  placeholder="Search any skill, teacher, or topic (e.g. React, Cooking, Guitar)..."
                />

                {/* Single Filters Button */}
                <button
                  id="toggle-filters-panel-btn"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`px-4 sm:px-5 py-3.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 border ${
                    isFiltersOpen || activeFilterCount > 0
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white text-[#222222] border-stone-200/90 hover:bg-stone-50 shadow-2xs'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#FF385C] text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Collapsed Filter Panel (Category, Mode, and Level together) */}
              {isFiltersOpen && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#222222]">Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="text-xs text-[#717171]">({activeFilterCount} active)</span>
                      )}
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-[#FF385C] hover:text-[#E00B41] font-semibold cursor-pointer transition-colors"
                      >
                        Reset all
                      </button>
                    )}
                  </div>

                  {/* Section 1: Engagement Mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#222222] block">
                      Engagement Mode
                    </label>
                    <div id="mode-filter-bar" className="flex items-center gap-2 flex-wrap">
                      {(['All', 'swap', 'hire'] as const).map((m) => {
                        const label = m === 'All' ? 'All Modes' : m === 'swap' ? 'Skill Swap' : 'Hire Teacher';
                        const isSelected = selectedMode === m;
                        return (
                          <button
                            key={m}
                            id={`filter-mode-${m}`}
                            onClick={() => setSelectedMode(m)}
                            className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#222222] text-white border-[#222222] font-semibold shadow-2xs'
                                : 'bg-stone-50 text-[#717171] border-stone-200/80 hover:border-stone-300 hover:text-[#222222]'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Proficiency Level */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#222222] block">
                      Proficiency Level
                    </label>
                    <div id="skill-level-filter-bar" className="flex items-center gap-2 flex-wrap">
                      {SKILL_LEVELS.map((lvl) => {
                        const isSelected = selectedLevel === lvl;
                        return (
                          <button
                            key={lvl}
                            id={`filter-level-${lvl.toLowerCase()}`}
                            onClick={() => setSelectedLevel(lvl)}
                            className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#222222] text-white border-[#222222] font-semibold shadow-2xs'
                                : 'bg-stone-50 text-[#717171] border-stone-200/80 hover:border-stone-300 hover:text-[#222222]'
                            }`}
                          >
                            {lvl === 'All' ? 'All Levels' : lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Categories */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#222222] block">
                      Category
                    </label>
                    <div id="category-filter-bar" className="flex items-center gap-2 flex-wrap">
                      {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        const Icon = CATEGORY_ICONS[cat] || Compass;
                        return (
                          <button
                            key={cat}
                            id={`category-pill-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                              isSelected
                                ? 'bg-[#FF385C] text-white border-[#FF385C] font-semibold shadow-2xs'
                                : 'bg-stone-50 text-[#717171] border-stone-200/80 hover:border-stone-300 hover:text-[#222222]'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#717171]'}`} />
                            <span>{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-[#717171]">
                      {filteredTalents.length} {filteredTalents.length === 1 ? 'listing matches' : 'listings match'}
                    </span>
                    <button
                      onClick={() => setIsFiltersOpen(false)}
                      className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#222222] hover:bg-black transition-all cursor-pointer shadow-xs"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              )}

              {/* Minimalist Active Filters Summary Pill (Shown when panel is closed and filters exist) */}
              {!isFiltersOpen && activeFilterCount > 0 && (
                <div className="flex items-center justify-center gap-2 flex-wrap pt-1 text-xs text-[#717171]">
                  <span>Filters:</span>
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-stone-200 text-[#222222] text-[11px]">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('All')} className="text-stone-400 hover:text-stone-700 cursor-pointer">✕</button>
                    </span>
                  )}
                  {selectedMode !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-stone-200 text-[#222222] text-[11px]">
                      {selectedMode === 'swap' ? 'Swap' : 'Hire'}
                      <button onClick={() => setSelectedMode('All')} className="text-stone-400 hover:text-stone-700 cursor-pointer">✕</button>
                    </span>
                  )}
                  {selectedLevel !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-stone-200 text-[#222222] text-[11px]">
                      {selectedLevel}
                      <button onClick={() => setSelectedLevel('All')} className="text-stone-400 hover:text-stone-700 cursor-pointer">✕</button>
                    </span>
                  )}
                  <button
                    onClick={resetFilters}
                    className="text-[#FF385C] hover:underline font-medium text-[11px] ml-1 cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Talent Cards Grid (Airbnb 3-column layout with generous spacing) */}
            {loading ? (
              <div className="py-20 text-center text-[#717171]">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#717171]" />
                <p className="text-xs font-normal">Loading listings...</p>
              </div>
            ) : filteredTalents.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 shadow-xs">
                <h3 className="text-base font-medium text-[#222222]">
                  No listings found
                </h3>
                <p className="text-xs text-[#717171] max-w-sm mx-auto">
                  Try adjusting your search query, selecting "All Levels" or "All" categories, or share what you teach first.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all cursor-pointer shadow-xs"
                  >
                    Post What You Teach
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredTalents.map((talent) => (
                  <TalentCard
                    key={talent.id}
                    talent={talent}
                    currentUser={currentUser}
                    onInitiateSwap={(t) => setProposalTargetTalent(t)}
                    onInitiateHire={(t) => setHireTargetTalent(t)}
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

        {/* TAB 4: HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <HowItWorksView
            onExplore={() => setActiveTab('explore')}
            onPostSkill={() => setIsPostModalOpen(true)}
          />
        )}

        {/* TAB 5: DJANGO REFERENCE */}
        {activeTab === 'django' && (
          <DjangoReferenceView />
        )}
      </main>

      {/* MODAL 1: Step-by-Step Post What You Teach */}
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

      {/* MODAL 4: Book & Pay (Hire Mode) */}
      <HireBookingModal
        isOpen={Boolean(hireTargetTalent)}
        onClose={() => setHireTargetTalent(null)}
        targetTalent={hireTargetTalent}
        currentUser={currentUser}
        onHireBooked={handleHireBooked}
      />

      {/* MODAL 5: How It Works Walkthrough */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onGetStarted={() => {
          setIsHowItWorksOpen(false);
          setActiveTab('explore');
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/60 bg-white/70 py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#717171]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#222222]">SwapTalent</span>
            <span>•</span>
            <span>Peer-to-Peer Skill Exchange</span>
            <span>•</span>
            <span>NOWPayments Escrow Protected</span>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setActiveTab('explore')} className="hover:text-[#FF385C] transition-colors cursor-pointer">
              Explore
            </button>
            <button onClick={() => setActiveTab('how-it-works')} className="hover:text-[#FF385C] transition-colors cursor-pointer">
              How it works
            </button>
            <button onClick={() => setActiveTab('swaps')} className="hover:text-[#FF385C] transition-colors cursor-pointer">
              My Sessions
            </button>
            <button onClick={() => setActiveTab('vault')} className="hover:text-[#FF385C] transition-colors cursor-pointer">
              Escrow Vault
            </button>
            <button onClick={() => setActiveTab('django')} className="hover:text-[#FF385C] transition-colors cursor-pointer">
              Django Specs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
