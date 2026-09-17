import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with rich seed data for SwapTalent
const users = [
  {
    id: "user_alex",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Senior Full-Stack & AI Systems Architect",
    bio: "10+ years building scalable distributed backends in Python/Django and React. Looking to master flamenco guitar and conversational Spanish!",
    location: "San Francisco, CA",
    rating: 4.95,
    reviewCount: 38,
    completedSwaps: 24,
    joinedDate: "Feb 2024",
    cryptoWalletAddress: "0x71C...9B3F (Polygon)",
    badges: ["Verified Pro", "Top Mentor", "Fast Responder"]
  },
  {
    id: "user_elena",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    title: "Polyglot & Classical Concert Pianist",
    bio: "Native Spanish & Russian speaker, Royal Conservatory graduate. Passionate about teaching music theory and language fluency in exchange for modern Web Development!",
    location: "Barcelona, Spain",
    rating: 5.0,
    reviewCount: 42,
    completedSwaps: 31,
    joinedDate: "Nov 2023",
    cryptoWalletAddress: "TR7NHq...W7k2 (TRC20)",
    badges: ["Master Swapper", "Perfectionist", "Community Favorite"]
  },
  {
    id: "user_marcus",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Principal UI/UX Designer & Design Systems Lead",
    bio: "Crafting micro-interactions, Figma component architectures, and typography systems. Eager to learn Python data analysis & backend fundamentals.",
    location: "London, UK",
    rating: 4.88,
    reviewCount: 19,
    completedSwaps: 15,
    joinedDate: "Apr 2024",
    cryptoWalletAddress: "0x34A...8C1D (Ethereum)",
    badges: ["Figma Wizard", "Super Swapper"]
  },
  {
    id: "user_maya",
    name: "Maya Patel",
    email: "maya.patel@example.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    title: "Breathwork Facilitator & Ashtanga Yoga Coach",
    bio: "Helping founders and builders de-stress and sustain deep focus through pranayama. Wanting to learn Video Editing in Premiere/DaVinci.",
    location: "Austin, TX",
    rating: 4.98,
    reviewCount: 29,
    completedSwaps: 22,
    joinedDate: "Jan 2024",
    cryptoWalletAddress: "8zQJ...4M9v (Solana)",
    badges: ["Wellness Guide", "Top Rated"]
  }
];

