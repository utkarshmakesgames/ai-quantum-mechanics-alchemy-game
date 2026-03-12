// Quantum Forge v2 — Combination Recipes
// Each recipe: [input1, input2, output]
// Recipes are commutative: [a, b] = [b, a]
//
// CONSUMPTION RULES (handled in game.js based on element properties):
// - Fundamental particles (starters): NEVER consumed — infinite supply
// - Intermediates (isIntermediate: true): ALWAYS consumed on use
// - Concepts/phenomena/forces: NEVER consumed — knowledge persists
// - Everything else (composites, atoms): consumed, tracked by stock count

const RECIPES = [
  // ================================================================
  // ERA 1: FIRST DISCOVERIES — The Strong Force
  // ================================================================

  // Di-quarks: quark pairing intermediates (scientifically: diquark correlations)
  ['up_quark', 'up_quark', 'diquark_uu'],
  ['down_quark', 'down_quark', 'diquark_dd'],
  ['up_quark', 'down_quark', 'diquark_ud'],

  // Energy: discoverable from photons (light IS energy, E=hf)
  ['photon', 'photon', 'energy'],

  // Proton: uud — scientifically accurate two-step assembly
  ['diquark_uu', 'down_quark', 'proton'],

  // Neutron: ddu — scientifically accurate two-step assembly
  ['diquark_dd', 'up_quark', 'neutron'],

  // ================================================================
  // ERA 2: COMPOSITE PARTICLES
  // ================================================================

  // Hydrogen: simplest atom
  ['proton', 'electron', 'hydrogen'],

  // Positron (antimatter electron)
  ['electron', 'photon', 'positron'],
  ['electron', 'energy', 'positron'],

  // Antiproton
  ['proton', 'energy', 'antiproton'],

  // Quark-antiquark pair (meson building block)
  ['up_quark', 'positron', 'quark_antiquark'],
  ['diquark_ud', 'energy', 'quark_antiquark'],

  // Pion (meson)
  ['quark_antiquark', 'energy', 'pion'],
  ['proton', 'neutron', 'pion'],

  // Muon
  ['electron', 'neutrino', 'muon'],
  ['pion', 'neutrino', 'muon'],

  // Tau
  ['muon', 'energy', 'tau'],

  // W Boson
  ['neutrino', 'proton', 'w_boson'],
  ['weak_force', 'energy', 'w_boson'],

  // Z Boson
  ['w_boson', 'photon', 'z_boson'],
  ['neutrino', 'neutrino', 'z_boson'],

  // Higgs Boson
  ['mass', 'energy', 'higgs_boson'],
  ['w_boson', 'z_boson', 'higgs_boson'],

  // Deuteron (proton + neutron nucleus)
  ['proton', 'neutron', 'deuteron'],

  // Deuterium (deuteron + electron)
  ['deuteron', 'electron', 'deuterium'],
  ['hydrogen', 'neutron', 'deuterium'],

  // Annihilation
  ['electron', 'positron', 'annihilation'],
  ['proton', 'antiproton', 'annihilation'],

  // Antimatter
  ['positron', 'antiproton', 'antimatter'],
  ['annihilation', 'energy', 'antimatter'],

  // Beta decay
  ['neutron', 'neutrino', 'beta_decay'],
  ['neutron', 'weak_force', 'beta_decay'],

  // Strong Force
  ['gluon', 'gluon', 'strong_force'],
  ['proton', 'gluon', 'strong_force'],

  // Weak Force
  ['neutrino', 'electron', 'weak_force'],
  ['beta_decay', 'neutrino', 'weak_force'],

  // Electromagnetic Force
  ['photon', 'electron', 'electromagnetic_force'],
  ['photon', 'energy', 'electromagnetic_force'],

  // ================================================================
  // ERA 3: ATOMS & NUCLEAR PHYSICS
  // ================================================================

  // Helium (requires rebuilding hydrogen — repetition!)
  ['hydrogen', 'hydrogen', 'helium'],
  ['deuterium', 'deuterium', 'helium'],
  ['alpha_particle', 'electron', 'helium'],

  // Lithium
  ['helium', 'hydrogen', 'lithium'],
  ['helium', 'proton', 'lithium'],

  // Carbon (triple-alpha simplified)
  ['helium', 'helium', 'carbon'],
  ['lithium', 'lithium', 'carbon'],

  // Nitrogen
  ['carbon', 'hydrogen', 'nitrogen'],
  ['carbon', 'proton', 'nitrogen'],

  // Oxygen
  ['carbon', 'helium', 'oxygen'],
  ['nitrogen', 'hydrogen', 'oxygen'],

  // Iron (end of fusion chain)
  ['oxygen', 'oxygen', 'iron'],
  ['carbon', 'carbon', 'iron'],

  // Atomic Nucleus
  ['proton', 'proton', 'nucleus'],
  ['strong_force', 'proton', 'nucleus'],

  // Alpha Particle
  ['nucleus', 'helium', 'alpha_particle'],
  ['helium', 'strong_force', 'alpha_particle'],

  // Nuclear Fusion
  ['hydrogen', 'energy', 'nuclear_fusion'],
  ['helium', 'energy', 'nuclear_fusion'],
  ['deuterium', 'energy', 'nuclear_fusion'],

  // Nuclear Fission
  ['iron', 'neutron', 'nuclear_fission'],
  ['nucleus', 'neutron', 'nuclear_fission'],

  // Radioactivity
  ['nucleus', 'energy', 'radioactivity'],
  ['beta_decay', 'alpha_particle', 'radioactivity'],

  // Isotope
  ['deuterium', 'hydrogen', 'isotope'],
  ['nucleus', 'alpha_particle', 'isotope'],

  // Electron Shell
  ['electron', 'nucleus', 'electron_shell'],
  ['electron', 'hydrogen', 'electron_shell'],

  // Spectral Lines
  ['electron_shell', 'photon', 'spectral_line'],
  ['photon_emission', 'hydrogen', 'spectral_line'],

  // Photon Emission
  ['electron_shell', 'energy', 'photon_emission'],
  ['electron_shell', 'photon', 'photon_emission'],

  // Chemical Bond
  ['electron', 'electron', 'chemical_bond'],
  ['electron', 'hydrogen', 'chemical_bond'],

  // Water
  ['hydrogen', 'oxygen', 'water'],
  ['chemical_bond', 'oxygen', 'water'],

  // Gravity
  ['mass', 'mass', 'gravity'],
  ['iron', 'iron', 'gravity'],

  // Mass
  ['higgs_boson', 'electron', 'mass'],
  ['higgs_boson', 'proton', 'mass'],
  ['strong_force', 'gluon', 'mass'],

  // ================================================================
  // ERA 4: QUANTUM PHENOMENA
  // ================================================================

  // Double Slit Experiment
  ['photon', 'energy_barrier', 'double_slit'],
  ['electron', 'energy_barrier', 'double_slit'],
  ['wave_particle_duality', 'photon', 'double_slit'],

  // Wave-Particle Duality
  ['double_slit', 'measurement', 'wave_particle_duality'],
  ['photon', 'momentum', 'wave_particle_duality'],
  ['electron', 'wave_function', 'wave_particle_duality'],

  // Superposition
  ['wave_function', 'double_slit', 'superposition'],
  ['electron', 'double_slit', 'superposition'],

  // Measurement
  ['superposition', 'photon', 'measurement'],
  ['wave_function', 'photon', 'measurement'],
  ['double_slit', 'photon', 'measurement'],

  // Entanglement
  ['superposition', 'superposition', 'entanglement'],
  ['measurement', 'superposition', 'entanglement'],
  ['quantum_spin', 'quantum_spin', 'entanglement'],

  // Energy Barrier
  ['electromagnetic_force', 'nucleus', 'energy_barrier'],
  ['energy', 'strong_force', 'energy_barrier'],

  // Quantum Tunneling
  ['wave_function', 'energy_barrier', 'quantum_tunneling'],
  ['alpha_particle', 'energy_barrier', 'quantum_tunneling'],
  ['probability_cloud', 'energy_barrier', 'quantum_tunneling'],

  // Momentum
  ['mass', 'photon', 'momentum'],
  ['photon', 'wave_function', 'momentum'],

  // Position
  ['electron', 'measurement', 'position'],
  ['wave_function', 'probability_cloud', 'position'],

  // Uncertainty Principle
  ['momentum', 'position', 'uncertainty_principle'],
  ['measurement', 'momentum', 'uncertainty_principle'],

  // Schrödinger's Cat
  ['superposition', 'radioactivity', 'schrodinger_cat'],
  ['decoherence', 'superposition', 'schrodinger_cat'],

  // Decoherence
  ['superposition', 'energy', 'decoherence'],
  ['schrodinger_cat', 'measurement', 'decoherence'],

  // Photoelectric Effect
  ['photon', 'iron', 'photoelectric_effect'],
  ['electromagnetic_force', 'iron', 'photoelectric_effect'],

  // Blackbody Radiation
  ['photon', 'energy', 'blackbody_radiation'],
  ['energy', 'iron', 'blackbody_radiation'],

  // Compton Scattering
  ['photon', 'electron', 'compton_scattering'],
  ['electromagnetic_force', 'electron', 'compton_scattering'],

  // Quantum Spin
  ['electron', 'momentum', 'quantum_spin'],
  ['electron', 'quantum_numbers', 'quantum_spin'],

  // Pauli Exclusion Principle
  ['quantum_spin', 'electron_shell', 'pauli_exclusion'],
  ['quantum_spin', 'quantum_spin', 'pauli_exclusion'],
  ['electron_pair', 'quantum_numbers', 'pauli_exclusion'],

  // Quantum Numbers
  ['electron_shell', 'quantum_spin', 'quantum_numbers'],
  ['electron_shell', 'momentum', 'quantum_numbers'],

  // Wave Function
  ['probability_cloud', 'energy', 'wave_function'],
  ['electron', 'superposition', 'wave_function'],
  ['electron_shell', 'momentum', 'wave_function'],

  // Probability Cloud
  ['electron', 'electron_shell', 'probability_cloud'],
  ['electron_shell', 'uncertainty_principle', 'probability_cloud'],

  // Quantum Leap
  ['electron_shell', 'photon_emission', 'quantum_leap'],
  ['photon', 'electron_shell', 'quantum_leap'],

  // Zero-Point Energy
  ['uncertainty_principle', 'energy', 'zero_point_energy'],
  ['absolute_zero', 'energy', 'zero_point_energy'],

  // Quantum Fluctuation
  ['zero_point_energy', 'energy', 'quantum_fluctuation'],
  ['uncertainty_principle', 'photon', 'quantum_fluctuation'],

  // Stimulated Emission
  ['photon', 'photon_emission', 'stimulated_emission'],
  ['photon_emission', 'energy', 'stimulated_emission'],

  // ================================================================
  // ERA 5: ADVANCED & APPLIED
  // ================================================================

  // Qubit
  ['superposition', 'measurement', 'qubit'],
  ['superposition', 'electron_shell', 'qubit'],

  // Logic Gate
  ['qubit', 'qubit', 'logic_gate'],
  ['qubit', 'measurement', 'logic_gate'],

  // Quantum Computer
  ['qubit', 'logic_gate', 'quantum_computer'],
  ['qubit', 'entanglement', 'quantum_computer'],

  // Quantum Cryptography
  ['entanglement', 'photon', 'quantum_cryptography'],
  ['qubit', 'entanglement', 'quantum_cryptography'],

  // Quantum Teleportation
  ['entanglement', 'measurement', 'quantum_teleportation'],
  ['entanglement', 'qubit', 'quantum_teleportation'],

  // Bose-Einstein Condensate
  ['absolute_zero', 'helium', 'bose_einstein_condensate'],
  ['absolute_zero', 'hydrogen', 'bose_einstein_condensate'],

  // Absolute Zero
  ['energy', 'zero_point_energy', 'absolute_zero'],
  ['decoherence', 'energy', 'absolute_zero'],

  // Cooper Pair
  ['electron', 'absolute_zero', 'cooper_pair'],
  ['electron_pair', 'absolute_zero', 'cooper_pair'],

  // Electron Pair
  ['electron', 'chemical_bond', 'electron_pair'],
  ['quantum_spin', 'electron', 'electron_pair'],

  // Superconductor
  ['cooper_pair', 'iron', 'superconductor'],
  ['cooper_pair', 'energy', 'superconductor'],
  ['absolute_zero', 'iron', 'superconductor'],

  // Laser
  ['stimulated_emission', 'photon', 'laser'],
  ['stimulated_emission', 'energy', 'laser'],
  ['photon_emission', 'photon_emission', 'laser'],

  // Semiconductor
  ['band_theory', 'carbon', 'semiconductor'],
  ['quantum_tunneling', 'chemical_bond', 'semiconductor'],
  ['band_theory', 'electron', 'semiconductor'],

  // Band Theory
  ['pauli_exclusion', 'chemical_bond', 'band_theory'],
  ['quantum_numbers', 'chemical_bond', 'band_theory'],
  ['electron_shell', 'pauli_exclusion', 'band_theory'],

  // Transistor
  ['semiconductor', 'electron', 'transistor'],
  ['semiconductor', 'quantum_tunneling', 'transistor'],

  // LED
  ['semiconductor', 'photon_emission', 'led'],
  ['semiconductor', 'photon', 'led'],

  // MRI
  ['quantum_spin', 'hydrogen', 'mri'],
  ['quantum_spin', 'electromagnetic_force', 'mri'],

  // Quantum Field Theory
  ['wave_function', 'electromagnetic_force', 'quantum_field_theory'],
  ['quantum_fluctuation', 'electromagnetic_force', 'quantum_field_theory'],

  // Standard Model
  ['strong_force', 'electromagnetic_force', 'standard_model'],
  ['quantum_field_theory', 'higgs_boson', 'standard_model'],
  ['w_boson', 'strong_force', 'standard_model'],

  // Black Hole
  ['gravity', 'iron', 'black_hole'],
  ['gravity', 'nuclear_fusion', 'black_hole'],

  // Hawking Radiation
  ['black_hole', 'quantum_fluctuation', 'hawking_radiation'],
  ['black_hole', 'entanglement', 'hawking_radiation'],

  // Quantum Gravity
  ['gravity', 'quantum_field_theory', 'quantum_gravity'],
  ['gravity', 'superposition', 'quantum_gravity'],
  ['black_hole', 'quantum_field_theory', 'quantum_gravity'],

  // Nuclear Reactor
  ['nuclear_fission', 'energy', 'nuclear_reactor'],
  ['nuclear_fission', 'water', 'nuclear_reactor'],

  // Solar Cell
  ['photoelectric_effect', 'semiconductor', 'solar_cell'],
  ['photoelectric_effect', 'energy', 'solar_cell'],

  // Quantum Dot
  ['semiconductor', 'quantum_numbers', 'quantum_dot'],
  ['semiconductor', 'electron_shell', 'quantum_dot'],

  // ================================================================
  // HIDDEN / EASTER EGGS
  // ================================================================

  ['higgs_boson', 'energy', 'god_particle'],
  ['higgs_boson', 'mass', 'god_particle'],

  ['entanglement', 'gravity', 'spooky_action'],
  ['entanglement', 'quantum_teleportation', 'spooky_action'],

  ['superposition', 'decoherence', 'many_worlds'],
  ['schrodinger_cat', 'superposition', 'many_worlds'],

  ['double_slit', 'entanglement', 'quantum_eraser'],
  ['measurement', 'entanglement', 'quantum_eraser'],

  ['wave_function', 'energy', 'schrodinger_equation'],
  ['wave_function', 'momentum', 'schrodinger_equation'],

  ['entanglement', 'uncertainty_principle', 'epr_paradox'],
  ['entanglement', 'position', 'epr_paradox'],

  ['blackbody_radiation', 'energy', 'planck_constant'],
  ['photoelectric_effect', 'energy', 'planck_constant'],

  ['schrodinger_cat', 'qubit', 'cat_state'],
  ['schrodinger_cat', 'entanglement', 'cat_state'],
];

