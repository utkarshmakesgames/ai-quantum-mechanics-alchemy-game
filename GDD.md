# Quantum Forge — Game Design Document

## Overview
**Genre:** Puzzle / Crafting / Educational
**Engine:** Web (HTML/CSS/JS)
**Build Mode:** Prototype
**Target Audience:** Curious minds ages 12+ who want to learn quantum mechanics through play
**Tagline:** "Forge the universe, one particle at a time."

## Game Concept

Quantum Forge is a discovery-crafting game in the spirit of Little Alchemy — but instead of combining "fire + water = steam," you combine **quantum particles, forces, and phenomena** to build up from the subatomic world to atoms, molecules, materials, and mind-bending quantum effects.

The twist: **quantum mechanics is weird**, and the game leans into that. Combining an electron with "observation" gives you Wave-Particle Duality. Combining two entangled particles lets you discover Quantum Teleportation. The game teaches real physics by making the combinations follow actual science — and explaining WHY each result happens.

### What Makes It Fun
1. **Discovery dopamine** — Every new combination reveals something with a satisfying animation and a "wow, that's real?!" explanation
2. **Multiple discovery paths** — There are often 2-3 ways to discover the same thing, rewarding experimentation
3. **Tier progression** — Start with 6 fundamental particles, unlock 100+ discoveries across 5 eras of physics
4. **Challenge puzzles** — "Create a Bose-Einstein Condensate using only 8 combinations" — puzzle mode for replayability
5. **Quantum Journal** — A growing encyclopedia that teaches real quantum mechanics as you play
6. **Completionist hook** — Track discovery percentage, find hidden "easter egg" combinations
7. **Sandbox + Guided modes** — Free exploration OR structured challenges

## Core Mechanics

### 1. The Workspace
- A clean workspace with your **discovered elements** displayed as draggable cards on the left panel
- A **crafting area** in the center where you drag two cards to combine them
- A **results area** showing what you just created (or "no reaction" for invalid combos)
- A **journal** button to read about anything you've discovered

### 2. Combining Elements
- **Drag-and-drop** (or click-to-select for accessibility and LLM playtesting)
- Select two elements → click "Combine" → see result
- Valid combinations produce a new element with:
  - A discovery animation (glow, particle effect via CSS)
  - The element name and a one-line "flavor text"
  - A "Learn More" button opening the journal entry
- Invalid combinations show a brief "No reaction" message with a subtle hint system
- **Click-to-select mode (default for LLM compatibility):** Click one element, click another, click Combine button

### 3. The Discovery Tree (5 Eras)

**Era 1: Fundamental Particles** (Starting elements — given free)
- Up Quark, Down Quark, Electron, Photon, Gluon, Neutrino

**Era 2: Composite Particles** (~15 discoveries)
- Proton (Up Quark + Up Quark + Down Quark via multi-combine OR simplified: Up Quark + Gluon)
- Neutron (Down Quark + Gluon)
- Positron (Electron + Photon — antimatter!)
- Pion, Muon, etc.
- Hydrogen Atom (Proton + Electron)

**Era 3: Atoms & Forces** (~20 discoveries)
- Helium (Hydrogen + Hydrogen — fusion!)
- Electromagnetic Force (Electron + Photon)
- Strong Force (Gluon + Quark interactions)
- Weak Force (Neutrino + Electron)
- Gravity (discovered through mass combinations)
- Various light atoms up to Iron

**Era 4: Quantum Phenomena** (~25 discoveries)
- Wave-Particle Duality (Electron + Double Slit)
- Quantum Superposition (Any Particle + Unobserved State)
- Quantum Entanglement (Electron + Electron under specific conditions)
- Quantum Tunneling (Particle + Energy Barrier)
- Heisenberg Uncertainty (Momentum + Position)
- Schrödinger's Cat (Superposition + Measurement + Cat — yes, a cat)
- Quantum Decoherence (Superposition + Environment)
- Photoelectric Effect (Photon + Metal)
- Compton Scattering (Photon + Electron at high energy)
- Blackbody Radiation (Photon + Heat)

**Era 5: Advanced & Applied** (~25 discoveries)
- Quantum Computer (Qubit + Entanglement + Logic Gate)
- Quantum Cryptography (Entanglement + Information)
- Bose-Einstein Condensate (Atoms + Extreme Cold)
- Superconductor (Electron Pair + Low Temperature)
- Laser (Photon + Stimulated Emission)
- Quantum Field Theory (All Forces + Particles)
- Standard Model (unlock by discovering all fundamental interactions)
- Nuclear Fission (Heavy Atom + Neutron)
- Nuclear Fusion (Light Atoms + Extreme Heat)
- Hawking Radiation (Black Hole + Quantum Fluctuation)

