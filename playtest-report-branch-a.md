# Branch A Playtest Report -- Quantum Forge (v2-physics-fix)

**Date:** 2026-03-12
**Branch:** v2-physics-fix (pages deployment of `current/` folder)
**Method:** Deep code-level analysis simulating full player experience (browser automation unavailable; findings based on comprehensive review of HTML, JS, CSS, and all data files)
**Estimated play coverage:** Full tutorial through Era 3, partial Era 4-5 recipe chain analysis

---

## Summary

Quantum Forge is a well-structured alchemy-style educational game with genuinely impressive physics content and a clear progression path from quarks to quantum computers. The tutorial effectively walks new players through building their first proton, and the Research Notes system provides excellent guided quests. However, there are recipe shadowing bugs that make at least one element (deuteron) permanently uncraftable, and the 3-slot forge button is a dead UI element with no JavaScript handler. The core loop is satisfying for educational purposes but follows the standard alchemy-game pattern of "follow hints to combine things" with limited strategic depth.

---

## Scores (1-10)

- **Fun:** 5
- **Physics Accuracy:** 8
- **Educational Value:** 9
- **Progression Clarity:** 8
- **Engagement:** 6
- **UI/UX:** 7

---

## Detailed Findings

### Positives

**1. Excellent tutorial flow (12 steps, well-paced)**
The tutorial walks the player through building a diquark (u+u), then a proton (uu+d), teaching the consumption mechanic along the way. Steps 6 and 11 explicitly teach stock management and Research Notes. The "Skip Tutorial" option is always available. Auto-advance timers (5s, 6s, 12s) prevent the player from getting stuck on silent steps.

**2. Research Notes are the best feature**
The 26 research notes function as guided quests with escalating complexity. Each note has a title, 1-sentence lesson, expandable full lesson, a hint, and a "next hint" teaser. The prerequisite chain ensures players encounter topics in a logical order. Example: rn_01 (Quark Pairing) -> rn_02 (Building a Proton) -> rn_04 (The Simplest Atom) -> rn_07 (Stellar Fusion) -> rn_09 (Stardust).

**3. Physics content is genuinely educational and well-written**
The journal entries are the standout content. Each element has: "What Is It?", "Why It Matters", "The Weird Part", "History", and "Fun Fact" sections. The writing is accessible without being dumbed down. Example from the proton entry: "A proton's mass is about 938 MeV, but its three quarks only contribute about 9 MeV. The other 99% comes from the kinetic and binding energy of quarks and gluons."

**4. Discovery modal is well-designed**
On new discoveries, a modal shows the element symbol with a pop animation, flavor text, a truncated journal excerpt ("What you built" and "The weird part"), QE earned, and "Now try" hints for next combinations. The "Full Journal Entry" button expands inline without navigating away.

**5. Multiple supporting systems add depth**
- Streak system with Fibonacci multipliers (1, 1, 2, 3, 5, 8, 13, 21)
- Stability meter that punishes failed combinations (-15 per fail) and rewards successes (+5)
- Decoherence lockout (30s cooldown) when stability hits 0
- Mastery levels (Novice -> Familiar -> Proficient -> Master) based on craft count
- Batch crafting for known recipes
- Combo badges showing undiscovered reactions per element
- Element pinning (right-click)
- "Useful" filter to show only elements with undiscovered combos
- Command bar for text-based interaction

**6. 19 challenges with good variety**
Ranging from "Build Your First Atom" (difficulty 1, max 6 moves) to "The Holy Grail" (difficulty 5, max 40 moves). The daily challenge system rotates through difficulty 1-4 challenges based on date seed.

### Issues / Bugs

**CRITICAL: Deuteron is permanently uncraftable (recipe shadowing bug)**
The only recipe for deuteron is `proton + neutron`, but this pair is already mapped to `pion` (defined earlier in the RECIPES array, line 50 vs line 72). The RECIPE_MAP uses first-match-wins logic. Since deuteron has no alternative recipe, it can never be discovered. This also blocks one path to deuterium (`deuteron + electron`), though deuterium itself is reachable via `hydrogen + neutron`.

**Steps to reproduce:** Combine proton + neutron in the forge. Expected: deuteron. Actual: pion.

**HIGH: 3-Slot Forge button is non-functional**
The HTML contains a "3-Slot" toggle button (`btn-toggle-slots`) and a hidden third forge slot, but there is zero JavaScript handling for this button. No click handler is registered anywhere in game.js. The user-facing prompt specifically asks about "3-slot mode for protons/neutrons," but the feature does not exist in code. The diquark intermediate system replaces 3-slot mode by breaking 3-quark recipes into 2 steps.