let talents: any[] = [
  {
    id: "talent_1",
    userId: "user_alex",
    user: users[0],
    title: "Python, Django REST Framework & Production Architecture",
    category: "Programming & Tech",
    description: "I will mentor you on building production-grade backend APIs in Python & Django. We'll cover ORM optimization, database indexes, JWT authentication, background workers with Celery, and deploying to Cloud Run.",
    topicsCovered: [
      "Django ORM query optimization & avoiding N+1 queries",
      "Building clean RESTful APIs with DRF ViewSets & Serializers",
      "Dockerizing Django + PostgreSQL for cloud deployment",
      "Secure payment gateway integration (NOWPayments, Stripe)"
    ],
    teachSkills: ["Python", "Django", "PostgreSQL", "Docker", "REST APIs"],
    wantedSkills: ["Spanish Fluency", "Acoustic / Flamenco Guitar", "UI/UX Design"],
    proficiencyLevel: "Expert",
    format: "Pair Programming / Live Collab",
    sessionDurationMins: 60,
    experienceYears: 10,
    availability: "Tuesdays & Thursdays (6PM - 9PM UTC), Weekends flexible",
    escrowDepositUSD: 20.00,
    availableForSwap: true,
    availableForHire: true,
    hireRateUSD: 45,
    hireRateType: "hour",
    studentPrerequisites: "Basic Python syntax familiarity and VS Code installed.",
    portfolioUrl: "https://github.com",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "talent_2",
    userId: "user_elena",
    user: users[1],
    title: "Conversational Spanish Fluency & Accent Reduction",
    category: "Languages",
    description: "Immersive 1-on-1 Spanish conversation tailored to your level. We will roleplay real-world business scenarios, travel, and cultural nuances with real-time feedback on pronunciation and idioms.",
    topicsCovered: [
      "High-frequency colloquial phrases and idioms",
      "Accent reduction and mouth positioning drills",
      "Spontaneous storytelling and listening comprehension",
      "Customized vocabulary deck for your industry"
    ],
    teachSkills: ["Spanish", "Pronunciation", "Grammar", "Cultural Idioms"],
    wantedSkills: ["React & TypeScript", "Tailwind CSS", "Next.js"],
    proficiencyLevel: "Advanced",
    format: "1-on-1 Live Video",
    sessionDurationMins: 45,
    experienceYears: 7,
    availability: "Mondays to Fridays (2PM - 7PM CET)",
    escrowDepositUSD: 15.00,
    availableForSwap: true,
    availableForHire: false,
    hireRateUSD: 30,
    hireRateType: "session",
    studentPrerequisites: "Any level from beginner to advanced. Notebook & microphone.",
    portfolioUrl: "https://linkedin.com",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "talent_3",
    userId: "user_marcus",
    user: users[2],
    title: "Mastering Figma Design Systems & Micro-Interactions",
    category: "Design & Creative",
    description: "Level up your product design workflow. Learn auto-layout 5.0, variables, design tokens, component variants, and prototyping sleek micro-interactions that engineers love to build.",
    topicsCovered: [
      "Atomic design token architecture in Figma",
      "Complex auto-layout nesting with min/max constraints",
      "Interactive component states & smart animate curves",
      "Handoff specifications that developers easily implement"
    ],
    teachSkills: ["Figma", "Design Systems", "UI Design", "Prototyping"],
    wantedSkills: ["Python Basics", "Backend Architecture", "Node.js"],
    proficiencyLevel: "Intermediate",
    format: "1-on-1 Live Video",
    sessionDurationMins: 60,
    experienceYears: 8,
    availability: "Weeknights (7PM - 10PM GMT)",
    escrowDepositUSD: 25.00,
    availableForSwap: false,
    availableForHire: true,
    hireRateUSD: 40,
    hireRateType: "session",
    studentPrerequisites: "Figma free account setup.",
    portfolioUrl: "https://dribbble.com",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "talent_4",
    userId: "user_maya",
    user: users[3],
    title: "Pranayama Breathwork & Posture for High-Focus Builders",
    category: "Fitness & Wellness",
    description: "Combat burnout, eye strain, and neck tension. I will teach you functional breathwork techniques (Box breathing, 4-7-8, Kapalabhati) and ergonomic mobility to unlock sustained focus throughout your workday.",
    topicsCovered: [
      "Vagus nerve stimulation for nervous system down-regulation",
      "Desk mobility exercises for thoracic spine & hip flexors",
      "Breathwork protocols for pre-deep work focus",
      "Evening wind-down routine for restorative sleep"
    ],
    teachSkills: ["Breathwork", "Pranayama", "Yoga Ergonomics", "Stress Management"],
    wantedSkills: ["Video Editing", "DaVinci Resolve", "YouTube Strategy"],
    proficiencyLevel: "Beginner",
    format: "1-on-1 Live Video",
    sessionDurationMins: 45,
    experienceYears: 6,
    availability: "Mornings (7AM - 10AM CST)",
    escrowDepositUSD: 15.00,
    availableForSwap: true,
    availableForHire: true,
    hireRateUSD: 25,
    hireRateType: "session",
    studentPrerequisites: "Quiet space and comfortable chair or yoga mat.",
    portfolioUrl: "",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "talent_5",
    userId: "user_elena",
    user: users[1],
    title: "Classical & Contemporary Piano Improvisation",
    category: "Music & Audio",
    description: "Learn chord substitutions, melodic voice leading, and intuitive ear-training exercises that allow you to sit down at any keyboard and freely improvise emotive pieces.",
    topicsCovered: [
      "Diatonic chords, circle of fifths, and voice leading",
      "Rhythm syncopation and left-hand bass ostinatos",
      "Ear training for chord recognition and melodic playback"
    ],
    teachSkills: ["Piano", "Music Theory", "Ear Training", "Improvisation"],
    wantedSkills: ["Docker", "Linux SysAdmin", "TypeScript"],
    proficiencyLevel: "Expert",
    format: "1-on-1 Live Video",
    sessionDurationMins: 60,
    experienceYears: 12,
    availability: "Fridays & Weekends (11AM - 4PM CET)",
    escrowDepositUSD: 20.00,
    availableForSwap: true,
    availableForHire: false,
    hireRateUSD: 35,
    hireRateType: "hour",
    studentPrerequisites: "Keyboard or piano with at least 61 keys.",
    portfolioUrl: "",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: "talent_6",
    userId: "user_alex",
    user: users[0],
    title: "Startup Financial Modeling & Unit Economics for Founders",
    category: "Business & Finance",
    description: "Understand CAC, LTV, payback periods, burn multiple, and build a clean dynamic 3-statement forecast model in Google Sheets to pitch venture investors with confidence.",
    topicsCovered: [
      "SaaS unit economics & Cohort retention curves",
      "Headcount, runway, and capital expenditure planning",
      "Scenario sensitivity modeling (Base / Bull / Bear)"
    ],
    teachSkills: ["Financial Modeling", "Unit Economics", "Pitch Decks", "Spreadsheets"],
    wantedSkills: ["Russian Conversation", "Classical Guitar", "Illustrator"],
    proficiencyLevel: "Advanced",
    format: "1-on-1 Live Video",
    sessionDurationMins: 60,
    experienceYears: 7,
    availability: "Wednesdays & Weekends",
    escrowDepositUSD: 20.00,
    availableForSwap: false,
    availableForHire: true,
    hireRateUSD: 50,
    hireRateType: "hour",
    studentPrerequisites: "Basic understanding of income statements.",
    portfolioUrl: "",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

let swaps: any[] = [
  {
    id: "swap_101",
    requesterId: "user_alex",
    requester: users[0],
    recipientId: "user_elena",
    recipient: users[1],
    talentListingId: "talent_2",
    talentListing: talents[1],
    requesterOfferTitle: "Full-Stack Web Dev & API Mentorship",
    requesterOfferDescription: "I'll guide Elena through creating a clean portfolio website in React and connecting a custom backend.",
    status: "locked_in_escrow",
    sessionDateProposal: "Saturday 3:00 PM UTC",
    sessionNotes: "Google Meet link created. Mutual escrow guarantee of 15 USDT locked via NOWPayments.",
    meetingLink: "https://meet.google.com/talent-swap-101",
    escrowDepositUSD: 15.00,
    nowPaymentId: "np_live_8941029",
    nowPaymentStatus: "finished",
    requesterDelivered: true,
    recipientDelivered: false,
    escrowReleased: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "swap_102",
    requesterId: "user_marcus",
    requester: users[2],
    recipientId: "user_alex",
    recipient: users[0],
    talentListingId: "talent_1",
    talentListing: talents[0],
    requesterOfferTitle: "Design System Audit & Component Library",
    requesterOfferDescription: "Marcus will audit Alex's open-source app Figma UI kit and rebuild reusable components.",
    status: "completed",
    sessionDateProposal: "Completed on Monday",
    sessionNotes: "Both sessions delivered successfully! 20 USDT escrow refunded back to participants.",
    meetingLink: "https://meet.google.com/talent-swap-102",
    escrowDepositUSD: 20.00,
    nowPaymentId: "np_live_7381923",
    nowPaymentStatus: "finished",
    requesterDelivered: true,
    recipientDelivered: true,
    escrowReleased: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

let nowPaymentTransactions: any[] = [
  {
    payment_id: "np_live_8941029",
    swap_id: "swap_101",
    order_id: "SWAP-101",
    order_description: "SwapTalent Peer Escrow: Alex Chen & Elena Rostova",
    price_amount: 15.00,
    price_currency: "usd",
    pay_amount: 15.00,
    pay_currency: "usdttrc20",
    pay_address: "TPYq87g6qK3xL9v6gR3jX78m9qK1e9X2a4",
    payment_status: "finished",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    network: "TRON (TRC20)",
    tx_hash: "a4f8e9102c914bf8201a4e9b817d235891ce919d8",
    is_sandbox: true
  },
  {
    payment_id: "np_live_7381923",
    swap_id: "swap_102",
    order_id: "SWAP-102",
    order_description: "SwapTalent Peer Escrow: Marcus Vance & Alex Chen",
    price_amount: 20.00,
    price_currency: "usd",
    pay_amount: 20.00,
    pay_currency: "usdttrc20",
    pay_address: "TPYq87g6qK3xL9v6gR3jX78m9qK1e9X2a4",
    payment_status: "finished",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    network: "TRON (TRC20)",
    tx_hash: "b7e21908cae1049281ff928172ea891048f102",
    is_sandbox: true
  }
];

// Crypto currencies supported for NOWPayments Escrow
const supportedCurrencies = [
  { code: "usdttrc20", name: "Tether USD (TRC20)", icon: "₮", network: "Tron Network (Low Fee)", rateVsUSD: 1.00 },
  { code: "usdterc20", name: "Tether USD (ERC20)", icon: "₮", network: "Ethereum Network", rateVsUSD: 1.00 },
  { code: "btc", name: "Bitcoin", icon: "₿", network: "Bitcoin Core", rateVsUSD: 91400.00 },
  { code: "eth", name: "Ethereum", icon: "Ξ", network: "Ethereum Mainnet", rateVsUSD: 3350.00 },
  { code: "sol", name: "Solana", icon: "◎", network: "Solana Network", rateVsUSD: 184.00 },
  { code: "matic", name: "Polygon MATIC", icon: "⬡", network: "Polygon PoS", rateVsUSD: 0.52 },
  { code: "trx", name: "TRON", icon: "TRX", network: "TRON Mainnet", rateVsUSD: 0.22 },
  { code: "doge", name: "Dogecoin", icon: "Ð", network: "Dogecoin Network", rateVsUSD: 0.28 }
];

// Health endpoint
app.get("/api/health", (req, res) => {
  const hasApiKey = Boolean(process.env.NOWPAYMENTS_API_KEY && process.env.NOWPAYMENTS_API_KEY.trim() !== "");
  res.json({
    status: "ok",
    platform: "SwapTalent",
    backendEngine: "Django REST Framework Specification / Express Full-Stack Host",
    nowpayments: {
      configured: hasApiKey,
      sandboxMode: process.env.NOWPAYMENTS_SANDBOX !== "false",
      serviceOnline: true
    }
  });
});

// Users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Talents
app.get("/api/talents", (req, res) => {
  const { q, category, format, level } = req.query;
  let results = [...talents];

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    results = results.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.teachSkills.some(s => s.toLowerCase().includes(query)) ||
      t.wantedSkills.some(s => s.toLowerCase().includes(query))
    );
  }

  if (category && typeof category === 'string' && category !== 'All') {
    results = results.filter(t => t.category === category);
  }

  if (format && typeof format === 'string' && format !== 'All') {
    results = results.filter(t => t.format === format);
  }

  if (level && typeof level === 'string' && level !== 'All') {
    results = results.filter(t => t.proficiencyLevel === level);
  }

  res.json(results);
});

// Post what you want to teach (Talent Listing Form)
app.post("/api/talents", (req, res) => {
  try {
    const {
      userId,
      title,
      category,
      description,
      topicsCovered,
      teachSkills,
      wantedSkills,
      proficiencyLevel,
      format,
      sessionDurationMins,
      experienceYears,
      availability,
      escrowDepositUSD,
      availableForSwap,
      availableForHire,
      hireRateUSD,
      hireRateType,
      studentPrerequisites,
      portfolioUrl
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "Title, description, and category are required." });
    }

    const teacher = users.find(u => u.id === userId) || users[0];

    const newTalent = {
      id: `talent_${Date.now()}`,
      userId: teacher.id,
      user: teacher,
      title,
      category: category || "Programming & Tech",
      description,
      topicsCovered: Array.isArray(topicsCovered) ? topicsCovered : (topicsCovered ? topicsCovered.split('\n').filter(Boolean) : []),
      teachSkills: Array.isArray(teachSkills) ? teachSkills : (teachSkills ? teachSkills.split(',').map((s: string) => s.trim()) : ["Skill"]),
      wantedSkills: Array.isArray(wantedSkills) ? wantedSkills : (wantedSkills ? wantedSkills.split(',').map((s: string) => s.trim()) : ["Anything"]),
      proficiencyLevel: proficiencyLevel || "Intermediate",
      format: format || "1-on-1 Live Video",
      sessionDurationMins: Number(sessionDurationMins) || 60,
      experienceYears: Number(experienceYears) || 2,
      availability: availability || "Flexible",
      escrowDepositUSD: Number(escrowDepositUSD) || 15.00,
      availableForSwap: availableForSwap !== undefined ? Boolean(availableForSwap) : true,
      availableForHire: Boolean(availableForHire),
      hireRateUSD: Number(hireRateUSD) || 35.00,
      hireRateType: hireRateType === 'hour' ? 'hour' : 'session',
      studentPrerequisites: studentPrerequisites || "No prior experience required",
      portfolioUrl: portfolioUrl || "",
      createdAt: new Date().toISOString()
    };

    talents.unshift(newTalent);
    res.status(201).json(newTalent);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create talent listing" });
  }
});