**Hidden/Easter Egg Discoveries** (~10)
- "God Particle" (Higgs Boson + Media Hype)
- Quantum Eraser (Entanglement + Observation + Forgetting)
- Many-Worlds (Superposition + Philosophy)
- Quantum Immortality (Many-Worlds + Observer)
- Spooky Action (Entanglement — Einstein's quote reference)

**Total: ~100+ discoverable elements**

### 4. Hint System
- After 3 failed combinations, a subtle hint appears: "Try combining something from Era 1 with something from Era 2"
- After 5 fails, a more specific hint: "Photons interact interestingly with electrons..."
- Hints teach physics reasoning, not just answers
- Optional "Physicist's Notebook" that gives themed hints per era

### 5. Challenge Mode (Replayability)
- **Discovery Challenges:** "Discover Quantum Tunneling in under 10 combinations"
- **Speedrun Mode:** How fast can you reach the Standard Model?
- **Limited Inventory:** "You can only hold 8 elements at once — plan carefully"
- **Mystery Recipes:** Given a result, figure out the ingredients
- **Daily Challenge:** A new puzzle each day (seeded by date)

### 6. Quantum Journal (Educational Core)
Each discovered element gets a journal entry with:
- **What It Is:** 2-3 sentence plain-English explanation
- **Why It Matters:** Real-world significance
- **The Weird Part:** The quantum weirdness that makes it fascinating
- **History:** Who discovered it and when
- **Fun Fact:** An engaging tidbit

The journal IS the learning. Players who read it will genuinely understand quantum mechanics basics.

## Game Flow

### New Game
1. Title screen with "Start Forging" button
2. Brief intro: "Welcome to the Quantum Forge. You have 6 fundamental particles. Combine them to build the universe."
3. Tutorial: guided first combination (Up Quark + Gluon → Proton) with explanation
4. Free play begins with all 6 starting elements

### Core Loop
1. Browse discovered elements
2. Pick two elements to combine
3. See result (new discovery or "no reaction")
4. Read journal entry for new discoveries
5. Use new element in further combinations
6. Repeat — chasing completion percentage

### Progression
- Discovery counter: "23/105 discovered"
- Era progression bar showing which eras you've unlocked
- New eras unlock when you discover enough from the previous era (70% threshold)
- Milestone celebrations at 25%, 50%, 75%, 100%

### Session End
- Auto-save to localStorage
- Can close and resume anytime
- "You discovered X new things this session" summary

## UI Screens

### 1. Title Screen
- Game title "Quantum Forge" with subtle particle animation (CSS)
- "New Game" / "Continue" / "Challenges" / "Journal" buttons
- Discovery progress shown if save exists

### 2. Main Game Screen (Workspace)
- **Left Panel (scrollable):** All discovered elements as cards, filterable by era
- **Center Area:** The forge/crafting zone — drop two elements here
- **Right Panel:** Result display + journal excerpt
- **Top Bar:** Discovery counter, era progress, menu button
- **Bottom Bar:** Hint area (appears contextually)

### 3. Journal Screen
- Searchable/filterable encyclopedia of all discoveries
- Locked entries shown as "???" with era hints
- Each entry: name, icon, explanation, history, fun fact
- Categorized by era

### 4. Challenge Select Screen
- List of available challenges with difficulty ratings
- Best scores/times for completed challenges
- Daily challenge highlight

### 5. Challenge Play Screen
- Modified workspace with challenge constraints visible
- Timer or move counter depending on challenge type
- "Give Up" / "Hint" buttons

### 6. Settings/Pause Overlay
- Sound toggle (for future audio)
- Reset progress (with confirmation)
- Theme toggle (dark/light — default dark for that "cosmic" feel)

## Visual Design (Prototype)

### Style
- **Dark cosmic background** with subtle star field (CSS gradient + scattered dots)
- **Element cards:** Rounded rectangles with glowing borders (color per era)
- **Era colors:**
  - Era 1 (Fundamental): Cyan/Teal
  - Era 2 (Composite): Green
  - Era 3 (Atoms): Gold/Yellow
  - Era 4 (Phenomena): Purple/Magenta
  - Era 5 (Advanced): Red/Orange
  - Hidden: Rainbow shimmer
- **Discovery animation:** Card glows, pulses, then reveals with a satisfying "pop"
- **Typography:** Clean sans-serif (system fonts for prototype)
- **Icons:** Simple geometric symbols per element (circles, triangles, waves — CSS/SVG)

### Responsive
- Desktop-first but functional on tablet
- Minimum 1024px width for full layout
- Cards resize based on viewport

## Technical Notes

### Architecture
- Single-page application, vanilla JS
- Game state in a single object for easy save/load (localStorage)
- Recipes defined in a data file (recipes.js) for easy expansion
- Element definitions in a data file (elements.js)
- Journal content in a data file (journal.js)
- Challenge definitions in a data file (challenges.js)

### State Structure
```javascript
{
  discovered: Set<string>,      // IDs of discovered elements
  currentEra: number,           // Highest unlocked era
  stats: {
    totalCombinations: number,
    successfulCombinations: number,
    failedCombinations: number,
    sessionDiscoveries: number,
    totalPlayTime: number
  },
  challenges: {
    [challengeId]: { completed: boolean, bestScore: number }
  },
  settings: { theme: 'dark'|'light', sound: boolean },
  hints: { failCount: number, lastHintLevel: number }
}
```

### LLM Playtestability
- All interactions are click-based (no drag required)
- Clear button labels and element names
- State is fully deterministic — same combinations always produce same results
- No timers or real-time elements in main mode
- Game state is readable from DOM for automated testing

### File Structure
```
index.html          — Main HTML structure
style.css           — All styling + animations
game.js             — Core game engine, UI controller, save/load
data/
  elements.js       — Element definitions (id, name, era, icon, color)
  recipes.js        — Combination recipes (input1 + input2 → output)
  journal.js        — Journal entries for each element
  challenges.js     — Challenge definitions
```

## Asset Requirements

### Visual (CSS-only for prototype)
- Star field background (CSS gradient)
- Element card styles per era (CSS)
- Glow/pulse animations (CSS keyframes)
- Simple SVG icons for elements (inline SVG)

### Audio (Future — skip for prototype)
- Ambient background track
- Discovery sound effect
- Combination attempt sound
- UI click sounds

### Systems (No external dependencies for prototype)
- localStorage for save/load
- CSS animations for all visual effects
- Vanilla JS for all logic

## Design Review Notes
- Self-reviewed: Mechanics are well-defined, scope is achievable for web prototype
- Educational value comes from the journal system — every discovery teaches real physics
- Replayability from challenges, multiple paths, and completionist tracking
- LLM-friendly: fully turn-based, click-based, deterministic