**Steps to reproduce:** Click the "3-Slot" button on the forge. Expected: Third slot appears. Actual: Nothing happens.

**HIGH: Multiple recipe shadowing conflicts**
Beyond deuteron, several recipe pairs share the same sorted key, meaning the second recipe is silently ignored:

| Input pair | First result (active) | Second result (blocked) | Alt recipe exists? |
|---|---|---|---|
| proton + neutron | pion | deuteron | NO - deuteron unreachable |
| electron + neutrino | muon | weak_force | YES - beta_decay + neutrino |
| photon + electron | positron | electromagnetic_force | YES - photon + energy |
| photon + electron | positron | compton_scattering | YES - electromagnetic_force + electron |
| electron_shell + photon | spectral_line | photon_emission | YES - electron_shell + energy |
| quantum_spin + quantum_spin | entanglement | pauli_exclusion | YES - quantum_spin + electron_shell |

Only the deuteron case is truly broken (no alternative path). The others have workarounds but may confuse players who try the "obvious" recipe and get an unexpected result.

**MEDIUM: Quantum Energy (QE) has no spending mechanism**
QE accumulates (10 for new discovery, 2 for re-craft, modified by era bonus and streak multiplier) but there is nothing to spend it on. The counter in the top bar grows indefinitely. It functions purely as a score, but is never presented as such -- it looks like a currency.

**MEDIUM: Spectral Line and Photon Emission recipe overlap is confusing**
`electron_shell + photon` produces spectral_line, not photon_emission. But research note rn_12 ("Making Light") says "Give an electron shell a jolt of energy and watch what comes out" with goal photon_emission. The correct recipe is electron_shell + energy. A player following the hint might try electron_shell + photon first, get spectral_line instead, and be confused about why that wasn't the goal.

**LOW: "gluon" is listed as a starting element but not included in the starting 6 count**
The STARTING_ELEMENTS array has 6 entries: up_quark, down_quark, electron, photon, neutrino, gluon. But the tutorial says "You have 6 fundamental building blocks" and then "7 fundamental building blocks" in the intro modal text. The intro modal says 7, the actual array has 6. The 7th would be energy, which is discoverable (photon+photon=energy), not a starter.

Wait -- let me re-check: the intro says "You have 7 fundamental building blocks." But STARTING_ELEMENTS has 6 (up_quark, down_quark, electron, photon, neutrino, gluon). Energy is NOT a starter. This is a text mismatch.

**LOW: favicon.ico likely missing**
Standard web deployment issue -- no favicon specified in the HTML head, which typically produces a 404 in console.

### Suggestions

**1. Fix the deuteron recipe by reordering or deduplicating**
Move the deuteron recipe (`proton + neutron`) before the pion recipe, or remove the duplicate mapping and implement multi-output recipes (proton+neutron could produce both pion and deuteron, letting the player choose).

**2. Either implement or remove the 3-Slot button**
The diquark intermediate system is actually a good design choice (it teaches multi-step assembly). But having a non-functional "3-Slot" button in the UI is confusing. Either remove it or implement it as an alternate path.

**3. Give QE a purpose**
Options: unlock hints on demand, buy stability repairs, unlock cosmetic forge skins, or skip decoherence cooldowns. Currently it is dead weight.

**4. Add a recipe conflict detection warning**
During development, log a warning when two recipes share the same input pair. This would have caught the deuteron bug immediately.

---

## Physics Accuracy Check

| Recipe | Correct? | Notes |
|---|---|---|
| u + u = diquark_uu | Yes | Diquark correlations are real QCD phenomena |
| diquark_uu + d = proton | Yes | Proton is uud, assembled in 2 steps |
| d + d = diquark_dd | Yes | |
| diquark_dd + u = neutron | Yes | Neutron is ddu |
| proton + electron = hydrogen | Yes | Simplest atom |
| photon + photon = energy | Acceptable | Simplified; real pair production needs E >= 2*m_e*c^2 |
| electron + photon = positron | Simplified | Real pair production: gamma -> e+ + e-, but game can't do multi-output |
| hydrogen + hydrogen = helium | Simplified | Real fusion is p-p chain with many steps, but reasonable abstraction |
| helium + helium = carbon | Yes | Triple-alpha process (simplified) |
| carbon + helium = oxygen | Yes | Alpha capture on carbon-12 |
| oxygen + oxygen = iron | Simplified | Iron is the end of stellar fusion, but real path is more complex |
| superposition + superposition = entanglement | Acceptable | Entanglement does involve correlated superposed states |
| superposition + measurement = qubit | Creative license | A qubit IS a superposition that can be measured, so this is defensible |
| momentum + position = uncertainty_principle | Yes | Heisenberg's uncertainty is fundamentally about conjugate variables |
| higgs_boson + electron = mass | Yes | Higgs mechanism gives mass to fundamental particles |
| proton + neutron = pion (intended: deuteron) | BUG | Should produce deuteron; pion is a meson, not a bound nucleon pair |

