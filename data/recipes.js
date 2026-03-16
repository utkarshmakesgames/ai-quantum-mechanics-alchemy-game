// Quantum Forge v2.2 — Combination Recipes (Physics-Corrected)
// Each recipe: { inputs: [id, id, ...], output: id | [id, id, ...] }
// Supports 2-input and 3-input recipes.
// Multi-output: output can be an array when a reaction produces multiple products.
//
// CONSUMPTION RULES (handled in game.js based on element properties):
// - Fundamental particles (starters): NEVER consumed — infinite supply
// - Concepts/phenomena/forces: NEVER consumed — knowledge persists
// - Everything else (composites, atoms): consumed, tracked by stock count

const RECIPES = [
  // ================================================================
  // ERA 1: FIRST DISCOVERIES — The Strong Force
  // ================================================================

  // Proton: uud — 3-quark assembly (no diquarks!)
  { inputs: ['up_quark', 'up_quark', 'down_quark'], output: 'proton' },

  // Neutron: udd — 3-quark assembly
  { inputs: ['up_quark', 'down_quark', 'down_quark'], output: 'neutron' },

  // ================================================================
  // ERA 2: COMPOSITE PARTICLES
  // ================================================================

  // Hydrogen: simplest atom
  { inputs: ['proton', 'electron'], output: 'hydrogen' },

  // Pair production: γγ → e⁺e⁻ (both products granted)
  { inputs: ['photon', 'photon'], output: ['electron', 'positron'] },

  // Antiproton
  { inputs: ['proton', 'energy'], output: 'antiproton' },

  // Quark-antiquark pair (meson building block)
  { inputs: ['up_quark', 'energy'], output: 'quark_antiquark' },

  // Pion (meson)
  { inputs: ['quark_antiquark', 'gluon'], output: 'pion' },
  { inputs: ['quark_antiquark', 'energy'], output: 'pion' },

  // Muon
  { inputs: ['electron', 'neutrino'], output: 'muon' },
  { inputs: ['pion', 'neutrino'], output: 'muon' },

  // Tau
  { inputs: ['muon', 'energy'], output: 'tau' },

  // W Boson (weak force carrier — produced via weak interactions)
  { inputs: ['neutrino', 'energy'], output: 'w_boson' },
  { inputs: ['weak_force', 'energy'], output: 'w_boson' },

  // Z Boson
  { inputs: ['w_boson', 'photon'], output: 'z_boson' },
  { inputs: ['neutrino', 'neutrino'], output: 'z_boson' },

  // Higgs Boson (produced via gluon-gluon fusion at LHC)
  { inputs: ['gluon', 'gluon'], output: 'higgs_boson' },
  { inputs: ['energy', 'energy'], output: 'higgs_boson' },

  // Deuteron (proton + neutron nucleus)
  { inputs: ['proton', 'neutron'], output: 'deuteron' },

  // Deuterium (deuteron + electron)
  { inputs: ['deuteron', 'electron'], output: 'deuterium' },
  { inputs: ['hydrogen', 'neutron'], output: 'deuterium' },

  // Annihilation: e⁺e⁻ → 2γ (produces photons + the concept)
  { inputs: ['electron', 'positron'], output: ['annihilation', 'photon'] },
  { inputs: ['proton', 'antiproton'], output: ['annihilation', 'photon'] },

  // Antimatter
  { inputs: ['positron', 'antiproton'], output: 'antimatter' },
  { inputs: ['annihilation', 'energy'], output: 'antimatter' },

  // Beta decay: n → p + e⁻ + ν̄ₑ (mediated by weak force)
  { inputs: ['neutron', 'weak_force'], output: ['beta_decay', 'proton', 'electron'] },
  { inputs: ['neutron', 'neutrino'], output: ['beta_decay', 'proton', 'electron'] },

  // Strong Force
  { inputs: ['gluon', 'gluon'], output: 'strong_force' },
  { inputs: ['proton', 'gluon'], output: 'strong_force' },

  // Weak Force
  { inputs: ['neutrino', 'electron'], output: 'weak_force' },
  { inputs: ['beta_decay', 'neutrino'], output: 'weak_force' },

  // Electromagnetic Force
  { inputs: ['photon', 'electron'], output: 'electromagnetic_force' },
  { inputs: ['photon', 'energy'], output: 'electromagnetic_force' },

  // ================================================================
  // ERA 3: ATOMS & NUCLEAR PHYSICS
  // ================================================================

  // Helium
  { inputs: ['hydrogen', 'hydrogen'], output: 'helium' },
  { inputs: ['deuterium', 'deuterium'], output: 'helium' },
  { inputs: ['alpha_particle', 'electron'], output: 'helium' },

  // Lithium
  { inputs: ['helium', 'hydrogen'], output: 'lithium' },
  { inputs: ['helium', 'proton'], output: 'lithium' },

  // Carbon (triple-alpha simplified)
  { inputs: ['helium', 'helium'], output: 'carbon' },
  { inputs: ['lithium', 'lithium'], output: 'carbon' },

  // Nitrogen
  { inputs: ['carbon', 'hydrogen'], output: 'nitrogen' },
  { inputs: ['carbon', 'proton'], output: 'nitrogen' },

  // Oxygen
  { inputs: ['carbon', 'helium'], output: 'oxygen' },
  { inputs: ['nitrogen', 'hydrogen'], output: 'oxygen' },

  // Iron (end of fusion chain)
  { inputs: ['oxygen', 'oxygen'], output: 'iron' },
  { inputs: ['carbon', 'carbon'], output: 'iron' },

  // Uranium (neutron capture on iron — simplified r-process)
  { inputs: ['iron', 'neutron'], output: 'uranium' },
  { inputs: ['iron', 'strong_force'], output: 'uranium' },

  // Atomic Nucleus
  { inputs: ['proton', 'proton'], output: 'nucleus' },
  { inputs: ['strong_force', 'proton'], output: 'nucleus' },

  // Alpha Particle
  { inputs: ['nucleus', 'helium'], output: 'alpha_particle' },
  { inputs: ['helium', 'strong_force'], output: 'alpha_particle' },

  // Nuclear Fusion
  { inputs: ['hydrogen', 'energy'], output: 'nuclear_fusion' },
  { inputs: ['helium', 'energy'], output: 'nuclear_fusion' },
  { inputs: ['deuterium', 'energy'], output: 'nuclear_fusion' },

  // Nuclear Fission: U + n → fission products + neutrons (chain reaction)
  { inputs: ['uranium', 'neutron'], output: ['nuclear_fission', 'neutron', 'energy'] },
  { inputs: ['nucleus', 'neutron'], output: ['nuclear_fission', 'neutron'] },

  // Radioactivity
  { inputs: ['nucleus', 'energy'], output: 'radioactivity' },
  { inputs: ['beta_decay', 'alpha_particle'], output: 'radioactivity' },
  { inputs: ['uranium', 'energy'], output: 'radioactivity' },

  // Isotope
  { inputs: ['deuterium', 'hydrogen'], output: 'isotope' },
  { inputs: ['nucleus', 'alpha_particle'], output: 'isotope' },

  // Electron Shell
  { inputs: ['electron', 'nucleus'], output: 'electron_shell' },
  { inputs: ['electron', 'hydrogen'], output: 'electron_shell' },

  // Spectral Lines
  { inputs: ['electron_shell', 'photon'], output: 'spectral_line' },
  { inputs: ['photon_emission', 'hydrogen'], output: 'spectral_line' },

  // Photon Emission
  { inputs: ['electron_shell', 'energy'], output: 'photon_emission' },
  { inputs: ['electron_shell', 'photon'], output: 'photon_emission' },

  // Chemical Bond
  { inputs: ['electron', 'electron'], output: 'chemical_bond' },
  { inputs: ['electron', 'hydrogen'], output: 'chemical_bond' },

  // Water
  { inputs: ['hydrogen', 'oxygen'], output: 'water' },
  { inputs: ['chemical_bond', 'oxygen'], output: 'water' },

  // Gravity
  { inputs: ['mass', 'mass'], output: 'gravity' },
  { inputs: ['iron', 'iron'], output: 'gravity' },

  // Mass (Higgs mechanism gives mass to particles)
  { inputs: ['higgs_boson', 'electron'], output: 'mass' },
  { inputs: ['higgs_boson', 'proton'], output: 'mass' },
  { inputs: ['strong_force', 'gluon'], output: 'mass' },

  // ================================================================
  // ERA 4: QUANTUM PHENOMENA
  // ================================================================

  // Double Slit Experiment
  { inputs: ['photon', 'energy_barrier'], output: 'double_slit' },
  { inputs: ['electron', 'energy_barrier'], output: 'double_slit' },
  { inputs: ['wave_particle_duality', 'photon'], output: 'double_slit' },

  // Wave-Particle Duality
  { inputs: ['double_slit', 'measurement'], output: 'wave_particle_duality' },
  { inputs: ['photon', 'momentum'], output: 'wave_particle_duality' },
  { inputs: ['electron', 'wave_function'], output: 'wave_particle_duality' },

  // Superposition
  { inputs: ['wave_function', 'double_slit'], output: 'superposition' },
  { inputs: ['electron', 'double_slit'], output: 'superposition' },

  // Measurement
  { inputs: ['superposition', 'photon'], output: 'measurement' },
  { inputs: ['wave_function', 'photon'], output: 'measurement' },
  { inputs: ['double_slit', 'photon'], output: 'measurement' },

  // Entanglement
  { inputs: ['superposition', 'superposition'], output: 'entanglement' },
  { inputs: ['measurement', 'superposition'], output: 'entanglement' },
  { inputs: ['quantum_spin', 'quantum_spin'], output: 'entanglement' },

  // Energy Barrier
  { inputs: ['electromagnetic_force', 'nucleus'], output: 'energy_barrier' },
  { inputs: ['energy', 'strong_force'], output: 'energy_barrier' },

  // Quantum Tunneling
  { inputs: ['wave_function', 'energy_barrier'], output: 'quantum_tunneling' },
  { inputs: ['alpha_particle', 'energy_barrier'], output: 'quantum_tunneling' },
  { inputs: ['probability_cloud', 'energy_barrier'], output: 'quantum_tunneling' },

  // Momentum
  { inputs: ['mass', 'photon'], output: 'momentum' },
  { inputs: ['photon', 'wave_function'], output: 'momentum' },

  // Position
  { inputs: ['electron', 'measurement'], output: 'position' },
  { inputs: ['wave_function', 'probability_cloud'], output: 'position' },

  // Uncertainty Principle
  { inputs: ['momentum', 'position'], output: 'uncertainty_principle' },
  { inputs: ['measurement', 'momentum'], output: 'uncertainty_principle' },

  // Schrodinger's Cat
  { inputs: ['superposition', 'radioactivity'], output: 'schrodinger_cat' },
  { inputs: ['decoherence', 'superposition'], output: 'schrodinger_cat' },

  // Decoherence
  { inputs: ['superposition', 'energy'], output: 'decoherence' },
  { inputs: ['schrodinger_cat', 'measurement'], output: 'decoherence' },

  // Photoelectric Effect
  { inputs: ['photon', 'iron'], output: 'photoelectric_effect' },
  { inputs: ['electromagnetic_force', 'iron'], output: 'photoelectric_effect' },

  // Blackbody Radiation
  { inputs: ['photon', 'energy'], output: 'blackbody_radiation' },
  { inputs: ['energy', 'iron'], output: 'blackbody_radiation' },

  // Compton Scattering
  { inputs: ['photon', 'electron'], output: 'compton_scattering' },
  { inputs: ['electromagnetic_force', 'electron'], output: 'compton_scattering' },

  // Quantum Spin
  { inputs: ['electron', 'momentum'], output: 'quantum_spin' },
  { inputs: ['electron', 'quantum_numbers'], output: 'quantum_spin' },

  // Pauli Exclusion Principle
  { inputs: ['quantum_spin', 'electron_shell'], output: 'pauli_exclusion' },
  { inputs: ['quantum_spin', 'quantum_spin'], output: 'pauli_exclusion' },
  { inputs: ['electron_pair', 'quantum_numbers'], output: 'pauli_exclusion' },
  { inputs: ['quantum_spin', 'electron'], output: 'pauli_exclusion' },

  // Quantum Numbers
  { inputs: ['electron_shell', 'quantum_spin'], output: 'quantum_numbers' },
  { inputs: ['electron_shell', 'momentum'], output: 'quantum_numbers' },

  // Wave Function
  { inputs: ['probability_cloud', 'energy'], output: 'wave_function' },
  { inputs: ['electron', 'superposition'], output: 'wave_function' },
  { inputs: ['electron_shell', 'momentum'], output: 'wave_function' },

  // Probability Cloud
  { inputs: ['electron', 'electron_shell'], output: 'probability_cloud' },
  { inputs: ['electron_shell', 'uncertainty_principle'], output: 'probability_cloud' },

  // Quantum Leap
  { inputs: ['electron_shell', 'photon_emission'], output: 'quantum_leap' },
  { inputs: ['photon', 'electron_shell'], output: 'quantum_leap' },

  // Zero-Point Energy
  { inputs: ['uncertainty_principle', 'energy'], output: 'zero_point_energy' },
  { inputs: ['absolute_zero', 'energy'], output: 'zero_point_energy' },

  // Quantum Fluctuation
  { inputs: ['zero_point_energy', 'energy'], output: 'quantum_fluctuation' },
  { inputs: ['uncertainty_principle', 'photon'], output: 'quantum_fluctuation' },

  // Stimulated Emission
  { inputs: ['photon', 'photon_emission'], output: 'stimulated_emission' },
  { inputs: ['photon_emission', 'energy'], output: 'stimulated_emission' },

  // ================================================================
  // ERA 5: ADVANCED & APPLIED
  // ================================================================

  // Qubit
  { inputs: ['superposition', 'measurement'], output: 'qubit' },
  { inputs: ['superposition', 'electron_shell'], output: 'qubit' },

  // Logic Gate
  { inputs: ['qubit', 'qubit'], output: 'logic_gate' },
  { inputs: ['qubit', 'measurement'], output: 'logic_gate' },

  // Quantum Computer
  { inputs: ['qubit', 'logic_gate'], output: 'quantum_computer' },
  { inputs: ['qubit', 'entanglement'], output: 'quantum_computer' },

  // Quantum Cryptography
  { inputs: ['entanglement', 'photon'], output: 'quantum_cryptography' },
  { inputs: ['qubit', 'entanglement'], output: 'quantum_cryptography' },

  // Quantum Teleportation
  { inputs: ['entanglement', 'measurement'], output: 'quantum_teleportation' },
  { inputs: ['entanglement', 'qubit'], output: 'quantum_teleportation' },

  // Bose-Einstein Condensate
  { inputs: ['absolute_zero', 'helium'], output: 'bose_einstein_condensate' },
  { inputs: ['absolute_zero', 'hydrogen'], output: 'bose_einstein_condensate' },

  // Absolute Zero
  { inputs: ['energy', 'zero_point_energy'], output: 'absolute_zero' },
  { inputs: ['decoherence', 'energy'], output: 'absolute_zero' },

  // Cooper Pair
  { inputs: ['electron', 'absolute_zero'], output: 'cooper_pair' },
  { inputs: ['electron_pair', 'absolute_zero'], output: 'cooper_pair' },

  // Electron Pair
  { inputs: ['electron', 'chemical_bond'], output: 'electron_pair' },
  { inputs: ['quantum_spin', 'electron'], output: 'electron_pair' },

  // Superconductor
  { inputs: ['cooper_pair', 'iron'], output: 'superconductor' },
  { inputs: ['cooper_pair', 'energy'], output: 'superconductor' },
  { inputs: ['absolute_zero', 'iron'], output: 'superconductor' },

  // Laser
  { inputs: ['stimulated_emission', 'photon'], output: 'laser' },
  { inputs: ['stimulated_emission', 'energy'], output: 'laser' },
  { inputs: ['photon_emission', 'photon_emission'], output: 'laser' },

  // Semiconductor
  { inputs: ['band_theory', 'carbon'], output: 'semiconductor' },
  { inputs: ['quantum_tunneling', 'chemical_bond'], output: 'semiconductor' },
  { inputs: ['band_theory', 'electron'], output: 'semiconductor' },

  // Band Theory
  { inputs: ['pauli_exclusion', 'chemical_bond'], output: 'band_theory' },
  { inputs: ['quantum_numbers', 'chemical_bond'], output: 'band_theory' },
  { inputs: ['electron_shell', 'pauli_exclusion'], output: 'band_theory' },

  // Transistor
  { inputs: ['semiconductor', 'electron'], output: 'transistor' },
  { inputs: ['semiconductor', 'quantum_tunneling'], output: 'transistor' },

  // LED
  { inputs: ['semiconductor', 'photon_emission'], output: 'led' },
  { inputs: ['semiconductor', 'photon'], output: 'led' },

  // MRI
  { inputs: ['quantum_spin', 'hydrogen'], output: 'mri' },
  { inputs: ['quantum_spin', 'electromagnetic_force'], output: 'mri' },

  // Quantum Field Theory
  { inputs: ['wave_function', 'electromagnetic_force'], output: 'quantum_field_theory' },
  { inputs: ['quantum_fluctuation', 'electromagnetic_force'], output: 'quantum_field_theory' },

  // Standard Model
  { inputs: ['strong_force', 'electromagnetic_force'], output: 'standard_model' },
  { inputs: ['quantum_field_theory', 'higgs_boson'], output: 'standard_model' },
  { inputs: ['w_boson', 'strong_force'], output: 'standard_model' },

  // Black Hole
  { inputs: ['gravity', 'iron'], output: 'black_hole' },
  { inputs: ['gravity', 'nuclear_fusion'], output: 'black_hole' },

  // Hawking Radiation
  { inputs: ['black_hole', 'quantum_fluctuation'], output: 'hawking_radiation' },
  { inputs: ['black_hole', 'entanglement'], output: 'hawking_radiation' },

  // Quantum Gravity
  { inputs: ['gravity', 'quantum_field_theory'], output: 'quantum_gravity' },
  { inputs: ['gravity', 'superposition'], output: 'quantum_gravity' },
  { inputs: ['black_hole', 'quantum_field_theory'], output: 'quantum_gravity' },

  // Nuclear Reactor
  { inputs: ['nuclear_fission', 'energy'], output: 'nuclear_reactor' },
  { inputs: ['nuclear_fission', 'water'], output: 'nuclear_reactor' },
  { inputs: ['uranium', 'nuclear_fission'], output: 'nuclear_reactor' },

  // Solar Cell
  { inputs: ['photoelectric_effect', 'semiconductor'], output: 'solar_cell' },
  { inputs: ['photoelectric_effect', 'energy'], output: 'solar_cell' },

  // Quantum Dot
  { inputs: ['semiconductor', 'quantum_numbers'], output: 'quantum_dot' },
  { inputs: ['semiconductor', 'electron_shell'], output: 'quantum_dot' },

  // ================================================================
  // HIDDEN / EASTER EGGS
  // ================================================================

  { inputs: ['higgs_boson', 'energy'], output: 'god_particle' },
  { inputs: ['higgs_boson', 'mass'], output: 'god_particle' },

  { inputs: ['entanglement', 'gravity'], output: 'spooky_action' },
  { inputs: ['entanglement', 'quantum_teleportation'], output: 'spooky_action' },

  { inputs: ['superposition', 'decoherence'], output: 'many_worlds' },
  { inputs: ['schrodinger_cat', 'superposition'], output: 'many_worlds' },

  { inputs: ['double_slit', 'entanglement'], output: 'quantum_eraser' },
  { inputs: ['measurement', 'entanglement'], output: 'quantum_eraser' },

  { inputs: ['wave_function', 'energy'], output: 'schrodinger_equation' },
  { inputs: ['wave_function', 'momentum'], output: 'schrodinger_equation' },

  { inputs: ['entanglement', 'uncertainty_principle'], output: 'epr_paradox' },
  { inputs: ['entanglement', 'position'], output: 'epr_paradox' },

  { inputs: ['blackbody_radiation', 'energy'], output: 'planck_constant' },
  { inputs: ['photoelectric_effect', 'energy'], output: 'planck_constant' },

  { inputs: ['schrodinger_cat', 'qubit'], output: 'cat_state' },
  { inputs: ['schrodinger_cat', 'entanglement'], output: 'cat_state' },
];

