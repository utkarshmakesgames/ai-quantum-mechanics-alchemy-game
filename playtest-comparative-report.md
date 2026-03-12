# Comparative Playtest Report — Branch A vs Branch B

**Date:** 2026-03-12
**Method:** Code-level analysis of both branches

---

## Side-by-Side Scores

| Category | Branch A (Physics Fix) | Branch B (Redesign) | Branch B (Potential*) |
|---|---|---|---|
| Fun | 5 | 3 | 7 |
| Physics Accuracy | 8 | 9 | 9 |
| Educational Value | 9 | 9 | 9 |
| Progression Clarity | 8 | 7 | 8 |
| Engagement | 6 | 2 | 7 |
| UI/UX | 7 | 7 | 8 |
| **Overall** | **6** | **4** | **8** |

*Branch B "Potential" = scores if integration bugs were fixed.

---

## Key Differences

### Gameplay Mechanic
- **Branch A:** Classic alchemy forge — select elements, combine, discover. Guided by research notes.
- **Branch B:** Universe timeline — adjust dials to find physics conditions OR answer multiple-choice questions. Two distinct interaction modes.

### Player Agency
- **Branch A:** Low — follow hints, click combos. A bot plays identically to a human.
- **Branch B (if working):** Medium-high — dial eras require genuine exploration of parameter space. No single "right click."

### Educational Approach
- **Branch A:** "Learn by building" — discover physics by combining particles. Journal entries explain after discovery.
- **Branch B:** "Learn by experiencing" — adjust conditions to see what happens, then test understanding with questions. Wrong answers get targeted explanations.

### Physics Depth
- **Branch A:** Broad but shallow — many elements (80+) with brief journal entries.
- **Branch B:** Narrow but deep — 8 eras with detailed explanations, targeted wrong-answer feedback, and real-world connections.

### Replayability
- **Branch A:** Challenges, achievements, mastery levels provide some replay. But core is "discover everything once."
- **Branch B:** No replay mechanism. Once eras are complete, done.

---

## Critical Issues Summary

### Branch A (Playable with bugs)
1. **CRITICAL:** Deuteron permanently uncraftable (recipe shadowing)
2. **HIGH:** 3-Slot forge button does nothing
3. **HIGH:** Multiple recipe shadows confuse players
4. **MEDIUM:** QE has no spending mechanism
5. **MEDIUM:** "7 building blocks" text but only 6 starters

### Branch B (Non-functional)
1. **CRITICAL:** eras.js ↔ timeline.js field name mismatches (6+ fields)
2. **CRITICAL:** Dials object not iterable — all dial eras crash
3. **CRITICAL:** Questions field name wrong — all choice eras skip to "Complete"
4. **HIGH:** Dial conditions scale/format mismatch
5. **HIGH:** Choice answer field name mismatches

---

## Recommendation

**Short term: Fix Branch A's bugs** — it's playable today and has 3 fixable issues.

**Medium term: Fix Branch B's integration** — the data/engine mismatch is ~30-60 minutes of work. Once fixed, Branch B has higher potential.

**Long term: Ship Branch B with Branch A's Sandbox mode.** Branch B's Story Mode is the better educational experience. Branch A's more developed sandbox (with research notes, challenges, streaks, mastery) would complement it perfectly.

### Specific Fix Plan

**Branch A quick fixes (1-2 hours):**
1. Reorder deuteron recipe before pion, or give deuteron a unique recipe
2. Remove or implement the 3-Slot button
3. Add recipe conflict detection warnings

**Branch B integration fix (1 hour):**
1. Update timeline.js to read eras.js's actual field names:
   - `timeAfterBang` → `time`
   - `description` → `intro`
   - `thresholds` → `discoveries`
   - `choices` → `questions`
2. Convert `for (const dial of dials)` to `for (const [id, dial] of Object.entries(dials))`
3. Fix dial value comparison to use log10 scale consistently
4. Map choice fields: `text→question`, `choices→options`, etc.

---

## Verdict

Branch A is the safer ship — it works today and teaches physics effectively through the alchemy mechanic. Branch B is the better game design, held back by integration bugs. **Fix Branch B's bugs first, then run another round of playtesting to make the final call.**