**Overall physics accuracy is high.** Most simplifications are reasonable for an educational game. The diquark intermediate step is a particularly nice touch -- it reflects real QCD structure.

---

## Progression Path

**Era 1 (Fundamental Particles):**
Starting with 6 elements. The tutorial guides: u+u -> diquark_uu -> diquark_uu+d -> proton. Then the player naturally explores: d+d -> diquark_dd -> diquark_dd+u -> neutron. Photon+photon -> energy. Research notes guide clearly.

**Era 2 (Composite Particles):**
Proton+electron -> hydrogen. Electron+photon -> positron. Electron+positron -> annihilation. Gluon+gluon -> strong_force. Research notes shift to antimatter, stellar fusion, and forces. Need to re-craft intermediates (protons for hydrogen, etc.), which teaches the stock mechanic.

**Era 3 (Atoms & Nuclear Physics):**
Hydrogen+hydrogen -> helium (requires crafting 2 protons + 2 electrons + 2 hydrogen). Helium+helium -> carbon. Carbon+helium -> oxygen. Oxygen+oxygen -> iron. The "re-craft chain" is where the game gets grindy -- building iron requires: 2 protons -> 2 hydrogen -> helium -> carbon -> oxygen -> iron, but you need TWO oxygens, each requiring its own chain.

**Era 4 (Quantum Phenomena):**
The dependency chains become longer. Getting to superposition requires: energy_barrier (from electromagnetic_force + nucleus) -> double_slit (photon + energy_barrier) -> superposition (electron + double_slit). The research notes are essential here.

**Sticking points:**
- The proton+neutron -> pion (instead of deuteron) would confuse any player following the intuitive path
- Energy_barrier requires electromagnetic_force + nucleus, but electromagnetic_force requires photon+electron which actually makes positron (recipe shadow). Player must use photon+energy instead.
- Several "obvious" combinations produce unexpected results due to recipe shadowing

---

## Fun Evaluation

### Core Loop Verdict: Mediocre
The fundamental act of playing is "select two elements, click combine, see result." When following Research Notes, the optimal path is usually obvious. When experimenting freely, the failure feedback is good but the search space is too large to explore systematically.

### Decision Quality: Shallow
Most decisions are "follow the hint" or "try random combinations." The Research Notes are so well-written that they essentially tell you exactly what to combine. Example: rn_02 says "Start by pairing two up quarks. Then add what completes uud." This leaves zero ambiguity. The combo badges further eliminate guesswork by showing which elements have undiscovered reactions.

### Tension & Stakes: Some
The stability meter creates mild tension -- too many failures trigger a 30-second lockout. Streak mechanics add pressure to keep succeeding. But the penalty is just a time-out, not progress loss. Intermediates being consumed adds a real cost to experimentation.

### Player Agency: Low
A bot following Research Note hints and combo badges would discover everything just as efficiently as a human. The "Useful" filter literally highlights what to try next. The game is designed to be solvable by following the guidance system, which is great for education but removes player agency.

### Emergent Depth: None
Recipes are fixed. There are no emergent interactions -- every combination either works (producing a predetermined result) or fails. The recipe shadowing bugs create accidental emergent behavior (trying to make deuteron and getting pion), but that is not intended depth.

### Replayability: None
Once all elements are discovered, the game is complete. There is no procedural variation, no difficulty scaling, no alternate paths. The challenges offer some replay, but they use the same fixed recipes.

### Escalation: Weak
Eras escalate in recipe chain length (more intermediate steps) but not in mechanical complexity. The forge works identically from start to finish. No new mechanics unlock. The research notes introduce harder concepts, but the gameplay remains "click two things, click combine."

### The "Simple Bot" Test
A bot that: (1) reads Research Notes, (2) follows hints, (3) uses combo badges to identify valid pairs, and (4) always combines elements with the highest undiscovered combo count would perform identically to a skilled human player. The game has no strategic decisions where human judgment outperforms simple heuristics.

