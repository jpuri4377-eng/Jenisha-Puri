import React from 'react';
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  ArrowLeftRight, 
  BookOpen, 
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles
} from 'lucide-react';
import { TalentListing, User } from '../types';

interface TalentCardProps {
  talent: TalentListing;
  currentUser: User;
  onInitiateSwap: (talent: TalentListing) => void;
  onDeleteTalent?: (talentId: string) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  currentUser,
  onInitiateSwap,
  onDeleteTalent
}) => {
  const isOwnListing = talent.userId === currentUser.id;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Card Header: Teacher profile and rating */}
      <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={talent.user.avatar}
              alt={talent.user.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
            />
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-indigo-600 text-white text-[9px] font-bold">
              {talent.proficiencyLevel[0]}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm">{talent.user.name}</h3>
              {talent.user.badges && talent.user.badges.length > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700">
                  {talent.user.badges[0]}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 mt-0.5">
              <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {talent.user.rating}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {talent.user.completedSwaps} swaps
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-slate-600">
                <MapPin className="w-3 h-3 text-slate-600" />
                {talent.user.location}
              </span>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
          {talent.category}
        </span>
      </div>

      {/* Main Content: What I Teach */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {talent.title}
          </h4>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {talent.description}
          </p>

          {/* Topics Syllabus if provided */}
          {talent.topicsCovered && talent.topicsCovered.length > 0 && (
            <div className="mt-3.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400" /> Curriculum Highlights
              </p>
              <ul className="space-y-1">
                {talent.topicsCovered.slice(0, 2).map((topic, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span className="truncate">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* What they teach tags */}
        <div className="space-y-3 pt-2">
          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Skills Offered:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {talent.teachSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* What they want in return */}
          <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                Looking to learn in exchange:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {talent.wantedSkills.map((wanted, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 shadow-xs"
                >
                  {wanted}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Meta badges: format, duration, escrow */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {talent.sessionDurationMins}m • {talent.format}
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            ${talent.escrowDepositUSD} Escrow
          </span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        {talent.portfolioUrl ? (
          <a
            href={talent.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Portfolio
          </a>
        ) : (
          <span className="text-[11px] text-slate-400">Verified Peer</span>
        )}

        {isOwnListing ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Your Listing
            </span>
            {onDeleteTalent && (
              <button
                onClick={() => onDeleteTalent(talent.id)}
                className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <button
            id={`request-swap-btn-${talent.id}`}
            onClick={() => onInitiateSwap(talent)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Request Swap
          </button>
        )}
      </div>
    </div>
  );
};
