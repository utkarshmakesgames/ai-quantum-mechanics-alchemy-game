// Quantum Forge — Challenge Definitions
// Each challenge has constraints and goals that test player knowledge

const CHALLENGES = [
  // ================================================================
  // BEGINNER CHALLENGES (Era 1-2 knowledge)
  // ================================================================
  {
    id: 'first_atom',
    name: 'Build Your First Atom',
    description: 'Create a Hydrogen atom from fundamental particles.',
    difficulty: 1,
    type: 'discovery',
    goal: ['hydrogen'],
    maxCombinations: 4,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Atoms are made of protons and electrons. Protons are made of quarks...',
    teaches: 'How atoms are built from subatomic particles'
  },
  {
    id: 'antimatter_world',
    name: 'Antimatter World',
    description: 'Create Antimatter. Matter has an evil twin!',
    difficulty: 1,
    type: 'discovery',
    goal: ['antimatter'],
    maxCombinations: 6,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'First create a positron, then combine antiparticles...',
    teaches: 'How antimatter is the mirror image of normal matter'
  },
  {
    id: 'four_forces',
    name: 'The Four Forces',
    description: 'Discover all three Standard Model forces (strong, weak, electromagnetic).',
    difficulty: 2,
    type: 'discovery',
    goal: ['strong_force', 'weak_force', 'electromagnetic_force'],
    maxCombinations: 12,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Each force is carried by different particles. Gluons carry one, photons another...',
    teaches: 'The fundamental forces that govern all of physics'
  },

  // ================================================================
  // INTERMEDIATE CHALLENGES (Era 2-3 knowledge)
  // ================================================================
  {
    id: 'stellar_forge',
    name: 'Stellar Forge',
    description: 'Create Iron — the element where stars die trying to fuse further.',
    difficulty: 2,
    type: 'discovery',
    goal: ['iron'],
    maxCombinations: 15,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Stars fuse hydrogen into helium, helium into carbon, and onward...',
    teaches: 'Stellar nucleosynthesis — how stars create elements'
  },
  {
    id: 'water_of_life',
    name: 'Water of Life',
    description: 'Create a Water molecule from scratch.',
    difficulty: 2,
    type: 'discovery',
    goal: ['water'],
    maxCombinations: 18,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Water is H₂O. You need hydrogen, oxygen, and a way to bond them...',
    teaches: 'How quantum mechanics enables chemistry'
  },
  {
    id: 'e_equals_mc2',
    name: 'E = mc²',
    description: 'Discover Mass and Annihilation — Einstein\'s famous equation in action.',
    difficulty: 2,
    type: 'discovery',
    goal: ['mass', 'annihilation'],
    maxCombinations: 15,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Matter and antimatter annihilation demonstrates E=mc² directly...',
    teaches: 'Mass-energy equivalence'
  },

  // ================================================================
  // ADVANCED CHALLENGES (Era 3-4 knowledge)
  // ================================================================
  {
    id: 'quantum_weirdness',
    name: 'Quantum Weirdness 101',
    description: 'Discover Wave-Particle Duality, Superposition, and Entanglement.',
    difficulty: 3,
    type: 'discovery',
    goal: ['wave_particle_duality', 'superposition', 'entanglement'],
    maxCombinations: 25,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Start by building atoms and understanding measurement...',
    teaches: 'The three pillars of quantum weirdness'
  },
  {
    id: 'schrodinger_quest',
    name: 'Schrödinger\'s Quest',
    description: 'Find the famous cat! Create Schrödinger\'s Cat.',
    difficulty: 3,
    type: 'discovery',
    goal: ['schrodinger_cat'],
    maxCombinations: 20,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'The cat needs superposition and measurement. Superposition needs...',
    teaches: 'The measurement problem in quantum mechanics'
  },
  {
    id: 'tunnel_vision',
    name: 'Tunnel Vision',
    description: 'Discover Quantum Tunneling — the impossible made possible.',
    difficulty: 3,
    type: 'discovery',
    goal: ['quantum_tunneling'],
    maxCombinations: 18,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'You need a particle and a barrier. Barriers involve energy and nuclei...',
    teaches: 'How particles pass through impossible barriers'
  },
  {
    id: 'uncertainty_quest',
    name: 'Uncertain Destiny',
    description: 'Discover the Uncertainty Principle — nature\'s fundamental limit.',
    difficulty: 3,
    type: 'discovery',
    goal: ['uncertainty_principle'],
    maxCombinations: 20,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Position and momentum together reveal Heisenberg\'s limit...',
    teaches: 'Why you can\'t know everything about a quantum particle'
  },

  // ================================================================
  // EXPERT CHALLENGES (Era 4-5 knowledge)
  // ================================================================
  {
    id: 'build_quantum_computer',
    name: 'Build a Quantum Computer',
    description: 'Create a Quantum Computer from fundamental particles.',
    difficulty: 4,
    type: 'discovery',
    goal: ['quantum_computer'],
    maxCombinations: 30,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Quantum computers need qubits and logic gates. Qubits need superposition...',
    teaches: 'How quantum computing works from the ground up'
  },
  {
    id: 'laser_quest',
    name: 'Light Amplification',
    description: 'Build a Laser — from fundamental particles to coherent light.',
    difficulty: 3,
    type: 'discovery',
    goal: ['laser'],
    maxCombinations: 22,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Lasers use stimulated emission. Stimulated emission needs excited atoms and photons...',
    teaches: 'How stimulated emission creates coherent light'
  },
  {
    id: 'standard_model_quest',
    name: 'The Theory of Everything (Almost)',
    description: 'Discover the Standard Model — humanity\'s best theory of particles and forces.',
    difficulty: 4,
    type: 'discovery',
    goal: ['standard_model'],
    maxCombinations: 35,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'The Standard Model unifies the fundamental forces. Start by discovering them...',
    teaches: 'How all known physics fits into one framework'
  },
  {
    id: 'hawking_quest',
    name: 'Hawking\'s Legacy',
    description: 'Discover Hawking Radiation — where quantum mechanics meets black holes.',
    difficulty: 4,
    type: 'discovery',
    goal: ['hawking_radiation'],
    maxCombinations: 35,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'You need a black hole and quantum fluctuations near its event horizon...',
    teaches: 'How quantum effects make black holes glow'
  },

  // ================================================================
  // MASTER CHALLENGES
  // ================================================================
  {
    id: 'speedrun_hydrogen',
    name: 'Speedrun: Hydrogen',
    description: 'Create Hydrogen in exactly 2 combinations. No wasted moves!',
    difficulty: 2,
    type: 'discovery',
    goal: ['hydrogen'],
    maxCombinations: 2,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'What\'s the fastest path from quarks to a proton?',
    teaches: 'The most direct path from quarks to atoms'
  },
  {
    id: 'quantum_gravity_quest',
    name: 'The Holy Grail',
    description: 'Discover Quantum Gravity — physics\' biggest unsolved puzzle.',
    difficulty: 5,
    type: 'discovery',
    goal: ['quantum_gravity'],
    maxCombinations: 40,
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'You need to unify gravity with quantum field theory. Both require many intermediate steps...',
    teaches: 'Why unifying quantum mechanics and gravity is the ultimate challenge'
  },
  {
    id: 'completionist',
    name: 'Master Physicist',
    description: 'Discover EVERYTHING. All elements across all eras, including hidden ones.',
    difficulty: 5,
    type: 'discovery',
    goal: null, // special: all elements
    maxCombinations: null, // no limit
    startingElements: ['up_quark', 'down_quark', 'electron', 'photon', 'neutrino', 'gluon'],
    hint: 'Leave no combination untried. The hidden discoveries require creative thinking...',
    teaches: 'A complete tour of quantum mechanics!'
  }
];

// Daily challenge: seeded by date
function getDailyChallenge() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Pick from non-master challenges (difficulty 1-4)
  const eligible = CHALLENGES.filter(c => c.difficulty <= 4 && c.id !== 'completionist');
  const index = seed % eligible.length;
  return { ...eligible[index], isDaily: true };
}
