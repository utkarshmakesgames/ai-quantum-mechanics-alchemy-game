# Branch B Playtest Report — Universe Timeline (v2-redesign)

**Date:** 2026-03-12
**Branch:** v2-redesign
**Method:** Deep code-level analysis (browser automation agents failed to access Chrome MCP tools; code review revealed critical integration bugs that would be invisible from surface-level play)
**Coverage:** Full analysis of all 9 source files, all 8 eras, sandbox mode, save/load, audio, particles

---

## Summary

Universe Timeline is an ambitious redesign with a genuinely excellent concept — guiding the universe from the Big Bang through 8 eras using interactive dials and multiple-choice questions. The physics content in eras.js is outstanding, and the architecture (modular IIFE pattern, clean separation of concerns) is well-designed. **However, the game is currently non-functional due to critical data/engine mismatches.** The eras.js data structure uses different field names than timeline.js expects (e.g., `discoveries` vs `thresholds`, `questions` vs `choices`, `intro` vs `description`), and the dials object isn't iterable with `for...of`. Both dial eras and choice eras fail silently or crash. Once these integration bugs are fixed, this could be the superior version.

---

## Scores (1-10)

- **Fun:** 3 (game is non-functional — scoring concept/potential only)
- **Physics Accuracy:** 9 (era content, questions, explanations are excellent)
- **Educational Value:** 9 (great pedagogical design — if it worked)
- **Progression Clarity:** 7 (era map + discovery checklist is clear)
- **Engagement:** 2 (cannot play past title screen meaningfully)
- **UI/UX:** 7 (CSS/HTML is polished, layout is well-designed)

---

## CRITICAL: Data/Engine Integration Failure

The entire game is broken because `eras.js` and `timeline.js` were written with different data contracts. This is the #1 issue that must be fixed before anything else matters.

### Field Name Mismatches

| eras.js uses | timeline.js expects | Location | Impact |
|---|---|---|---|
| `time` | `timeAfterBang` | timeline.js:73 | Header shows "undefined" |
| `intro` | `description` | timeline.js:74 | Era description shows "undefined" |
| `discoveries` (array) | `thresholds` (array) | timeline.js:180,321,355 | No dial discoveries ever trigger |
| `questions` (array) | `choices` (array) | timeline.js:212 | Choice eras immediately complete |

### Dial Structure Mismatch

**eras.js** defines dials as an object:
```js
dials: {
  temperature: { label: 'Temperature', unit: 'K', min: 10, max: 15 },
  density: { label: 'Density', unit: 'particles/m³', min: 30, max: 45 },
}
```

**timeline.js** iterates with `for...of`:
```js
for (const dial of currentEra.dials) {  // TypeError: object is not iterable
  dialValues[dial.id] = dial.default;   // dial.id undefined, dial.default undefined
```

**Impact:** Entering any dial era (1, 4, 6, 7) throws `TypeError: currentEra.dials is not iterable` and the function aborts. No sliders render, no particle visualization starts.

### Choice Structure Mismatch

**eras.js** uses:
```js
questions: [{
  text: 'What forms from two Up Quarks and one Down Quark?',
  choices: ['Neutron', 'Proton', 'Pion', 'Electron'],
  correct: 1,
  explanations: { correct: '...', wrong: { 0: '...', 2: '...', 3: '...' } },
  element: 'proton'
}]
```

**timeline.js** expects:
```js
currentEra.choices[i].context    // eras.js has no 'context' field
currentEra.choices[i].question   // eras.js uses 'text'
currentEra.choices[i].options    // eras.js uses 'choices'
currentEra.choices[i].explanation  // eras.js uses 'explanations.correct'
currentEra.choices[i].wrongExplanation  // eras.js uses 'explanations.wrong[i]'
currentEra.choices[i].produces   // eras.js uses 'element'
```

**Impact:** `currentEra.choices` is undefined (the field is `questions`), so `renderCurrentChoice()` immediately shows "Era Complete!" with 0 points. No questions are ever displayed.

### Dial Conditions Scale Mismatch

Even after fixing field names, the dial threshold conditions use log10 exponents:
```js
conditions: { temperature: { max: 12.2 }, density: { min: 37 } }
// Means: temperature ≤ 10^12.2 K, density ≥ 10^37 particles/m³
```

