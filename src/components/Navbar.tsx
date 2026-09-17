import React, { useState } from 'react';
import { User } from '../types';
import { 
  ArrowLeftRight, 
  Plus, 
  ChevronDown,
  Check
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'swaps' | 'vault' | 'django';
  setActiveTab: (tab: 'explore' | 'swaps' | 'vault' | 'django') => void;
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  onOpenPostModal: () => void;
  onOpenHowItWorks?: () => void;
  activeSwapsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  users,
  currentUser,
  setCurrentUser,
  onOpenPostModal,
  onOpenHowItWorks,
  activeSwapsCount
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE6DF]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button 
              id="brand-logo-btn"
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#FF385C] flex items-center justify-center font-semibold text-sm shadow-xs transition-transform group-hover:scale-105">
                ST
              </div>
              <div>
                <span className="font-semibold text-lg sm:text-xl tracking-tight text-[#222222]">
                  SwapTalent
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                id="nav-tab-explore"
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-stone-200/70 text-[#222222] font-semibold shadow-2xs'
                    : 'text-[#717171] hover:text-[#222222] hover:bg-stone-100'
                }`}
              >
                Explore
              </button>

              <button
                id="nav-tab-swaps"
                onClick={() => setActiveTab('swaps')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer relative flex items-center gap-1.5 ${
                  activeTab === 'swaps'
                    ? 'bg-stone-200/70 text-[#222222] font-semibold shadow-2xs'
                    : 'text-[#717171] hover:text-[#222222] hover:bg-stone-100'
                }`}
              >
                My Sessions
                {activeSwapsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FFF0F2] text-[#FF385C] text-[10px] font-semibold">
                    {activeSwapsCount}
                  </span>
                )}
              </button>

              <button
                id="nav-tab-vault"
                onClick={() => setActiveTab('vault')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'vault'
                    ? 'bg-stone-200/70 text-[#222222] font-semibold shadow-2xs'
                    : 'text-[#717171] hover:text-[#222222] hover:bg-stone-100'
                }`}
              >
                My Payments
              </button>

              <button
                id="nav-tab-how-it-works"
                onClick={() => setActiveTab('how-it-works')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'how-it-works'
                    ? 'bg-stone-200/70 text-[#222222] font-semibold shadow-2xs'
                    : 'text-[#717171] hover:text-[#222222] hover:bg-stone-100'
                }`}
              >
                How it works
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Post CTA */}
            <button
              id="btn-post-talent-header"
              onClick={onOpenPostModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all duration-200 cursor-pointer shadow-xs hover:shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Teach a Skill</span>
            </button>

            {/* Peer Switcher */}
            <div className="relative">
              <button
                id="user-profile-switcher-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-stone-200/90 hover:shadow-md transition-all cursor-pointer text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-[#222222] leading-tight">
                    {currentUser.name}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#717171]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200/80 shadow-xl py-2 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider">
                      Switch Peer Persona
                    </p>
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        id={`switch-user-${u.id}`}
                        onClick={() => {
                          setCurrentUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-stone-50 transition-colors cursor-pointer ${
                          u.id === currentUser.id ? 'bg-stone-50 font-semibold' : ''
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#222222] truncate font-medium">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-[#717171] truncate">
                            {u.title}
                          </p>
                        </div>
                        {u.id === currentUser.id && (
                          <Check className="w-3.5 h-3.5 text-[#FF385C] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-stone-200/60 gap-1.5 no-scrollbar">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'explore' ? 'bg-stone-200 text-[#222222] font-semibold' : 'text-[#717171]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('swaps')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'swaps' ? 'bg-stone-200 text-[#222222] font-semibold' : 'text-[#717171]'
            }`}
          >
            My Sessions {activeSwapsCount > 0 && `(${activeSwapsCount})`}
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'vault' ? 'bg-stone-200 text-[#222222] font-semibold' : 'text-[#717171]'
            }`}
          >
            My Payments
          </button>
          <button
            id="nav-tab-how-it-works-mobile"
            onClick={() => setActiveTab('how-it-works')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'how-it-works' ? 'bg-stone-200 text-[#222222] font-semibold' : 'text-[#717171]'
            }`}
          >
            How it works
          </button>
        </div>
      </div>
    </header>
  );
};
