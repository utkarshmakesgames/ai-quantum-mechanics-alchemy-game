// Quantum Forge — Journal Entries
// Each element gets an educational entry explaining the real physics

const JOURNAL = {
  // ================================================================
  // ERA 1: FUNDAMENTAL PARTICLES
  // ================================================================
  up_quark: {
    what: 'The up quark is one of six types (or "flavors") of quarks. It has an electric charge of +2/3 and is the lightest quark. Two up quarks and one down quark make a proton.',
    whyItMatters: 'Up quarks are one of the fundamental building blocks of all matter. Every atom in your body contains up quarks inside its protons and neutrons.',
    weirdPart: 'Quarks can never exist alone! If you try to pull two quarks apart, the energy creates new quarks. This is called "color confinement."',
    history: 'Proposed by Murray Gell-Mann and George Zweig in 1964. The name "quark" comes from James Joyce\'s novel Finnegans Wake.',
    funFact: 'The up quark has a mass of about 2.2 MeV/c² — roughly 4 times the mass of an electron, but it accounts for less than 1% of a proton\'s mass. The rest comes from the strong force energy!'
  },
  down_quark: {
    what: 'The down quark has an electric charge of -1/3 and is the second lightest quark. One up quark and two down quarks make a neutron.',
    whyItMatters: 'Along with the up quark, the down quark makes up all ordinary matter. The slight mass difference between up and down quarks determines the structure of all atoms.',
    weirdPart: 'A down quark can transform into an up quark by emitting a W boson — this is how neutrons decay into protons (beta decay)!',
    history: 'Like the up quark, proposed in 1964 and confirmed through deep inelastic scattering experiments at SLAC in 1968.',
    funFact: 'If the down quark were lighter than the up quark (instead of heavier), protons would decay instead of neutrons, and the universe would be radically different — possibly no atoms at all!'
  },
  electron: {
    what: 'The electron is a fundamental particle with negative electric charge (-1) and very small mass. It orbits atomic nuclei and is responsible for chemical bonds, electricity, and magnetism.',
    whyItMatters: 'Electrons are the workhorses of chemistry and technology. Every chemical reaction, every electrical current, every computer operation involves electrons.',
    weirdPart: 'The electron appears to be a true point particle — it has no known internal structure or size, yet it has mass, charge, and spin. How can a point have angular momentum?',
    history: 'Discovered by J.J. Thomson in 1897 using cathode ray tubes. It was the first subatomic particle ever discovered.',
    funFact: 'An electron\'s magnetic moment has been measured to 13 decimal places, and it matches quantum theory\'s prediction perfectly. It\'s the most precisely verified prediction in all of science!'
  },
  photon: {
    what: 'The photon is a massless particle that carries electromagnetic radiation — visible light, radio waves, X-rays, and gamma rays are all photons of different energies.',
    whyItMatters: 'Photons carry all electromagnetic force between charged particles. Without photons, atoms couldn\'t exist, chemistry wouldn\'t work, and we couldn\'t see anything.',
    weirdPart: 'A photon experiences no time. From its own reference frame (if that concept even makes sense for light), it is emitted and absorbed at the same instant, regardless of the distance traveled.',
    history: 'Einstein proposed the photon in 1905 to explain the photoelectric effect, building on Planck\'s quantum hypothesis from 1900. The word "photon" was coined in 1926.',
    funFact: 'The oldest photons you can detect are from the Cosmic Microwave Background — light released 380,000 years after the Big Bang, now stretched to microwave wavelengths after 13.8 billion years of cosmic expansion.'
  },
  gluon: {
    what: 'Gluons are massless particles that carry the strong nuclear force between quarks. There are 8 types of gluons, distinguished by their "color charge."',
    whyItMatters: 'Gluons literally hold matter together. Without them, protons and neutrons would fall apart, and atoms couldn\'t exist.',
    weirdPart: 'Unlike photons (which don\'t have electric charge), gluons carry color charge themselves — so gluons interact with other gluons! This is why the strong force is so different from electromagnetism.',
    history: 'Predicted by quantum chromodynamics (QCD) in the 1970s, first indirect evidence came from three-jet events at the PETRA accelerator in 1979.',
    funFact: 'About 50% of a proton\'s momentum comes from gluons. And because gluons carry so much energy, they contribute most of a proton\'s mass — making gluons responsible for most of YOUR mass!'
  },
  neutrino: {
    what: 'Neutrinos are extremely light, electrically neutral particles that interact only via the weak nuclear force and gravity. They come in three flavors: electron, muon, and tau neutrinos.',
    whyItMatters: 'Neutrinos are produced in nuclear reactions, so they carry information about the Sun\'s core, supernovae, and the early universe. They\'re also key to understanding why matter exists.',
    weirdPart: 'Neutrinos can change flavor as they travel — an electron neutrino can become a muon neutrino mid-flight! This "neutrino oscillation" proves they have mass, which the original Standard Model didn\'t predict.',
    history: 'Predicted by Wolfgang Pauli in 1930 to explain missing energy in beta decay. "I have done a terrible thing," he said. "I have postulated a particle that cannot be detected." They were detected in 1956.',
    funFact: 'About 65 billion neutrinos from the Sun pass through every square centimeter of your body every second. Almost none of them interact with you at all.'
  },
  diquark_uu: {
    what: 'A diquark is a pair of quarks bound together inside a baryon. The uu diquark contains two up quarks in a correlated state, forming two-thirds of a proton.',
    whyItMatters: 'Diquarks are the intermediate step in building protons and other baryons. Understanding quark pairing helps explain why protons are so stable.',
    weirdPart: 'Diquarks are not free particles — they exist only inside baryons. But the correlation between two quarks inside a proton is real and measurable in high-energy experiments.',
    history: 'The diquark concept was introduced by Ida and Oyama in 1966 and developed by Lichtenberg in 1967 to explain baryon structure.',
    funFact: 'Two up quarks in a diquark carry a combined charge of +4/3 — they need a down quark (-1/3) to reach the proton\'s +1 charge.'
  },
  diquark_dd: {
    what: 'The dd diquark is a pair of two down quarks bound by the color force. It forms the first step in building a neutron (ddu).',
    whyItMatters: 'Just as the uu diquark is the backbone of the proton, the dd diquark is the backbone of the neutron. Different quark combinations make different particles.',
    weirdPart: 'The dd diquark has a charge of -2/3. Adding an up quark (+2/3) gives exactly zero — which is why neutrons are electrically neutral!',
    history: 'Diquark models gained prominence in the 1990s when lattice QCD calculations showed clear quark-pairing correlations inside nucleons.',
    funFact: 'Neutrons are slightly heavier than protons (by 0.14%) because the down quark is heavier than the up quark. This tiny difference determines the structure of the entire universe.'
  },
  diquark_ud: {
    what: 'The ud diquark is an up-down quark pair — the most common type of diquark correlation found inside nucleons.',
    whyItMatters: 'Mixed-flavor diquarks are found in both protons and neutrons, making them the most versatile building block of nuclear matter.',
    weirdPart: 'The ud diquark can exist in a spin-0 "good" diquark state, which is more tightly bound than same-flavor pairs — one reason nucleons are so stable.',
    history: 'The "good diquark" concept by Jaffe and Wilczek (2003) helped explain exotic particles like pentaquarks.',
    funFact: 'The ud diquark has a charge of +1/3. It can combine with either an up or down quark to make a proton or neutron respectively.'
  },
  quark_antiquark: {
    what: 'A quark-antiquark pair is a quark bound to its antimatter counterpart. These pairs are the building blocks of mesons — particles like pions and kaons.',
    whyItMatters: 'Mesons mediate the residual strong force between protons and neutrons, holding atomic nuclei together.',
    weirdPart: 'Quark-antiquark pairs constantly pop in and out of existence inside the vacuum — they are part of the quantum fluctuations of the strong force.',
    history: 'Hideki Yukawa predicted mesons in 1935 as carriers of the nuclear force. The pion, the simplest meson, was discovered in 1947.',
    funFact: 'Mesons are unstable because the quark and antiquark can annihilate each other. The longest-lived meson, the charged pion, survives only 26 nanoseconds.'
  },
  deuteron: {
    what: 'The deuteron is the nucleus of deuterium (heavy hydrogen), consisting of one proton and one neutron bound together by the residual strong force.',
    whyItMatters: 'The deuteron is the simplest compound nucleus and plays a crucial role in Big Bang nucleosynthesis and stellar fusion.',
    weirdPart: 'The deuteron is very loosely bound — its binding energy is only 2.2 MeV, compared to about 28 MeV for helium-4. It is barely holding together!',
    history: 'Deuterium was discovered by Harold Urey in 1931, who won the Nobel Prize in Chemistry for it in 1934.',
    funFact: 'About 25% of all hydrogen in the universe was converted to deuterium and helium within the first 20 minutes after the Big Bang.'
  },

  // ================================================================
  // ERA 2: COMPOSITE PARTICLES
  // ================================================================
  proton: {
    what: 'A proton is made of two up quarks and one down quark bound together by gluons. It has a positive charge of +1 and is found in every atomic nucleus.',
    whyItMatters: 'The number of protons in a nucleus defines which element it is. Hydrogen has 1, helium has 2, carbon has 6. The entire periodic table is built on proton count.',
    weirdPart: 'A proton\'s mass is about 938 MeV, but its three quarks only contribute about 9 MeV. The other 99% comes from the kinetic and binding energy of quarks and gluons. Mass literally comes from energy!',
    history: 'Identified by Ernest Rutherford in 1917, though the concept of a hydrogen nucleus as a fundamental unit dates back earlier.',
    funFact: 'Protons appear to be incredibly stable — their half-life is at least 10³⁴ years (that\'s 10 trillion trillion times the age of the universe). But some theories predict they eventually decay.'
  },
  neutron: {
    what: 'A neutron is made of one up quark and two down quarks. It has no electric charge and is slightly heavier than a proton. Found in all atomic nuclei except hydrogen-1.',
    whyItMatters: 'Neutrons act as nuclear "glue" — without them, the electric repulsion between protons would blow nuclei apart. Extra neutrons create isotopes.',
    weirdPart: 'A free neutron (outside a nucleus) is unstable and decays in about 15 minutes via beta decay. But inside a nucleus, neutrons can be stable for billions of years!',
    history: 'Discovered by James Chadwick in 1932, earning him the Nobel Prize. Before this, the nucleus was thought to contain protons and electrons.',
    funFact: 'Neutron stars are so dense that a teaspoon of neutron star material would weigh about 6 billion tons — roughly the weight of Mount Everest.'
  },
  positron: {
    what: 'The positron is the antiparticle of the electron — identical in mass but with positive charge. When a positron meets an electron, they annihilate into photons.',
    whyItMatters: 'The positron was the first antiparticle discovered, confirming Dirac\'s prediction that every particle has an antimatter twin. This was the birth of antimatter physics.',
    weirdPart: 'Positrons are used in PET scans (Positron Emission Tomography) in hospitals. You\'re literally being scanned with antimatter annihilation!',
    history: 'Predicted by Paul Dirac in 1928 from his equation. Discovered by Carl Anderson in 1932 in cosmic ray cloud chamber photographs.',
    funFact: 'Bananas are slightly radioactive and occasionally emit positrons. But don\'t worry — the amount is absurdly small.'
  },
  antiproton: {
    what: 'The antiproton is the antimatter counterpart of the proton, made of two anti-up quarks and one anti-down quark, with a negative charge.',
    whyItMatters: 'Antiprotons are crucial for studying matter-antimatter asymmetry — why the universe is made of matter instead of equal parts matter and antimatter.',
    weirdPart: 'CERN has created and trapped antihydrogen atoms (antiproton + positron) to compare them with hydrogen. So far, they appear to behave identically.',
    history: 'Discovered by Emilio Segrè and Owen Chamberlain at the Bevatron accelerator in 1955, earning them the 1959 Nobel Prize.',
    funFact: 'Producing just one gram of antiprotons would cost about $62.5 trillion and take millions of years at current production rates.'
  },
  pion: {
    what: 'Pions (pi mesons) are composed of a quark and an antiquark. They come in three varieties: π⁺, π⁻, and π⁰. They mediate the strong force between protons and neutrons.',
    whyItMatters: 'Pions were the first predicted meson and helped confirm that the strong force works by exchanging particles, just like electromagnetism exchanges photons.',
    weirdPart: 'The neutral pion (π⁰) has one of the shortest lifetimes of any particle — just 8.4 × 10⁻¹⁷ seconds. It decays into two photons almost instantly.',
    history: 'Predicted by Hideki Yukawa in 1935 as the carrier of the nuclear force. Discovered in cosmic rays by Cecil Powell in 1947.',
    funFact: 'Charged pions are used in cancer treatment — pion beam therapy can target tumors with high precision.'
  },
  muon: {
    what: 'The muon is a heavier version of the electron, about 207 times more massive. It\'s unstable and decays into an electron, a neutrino, and an antineutrino in about 2.2 microseconds.',
    whyItMatters: 'Muons provided early evidence of Einstein\'s time dilation — cosmic ray muons reach Earth\'s surface because time slows down for them at near-light speeds.',
    weirdPart: 'The muon\'s magnetic moment doesn\'t quite match theoretical predictions — the "muon g-2 anomaly." This could be evidence of unknown physics beyond the Standard Model!',
    history: 'Discovered by Carl Anderson and Seth Neddermeyer in 1936. "Who ordered that?" was I.I. Rabi\'s famous reaction — nobody expected it.',
    funFact: 'About 10,000 muons pass through your body every minute, created when cosmic rays hit the upper atmosphere. They\'re harmless due to their tiny size and short lifetime.'
  },
  tau: {
    what: 'The tau is the heaviest lepton, about 3,477 times the mass of an electron. It decays very quickly (2.9 × 10⁻¹³ seconds) into lighter particles.',
    whyItMatters: 'The tau completes the three-generation structure of leptons (electron, muon, tau), a pattern mirrored by quarks. Understanding why there are exactly three generations is an open question.',
    weirdPart: 'The tau is heavy enough to decay into hadrons (particles made of quarks), unlike the electron and muon. It\'s the only lepton that can do this.',
    history: 'Discovered by Martin Perl at SLAC in 1975. He won the Nobel Prize for it in 1995.',
    funFact: 'If there were a fourth generation of leptons even heavier than the tau, it could fundamentally change our understanding of the Standard Model — but so far, evidence suggests there are only three.'
  },
  w_boson: {
    what: 'The W boson comes in W⁺ and W⁻ varieties and carries the weak nuclear force. It allows quarks and leptons to change flavor — for example, turning a down quark into an up quark.',
    whyItMatters: 'Without W bosons, beta decay couldn\'t happen, the Sun couldn\'t shine (its fusion depends on weak decays), and the elements heavier than hydrogen couldn\'t exist.',
    weirdPart: 'The W boson has a mass of about 80 GeV — roughly 80 times the proton\'s mass. How can a "force carrier" be so heavy? This is explained by the Higgs mechanism.',
    history: 'Predicted by the electroweak theory of Glashow, Weinberg, and Salam in the 1960s. Discovered at CERN in 1983 by Carlo Rubbia and Simon van der Meer.',
    funFact: 'Recent precision measurements of the W boson\'s mass at Fermilab showed it might be slightly heavier than predicted, potentially hinting at new physics!'
  },
  z_boson: {
    what: 'The Z boson is the neutral carrier of the weak force, involved in processes like neutrino scattering. It\'s one of the heaviest elementary particles at about 91 GeV.',
    whyItMatters: 'The Z boson\'s properties confirmed the electroweak theory — that electromagnetism and the weak force are two aspects of the same fundamental force.',
    weirdPart: 'By studying how Z bosons decay at the LEP collider, physicists determined there are exactly 3 generations of light neutrinos. This constrains the entire structure of particle physics.',
    history: 'Discovered at CERN in 1983, alongside the W boson. Both discoveries earned Carlo Rubbia and Simon van der Meer the 1984 Nobel Prize.',
    funFact: 'The Z boson was used to precisely measure the number of neutrino species. The result: 2.984 ± 0.008. Three. Exactly three (within experimental uncertainty).'
  },
  higgs_boson: {
    what: 'The Higgs boson is an excitation of the Higgs field, which permeates all of space. Particles that interact with the Higgs field acquire mass.',
    whyItMatters: 'Without the Higgs mechanism, W and Z bosons would be massless (like photons), the weak force would be long-range, and atoms as we know them couldn\'t exist.',
    weirdPart: 'The Higgs field is nonzero everywhere in the universe — it\'s like the entire cosmos is filled with an invisible syrup that gives particles mass. The boson is just a ripple in this syrup.',
    history: 'Proposed independently by several physicists in 1964 (including Peter Higgs). Discovered at CERN\'s Large Hadron Collider on July 4, 2012.',
    funFact: 'The LHC cost about $13.25 billion and is 27 km around. The Higgs was found by colliding protons at 99.9999991% the speed of light and sifting through debris of trillions of collisions.'
  },
  hydrogen: {
    what: 'A hydrogen atom consists of one proton and one electron. It\'s the simplest and most abundant element in the universe.',
    whyItMatters: 'Hydrogen is the fuel for stellar fusion, the source of water, and the starting point for all heavier elements. Studying hydrogen\'s spectrum launched quantum mechanics.',
    weirdPart: 'The hydrogen atom is a quantum mechanical system where the electron doesn\'t orbit like a planet — it exists as a probability cloud around the proton.',
    history: 'Henry Cavendish first recognized hydrogen as a distinct element in 1766. Bohr used it to develop his atomic model in 1913.',
    funFact: 'There\'s a transition in hydrogen at 1420 MHz (the "21-centimeter line") caused by a spin flip. It\'s so universal that it was included on the Pioneer and Voyager spacecraft plaques as a cosmic reference point for aliens.'
  },
  deuterium: {
    what: 'Deuterium is an isotope of hydrogen with one proton, one neutron, and one electron. Also called "heavy hydrogen."',
    whyItMatters: 'Deuterium is a key fuel for both stellar fusion and future fusion reactors on Earth. It\'s also used in NMR spectroscopy and nuclear physics.',
    weirdPart: 'Deuterium was created in the first 3 minutes after the Big Bang. The exact amount tells us about conditions in the early universe.',
    history: 'Discovered by Harold Urey in 1931, who won the Nobel Prize for it in 1934. One of the few particles to be discovered before it was predicted.',
    funFact: 'Sea water contains about 33 grams of deuterium per ton. This could fuel fusion reactors for millions of years — if we can get fusion to work.'
  },
  annihilation: {
    what: 'When a particle meets its antiparticle, they annihilate — their mass converts entirely into energy, usually producing photons (gamma rays).',
    whyItMatters: 'Annihilation demonstrates Einstein\'s E=mc² in the most direct way possible — mass literally becomes energy.',
    weirdPart: 'The reverse process also works: enough energy concentrated in one spot can spontaneously create a particle-antiparticle pair from nothing but light.',
    history: 'First observed in 1932 when Anderson discovered the positron. Paul Dirac had predicted it from his equation in 1928.',
    funFact: 'A single gram of antimatter annihilating with a gram of matter would release about 180 terajoules of energy — roughly equivalent to 43 kilotons of TNT, almost three times the Hiroshima bomb.'
  },
  antimatter: {
    what: 'Antimatter consists of antiparticles — particles with the same mass but opposite charges. An anti-hydrogen atom has an antiproton nucleus orbited by a positron.',
    whyItMatters: 'The mystery of why the universe is made of matter instead of antimatter (the baryon asymmetry problem) is one of the biggest unsolved questions in physics.',
    weirdPart: 'Theory says the Big Bang should have created equal amounts of matter and antimatter, which should have annihilated, leaving nothing but photons. Yet here we are. Something broke the symmetry.',
    history: 'Concept predicted by Dirac in 1928. The first anti-atom (antihydrogen) was created at CERN in 1995.',
    funFact: 'All the antimatter ever produced by humanity amounts to about 10 nanograms — enough energy to power a light bulb for a few minutes.'
  },
  beta_decay: {
    what: 'Beta decay is a type of radioactive decay where a neutron transforms into a proton (or vice versa), emitting an electron (or positron) and a neutrino.',
    whyItMatters: 'Beta decay is crucial for nuclear stability, powers the sun\'s first fusion step, and is used in medical imaging (PET scans use positron emission).',
    weirdPart: 'The neutrino was invented to explain beta decay. Without it, energy and momentum didn\'t add up — conservation laws seemed to be violated. Pauli "invented" the neutrino to save physics.',
    history: 'First studied by Henri Becquerel in 1896 and Ernest Rutherford around 1900. The weak force theory explaining it was developed by Enrico Fermi in 1933.',
    funFact: 'Carbon-14 dating works because of beta decay. C-14 undergoes beta decay with a half-life of 5,730 years, making it perfect for dating organic remains up to about 50,000 years old.'
  },
  strong_force: {
    what: 'The strong nuclear force is the strongest of the four fundamental forces. It binds quarks together inside protons and neutrons, and (residually) holds protons and neutrons together in nuclei.',
    whyItMatters: 'Without the strong force, no protons or neutrons could exist, meaning no atoms, no chemistry, no life, no anything made of matter.',
    weirdPart: 'The strong force gets STRONGER as quarks move apart (unlike every other force). This "asymptotic freedom" means quarks are free when close together but trapped when they try to separate.',
    history: 'Quantum chromodynamics (QCD) was developed in the 1970s by Gross, Wilczek, and Politzer. They won the 2004 Nobel Prize for asymptotic freedom.',
    funFact: 'The strong force is about 137 times stronger than electromagnetism, a million times stronger than the weak force, and 10³⁸ times stronger than gravity.'
  },
  weak_force: {
    what: 'The weak nuclear force is responsible for radioactive beta decay, neutrino interactions, and changing one type of quark into another. It\'s carried by W and Z bosons.',
    whyItMatters: 'The weak force enables the sun to shine (the first step of solar fusion is a weak decay) and is responsible for the diversity of elements in the universe.',
    weirdPart: 'The weak force violates parity symmetry — it distinguishes between left and right. Nature is not ambidextrous at the quantum level!',
    history: 'Fermi developed the first theory in 1933. Glashow, Weinberg, and Salam unified it with electromagnetism in the 1960s (Nobel Prize 1979).',
    funFact: 'The weak force is the only force that affects all fermions and the only force that can change the "flavor" (type) of quarks and leptons.'
  },
  electromagnetic_force: {
    what: 'The electromagnetic force acts between electrically charged particles, carried by photons. It\'s responsible for light, electricity, magnetism, chemical bonds, and friction.',
    whyItMatters: 'Almost everything you experience in daily life (except gravity) is the electromagnetic force at work — from holding your body together to the light you see.',
    weirdPart: 'The electromagnetic force has infinite range but can be both attractive and repulsive. This cancellation is why big objects can be electrically neutral, making gravity the dominant force at cosmic scales.',
    history: 'Unified by James Clerk Maxwell in 1865. Quantum electrodynamics (QED), the quantum version, was developed by Feynman, Schwinger, and Tomonaga in the 1940s.',
    funFact: 'QED is the most precisely tested theory in physics. Its prediction of the electron\'s magnetic moment matches experiment to better than one part in a trillion.'
  },

  // ================================================================
  // ERA 3: ATOMS & NUCLEAR PHYSICS
  // ================================================================
  helium: {
    what: 'Helium is the second element, with 2 protons, 2 neutrons, and 2 electrons. It\'s a noble gas — chemically inert because its electron shell is full.',
    whyItMatters: 'Helium is the product of hydrogen fusion in stars. It\'s also the second most abundant element in the universe after hydrogen.',
    weirdPart: 'Liquid helium becomes a "superfluid" at very low temperatures — it flows without any friction and can climb out of containers!',
    history: 'First detected in 1868 in the sun\'s spectrum (hence "helios" = sun) by Janssen and Lockyer. Found on Earth by William Ramsay in 1895.',
    funFact: 'We\'re running out of helium on Earth! It\'s lighter than air and escapes to space. Party balloons are using a non-renewable resource that\'s critical for MRI machines and rocket science.'
  },
  lithium: {
    what: 'Lithium is the third element, with 3 protons. It\'s the lightest metal and is incredibly reactive.',
    whyItMatters: 'Lithium-ion batteries power nearly all modern electronics. It\'s also used as a medication for bipolar disorder — one of the oldest psychiatric medications.',
    weirdPart: 'The amount of lithium produced in the Big Bang doesn\'t match our predictions. The "cosmological lithium problem" is still unsolved.',
    history: 'Discovered by Johan August Arfwedson in 1817 in a mineral sample.',
    funFact: 'Lithium is so light and reactive that it floats on water and ignites on contact. It\'s the least dense solid element.'
  },
  carbon: {
    what: 'Carbon has 6 protons and can form 4 bonds with other atoms. It\'s the backbone of all known life and can form more compounds than any other element.',
    whyItMatters: 'All life on Earth is carbon-based. Organic chemistry, biochemistry, and the entire field of life sciences revolve around carbon.',
    weirdPart: 'Carbon shouldn\'t exist. The triple-alpha process that creates it in stars requires a very specific nuclear resonance (the Hoyle state). If the strong force were 0.5% different, no carbon, no life.',
    history: 'Known since antiquity (as charcoal and diamond). Its atomic structure was worked out in the 20th century.',
    funFact: 'Diamond and graphite (pencil lead) are both pure carbon. Diamond is the hardest natural material; graphite is one of the softest. Same atoms, different arrangement!'
  },
  nitrogen: {
    what: 'Nitrogen has 7 protons and makes up 78% of Earth\'s atmosphere. It\'s essential for amino acids, proteins, and DNA.',
    whyItMatters: 'Nitrogen is in every amino acid, every protein, and every DNA molecule. Life literally cannot exist without nitrogen.',
    weirdPart: 'The N≡N triple bond in N₂ is incredibly strong — one of the strongest bonds in nature. This makes atmospheric nitrogen very unreactive despite being everywhere.',
    history: 'Discovered by Daniel Rutherford in 1772, who called it "noxious air" because animals couldn\'t breathe it.',
    funFact: 'The Haber-Bosch process (turning atmospheric nitrogen into ammonia fertilizer) is arguably the most important invention of the 20th century. About half the nitrogen in your body came through this process.'
  },
  oxygen: {
    what: 'Oxygen has 8 protons. It\'s the third most abundant element in the universe and essential for most life on Earth through respiration.',
    whyItMatters: 'Oxygen enables aerobic respiration (the efficient way cells extract energy from food) and forms the ozone layer that protects life from UV radiation.',
    weirdPart: 'Earth\'s atmosphere had almost no oxygen for the first 2 billion years. Cyanobacteria started producing it, causing the "Great Oxidation Event" — a mass extinction of anaerobic life!',
    history: 'Independently discovered by Carl Wilhelm Scheele (1771) and Joseph Priestley (1774). Lavoisier named it and recognized its role in combustion.',
    funFact: 'Liquid oxygen is pale blue and is paramagnetic — you can pick it up with a magnet! This is because O₂ has two unpaired electrons.'
  },
  iron: {
    what: 'Iron has 26 protons and is the heaviest element produced by normal stellar fusion. It\'s the most stable nucleus in nature.',
    whyItMatters: 'Iron is the endgame of stellar fusion. When a star starts fusing iron, it dies (often in a supernova). All elements heavier than iron were created in supernovae or neutron star mergers.',
    weirdPart: 'Iron has the highest binding energy per nucleon — meaning fusing lighter elements into iron releases energy, but fusing iron into heavier elements requires energy. It\'s the turning point of nuclear physics.',
    history: 'Used by humans since at least 3200 BCE. Understanding WHY iron is so stable required nuclear physics in the 20th century.',
    funFact: 'Earth\'s core is mostly iron, and its motion generates Earth\'s magnetic field. Without iron, we\'d have no compass, no magnetic field, and no protection from solar wind.'
  },
  nucleus: {
    what: 'The atomic nucleus is the dense core of an atom, made of protons and neutrons held together by the strong nuclear force (via residual gluon effects).',
    whyItMatters: 'The nucleus contains 99.95% of an atom\'s mass despite being only 1/100,000th its diameter. All of nuclear physics and nuclear energy comes from understanding the nucleus.',
    weirdPart: 'If an atom were the size of a football stadium, the nucleus would be a marble at the center. Atoms are almost entirely empty space!',
    history: 'Discovered by Ernest Rutherford in 1911 through his famous gold foil experiment, where alpha particles bounced back from gold atoms.',
    funFact: 'Nuclear matter is incredibly dense — about 2.3 × 10¹⁷ kg/m³. That\'s 230 million metric tons per cubic centimeter!'
  },
  alpha_particle: {
    what: 'An alpha particle is a helium-4 nucleus — 2 protons and 2 neutrons bound together. It\'s emitted during alpha decay of heavy radioactive elements.',
    whyItMatters: 'Alpha particles were Rutherford\'s tool for discovering the atomic nucleus. Alpha decay is also one of the main types of radioactivity.',
    weirdPart: 'Alpha particles escape the nucleus via quantum tunneling. Classically, they don\'t have enough energy to overcome the nuclear potential barrier — but quantum mechanics lets them through!',
    history: 'Identified by Rutherford in 1899 as positively charged radiation from uranium. Later identified as helium nuclei.',
    funFact: 'Alpha particles can be stopped by a single sheet of paper. But if an alpha-emitting material gets inside your body, it\'s incredibly dangerous because all that energy is deposited in a tiny area.'
  },
  nuclear_fusion: {
    what: 'Nuclear fusion is the process of combining light atomic nuclei to form heavier ones, releasing enormous energy. It\'s what powers all stars.',
    whyItMatters: 'Fusion is the energy source of the universe. Every element heavier than hydrogen was created by fusion. Achieving controlled fusion on Earth could provide nearly limitless clean energy.',
    weirdPart: 'The Sun fuses 600 million tons of hydrogen into helium every second, losing 4 million tons of mass as pure energy (E=mc²). It\'s been doing this for 4.6 billion years.',
    history: 'Understood theoretically by Eddington and Bethe in the 1920s-30s. First achieved on Earth in 1952 (hydrogen bomb). Controlled fusion remains one of science\'s greatest challenges.',
    funFact: 'A gallon of seawater contains enough deuterium for fusion energy equivalent to 300 gallons of gasoline. The fuel is effectively unlimited.'
  },
  nuclear_fission: {
    what: 'Nuclear fission is the splitting of a heavy atomic nucleus into lighter ones, releasing energy. It powers nuclear reactors and atomic bombs.',
    whyItMatters: 'Fission provided humanity\'s first source of nuclear energy. It generates about 10% of the world\'s electricity and forever changed geopolitics.',
    weirdPart: 'A chain reaction happens because each fission releases 2-3 new neutrons, which can trigger more fissions. The difference between a reactor and a bomb is just controlling how many neutrons cause new fissions.',
    history: 'Discovered by Otto Hahn and Fritz Strassmann in December 1938. Lise Meitner and Otto Frisch provided the theoretical explanation weeks later.',
    funFact: 'A single uranium fuel pellet (the size of a pencil eraser) contains as much energy as 17,000 cubic feet of natural gas or 1,780 pounds of coal.'
  },
  radioactivity: {
    what: 'Radioactivity is the spontaneous emission of particles or energy from unstable atomic nuclei. There are three main types: alpha, beta, and gamma radiation.',
    whyItMatters: 'Radioactivity has applications in medicine (cancer treatment, imaging), archaeology (carbon dating), energy (nuclear power), and fundamental physics research.',
    weirdPart: 'Radioactive decay is truly random — quantum mechanics means we can NEVER predict when a specific atom will decay, only the probability. Einstein hated this.',
    history: 'Discovered by Henri Becquerel in 1896 when he noticed uranium salts fogged photographic plates. Marie and Pierre Curie extensively studied it, discovering polonium and radium.',
    funFact: 'Marie Curie\'s notebooks from the 1890s are still so radioactive that they\'re kept in lead-lined boxes. Researchers must wear protective gear to read them.'
  },
  isotope: {
    what: 'Isotopes are variants of an element that have the same number of protons but different numbers of neutrons. They have the same chemistry but different nuclear properties.',
    whyItMatters: 'Isotopes enable carbon dating, medical imaging, cancer treatment, nuclear energy, and serve as tracers in biology and geology.',
    weirdPart: 'Some isotopes are stable forever, while others are radioactive and decay. Whether an isotope is stable depends on the precise balance of protons and neutrons in the "nuclear valley of stability."',
    history: 'The concept was introduced by Frederick Soddy in 1913 (Nobel Prize 1921). The word means "same place" in Greek, referring to their identical position in the periodic table.',
    funFact: 'Hydrogen has three isotopes: protium (normal, no neutrons), deuterium (1 neutron), and tritium (2 neutrons). Tritium is radioactive and is used in glow-in-the-dark watch dials.'
  },
  electron_shell: {
    what: 'Electron shells are discrete energy levels where electrons reside around an atomic nucleus. Electrons can only exist at certain energy levels — not in between.',
    whyItMatters: 'Electron shells determine all of chemistry — how atoms bond, which elements are reactive, and the structure of the periodic table.',
    weirdPart: 'Bohr\'s insight was that energy levels are quantized — discrete, not continuous. An electron can be at level 1 or level 2, but NEVER at level 1.5. This was the birth of quantum mechanics.',
    history: 'Proposed by Niels Bohr in 1913, building on Planck and Einstein\'s quantum ideas. It perfectly explained hydrogen\'s spectral lines.',
    funFact: 'The electron shells are labeled K, L, M, N... (or 1, 2, 3, 4...). Each can hold a specific number of electrons: 2, 8, 18, 32... following the formula 2n².'
  },
  spectral_line: {
    what: 'Spectral lines are specific wavelengths of light emitted or absorbed by atoms. Each element has a unique set of spectral lines — like a fingerprint.',
    whyItMatters: 'Spectral lines let astronomers determine what stars are made of, how fast they\'re moving, and their temperature — all from light alone. They also launched quantum mechanics.',
    weirdPart: 'The fact that spectral lines are discrete (not continuous) was one of the first clues that energy is quantized. Classical physics predicted smooth spectra — reality disagreed.',
    history: 'First observed by Fraunhofer in 1814 as dark lines in the Sun\'s spectrum. Kirchhoff and Bunsen connected them to specific elements in 1859.',
    funFact: 'Helium was discovered on the Sun BEFORE it was found on Earth — because its spectral lines were observed in the solar spectrum during an eclipse in 1868.'
  },
  photon_emission: {
    what: 'When an electron in an excited state drops to a lower energy level, it releases the energy difference as a photon. The photon\'s energy (color) is precisely determined by the energy gap.',
    whyItMatters: 'This is how all light in the universe is produced at the atomic level. LEDs, lasers, neon signs, and stars all work by photon emission.',
    weirdPart: 'The transition is instantaneous — the electron doesn\'t smoothly slide between energy levels. It makes a "quantum leap" and the photon appears simultaneously.',
    history: 'Explained by Bohr\'s model in 1913, refined by quantum mechanics in the 1920s.',
    funFact: 'Neon signs work by exciting neon gas atoms with electricity. The electrons jump up, then fall back down, emitting photons of very specific orange-red wavelengths.'
  },
  chemical_bond: {
    what: 'Chemical bonds form when atoms share or transfer electrons. The main types are covalent (sharing), ionic (transfer), and metallic bonds.',
    whyItMatters: 'Every molecule, every material, every living thing exists because of chemical bonds. Understanding bonds means understanding all of chemistry.',
    weirdPart: 'Bonds are fundamentally quantum mechanical — electrons are shared as probability clouds that span multiple atoms. Classical physics cannot explain why atoms stick together.',
    history: 'Lewis proposed electron-pair bonding in 1916. Heitler and London gave the first quantum mechanical description of a bond (H₂) in 1927.',
    funFact: 'A single strand of spider silk has more bonds per length than steel cable, yet is much lighter. Nature is an incredible quantum engineer.'
  },
  water: {
    what: 'Water (H₂O) consists of two hydrogen atoms bonded to one oxygen atom at a 104.5° angle. It\'s essential for all known life.',
    whyItMatters: 'Water is the universal solvent, the medium for biochemistry, and a major factor in Earth\'s climate. Finding water on other planets is key to the search for extraterrestrial life.',
    weirdPart: 'Water molecules form hydrogen bonds with each other, giving water unusual properties: ice floats (most solids sink in their liquid), water has a high heat capacity, and surface tension lets insects walk on it.',
    history: 'Henry Cavendish showed water was a compound (not an element) in 1781. Its quantum mechanical structure was worked out in the 20th century.',
    funFact: 'Hot water can freeze faster than cold water under certain conditions. This is called the Mpemba effect, and the exact mechanism is still debated!'
  },
  gravity: {
    what: 'Gravity is the force of attraction between masses. It\'s by far the weakest of the four fundamental forces, but it dominates at cosmic scales because it\'s always attractive and has infinite range.',
    whyItMatters: 'Gravity keeps planets in orbit, holds galaxies together, and determines the large-scale structure of the universe. Understanding gravity is essential for cosmology.',
    weirdPart: 'We don\'t have a quantum theory of gravity! General relativity describes gravity as curved spacetime, but we can\'t reconcile this with quantum mechanics. This is the biggest unsolved problem in physics.',
    history: 'Newton described gravitational law in 1687. Einstein reimagined gravity as spacetime curvature in 1915 (general relativity). Quantum gravity remains unsolved.',
    funFact: 'Gravity is 10³⁶ times weaker than electromagnetism. A small refrigerator magnet easily overpowers the gravitational pull of the entire Earth when it holds up a paperclip.'
  },
  mass: {
    what: 'Mass is the property of matter that resists acceleration (inertia) and generates gravitational attraction. In quantum mechanics, particles acquire mass through interaction with the Higgs field.',
    whyItMatters: 'Mass determines how particles behave — their speed, energy, and gravitational influence. Understanding the origin of mass was one of physics\' greatest quests.',
    weirdPart: 'About 99% of your body\'s mass does NOT come from the Higgs field. It comes from the kinetic and binding energy of quarks and gluons inside protons and neutrons (via E=mc²)!',
    history: 'Newton defined mass in his Principia (1687). The Higgs mechanism was proposed in 1964 to explain WHY particles have different masses.',
    funFact: 'A photon has zero mass but still has energy and momentum. Mass and energy are equivalent (E=mc²), but they\'re not the same thing!'
  },
  energy: {
    what: 'Energy is the capacity to do work. In physics, it comes in many forms: kinetic, potential, thermal, electromagnetic, nuclear, and more. It\'s always conserved — never created or destroyed.',
    whyItMatters: 'The conservation of energy is one of the most fundamental laws in physics. E=mc² showed that mass itself is a form of energy.',
    weirdPart: 'In quantum mechanics, energy is often quantized — it comes in discrete packets. You can\'t have just any amount of energy; only certain values are allowed. This is the core idea of "quantum."',
    history: 'The concept evolved over centuries. Conservation of energy was established by Helmholtz, Joule, and others in the 1840s. Planck quantized it in 1900.',
    funFact: 'The word "quantum" literally means "how much" in Latin. Planck used it because energy comes in fixed portions — quanta — not in continuous amounts.'
  },

  // ================================================================
  // ERA 4: QUANTUM PHENOMENA
  // ================================================================
  wave_particle_duality: {
    what: 'Wave-particle duality is the concept that every quantum entity exhibits both wave-like and particle-like behavior, depending on how it\'s observed.',
    whyItMatters: 'This is the central mystery of quantum mechanics. It overturned the classical idea that things are either waves or particles, and it forces us to rethink what "reality" means.',
    weirdPart: 'It\'s not that the particle "is" a wave sometimes and a particle other times. It\'s something fundamentally different from both — something that has no classical analog. We just use "wave" and "particle" because we have no better words.',
    history: 'Einstein showed light has particle nature (1905). De Broglie proposed matter has wave nature (1924). Davisson and Germer confirmed electron diffraction (1927).',
    funFact: 'Everything has a de Broglie wavelength — including you! But for a human walking, the wavelength is about 10⁻³⁵ meters — far too small to ever detect.'
  },
  double_slit: {
    what: 'Fire particles one at a time through two slits. Each particle lands in one spot (particle behavior), but over many particles, an interference pattern forms (wave behavior). If you detect which slit each particle goes through, the pattern disappears!',
    whyItMatters: 'The double-slit experiment demonstrates the core weirdness of quantum mechanics more clearly than any other experiment. Feynman said it contains "the only mystery."',
    weirdPart: 'Each particle seems to go through BOTH slits simultaneously and interfere with itself. If you add a detector to see which slit it goes through, the interference vanishes. The particle "knows" it\'s being watched.',
    history: 'Thomas Young first performed it with light in 1801 to prove light is a wave. It was later performed with electrons, atoms, and even large molecules — all showing quantum behavior.',
    funFact: 'In 2019, scientists performed the double-slit experiment with molecules of 2,000 atoms. Even these "large" objects showed quantum interference. Where does quantum end and classical begin?'
  },
  superposition: {
    what: 'A quantum system exists in all possible states simultaneously until measured. An electron can be spin-up AND spin-down; a photon can be in two places at once.',
    whyItMatters: 'Superposition is the foundation of quantum computing, quantum cryptography, and our entire understanding of the quantum world. It\'s what makes quantum mechanics "quantum."',
    weirdPart: 'It\'s not that we don\'t KNOW which state the system is in — it\'s genuinely in ALL states at once. This was confirmed by Bell\'s theorem experiments. Reality is fundamentally indeterminate.',
    history: 'Formalized by Schrödinger\'s wave mechanics (1926) and Dirac\'s notation (1930s). Schrödinger\'s cat thought experiment (1935) highlighted its strange implications.',
    funFact: 'Scientists have put increasingly large objects into superposition — from photons to atoms to small vibrating drums. The current record is a tiny aluminum drum visible to the naked eye (2021).'
  },
  measurement: {
    what: 'In quantum mechanics, measurement forces a system in superposition to "collapse" into a single definite state. The outcome is probabilistic — fundamentally random.',
    whyItMatters: 'The measurement problem is one of the deepest unsolved questions in physics. How and why does measurement cause collapse? What counts as a "measurement"?',
    weirdPart: 'Before measurement, quantum mechanics can only predict probabilities. Even with perfect information about a system, the specific outcome of a measurement is inherently unpredictable.',
    history: 'The concept emerged from the Copenhagen interpretation, primarily from Bohr and Heisenberg in the 1920s. It remains controversial — not all physicists agree on what "measurement" means.',
    funFact: 'The "many-worlds interpretation" says measurement doesn\'t cause collapse — instead, the universe splits into branches for every possible outcome. Every quantum measurement creates parallel universes!'
  },
  entanglement: {
    what: 'When two particles become entangled, measuring one instantly determines the state of the other, regardless of the distance between them. The correlation is stronger than any classical explanation allows.',
    whyItMatters: 'Entanglement enables quantum computing, quantum teleportation, and quantum cryptography. It\'s also one of the strongest proofs that quantum mechanics is fundamentally non-local.',
    weirdPart: 'Einstein called this "spooky action at a distance" and argued it proved quantum mechanics was incomplete. Bell\'s theorem (1964) showed Einstein was wrong — entanglement is a real feature of nature.',
    history: 'Described by Einstein, Podolsky, and Rosen in their famous EPR paper (1935). Bell provided a test in 1964. Aspect performed the definitive experiment in 1982. Clauser, Aspect, and Zeilinger won the 2022 Nobel Prize.',
    funFact: 'Entanglement has been demonstrated over distances of more than 1,200 km using the Chinese Micius satellite. No information travels faster than light — but the correlations are instantaneous.'
  },
  quantum_tunneling: {
    what: 'Quantum tunneling is when a particle passes through an energy barrier it classically shouldn\'t have enough energy to overcome. The particle\'s wave function extends through the barrier.',
    whyItMatters: 'Tunneling makes nuclear fusion in the Sun possible, enables flash memory and tunnel diodes, and is the basis for scanning tunneling microscopes.',
    weirdPart: 'The particle never "exists" inside the barrier in any classical sense. Its wave function has a non-zero amplitude on the other side, so there\'s a probability of finding it there.',
    history: 'First described by Friedrich Hund in 1927. Gamow applied it to alpha decay in 1928, brilliantly explaining radioactive decay rates.',
    funFact: 'As transistors shrink below 5 nanometers, quantum tunneling causes electrons to leak through, creating errors. This is one of the fundamental limits on making computers faster.'
  },
  energy_barrier: {
    what: 'An energy barrier is a region of high potential energy that classically prevents particles from crossing. Think of it like a hill that a ball doesn\'t have enough energy to roll over.',
    whyItMatters: 'Energy barriers govern chemical reactions (activation energy), nuclear decay, and electronic devices. Understanding them is key to quantum tunneling.',
    weirdPart: 'In quantum mechanics, a barrier doesn\'t absolutely block anything. There\'s always a nonzero probability of tunneling through, no matter how thick or high the barrier.',
    history: 'Classical energy barriers were understood in the 19th century. Their quantum mechanical penetrability was discovered in the late 1920s.',
    funFact: 'Enzymes in your body work by lowering energy barriers for biochemical reactions. Without them, the reactions of life would take millions of years instead of milliseconds.'
  },
  uncertainty_principle: {
    what: 'Heisenberg\'s uncertainty principle states that you cannot simultaneously know both the exact position and exact momentum of a particle. The more precisely you know one, the less you can know the other: Δx·Δp ≥ ℏ/2.',
    whyItMatters: 'This isn\'t about imperfect instruments — it\'s a fundamental law of nature. It has profound implications for everything from atomic structure to quantum computing.',
    weirdPart: 'Particles don\'t HAVE definite position and momentum simultaneously. It\'s not that we can\'t measure them — the properties literally don\'t exist with precision at the same time.',
    history: 'Formulated by Werner Heisenberg in 1927. He initially thought of it as a measurement disturbance, but it\'s actually more fundamental than that.',
    funFact: 'The uncertainty principle also applies to energy and time: ΔE·Δt ≥ ℏ/2. This means virtual particles can borrow energy from nothing — as long as they disappear quickly enough!'
  },
  momentum: {
    what: 'In quantum mechanics, momentum is related to wavelength through de Broglie\'s relation: p = h/λ. A particle with well-defined momentum has a well-defined wavelength — and an uncertain position.',
    whyItMatters: 'Quantum momentum is central to the uncertainty principle and to understanding how particles propagate through space.',
    weirdPart: 'A particle with perfectly defined momentum would be an infinite plane wave, spread out everywhere in space. To localize it, you need a wave packet — a superposition of many momenta.',
    history: 'Classical momentum (p = mv) was defined by Newton. De Broglie connected it to wavelength in 1924, launching wave mechanics.',
    funFact: 'Photons have momentum despite having zero mass! Their momentum is p = h/λ = E/c. This is why light can push things — solar sails use photon momentum for spacecraft propulsion.'
  },
  position: {
    what: 'In quantum mechanics, a particle\'s position is described by a probability distribution, not a single point. The wave function\'s square tells you where you\'re likely to find it.',
    whyItMatters: 'Quantum position challenges our classical intuition. Particles don\'t have definite positions until measured, which has implications for all of atomic and molecular physics.',
    weirdPart: 'Measuring position requires interacting with the particle (e.g., bouncing a photon off it), which inevitably changes its momentum. You can\'t be a passive observer in quantum mechanics.',
    history: 'Born interpreted the wave function as a probability amplitude for position in 1926, earning the Nobel Prize in 1954.',
    funFact: 'In the hydrogen atom, the most probable position for the electron is at the Bohr radius (about 0.053 nm), but there\'s a nonzero probability of finding it at any distance — even on the other side of the universe!'
  },
  schrodinger_cat: {
    what: 'Schrödinger\'s cat is a thought experiment: a cat in a sealed box with a radioactive atom, a Geiger counter, and poison. If the atom decays, the cat dies. Until you open the box, quantum mechanics says the cat is both alive AND dead.',
    whyItMatters: 'It vividly illustrates the absurdity of applying quantum superposition to everyday objects and highlights the measurement problem — where does quantum end and classical begin?',
    weirdPart: 'Schrödinger intended it as a CRITICISM of quantum mechanics — to show how absurd superposition is at human scales. Instead, it became the most famous illustration of quantum weirdness.',
    history: 'Proposed by Erwin Schrödinger in 1935 in response to the EPR paper. It remains the most iconic thought experiment in quantum physics.',
    funFact: 'The solution to the cat paradox may be quantum decoherence — the box isn\'t truly isolated from the environment, so the superposition collapses almost instantly for large objects.'
  },
  decoherence: {
    what: 'Decoherence is the process by which a quantum system loses its quantum behavior through interaction with its environment. Superposition "leaks" into the surroundings.',
    whyItMatters: 'Decoherence explains why we don\'t see quantum effects in everyday life and is the main challenge for quantum computing — keeping qubits isolated from decoherence.',
    weirdPart: 'Decoherence doesn\'t require a conscious observer. Every interaction with the environment counts as a kind of measurement. The universe is constantly "watching."',
    history: 'The concept was developed by H. Dieter Zeh in 1970 and formalized by Wojciech Zurek in the 1980s.',
    funFact: 'At room temperature, a superposition of a grain of sand would decohere in about 10⁻²⁶ seconds — far too fast to ever observe. Quantum computers must be cooled to near absolute zero to slow this down.'
  },
  photoelectric_effect: {
    what: 'When light shines on a metal surface, electrons are ejected — but only if the light\'s frequency is above a threshold. Brighter light ejects more electrons but doesn\'t change their energy; only higher frequency does.',
    whyItMatters: 'This proved that light comes in packets (photons) with energy E = hf. It was a key step in the birth of quantum mechanics and earned Einstein the Nobel Prize.',
    weirdPart: 'Classical wave theory predicted that brighter light should eject faster electrons (more energy in the wave). Instead, only frequency matters — because each photon interacts individually with one electron.',
    history: 'Observed by Heinrich Hertz in 1887. Explained by Einstein in 1905 using Planck\'s quantum hypothesis. Einstein won the 1921 Nobel Prize for this — not relativity!',
    funFact: 'The photoelectric effect is how solar panels work! Photons knock electrons loose in a semiconductor, creating electrical current. Einstein\'s 1905 insight now powers millions of homes.'
  },
  blackbody_radiation: {
    what: 'Any hot object emits thermal radiation. A "blackbody" absorbs all light and emits radiation based solely on its temperature. Classical physics predicted infinite energy at high frequencies (the "ultraviolet catastrophe").',
    whyItMatters: 'Solving the blackbody problem required Planck to introduce quantized energy in 1900 — the very first quantum idea, which started the quantum revolution.',
    weirdPart: 'Planck introduced E = nhf (energy comes in quanta) as a mathematical trick, not believing it was physically real. But it worked perfectly, and reality turned out to be quantized.',
    history: 'The ultraviolet catastrophe was identified in the 1890s. Max Planck solved it on December 14, 1900 — often considered the birthday of quantum physics.',
    funFact: 'The cosmic microwave background is a near-perfect blackbody at 2.725 K — the afterglow of the Big Bang, now cooled by 13.8 billion years of cosmic expansion.'
  },
  compton_scattering: {
    what: 'When a high-energy photon (X-ray or gamma ray) collides with an electron, the photon loses energy and its wavelength increases. The electron recoils like a billiard ball.',
    whyItMatters: 'Compton scattering was definitive proof that photons carry momentum and behave as particles in collisions. It confirmed the particle nature of light beyond any doubt.',
    weirdPart: 'The photon doesn\'t just bounce off — it literally transfers momentum to the electron as if it were a tiny billiard ball. Light acts exactly like a particle with mass, even though it has none.',
    history: 'Discovered by Arthur Holly Compton in 1923, earning him the 1927 Nobel Prize. It was the experiment that convinced remaining skeptics of the photon concept.',
    funFact: 'Inverse Compton scattering (electrons giving energy TO photons) is responsible for some of the most energetic gamma rays in the universe, produced near black holes and in cosmic jets.'
  },
  quantum_spin: {
    what: 'Quantum spin is an intrinsic angular momentum that particles possess. Electrons have spin 1/2, meaning they can be "spin up" or "spin down." Despite the name, nothing is physically spinning.',
    whyItMatters: 'Spin determines how particles interact, how atoms form chemical bonds, and is the basis for MRI technology, spintronics, and quantum computing.',
    weirdPart: 'A spin-1/2 particle must be rotated 720° (not 360°!) to return to its original state. If you turned yourself around once, quantum mechanically you wouldn\'t be the same — you\'d need two full turns!',
    history: 'Proposed by Goudsmit and Uhlenbeck in 1925 to explain atomic spectra. Dirac\'s equation (1928) showed spin arises naturally from combining quantum mechanics with special relativity.',
    funFact: 'Every electron in the universe has exactly the same spin magnitude: √(3)/2 · ℏ. Not approximately — exactly. All electrons are identical in every measurable way.'
  },
  pauli_exclusion: {
    what: 'The Pauli exclusion principle states that no two identical fermions (like electrons) can occupy the same quantum state. Two electrons in the same orbital must have opposite spins.',
    whyItMatters: 'This principle explains the entire structure of the periodic table, why atoms have shells, why matter occupies space, and why neutron stars don\'t collapse into black holes.',
    weirdPart: 'Without the exclusion principle, all electrons would fall to the lowest energy state. Every atom would be tiny and identical. Chemistry wouldn\'t exist. YOU wouldn\'t exist.',
    history: 'Proposed by Wolfgang Pauli in 1925. He couldn\'t explain WHY it was true — that required the spin-statistics theorem, connecting spin to quantum statistics.',
    funFact: 'The exclusion principle is what keeps white dwarf stars from collapsing. Electron degeneracy pressure — a purely quantum effect — supports a mass equal to the Sun in a volume the size of Earth.'
  },
  quantum_numbers: {
    what: 'Four quantum numbers describe every electron in an atom: n (shell/energy), l (subshell/shape), mₗ (orbital orientation), and mₛ (spin direction ±1/2).',
    whyItMatters: 'Quantum numbers are the "address system" for electrons. They determine the periodic table\'s structure, chemical properties, and how atoms bond.',
    weirdPart: 'These numbers aren\'t arbitrary labels — they emerge mathematically from solving the Schrödinger equation for hydrogen. The quantization of nature produces integers naturally!',
    history: 'Developed incrementally by Bohr (n), Sommerfeld (l, mₗ), and Pauli (mₛ) between 1913-1925.',
    funFact: 'The shapes of electron orbitals get increasingly exotic with higher quantum numbers — from spheres (s) to dumbbells (p) to cloverleafs (d) to truly bizarre shapes (f and beyond).'
  },
  wave_function: {
    what: 'The wave function Ψ(x,t) is a mathematical object that completely describes a quantum system. Its square |Ψ|² gives the probability of finding the particle at each location.',
    whyItMatters: 'The wave function is quantum mechanics\' central mathematical tool. All predictions about quantum systems come from manipulating and measuring wave functions.',
    weirdPart: 'Nobody agrees on what the wave function "is." Is it a real physical wave? A mathematical tool for calculating probabilities? A description of our knowledge? This debate is still unresolved.',
    history: 'Introduced by Erwin Schrödinger in 1926. Max Born interpreted |Ψ|² as probability in 1926. Born won the Nobel Prize in 1954 for this interpretation.',
    funFact: 'The wave function of the entire universe (if it exists) would be a single object in a space with roughly 10⁸⁰ dimensions — one for each particle in the observable universe.'
  },
  probability_cloud: {
    what: 'Electrons around atoms don\'t follow neat orbital paths — they exist as clouds of probability. The cloud is dense where the electron is likely to be found and thin where it\'s unlikely.',
    whyItMatters: 'Probability clouds replaced the "planetary model" of atoms. They\'re the real shape of atoms and determine how atoms bond and interact.',
    weirdPart: 'The probability cloud extends to infinity — there\'s technically a nonzero chance of finding an electron in your body on the other side of the galaxy. The probability is astronomically small, but not zero.',
    history: 'The concept emerged from Born\'s probability interpretation (1926) and was visualized as cloud diagrams in the 1930s-40s.',
    funFact: 'In the hydrogen atom\'s ground state, the electron has the highest probability of being at one Bohr radius from the proton — but at the actual center of the atom, the probability density is the highest!'
  },
  quantum_leap: {
    what: 'A quantum leap (or quantum jump) is the instantaneous transition of an electron from one energy level to another. There is no gradual transition — it\'s discontinuous.',
    whyItMatters: 'Quantum leaps are how atoms emit and absorb light. Every photon in the universe was created by a quantum leap.',
    weirdPart: 'In 2019, scientists at Yale observed quantum jumps in real time and found they\'re not truly instantaneous — there\'s a brief "flight" between states. They could even predict and reverse jumps mid-flight!',
    history: 'Postulated by Bohr in 1913 as part of his atomic model. Long debated (Schrödinger hated the concept), confirmed experimentally in the 1980s for individual atoms.',
    funFact: 'In popular language, "quantum leap" means a huge change. In physics, it\'s the smallest possible change a system can make! Quantum leaps are tiny.'
  },
  zero_point_energy: {
    what: 'Even at absolute zero temperature, quantum systems retain a minimum amount of energy — the zero-point energy. This is a direct consequence of the uncertainty principle.',
    whyItMatters: 'Zero-point energy explains why helium remains liquid at absolute zero, contributes to the Casimir effect, and is related to the cosmological constant problem.',
    weirdPart: 'The total zero-point energy of the quantum vacuum is theoretically infinite (or at least enormous). This "vacuum energy" should curve spacetime — but observations show it doesn\'t. This is the "vacuum catastrophe," the worst prediction in physics (wrong by 10¹²⁰).',
    history: 'Predicted by Planck in 1912 and formalized with quantum mechanics in the 1920s.',
    funFact: 'Some have proposed harvesting zero-point energy as a power source. However, since it\'s the MINIMUM energy a system can have, extracting it would violate thermodynamics. Sorry, no free energy machines.'
  },
  quantum_fluctuation: {
    what: 'Virtual particle-antiparticle pairs constantly pop in and out of existence in "empty" space, borrowing energy for brief moments allowed by the uncertainty principle.',
    whyItMatters: 'Quantum fluctuations cause the Casimir effect, contribute to the Lamb shift, and may have seeded the large-scale structure of the universe during cosmic inflation.',
    weirdPart: 'Empty space isn\'t empty. It\'s a roiling sea of virtual particles. These fluctuations are real — they cause measurable forces between metal plates (Casimir effect, verified in 1997).',
    history: 'Predicted by quantum field theory in the 1930s-40s. The Casimir effect was proposed in 1948 and measured in 1997.',
    funFact: 'The pattern of galaxies in the universe may have started as quantum fluctuations during the Big Bang, stretched to cosmic scales by inflation. You are quantum fluctuations, expanded.'
  },
  stimulated_emission: {
    what: 'When a photon passes near an excited atom, it can trigger the atom to emit an identical photon — same frequency, phase, direction, and polarization. One photon becomes two.',
    whyItMatters: 'Stimulated emission is the operating principle of all lasers and is crucial for fiber-optic communications, medicine, manufacturing, and scientific research.',
    weirdPart: 'The new photon is a perfect clone of the original — quantum mechanically identical in every way. This is how lasers produce perfectly coherent light, unlike any other light source.',
    history: 'Predicted by Einstein in 1917 as a theoretical necessity to balance absorption and emission rates. The first laser using this principle was built by Theodore Maiman in 1960.',
    funFact: 'Einstein\'s 1917 paper on stimulated emission was largely ignored for 40 years. It took until the late 1950s for Townes, Schawlow, and others to realize it could create a revolutionary new light source.'
  },

  // ================================================================
  // ERA 5: ADVANCED & APPLIED
  // ================================================================
  qubit: {
    what: 'A qubit (quantum bit) is the quantum analog of a classical bit. While a classical bit is either 0 or 1, a qubit can exist in a superposition of both states simultaneously.',
    whyItMatters: 'Qubits are the fundamental unit of quantum computing. A system of N qubits can process 2^N states simultaneously, potentially solving certain problems exponentially faster.',
    weirdPart: 'Measuring a qubit destroys the superposition — you get either 0 or 1. The art of quantum computing is manipulating qubits BEFORE measurement to make the right answer most probable.',
    history: 'The concept was proposed by Richard Feynman (1982) and formalized by David Deutsch (1985). The term "qubit" was coined by Benjamin Schumacher in 1995.',
    funFact: 'As of 2024, the largest quantum computers have about 1000+ qubits (IBM), but most are "noisy." A practical quantum computer might need millions of error-corrected qubits.'
  },
  logic_gate: {
    what: 'Quantum logic gates are operations that transform qubits — like classical logic gates (AND, OR, NOT) but for quantum states. Key gates include the Hadamard gate (creates superposition) and CNOT gate (creates entanglement).',
    whyItMatters: 'Quantum algorithms are built from sequences of quantum gates. Universal quantum computation requires only a few types of gates — similar to how all classical circuits use NAND gates.',
    weirdPart: 'All quantum gates (except measurement) are reversible — you can always undo them. This is fundamentally different from classical computing, where most gates destroy information.',
    history: 'Developed in the 1990s-2000s as quantum computing theory matured. Key algorithms by Shor (factoring, 1994) and Grover (search, 1996) showed their power.',
    funFact: 'Google\'s "quantum supremacy" experiment (2019) used a specific sequence of quantum gates to perform a calculation in 200 seconds that would take a classical supercomputer 10,000 years.'
  },
  quantum_computer: {
    what: 'A quantum computer uses qubits, superposition, and entanglement to perform calculations. For certain problems, it can be exponentially faster than any classical computer.',
    whyItMatters: 'Quantum computers could revolutionize cryptography, drug discovery, materials science, optimization, and artificial intelligence. They represent a fundamentally new way of processing information.',
    weirdPart: 'Quantum computers aren\'t just "faster computers." They\'re better at specific types of problems (like factoring and simulation) but may be no better than classical computers for many everyday tasks.',
    history: 'Proposed by Feynman in 1982 to simulate quantum systems. Shor\'s algorithm (1994) showed they could break encryption. First crude quantum computers appeared in the late 1990s.',
    funFact: 'A fully error-corrected quantum computer with about 4,000 logical qubits could break RSA-2048 encryption, which secures most internet traffic. This is driving the development of "post-quantum cryptography."'
  },
  quantum_cryptography: {
    what: 'Quantum cryptography (specifically Quantum Key Distribution, QKD) uses quantum mechanics to create encryption keys that are guaranteed secure by the laws of physics.',
    whyItMatters: 'Unlike classical encryption (which is secure because factoring is hard), quantum cryptography is secure because measuring a quantum state changes it — eavesdropping is physically detectable.',
    weirdPart: 'If someone intercepts and measures the quantum key, the no-cloning theorem ensures they can\'t copy it without disturbing it. The sender and receiver will always detect the intrusion.',
    history: 'Proposed by Charles Bennett and Gilles Brassard in 1984 (BB84 protocol). First demonstrated experimentally at IBM in 1989.',
    funFact: 'China has built a 2,000 km quantum communication network between Beijing and Shanghai, and their Micius satellite enables intercontinental quantum key distribution.'
  },
  quantum_teleportation: {
    what: 'Quantum teleportation transfers the quantum state of one particle to another particle at a distance, using entanglement and classical communication. The original state is destroyed in the process.',
    whyItMatters: 'Teleportation is essential for quantum networks, distributed quantum computing, and quantum error correction. It\'s a key primitive for quantum information science.',
    weirdPart: 'No matter or energy is teleported — only quantum information. And it can\'t happen faster than light because you need to send classical information too. Star Trek teleportation it is not.',
    history: 'Proposed by Bennett et al. in 1993. First demonstrated with photons in 1997. Since then, teleportation distances have increased to over 1,400 km via satellite.',
    funFact: 'The no-cloning theorem (you can\'t copy a quantum state) means teleportation must destroy the original — the quantum state is transferred, not duplicated. It\'s more like a quantum fax than a copy machine.'
  },
  bose_einstein_condensate: {
    what: 'A Bose-Einstein condensate (BEC) is a state of matter formed when bosons (particles with integer spin) are cooled to near absolute zero. They all fall into the same quantum state, behaving as a single "super-atom."',
    whyItMatters: 'BECs allow scientists to observe quantum effects at macroscopic scales. They\'re used to study superfluidity, simulate complex quantum systems, and test fundamental physics.',
    weirdPart: 'In a BEC, thousands of atoms lose their individual identities and become a single quantum entity. You can see quantum mechanics with the naked eye — the entire condensate is one wave function.',
    history: 'Predicted by Einstein in 1924-25, building on Bose\'s statistics. First created in a lab by Cornell, Wieman, and Ketterle in 1995 (Nobel Prize 2001).',
    funFact: 'BECs can slow light to a crawl — in 1999, scientists slowed light to just 17 meters per second (38 mph!) using a BEC. In 2001, they even stopped light completely for a brief moment.'
  },
  superconductor: {
    what: 'A superconductor is a material that conducts electricity with exactly zero resistance below a critical temperature. It also expels magnetic fields (the Meissner effect).',
    whyItMatters: 'Superconductors enable MRI machines, particle accelerators, maglev trains, and quantum computers. Room-temperature superconductors would revolutionize technology.',
    weirdPart: 'The zero resistance is absolute — not "very low," but exactly zero. An electrical current in a superconducting loop would flow forever without any energy input.',
    history: 'Discovered by Heike Kamerlingh Onnes in 1911 with mercury at 4.2 K. High-temperature superconductors (above 77 K) were discovered in 1986 by Bednorz and Müller.',
    funFact: 'The Large Hadron Collider at CERN uses 1,232 superconducting magnets cooled to 1.9 K (colder than outer space!) to bend proton beams around its 27 km ring.'
  },
  cooper_pair: {
    what: 'A Cooper pair consists of two electrons with opposite spin and momentum that become bound together at low temperatures through interaction with the crystal lattice.',
    whyItMatters: 'Cooper pairs are the key to understanding superconductivity. When electrons form Cooper pairs, they become bosons and can all condense into the same quantum state — enabling zero resistance.',
    weirdPart: 'Electrons normally repel each other (same charge). But in a Cooper pair, one electron slightly distorts the lattice, creating a positive charge concentration that attracts the second electron. The binding is incredibly weak.',
    history: 'Proposed by Leon Cooper in 1956 as part of BCS theory (Bardeen, Cooper, Schrieffer), which earned the 1972 Nobel Prize.',
    funFact: 'Cooper pairs in a typical superconductor are huge — the two electrons can be hundreds of nanometers apart, with millions of other electrons between them. It\'s the most "long-distance relationship" in physics.'
  },
  laser: {
    what: 'A laser produces light that is coherent (all waves in phase), monochromatic (single wavelength), and collimated (parallel beam). LASER stands for Light Amplification by Stimulated Emission of Radiation.',
    whyItMatters: 'Lasers are everywhere: fiber optics, barcode scanners, surgery, manufacturing, weapons, scientific instruments, laser pointers. They\'re one of the most important inventions of the 20th century.',
    weirdPart: 'Laser light is radically different from all other light. In a light bulb, photons are random — different phases, directions, wavelengths. In a laser, every photon is an identical quantum clone.',
    history: 'Einstein predicted stimulated emission in 1917. Townes and Schawlow laid the theoretical groundwork in 1958. Theodore Maiman built the first laser in 1960.',
    funFact: 'The most powerful laser (NIF) produces 2.05 megajoules in billionths of a second — briefly generating more power than the entire US electrical grid. In 2022, it achieved fusion ignition!'
  },
  semiconductor: {
    what: 'Semiconductors have electrical conductivity between conductors and insulators. Their conductivity can be controlled by adding impurities (doping) or applying electric fields.',
    whyItMatters: 'Semiconductors are the foundation of modern electronics — every computer chip, solar cell, LED, and sensor is made from semiconductors (mostly silicon).',
    weirdPart: 'Semiconductors work because of quantum band theory. Electrons in solids exist in energy bands separated by gaps. The gap size determines whether a material conducts, insulates, or semi-conducts.',
    history: 'Semiconductor properties observed in the 1800s. Quantum band theory developed in the 1930s. The semiconductor revolution began with the transistor in 1947.',
    funFact: 'The entire modern economy runs on silicon — a material that\'s the second most abundant element in Earth\'s crust. We\'re literally building civilization from dirt (silicon dioxide = sand).'
  },
  transistor: {
    what: 'A transistor is a semiconductor device that can switch or amplify electronic signals. It\'s the fundamental building block of all modern electronics.',
    whyItMatters: 'Every digital device — phones, computers, satellites, cars — is built from billions of transistors. The transistor is arguably the most important invention of the 20th century.',
    weirdPart: 'Modern transistors are so small (under 5 nm) that quantum effects like tunneling become significant. Engineers must account for quantum mechanics to design chips!',
    history: 'Invented by Bardeen, Brattain, and Shockley at Bell Labs in 1947 (Nobel Prize 1956). The integrated circuit followed in 1958.',
    funFact: 'A modern Apple M2 chip contains about 20 billion transistors. Humanity produces roughly 13 sextillion (1.3 × 10²²) transistors per year — more than any other manufactured object in history.'
  },
  led: {
    what: 'An LED (Light-Emitting Diode) converts electrical energy directly into light. When electrons cross the semiconductor\'s band gap, they release energy as photons.',
    whyItMatters: 'LEDs are the most efficient light source ever created, saving enormous amounts of energy worldwide. The blue LED breakthrough enabled white LED lighting and won the 2014 Nobel Prize.',
    weirdPart: 'The color of an LED is determined by the quantum mechanical band gap of the semiconductor. Change the material, change the gap, change the color — designer light at the quantum level.',
    history: 'First practical LED (red) by Nick Holonyak in 1962. Blue LED by Akasaki, Amano, and Nakamura in the 1990s (Nobel Prize 2014).',
    funFact: 'LEDs convert about 50% of electricity into light (vs. 5% for incandescent bulbs). The Nobel committee said the blue LED would "benefit all humanity" by enabling energy-efficient white lighting.'
  },
  mri: {
    what: 'MRI uses strong magnetic fields and radio waves to flip the quantum spin of hydrogen atoms in the body, then detects the signals as they relax back. This creates detailed images of soft tissue.',
    whyItMatters: 'MRI is one of the most important medical imaging tools, revealing brain structure, detecting tumors, and imaging joints without harmful radiation.',
    weirdPart: 'MRI directly exploits quantum spin — it wouldn\'t work without this quantum property. The technique essentially "listens" to individual protons flipping their spins in a magnetic field.',
    history: 'Based on nuclear magnetic resonance (NMR) discovered by Rabi (1938). First MRI image of a human body by Raymond Damadian in 1977. Lauterbur and Mansfield won the 2003 Nobel Prize.',
    funFact: 'The superconducting magnets in MRI machines are so powerful that they\'ve pulled oxygen tanks across rooms. MRI safety training includes the famous "flying wrench" warning.'
  },
  quantum_field_theory: {
    what: 'QFT is the framework that combines quantum mechanics with special relativity. In QFT, particles are excitations (vibrations) of underlying quantum fields that fill all of space.',
    whyItMatters: 'QFT is the most fundamental theory of physics we have. The Standard Model is a quantum field theory, and it explains all known particles and forces except gravity.',
    weirdPart: 'In QFT, "empty" space isn\'t empty — it\'s filled with quantum fields at their ground state. Particles are just ripples in these fields. An electron is a ripple in the electron field.',
    history: 'Developed in stages: Dirac (1920s-30s), Feynman/Schwinger/Tomonaga (1940s), Yang-Mills (1954), and many others through the 1970s.',
    funFact: 'Feynman diagrams — those famous sketches of particles interacting — are actually shorthand for incredibly complex mathematical integrals in quantum field theory. Each simple diagram encodes pages of math.'
  },
  standard_model: {
    what: 'The Standard Model is the theory of 17 fundamental particles (6 quarks, 6 leptons, 4 force carriers, and the Higgs boson) and three fundamental forces (strong, weak, electromagnetic).',
    whyItMatters: 'It\'s the most successful and precisely tested theory in the history of science. It explains virtually all particle physics experiments ever performed.',
    weirdPart: 'Despite its incredible success, we KNOW the Standard Model is incomplete. It doesn\'t include gravity, dark matter, or dark energy — which together make up 95% of the universe.',
    history: 'Assembled over decades: electroweak theory (1960s), QCD (1970s), Higgs mechanism (1964/2012). It\'s the work of hundreds of physicists.',
    funFact: 'The Standard Model has 19 free parameters (particle masses, coupling constants, etc.) that must be measured experimentally — they can\'t be derived from the theory. Why these specific values? Nobody knows.'
  },
  hawking_radiation: {
    what: 'Hawking radiation is theoretical thermal radiation emitted by black holes due to quantum effects near the event horizon. Virtual particle pairs are separated — one falls in, one escapes.',
    whyItMatters: 'Hawking radiation implies black holes aren\'t truly "black" — they slowly evaporate over time. This creates the "black hole information paradox," one of physics\' deepest puzzles.',
    weirdPart: 'For a stellar-mass black hole, the temperature of Hawking radiation is about 10⁻⁸ K — far colder than the cosmic background radiation. So currently, all black holes are gaining mass, not losing it.',
    history: 'Predicted by Stephen Hawking in 1974, combining quantum field theory with general relativity. It has never been directly observed.',
    funFact: 'A black hole the mass of the Sun would take about 10⁶⁷ years to evaporate — vastly longer than the age of the universe. But a tiny black hole the mass of a mountain would evaporate in seconds with an explosion brighter than a billion nuclear bombs.'
  },
  black_hole: {
    what: 'A black hole is a region of spacetime where gravity is so extreme that nothing — not even light — can escape once past the event horizon. Formed from collapsed massive stars.',
    whyItMatters: 'Black holes are where general relativity meets its limits. They\'re nature\'s most extreme objects and are found at the center of nearly every galaxy.',
    weirdPart: 'At the singularity inside a black hole, our theories of physics break down. Density becomes infinite, spacetime curvature becomes infinite. This is where we NEED quantum gravity.',
    history: 'Predicted by Schwarzschild in 1916 from Einstein\'s equations. First strong evidence: Cygnus X-1 (1971). First image: M87* by the Event Horizon Telescope (2019).',
    funFact: 'The black hole at the center of the Milky Way (Sagittarius A*) has a mass of 4 million Suns but is "only" about as wide as Mercury\'s orbit. If you fell in, spaghettification would stretch you into a long thin strand.'
  },
  quantum_gravity: {
    what: 'Quantum gravity is the yet-undiscovered theory that would unify quantum mechanics with general relativity — describing gravity at the quantum level.',
    whyItMatters: 'This is the holy grail of theoretical physics. Without it, we can\'t understand the Big Bang singularity, black hole interiors, or physics at the Planck scale.',
    weirdPart: 'Gravity is the only force without a quantum description. The hypothetical "graviton" (quantum of gravity) has never been detected. Some doubt it\'s even a particle in the traditional sense.',
    history: 'The quest began in the 1930s and is ongoing. Leading candidates include string theory (1960s-present) and loop quantum gravity (1980s-present). Neither is confirmed.',
    funFact: 'The Planck length (1.6 × 10⁻³⁵ m) — where quantum gravity effects become important — is to an atom what an atom is to the observable universe. It\'s unfathomably small.'
  },
  absolute_zero: {
    what: 'Absolute zero (0 Kelvin, -273.15°C) is the lowest possible temperature — the point where classical thermal motion ceases. Quantum mechanics prevents reaching it exactly.',
    whyItMatters: 'Near absolute zero, quantum effects dominate: superconductivity, superfluidity, and Bose-Einstein condensation all emerge. Extreme cold reveals the quantum nature of matter.',
    weirdPart: 'The third law of thermodynamics says you can never actually reach absolute zero. And even if you could, zero-point energy means particles would still have motion — you can\'t stop quantum fluctuations.',
    history: 'The concept was defined by Lord Kelvin in 1848. The race to reach lower temperatures has continued ever since — the current record is about 38 picokelvin (38 trillionths of a degree above absolute zero).',
    funFact: 'Outer space is about 2.7 K. The coldest known natural place in the universe is the Boomerang Nebula at about 1 K. But human-made laboratories are routinely millions of times colder.'
  },
  electron_pair: {
    what: 'An electron pair consists of two electrons sharing a quantum state, typically with opposite spins (one up, one down). This pairing is fundamental to chemistry and superconductivity.',
    whyItMatters: 'Shared electron pairs form covalent bonds — the most important type of chemical bond. Understanding electron pairing explains molecular structure and chemical reactions.',
    weirdPart: 'Two electrons should repel each other (both negative charge), but in certain conditions they pair up because the pairing lowers the total energy of the system. Quantum mechanics overrides classical intuition.',
    history: 'Lewis proposed the shared electron pair model of bonding in 1916. The quantum mechanical explanation came from Heitler and London in 1927.',
    funFact: 'In superconductors, electron pairs (Cooper pairs) can be separated by hundreds of nanometers with millions of other electrons between them — yet they remain quantum mechanically linked.'
  },
  band_theory: {
    what: 'Band theory explains how the energy levels of atoms in a solid merge into continuous bands separated by forbidden energy gaps. The size of the gap determines if a material is a metal, semiconductor, or insulator.',
    whyItMatters: 'Band theory is the foundation of all solid-state electronics. It explains why copper conducts, glass insulates, and silicon can be engineered to do both — the basis of computer chips.',
    weirdPart: 'A single silicon atom has discrete energy levels. But put 10²³ atoms together and the levels merge into bands — this is a purely quantum mechanical collective effect with no classical analog.',
    history: 'Developed by Felix Bloch (1928) and Alan Wilson (1931). It provided the theoretical foundation for the semiconductor revolution.',
    funFact: 'The band gap of silicon (1.1 eV) happens to be nearly perfect for harvesting solar energy — about 98% of all solar cells use silicon. If the gap were much larger or smaller, solar power would be far less efficient.'
  },
  nuclear_reactor: {
    what: 'A nuclear reactor sustains a controlled chain reaction of nuclear fission, using the heat generated to produce electricity. Control rods absorb neutrons to regulate the reaction rate.',
    whyItMatters: 'Nuclear power provides about 10% of global electricity with zero carbon emissions during operation. It\'s one of the most energy-dense power sources available.',
    weirdPart: 'A nuclear reactor is essentially a very controlled chain reaction — just barely keeping the reaction going. The difference between a power plant and a meltdown is neutron management.',
    history: 'The first reactor (Chicago Pile-1) was built by Enrico Fermi in 1942 under a squash court at the University of Chicago. The first commercial power plant opened in 1956.',
    funFact: 'France generates about 70% of its electricity from nuclear power. A single nuclear power plant produces as much electricity as about 3 million solar panels or 430 wind turbines.'
  },
  solar_cell: {
    what: 'A solar cell converts sunlight directly into electricity using the photovoltaic effect — photons knock electrons loose in a semiconductor, creating a current.',
    whyItMatters: 'Solar cells are the fastest-growing energy source globally and central to addressing climate change. They turn Einstein\'s photoelectric effect into a practical power source.',
    weirdPart: 'A single photon frees a single electron. The energy of the photon must be at least as large as the semiconductor\'s band gap. Too little energy — no effect. Too much — the excess is wasted as heat.',
    history: 'Photovoltaic effect discovered by Becquerel in 1839. First practical silicon solar cell built at Bell Labs in 1954 (6% efficiency). Modern cells exceed 25%.',
    funFact: 'The cost of solar electricity has dropped 99% since 1976. In many places, solar is now the cheapest electricity source in history.'
  },
  quantum_dot: {
    what: 'Quantum dots are nanoscale semiconductor crystals (2-10 nm) where electrons are confined in all three dimensions. This quantum confinement gives them unique optical and electronic properties.',
    whyItMatters: 'Quantum dots are used in displays (QLED TVs), medical imaging, solar cells, and LED lighting. They enable precise control of color by changing particle size.',
    weirdPart: 'The color a quantum dot emits depends on its size — smaller dots emit blue light, larger ones emit red. It\'s the particle-in-a-box problem from quantum mechanics, directly determining the color of your TV!',
    history: 'First discovered by Alexei Ekimov in 1981. The 2023 Nobel Prize in Chemistry was awarded to Bawendi, Brus, and Ekimov for their development.',
    funFact: 'Samsung\'s QLED TVs use quantum dots to convert blue LED light into precise colors. The quantum mechanical particle-in-a-box problem you solve in physics class is literally inside your TV.'
  },

  // ================================================================
  // HIDDEN / EASTER EGGS
  // ================================================================
  god_particle: {
    what: 'The "God Particle" is a nickname for the Higgs boson, coined by physicist Leon Lederman in his 1993 book. He actually wanted to call it "the Goddamn Particle" because it was so hard to find, but his publisher changed it.',
    whyItMatters: 'The name became a media sensation during the search for the Higgs boson, making particle physics front-page news worldwide. It\'s controversial among physicists.',
    weirdPart: 'The Higgs boson has nothing to do with God. Many physicists dislike the nickname because it\'s misleading. Peter Higgs himself (an atheist) said it was embarrassing.',
    history: 'Name coined in Lederman\'s 1993 book "The God Particle: If the Universe Is the Answer, What Is the Question?"',
    funFact: 'When journalists asked Peter Higgs about the name, he reportedly said "I find it embarrassing because, though I am not a believer myself, I think it is the kind of misuse of terminology which I think might offend some people."'
  },
  spooky_action: {
    what: '"Spooky action at a distance" (spukhafte Fernwirkung) is Einstein\'s famous dismissal of quantum entanglement, from a letter to Max Born in 1947.',
    whyItMatters: 'Einstein believed entanglement proved quantum mechanics was incomplete — that there must be "hidden variables" explaining the correlations. Bell\'s theorem (1964) and experiments proved Einstein wrong.',
    weirdPart: 'Einstein was wrong about entanglement being impossible, but he raised legitimate questions about quantum mechanics\' completeness that led to some of the deepest insights in physics.',
    history: 'Einstein used the phrase in correspondence from 1947. The EPR paper (1935) formalized his objection.',
    funFact: 'The 2022 Nobel Prize in Physics went to Alain Aspect, John Clauser, and Anton Zeilinger for experiments proving entanglement is real — finally settling the debate Einstein started.'
  },
  many_worlds: {
    what: 'The many-worlds interpretation says the wave function never collapses. Instead, every quantum measurement causes the universe to branch into parallel worlds — one for each possible outcome.',
    whyItMatters: 'It\'s one of the leading interpretations of quantum mechanics, eliminating the measurement problem entirely. If true, there are astronomically many parallel universes.',
    weirdPart: 'In the many-worlds view, there\'s a universe where every quantum event went differently. Somewhere, there\'s a version of you who chose differently at every moment of your life.',
    history: 'Proposed by Hugh Everett III in his 1957 PhD thesis. Initially ignored, it gained support from physicists like Bryce DeWitt and David Deutsch.',
    funFact: 'Everett\'s thesis advisor was John Wheeler (who coined "black hole"). Wheeler initially supported the idea, then backed away. Everett left physics, feeling his work was ignored, and became a defense contractor.'
  },
  quantum_eraser: {
    what: 'The quantum eraser experiment shows that if you detect which path a particle takes in a double-slit experiment, the interference pattern disappears — but if you then ERASE that "which-path" information, the interference pattern comes back.',
    whyItMatters: 'It demonstrates that it\'s the INFORMATION about the particle\'s path, not the physical disturbance, that determines whether interference occurs. Information is fundamental.',
    weirdPart: 'In the "delayed choice quantum eraser," the decision to erase or keep information can be made AFTER the particle hits the detector. It appears as if the future affects the past.',
    history: 'Proposed by Scully and Drühl in 1982. The delayed-choice version was experimentally demonstrated by Kim et al. in 2000.',
    funFact: 'The delayed choice quantum eraser doesn\'t actually violate causality — the interference pattern is only visible when you compare data subsets. But it still bends your mind trying to understand it.'
  },
  schrodinger_equation: {
    what: 'The Schrödinger equation (iℏ ∂Ψ/∂t = ĤΨ) is the fundamental equation of quantum mechanics. It describes how the wave function of a quantum system evolves over time.',
    whyItMatters: 'All of non-relativistic quantum mechanics follows from this single equation. It\'s to quantum mechanics what F=ma is to classical mechanics.',
    weirdPart: 'Schrödinger derived his equation partly by analogy with optics, not from first principles. He was trying to create a wave equation for matter, inspired by de Broglie\'s hypothesis.',
    history: 'Published by Erwin Schrödinger in 1926, earning him the Nobel Prize in 1933. He reportedly derived it during a vacation in the Swiss Alps.',
    funFact: 'Schrödinger didn\'t believe in the probabilistic interpretation of his own equation. He preferred to think of the wave function as physically real, and spent years arguing against Born\'s probability interpretation.'
  },
  epr_paradox: {
    what: 'The EPR paradox (Einstein-Podolsky-Rosen, 1935) argued that if quantum mechanics is complete, then measuring one particle could instantly affect a distant particle, violating locality. Therefore, QM must be incomplete.',
    whyItMatters: 'EPR launched the debate about quantum foundations that led to Bell\'s theorem, entanglement experiments, and quantum information science. It\'s one of the most influential physics papers ever.',
    weirdPart: 'Einstein turned out to be wrong — quantum mechanics IS non-local (in a specific sense). But information still can\'t travel faster than light, so causality is preserved. Nature found a loophole.',
    history: 'Published in 1935. Bell\'s theorem (1964) showed EPR\'s "hidden variables" assumption led to testable predictions. Aspect\'s experiments (1982) confirmed quantum mechanics.',
    funFact: 'Bohr reportedly spent weeks crafting his response to EPR, which was famously difficult to understand. When asked if he could express Bohr\'s argument more clearly, Bohr replied "No, I don\'t think I can."'
  },
  planck_constant: {
    what: 'Planck\'s constant (h = 6.626 × 10⁻³⁴ J·s) is the fundamental constant that sets the scale of quantum effects. The reduced Planck constant ℏ = h/2π appears in virtually every quantum equation.',
    whyItMatters: 'Planck\'s constant is the boundary between quantum and classical physics. If h were zero, quantum mechanics would reduce to classical mechanics. Its tiny value is why we don\'t see quantum effects in daily life.',
    weirdPart: 'Since 2019, the kilogram is DEFINED using Planck\'s constant (via the Kibble balance). The most fundamental constant of quantum mechanics now defines our unit of mass.',
    history: 'Introduced by Max Planck in 1900 to solve the blackbody radiation problem. He initially called it "an act of desperation" — a mathematical trick that turned out to be the key to reality.',
    funFact: 'Planck was 42 when he introduced h, going against the maxim that physics breakthroughs come from young scientists. He won the Nobel Prize in 1918 for this discovery.'
  },
  cat_state: {
    what: 'A "cat state" in quantum physics is a real superposition of two macroscopically distinct states — named after Schrödinger\'s cat. It\'s the largest superposition scientists can create.',
    whyItMatters: 'Creating larger and larger cat states pushes the boundary of quantum mechanics and tests whether there\'s a limit to superposition — the so-called "quantum-to-classical transition."',
    weirdPart: 'Scientists have created cat states with photons, atoms, and even small mechanical oscillators. The question is: how big can a cat state get before decoherence kills it?',
    history: 'First created with photons by Serge Haroche\'s group in the 1990s (Nobel Prize 2012). Progressively larger cat states continue to be created.',
    funFact: 'The largest "cat state" to date involves about 100 photons in a microwave cavity. Scientists dream of creating cat states with biological molecules — maybe even viruses — to test the limits of quantum mechanics.'
  }
};
