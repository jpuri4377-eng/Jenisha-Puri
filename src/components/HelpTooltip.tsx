import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  term?: string;
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ text, term, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span 
      ref={containerRef} 
      className={`relative inline-flex items-center align-middle ml-1 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={term ? `What is ${term}?` : 'Learn more about this term'}
        className="w-4 h-4 rounded-full text-[#8C827A] hover:text-[#D95338] hover:bg-[#FAF7F2] transition-colors inline-flex items-center justify-center cursor-pointer focus:outline-none"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div 
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 sm:w-68 p-3 bg-[#2D2623] text-white text-xs rounded-2xl shadow-[0_10px_30px_-5px_rgba(44,37,35,0.3)] z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          {term && (
            <p className="font-semibold text-[#FAD5C8] pb-1 border-b border-[#443B38] mb-1.5 text-[11px]">
              {term}
            </p>
          )}
          <p className="font-normal text-[#EAE3D6] text-[11px] leading-relaxed">
            {text}
          </p>
          {/* Subtle triangle indicator */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D2623]" />
        </div>
      )}
    </span>
  );
};