// Delete talent listing
app.delete("/api/talents/:id", (req, res) => {
  const { id } = req.params;
  talents = talents.filter(t => t.id !== id);
  res.json({ success: true, message: "Talent listing removed" });
});

// Swaps & Bookings
app.get("/api/swaps", (req, res) => {
  const { userId } = req.query;
  if (userId && typeof userId === 'string') {
    const userSwaps = swaps.filter(s => s.requesterId === userId || s.recipientId === userId);
    return res.json(userSwaps);
  }
  res.json(swaps);
});

// Propose a Swap or Book a Hire
app.post("/api/swaps", (req, res) => {
  try {
    const {
      type = 'swap',
      requesterId,
      recipientId,
      talentListingId,
      requesterOfferTitle,
      requesterOfferDescription,
      sessionDateProposal,
      escrowDepositUSD,
      hirePaymentUSD,
      hireRateType
    } = req.body;

    const requester = users.find(u => u.id === requesterId) || users[0];
    const recipient = users.find(u => u.id === recipientId) || users[1];
    const listing = talents.find(t => t.id === talentListingId) || talents[0];

    const isHire = type === 'hire';
    const finalAmount = isHire 
      ? Number(hirePaymentUSD || listing.hireRateUSD || 35.00)
      : (Number(escrowDepositUSD) || listing.escrowDepositUSD || 15.00);

    const newSwap = {
      id: `${isHire ? 'hire' : 'swap'}_${Date.now()}`,
      type: isHire ? 'hire' : 'swap',
      requesterId: requester.id,
      requester,
      recipientId: recipient.id,
      recipient,
      talentListingId: listing.id,
      talentListing: listing,
      requesterOfferTitle: requesterOfferTitle || (isHire ? `Pay to Learn: Direct Hire` : "Skill Exchange Offer"),
      requesterOfferDescription: requesterOfferDescription || (isHire ? `Direct booking for 1-on-1 session with ${recipient.name}` : "Mutual peer learning session"),
      status: "escrow_deposit_required",
      sessionDateProposal: sessionDateProposal || "Upcoming weekend",
      sessionNotes: isHire 
        ? `Direct Pay-to-Learn booking. Fee of $${finalAmount.toFixed(2)} USD held safely in escrow via NOWPayments.`
        : "Awaiting NOWPayments escrow deposit to lock mutual commitment.",
      meetingLink: `https://meet.google.com/${isHire ? 'session' : 'swap'}-${Math.random().toString(36).substring(7)}`,
      escrowDepositUSD: finalAmount,
      hirePaymentUSD: isHire ? finalAmount : undefined,
      hireRateType: isHire ? (hireRateType || listing.hireRateType || 'session') : undefined,
      requesterDelivered: false,
      recipientDelivered: false,
      escrowReleased: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    swaps.unshift(newSwap);
    res.status(201).json(newSwap);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to propose swap or booking" });
  }
});

// Confirm delivery (Mark session completed by requester or recipient)
app.post("/api/swaps/:id/confirm-delivery", (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // 'requester' or 'recipient'
  const swap = swaps.find(s => s.id === id);

  if (!swap) {
    return res.status(404).json({ error: "Swap request not found" });
  }

  if (role === 'requester') {
    swap.requesterDelivered = true;
  } else if (role === 'recipient') {
    swap.recipientDelivered = true;
  }

  const isHire = swap.type === 'hire';

  // For hire bookings, either learner confirming completion or both confirming completes it and releases payment
  if (isHire) {
    if (swap.requesterDelivered || (swap.requesterDelivered && swap.recipientDelivered)) {
      swap.status = "completed";
      swap.escrowReleased = true;
      swap.sessionNotes = `Session completed! Direct service payment of $${swap.escrowDepositUSD.toFixed(2)} USD released to ${swap.recipient.name}.`;
      
      const teacher = users.find(u => u.id === swap.recipientId);
      if (teacher) teacher.completedSwaps += 1;
      const learner = users.find(u => u.id === swap.requesterId);
      if (learner) learner.completedSwaps += 1;
    } else {
      swap.status = "delivered_pending_peer";
      swap.sessionNotes = `${swap.recipient.name} marked the session delivered. Awaiting learner confirmation to release payment.`;
    }
  } else {
    // Standard peer swap mutual confirmation
    if (swap.requesterDelivered && swap.recipientDelivered) {
      swap.status = "completed";
      swap.escrowReleased = true;
      swap.sessionNotes = "Both peers confirmed completion! NOWPayments escrow successfully unlocked & refunded.";

      // Update user stats
      const r1 = users.find(u => u.id === swap.requesterId);
      if (r1) r1.completedSwaps += 1;
      const r2 = users.find(u => u.id === swap.recipientId);
      if (r2) r2.completedSwaps += 1;
    } else {
      swap.status = "delivered_pending_peer";
    }
  }

  swap.updatedAt = new Date().toISOString();
  res.json({
    success: true,
    swap,
    bothCompleted: swap.status === 'completed'
  });
});

// Release / refund escrow explicitly
app.post("/api/swaps/:id/release-escrow", (req, res) => {
  const { id } = req.params;
  const swap = swaps.find(s => s.id === id);
  if (!swap) {
    return res.status(404).json({ error: "Swap not found" });
  }

  swap.status = "completed";
  swap.escrowReleased = true;
  swap.updatedAt = new Date().toISOString();
  res.json({ success: true, swap, message: "Escrow released back to swappers." });
});

// NOWPayments: Currencies list
app.get("/api/payments/nowpayments/currencies", (req, res) => {
  res.json(supportedCurrencies);
});

// NOWPayments: Create Escrow Deposit Invoice / Payment
app.post("/api/payments/nowpayments/create-invoice", async (req, res) => {
  try {
    const { swapId, payCurrency = "usdttrc20" } = req.body;
    const swap = swaps.find(s => s.id === swapId);

    if (!swap) {
      return res.status(404).json({ error: "Swap agreement not found" });
    }

    const depositAmountUSD = swap.escrowDepositUSD || 15.00;
    const currencyObj = supportedCurrencies.find(c => c.code.toLowerCase() === payCurrency.toLowerCase()) || supportedCurrencies[0];
    const calculatedPayAmount = Number((depositAmountUSD / currencyObj.rateVsUSD).toFixed(6));

    const paymentId = `np_${Date.now()}_${Math.random().toString(36).substring(4, 9)}`;
    const randomAddress = payCurrency.includes("usdttrc") || payCurrency === "trx"
      ? `T${crypto.randomBytes(16).toString("hex").substring(0, 33)}`
      : payCurrency === "btc"
      ? `bc1q${crypto.randomBytes(16).toString("hex").substring(0, 32)}`
      : payCurrency === "sol"
      ? `${crypto.randomBytes(22).toString("base64").replace(/[^a-zA-Z0-9]/g, "").substring(0, 44)}`
      : `0x${crypto.randomBytes(20).toString("hex")}`;

    // If live API key is present, attempt live NOWPayments call
    let liveResult: any = null;
    if (process.env.NOWPAYMENTS_API_KEY && process.env.NOWPAYMENTS_API_KEY.trim() !== "") {
      try {
        const baseUrl = process.env.NOWPAYMENTS_SANDBOX === "false" 
          ? "https://api.nowpayments.io/v1" 
          : "https://api-sandbox.nowpayments.io/v1";

        const apiResponse = await fetch(`${baseUrl}/payment`, {
          method: "POST",
          headers: {
            "x-api-key": process.env.NOWPAYMENTS_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            price_amount: depositAmountUSD,
            price_currency: "usd",
            pay_currency: payCurrency,
            order_id: `SWAP-${swap.id}`,
            order_description: `SwapTalent Escrow: ${swap.requester.name} & ${swap.recipient.name}`,
            is_fixed_rate: true
          })
        });

        if (apiResponse.ok) {
          liveResult = await apiResponse.json();
        }
      } catch (e) {
        console.warn("NOWPayments live API request failed, falling back to seamless sandbox escrow:", e);
      }
    }

    const txRecord = {
      payment_id: liveResult?.payment_id ? String(liveResult.payment_id) : paymentId,
      swap_id: swap.id,
      order_id: `SWAP-${swap.id}`,
      order_description: `SwapTalent Peer Escrow Deposit: ${swap.requesterOfferTitle}`,
      price_amount: depositAmountUSD,
      price_currency: "usd",
      pay_amount: liveResult?.pay_amount || calculatedPayAmount,
      pay_currency: payCurrency,
      pay_address: liveResult?.pay_address || randomAddress,
      payment_status: "waiting" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      network: currencyObj.network,
      is_sandbox: !liveResult
    };

    nowPaymentTransactions.unshift(txRecord as any);
    swap.nowPaymentId = txRecord.payment_id;
    swap.nowPaymentStatus = "waiting";

    res.status(201).json(txRecord);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create NOWPayments invoice" });
  }
});

