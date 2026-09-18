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
  Scissors,
  Sparkles,
  Gamepad2,
  CookingPot,
  Camera,
  Dumbbell,
  BookOpen
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

// ✅ EXPANDED CATEGORIES FOR ALL SKILLS
const CATEGORIES: ('All' | SkillCategory)[] = [
  'All',
  'Programming & Tech',
  'Languages',
  'Design & Creative',
  'Music & Audio',
  'Business & Finance',
  'Fitness & Wellness',
  'Academics & Science',
  'Crafts & DIY',
  'Gaming & Esports',
  'Cooking & Food',
  'Photography & Video',
  'Sports & Recreation',
  'Life Skills & Hobbies',
  'Volunteering & Community'
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'All': Compass,
  'Programming & Tech': Code2,
  'Languages': Globe2,
  'Design & Creative': Palette,
  'Music & Audio': Music,
  'Business & Finance': Briefcase,
  'Fitness & Wellness': Heart,
  'Academics & Science': BookOpen,
  'Crafts & DIY': Scissors,
  'Gaming & Esports': Gamepad2,
  'Cooking & Food': CookingPot,
  'Photography & Video': Camera,
  'Sports & Recreation': Dumbbell,
  'Life Skills & Hobbies': Sparkles,
  'Volunteering & Community': GraduationCap
};