But `checkDialThresholds()` compares against `dialValues` which stores actual values (e.g., `1.58e12`), not log10 values. And it expects conditions as `[min, max]` arrays, not `{min, max}` objects:
```js
for (const [dialId, range] of Object.entries(threshold.conditions)) {
  if (val < range[0] || val > range[1]) {  // range[0] is undefined for {max: 12.2}
```

---

## Detailed Findings

### Story Mode — Dial Eras (1, 4, 6, 7)

**All broken due to the `for...of` TypeError on the dials object.**

If fixed, the eras contain excellent physics content:

**Era 1 (Quark Epoch):** Two discoveries — proton at T < 10^12.2 K and density > 10^37, neutron at T < 10^12 K and density > 10^38. Correct physics: QCD confinement temperature is ~10^12 K. The hints ("Quarks need to slow down... try lowering the temperature") are well-written.

**Era 4 (Nucleosynthesis):** Four discoveries — deuterium, He-3, He-4, lithium-7. Temperature window between 10^8.5 and 10^9.8 K. Correct physics: Big Bang nucleosynthesis window is ~10^9 K. Explains Coulomb barrier and quantum tunneling.

**Era 6 (Stellar Era):** Four discoveries — hydrogen fusion, carbon, oxygen, iron. Progressive temperature/density requirements. Correctly teaches the triple-alpha process and iron as the end of the fusion chain.

**Era 7 (Heavy Elements):** Two discoveries — uranium (r-process) and nuclear fission. Uses "Neutron Flux" instead of density, which is a nice touch for teaching neutron capture processes.

### Story Mode — Choice Eras (2, 3, 5, 8)

**All broken because `currentEra.choices` is undefined (field is `questions`).**

If fixed, the questions are excellent:

**Era 2 (Hadron Epoch):** 3 questions about proton composition (uud), neutron composition (udd), and color confinement. Wrong-answer explanations are specific to each wrong choice — not generic. This is outstanding pedagogy.

**Era 3 (Lepton Epoch):** 2 questions about matter-antimatter annihilation and CP violation. The CP violation explanation is accurate and accessible.

**Era 5 (Recombination):** 3 questions about atom formation at 3000K, CMB decoupling, and hydrogen abundance. Correct physics: recombination at ~380,000 years, photon decoupling → CMB.

**Era 8 (Modern Physics):** 4 questions about lasers (stimulated emission), quantum tunneling (flash memory), quantum computers (superposition), and quantum gravity (GR/QM incompatibility). All accurate.

### Sandbox Mode

**Partially functional but effectively empty.**

The Sandbox forge code (sandbox.js) is well-written and handles:
- 2-slot and 3-slot mode with working toggle
- Element grid grouped by era with search filtering
- Multi-output recipe support
- Discovery tracking

However, Sandbox depends on Story Mode progress (`appState.sandboxDiscovered`). Since Story Mode is broken, the only available elements are the 7 starters (STARTING_ELEMENTS). The sandbox hint correctly warns "Complete Story Mode eras to unlock elements for Sandbox!" when no discoveries exist.

The slot selection logic (lines 119-134) has a minor UX issue: the `selectedSlot` tracking is complex and could confuse users about which slot is "active" after partial fills.

### Positives

1. **Modular architecture** — Clean IIFE pattern with explicit public APIs. Each module (App, Timeline, Sandbox, Particles, Audio) is self-contained.
2. **Physics content quality** — The questions, explanations, and journal entries are genuinely educational. Wrong-answer explanations are specific and teach, not just correct.
3. **Canvas particle visualization** — Well-implemented with Brownian motion, temperature-scaled speed, density-scaled count, type-specific colors/sizes, photon trails, and burst effects.
4. **Audio system** — Web Audio API with procedural sound generation. 8 distinct sound types (discovery, correct, wrong, etc.) with no external dependencies.
5. **Save/load with migration** — State merge handles new fields gracefully: `{ ...defaults, ...saved }`.
6. **Era map navigation** — Clickable era map with locked/current/completed states and prev/next buttons.
7. **Responsive design** — Clean breakpoints at 900px and 600px with appropriate layout shifts.
8. **CSS quality** — Professional dark space theme with CSS variables, consistent design tokens, smooth animations.

