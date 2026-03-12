// Universe Timeline — Era Definitions
// Each era: type 'dials' or 'choice', with physics parameters

const ERAS = [
  // ----------------------------------------------------------------
  // ERA 1: Quark Epoch — DIALS
  // ----------------------------------------------------------------
  {
    id: 'quark_epoch',
    number: 1,
    name: 'Quark Epoch',
    time: '10⁻¹² seconds after the Big Bang',
    type: 'dials',
    intro: 'The universe is a seething soup of quarks and gluons at trillions of degrees. As it cools, quarks will bind together for the first time.',
    goal: 'Lower the temperature until quarks bind into protons and neutrons.',
    physics: 'Strong force, color charge, QCD confinement',
    dials: {
      temperature: { label: 'Temperature', unit: 'K', min: 10, max: 15, step: 0.1, logScale: true },
      density: { label: 'Density', unit: 'particles/m³', min: 30, max: 45, step: 0.5, logScale: true },
    },
    discoveries: [
      {
        id: 'proton',
        name: 'Proton',
        conditions: { temperature: { max: 12.2 }, density: { min: 37 } },
        explanation: 'As the universe cools below ~10¹² K, the strong force confines quarks into hadrons. Two up quarks and one down quark bind together to form the proton — the nucleus of hydrogen.',
        element: 'proton'
      },
      {
        id: 'neutron',
        name: 'Neutron',
        conditions: { temperature: { max: 12.0 }, density: { min: 38 } },
        explanation: 'Neutrons form alongside protons. One up quark and two down quarks bind into a neutral particle that will later be essential for building heavier nuclei.',
        element: 'neutron'
      }
    ],
    hints: [
      { delay: 30, text: 'Quarks need to slow down... try lowering the temperature.' },
      { delay: 60, text: 'Confinement happens around 10¹² K — keep cooling!' },
    ],
    background: { hue: 0, saturation: 80 }
  },

  // ----------------------------------------------------------------
  // ERA 2: Hadron Epoch — CHOICE
  // ----------------------------------------------------------------
  {
    id: 'hadron_epoch',
    number: 2,
    name: 'Hadron Epoch',
    time: '10⁻⁶ seconds after the Big Bang',
    type: 'choice',
    intro: 'The universe has cooled to 10¹⁰ K. Quarks can no longer move freely — they are confined inside hadrons.',
    physics: 'Quark composition, proton/neutron structure',
    questions: [
      {
        text: 'What forms from two Up Quarks and one Down Quark?',
        choices: ['Neutron', 'Proton', 'Pion', 'Electron'],
        correct: 1,
        explanations: {
          correct: 'Correct! The proton (uud) is the lightest baryon. Its positive charge will later attract electrons to form hydrogen — the most abundant element.',
          wrong: {
            0: 'Not quite. A neutron is udd (one up, two down). You described uud — that\'s a proton!',
            2: 'Pions are mesons (quark-antiquark pairs), not baryons. Three quarks make a baryon — this combination makes a proton.',
            3: 'Electrons are leptons, not made of quarks at all! Three quarks make a hadron — specifically, uud is a proton.'
          }
        },
        element: 'proton'
      },
      {
        text: 'What forms from one Up Quark and two Down Quarks?',
        choices: ['Proton', 'Neutron', 'Kaon', 'Photon'],
        correct: 1,
        explanations: {
          correct: 'Correct! The neutron (udd) has no electric charge because the quark charges cancel: +2/3 - 1/3 - 1/3 = 0.',
          wrong: {
            0: 'Close, but a proton is uud. One up + two down = neutron (udd).',
            2: 'Kaons contain a strange quark. With only up and down quarks, udd makes a neutron.',
            3: 'Photons are massless force carriers, not made of quarks. udd is a neutron!'
          }
        },
        element: 'neutron'
      },
      {
        text: 'Why can\'t quarks exist alone?',
        choices: [
          'They are too small',
          'Color confinement — the strong force increases with distance',
          'Gravity holds them together',
          'The weak force traps them'
        ],
        correct: 1,
        explanations: {
          correct: 'Correct! Unlike every other force, the strong force gets STRONGER as quarks separate. Pulling quarks apart creates enough energy to produce new quarks — you can never isolate one.',
          wrong: {
            0: 'Size isn\'t the reason. Electrons are also point particles but can exist freely. The answer is about the unique behavior of the strong force.',
            2: 'Gravity is far too weak at the subatomic scale. The strong force is ~10³⁸ times stronger than gravity!',
            3: 'The weak force causes particle decay but doesn\'t confine quarks. Only the strong force (via gluons) creates confinement.'
          }
        }
      }
    ],
    background: { hue: 30, saturation: 70 }
  },

  // ----------------------------------------------------------------
  // ERA 3: Lepton Epoch — CHOICE
  // ----------------------------------------------------------------
  {
    id: 'lepton_epoch',
    number: 3,
    name: 'Lepton Epoch',
    time: '1 second after the Big Bang',
    type: 'choice',
    intro: 'The universe is filled with electrons, positrons, and neutrinos. Matter and antimatter are annihilating in vast quantities.',
    physics: 'Annihilation, CP violation, antimatter',
    questions: [
      {
        text: 'When an electron meets a positron, what happens?',
        choices: [
          'They orbit each other',
          'They annihilate into pure energy (photons)',
          'They form a neutron',
          'Nothing — they pass through each other'
        ],
        correct: 1,
        explanations: {
          correct: 'Correct! Matter-antimatter annihilation converts 100% of mass into energy via E=mc². This is the most efficient energy release in physics.',
          wrong: {
            0: 'They can briefly form "positronium" but it\'s incredibly unstable — they annihilate within nanoseconds.',
            2: 'Neutrons are made of quarks (udd), not leptons. Electron + positron → photons.',
            3: 'Electrons and positrons interact very strongly via the electromagnetic force. They annihilate completely.'
          }
        },
        element: 'annihilation'
      },
      {
        text: 'If matter and antimatter annihilate equally, why does matter exist at all?',
        choices: [
          'Matter was always more abundant',
          'A tiny asymmetry (CP violation) left ~1 extra matter particle per billion',
          'Antimatter escaped to another universe',
          'Dark energy protected the matter'
        ],
        correct: 1,
        explanations: {
          correct: 'Correct! CP violation means the laws of physics treat matter and antimatter very slightly differently. For every billion annihilations, about one extra matter particle survived. Everything you see is that tiny leftover.',
          wrong: {
            0: 'The Big Bang should have created equal amounts of matter and antimatter. The asymmetry requires an explanation — CP violation.',
            2: 'There\'s no evidence for antimatter universes. The asymmetry is explained by CP violation in particle physics.',
            3: 'Dark energy affects cosmic expansion, not particle-antiparticle balance. CP violation is the accepted explanation.'
          }
        },
        element: 'antimatter'
      }
    ],
    background: { hue: 200, saturation: 60 }
  },

  // ----------------------------------------------------------------
  // ERA 4: Nucleosynthesis — DIALS
  // ----------------------------------------------------------------
  {
    id: 'nucleosynthesis',
    number: 4,
    name: 'Big Bang Nucleosynthesis',
    time: '3 minutes after the Big Bang',
    type: 'dials',
    intro: 'The universe has cooled enough for protons and neutrons to fuse into light nuclei. But the window is narrow — too hot and nuclei shatter, too cool and fusion stops.',
    goal: 'Find the fusion temperature window to forge the first elements.',
    physics: 'Quantum tunneling, Coulomb barrier, Big Bang nucleosynthesis',
    dials: {
      temperature: { label: 'Temperature', unit: 'K', min: 7, max: 11, step: 0.1, logScale: true },
      energy: { label: 'Energy', unit: 'eV', min: 3, max: 8, step: 0.1, logScale: true },
    },
    discoveries: [
      {
        id: 'deuterium',
        name: 'Deuterium',
        conditions: { temperature: { min: 8.8, max: 9.5 }, energy: { min: 4.5 } },
        explanation: 'Deuterium forms when a proton and neutron fuse. This is the first step of Big Bang nucleosynthesis. Quantum tunneling allows them to overcome the Coulomb barrier.',
        element: 'deuterium'
      },
      {
        id: 'helium3',
        name: 'Helium-3',
        conditions: { temperature: { min: 9.0, max: 9.8 }, energy: { min: 5.0 } },
        explanation: 'Helium-3 forms from deuterium fusion. Two protons and one neutron create this light isotope.',
        element: 'helium'
      },
      {
        id: 'helium4',
        name: 'Helium-4',
        conditions: { temperature: { min: 8.5, max: 9.5 }, energy: { min: 5.5 } },
        explanation: 'Helium-4 (two protons + two neutrons) is the most stable light nucleus. About 25% of the universe\'s mass ends up as helium — all forged in these first few minutes.',
        element: 'helium'
      },
      {
        id: 'lithium7',
        name: 'Lithium-7',
        conditions: { temperature: { min: 8.2, max: 9.0 }, energy: { min: 6.0 } },
        explanation: 'Tiny amounts of lithium-7 form at the tail end of nucleosynthesis. The predicted and observed amounts match — a triumph for Big Bang theory.',
        element: 'lithium'
      }
    ],
    hints: [
      { delay: 30, text: 'Fusion needs enough energy to overcome the Coulomb barrier, but not so much that nuclei shatter.' },
      { delay: 60, text: 'The sweet spot for deuterium is around 10⁹ K — warm enough for tunneling, cool enough to hold together.' },
    ],
    background: { hue: 45, saturation: 80 }
  },

  // ----------------------------------------------------------------
  // ERA 5: Recombination — CHOICE
  // ----------------------------------------------------------------
  {
    id: 'recombination',
    number: 5,
    name: 'Recombination',
    time: '380,000 years after the Big Bang',
    type: 'choice',
    intro: 'For hundreds of thousands of years, the universe was an opaque plasma of nuclei and free electrons. Now it\'s cooling to a critical threshold.',
    physics: 'Energy levels, photon emission, wave-particle duality',
    questions: [
      {
        text: 'Why do atoms form now, 380,000 years after the Big Bang?',
        choices: [
          'Gravity finally pulls electrons to nuclei',
          'The universe cooled to ~3000K — electrons can be captured into stable orbits',
          'New electrons were created',
          'The strong force attracted electrons'
        ],
        correct: 1,
        explanations: {
          correct: 'Correct! Above ~3000K, photons had enough energy to knock electrons free. Below this temperature, electrons can settle into quantized energy levels around nuclei — forming the first atoms.',
          wrong: {
            0: 'Gravity is far too weak to capture electrons. The electromagnetic force does the work, but only once photons cool enough to stop knocking electrons loose.',
            2: 'The electrons were always there. What changed is the temperature — photons no longer had enough energy to ionize atoms.',
            3: 'The strong force only acts on quarks, not electrons. Electrons are captured by the electromagnetic force of protons.'
          }
        },
        element: 'hydrogen'
      },
      {
        text: 'What happens to the photons when atoms form?',
        choices: [
          'They disappear',
          'They are absorbed permanently',
          'They decouple and travel freely — becoming the Cosmic Microwave Background',
          'They turn into neutrinos'
        ],
        correct: 2,
        explanations: {
          correct: 'Correct! Once atoms form, photons can travel without being scattered by free electrons. These photons are still detectable today as the Cosmic Microwave Background — the oldest light in the universe, redshifted to microwaves.',
          wrong: {
            0: 'Energy is conserved — photons don\'t disappear. They decouple from matter and travel freely.',
            1: 'Some photons are absorbed into atoms, but most decouple and stream freely through the newly transparent universe.',
            3: 'Photons and neutrinos are fundamentally different particles. The photons simply stop interacting with matter.'
          }
        },
        element: 'photon'
      },
      {
        text: 'What is the first and most abundant atom to form?',
        choices: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'],
        correct: 1,
        explanations: {
          correct: 'Correct! Hydrogen (one proton + one electron) is the simplest atom and makes up ~75% of the universe\'s ordinary matter. It\'s the fuel that will power the first stars.',
          wrong: {
            0: 'Helium is the second most abundant (~25%), but hydrogen is far more plentiful and simpler to form.',
            2: 'Lithium is incredibly rare from Big Bang nucleosynthesis — only trace amounts formed.',
            3: 'Carbon doesn\'t form until stars ignite billions of years later. Only H, He, and trace Li exist at this point.'
          }
        }
      }
    ],
    background: { hue: 30, saturation: 40 }
  },

  // ----------------------------------------------------------------
  // ERA 6: Stellar Era — DIALS
  // ----------------------------------------------------------------
  {
    id: 'stellar_era',
    number: 6,
    name: 'Stellar Era',
    time: '100 million years+',
    type: 'dials',
    intro: 'Gravity pulls hydrogen clouds together. As they compress, temperatures rise. When the core reaches 15 million K — fusion ignites. The first star is born.',
    goal: 'Balance gravity against fusion pressure to sustain a star and forge new elements.',
    physics: 'Stellar nucleosynthesis, exclusion principle, neutron stars',
    dials: {
      temperature: { label: 'Core Temperature', unit: 'K', min: 6, max: 10, step: 0.1, logScale: true },
      density: { label: 'Core Density', unit: 'kg/m³', min: 2, max: 8, step: 0.2, logScale: true },
    },
    discoveries: [
      {
        id: 'stellar_hydrogen_fusion',
        name: 'Hydrogen Fusion',
        conditions: { temperature: { min: 7.1 }, density: { min: 4.5 } },
        explanation: 'At 15 million K, hydrogen nuclei fuse into helium. This is the energy source of main-sequence stars like our Sun. Four protons become one helium nucleus, releasing enormous energy.',
        element: 'nuclear_fusion'
      },
      {
        id: 'carbon_formation',
        name: 'Carbon',
        conditions: { temperature: { min: 8.0 }, density: { min: 5.5 } },
        explanation: 'In the triple-alpha process, three helium nuclei fuse into carbon. This only works because of a quantum resonance predicted by Fred Hoyle — without it, carbon (and life) wouldn\'t exist.',
        element: 'carbon'
      },
      {
        id: 'oxygen_formation',
        name: 'Oxygen',
        conditions: { temperature: { min: 8.3 }, density: { min: 6.0 } },
        explanation: 'Carbon captures another helium nucleus to become oxygen. Together, carbon and oxygen are the building blocks of life — forged in the cores of dying stars.',
        element: 'oxygen'
      },
      {
        id: 'iron_formation',
        name: 'Iron',
        conditions: { temperature: { min: 9.5 }, density: { min: 7.0 } },
        explanation: 'Iron is the endgame. It has the highest binding energy per nucleon — fusing it absorbs energy instead of releasing it. When a star\'s core turns to iron, fusion stops and the star collapses.',
        element: 'iron'
      }
    ],
    hints: [
      { delay: 30, text: 'Stars need extreme temperature AND density. Try raising both.' },
      { delay: 60, text: 'Heavier elements need hotter, denser cores. Push the dials higher for carbon and oxygen.' },
    ],
    background: { hue: 55, saturation: 90 }
  },

  // ----------------------------------------------------------------
  // ERA 7: Heavy Elements — DIALS
  // ----------------------------------------------------------------
  {
    id: 'heavy_elements',
    number: 7,
    name: 'Heavy Elements',
    time: 'Supernovae & Neutron Star Mergers',
    type: 'dials',
    intro: 'Iron stops fusion. The star collapses and explodes as a supernova. In these extreme conditions, neutrons bombard nuclei to build elements beyond iron.',
    goal: 'Set neutron flux and energy to build heavy elements via neutron capture.',
    physics: 'Neutron capture, s-process, r-process, nuclear shell model',
    dials: {
      energy: { label: 'Neutron Flux', unit: 'n/cm²/s', min: 15, max: 30, step: 0.5, logScale: true },
      temperature: { label: 'Temperature', unit: 'K', min: 8, max: 11, step: 0.1, logScale: true },
    },
    discoveries: [
      {
        id: 'uranium_formation',
        name: 'Uranium',
        conditions: { energy: { min: 24 }, temperature: { min: 9.5 } },
        explanation: 'Uranium forms via the rapid neutron capture process (r-process) in supernovae and neutron star mergers. Neutrons pile onto nuclei faster than they can decay, building up to element 92.',
        element: 'uranium'
      },
      {
        id: 'nuclear_fission_discovery',
        name: 'Nuclear Fission',
        conditions: { energy: { min: 20 }, temperature: { min: 9.0 } },
        explanation: 'Heavy nuclei like uranium are so large that they\'re barely stable. A single neutron can split them apart — releasing enormous energy and more neutrons in a chain reaction.',
        element: 'nuclear_fission'
      }
    ],
    hints: [
      { delay: 30, text: 'Heavy elements need intense neutron bombardment. Crank up the neutron flux.' },
      { delay: 60, text: 'The r-process needs extreme conditions — both high flux and high temperature.' },
    ],
    background: { hue: 280, saturation: 70 }
  },

  // ----------------------------------------------------------------
  // ERA 8: Modern Physics — CHOICE
  // ----------------------------------------------------------------
  {
    id: 'modern_physics',
    number: 8,
    name: 'Modern Physics',
    time: 'The Present Day',
    type: 'choice',
    intro: 'The universe has evolved for 13.8 billion years. Humanity has discovered quantum mechanics and harnessed it to build lasers, transistors, and quantum computers.',
    physics: 'Applied quantum mechanics, tunneling in technology',
    questions: [
      {
        text: 'How does a laser work?',
        choices: [
          'By heating light to extreme temperatures',
          'By stimulated emission — one photon triggers identical photon release',
          'By compressing photons together',
          'By splitting atoms'
        ],
        correct: 1,
        explanations: {
          correct: 'Correct! In stimulated emission, a photon hits an excited atom and triggers it to emit an identical photon — same wavelength, direction, and phase. This chain reaction creates coherent laser light.',
          wrong: {
            0: 'Light doesn\'t have a temperature in the usual sense. Lasers work by stimulated emission, not heating.',
            2: 'Photons are bosons and can overlap, but lasers specifically use stimulated emission to create coherent light.',
            3: 'That\'s nuclear fission, not lasers. Lasers use quantum transitions in atoms — stimulated emission.'
          }
        },
        element: 'laser'
      },
      {
        text: 'Quantum tunneling allows particles to pass through barriers they classically shouldn\'t. Which technology depends on this?',
        choices: [
          'Light bulbs',
          'Steam engines',
          'Flash memory (USB drives)',
          'Bicycles'
        ],
        correct: 2,
        explanations: {
          correct: 'Correct! Flash memory stores data by trapping electrons behind an energy barrier. Writing data forces electrons to tunnel through the barrier. Without quantum tunneling, no USB drives, SSDs, or smartphones.',
          wrong: {
            0: 'Light bulbs use resistive heating and thermal radiation — classical physics, not tunneling.',
            1: 'Steam engines are thoroughly classical machines. Quantum effects are negligible at that scale.',
            3: 'Bicycles are purely classical mechanics. Quantum tunneling operates at the atomic scale.'
          }
        },
        element: 'quantum_tunneling'
      },
      {
        text: 'What makes quantum computers fundamentally different from classical computers?',
        choices: [
          'They\'re faster because they use better transistors',
          'Qubits use superposition to process many possibilities simultaneously',
          'They use light instead of electricity',
          'They run at absolute zero for speed'
        ],
        correct: 1,
        explanations: {
          correct: 'Correct! A qubit exists in a superposition of 0 and 1 simultaneously. With N qubits, you can represent 2^N states at once. Entanglement lets qubits coordinate, enabling algorithms impossible for classical computers.',
          wrong: {
            0: 'Quantum computers don\'t use traditional transistors at all. Their power comes from quantum mechanical properties — superposition and entanglement.',
            2: 'Some quantum computers use photons, but the key difference is superposition, not the medium.',
            3: 'Many quantum computers do operate at near absolute zero to reduce decoherence, but the speed comes from superposition and entanglement, not temperature.'
          }
        },
        element: 'quantum_computer'
      },
      {
        text: 'Why can\'t we unify quantum mechanics with gravity?',
        choices: [
          'We haven\'t tried hard enough',
          'Gravity is too weak to measure',
          'Spacetime is smooth (general relativity) but quantum mechanics is discrete — they\'re fundamentally incompatible at extreme scales',
          'Gravity doesn\'t exist at small scales'
        ],
        correct: 2,
        explanations: {
          correct: 'Correct! General relativity describes gravity as smooth curvature of spacetime. Quantum mechanics says everything is quantized. At the Planck scale (10⁻³⁵ m), these descriptions contradict each other. Resolving this is the holy grail of physics.',
          wrong: {
            0: 'Some of the greatest minds in physics have worked on this for a century. The problem is fundamental, not effort-based.',
            1: 'We can measure gravity extremely well. The problem is theoretical — our two best theories (QM and GR) are mathematically incompatible.',
            3: 'Gravity does exist at small scales — it\'s just extremely weak compared to other forces. The problem is making the math work.'
          }
        },
        element: 'quantum_gravity'
      }
    ],
    background: { hue: 180, saturation: 50 }
  }
];
