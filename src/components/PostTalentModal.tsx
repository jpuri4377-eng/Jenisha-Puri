import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Layers,
  Award,
  ArrowLeftRight,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { SkillCategory, SessionFormat, ProficiencyLevel, User } from '../types';
import { HelpTooltip } from './HelpTooltip';
import { FINANCE_EXPLANATIONS } from '../utils/plainLanguage';

interface PostTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onTalentCreated: (talent: any) => void;
}

const CATEGORIES: { label: SkillCategory; description: string }[] = [
  { label: 'Programming & Tech', description: 'Full-stack, APIs, devops, mobile, AI' },
  { label: 'Languages', description: 'Conversation, fluency, grammar, accent' },
  { label: 'Design & Creative', description: 'UI/UX, Figma, typography, illustration' },
  { label: 'Music & Audio', description: 'Piano, guitar, production, audio mixing' },
  { label: 'Business & Finance', description: 'Startups, financial modeling, marketing' },
  { label: 'Fitness & Wellness', description: 'Breathwork, yoga, posture, ergonomics' },
  { label: 'Academics & Science', description: 'Data science, math, physics, research' },
  { label: 'Crafts & DIY', description: 'Woodwork, electronics, sewing, leather' }
];

const LEVELS: { level: ProficiencyLevel; desc: string }[] = [
  { level: 'Beginner', desc: 'Foundations & core principles for newcomers' },
  { level: 'Intermediate', desc: 'Practical workflows, solving real problems' },
  { level: 'Advanced', desc: 'Deep dives, architectural best practices' },
  { level: 'Expert', desc: 'Production mastery & high-level specialization' }
];

const FORMATS: SessionFormat[] = [
  '1-on-1 Live Video',
  'Pair Programming / Live Collab',
  'Async Review & Feedback',
  'Interactive Workshop'
];

const DURATIONS = [
  { mins: 30, label: '30 mins (Quick sync)' },
  { mins: 45, label: '45 mins (Balanced lesson)' },
  { mins: 60, label: '60 mins (Standard session)' },
  { mins: 90, label: '90 mins (Deep dive)' }
];

