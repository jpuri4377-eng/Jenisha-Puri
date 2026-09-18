import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShieldCheck, 
  ArrowLeftRight, 
  ExternalLink, 
  MapPin,
  Trash2,
  CreditCard,
  X,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { TalentListing, User } from '../types';
import { HelpTooltip } from './HelpTooltip';
import { getPlainSkillSubtitle, FINANCE_EXPLANATIONS } from '../utils/plainLanguage';

interface TalentCardProps {
  talent: TalentListing;
  currentUser: User;
  onInitiateSwap: (talent: TalentListing) => void;
  onInitiateHire: (talent: TalentListing) => void;
  onDeleteTalent?: (talentId: string) => void;
}

const getCoverImage = (category: string, title: string) => {
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();
  
  if (t.includes('python') || t.includes('django') || cat.includes('tech') || cat.includes('programming') || cat.includes('code')) {
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('spanish') || cat.includes('language') || t.includes('conversation')) {
    return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('figma') || cat.includes('design') || cat.includes('creative') || t.includes('ui/ux')) {
    return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('breath') || t.includes('yoga') || cat.includes('wellness') || cat.includes('fitness')) {
    return 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('piano') || t.includes('guitar') || cat.includes('music') || cat.includes('audio')) {
    return 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('financial') || t.includes('startup') || cat.includes('business') || cat.includes('finance')) {
    return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('academic') || cat.includes('science')) {
    return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('craft') || cat.includes('diy')) {
    return 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('volunteer') || t.includes('free')) {
    return 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80';
};

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  currentUser,
  onInitiateSwap,
  onInitiateHire,
  onDeleteTalent
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const isOwnListing = talent.userId === currentUser.id;
  const isVolunteer = Boolean(talent.isVolunteer);
  const isSwap = talent.availableForSwap !== false && !isVolunteer;
  const isHire = Boolean(talent.availableForHire) && !isVolunteer;

  // NPR Conversion
  const nprAmount = Number(talent.hireRateUSD || talent.escrowDepositUSD || 0) * 135;

  // Dynamic Badges for Lavender Theme
  let modeBadge = 'Free Skill Trade';
  let modeBadgeStyle = 'bg-violet-100 text-violet-800 border border-violet-200 font-medium';

  if (isVolunteer) {
    modeBadge = 'VOLUNTEER • FREE';
    modeBadgeStyle = 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold';
  } else if (isSwap && isHire) {
    modeBadge = 'Trade or Paid Lesson';
    modeBadgeStyle = 'bg-violet-50 text-violet-700 border border-violet-200 font-semibold';
  } else if (isHire) {
    modeBadge = 'Paid Lesson';
    modeBadgeStyle = 'bg-amber-50 text-amber-700 border border-amber-200 font-medium';
  }

  const coverImageUrl = getCoverImage(talent.category, talent.title);
  const plainSubtitle = getPlainSkillSubtitle(talent.title, talent.category, talent.description);

  return (
    <>
      <article 
        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-violet-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 ease-out p-4 flex flex-col justify-between cursor-pointer overflow-hidden"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div>
          {/* Large Friendly Photo / Visual Area */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-violet-50 mb-4">
            <img 
              src={coverImageUrl} 
              alt={talent.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />

            {/* Engagement Mode Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span 
                id={`mode-badge-${talent.id}`}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide backdrop-blur-md ${modeBadgeStyle}`}
              >
                {isVolunteer && <Sparkles className="w-3 h-3 mr-1" />}
                {modeBadge}
              </span>
            </div>

            {/* Heart Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isLiked ? 'fill-violet-600 text-violet-600' : 'text-gray-400'
                }`} 
              />
            </button>
          </div>

          {/* Essential Info Area */}
          <div className="space-y-2 px-1">
            {/* Top row: Teacher Name & Rating */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={talent.user.avatar}
                  alt={talent.user.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0 ring-2 ring-violet-100"
                />
                <span className="text-violet-950 font-semibold truncate">{talent.user.name}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 font-bold text-violet-950 bg-violet-50 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{Number(talent.user.rating).toFixed(1)}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-violet-950 tracking-tight leading-snug line-clamp-1 group-hover:text-violet-600 transition-colors">
              {talent.title}
            </h3>

            {/* Plain-language Subtitle */}
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
              {plainSubtitle}
            </p>

            {/* Pricing / Terms Line - NOW IN NPR */}
            <div className="pt-1 flex items-center flex-wrap gap-2 text-xs font-medium">
              {isVolunteer ? (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Free Community Session</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-0.5 text-violet-950">
                    <span className="text-base font-bold">रु {nprAmount.toLocaleString()}</span>
                    <span className="text-gray-400 text-[10px]">NPR</span>
                  </div>
                  {isSwap && (
                    <div className="flex items-center gap-1 text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Escrow Protected</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Secondary Info: Appears only on hover */}
            <div className="max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 flex-wrap pt-2 border-t border-violet-50 mt-2">
                <span className="font-semibold text-violet-700">{talent.category}</span>
                <span>•</span>
                <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 font-medium">
                  {talent.proficiencyLevel}
                </span>
                <span>•</span>
                <span>{talent.sessionDurationMins} mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div 
          className="mt-4 pt-3 border-t border-violet-50 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setIsDetailModalOpen(true)}
            className="text-xs text-gray-500 hover:text-violet-700 font-medium transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-violet-50"
          >
            View Details
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isOwnListing ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-violet-600 px-2 py-1 rounded-full bg-violet-50 border border-violet-100">
                  YOUR LISTING
                </span>
                {onDeleteTalent && (
                  <button
                    onClick={() => onDeleteTalent(talent.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : isVolunteer ? (
              <button
                onClick={() => onInitiateSwap(talent)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-200 flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5" />
                Connect Free
              </button>
            ) : isHire && !isSwap ? (
              <button
                onClick={() => onInitiateHire(talent)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all shadow-md shadow-violet-200 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Book Lesson
              </button>
            ) : !isHire && isSwap ? (
              <button
                onClick={() => onInitiateSwap(talent)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all shadow-md shadow-violet-200 flex items-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Trade Skills
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onInitiateSwap(talent)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-all flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  Trade
                </button>
                <button
                  onClick={() => onInitiateHire(talent)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all shadow-sm flex items-center gap-1"
                >
                  <CreditCard className="w-3 h-3" />
                  Book
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Detailed Modal - LAVENDER THEME */}
      {isDetailModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-violet-950/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative border border-violet-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-violet-50 text-gray-400 hover:text-violet-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-10">
              <img
                src={talent.user.avatar}
                alt={talent.user.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-violet-50 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                    {talent.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {talent.proficiencyLevel}
                  </span>
                  {isVolunteer && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Volunteer
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-violet-950 mt-1 leading-snug">
                  {talent.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span>Taught by <strong className="font-bold text-violet-950">{talent.user.name}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-violet-950 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {Number(talent.user.rating).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">About this session</h4>
              <p className="text-sm text-violet-950 leading-relaxed">
                {talent.description}
              </p>
            </div>

            {/* Curriculum */}
            {talent.topicsCovered && talent.topicsCovered.length > 0 && (
              <div className="space-y-3 bg-violet-50/50 rounded-2xl p-5 border border-violet-100">
                <h4 className="text-[10px] font-bold text-violet-700 uppercase tracking-widest">What you will learn</h4>
                <div className="space-y-2">
                  {talent.topicsCovered.map((topic, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-violet-900">
                      <CheckCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skills Offered</span>
                <div className="flex flex-wrap gap-2">
                  {talent.teachSkills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {isSwap && talent.wantedSkills && talent.wantedSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wanted in Exchange</span>
                  <div className="flex flex-wrap gap-2">
                    {talent.wantedSkills.map((s, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Format & Duration */}
            <div className="border-t border-violet-50 pt-4 grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                <span className="font-medium">{talent.sessionDurationMins} minutes</span>
                <span className="text-gray-400">({talent.format})</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="font-medium">{talent.availability || 'Flexible'}</span>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="border-t border-violet-100 pt-6 flex items-center justify-between gap-4 bg-violet-50/30 -mx-8 -mb-8 p-8 rounded-b-3xl">
              <div>
                {isVolunteer ? (
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-emerald-700">Free Session</span>
                    <span className="text-[10px] text-emerald-600 font-medium">No payment or exchange required</span>
                  </div>
                ) : isHire ? (
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-violet-950">रु {nprAmount.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 font-medium">NPR</span>
                    </div>
                    {isSwap && <span className="text-[10px] text-violet-600 font-medium block mt-0.5">Or trade skills for free</span>}
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-bold text-violet-950">Free Skill Trade</span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>${talent.escrowDepositUSD} security deposit</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isSwap && !isVolunteer && (
                  <button
                    onClick={() => { setIsDetailModalOpen(false); onInitiateSwap(talent); }}
                    className="px-5 py-3 rounded-xl text-xs font-bold text-violet-700 bg-white hover:bg-violet-50 border border-violet-200 transition-all shadow-sm cursor-pointer"
                  >
                    Trade Skills
                  </button>
                )}
                {(isHire || isVolunteer) && (
                  <button
                    onClick={() => { setIsDetailModalOpen(false); isVolunteer ? onInitiateSwap(talent) : onInitiateHire(talent); }}
                    className={`px-6 py-3 rounded-xl text-xs font-bold text-white active:scale-95 transition-all shadow-lg cursor-pointer flex items-center gap-2 ${
                      isVolunteer ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-200'
                    }`}
                  >
                    {isVolunteer ? <Heart className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    {isVolunteer ? 'Connect Free' : `Book Lesson`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 