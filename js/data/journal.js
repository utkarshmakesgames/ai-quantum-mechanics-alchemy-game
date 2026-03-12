// Universe Timeline — Physics Journal Entries
// Explanations shown when player makes a discovery in Story or Sandbox mode.

const JOURNAL = {
  // === QUARKS & HADRONS ===
  up_quark: {
    title: 'Up Quark',
    text: 'The lightest quark, with electric charge +2/3. Up quarks are one of the building blocks of protons and neutrons. They interact via the strong force, which is mediated by gluons.',
    funFact: 'Up quarks make up about 1% of a proton\'s mass — the rest comes from the energy of gluons binding them together (E=mc²).'
  },
  down_quark: {
    title: 'Down Quark',
    text: 'A quark with electric charge -1/3, slightly heavier than the up quark. The different combination of up and down quarks determines whether you get a proton or neutron.',
    funFact: 'If the down quark were lighter than the up quark, protons would decay and atoms as we know them couldn\'t exist.'
  },
  electron: {
    title: 'Electron',
    text: 'A fundamental lepton with charge -1. Electrons orbit atomic nuclei and are responsible for chemistry, electricity, and light emission.',
    funFact: 'An electron has no known internal structure — it\'s truly fundamental, not made of smaller parts.'
  },
  photon: {
    title: 'Photon',
    text: 'The quantum of light and carrier of the electromagnetic force. Photons are massless and always travel at the speed of light.',
    funFact: 'From a photon\'s perspective, no time passes between emission and absorption — even across billions of light-years.'
  },
  neutrino: {
    title: 'Neutrino',
    text: 'A nearly massless particle that barely interacts with matter. Trillions pass through your body every second from the Sun.',
    funFact: 'A neutrino could pass through a light-year of lead with only a 50% chance of hitting something.'
  },
  gluon: {
    title: 'Gluon',
    text: 'The carrier of the strong force that binds quarks together. Unlike photons, gluons carry "color charge" and interact with each other.',
    funFact: 'Gluons are responsible for ~99% of the mass of protons and neutrons through binding energy.'
  },
  energy: {
    title: 'Energy',
    text: 'The fundamental capacity to do work. In quantum mechanics, energy is quantized — it comes in discrete packets.',
    funFact: 'Einstein\'s E=mc² showed that mass and energy are interchangeable — a small amount of mass contains enormous energy.'
  },
  proton: {
    title: 'Proton',
    text: 'A baryon made of two up quarks and one down quark (uud), held together by the strong force. Protons are stable and form the nuclei of all atoms.',
    funFact: 'No proton has ever been observed to decay. Their lifetime is estimated at over 10³⁴ years.'
  },
  neutron: {
    title: 'Neutron',
    text: 'A baryon made of one up quark and two down quarks (udd). Neutrons are stable inside nuclei but decay in about 15 minutes when free.',
    funFact: 'Free neutron decay (beta decay) was key evidence for the weak nuclear force.'
  },
  positron: {
    title: 'Positron',
    text: 'The antimatter counterpart of the electron, with charge +1. Created in pair production when high-energy photons convert to matter.',
    funFact: 'Positrons are used in PET scans — they annihilate with electrons in your body, producing detectable gamma rays.'
  },

  // === ATOMS ===
  hydrogen: {
    title: 'Hydrogen',
    text: 'The simplest atom: one proton and one electron. Hydrogen makes up 75% of all baryonic matter in the universe.',
    funFact: 'Hydrogen was the first atom to form, about 380,000 years after the Big Bang.'
  },
  helium: {
    title: 'Helium',
    text: 'The second element, with 2 protons. Most helium was created in the first 3 minutes after the Big Bang (primordial nucleosynthesis).',
    funFact: 'Helium was discovered on the Sun before it was found on Earth — hence its name from Helios, the Greek sun god.'
  },
  deuterium: {
    title: 'Deuterium',
    text: 'Heavy hydrogen — a proton and neutron bound together with one electron. A stepping stone in Big Bang nucleosynthesis.',
    funFact: 'The ratio of deuterium to hydrogen in the universe is a key measurement that confirms Big Bang theory.'
  },
  lithium: {
    title: 'Lithium',
    text: 'The third element. Small amounts of lithium-7 were produced in Big Bang nucleosynthesis. Heavier lithium comes from cosmic rays.',
    funFact: 'The "lithium problem" — Big Bang theory predicts 3x more lithium-7 than we observe. This mystery remains unsolved.'
  },
  carbon: {
    title: 'Carbon',
    text: 'Created inside stars via the triple-alpha process (3 helium nuclei fusing). Carbon is the basis of all known life.',
    funFact: 'Fred Hoyle predicted carbon\'s nuclear resonance — without it, stars couldn\'t make carbon and life couldn\'t exist.'
  },
  nitrogen: {
    title: 'Nitrogen',
    text: 'Forged in stars through the CNO cycle, where carbon acts as a catalyst for hydrogen fusion. Makes up 78% of Earth\'s atmosphere.',
    funFact: 'The CNO cycle dominates energy production in stars more massive than 1.3 solar masses.'
  },
  oxygen: {
    title: 'Oxygen',
    text: 'Created in massive stars by fusing carbon with helium. The third most abundant element in the universe.',
    funFact: 'Oxygen is produced in the final stages of stellar nucleosynthesis, just before iron halts the fusion chain.'
  },
  iron: {
    title: 'Iron',
    text: 'The end of the stellar fusion line. Iron has the most stable nucleus — fusing it absorbs energy rather than releasing it.',
    funFact: 'When a massive star\'s core becomes iron, fusion stops and the star collapses into a supernova within seconds.'
  },
  uranium: {
    title: 'Uranium',
    text: 'A heavy element created in neutron star mergers and supernovae via rapid neutron capture (r-process).',
    funFact: 'Natural uranium is radioactive with a half-life of 4.5 billion years — nearly the age of the Earth.'
  },

  // === FORCES ===
  strong_force: {
    title: 'Strong Nuclear Force',
    text: 'The strongest of the four fundamental forces. It binds quarks into protons/neutrons and holds atomic nuclei together.',
    funFact: 'The strong force gets STRONGER with distance — this is why quarks can never be isolated (confinement).'
  },
  weak_force: {
    title: 'Weak Nuclear Force',
    text: 'Responsible for radioactive decay and the transformation of quarks from one type to another. Mediated by W and Z bosons.',
    funFact: 'The weak force is the only force that can change quark flavor — turning a down quark into an up quark.'
  },
  electromagnetic_force: {
    title: 'Electromagnetic Force',
    text: 'Governs interactions between charged particles. Responsible for light, chemistry, electricity, and magnetism.',
    funFact: 'Electromagnetism and the weak force are actually one force (electroweak) at very high energies.'
  },

  // === QUANTUM PHENOMENA ===
  wave_particle_duality: {
    title: 'Wave-Particle Duality',
    text: 'All quantum objects behave as both waves and particles. Which behavior you observe depends on how you measure them.',
    funFact: 'De Broglie proposed this in his 1924 PhD thesis — his examiners were so unsure they sent it to Einstein for review.'
  },
  superposition: {
    title: 'Superposition',
    text: 'A quantum system exists in all possible states simultaneously until measured. This is the foundation of quantum computing.',
    funFact: 'Schrödinger\'s cat thought experiment was meant to show how absurd superposition seems at the macro scale.'
  },
  entanglement: {
    title: 'Quantum Entanglement',
    text: 'When two particles become correlated so that measuring one instantly determines the state of the other, regardless of distance.',
    funFact: 'Einstein called it "spooky action at a distance" — but it can\'t be used to send information faster than light.'
  },
  quantum_tunneling: {
    title: 'Quantum Tunneling',
    text: 'A particle can pass through an energy barrier it classically shouldn\'t be able to cross, due to its wave-like nature.',
    funFact: 'Without quantum tunneling, the Sun couldn\'t fuse hydrogen — protons don\'t have enough energy to overcome the Coulomb barrier classically.'
  },
  uncertainty_principle: {
    title: 'Uncertainty Principle',
    text: 'You cannot simultaneously know both the exact position and momentum of a particle. This is a fundamental limit, not a measurement problem.',
    funFact: 'Heisenberg originally thought it was about measurement disturbing the system — Bohr corrected him.'
  },

  // === APPLICATIONS ===
  nuclear_fusion: {
    title: 'Nuclear Fusion',
    text: 'Lighter nuclei combine to form heavier ones, releasing enormous energy. This powers stars and could provide clean energy on Earth.',
    funFact: 'The Sun converts 600 million tons of hydrogen into helium every second.'
  },
  nuclear_fission: {
    title: 'Nuclear Fission',
    text: 'Heavy nuclei split into lighter ones, releasing energy and neutrons. The released neutrons can trigger a chain reaction.',
    funFact: 'The first nuclear reactor was built under the bleachers of a squash court at the University of Chicago in 1942.'
  },
  laser: {
    title: 'Laser',
    text: 'Light Amplification by Stimulated Emission of Radiation. Atoms in an excited state emit identical photons when stimulated, creating coherent light.',
    funFact: 'The first laser was built in 1960. Its inventor\'s colleague joked it was "a solution looking for a problem."'
  },
  semiconductor: {
    title: 'Semiconductor',
    text: 'Materials with conductivity between metals and insulators. Band theory explains how quantum mechanics governs electron flow in these materials.',
    funFact: 'Without quantum tunneling in semiconductors, modern transistors (smaller than 7nm) wouldn\'t work.'
  },
  quantum_computer: {
    title: 'Quantum Computer',
    text: 'Uses qubits in superposition to perform calculations impossible for classical computers. Exploits entanglement and interference.',
    funFact: 'A quantum computer with 300 qubits could represent more states than there are atoms in the observable universe.'
  }
};