// Build a lookup map for fast recipe checking
// Key: sorted inputs joined by "|", Value: result id
const RECIPE_MAP = new Map();
// Also track all recipes that produce each element (for hint system)
const RECIPES_BY_OUTPUT = {};
// Track all recipes for each input (for discovery hints)
const RECIPES_BY_INPUT = {};

for (const recipe of RECIPES) {
  const key = [...recipe.inputs].sort().join('|');
  // Normalize output to array for consistent handling
  const outputs = Array.isArray(recipe.output) ? recipe.output : [recipe.output];

  // First recipe wins if duplicate keys
  if (!RECIPE_MAP.has(key)) {
    RECIPE_MAP.set(key, recipe.output);
  }

  // Track by output — index each product
  for (const out of outputs) {
    if (!RECIPES_BY_OUTPUT[out]) RECIPES_BY_OUTPUT[out] = [];
    RECIPES_BY_OUTPUT[out].push(recipe.inputs);
  }

  // Track by input — remove only one instance of the input element
  const seenInputs = new Set();
  for (const input of recipe.inputs) {
    if (seenInputs.has(input)) continue; // avoid duplicate entries for same input
    seenInputs.add(input);
    if (!RECIPES_BY_INPUT[input]) RECIPES_BY_INPUT[input] = [];
    // Remove only the first occurrence of this input from the list
    const partners = [...recipe.inputs];
    partners.splice(partners.indexOf(input), 1);
    RECIPES_BY_INPUT[input].push({ partners, result: recipe.output });
  }
}

/**
 * Try to combine elements. Accepts an array of 2 or 3 element IDs.
 * Returns the result: a single element ID (string), an array of IDs
 * (for multi-output reactions like pair production), or null.
 */
function tryCombine(inputs) {
  if (!Array.isArray(inputs)) inputs = [...arguments];
  const key = [...inputs].sort().join('|');
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
 * Returns an array of { partners, result } objects.
 */
function getHintsFor(elementId) {
  return RECIPES_BY_INPUT[elementId] || [];
}
