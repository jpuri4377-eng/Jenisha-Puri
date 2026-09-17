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
  UserCheck
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
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('spanish') || cat.includes('language') || t.includes('conversation')) {
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('figma') || cat.includes('design') || cat.includes('creative') || t.includes('ui/ux')) {
    return 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('breath') || t.includes('yoga') || cat.includes('wellness') || cat.includes('fitness')) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('piano') || t.includes('guitar') || cat.includes('music') || cat.includes('audio')) {
    return 'https://images.unsplash.com/photo-1520523839898-50712743e9d7?w=600&auto=format&fit=crop&q=80';
  }
  if (t.includes('financial') || t.includes('startup') || cat.includes('business') || cat.includes('finance')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('academic') || cat.includes('science')) {
    return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80';
  }
  if (cat.includes('craft') || cat.includes('diy')) {
    return 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
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
  const isSwap = talent.availableForSwap !== false;
  const isHire = Boolean(talent.availableForHire);

  // Friendly plain-English badges
  let modeBadge = 'Free Skill Trade';
  let modeBadgeStyle = 'bg-white/95 text-stone-800 shadow-2xs font-medium';

  if (isSwap && isHire) {
    modeBadge = 'Trade or Paid Lesson';
    modeBadgeStyle = 'bg-[#FFF0F2]/95 text-[#FF385C] shadow-2xs font-semibold';
  } else if (isHire) {
    modeBadge = 'Paid Lesson';
    modeBadgeStyle = 'bg-stone-900/90 text-white shadow-2xs font-medium';
  } else {
    modeBadge = 'Free Skill Trade';
    modeBadgeStyle = 'bg-white/95 text-stone-800 shadow-2xs font-medium';
  }

  const coverImageUrl = getCoverImage(talent.category, talent.title);
  const plainSubtitle = getPlainSkillSubtitle(talent.title, talent.category, talent.description);

  return (
    <>
      <article 
        className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between group cursor-pointer border-0"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div>
          {/* Large Friendly Photo / Visual Area */}
          <div className="aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden relative bg-stone-100 mb-3">
            <img 
              src={coverImageUrl} 
              alt={talent.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />

            {/* Engagement Mode Badge (Single essential badge on top-left in plain language) */}
            <div className="absolute top-2.5 left-2.5 z-10">
              <span 
                id={`mode-badge-${talent.id}`}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] backdrop-blur-xs ${modeBadgeStyle}`}
              >
                {modeBadge}
              </span>
            </div>

            {/* Heart Favorite Button (Top-Right) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              title={isLiked ? "Saved" : "Save listing"}
              className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-2xs"
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-colors ${
                  isLiked ? 'fill-[#FF385C] text-[#FF385C]' : 'text-stone-700'
                }`} 
              />
            </button>
          </div>

          {/* Essential Info Area - Clean & Uncluttered */}
          <div className="space-y-1 px-0.5">
            {/* Top row: Teacher Name & Location + Rating */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={talent.user.avatar}
                  alt={talent.user.name}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
                <span className="text-[#222222] font-medium truncate">{talent.user.name}</span>
                <span className="text-[#717171] truncate">• {talent.user.location}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 font-medium text-[#222222]">
                <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
                <span>{talent.user.rating.toFixed(2)}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm sm:text-[15px] font-medium text-[#222222] tracking-normal leading-snug line-clamp-1 group-hover:text-[#FF385C] transition-colors pt-0.5">
              {talent.title}
            </h3>

            {/* Plain-language Friendly Subtitle */}
            <p className="text-xs text-[#717171] line-clamp-1 leading-tight font-normal">
              {plainSubtitle}
            </p>

            {/* Pricing / Terms Line with Tooltip */}
            <div className="pt-1 flex items-center flex-wrap gap-2 text-xs">
              {isHire && (
                <div className="flex items-center gap-0.5">
                  <span className="text-sm font-semibold text-[#222222]">
                    ${talent.hireRateUSD || 35}
                  </span>
                  <span className="text-[#717171]">
                    /{talent.hireRateType === 'hour' ? 'hr' : 'lesson'}
                  </span>
                  <HelpTooltip term="Lesson Fee" text={FINANCE_EXPLANATIONS.lessonFee} />
                </div>
              )}
              {isHire && isSwap && <span className="text-stone-300">•</span>}
              {isSwap && (
                <div className="text-[#717171] flex items-center gap-0.5 font-normal">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>${talent.escrowDepositUSD} deposit</span>
                  <HelpTooltip term="Security Deposit" text={FINANCE_EXPLANATIONS.deposit} />
                </div>
              )}
            </div>

            {/* Secondary Info: Appears only on hover (or in modal when clicked) */}
            <div className="max-h-0 opacity-0 group-hover:max-h-14 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs text-[#717171] flex-wrap pt-1.5 border-t border-stone-100 mt-1">
                <span className="text-[#222222] font-medium text-[11px]">{talent.category}</span>
                <span>•</span>
                <span 
                  id={`skill-level-tag-${talent.id}`}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700"
                >
                  {talent.proficiencyLevel}
                </span>
                <span>•</span>
                <span className="text-[11px]">{talent.sessionDurationMins}m session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div 
          className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setIsDetailModalOpen(true)}
            className="text-xs text-[#717171] hover:text-[#222222] font-medium transition-colors cursor-pointer"
          >
            Details
          </button>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {isOwnListing ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-normal text-[#717171] px-2.5 py-1 rounded-full bg-stone-100">
                  Your Listing
                </span>
                {onDeleteTalent && (
                  <button
                    onClick={() => onDeleteTalent(talent.id)}
                    title="Delete Listing"
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : isHire && !isSwap ? (
              // Hire Only
              <button
                id={`book-pay-btn-${talent.id}`}
                onClick={() => onInitiateHire(talent)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Book Lesson (${talent.hireRateUSD || 35})
              </button>
            ) : !isHire && isSwap ? (
              // Swap Only
              <button
                id={`request-swap-btn-${talent.id}`}
                onClick={() => onInitiateSwap(talent)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Trade Skills
              </button>
            ) : (
              // Swap or Hire (Both available)
              <div className="flex items-center gap-1.5">
                <button
                  id={`request-swap-btn-${talent.id}`}
                  onClick={() => onInitiateSwap(talent)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-[#222222] bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Trade skills for free"
                >
                  <ArrowLeftRight className="w-3 h-3 text-stone-500" />
                  Trade
                </button>
                <button
                  id={`book-pay-btn-${talent.id}`}
                  onClick={() => onInitiateHire(talent)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                  title="Book a paid lesson directly"
                >
                  <CreditCard className="w-3 h-3" />
                  Book (${talent.hireRateUSD || 35})
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Airbnb-style Detailed Modal (Revealed on click rather than all at once) */}
      {isDetailModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative border-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Teacher & Category */}
            <div className="flex items-start gap-4 pr-10">
              <img
                src={talent.user.avatar}
                alt={talent.user.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-stone-100 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#FF385C]">
                    {talent.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                    {talent.proficiencyLevel} Level
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#222222] mt-1 leading-snug">
                  {talent.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#717171] mt-1">
                  <span>Taught by <strong className="font-medium text-[#222222]">{talent.user.name}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-[#222222] font-semibold">
                    <Star className="w-3 h-3 fill-[#FF385C] text-[#FF385C]" />
                    {talent.user.rating.toFixed(2)}
                  </span>
                  <span>•</span>
                  <span>{talent.user.location}</span>
                </div>
              </div>
            </div>

            {/* Overview / Bio */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#717171] uppercase tracking-wider">
                About this session
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                {talent.description}
              </p>
            </div>

            {/* Curriculum: Topics Covered */}
            {talent.topicsCovered && talent.topicsCovered.length > 0 && (
              <div className="space-y-2.5 bg-stone-50/80 rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-[#222222] uppercase tracking-wider">
                  What you will learn
                </h4>
                <div className="space-y-1.5">
                  {talent.topicsCovered.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle className="w-4 h-4 text-[#FF385C] shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Offered & Wanted */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider">
                  Skills Offered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {talent.teachSkills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {isSwap && talent.wantedSkills && talent.wantedSkills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider">
                    Skills Wanted in Exchange
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {talent.wantedSkills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Format, Duration & Availability */}
            <div className="border-t border-stone-100 pt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-600">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>{talent.sessionDurationMins} minutes ({talent.format})</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>{talent.availability || 'Flexible availability'}</span>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="border-t border-stone-100 pt-5 flex items-center justify-between gap-4">
              <div>
                {isHire ? (
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold text-[#222222]">${talent.hireRateUSD || 35}</span>
                      <span className="text-xs text-[#717171]"> /{talent.hireRateType === 'hour' ? 'hour' : 'lesson'}</span>
                      <HelpTooltip term="Lesson Fee" text={FINANCE_EXPLANATIONS.lessonFee} />
                    </div>
                    {isSwap && (
                      <span className="text-[11px] text-[#717171] block">Or trade skills for free</span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-semibold text-[#222222]">Free Skill Trade</span>
                    <div className="flex items-center gap-0.5 text-xs text-[#717171]">
                      <span>${talent.escrowDepositUSD} security deposit</span>
                      <HelpTooltip term="Security Deposit" text={FINANCE_EXPLANATIONS.deposit} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isSwap && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      onInitiateSwap(talent);
                    }}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#222222] bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Trade Skills
                  </button>
                )}
                {isHire && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      onInitiateHire(talent);
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] transition-all shadow-xs cursor-pointer"
                  >
                    Book Lesson (${talent.hireRateUSD || 35})
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