export const PostTalentModal: React.FC<PostTalentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTalentCreated
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Step 1: Skill Name & Overview
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Step 2: Category (free-form or suggested)
  const [category, setCategory] = useState<string>('Programming & Tech');
  
  // Step 3: Level & Specific Skills
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>('Intermediate');
  const [teachSkills, setTeachSkills] = useState('');
  const [topicsCovered, setTopicsCovered] = useState('');
  
  // Step 4: Engagement Modes (Swap and/or Hire)
  const [availableForSwap, setAvailableForSwap] = useState(true);
  const [availableForHire, setAvailableForHire] = useState(false);
  const [hireRateUSD, setHireRateUSD] = useState<number>(35);
  const [hireRateType, setHireRateType] = useState<'session' | 'hour'>('session');
  const [wantedSkills, setWantedSkills] = useState('');
  const [format, setFormat] = useState<SessionFormat>('1-on-1 Live Video');

  // Step 5: Session length & escrow details
  const [sessionDurationMins, setSessionDurationMins] = useState(60);
  const [availability, setAvailability] = useState('Weekdays & Weekends UTC');
  const [escrowDepositUSD, setEscrowDepositUSD] = useState(15);
  const [experienceYears, setExperienceYears] = useState(3);
  const [studentPrerequisites, setStudentPrerequisites] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!title.trim()) {
        setErrorMessage('Please enter what you want to teach.');
        return;
      }
      if (!description.trim()) {
        setErrorMessage('Please provide a short summary of what you will teach.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!category.trim()) {
        setErrorMessage('Please specify or select a category for this skill.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!teachSkills.trim()) {
        setErrorMessage('Please list at least one skill or tool you will teach (e.g. Python, Figma).');
        return;
      }
    }
    if (currentStep === 4) {
      if (!availableForSwap && !availableForHire) {
        setErrorMessage('Please choose at least one way learners can connect: Available for Swap, Available for Hire, or both.');
        return;
      }
      if (availableForSwap && !wantedSkills.trim()) {
        setErrorMessage('Please specify what skills you are eager to learn in exchange.');
        return;
      }
      if (availableForHire && (!hireRateUSD || hireRateUSD <= 0)) {
        setErrorMessage('Please enter a valid rate for your teaching sessions.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          title,
          category: category.trim(),
          description,
          topicsCovered: topicsCovered.split('\n').map(t => t.trim()).filter(Boolean),
          teachSkills: teachSkills.split(',').map(s => s.trim()).filter(Boolean),
          wantedSkills: availableForSwap ? wantedSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
          proficiencyLevel,
          format,
          sessionDurationMins,
          experienceYears,
          availability,
          escrowDepositUSD,
          availableForSwap,
          availableForHire,
          hireRateUSD: Number(hireRateUSD) || 35,
          hireRateType,
          studentPrerequisites: studentPrerequisites || 'No formal prerequisites',
          portfolioUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create talent listing');
      }

      const created = await response.json();
      onTalentCreated(created);
      onClose();
      // Reset form
      setCurrentStep(1);
      setTitle('');
      setDescription('');
      setCategory('Programming & Tech');
      setTeachSkills('');
      setWantedSkills('');
      setAvailableForSwap(true);
      setAvailableForHire(false);
      setHireRateUSD(35);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error publishing talent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    'Skill Name',
    'About Your Skill',
    'Category',
    'Level & Topics',
    'Trade or Paid Lesson',
    'Schedule & Review'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-violet-50/30 rounded-3xl shadow-[0_20px_50px_-12px_rgba(44,37,35,0.2)] w-full max-w-xl flex flex-col my-6 overflow-hidden border border-violet-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#F2EBE0] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#D95338] uppercase tracking-wider">
              Step {currentStep} of 5 • {stepTitles[currentStep - 1]}
            </span>
            <h2 className="text-lg font-semibold text-[#2E1065] tracking-normal mt-0.5">
              Teach a Skill
            </h2>
          </div>
          <button
            id="close-post-talent-modal"
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:text-[#2E1065] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="px-6 pt-3 pb-1 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                s === currentStep
                  ? 'bg-[#D95338]'
                  : s < currentStep
                  ? 'bg-[#FAD5C8]'
                  : 'bg-[#F2EBE0]'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-7 space-y-5 min-h-[340px] flex flex-col justify-between">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-[#FDF2EE] text-[#D95338] border border-[#FAD5C8] text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Skill Name & Summary */}
          {currentStep === 1 && (
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-[#2E1065] mb-1">
                  What skill or craft do you want to teach?
                </label>
                <p className="text-xs text-[#6E645F] mb-2.5 leading-relaxed">
                  Be descriptive so peers understand your focus (e.g., "Python & Django REST Framework", "Conversational Spanish", "Figma Design Systems").
                </p>
                <input
                  id="talent-title-input"
                  type="text"
                  autoFocus
                  placeholder="e.g. Modern Web Architecture with React & Node"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-violet-200 text-sm text-[#2E1065] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none transition-all bg-[#FAF7F2]/50 focus:bg-violet-50/30"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-[#2E1065] mb-1">
                  Teaching overview
                </label>
                <p className="text-xs text-[#6E645F] mb-2.5 leading-relaxed">
                  Briefly explain what you'll cover and how you help the student practice.
                </p>
                <textarea
                  id="talent-description-input"
                  rows={4}
                  placeholder="I will walk you through real-world examples, review your code, and answer any tricky questions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-violet-200 text-sm text-[#2E1065] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none transition-all bg-[#FAF7F2]/50 focus:bg-violet-50/30"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Category */}
          {currentStep === 2 && (
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-[#2E1065] mb-1">
                  Skill Category
                </label>
                <p className="text-xs text-[#6E645F] mb-3 leading-relaxed">
                  Type any custom category or tag freely, or select from the suggested categories below.
                </p>
                <input
                  id="talent-category-input"
                  type="text"
                  autoFocus
                  placeholder="e.g. Programming & Tech, AI Tools, Creative Writing, Languages..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-violet-200 text-sm text-[#2E1065] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none transition-all bg-[#FAF7F2]/50 focus:bg-violet-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6E645F] mb-2">
                  Or pick a suggested category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category.trim().toLowerCase() === cat.label.trim().toLowerCase();
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#D95338] bg-[#FDF2EE] text-[#D95338] font-semibold'
                            : 'border-violet-200 bg-violet-50/30 hover:border-[#D5CBBF] text-[#2E1065]'
                        }`}
                      >
                        <p className={`text-xs font-medium ${isSelected ? 'text-[#D95338]' : 'text-[#2E1065]'}`}>
                          {cat.label}
                        </p>
                        <p className={`text-[11px] mt-0.5 leading-snug ${isSelected ? 'text-[#C84634]' : 'text-[#6E645F]'}`}>
                          {cat.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Level & Specific Skills */}
          {currentStep === 3 && (
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-[#2E1065] mb-1">
                  What skill level are you teaching at?
                </label>
                <p className="text-xs text-[#6E645F] mb-2.5 leading-relaxed">
                  This skill level tag will be shown alongside your skills on the listing.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {LEVELS.map((lvl) => {
                    const isSelected = proficiencyLevel === lvl.level;
                    return (
                      <button
                        key={lvl.level}
                        type="button"
                        onClick={() => setProficiencyLevel(lvl.level)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#D95338] bg-[#FDF2EE] text-[#D95338] font-semibold'
                            : 'border-violet-200 bg-violet-50/30 hover:border-[#D5CBBF] text-[#2E1065]'
                        }`}
                      >
                        <span className={`text-xs font-medium block ${isSelected ? 'text-[#D95338]' : 'text-[#2E1065]'}`}>
                          {lvl.level}
                        </span>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#C84634]' : 'text-[#6E645F]'}`}>
                          {lvl.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-[#2E1065] mb-1">
                  Specific skills or tools (comma-separated) *
                </label>
                <input
                  id="talent-teach-skills-input"
                  type="text"
                  placeholder="e.g. Python, Django, REST APIs, PostgreSQL"
                  value={teachSkills}
                  onChange={(e) => setTeachSkills(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-violet-200 text-sm text-[#2E1065] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none transition-all bg-[#FAF7F2]/50 focus:bg-violet-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6E645F] mb-1">
                  Curriculum topics (optional, one per line)
                </label>
                <textarea
                  id="talent-topics-input"
                  rows={2}
                  placeholder="1. Architecture and setups&#10;2. Production deployment"
                  value={topicsCovered}
                  onChange={(e) => setTopicsCovered(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-violet-200 text-xs text-[#2E1065] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none bg-[#FAF7F2]/50 focus:bg-violet-50/30"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Trade & Paid Lesson Modes */}
          {currentStep === 4 && (
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-[#2E1065] mb-1">
                  How can learners connect with you?
                </label>
                <p className="text-xs text-[#6E645F] mb-2.5 leading-relaxed">
                  Choose free skill trade (learn from each other), paid lessons (charge a fee), or both.
                </p>
              </div>

              <div className="space-y-3">
                {/* Free Skill Trade */}
                <div 
                  className={`p-3.5 rounded-2xl border transition-all ${
                    availableForSwap 
                      ? 'border-[#D95338]/60 bg-[#FDF2EE]/60' 
                      : 'border-violet-200 bg-violet-50/30'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="available-for-swap-check"
                      checked={availableForSwap}
                      onChange={(e) => setAvailableForSwap(e.target.checked)}
                      className="mt-0.5 rounded border-violet-200 text-[#D95338] focus:ring-[#D95338] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#2E1065] block">
                        Free Skill Trade
                      </span>
                      <span className="text-[11px] text-[#6E645F] block mt-0.5 leading-relaxed">
                        Trade skills with peers for free — you teach your craft, and they teach you something in return.
                      </span>
                    </div>
                  </label>

                  {/* Skills wanted in exchange */}
                  {availableForSwap && (
                    <div className="mt-3 pt-3 border-t border-violet-200 space-y-1.5">
                      <label className="block text-xs font-medium text-[#2E1065]">
                        What skills would you like to learn in return? *
                      </label>
                      <input
                        id="talent-wanted-skills-input"
                        type="text"
                        placeholder="e.g. Conversational Spanish, Acoustic Guitar, Figma, Cooking"
                        value={wantedSkills}
                        onChange={(e) => setWantedSkills(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-violet-200 text-xs text-[#2E1065] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none bg-violet-50/30"
                      />
                    </div>
                  )}
                </div>

                {/* Paid Lessons */}
                <div 
                  className={`p-3.5 rounded-2xl border transition-all ${
                    availableForHire 
                      ? 'border-[#D95338]/60 bg-[#FDF2EE]/60' 
                      : 'border-violet-200 bg-violet-50/30'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="available-for-hire-check"
                      checked={availableForHire}
                      onChange={(e) => setAvailableForHire(e.target.checked)}
                      className="mt-0.5 rounded border-violet-200 text-[#D95338] focus:ring-[#D95338] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#2E1065] block">
                          Paid Lessons
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6E645F] block mt-0.5 leading-relaxed">
                        Students can pay you directly for lessons if they don't have a skill to trade.
                      </span>
                    </div>
                  </label>

                  {/* Hire rate input */}
                  {availableForHire && (
                    <div className="mt-3 pt-3 border-t border-violet-200 space-y-2">
                      <label className="block text-xs font-medium text-[#2E1065] flex items-center">
                        Your Lesson Fee *
                        <HelpTooltip term="Lesson Fee" text={FINANCE_EXPLANATIONS.lessonFee} />
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-[130px]">
                          <span className="absolute left-3 top-2.5 text-xs text-[#6E645F]">$</span>
                          <input
                            id="talent-hire-rate-input"
                            type="number"
                            min="5"
                            max="500"
                            value={hireRateUSD}
                            onChange={(e) => setHireRateUSD(Number(e.target.value))}
                            className="w-full pl-6 pr-3 py-2 rounded-xl border border-violet-200 text-xs text-[#2E1065] font-semibold focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none bg-violet-50/30"
                          />
                        </div>

                        {/* Rate Type Selector */}
                        <div className="flex items-center rounded-full bg-[#FAF7F2] p-1 border border-violet-200 text-xs">
                          <button
                            type="button"
                            onClick={() => setHireRateType('session')}
                            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                              hireRateType === 'session'
                                ? 'bg-violet-50/30 text-[#2E1065] font-semibold shadow-xs'
                                : 'text-[#6E645F] hover:text-[#2E1065]'
                            }`}
                          >
                            per lesson
                          </button>
                          <button
                            type="button"
                            onClick={() => setHireRateType('hour')}
                            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                              hireRateType === 'hour'
                                ? 'bg-violet-50/30 text-[#2E1065] font-semibold shadow-xs'
                                : 'text-[#6E645F] hover:text-[#2E1065]'
                            }`}
                          >
                            per hour
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#6E645F] leading-relaxed">
                        Held safely until the lesson is finished, then paid directly to you.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Format selection */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#2E1065] mb-1.5">
                  Preferred session format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        format === f
                          ? 'border-[#D95338] bg-[#FDF2EE] text-[#D95338] font-semibold'
                          : 'border-violet-200 bg-violet-50/30 hover:border-[#D5CBBF] text-[#2E1065]'
                      }`}
                    >
                      <span className="text-[11px] block">{f}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Session Length & Commitment Details */}
          {currentStep === 5 && (
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-[#2E1065] mb-1">
                  Session length
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.mins}
                      type="button"
                      onClick={() => setSessionDurationMins(d.mins)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        sessionDurationMins === d.mins
                          ? 'border-[#D95338] bg-[#FDF2EE] text-[#D95338] font-semibold'
                          : 'border-violet-200 bg-violet-50/30 hover:border-[#D5CBBF] text-[#2E1065]'
                      }`}
                    >
                      <span className="text-xs block">{d.mins}m</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-[#2E1065] mb-1">
                    Availability / Timezone
                  </label>
                  <input
                    id="talent-availability-input"
                    type="text"
                    placeholder="e.g. Evenings & Weekends UTC"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-violet-200 text-xs text-[#2E1065] focus:border-[#D95338] focus:ring-1 focus:ring-[#D95338] focus:outline-none bg-[#FAF7F2]/50 focus:bg-violet-50/30"
                  />
                </div>

                {availableForSwap && (
                  <div>
                    <label className="block text-xs font-medium text-[#2E1065] mb-1 flex items-center">
                      Security Deposit
                      <HelpTooltip term="Security Deposit" text={FINANCE_EXPLANATIONS.securityDeposit} />
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[10, 15, 20, 25].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setEscrowDepositUSD(amt)}
                          className={`flex-1 py-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                            escrowDepositUSD === amt
                              ? 'border-[#D95338] bg-[#FDF2EE] text-[#D95338] font-semibold'
                              : 'border-violet-200 bg-violet-50/30 text-[#2E1065] hover:border-[#D5CBBF]'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Review summary box */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-violet-200 text-xs space-y-1.5">
                <div className="flex justify-between text-[#6E645F]">
                  <span>Category:</span>
                  <span className="font-medium text-[#2E1065]">{category}</span>
                </div>
                <div className="flex justify-between text-[#6E645F]">
                  <span>Level:</span>
                  <span className="font-medium text-[#2E1065]">{proficiencyLevel}</span>
                </div>
                <div className="flex justify-between text-[#6E645F]">
                  <span>Lesson Mode:</span>
                  <span className="font-semibold text-[#2E1065]">
                    {availableForSwap && availableForHire 
                      ? 'Free Skill Trade or Paid Lesson' 
                      : availableForHire 
                      ? 'Paid Lesson Only' 
                      : 'Free Skill Trade'}
                  </span>
                </div>
                {availableForHire && (
                  <div className="flex justify-between text-[#6E645F]">
                    <span>Lesson Fee:</span>
                    <span className="font-semibold text-[#2E1065]">
                      ${hireRateUSD} USD / {hireRateType === 'session' ? 'lesson' : 'hour'}
                    </span>
                  </div>
                )}
                {availableForSwap && (
                  <div className="flex justify-between text-[#6E645F]">
                    <span>Security Deposit:</span>
                    <span className="font-medium text-[#2E1065]">${escrowDepositUSD} USD (100% refundable)</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E645F]">
                  <span>Lesson Length:</span>
                  <span className="font-medium text-[#2E1065]">{sessionDurationMins} minutes</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#F2EBE0] flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#6E645F] hover:text-[#2E1065] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#6E645F] hover:text-[#2E1065] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep < 5 ? (
              <button
                id="post-talent-next-btn"
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#D95338]/20"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="submit-post-talent-btn"
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm shadow-[#D95338]/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Publish Skill
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