const SKILL_LEVELS: ('All' | ProficiencyLevel)[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

// Helper to map Django API response to Frontend Types
const mapDjangoTalent = (t: any): TalentListing => ({
  id: String(t.id),
  userId: String(t.teacher?.id || ''),
  user: {
    id: String(t.teacher?.id || ''),
    name: t.teacher?.title || t.teacher?.user?.username || 'Unknown Teacher',
    avatar: t.teacher?.avatar_url || '/placeholder-avatar.svg',
    bio: t.teacher?.bio || '',
    rating: Number(t.teacher?.rating) || 4.5,
    reviewCount: t.teacher?.review_count || 0,
    completedSwaps: t.teacher?.completed_swaps || 0,
    joinedDate: new Date().toISOString(),
    badges: t.teacher?.badges || [],
  },
  title: t.title || 'Untitled Listing',
  category: (t.category as SkillCategory) || 'Other',
  description: t.description || '',
  topicsCovered: t.topics_covered || [],
  teachSkills: t.teach_skills || [],
  wantedSkills: t.wanted_skills || [],
  proficiencyLevel: (t.proficiency_level as ProficiencyLevel) || 'Intermediate',
  format: (t.session_format as any) || '1-on-1 Live Video',
  sessionDurationMins: t.session_duration_mins || 60,
  availability: t.availability || 'Flexible',
  escrowDepositUSD: t.escrow_deposit_usd || 0,
  engagementMode: t.is_volunteer ? 'volunteer' : (t.available_for_hire ? 'swap_or_hire' : 'swap_only'),
  availableForSwap: !t.is_volunteer,
  availableForHire: !t.is_volunteer,
  hireRateUSD: t.is_volunteer ? 0 : (t.escrow_deposit_usd || 0),
  hireRateType: 'session',
  studentPrerequisites: t.student_prerequisites,
  portfolioUrl: t.portfolio_url,
  isVolunteer: t.is_volunteer || false,
});

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [talents, setTalents] = useState<TalentListing[]>([]);
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  
  // ✅ INCLUSIVE STUDENT MODE STATE (Grade 1 → Masters+)
  const [isStudentMode, setIsStudentMode] = useState(false);
  const [studentYear, setStudentYear] = useState<string>('grade-6');
  
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

  // ✅ REAL DJANGO API INTEGRATION
  useEffect(() => {
    const loadRealData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/talents/');
        
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : (data.results || []);
          const mapped = rawList.map(mapDjangoTalent);
          setTalents(mapped);
          
          if (mapped.length > 0 && !currentUser) {
            setCurrentUser(mapped[0].user);
          }
          
          console.log(`✅ Loaded ${mapped.length} real talents from Django!`);
        } else {
          console.warn('⚠️ Django API returned error:', res.status);
        }
      } catch (err) {
        console.error('❌ Failed to connect to Django backend.', err);
        setBannerNotice('Backend offline. Showing cached/local data only.');
        setTimeout(() => setBannerNotice(null), 4000);
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, []);

  // ✅ SMART FILTER LOGIC WITH INCLUSIVE STUDENT MODE
  const filteredTalents = talents.filter((t) => {
    // 1. Basic Filters
    const matchesSearch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teachSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || t.proficiencyLevel === selectedLevel;
    const matchesMode = selectedMode === 'All' || 
      (selectedMode === 'swap' && t.availableForSwap) ||
      (selectedMode === 'hire' && t.availableForHire);

    // 2. Student Mode Smart Matching (Grade 1 → Masters+)
    if (isStudentMode) {
      const techCategories = ['Programming & Tech', 'Design & Creative', 'Academics & Science'];
      const creativeCategories = ['Music & Audio', 'Crafts & DIY', 'Design & Creative', 'Photography & Video'];
      const lifeCategories = ['Cooking & Food', 'Life Skills & Hobbies', 'Fitness & Wellness', 'Languages'];
      
      // School Levels (Grades 1-12): Focus on basics, creativity, and volunteers
      if (studentYear.startsWith('grade')) {
        return matchesSearch && (
          t.proficiencyLevel === 'Beginner' || 
          t.isVolunteer || 
          creativeCategories.includes(t.category) ||
          lifeCategories.includes(t.category)
        );
      }
      
      // Undergraduate Years 1-2: Foundational tech + volunteers
      if (studentYear === 'undergrad-1' || studentYear === 'undergrad-2') {
        return matchesSearch && (
          (techCategories.includes(t.category) && ['Beginner', 'Intermediate'].includes(t.proficiencyLevel)) ||
          t.isVolunteer ||
          creativeCategories.includes(t.category)
        );
      }
      
      // Undergraduate Years 3-4+: Advanced tech + specialized skills
      if (studentYear === 'undergrad-3' || studentYear === 'undergrad-4') {
        return matchesSearch && (
          techCategories.includes(t.category) && 
          ['Intermediate', 'Advanced'].includes(t.proficiencyLevel)
        );
      }
      
      // Masters / PhD: Expert-level academic and research skills
      if (studentYear === 'masters' || studentYear === 'phd') {
        return matchesSearch && (
          techCategories.includes(t.category) && 
          ['Advanced', 'Expert'].includes(t.proficiencyLevel)
        );
      }
      
      // Professional Upskilling: Business, Tech, Advanced skills
      if (studentYear === 'professional') {
        return matchesSearch && (
          ['Business & Finance', 'Programming & Tech', 'Design & Creative'].includes(t.category) &&
          ['Intermediate', 'Advanced', 'Expert'].includes(t.proficiencyLevel)
        );
      }
      
      // Hobbyist & Curious Learner: Creative, Life Skills, Volunteers
      if (studentYear === 'hobbyist') {
        return matchesSearch && (
          creativeCategories.includes(t.category) || 
          lifeCategories.includes(t.category) ||
          t.isVolunteer ||
          ['Gaming & Esports', 'Sports & Recreation'].includes(t.category)
        );
      }
      
      // Retiree & Community: Volunteering, Life Skills, Gentle hobbies
      if (studentYear === 'retiree') {
        return matchesSearch && (
          t.isVolunteer ||
          lifeCategories.includes(t.category) ||
          ['Crafts & DIY', 'Music & Audio', 'Languages'].includes(t.category)
        );
      }
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesMode;
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
        return { ...s, status: 'locked_in_escrow', nowPaymentStatus: 'finished' };
      }
      return s;
    }));
    setBannerNotice('Commitment deposit confirmed in escrow.');
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleConfirmDelivery = async (swapId: string, role: 'requester' | 'recipient') => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/swaps/${swapId}/confirm-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const data = await res.json();
        setSwaps(prev => prev.map(s => s.id === swapId ? data.swap : s));
        setBannerNotice(data.bothCompleted ? 'Both peers confirmed! Escrow released.' : 'Session delivery confirmed.');
        setTimeout(() => setBannerNotice(null), 5000);
      }
    } catch (err) { console.error('Error confirming delivery', err); }
  };

  const handleReleaseEscrow = async (swapId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/swaps/${swapId}/release-escrow`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSwaps(prev => prev.map(s => s.id === swapId ? data.swap : s));
        setBannerNotice('Escrow released back to participants.');
        setTimeout(() => setBannerNotice(null), 5000);
      }
    } catch (err) { console.error('Error releasing escrow', err); }
  };

  const handleDeleteTalent = async (talentId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/talents/${talentId}`, { method: 'DELETE' });
      if (res.ok) {
        setTalents(prev => prev.filter(t => t.id !== talentId));
        setBannerNotice('Listing removed.');
        setTimeout(() => setBannerNotice(null), 4000);
      }
    } catch (err) { console.error('Error deleting talent', err); }
  };

  if (!currentUser && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8FF] text-violet-900">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-violet-600" />
          <span className="text-sm font-medium">Connecting to Django Backend...</span>
        </div>
      </div>
    );
  }

  const displayUser = currentUser || {
    id: 'demo', name: 'Guest User', avatar: '/placeholder-avatar.svg', 
    bio: '', rating: 0, reviewCount: 0, completedSwaps: 0, 
    joinedDate: '', badges: []
  };

  const activeSwapsCount = swaps.filter(
    s => (s.requesterId === displayUser.id || s.recipientId === displayUser.id) &&
         (s.status === 'locked_in_escrow' || s.status === 'escrow_deposit_required')
  ).length;

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedLevel !== 'All' || selectedMode !== 'All';
  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedMode !== 'All' ? 1 : 0) + (selectedLevel !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedMode('All');
    setSelectedFormat('All');
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#2E1065] flex flex-col font-sans selection:bg-violet-200 selection:text-violet-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={[displayUser]}
        currentUser={displayUser}
        setCurrentUser={setCurrentUser}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        activeSwapsCount={activeSwapsCount}
      />

      {bannerNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-violet-900 text-white px-5 py-3 rounded-full shadow-lg border border-violet-700 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <p className="font-normal">{bannerNotice}</p>
          <button onClick={() => setBannerNotice(null)} className="text-violet-300 hover:text-white ml-1 cursor-pointer">✕</button>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-16 flex-1 w-full">
        {activeTab === 'explore' && (
          <div className="space-y-12 sm:space-y-16">
            {/* ✅ HERO SECTION WITH FREDOKA FONT */}
            <header className="text-center max-w-3xl mx-auto space-y-4 py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-2 border border-violet-200">
                <Sparkles className="w-3 h-3" /> Peer-to-Peer Learning
              </div>
              <h1 
                className="text-5xl md:text-6xl font-bold text-violet-950 tracking-tight leading-tight" 
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Swap Skills. <span className="text-violet-600">Grow Together.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                Connect with peers for personalized learning. Verified students get free access to volunteer mentors.
              </p>
            </header>

            {/* ✅ INCLUSIVE STUDENT MODE TOGGLE */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button 
                onClick={() => setIsStudentMode(!isStudentMode)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm ${
                  isStudentMode 
                    ? 'bg-violet-600 text-white shadow-violet-200 ring-2 ring-violet-100' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                {isStudentMode ? 'Student Mode Active' : 'Switch to Student Mode'}
              </button>
              
              {isStudentMode && (
                <select 
                  value={studentYear} 
                  onChange={(e) => setStudentYear(e.target.value)}
                  className="px-4 py-2.5 rounded-full text-sm font-medium border border-violet-200 bg-white text-violet-900 focus:ring-2 focus:ring-violet-500 outline-none shadow-sm cursor-pointer min-w-[220px]"
                >
                  <optgroup label="🏫 School">
                    <option value="grade-1">Grade 1-5 (Elementary)</option>
                    <option value="grade-6">Grade 6-8 (Middle School)</option>
                    <option value="grade-9">Grade 9-12 (High School)</option>
                  </optgroup>
                  <optgroup label=" University">
                    <option value="undergrad-1">Undergraduate Year 1</option>
                    <option value="undergrad-2">Undergraduate Year 2</option>
                    <option value="undergrad-3">Undergraduate Year 3</option>
                    <option value="undergrad-4">Undergraduate Year 4+</option>
                  </optgroup>
                  <optgroup label="🔬 Postgraduate">
                    <option value="masters">Masters / MPhil</option>
                    <option value="phd">PhD / Research</option>
                  </optgroup>
                  <optgroup label="🌱 Lifelong Learning">
                    <option value="professional">Professional Upskilling</option>
                    <option value="hobbyist">Hobbyist & Curious Learner</option>
                    <option value="retiree">Retiree & Community</option>
                  </optgroup>
                </select>
              )}
            </div>

            {/* Search & Filters */}
            <div className="max-w-2xl mx-auto w-full space-y-3">
              <div className="flex items-center gap-2.5">
                <SearchWithSuggestions
                  id="explore-search-input"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  availableTalents={talents}
                  placeholder="Search any skill, teacher, or topic..."
                />
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`px-4 sm:px-5 py-3.5 rounded-full text-xs font-medium transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer shrink-0 border ${
                    isFiltersOpen || activeFilterCount > 0
                      ? 'bg-violet-900 text-white border-violet-900 shadow-xs'
                      : 'bg-violet-50/30 text-violet-900 border-violet-200 hover:bg-violet-100 shadow-2xs'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {isFiltersOpen && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-violet-100 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-violet-50">
                    <span className="font-semibold text-sm text-violet-950">Refine Listings</span>
                    {hasActiveFilters && (
                      <button onClick={resetFilters} className="text-xs text-violet-600 hover:text-violet-800 font-semibold cursor-pointer">Reset all</button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-violet-950 block">Learning Format</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(['All', 'swap', 'hire'] as const).map((m) => (
                        <button key={m} onClick={() => setSelectedMode(m)}
                          className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                            selectedMode === m ? 'bg-violet-900 text-white border-violet-900' : 'bg-violet-50/30 text-gray-600 border-violet-100 hover:border-violet-300'
                          }`}
                        >
                          {m === 'All' ? 'All Formats' : m === 'swap' ? 'Skill Trade' : 'Paid Lesson'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-violet-950 block">Skill Level</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {SKILL_LEVELS.map((lvl) => (
                        <button key={lvl} onClick={() => setSelectedLevel(lvl)}
                          className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
                            selectedLevel === lvl ? 'bg-violet-900 text-white border-violet-900' : 'bg-violet-50/30 text-gray-600 border-violet-100 hover:border-violet-300'
                          }`}
                        >
                          {lvl === 'All' ? 'All Levels' : lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-violet-950 block">Topic Area</label>
                    <div className="flex items-center gap-2 flex-wrap max-h-48 overflow-y-auto">
                      {CATEGORIES.map((cat) => {
                        const Icon = CATEGORY_ICONS[cat] || Compass;
                        return (
                          <button key={cat} onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                              selectedCategory === cat ? 'bg-violet-600 text-white border-violet-600' : 'bg-violet-50/30 text-gray-600 border-violet-100 hover:border-violet-300'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Talent Cards Grid - INCREASED GAP FOR BREATHING ROOM */}
            {loading ? (
              <div className="py-20 text-center text-violet-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-violet-600" />
                <p className="text-xs font-normal">Finding learning sessions...</p>
              </div>
            ) : filteredTalents.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 shadow-sm border border-violet-100">
                <h3 className="text-base font-semibold text-violet-950">No listings found yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">Try adjusting your search query or be the first to share a skill.</p>
                <button onClick={() => setIsPostModalOpen(true)} className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-all cursor-pointer shadow-md shadow-violet-200">
                  Share What You Teach
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTalents.map((talent) => (
                  <TalentCard
                    key={talent.id}
                    talent={talent}
                    currentUser={displayUser}
                    onInitiateSwap={(t) => setProposalTargetTalent(t)}
                    onInitiateHire={(t) => setHireTargetTalent(t)}
                    onDeleteTalent={handleDeleteTalent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'swaps' && (
          <MySwapsView swaps={swaps} currentUser={displayUser} onOpenCheckout={(s) => setCheckoutSwap(s)} onConfirmDelivery={handleConfirmDelivery} onReleaseEscrow={handleReleaseEscrow} onOpenPostModal={() => setIsPostModalOpen(true)} />
        )}
        {activeTab === 'vault' && <NowPaymentsVaultView />}
        {activeTab === 'how-it-works' && <HowItWorksView onExplore={() => setActiveTab('explore')} onPostSkill={() => setIsPostModalOpen(true)} />}
        {activeTab === 'django' && <DjangoReferenceView />}
      </main>

      <PostTalentModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} currentUser={displayUser} onTalentCreated={handleTalentCreated} />
      <SwapProposalModal isOpen={Boolean(proposalTargetTalent)} onClose={() => setProposalTargetTalent(null)} targetTalent={proposalTargetTalent} currentUser={displayUser} onSwapProposed={handleSwapProposed} />
      <NowPaymentsCheckoutModal isOpen={Boolean(checkoutSwap)} onClose={() => setCheckoutSwap(null)} swap={checkoutSwap} onPaymentConfirmed={handlePaymentConfirmed} />
      <HireBookingModal isOpen={Boolean(hireTargetTalent)} onClose={() => setHireTargetTalent(null)} targetTalent={hireTargetTalent} currentUser={displayUser} onHireBooked={handleHireBooked} />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} onGetStarted={() => { setIsHowItWorksOpen(false); setActiveTab('explore'); }} />

      <footer className="mt-auto border-t border-violet-100 bg-white/50 py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-violet-950">SwapTalent</span>
            <span>•</span>
            <span>Peer-to-Peer Skill Exchange</span>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setActiveTab('explore')} className="hover:text-violet-600 transition-colors cursor-pointer">Explore</button>
            <button onClick={() => setActiveTab('swaps')} className="hover:text-violet-600 transition-colors cursor-pointer">My Sessions</button>
            <button onClick={() => setActiveTab('vault')} className="hover:text-violet-600 transition-colors cursor-pointer">Payments</button>
          </div>
        </div>
      </footer>
    </div>
  );
} 