### Issues / Bugs

**CRITICAL (Game-Breaking):**

1. **Dials object not iterable** — `for (const dial of currentEra.dials)` throws TypeError. All dial eras (1, 4, 6, 7) are broken.
2. **`thresholds` field doesn't exist** — `currentEra.thresholds` is undefined (eras.js uses `discoveries`). No dial discoveries trigger.
3. **`choices` field doesn't exist** — `currentEra.choices` is undefined (eras.js uses `questions`). All choice eras (2, 3, 5, 8) immediately show "Era Complete!"
4. **`timeAfterBang` and `description` fields don't exist** — Header shows "undefined" text.

**HIGH:**

5. **Dial conditions format mismatch** — Conditions use `{min, max}` objects but code expects `[min, max]` arrays. Even after field rename, thresholds won't work.
6. **Dial values vs conditions scale mismatch** — `dialValues` stores actual values (e.g., 1.58e12) but conditions use log10 exponents (e.g., 12.2). Comparisons would always be wrong.
7. **Choice field name mismatches** — `text` vs `question`, `choices` vs `options`, `explanations.correct` vs `explanation`, `element` vs `produces`.
8. **No `context` field** — timeline.js renders `choice.context` but eras.js questions have no context field. Would show "undefined" in the choice panel.
9. **Wrong explanation handling** — timeline.js expects `choice.wrongExplanation` (single string) but eras.js provides `explanations.wrong` (object keyed by choice index). Players would see "undefined" after wrong answers instead of targeted explanations.

**MEDIUM:**

10. **Dial `name` vs `label`** — timeline.js uses `dial.name` but eras.js uses `label`. Slider labels would show "undefined".
11. **No `default` value on dials** — `dialValues[dial.id] = dial.default` sets undefined. Initial display would show "NaN".
12. **No `id` field on dial objects** — Dial objects are values in an object keyed by id (e.g., `dials.temperature`), but the code tries to read `dial.id`.
13. **Event listener accumulation** — `Timeline.init()` adds click listeners to prev/next era buttons every time Story Mode is entered. After switching modes multiple times, handlers stack up.
14. **Particle canvas resize uses parent bounds** — `canvas.parentElement.getBoundingClientRect()` may give 0 dimensions if parent is hidden. The resize should be called after the screen becomes visible.
15. **DevicePixelRatio double-scaling** — `resize()` calls `ctx.scale(dpr, dpr)` but never resets the transform. If `resize()` is called multiple times, the scale compounds.

**LOW:**

16. **No favicon** — Standard 404 in console.
17. **sandbox-slot3-group HTML nesting** — The `<div id="sandbox-slot3">` is nested inside a `<span>`, which is invalid HTML (block element inside inline element).
18. **Discovery popup click handler stacking** — `popup.addEventListener('click', ..., { once: true })` is added each time, but `clearTimeout(popup._hideTimer)` suggests overlapping popups are possible.
19. **No keyboard navigation** — No keyboard shortcuts for combining or navigating eras.
20. **Audio context not resumed** — Some browsers require user gesture to resume AudioContext. The `getCtx()` function creates the context lazily but doesn't call `resume()`.

### Suggestions

1. **Fix the data contract immediately** — Either update eras.js to match timeline.js's expectations, or update timeline.js to read eras.js's actual structure. The latter is safer since the eras.js data is physics-correct.
2. **Convert dials to array or use Object.entries** — Either `dials: [{ id: 'temperature', label: ... }]` or change the loop to `Object.entries(currentEra.dials)`.
3. **Unify conditions format** — Decide on one scale (log10 or actual) and one shape ({min,max} or [min,max]).
4. **Add integration tests** — A simple test that loads each era and verifies the expected fields exist would have caught all of this.
5. **Rate-limit dial-tick audio** — Every `input` event on sliders triggers `Audio.play('dial-tick')`. On fast drags, this creates an overwhelming buzz.

---

## Physics Accuracy Check

