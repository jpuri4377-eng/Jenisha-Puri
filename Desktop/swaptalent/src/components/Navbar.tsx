import React from 'react';
import { User } from '../types';
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  PlusCircle, 
  Layers, 
  Coins, 
  FileCode,
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'swaps' | 'vault' | 'django';
  setActiveTab: (tab: 'explore' | 'swaps' | 'vault' | 'django') => void;
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  onOpenPostModal: () => void;
  activeSwapsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  users,
  currentUser,
  setCurrentUser,
  onOpenPostModal,
  activeSwapsCount
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button 
              id="brand-logo-btn"
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl tracking-tight text-slate-900">SwapTalent</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> P2P Escrow
                  </span>
                </div>
                <p className="text-xs text-slate-700">Decentralized Skill Exchange</p>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 ml-4">
              <button
                id="nav-tab-explore"
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'explore'
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4" />
                Explore Talents
              </button>

              <button
                id="nav-tab-swaps"
                onClick={() => setActiveTab('swaps')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 relative ${
                  activeTab === 'swaps'
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                My Swaps & Escrows
                {activeSwapsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-600 text-white">
                    {activeSwapsCount}
                  </span>
                )}
              </button>

              <button
                id="nav-tab-vault"
                onClick={() => setActiveTab('vault')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'vault'
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Coins className="w-4 h-4 text-amber-600" />
                NOWPayments Vault
              </button>

              <button
                id="nav-tab-django"
                onClick={() => setActiveTab('django')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'django'
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileCode className="w-4 h-4 text-emerald-600" />
                Django Architecture
              </button>
            </nav>
          </div>

          {/* Right actions: Post Talent CTA & Peer Switcher */}
          <div className="flex items-center gap-3">
            {/* Post What You Want to Teach Button */}
            <button
              id="btn-post-talent-header"
              onClick={onOpenPostModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post What You Teach</span>
              <span className="sm:hidden">Teach</span>
            </button>

            {/* Peer Switcher Dropdown (Allows testing P2P interactions between users) */}
            <div className="relative">
              <button
                id="user-profile-switcher-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                  </p>
                  <p className="text-[10px] text-slate-700 leading-tight">Active Peer</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Simulate Peer-to-Peer Interaction
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Switch personas to test swap requests & escrow release:
                    </p>
                  </div>
                  <div className="py-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        id={`switch-user-${u.id}`}
                        onClick={() => {
                          setCurrentUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                          u.id === currentUser.id ? 'bg-indigo-50/70' : ''
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${
                            u.id === currentUser.id ? 'text-indigo-700' : 'text-slate-800'
                          }`}>
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-700 truncate">{u.title}</p>
                        </div>
                        {u.id === currentUser.id && (
                          <span className="text-xs font-bold text-indigo-600">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'explore' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Explore Talents
          </button>
          <button
            onClick={() => setActiveTab('swaps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'swaps' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            My Swaps ({activeSwapsCount})
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'vault' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            NOWPayments Vault
          </button>
          <button
            onClick={() => setActiveTab('django')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'django' ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Django Specs
          </button>
        </div>
      </div>
    </header>
  );
};