// NOWPayments: Payment status check
app.get("/api/payments/nowpayments/status/:paymentId", (req, res) => {
  const { paymentId } = req.params;
  const tx = nowPaymentTransactions.find(t => t.payment_id === paymentId);

  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json(tx);
});

// NOWPayments: Testnet Simulation for Preview Mode
// Lets users click "Simulate Blockchain Confirmation" to see real-time escrow locking!
app.post("/api/payments/nowpayments/simulate-confirm/:paymentId", (req, res) => {
  const { paymentId } = req.params;
  const tx = nowPaymentTransactions.find(t => t.payment_id === paymentId);

  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  tx.payment_status = "finished";
  tx.tx_hash = `0x${crypto.randomBytes(32).toString("hex")}`;
  tx.updated_at = new Date().toISOString();

  // Find linked swap and update status to locked_in_escrow
  const swap = swaps.find(s => s.id === tx.swap_id);
  if (swap) {
    swap.status = "locked_in_escrow";
    swap.nowPaymentStatus = "finished";
    swap.sessionNotes = `Escrow of $${tx.price_amount} ${tx.pay_currency.toUpperCase()} locked in NOWPayments vault. Both peers can now begin sessions!`;
    swap.updatedAt = new Date().toISOString();
  }

  res.json({
    success: true,
    transaction: tx,
    swap
  });
});