### Era 1: Quark Epoch
- QCD confinement at ~10^12 K ✅ (actual: ~10^12 K)
- Proton = uud ✅
- Neutron = udd ✅
- "Strong force increases with distance" ✅ (asymptotic freedom/confinement)

### Era 2: Hadron Epoch
- Proton = uud question ✅
- Neutron = udd question ✅
- Neutron charge = +2/3 - 1/3 - 1/3 = 0 ✅
- Color confinement explanation ✅
- Pion = quark-antiquark ✅
- "Strong force gets STRONGER as quarks separate" ✅

### Era 3: Lepton Epoch
- e⁺e⁻ annihilation → photons ✅
- CP violation as explanation for matter-antimatter asymmetry ✅
- "~1 extra matter particle per billion" ✅ (actual: ~1 in 10^9)
- Positronium mentioned in wrong explanation ✅

### Era 4: Nucleosynthesis
- Deuterium as first fusion product ✅
- Coulomb barrier and quantum tunneling ✅
- Temperature window concept ✅
- Helium-4 ~25% of universe mass ✅
- Lithium-7 predicted/observed match ✅

### Era 5: Recombination
- Atoms form at ~3000K / 380,000 years ✅
- CMB explanation ✅
- Hydrogen = 75% of baryonic matter ✅
- "Oldest light in the universe" ✅

### Era 6: Stellar Era
- Hydrogen fusion at ~15 million K ✅
- Triple-alpha process for carbon ✅
- Fred Hoyle prediction ✅ (nice historical touch)
- Iron as fusion endpoint ✅
- "Highest binding energy per nucleon" ✅

### Era 7: Heavy Elements
- r-process in supernovae and neutron star mergers ✅
- Uranium via rapid neutron capture ✅
- Nuclear fission chain reaction ✅

### Era 8: Modern Physics
- Stimulated emission (lasers) ✅
- Quantum tunneling in flash memory ✅ (great real-world example)
- Qubits and superposition ✅
- GR/QM incompatibility at Planck scale ✅

**Overall physics accuracy: 9/10.** The content is excellent throughout. Minor note: Era 4 says Helium-3 has "two protons and one neutron" which is correct (²He-3 = 2p + 1n), but the formation from "deuterium fusion" is a simplification (actual: D + p → He-3 + γ).

---

## Progression Path (as designed, if bugs were fixed)

**Era 1 (Dials):** Player adjusts temperature and density sliders. Lowering temperature below ~10^12 K with sufficient density triggers proton and neutron formation. 2 discoveries.

**Era 2 (Choice):** 3 multiple-choice questions about quark composition and confinement. Tests whether the player understood Era 1's physics. 2 element discoveries (proton, neutron again — redundant with Era 1).

**Era 3 (Choice):** 2 questions about annihilation and CP violation. Introduces antimatter concept. 2 discoveries.

**Era 4 (Dials):** Player finds the nucleosynthesis temperature window (~10^9 K). 4 discoveries (deuterium, He-3, He-4, Li-7). Most mechanically interesting era — the temperature window is narrow.

**Era 5 (Choice):** 3 questions about recombination, CMB, and hydrogen formation. Bridges from nuclear physics to atomic physics. 2 discoveries.

**Era 6 (Dials):** Star formation. Progressive discoveries as temperature and density increase. 4 discoveries. Correctly escalates: hydrogen fusion → carbon → oxygen → iron.

**Era 7 (Dials):** Supernovae and heavy elements. 2 discoveries (uranium, fission). Shorter than Era 6.

**Era 8 (Choice):** Modern applications. 4 questions about lasers, tunneling, quantum computers, and quantum gravity. 4 discoveries. Strong finish connecting to real technology.

**Total: 8 eras, ~22 discoveries, alternating dial/choice mechanics.**

The alternation between dial and choice eras is a good design choice — it prevents monotony and tests different types of understanding (intuition/exploration vs. knowledge recall).

---

## Fun Evaluation

### Core Loop Potential: High
The dial mechanic is genuinely novel for an educational game. Instead of "click two things," the player adjusts physical conditions and watches the universe respond. The particle visualization reacting to slider changes creates a satisfying feedback loop. The choice eras break up the dial gameplay with knowledge checks.

