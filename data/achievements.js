// Quantum Forge v2 — Achievement Definitions
// Each achievement has an id, name, description, tier, category, and check function

const ACHIEVEMENTS = [
  // ================================================================
  // DISCOVERY
  // ================================================================
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Discover your first element.',
    tier: 'bronze',
    category: 'discovery',
    check: (state) => state.discovered.length > STARTING_ELEMENTS.length
  },
  {
    id: 'double_digits',
    name: 'Double Digits',
    description: 'Discover 10 elements.',
    tier: 'silver',
    category: 'discovery',
    check: (state) => state.discovered.length >= 10 + STARTING_ELEMENTS.length  // 7 starters + 10 = 17
  },
  {
    id: 'half_universe',
    name: 'Half the Universe',
    description: 'Discover 46 elements.',
    tier: 'gold',
    category: 'discovery',
    check: (state) => state.discovered.length >= 46
  },
  {
    id: 'complete_standard_model',
    name: 'The Complete Standard Model',
    description: 'Discover all visible elements.',
    tier: 'platinum',
    category: 'discovery',
    check: (state) => {
      const visible = Object.values(ELEMENTS).filter(e => e.era <= 5).length;
      const found = state.discovered.filter(id => ELEMENTS[id] && ELEMENTS[id].era <= 5).length;
      return found >= visible;
    }
  },

  // ================================================================
  // CRAFTING
  // ================================================================
  {
    id: 'assembly_line',
    name: 'Assembly Line',
    description: 'Perform 50 total combinations.',
    tier: 'bronze',
    category: 'crafting',
    check: (state) => state.stats.totalCombinations >= 50
  },
  {
    id: 'particle_factory',
    name: 'Particle Factory',
    description: 'Perform 200 total combinations.',
    tier: 'silver',
    category: 'crafting',
    check: (state) => state.stats.totalCombinations >= 200
  },
  {
    id: 'collider_operator',
    name: 'Collider Operator',
    description: 'Perform 1000 total combinations.',
    tier: 'gold',
    category: 'crafting',
    check: (state) => state.stats.totalCombinations >= 1000
  },

  // ================================================================
  // MASTERY
  // ================================================================
  {
    id: 'familiar_face',
    name: 'Familiar Face',
    description: 'Reach Familiar mastery on any element.',
    tier: 'bronze',
    category: 'mastery',
    check: (state) => Object.values(state.mastery || {}).some(m => m.timesCrafted >= 3)
  },
  {
    id: 'proficient_physicist',
    name: 'Proficient Physicist',
    description: 'Reach Proficient mastery on 10 elements.',
    tier: 'silver',
    category: 'mastery',
    check: (state) => Object.values(state.mastery || {}).filter(m => m.timesCrafted >= 7).length >= 10
  },
  {
    id: 'master_of_matter',
    name: 'Master of Matter',
    description: 'Reach Master mastery on all Era 1-2 elements.',
    tier: 'gold',
    category: 'mastery',
    check: (state) => {
      const era12 = Object.keys(ELEMENTS).filter(id => ELEMENTS[id].era <= 2 && !ELEMENTS[id].isIntermediate);
      return era12.every(id => (state.mastery || {})[id] && state.mastery[id].timesCrafted >= 15);
    }
  },

  // ================================================================
  // STREAK
  // ================================================================
  {
    id: 'getting_warmer',
    name: 'Getting Warmer',
    description: 'Reach a 3x streak.',
    tier: 'bronze',
    category: 'streak',
    check: (state) => (state.stats.bestStreak || 0) >= 3
  },
  {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Reach an 8x streak.',
    tier: 'silver',
    category: 'streak',
    check: (state) => (state.stats.bestStreak || 0) >= 8
  },
  {
    id: 'fibonacci_flow',
    name: 'Fibonacci Flow',
    description: 'Reach a 13x streak.',
    tier: 'gold',
    category: 'streak',
    check: (state) => (state.stats.bestStreak || 0) >= 13
  },
  {
    id: 'quantum_coherence',
    name: 'Quantum Coherence',
    description: 'Reach a 21x streak.',
    tier: 'platinum',
    category: 'streak',
    check: (state) => (state.stats.bestStreak || 0) >= 21
  },

  // ================================================================
  // KNOWLEDGE
  // ================================================================
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Complete 10 Research Notes.',
    tier: 'bronze',
    category: 'knowledge',
    check: (state) => {
      if (typeof RESEARCH_NOTES === 'undefined') return false;
      let completed = 0;
      for (const note of RESEARCH_NOTES) {
        if (note.goal && note.goal.every(g => state.discovered.includes(g))) completed++;
      }
      return completed >= 10;
    }
  },
  {
    id: 'professor',
    name: 'Professor',
    description: 'Complete all Research Notes.',
    tier: 'gold',
    category: 'knowledge',
    check: (state) => {
      if (typeof RESEARCH_NOTES === 'undefined') return false;
      return RESEARCH_NOTES.every(note => !note.goal || note.goal.every(g => state.discovered.includes(g)));
    }
  },

  // ================================================================
  // CHALLENGE
  // ================================================================
  {
    id: 'challenger',
    name: 'Challenger',
    description: 'Complete 1 challenge.',
    tier: 'bronze',
    category: 'challenge',
    check: (state) => Object.keys(state.challenges || {}).length >= 1
  },
  {
    id: 'puzzle_master',
    name: 'Puzzle Master',
    description: 'Complete all challenges.',
    tier: 'gold',
    category: 'challenge',
    check: (state) => {
      if (typeof CHALLENGES === 'undefined') return false;
      return CHALLENGES.every(c => (state.challenges || {})[c.id]);
    }
  },

  // ================================================================
  // SECRET / EASTER EGGS
  // ================================================================
  {
    id: 'antimatter_world',
    name: 'Antimatter World',
    description: 'Discover all antimatter-related elements.',
    tier: 'gold',
    category: 'secret',
    check: (state) => ['positron', 'antiproton', 'annihilation', 'antimatter'].every(id => state.discovered.includes(id))
  },
  {
    id: 'the_cat_is_alive',
    name: 'The Cat is Alive',
    description: 'Discover Schrödinger\'s Cat.',
    tier: 'silver',
    category: 'secret',
    check: (state) => state.discovered.includes('schrodinger_cat')
  },
  {
    id: 'spooky',
    name: 'Spooky',
    description: 'Discover Spooky Action at a Distance.',
    tier: 'gold',
    category: 'secret',
    check: (state) => state.discovered.includes('spooky_action')
  },
  {
    id: 'everything_connected',
    name: 'Everything is Connected',
    description: 'Discover the Standard Model.',
    tier: 'gold',
    category: 'secret',
    check: (state) => state.discovered.includes('standard_model')
  },

  // ================================================================
  // QE MILESTONES
  // ================================================================
  {
    id: 'qe_1000',
    name: 'Energy Surplus',
    description: 'Earn 1,000 Quantum Energy.',
    tier: 'bronze',
    category: 'crafting',
    check: (state) => (state.stats.quantumEnergy || 0) >= 1000
  },
  {
    id: 'qe_10000',
    name: 'Power Plant',
    description: 'Earn 10,000 Quantum Energy.',
    tier: 'silver',
    category: 'crafting',
    check: (state) => (state.stats.quantumEnergy || 0) >= 10000
  },
  {
    id: 'qe_50000',
    name: 'Stellar Core',
    description: 'Earn 50,000 Quantum Energy.',
    tier: 'gold',
    category: 'crafting',
    check: (state) => (state.stats.quantumEnergy || 0) >= 50000
  },
];
