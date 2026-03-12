/**
 * Research Notes v2 — Compact Guided Quest System
 *
 * Each note: title + 1-sentence lesson + inference-based hint (not explicit recipe)
 * Tap to expand full lesson text.
 *
 * Fields:
 *   id, title, era, lesson (1 sentence), lessonFull (expanded text),
 *   goal (element IDs to discover), hint (requires inference),
 *   prerequisite (note id or null), nextHint (teaser for next quest)
 */

const RESEARCH_NOTES = [

  // =========================================================================
  //  ERA 1 — The Strong Force & Quark Binding
  // =========================================================================

  {
    id: 'rn_01',
    title: 'Building a Proton',
    era: 1,
    lesson: 'A proton is made of exactly 2 up quarks and 1 down quark (uud) — use the 3-slot forge!',
    lessonFull: 'Quarks can never exist alone — they are always confined in groups of three (baryons) or quark-antiquark pairs (mesons). A proton is the simplest baryon: two up quarks and one down quark bound by gluons. Use the 3-slot mode to combine all three at once.',
    goal: ['proton'],
    hint: 'Toggle 3-slot mode and combine: Up Quark + Up Quark + Down Quark.',
    prerequisite: null,
    nextHint: 'A proton has positive charge. What negatively charged particle could balance it?',
  },

  {
    id: 'rn_02',
    title: 'The Other Nucleon',
    era: 1,
    lesson: 'A neutron is made of 1 up quark and 2 down quarks (udd) — the mirror recipe of a proton.',
    lessonFull: 'Just as the proton is uud, the neutron is udd. Use 3-slot mode: one up quark and two down quarks. The neutron has no electric charge because the quark charges cancel out.',
    goal: ['neutron'],
    hint: 'Mirror the proton recipe in 3-slot mode: Up Quark + Down Quark + Down Quark.',
    prerequisite: 'rn_01',
    nextHint: 'With protons and neutrons, you can build atomic nuclei.',
  },

  {
    id: 'rn_03',
    title: 'The Simplest Atom',
    era: 1,
    lesson: 'Hydrogen is just one proton orbited by one electron — the simplest atom in the universe.',
    lessonFull: 'Every star begins by fusing hydrogen. To make it, you need a proton (which you must build from quarks) and an electron.',
    goal: ['hydrogen'],
    hint: 'A proton needs a negatively charged companion to become an atom.',
    prerequisite: 'rn_01',
    nextHint: 'Stars fuse hydrogen. What happens when two hydrogen atoms collide?',
  },

  // =========================================================================
  //  ERA 2 — Composites, Antimatter & Forces
  // =========================================================================

  {
    id: 'rn_04',
    title: 'Mirror Matter',
    era: 2,
    lesson: 'Two photons colliding can produce a matter-antimatter pair from pure energy.',
    lessonFull: 'For every particle, nature created an antimatter twin. When two high-energy photons collide, they can produce an electron-positron pair — matter from pure light (pair production).',
    goal: ['positron'],
    hint: 'What happens when two photons collide? Think pair production.',
    prerequisite: null,
    nextHint: 'What happens when a positron meets its matter twin?',
  },

  {
    id: 'rn_05',
    title: 'When Worlds Collide',
    era: 2,
    lesson: 'When matter meets antimatter, they annihilate completely into pure energy.',
    lessonFull: 'A positron meeting an electron produces the most efficient energy release in physics — total mass-to-energy conversion via E=mc².',
    goal: ['annihilation'],
    hint: 'Bring the positron face-to-face with its matter twin.',
    prerequisite: 'rn_04',
    nextHint: 'Meanwhile, gluons self-interact. What force do they reveal?',
  },

  {
    id: 'rn_06',
    title: 'Stellar Fusion',
    era: 2,
    lesson: 'Stars fuse hydrogen into helium — but you need two hydrogen atoms to do it.',
    lessonFull: 'Deep inside stars, hydrogen nuclei slam together and fuse into helium. This means you must build hydrogen twice (each requires a proton from scratch).',
    goal: ['helium'],
    hint: 'Fuse the simplest atom with itself. You will need to craft it twice.',
    prerequisite: 'rn_03',
    nextHint: 'Helium is just the start. Stars fuse it into heavier elements.',
  },

  {
    id: 'rn_07',
    title: 'The Nuclear Core',
    era: 2,
    lesson: 'An atomic nucleus forms when protons pack tightly together via the strong force.',
    lessonFull: 'The nucleus contains 99.9% of an atom\'s mass in 0.0001% of its volume. Even a simple nucleus can form from two protons.',
    goal: ['nucleus'],
    hint: 'Pack two protons together as tightly as possible.',
    prerequisite: 'rn_01',
    nextHint: 'Electrons want to settle into orbits around a nucleus.',
  },

  // =========================================================================
  //  ERA 3 — Stellar Physics & Atomic Structure
  // =========================================================================

  {
    id: 'rn_08',
    title: 'Stardust',
    era: 3,
    lesson: 'Stars fuse helium into carbon, then carbon captures helium to become oxygen.',
    lessonFull: 'After hydrogen, stars fuse helium into carbon (triple-alpha process), then carbon + helium → oxygen. Every carbon atom in your body was forged inside a dying star.',
    goal: ['carbon', 'oxygen'],
    hint: 'Fuse helium with itself, then fuse the result with more helium.',
    prerequisite: 'rn_06',
    nextHint: 'The fusion chain has a limit. What element stops it?',
  },

  {
    id: 'rn_09',
    title: 'Where Stars Die',
    era: 3,
    lesson: 'Iron is where stellar fusion stops — fusing it absorbs energy instead of releasing it.',
    lessonFull: 'Massive stars fuse elements in shells until the core turns to iron. Iron\'s nucleus is so tightly bound that further fusion costs energy, triggering a supernova.',
    goal: ['iron'],
    hint: 'The heaviest stellar product comes from fusing two atoms of what we breathe.',
    prerequisite: 'rn_07',
    nextHint: 'Iron scattered by supernovae forms new worlds. What can hydrogen and oxygen make?',
  },

  {
    id: 'rn_10',
    title: 'Electron Neighborhoods',
    era: 3,
    lesson: 'Electrons occupy discrete shells around the nucleus, not smooth orbits.',
    lessonFull: 'Electron shells determine an element\'s chemical behavior. They form when electrons settle around a nucleus in quantized energy levels.',
    goal: ['electron_shell'],
    hint: 'What happens when an electron settles around a nucleus?',
    prerequisite: 'rn_07',
    nextHint: 'Electrons in shells can jump levels. What do they emit when they drop?',
  },

  {
    id: 'rn_11',
    title: 'Making Light',
    era: 3,
    lesson: 'When an excited electron drops to a lower shell, it emits a photon.',
    lessonFull: 'The color of the emitted photon depends on the energy gap. This is why neon signs glow and every element has a unique spectral fingerprint.',
    goal: ['photon_emission'],
    hint: 'Give an electron shell a jolt of energy and watch what comes out.',
    prerequisite: 'rn_10',
    nextHint: 'What if one emitted photon triggers another atom to emit an identical photon?',
  },

  {
    id: 'rn_12',
    title: 'Water of Life',
    era: 3,
    lesson: 'Hydrogen bonding with oxygen creates water — the molecule of life.',
    lessonFull: 'Oxygen wants two extra electrons; hydrogen has one to share. Two H + one O = H₂O.',
    goal: ['water'],
    hint: 'Combine what stars burn with what we breathe.',
    prerequisite: 'rn_07',
    nextHint: 'At the smallest scales, particles behave in bizarre quantum ways...',
  },

  // =========================================================================
  //  ERA 4 — Quantum Mechanics
  // =========================================================================

  {
    id: 'rn_bridge_4',
    title: 'Building Barriers',
    era: 4,
    lesson: 'Charged particles face energy barriers — the electromagnetic force repels them from nuclei.',
    lessonFull: 'The Coulomb barrier is an energy barrier created by electromagnetic repulsion around atomic nuclei. To explore quantum phenomena, you first need to create this barrier. Try combining the electromagnetic force with a nucleus — or combine energy with the strong force.',
    goal: ['energy_barrier'],
    hint: 'Combine the electromagnetic force with a nucleus to create an energy barrier. Or try energy + strong force.',
    prerequisite: 'rn_10',
    nextHint: 'Now fire a particle at this barrier to see something quantum happen...',
  },

  {
    id: 'rn_13',
    title: 'The Quantum World Begins',
    era: 4,
    lesson: 'The double-slit experiment proves that particles can behave as waves.',
    lessonFull: 'Even single photons produce an interference pattern through two slits, as if each passes through both simultaneously. Fire a photon or electron at the energy barrier to see this.',
    goal: ['double_slit'],
    hint: 'Send a photon or electron through the energy barrier.',
    prerequisite: 'rn_bridge_4',
    nextHint: 'If particles go through both slits, they must be in two states at once...',
  },

  {
    id: 'rn_14',
    title: 'Two Places at Once',
    era: 4,
    lesson: 'Quantum superposition means a particle genuinely exists in multiple states simultaneously.',
    lessonFull: 'A particle\'s wave function describes all possible states it could be in. Send an electron through the double-slit apparatus to see superposition emerge.',
    goal: ['superposition'],
    hint: 'Send a particle through the double-slit apparatus.',
    prerequisite: 'rn_13',
    nextHint: 'What happens when you try to observe superposition?',
  },

  {
    id: 'rn_15',
    title: 'The Observer Effect',
    era: 4,
    lesson: 'Observing a quantum system collapses its superposition into a single definite state.',
    lessonFull: 'Even a single photon is enough to disturb the quantum world. When you measure a particle in superposition, it "chooses" a state.',
    goal: ['measurement'],
    hint: 'Shine a photon on something in superposition.',
    prerequisite: 'rn_14',
    nextHint: 'Could controlled superposition + measurement encode information?',
  },

  {
    id: 'rn_16',
    title: 'Spooky Connections',
    era: 4,
    lesson: 'Entangled particles share fate — measuring one instantly determines the other.',
    lessonFull: 'When two superposed systems interact, they become entangled. Einstein called it "spooky action at a distance."',
    goal: ['entanglement'],
    hint: 'What happens when two particles, each in superposition, interact?',
    prerequisite: 'rn_14',
    nextHint: 'Entanglement enables quantum computing and teleportation.',
  },

  {
    id: 'rn_17',
    title: 'Through the Impossible',
    era: 4,
    lesson: 'Quantum tunneling lets particles pass through barriers they classically shouldn\'t.',
    lessonFull: 'A particle\'s wave function leaks through barriers, giving it a chance of appearing on the other side. This powers the Sun and your flash drives.',
    goal: ['quantum_tunneling'],
    hint: 'A wave function encountering an energy barrier sometimes slips through.',
    prerequisite: 'rn_13',
    nextHint: 'Position and momentum have a fundamental limit...',
  },

  {
    id: 'rn_18',
    title: "Nature's Speed Limit",
    era: 4,
    lesson: 'You cannot simultaneously know both exact position and exact momentum of a particle.',
    lessonFull: 'Heisenberg\'s uncertainty principle is not an instrument limitation — it\'s a fundamental law of nature.',
    goal: ['uncertainty_principle'],
    hint: 'What emerges when you try to define both momentum and position at once?',
    prerequisite: 'rn_15',
    nextHint: 'If you can never reach perfect certainty, can you reach perfect stillness?',
  },

  {
    id: 'rn_19',
    title: 'The Cat Paradox',
    era: 4,
    lesson: 'Schrödinger\'s cat: quantum superposition applied to a macroscopic system via radioactive decay.',
    lessonFull: 'A radioactive atom in superposition would leave a cat both alive and dead — until you open the box and measure.',
    goal: ['schrodinger_cat'],
    hint: 'Combine quantum superposition with something radioactive.',
    prerequisite: 'rn_14',
    nextHint: 'Superposition turns out to be incredibly useful for computing.',
  },

  // =========================================================================
  //  ERA 5 — Applications & Frontiers
  // =========================================================================

  {
    id: 'rn_20',
    title: 'Amplified Light',
    era: 5,
    lesson: 'A photon can trigger an excited atom to emit an identical photon — this chain reaction creates lasers.',
    lessonFull: 'Stimulated emission, predicted by Einstein in 1917, is the principle behind all lasers.',
    goal: ['laser'],
    hint: 'Combine stimulated emission with another photon for a chain reaction.',
    prerequisite: 'rn_11',
    nextHint: 'Quantum technology goes far beyond lasers.',
  },

  {
    id: 'rn_21',
    title: 'Quantum Bits',
    era: 5,
    lesson: 'A qubit exploits superposition to be both 0 and 1 simultaneously until measured.',
    lessonFull: 'Classical bits are 0 OR 1. Qubits are both at once. The art of quantum computing is asking the right question before you look.',
    goal: ['qubit'],
    hint: 'What do you get when measurement meets superposition?',
    prerequisite: 'rn_15',
    nextHint: 'A single qubit needs logic gates to become truly useful.',
  },

  {
    id: 'rn_22',
    title: 'The Quantum Computer',
    era: 5,
    lesson: 'Qubits + logic gates = a computer that processes many possibilities simultaneously.',
    lessonFull: 'Quantum computers can solve problems that would take classical computers billions of years, using superposition and entanglement.',
    goal: ['quantum_computer'],
    hint: 'Route a qubit through a logic gate.',
    prerequisite: 'rn_21',
    nextHint: 'You have built the future of computing.',
  },

  {
    id: 'rn_23',
    title: 'Absolute Stillness',
    era: 5,
    lesson: 'The uncertainty principle forbids zero energy — even at absolute zero, particles still vibrate.',
    lessonFull: 'Classical physics says all motion stops at 0K. Quantum mechanics says zero-point energy prevents true stillness.',
    goal: ['absolute_zero'],
    hint: 'Push energy down to the zero-point level.',
    prerequisite: 'rn_18',
    nextHint: 'At the coldest temperatures, exotic quantum states emerge.',
  },

  {
    id: 'rn_24',
    title: 'Gravity Meets Quantum',
    era: 5,
    lesson: 'Unifying gravity with quantum field theory is the holy grail of physics — still unsolved.',
    lessonFull: 'General relativity describes gravity. Quantum field theory describes the other forces. Combining them would explain black holes and the Big Bang.',
    goal: ['quantum_gravity'],
    hint: 'What emerges when gravity encounters quantum field theory?',
    prerequisite: 'rn_16',
    nextHint: 'You are exploring the frontier of human knowledge.',
  },

  {
    id: 'rn_25',
    title: 'The Standard Model',
    era: 5,
    lesson: 'Humanity\'s most successful theory unifies three of four fundamental forces and all known particles.',
    lessonFull: 'The Standard Model predicted the Higgs boson decades before its discovery. Only gravity remains outside its reach.',
    goal: ['standard_model'],
    hint: 'Unify the strong force with the electromagnetic force.',
    prerequisite: 'rn_16',
    nextHint: 'You have mapped the known universe of particles and forces.',
  },

];