### Fun Score: 5/10
The game is satisfying in the way all alchemy games are -- "discover new thing, feel smart, repeat." The educational content elevates it above generic alchemy games. But the core loop has no strategic depth, no meaningful decisions, and no mechanical evolution. It is a competent implementation of a genre that prioritizes discovery satisfaction over gameplay challenge.

---

## Writing / Content Quality

The writing is the game's strongest asset. Journal entries are informative, engaging, and appropriately leveled for a general audience.

**Best passages:**
- Proton journal: "A proton's mass is about 938 MeV, but its three quarks only contribute about 9 MeV. The other 99% comes from the kinetic and binding energy of quarks and gluons. Mass literally comes from energy!"
- Neutrino flavor text: "Trillions pass through you every second -- and you never notice."
- Electron journal: "An electron's magnetic moment has been measured to 13 decimal places, and it matches quantum theory's prediction perfectly. It's the most precisely verified prediction in all of science!"
- Down quark fun fact: "If the down quark were lighter than the up quark (instead of heavier), protons would decay instead of neutrons, and the universe would be radically different -- possibly no atoms at all!"

**Weakest passages:**
- Some combine hints are too explicit: "Add a down quark to complete a proton (uud)." This removes all discovery satisfaction.
- Research note hints vary wildly in subtlety. rn_02 ("Start by pairing two up quarks. Then add what completes uud.") is a literal recipe, while rn_14 ("What happens when a photon encounters a barrier with two paths?") requires genuine inference.

---

## Pacing

**Tutorial (Steps 1-12):** Well-paced. Auto-advance timers prevent getting stuck. ~2 minutes to complete.

**Era 1 (First 10 minutes):** Good flow. Diquarks, proton, neutron, hydrogen, energy all come quickly. Each discovery feels rewarding.

**Era 2 (10-20 minutes):** Starts to slow down. Re-crafting protons for hydrogen (to make helium) introduces grind. The consumption mechanic means building helium requires: u+u -> diquark_uu, diquark_uu+d -> proton, proton+e -> hydrogen, then repeat for second hydrogen, then hydrogen+hydrogen -> helium. That is 5 combinations for one helium.

**Era 3-4 (20+ minutes):** Chain length becomes the primary bottleneck. Building iron from scratch requires ~15 combinations. The batch crafting system helps for re-crafts, but the initial discovery chain is still long. This is where most players would likely stop or heavily rely on Research Notes.

**Era 5:** Very long dependency chains. Quantum computer requires: proton -> hydrogen -> ... -> electron_shell -> ... -> double_slit -> superposition -> measurement -> qubit -> logic_gate -> quantum_computer. Estimated 25+ total combinations from scratch.

---

## UI/UX

**Positives:**
- 3-panel layout (elements left, forge center, info/notes right) is clean and intuitive
- Element cards show symbol, name, role, stock count, and combo badge
- Category headers with collapse/expand and discovery counts
- Search bar for finding specific elements
- "Useful" filter is extremely helpful for late-game
- Combo section appears when one slot is filled, showing known recipes
- Right-click to pin elements
- Volume controls for music and SFX

**Issues:**
- The 3-Slot button does nothing and should be removed or implemented
- No keyboard shortcuts for common actions (combine, clear slots)
- The command bar at the bottom is labeled "for LLM playtesting" but is visible to all players
- No undo/clear slots button (clicking a third element replaces slot 1, which is unintuitive)
- Element cards for zero-stock items are dimmed but still clickable (triggers recraft offer, which is nice)
- The decoherence overlay blocks the entire game for 30 seconds -- this is a very harsh penalty

---

## Bugs Found

### CRITICAL: Deuteron permanently uncraftable
**Steps to reproduce:** Try to combine Proton + Neutron.
**Result:** Produces Pion (recipe defined on line 50 of recipes.js takes priority).
**Expected:** Should produce Deuteron (recipe on line 72 is shadowed and never fires).
**Impact:** Deuteron element can never be discovered. The deuteron+electron path to deuterium is also blocked (though deuterium has a hydrogen+neutron alternative).

### HIGH: 3-Slot Forge button is non-functional
**Steps to reproduce:** Click the "3-Slot" button in the forge area.
**Result:** Nothing happens. No JavaScript handler exists.
**Expected:** Should either toggle a third forge slot or be removed from the UI.

### HIGH: Multiple recipe shadows may confuse players
**Steps to reproduce:** Combine electron + neutrino (expecting weak_force per recipe line 95).
**Result:** Produces muon (recipe line 53 takes priority).
**Expected:** Players following the weak_force hint path may be confused.