// Build a lookup map for fast recipe checking
// Key: sorted pair "id1|id2", Value: result id
const RECIPE_MAP = new Map();
// Also track all recipes that produce each element (for hint system)
const RECIPES_BY_OUTPUT = {};
// Track all recipes for each input (for discovery hints)
const RECIPES_BY_INPUT = {};

for (const [input1, input2, output] of RECIPES) {
  const key = [input1, input2].sort().join('|');
  // First recipe wins if duplicate keys
  if (!RECIPE_MAP.has(key)) {
    RECIPE_MAP.set(key, output);
  }

  // Track by output
  if (!RECIPES_BY_OUTPUT[output]) RECIPES_BY_OUTPUT[output] = [];
  RECIPES_BY_OUTPUT[output].push([input1, input2]);

  // Track by input
  if (!RECIPES_BY_INPUT[input1]) RECIPES_BY_INPUT[input1] = [];
  RECIPES_BY_INPUT[input1].push({ partner: input2, result: output });
  if (!RECIPES_BY_INPUT[input2]) RECIPES_BY_INPUT[input2] = [];
  RECIPES_BY_INPUT[input2].push({ partner: input1, result: output });
}

/**
 * Try to combine two elements. Returns the result element ID or null.
 */
function tryCombine(id1, id2) {
  const key = [id1, id2].sort().join('|');
  return RECIPE_MAP.get(key) || null;
}

/**
 * Get all recipes that produce a given element.
 */
function getRecipesFor(elementId) {
  return RECIPES_BY_OUTPUT[elementId] || [];
}

/**
 * Get a hint for what an element can combine with.
 * Returns an array of { partner, result } objects.
 */
function getHintsFor(elementId) {
  return RECIPES_BY_INPUT[elementId] || [];
}
