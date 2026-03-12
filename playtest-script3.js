const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '.claude', 'screenshots');

let screenshotCount = 50;
async function screenshot(page, label) {
  screenshotCount++;
  const fname = `${String(screenshotCount).padStart(2, '0')}_${label}.png`;
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, fname), fullPage: false });
  console.log(`[SCREENSHOT] ${fname}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function note(text) { console.log(`[NOTE] ${text}`); }

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 900 },
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    await page.goto('http://localhost:8742/?v=5', { waitUntil: 'networkidle0' });
    await sleep(1000);

    // Start new game
    await page.click('#btn-new-game');
    await sleep(1000);

    // Complete tutorial (2 steps)
    // Step 1: Click "How does it work?"
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal-content button');
      for (const b of btns) { if (b.offsetParent !== null) { b.click(); return; } }
    });
    await sleep(800);

    // Step 2: Click "Start Forging!"
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal-content button');
      for (const b of btns) { if (b.offsetParent !== null) { b.click(); return; } }
    });
    await sleep(800);

    // === TEST 1: Combine Up Quark + Gluon, click "Continue Forging" (not Full Journal) ===
    note('=== TEST 1: Up Quark + Gluon -> Proton (Continue Forging) ===');
    await page.evaluate(() => {
      document.querySelector('[data-element-id="up_quark"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelector('[data-element-id="gluon"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1500);
    await screenshot(page, 'proton_discovery');

    // Click "Continue Forging" NOT "Full Journal Entry"
    await page.evaluate(() => {
      const btn = document.getElementById('btn-discovery-continue');
      if (btn) btn.click();
    });
    await sleep(500);
    await screenshot(page, 'after_continue_forging');

    // Check if we're back on the game screen
    const activeScreen = await page.evaluate(() => {
      const active = document.querySelector('.screen.active');
      return active ? active.id : 'none';
    });
    note(`Active screen after Continue Forging: ${activeScreen}`);

    // Check discovery count
    let count = await page.$eval('#discovery-count', el => el.innerText);
    note(`Discovery count: ${count}`);

    // === TEST 2: Down Quark + Gluon -> Neutron ===
    note('\n=== TEST 2: Down Quark + Gluon -> Neutron ===');
    await page.evaluate(() => {
      document.querySelector('[data-element-id="down_quark"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelector('[data-element-id="gluon"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1500);

    const neutronModal = await page.evaluate(() => {
      const m = document.querySelector('#discovery-modal .modal-content');
      if (!m) return null;
      const backdrop = document.querySelector('#discovery-modal');
      if (!backdrop || !backdrop.classList.contains('active')) return null;
      return m.innerText.substring(0, 500);
    });
    note(`Neutron discovery: ${neutronModal}`);
    await screenshot(page, 'neutron_discovery');

    // Continue
    await page.evaluate(() => {
      const btn = document.getElementById('btn-discovery-continue');
      if (btn) btn.click();
    });
    await sleep(500);

    // === TEST 3: Proton + Electron -> Hydrogen ===
    note('\n=== TEST 3: Proton + Electron -> Hydrogen ===');
    await page.evaluate(() => {
      document.querySelector('[data-element-id="proton"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelector('[data-element-id="electron"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1500);

    const hydrogenModal = await page.evaluate(() => {
      const m = document.querySelector('#discovery-modal .modal-content');
      if (!m) return null;
      const backdrop = document.querySelector('#discovery-modal');
      if (!backdrop || !backdrop.classList.contains('active')) return null;
      return m.innerText.substring(0, 500);
    });
    note(`Hydrogen discovery: ${hydrogenModal}`);
    await screenshot(page, 'hydrogen_discovery');

    await page.evaluate(() => {
      const btn = document.getElementById('btn-discovery-continue');
      if (btn) btn.click();
    });
    await sleep(500);

    count = await page.$eval('#discovery-count', el => el.innerText);
    note(`Discovery count after 3 combos: ${count}`);

    // === TEST 4: Electron + Photon -> Positron ===
    note('\n=== TEST 4: Electron + Photon -> Positron ===');
    await page.evaluate(() => {
      document.querySelector('[data-element-id="electron"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelector('[data-element-id="photon"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1500);

    const positronModal = await page.evaluate(() => {
      const m = document.querySelector('#discovery-modal .modal-content');
      const backdrop = document.querySelector('#discovery-modal');
      if (!m || !backdrop || !backdrop.classList.contains('active')) return null;
      return m.innerText.substring(0, 500);
    });
    note(`Electron + Photon result: ${positronModal}`);
    await screenshot(page, 'electron_photon_result');

    await page.evaluate(() => {
      const btn = document.getElementById('btn-discovery-continue');
      if (btn) btn.click();
    });
    await sleep(500);

    // === TEST 5: WRONG COMBO — Electron + Electron ===
    note('\n=== TEST 5: WRONG COMBO — Electron + Electron ===');
    await page.evaluate(() => {
      document.querySelector('[data-element-id="electron"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      // Click electron again - same element
      document.querySelector('[data-element-id="electron"]').click();
    });
    await sleep(300);

    // Check forge state
    let forgeState = await page.evaluate(() => {
      const slots = document.querySelectorAll('.forge-slot');
      return Array.from(slots).map(s => s.innerText.trim());
    });
    note(`Forge state (electron + electron): ${JSON.stringify(forgeState)}`);

    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1000);

    // Read the forge-result area for failure message
    const failResult = await page.evaluate(() => {
      const r = document.getElementById('forge-result');
      if (r && r.style.display !== 'none') {
        return r.innerText;
      }
      // Also check if it's there but just visible
      if (r) return { text: r.innerText, display: r.style.display, class: r.className };
      return 'no forge-result element';
    });
    note(`Failure result for Electron + Electron: ${JSON.stringify(failResult)}`);
    await screenshot(page, 'wrong_combo_ee');

    // === TEST 6: WRONG COMBO — Photon + Gluon (two force carriers) ===
    note('\n=== TEST 6: WRONG COMBO — Photon + Gluon ===');
    await page.evaluate(() => {
      document.querySelector('[data-element-id="photon"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelector('[data-element-id="gluon"]').click();
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1000);

    const failResult2 = await page.evaluate(() => {
      const r = document.getElementById('forge-result');
      return r ? { text: r.innerText, display: r.style.display, class: r.className, html: r.innerHTML.substring(0, 300) } : null;
    });
    note(`Failure result for Photon + Gluon: ${JSON.stringify(failResult2)}`);
    await screenshot(page, 'wrong_combo_pg');

    // === TEST 7: Command bar - scroll to it ===
    note('\n=== TEST 7: Command bar ===');
    await page.evaluate(() => {
      const cmd = document.querySelector('.cmd-bar');
      if (cmd) cmd.scrollIntoView();
    });
    await sleep(300);
    await screenshot(page, 'cmd_bar_visible');

    // Type help
    const cmdInput = await page.$('#cmd-input');
    if (cmdInput) {
      await cmdInput.click();
      await page.keyboard.type('help');
      await page.keyboard.press('Enter');
      await sleep(500);

      const helpResult = await page.evaluate(() => {
        const r = document.getElementById('forge-result');
        return r ? r.innerText : null;
      });
      note(`Help command result: ${helpResult}`);
      await screenshot(page, 'cmd_help');

      // Type "list"
      await cmdInput.click();
      await page.keyboard.type('list');
      await page.keyboard.press('Enter');
      await sleep(500);

      const listResult = await page.evaluate(() => {
        const r = document.getElementById('forge-result');
        return r ? r.innerText : null;
      });
      note(`List command result: ${listResult}`);
      await screenshot(page, 'cmd_list');

      // Try combine via text
      await cmdInput.click();
      await page.keyboard.type('combine proton + neutron');
      await page.keyboard.press('Enter');
      await sleep(1500);

      const combineResult = await page.evaluate(() => {
        const m = document.querySelector('#discovery-modal');
        if (m && m.classList.contains('active')) {
          return { type: 'discovery', text: m.innerText.substring(0, 300) };
        }
        const r = document.getElementById('forge-result');
        return r ? { type: 'forge-result', text: r.innerText } : null;
      });
      note(`Text combine proton+neutron result: ${JSON.stringify(combineResult)}`);
      await screenshot(page, 'cmd_combine_proton_neutron');

      // Dismiss modal if present
      await page.evaluate(() => {
        const btn = document.getElementById('btn-discovery-continue');
        if (btn) btn.click();
      });
      await sleep(500);
    }

    // === TEST 8: Research notes state after discoveries ===
    note('\n=== TEST 8: Research notes state ===');
    await page.evaluate(() => {
      const rn = document.querySelector('.research-notes');
      if (rn) rn.scrollIntoView();
    });
    await sleep(300);
    await screenshot(page, 'research_notes_after');

    const rnState = await page.evaluate(() => {
      const notes = document.querySelectorAll('.research-note');
      return Array.from(notes).map(n => ({
        classes: n.className,
        title: (n.querySelector('strong') || {}).innerText,
        text: n.innerText.substring(0, 150)
      }));
    });
    note(`Research notes: ${JSON.stringify(rnState, null, 2)}`);

    // === TEST 9: Journal button (in top bar) ===
    note('\n=== TEST 9: Journal ===');
    await page.evaluate(() => {
      const btn = document.getElementById('btn-journal');
      if (btn) btn.click();
    });
    await sleep(1000);
    await screenshot(page, 'journal_screen');

    const journalActive = await page.evaluate(() => {
      const s = document.querySelector('.screen.active');
      return s ? s.id : 'none';
    });
    note(`Journal screen active: ${journalActive}`);

    const journalEntries = await page.evaluate(() => {
      const entries = document.querySelectorAll('.journal-entry, .journal-item, .journal-list li, .journal-sidebar .element-card');
      return Array.from(entries).slice(0, 10).map(e => e.innerText.substring(0, 50));
    });
    note(`Journal entries: ${JSON.stringify(journalEntries)}`);

    // Navigate back
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.innerText.match(/back|←/i) && b.offsetParent !== null) { b.click(); return; }
      }
    });
    await sleep(500);

    // === TEST 10: Challenges ===
    note('\n=== TEST 10: Challenges ===');
    await page.evaluate(() => {
      const btn = document.getElementById('btn-challenges-game');
      if (btn) btn.click();
    });
    await sleep(1000);
    await screenshot(page, 'challenges_screen');

    const challengeActive = await page.evaluate(() => {
      const s = document.querySelector('.screen.active');
      return s ? s.id : 'none';
    });
    note(`Challenges screen active: ${challengeActive}`);

    const challengeContent = await page.evaluate(() => {
      const s = document.querySelector('.screen.active');
      return s ? s.innerText.substring(0, 800) : 'none';
    });
    note(`Challenges content: ${challengeContent}`);

    // Back to game
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.innerText.match(/back|←/i) && b.offsetParent !== null) { b.click(); return; }
      }
    });
    await sleep(500);

    // === TEST 11: Click element to see info panel ===
    note('\n=== TEST 11: Info panel ===');
    await page.evaluate(() => {
      document.querySelector('[data-element-id="proton"]').click();
    });
    await sleep(500);
    await screenshot(page, 'info_panel_proton');

    const infoPanelContent = await page.evaluate(() => {
      const panel = document.getElementById('info-panel');
      return panel ? panel.innerText.substring(0, 800) : null;
    });
    note(`Info panel for Proton: ${infoPanelContent}`);

    // === TEST 12: Recent discoveries section ===
    note('\n=== TEST 12: Recent discoveries ===');
    const recentDisc = await page.evaluate(() => {
      const section = document.querySelector('.recent-discoveries');
      return section ? section.innerText.substring(0, 500) : null;
    });
    note(`Recent discoveries: ${recentDisc}`);

    // === TEST 13: Era filter ===
    note('\n=== TEST 13: Era filter ===');
    const eraOptions = await page.evaluate(() => {
      const sel = document.querySelector('.panel-left select');
      return sel ? Array.from(sel.options).map(o => ({ text: o.text, value: o.value })) : [];
    });
    note(`Era filter options: ${JSON.stringify(eraOptions)}`);

    // Select Era 2
    if (eraOptions.length > 1) {
      await page.evaluate(() => {
        const sel = document.querySelector('.panel-left select');
        if (sel) {
          sel.value = sel.options[1].value;
          sel.dispatchEvent(new Event('change'));
        }
      });
      await sleep(500);
      await screenshot(page, 'era_filter_2');

      const filteredElements = await page.evaluate(() => {
        const cards = document.querySelectorAll('.element-card');
        return Array.from(cards).filter(c => c.offsetParent !== null).map(c => c.innerText.substring(0, 30));
      });
      note(`Elements after era filter: ${JSON.stringify(filteredElements)}`);

      // Reset filter
      await page.evaluate(() => {
        const sel = document.querySelector('.panel-left select');
        if (sel) { sel.value = ''; sel.dispatchEvent(new Event('change')); }
      });
      await sleep(300);
    }

    // === TEST 14: Menu button ===
    note('\n=== TEST 14: Menu ===');
    await page.evaluate(() => {
      document.getElementById('btn-menu').click();
    });
    await sleep(500);
    await screenshot(page, 'menu');

    const menuText = await page.evaluate(() => {
      // Look for menu modal or dropdown
      const modals = document.querySelectorAll('.modal-backdrop.active, .menu, .dropdown-menu');
      for (const m of modals) {
        if (m.innerText.trim().length > 5) return m.innerText.substring(0, 300);
      }
      return null;
    });
    note(`Menu content: ${menuText}`);

    // === FINAL SUMMARY ===
    count = await page.$eval('#discovery-count', el => el.innerText);
    note(`\n=== FINAL SUMMARY ===`);
    note(`Final discovery count: ${count}`);
    note(`Console errors: ${consoleErrors.length}`);
    consoleErrors.forEach(e => note(`  ERROR: ${e}`));

  } catch (e) {
    console.error(`FATAL: ${e.message}\n${e.stack}`);
    await screenshot(page, 'error');
  }

  await sleep(2000);
  await browser.close();
})();
