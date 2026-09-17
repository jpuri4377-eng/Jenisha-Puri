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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3D6]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button 
              id="brand-logo-btn"
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-[#FDF2EE] text-[#D95338] border border-[#FAD5C8] flex items-center justify-center font-semibold text-sm shadow-2xs transition-transform duration-300 group-hover:scale-105">
                ST
              </div>
              <div>
                <span className="font-semibold text-lg sm:text-xl tracking-tight text-[#2D2623]">
                  SwapTalent
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                id="nav-tab-explore"
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-out cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold shadow-2xs'
                    : 'text-[#6E645F] hover:text-[#2D2623] hover:bg-[#F4EFE7]'
                }`}
              >
                Explore Skills
              </button>

              <button
                id="nav-tab-swaps"
                onClick={() => setActiveTab('swaps')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-out cursor-pointer relative flex items-center gap-1.5 ${
                  activeTab === 'swaps'
                    ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold shadow-2xs'
                    : 'text-[#6E645F] hover:text-[#2D2623] hover:bg-[#F4EFE7]'
                }`}
              >
                My Sessions
                {activeSwapsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FDF2EE] text-[#D95338] text-[10px] font-semibold border border-[#FAD5C8]">
                    {activeSwapsCount}
                  </span>
                )}
              </button>

              <button
                id="nav-tab-vault"
                onClick={() => setActiveTab('vault')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-out cursor-pointer ${
                  activeTab === 'vault'
                    ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold shadow-2xs'
                    : 'text-[#6E645F] hover:text-[#2D2623] hover:bg-[#F4EFE7]'
                }`}
              >
                Protected Payments
              </button>

              <button
                id="nav-tab-how-it-works"
                onClick={() => setActiveTab('how-it-works')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-out cursor-pointer ${
                  activeTab === 'how-it-works'
                    ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold shadow-2xs'
                    : 'text-[#6E645F] hover:text-[#2D2623] hover:bg-[#F4EFE7]'
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
              className="inline-flex items-center gap-1.5 px-4 sm:px-4.5 py-2 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer shadow-sm shadow-[#D95338]/20 hover:shadow-md hover:shadow-[#D95338]/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share a Skill</span>
            </button>

            {/* Peer Switcher */}
            <div className="relative">
              <button
                id="user-profile-switcher-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#EAE3D6] hover:border-[#DDD4C5] hover:shadow-sm transition-all duration-300 ease-out cursor-pointer text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-[#EAE3D6]"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-[#2D2623] leading-tight">
                    {currentUser.name}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E645F]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border border-[#EAE3D6] shadow-[0_12px_32px_-8px_rgba(44,37,35,0.12)] py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-[#F2EBE0]">
                    <p className="text-[11px] font-semibold text-[#6E645F] uppercase tracking-wider">
                      Switch Active Profile
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
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#FAF7F2] transition-colors duration-200 cursor-pointer ${
                          u.id === currentUser.id ? 'bg-[#FDF4F0] font-semibold' : ''
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#EAE3D6]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#2D2623] truncate font-medium">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-[#6E645F] truncate">
                            {u.title}
                          </p>
                        </div>
                        {u.id === currentUser.id && (
                          <Check className="w-3.5 h-3.5 text-[#D95338] shrink-0" />
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
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-[#EAE3D6] gap-1.5 no-scrollbar">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'explore' ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold' : 'text-[#6E645F]'
            }`}
          >
            Explore Skills
          </button>
          <button
            onClick={() => setActiveTab('swaps')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'swaps' ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold' : 'text-[#6E645F]'
            }`}
          >
            My Sessions {activeSwapsCount > 0 && `(${activeSwapsCount})`}
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'vault' ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold' : 'text-[#6E645F]'
            }`}
          >
            Protected Payments
          </button>
          <button
            id="nav-tab-how-it-works-mobile"
            onClick={() => setActiveTab('how-it-works')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === 'how-it-works' ? 'bg-[#F2EBE0] text-[#2D2623] font-semibold' : 'text-[#6E645F]'
            }`}
          >
            How it works
          </button>
        </div>
      </div>
    </header>
  );
};