// NOWPayments: IPN Webhook handler
app.post("/api/payments/nowpayments/ipn", (req, res) => {
  const sig = req.headers["x-nowpayments-sig"] as string;
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

  if (ipnSecret && sig) {
    const hmac = crypto.createHmac("sha512", ipnSecret);
    const sortedPayload = JSON.stringify(req.body, Object.keys(req.body).sort());
    hmac.update(sortedPayload);
    const expected = hmac.digest("hex");

    if (expected !== sig) {
      return res.status(400).json({ error: "Invalid HMAC signature" });
    }
  }

  const { payment_id, payment_status } = req.body;
  const tx = nowPaymentTransactions.find(t => t.payment_id === String(payment_id));

  if (tx) {
    tx.payment_status = payment_status;
    tx.updated_at = new Date().toISOString();

    const swap = swaps.find(s => s.id === tx.swap_id);
    if (swap && (payment_status === "finished" || payment_status === "confirmed")) {
      swap.status = "locked_in_escrow";
      swap.nowPaymentStatus = "finished";
      swap.updatedAt = new Date().toISOString();
    }
  }

  res.json({ status: "received" });
});

// All transactions list for Escrow Vault audit
app.get("/api/payments/nowpayments/vault", (req, res) => {
  res.json(nowPaymentTransactions);
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SwapTalent server running on http://localhost:${PORT}`);
  });
}

startServer();