### Decision Quality: Medium
Dial eras have real exploration — the player must find specific condition windows through experimentation. Choice eras are standard quiz format with limited decision depth. The hint system (30s delay) prevents frustration without eliminating challenge.

### Tension & Stakes: Medium
The narrow temperature windows in Era 4 create genuine tension. Choice eras have no penalty for wrong answers (just partial credit), which is educationally sound but reduces stakes.

### Player Agency: Medium-High
In dial eras, the player actively explores parameter space. Multiple discoveries per era mean the player gets multiple "aha" moments. In choice eras, agency is limited to selecting answers.

### Escalation: Strong
Eras naturally escalate: simple 2-dial systems → narrow fusion windows → heavy element synthesis. The physics concepts build on each other meaningfully.

### Replayability: Low
Once all eras are completed and questions answered correctly, there's no reason to replay. The Sandbox mode adds some replayability but depends on the same fixed recipe set.

### Fun Score (potential): 7/10
If the integration bugs were fixed, the dial mechanic + particle visualization + excellent physics content would make this significantly more engaging than Branch A's standard alchemy gameplay. The concept is sound; the execution needs fixing.

### Fun Score (current): 3/10
The game crashes or shows blank content for every era. The title screen looks great, then nothing works.

---

## Writing / Content Quality

The writing throughout is excellent — on par with Branch A's journal entries.

**Best content:**
- CP violation explanation: "For every billion annihilations, about one extra matter particle survived. Everything you see is that tiny leftover."
- Fred Hoyle reference in carbon formation
- Wrong-answer explanations specific to each choice (e.g., "Pions are mesons (quark-antiquark pairs), not baryons.")
- Era 8 connecting quantum physics to real technology (flash memory, MRI)

**Weakest content:**
- Some journal entries are sparse compared to Branch A's multi-section format
- Era descriptions would show as "undefined" (wrong field name)

---

## Architecture / Code Quality

**Strengths:**
- Clean IIFE module pattern with explicit exports
- Separation of concerns: data, engine, visualization, audio are all independent
- Particle system is well-implemented with configurable behavior
- Save/load with graceful field merging
- CSS uses variables consistently

**Weaknesses:**
- No integration testing between eras.js and timeline.js
- Event listeners accumulate on repeated init() calls
- Canvas resize has devicePixelRatio scaling bug (compounds on multiple calls)
- No error boundaries — one TypeError crashes the entire era

---

## Final Assessment

**Concept: 9/10** — The universe timeline with dial/choice mechanics is a genuinely innovative educational game design. The alternation between exploration (dials) and knowledge testing (choices) is pedagogically sound.

**Physics: 9/10** — Outstanding accuracy across all 8 eras. The questions have specific, educational wrong-answer explanations. Real-world applications are well-connected.

**Implementation: 3/10** — The game is non-functional due to data/engine field mismatches. This is a solvable problem (rename fields or update the engine), but it's comprehensive — essentially every field is wrong.

**Presentation: 7/10** — The CSS and HTML are polished. Dark space theme, smooth animations, responsive design. Particle visualization is a standout feature. Would look great if the data rendered.

**Overall: 4/10** — A game with 9/10 potential trapped behind 3/10 implementation. Fixing the integration bugs is straightforward (probably 30-60 minutes of work) and would immediately transform this into a strong competitor.

---

## Recommended Fixes (Priority Order)

1. **[CRITICAL] Fix eras.js ↔ timeline.js field names** — Either rename eras.js fields to match timeline.js expectations, or update timeline.js to read eras.js's actual structure
2. **[CRITICAL] Convert dials to iterable format** — Use `Object.entries()` in timeline.js or convert dials to arrays in eras.js
3. **[CRITICAL] Fix conditions comparison** — Standardize on log10 scale and {min,max} objects
4. **[HIGH] Fix choice field mapping** — `text→question`, `choices→options`, `explanations.correct→explanation`, `element→produces`
5. **[MEDIUM] Fix event listener accumulation** — Use `removeEventListener` before `addEventListener` in `init()`
6. **[MEDIUM] Fix canvas resize scaling** — Reset transform before applying new scale
7. **[LOW] Add AudioContext resume on user gesture
