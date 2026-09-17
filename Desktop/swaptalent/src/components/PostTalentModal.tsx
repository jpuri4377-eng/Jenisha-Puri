import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  HelpCircle,
  Video,
  Award,
  Layers
} from 'lucide-react';
import { SkillCategory, SessionFormat, ProficiencyLevel, User } from '../types';

interface PostTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onTalentCreated: (talent: any) => void;
}

const CATEGORIES: SkillCategory[] = [
  'Programming & Tech',
  'Languages',
  'Design & Creative',
  'Music & Audio',
  'Business & Finance',
  'Fitness & Wellness',
  'Academics & Science',
  'Crafts & DIY'
];

const FORMATS: SessionFormat[] = [
  '1-on-1 Live Video',
  'Pair Programming / Live Collab',
  'Async Review & Feedback',
  'Interactive Workshop'
];

const LEVELS: ProficiencyLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

export const PostTalentModal: React.FC<PostTalentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTalentCreated
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Programming & Tech');
  const [description, setDescription] = useState('');
  const [teachSkills, setTeachSkills] = useState('');
  const [wantedSkills, setWantedSkills] = useState('');
  const [topicsCovered, setTopicsCovered] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>('Advanced');
  const [format, setFormat] = useState<SessionFormat>('1-on-1 Live Video');
  const [sessionDurationMins, setSessionDurationMins] = useState(60);
  const [experienceYears, setExperienceYears] = useState(3);
  const [availability, setAvailability] = useState('Evenings & Weekends UTC');
  const [escrowDepositUSD, setEscrowDepositUSD] = useState(15);
  const [studentPrerequisites, setStudentPrerequisites] = useState('Basic enthusiasm and an open mind');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in what you want to teach and provide a brief description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          title,
          category,
          description,
          topicsCovered: topicsCovered.split('\n').map(t => t.trim()).filter(Boolean),
          teachSkills: teachSkills.split(',').map(s => s.trim()).filter(Boolean),
          wantedSkills: wantedSkills.split(',').map(s => s.trim()).filter(Boolean),
          proficiencyLevel,
          format,
          sessionDurationMins,
          experienceYears,
          availability,
          escrowDepositUSD,
          studentPrerequisites,
          portfolioUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create talent listing');
      }

      const created = await response.json();
      onTalentCreated(created);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error publishing talent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Post What You Want to Teach</h2>
              <p className="text-xs text-slate-700">List your skill on SwapTalent and find passionate peers to learn from in return</p>
            </div>
          </div>
          <button
            id="close-post-talent-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Teacher Profile Preview */}
          <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
            />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Posting as <span className="text-indigo-600">{currentUser.name}</span>
              </p>
              <p className="text-[11px] text-slate-700">{currentUser.title} • {currentUser.location}</p>
            </div>
          </div>

          {/* Title of what to teach */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              What do you want to teach? *
            </label>
            <input
              id="talent-title-input"
              type="text"
              required
              placeholder="e.g., Python & Django REST Framework, Conversational Japanese, Modern Figma Design Systems"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Category & Level Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                id="talent-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Proficiency Level
              </label>
              <select
                id="talent-level-select"
                value={proficiencyLevel}
                onChange={(e) => setProficiencyLevel(e.target.value as ProficiencyLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Teaching Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teaching Overview & What You Offer *
            </label>
            <textarea
              id="talent-description-input"
              rows={3}
              required
              placeholder="Describe what you will teach, your methodology, how you pace sessions, and what tangible skills the learner will walk away with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Two-Column: What you teach (tags) vs What you want in return (wanted skills) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100">
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                Specific Skills You Teach (comma-separated)
              </label>
              <input
                id="talent-teach-skills-input"
                type="text"
                placeholder="Django, PostgreSQL, REST APIs, Docker"
                value={teachSkills}
                onChange={(e) => setTeachSkills(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-emerald-700 mt-1">Tags will appear on your listing</p>
            </div>

            <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100">
              <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">
                What You Want in Return (Skills Wanted)
              </label>
              <input
                id="talent-wanted-skills-input"
                type="text"
                placeholder="React, Spanish, Graphic Design, Piano"
                value={wantedSkills}
                onChange={(e) => setWantedSkills(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-indigo-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-indigo-700 mt-1">Skills you are eager to learn from peers</p>
            </div>
          </div>

          {/* Topics Covered */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Syllabus Topics (One per line)</span>
              <span className="text-[11px] text-slate-700 font-normal">Optional</span>
            </label>
            <textarea
              id="talent-topics-input"
              rows={3}
              placeholder="1. Environment setup & best practices&#10;2. Core mental models and architecture&#10;3. Real-world project implementation"
              value={topicsCovered}
              onChange={(e) => setTopicsCovered(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-xs"
            />
          </div>

          {/* Format, Duration, and Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Session Format
              </label>
              <select
                id="talent-format-select"
                value={format}
                onChange={(e) => setFormat(e.target.value as SessionFormat)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white outline-none"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Session Duration
              </label>
              <select
                id="talent-duration-select"
                value={sessionDurationMins}
                onChange={(e) => setSessionDurationMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white outline-none"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes (Standard)</option>
                <option value={90}>90 minutes (Deep Dive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Years of Experience
              </label>
              <input
                id="talent-experience-input"
                type="number"
                min={0}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none"
              />
            </div>
          </div>

          {/* Availability and Prerequisites */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Availability & Timezone
              </label>
              <input
                id="talent-availability-input"
                type="text"
                placeholder="e.g., Weekday evenings (6-9pm UTC) or Weekends"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Prerequisites
              </label>
              <input
                id="talent-prereq-input"
                type="text"
                placeholder="e.g., Basic JavaScript, or No prerequisites"
                value={studentPrerequisites}
                onChange={(e) => setStudentPrerequisites(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none"
              />
            </div>
          </div>

          {/* Escrow Deposit (NOWPayments Protection) */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-900">
                    NOWPayments Commitment Escrow Guarantee
                  </h4>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    100% Refundable
                  </span>
                </div>
                <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                  To prevent "ghosting" and guarantee peer commitment, participants lock a refundable deposit via NOWPayments crypto escrow (USDT, BTC, ETH, etc.). Once both peers confirm their sessions were taught, the escrow is automatically unlocked and refunded!
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-medium text-amber-900">Required Deposit:</span>
                  <div className="flex items-center gap-2">
                    {[10, 15, 25, 50].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setEscrowDepositUSD(amt)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          escrowDepositUSD === amt
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-100/50'
                        }`}
                      >
                        ${amt} USD
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Portfolio / GitHub / Work Sample URL (Optional)
            </label>
            <input
              id="talent-portfolio-input"
              type="url"
              placeholder="https://github.com/yourhandle or https://dribbble.com/..."
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-post-talent-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publish Teaching Offer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
