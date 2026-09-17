import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, TrendingUp, ArrowRight, X } from 'lucide-react';
import { TalentListing } from '../types';

interface SearchWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  availableTalents?: TalentListing[];
  placeholder?: string;
  id?: string;
}

const DEFAULT_POPULAR_SKILLS = [
  'React',
  'Cooking',
  'Guitar',
  'Python',
  'Spanish',
  'UI/UX Design',
  'Piano',
  'Photography',
  'Yoga & Fitness',
  'Django',
  'JavaScript',
  'French',
  'Baking',
  'Public Speaking',
  'Creative Writing',
  'Video Editing'
];

export const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  value,
  onChange,
  availableTalents = [],
  placeholder = "Search any skill, teacher, or topic...",
  id = "explore-search-input"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine default popular skills with skills discovered in listings
  const allPopularKeywords = React.useMemo(() => {
    const set = new Set<string>(DEFAULT_POPULAR_SKILLS);
    availableTalents.forEach(t => {
      t.teachSkills?.forEach(s => {
        if (s && s.trim().length > 1) set.add(s.trim());
      });
      t.wantedSkills?.forEach(s => {
        if (s && s.trim().length > 1) set.add(s.trim());
      });
    });
    return Array.from(set);
  }, [availableTalents]);

  // Filter matching keywords when user is typing
  const query = value.trim().toLowerCase();
  const matchingKeywords = React.useMemo(() => {
    if (!query) {
      // If empty query, show top default popular skills
      return DEFAULT_POPULAR_SKILLS.slice(0, 6);
    }

    return allPopularKeywords
      .filter(k => k.toLowerCase().includes(query))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(query);
        const bStarts = b.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      })
      .slice(0, 7);
  }, [query, allPopularKeywords]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (keyword: string) => {
    onChange(keyword);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || matchingKeywords.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % matchingKeywords.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev <= 0 ? matchingKeywords.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < matchingKeywords.length) {
        e.preventDefault();
        handleSelect(matchingKeywords[selectedIndex]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 group">
      <Search className="w-4 h-4 text-[#717171] absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#FF385C] z-10" />
      
      <input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onFocus={() => {
          if (value.trim().length > 0) {
            setIsOpen(true);
          }
        }}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="w-full pl-11 pr-10 py-3.5 rounded-full bg-white text-sm text-[#222222] placeholder:text-[#717171] shadow-2xs border border-stone-200/90 focus:border-stone-300 focus:ring-2 focus:ring-[#FF385C]/30 focus:outline-none transition-all"
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            setIsOpen(false);
            inputRef.current?.focus();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#222222] text-xs p-1 cursor-pointer z-10"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Popular Skills Dropdown when typing */}
      {isOpen && (
        <div 
          id="search-skills-dropdown"
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {/* Header */}
          <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
            <span className="flex items-center gap-1.5 text-stone-500">
              <Sparkles className="w-3 h-3 text-[#FF385C]" />
              {query ? 'Matching Skill Keywords' : 'Popular Skills'}
            </span>
            <span className="text-[10px] font-normal text-stone-400 lowercase">
              {matchingKeywords.length} suggestions
            </span>
          </div>

          {/* Suggestions List */}
          {matchingKeywords.length > 0 ? (
            <div className="px-1.5 space-y-0.5">
              {matchingKeywords.map((keyword, index) => {
                const isSelected = selectedIndex === index;
                
                // Highlight matching substring
                const lowerKw = keyword.toLowerCase();
                const matchPos = query ? lowerKw.indexOf(query) : -1;

                return (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handleSelect(keyword)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-3.5 py-2 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#FFF0F2] text-[#FF385C]' 
                        : 'hover:bg-stone-50 text-[#222222]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white text-[#FF385C]' : 'bg-stone-100 text-stone-500'
                      }`}>
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {matchPos >= 0 ? (
                          <>
                            {keyword.substring(0, matchPos)}
                            <span className="font-bold underline decoration-[#FF385C]/40 text-[#222222]">
                              {keyword.substring(matchPos, matchPos + query.length)}
                            </span>
                            {keyword.substring(matchPos + query.length)}
                          </>
                        ) : (
                          keyword
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-white/80 text-[#FF385C] font-semibold' 
                          : 'bg-stone-100 text-[#717171]'
                      }`}>
                        Skill
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-[#FF385C]' : 'text-stone-300'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-4 text-center text-xs text-stone-500 space-y-2">
              <p>No direct skill keyword found for "{value}"</p>
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 block mb-2 font-medium">Try one of these popular skills:</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {['React', 'Cooking', 'Guitar', 'Spanish'].map(sk => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleSelect(sk)}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-stone-100 hover:bg-[#FFF0F2] hover:text-[#FF385C] text-stone-700 transition-colors cursor-pointer font-medium"
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Popular Pills Footer */}
          {matchingKeywords.length > 0 && (
            <div className="mt-1.5 pt-2 px-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#717171]">
              <span className="text-stone-400">Popular:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {['React', 'Cooking', 'Guitar'].map(sk => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleSelect(sk)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100/80 hover:bg-[#FFF0F2] hover:text-[#FF385C] text-[#222222] transition-colors cursor-pointer"
                  >
                    {sk}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
