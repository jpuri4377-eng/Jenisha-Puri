/**
 * Plain-language helpers to explain technical skills and financial concepts in everyday terms.
 */

export const getPlainSkillSubtitle = (title: string, category?: string, description?: string): string => {
  const t = (title || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (t.includes('django') || t.includes('rest framework') || t.includes('python')) {
    return 'Learn how to build websites, online apps, and data systems behind the scenes.';
  }
  if (t.includes('figma') || t.includes('design system') || t.includes('micro-interaction')) {
    return 'Design beautiful app screens and website layouts before writing any code.';
  }
  if (t.includes('spanish') || t.includes('accent') || t.includes('conversational')) {
    return 'Practice speaking natural Spanish with friendly guidance and zero pressure.';
  }
  if (t.includes('breathwork') || t.includes('pranayama') || t.includes('yoga') || t.includes('posture')) {
    return 'Simple breathing routines to beat screen fatigue and regain calm focus.';
  }
  if (t.includes('piano') || t.includes('improvisation') || t.includes('music theory')) {
    return 'Learn how to sit down at a keyboard and play your own melodies by ear.';
  }
  if (t.includes('react') || t.includes('frontend') || t.includes('javascript') || t.includes('typescript')) {
    return 'Build interactive websites and visual buttons that people click and use.';
  }
  if (t.includes('docker') || t.includes('kubernetes') || t.includes('cloud') || t.includes('devops')) {
    return 'Set up computers on the internet to keep websites running smoothly 24/7.';
  }
  if (t.includes('financial') || t.includes('accounting') || t.includes('startup') || t.includes('business')) {
    return 'Practical money and business fundamentals simplified for real-world projects.';
  }

  // Fallback for custom user skills
  if (c.includes('tech') || c.includes('programming')) {
    return 'Practical computer and tech skills explained clearly in plain English.';
  }
  if (c.includes('language')) {
    return '1-on-1 language coaching to help you speak with confidence.';
  }
  if (c.includes('design') || c.includes('creative')) {
    return 'Creative design tips to make your ideas and visuals look clean and professional.';
  }
  if (c.includes('fitness') || c.includes('wellness')) {
    return 'Everyday wellness habits to feel energized, refreshed, and focused.';
  }
  if (c.includes('music')) {
    return 'Hands-on music lessons tailored to your pace and favorite songs.';
  }

  // Default friendly fallback from description if available
  if (description && description.length > 10) {
    const firstSentence = description.split('.')[0].trim();
    if (firstSentence.length < 85) return `${firstSentence}.`;
    return `${firstSentence.substring(0, 80)}...`;
  }

  return 'Personalized 1-on-1 guidance from a verified community peer.';
};

export const FINANCE_EXPLANATIONS = {
  escrow: 'Your payment or deposit is held safely by the system and only released once your session is finished and confirmed.',
  deposit: 'A temporary deposit to make sure both people show up. You receive 100% of it back right after the lesson!',
  securityDeposit: 'A temporary deposit to make sure both people show up. You receive 100% of it back right after the lesson!',
  escrowRelease: 'Funds are unlocked and transferred once both sides confirm the session took place.',
  lessonFee: 'Held safely in escrow. The teacher is only paid after you confirm your lesson was completed.',
  refund: 'If the session is cancelled or the other person does not show up, your payment is refunded immediately with no hassle.',
  serviceFee: 'A tiny processing fee to keep payments safe and run our verified exchange platform.'
};