### MEDIUM: Intro modal says "7 fundamental building blocks" but only 6 are given
**Steps to reproduce:** Start a new game, read the intro modal.
**Result:** Text says "7 fundamental building blocks."
**Expected:** Should say 6 (up_quark, down_quark, electron, photon, neutrino, gluon). Energy is discoverable, not a starter.

### MEDIUM: QE has no spending mechanism
**Steps to reproduce:** Accumulate QE through normal play.
**Result:** Number grows but cannot be spent on anything.
**Expected:** Should either have a use or be presented as a score/XP counter rather than a currency.

### LOW: Command bar "for LLM playtesting" visible to all players
**Steps to reproduce:** Look at the bottom of the game screen.
**Result:** A text input labeled "Type command: combine X + Y | help" is visible.
**Expected:** Should be hidden in production or behind a developer toggle.

---

## Story Engagement Curve

| Phase | Engagement |
|---|---|
| Title screen | MEDIUM - clean, inviting |
| Tutorial (diquark + proton) | HIGH - hands-on, quick results |
| Era 1 free exploration | HIGH - many easy discoveries |
| Era 2 composite particles | MEDIUM - re-crafting starts to feel grindy |
| Era 3 atoms | MEDIUM - long chains, but satisfying goals (iron, water) |
| Era 4 quantum phenomena | LOW-MEDIUM - abstract concepts harder to intuit |
| Era 5 applications | LOW - very long chains, dependency depth overwhelming |

---

## Recommendations (Priority Order)

1. **[CRITICAL]** Fix recipe shadowing for deuteron -- reorder the proton+neutron recipes so deuteron comes first, or add a unique recipe for deuteron (e.g., strong_force + hydrogen)
2. **[HIGH]** Remove or implement the 3-Slot button -- a dead UI element undermines trust in the interface
3. **[HIGH]** Add a recipe conflict detection system to prevent future shadowing bugs -- `console.warn` when two recipes share a key
4. **[MEDIUM]** Give QE a purpose -- hint purchases, stability repair, or cosmetic unlocks
5. **[MEDIUM]** Fix the "7 fundamental building blocks" text to say "6"
6. **[MEDIUM]** Hide or gate the command bar behind a keyboard shortcut (e.g., backtick)
7. **[LOW]** Make Research Note hints more consistently inference-based -- some are too explicit (literal recipes) while others require genuine thinking
8. **[LOW]** Add a "Clear Forge" button to reset both slots without needing to click a third element

---

## Final Assessment

**Fun: 5/10** -- Satisfying discovery loop, but no strategic depth. A hint-following bot plays identically to a human.
**Physics Accuracy: 8/10** -- Mostly excellent. Diquark intermediate is a nice touch. Deuteron bug and some simplified fusion paths are the main issues.
**Educational Value: 9/10** -- Journal entries, research notes, and discovery modals are outstanding educational content. This is genuinely one of the better physics education games I have analyzed.
**Progression Clarity: 8/10** -- Research Notes provide excellent guidance. Combo badges and the "Useful" filter further reduce confusion. Only the recipe shadowing bugs create unexpected results.
**Engagement: 6/10** -- Strong start, gradual decline as chains lengthen and the mechanics stay static.
**UI/UX: 7/10** -- Clean 3-panel layout, good information density. Marred by the dead 3-Slot button and visible debug command bar.

**Design: 6/10** -- Solid alchemy game structure with good supporting systems (streaks, stability, mastery). Held back by lack of mechanical evolution and the fundamental alchemy-game agency problem.
**Presentation: 8/10** -- Dark space theme with era-colored elements, WebGL shader background, particle animations, and procedural ambient music. Professional feel.
**UX: 7/10** -- Mostly intuitive. Tutorial is well-done. Some pain points with slot management and the dead 3-Slot button.
**Stability: 6/10** -- The deuteron bug is a real progression blocker. Multiple recipe shadows could confuse players. No crashes, but data integrity issues.

**Overall: 6/10** (weighted: Fun 50%, Design 20%, Presentation/UX/Stability 10% each)

The game's greatest strength is its educational content -- the journal entries, research notes, and discovery flow teach real quantum mechanics in an accessible, engaging way. If the goal is "teach physics through an alchemy game," this succeeds admirably. If the goal is "make a fun game that also teaches physics," the gameplay side needs more depth. The recipe shadowing bugs should be fixed before any public release, as they create genuinely confusing player experiences and block content.
