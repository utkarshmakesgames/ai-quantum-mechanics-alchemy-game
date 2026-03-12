const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '.claude', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let screenshotCount = 30;
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
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  try {
    // Load game fresh
    await page.goto('http://localhost:8742/?v=5', { waitUntil: 'networkidle0' });
    await sleep(1000);

    // Click New Game
    await page.click('#btn-new-game');
    await sleep(1000);
    await screenshot(page, 'tutorial_step1');

    // Read tutorial step 1
    const step1Text = await page.evaluate(() => {
      const modal = document.querySelector('.modal-content');
      return modal ? modal.innerText : 'no modal';
    });
    note(`Tutorial Step 1: ${step1Text}`);

    // Click "How does it work?" to advance tutorial
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal-content button, .modal button');
      for (const b of btns) {
        if (b.offsetParent !== null || getComputedStyle(b).display !== 'none') {
          console.log('Clicking tutorial button:', b.innerText);
          b.click();
          return b.innerText;
        }
      }
    });
    await sleep(1000);
    await screenshot(page, 'tutorial_step2');

    // Read tutorial step 2
    const step2Text = await page.evaluate(() => {
      const modal = document.querySelector('.modal-content');
      return modal ? modal.innerText : 'no modal found';
    });
    note(`Tutorial Step 2: ${step2Text}`);

    // Check if there's another button to advance
    const step2Btn = await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal-content button, .modal button');
      return Array.from(btns).filter(b => b.offsetParent !== null).map(b => b.innerText);
    });
    note(`Tutorial step 2 buttons: ${JSON.stringify(step2Btn)}`);

    // Click through remaining tutorial
    for (let i = 0; i < 5; i++) {
      const clicked = await page.evaluate(() => {
        const btns = document.querySelectorAll('.modal-content button, .modal button');
        for (const b of btns) {
          if (b.offsetParent !== null) {
            b.click();
            return b.innerText;
          }
        }
        return null;
      });
      if (!clicked) break;
      note(`Clicked tutorial button: "${clicked}"`);
      await sleep(800);
    }

    // Check if modal is dismissed
    const modalGone = await page.evaluate(() => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) return true;
      return getComputedStyle(backdrop).display === 'none' || !backdrop.classList.contains('active');
    });
    note(`Modal dismissed: ${modalGone}`);

    // If modal still showing, click backdrop to dismiss
    if (!modalGone) {
      await page.evaluate(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.click();
      });
      await sleep(500);
    }

    await screenshot(page, 'game_ready');

    // ====== Now properly combine elements ======
    note('\n=== COMBINING: Up Quark + Gluon ===');

    // Click Up Quark
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card');
      for (const c of cards) {
        if (c.dataset.elementId === 'up_quark') { c.click(); return; }
      }
    });
    await sleep(500);

    // Check forge state
    let forgeState = await page.evaluate(() => {
      const slots = document.querySelectorAll('.forge-slot');
      return Array.from(slots).map(s => s.innerText.trim());
    });
    note(`Forge after clicking Up Quark: ${JSON.stringify(forgeState)}`);

    // Click Gluon
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card');
      for (const c of cards) {
        if (c.dataset.elementId === 'gluon') { c.click(); return; }
      }
    });
    await sleep(500);

    forgeState = await page.evaluate(() => {
      const slots = document.querySelectorAll('.forge-slot');
      return Array.from(slots).map(s => s.innerText.trim());
    });
    note(`Forge after clicking Gluon: ${JSON.stringify(forgeState)}`);
    await screenshot(page, 'forge_up_quark_gluon');

    // Click COMBINE button
    const combineBtn = await page.$('#btn-combine, .btn-combine, button.combine');
    if (combineBtn) {
      await combineBtn.click();
      note('Clicked COMBINE button');
    } else {
      // Try finding combine button by text
      await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
          if (b.innerText.match(/combine/i) && b.offsetParent !== null) {
            b.click();
            return;
          }
        }
      });
      note('Clicked COMBINE button (by text)');
    }
    await sleep(1500);
    await screenshot(page, 'after_combine_up_quark_gluon');

    // Check for discovery modal
    const discoveryModal = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal-content, .discovery-modal');
      for (const m of modals) {
        if (m.offsetParent !== null && m.innerText.trim().length > 10) {
          return m.innerText.substring(0, 800);
        }
      }
      return null;
    });
    note(`Discovery modal content: ${discoveryModal}`);

    if (discoveryModal) {
      await screenshot(page, 'discovery_modal_proton');
      // Check for educational content sections
      const hasWhatYouBuilt = discoveryModal.includes('What you built') || discoveryModal.includes('what you built');
      const hasWeirdPart = discoveryModal.includes('weird part') || discoveryModal.includes('Weird part');
      const hasNowTry = discoveryModal.includes('Now try') || discoveryModal.includes('now try');
      note(`Educational sections - What you built: ${hasWhatYouBuilt}, Weird part: ${hasWeirdPart}, Now try: ${hasNowTry}`);
    }

    // Dismiss discovery modal
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal-content button, .modal button');
      for (const b of btns) {
        if (b.offsetParent !== null) { b.click(); return; }
      }
    });
    await sleep(500);

    // Check discovery count
    let count = await page.$eval('.discovery-counter', el => el.innerText);
    note(`Discovery count after proton: ${count}`);

    // ====== Combine Down Quark + Gluon ======
    note('\n=== COMBINING: Down Quark + Gluon ===');
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card');
      for (const c of cards) {
        if (c.dataset.elementId === 'down_quark') { c.click(); return; }
      }
    });
    await sleep(300);
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card');
      for (const c of cards) {
        if (c.dataset.elementId === 'gluon') { c.click(); return; }
      }
    });
    await sleep(300);
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) { b.click(); return; }
      }
    });
    await sleep(1500);
    await screenshot(page, 'after_combine_down_quark_gluon');

    const disc2 = await page.evaluate(() => {
      const m = document.querySelector('.modal-content');
      return m && m.offsetParent !== null ? m.innerText.substring(0, 800) : null;
    });
    note(`Discovery modal for Down Quark + Gluon: ${disc2}`);

    // Dismiss
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal-content button');
      for (const b of btns) { if (b.offsetParent !== null) { b.click(); return; } }
    });
    await sleep(500);

    // ====== Combine Electron + Photon ======
    note('\n=== COMBINING: Electron + Photon ===');
    await page.evaluate(() => {
      document.querySelectorAll('.element-card').forEach(c => {
        if (c.dataset.elementId === 'electron') c.click();
      });
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('.element-card').forEach(c => {
        if (c.dataset.elementId === 'photon') c.click();
      });
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1500);
    await screenshot(page, 'after_combine_electron_photon');

    const disc3 = await page.evaluate(() => {
      const m = document.querySelector('.modal-content');
      return m && m.offsetParent !== null ? m.innerText.substring(0, 800) : null;
    });
    note(`Discovery modal for Electron + Photon: ${disc3}`);

    // Dismiss
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal-content button');
      for (const b of btns) { if (b.offsetParent !== null) { b.click(); return; } }
    });
    await sleep(500);

    // ====== WRONG COMBO: Electron + Electron ======
    note('\n=== WRONG COMBO: Electron + Electron ===');
    await page.evaluate(() => {
      document.querySelectorAll('.element-card').forEach(c => {
        if (c.dataset.elementId === 'electron') c.click();
      });
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('.element-card').forEach(c => {
        if (c.dataset.elementId === 'electron') c.click();
      });
    });
    await sleep(300);

    forgeState = await page.evaluate(() => {
      const slots = document.querySelectorAll('.forge-slot');
      return Array.from(slots).map(s => s.innerText.trim());
    });
    note(`Forge state for Electron + Electron: ${JSON.stringify(forgeState)}`);

    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1500);
    await screenshot(page, 'wrong_combo_electron_electron');

    // Check for failure/toast message
    const failureMsg = await page.evaluate(() => {
      // Check many possible selectors for failure messages
      const selectors = ['.toast', '.notification', '.feedback', '.fail-message', '.result-fail',
        '[class*="toast"]', '[class*="fail"]', '[class*="error-msg"]', '[class*="feedback"]',
        '.forge-result', '.combine-result', '#combine-result'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.offsetParent !== null && el.innerText.trim()) {
          return { selector: sel, text: el.innerText.substring(0, 300) };
        }
      }
      // Also check for any recently appeared element
      const all = document.querySelectorAll('*');
      for (const el of all) {
        if (el.className && typeof el.className === 'string' && el.className.includes('fail')) {
          return { selector: el.className, text: el.innerText.substring(0, 300) };
        }
      }
      return null;
    });
    note(`Failure message: ${JSON.stringify(failureMsg)}`);

    // ====== WRONG COMBO: Photon + Neutrino ======
    note('\n=== WRONG COMBO: Photon + Neutrino ===');
    await page.evaluate(() => {
      document.querySelectorAll('.element-card').forEach(c => {
        if (c.dataset.elementId === 'photon') c.click();
      });
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('.element-card').forEach(c => {
        if (c.dataset.elementId === 'neutrino') c.click();
      });
    });
    await sleep(300);
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(b => {
        if (b.innerText.match(/combine/i) && b.offsetParent !== null) b.click();
      });
    });
    await sleep(1500);

    const failMsg2 = await page.evaluate(() => {
      // Look for any visible text that appeared recently - toast, notification, etc.
      const body = document.body.innerText;
      return body.substring(0, 200); // Just dump some text
    });
    await screenshot(page, 'wrong_combo_photon_neutrino');

    // Check the forge area specifically for feedback
    const forgeAreaText = await page.evaluate(() => {
      const forge = document.querySelector('.forge-area, .panel-center');
      return forge ? forge.innerText.substring(0, 500) : null;
    });
    note(`Forge area text after wrong combo: ${forgeAreaText}`);

    // ====== CHECK ELEMENT INFO PANEL ======
    note('\n=== ELEMENT INFO PANEL ===');
    await page.evaluate(() => {
      document.querySelectorAll('.element-card').forEach(c => {
        if (c.dataset.elementId === 'up_quark') c.click();
      });
    });
    await sleep(500);
    const infoContent = await page.evaluate(() => {
      const info = document.querySelector('#info-panel, .info-panel, .panel-right');
      return info ? info.innerText.substring(0, 800) : null;
    });
    note(`Info panel for Up Quark: ${infoContent}`);
    await screenshot(page, 'info_panel_up_quark');

    // ====== CHECK COMMAND BAR ======
    note('\n=== COMMAND BAR ===');
    const cmdBar = await page.evaluate(() => {
      const bar = document.querySelector('.cmd-bar, #cmd-bar, [class*="cmd"]');
      return bar ? { visible: bar.offsetParent !== null, text: bar.innerText.substring(0, 200), html: bar.innerHTML.substring(0, 300) } : null;
    });
    note(`Command bar: ${JSON.stringify(cmdBar)}`);

    if (cmdBar && cmdBar.visible) {
      const cmdInput = await page.$('.cmd-bar input, .cmd-input, #cmd-input');
      if (cmdInput) {
        // Test "help"
        await cmdInput.click();
        await page.keyboard.type('help');
        await page.keyboard.press('Enter');
        await sleep(500);
        await screenshot(page, 'cmd_help');

        const cmdOutput = await page.evaluate(() => {
          const bar = document.querySelector('.cmd-bar, .cmd-output');
          return bar ? bar.innerText.substring(0, 500) : null;
        });
        note(`Help output: ${cmdOutput}`);

        // Test "list"
        await cmdInput.click({ clickCount: 3 });
        await page.keyboard.type('list');
        await page.keyboard.press('Enter');
        await sleep(500);
        await screenshot(page, 'cmd_list');

        // Test "combine Up Quark + Gluon"
        await cmdInput.click({ clickCount: 3 });
        await page.keyboard.type('combine Up Quark + Gluon');
        await page.keyboard.press('Enter');
        await sleep(1500);
        await screenshot(page, 'cmd_combine');

        const cmdResult = await page.evaluate(() => {
          const bar = document.querySelector('.cmd-bar');
          return bar ? bar.innerText.substring(0, 500) : null;
        });
        note(`Combine via cmd result: ${cmdResult}`);
      }
    }

    // ====== JOURNAL ======
    note('\n=== JOURNAL ===');
    await page.click('#btn-journal');
    await sleep(1000);
    await screenshot(page, 'journal_screen');

    const journalText = await page.evaluate(() => {
      // Find active screen or modal
      const screens = document.querySelectorAll('.screen.active, .modal.active, .modal-backdrop.active');
      for (const s of screens) {
        if (s.innerText.trim().length > 20) return s.innerText.substring(0, 1500);
      }
      return document.body.innerText.substring(0, 1000);
    });
    note(`Journal content: ${journalText}`);

    // Go back
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.innerText.match(/back|close|return|x/i) && b.offsetParent !== null) { b.click(); return; }
      }
    });
    await sleep(500);

    // ====== CHALLENGES ======
    note('\n=== CHALLENGES ===');
    const chBtn = await page.$('#btn-challenges-game');
    if (chBtn) {
      await chBtn.click();
      await sleep(1000);
      await screenshot(page, 'challenges_screen');

      const challengeText = await page.evaluate(() => {
        const screens = document.querySelectorAll('.screen.active, .modal.active, .modal-backdrop.active');
        for (const s of screens) {
          if (s.innerText.trim().length > 20) return s.innerText.substring(0, 1500);
        }
        return null;
      });
      note(`Challenges content: ${challengeText}`);

      // Go back
      await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
          if (b.innerText.match(/back|close|return/i) && b.offsetParent !== null) { b.click(); return; }
        }
      });
      await sleep(500);
    }

    // ====== CHECK RECENT DISCOVERIES ======
    note('\n=== RECENT DISCOVERIES ===');
    const recentDisc = await page.evaluate(() => {
      const section = document.querySelector('.recent-discoveries');
      return section ? section.innerText.substring(0, 500) : null;
    });
    note(`Recent discoveries: ${recentDisc}`);

    // ====== RESEARCH NOTES STATE ======
    note('\n=== RESEARCH NOTES STATE ===');
    const rnState = await page.evaluate(() => {
      const notes = document.querySelectorAll('.research-note');
      return Array.from(notes).map(n => ({
        title: n.querySelector('strong, h3, h4, .note-title') ? n.querySelector('strong, h3, h4, .note-title').innerText : 'untitled',
        completed: n.classList.contains('completed') || n.classList.contains('done'),
        text: n.innerText.substring(0, 200)
      }));
    });
    note(`Research notes state: ${JSON.stringify(rnState)}`);
    await screenshot(page, 'research_notes_state');

    // ====== ERA DROPDOWN ======
    note('\n=== ERA FILTER ===');
    const eraDropdown = await page.$('select, .era-select, #era-filter');
    if (eraDropdown) {
      const options = await page.evaluate(() => {
        const sel = document.querySelector('select');
        return sel ? Array.from(sel.options).map(o => o.text) : [];
      });
      note(`Era options: ${JSON.stringify(options)}`);
    }

    // ====== MENU ======
    note('\n=== MENU ===');
    await page.click('#btn-menu');
    await sleep(500);
    await screenshot(page, 'menu');

    const menuContent = await page.evaluate(() => {
      const menus = document.querySelectorAll('.menu, .sidebar-menu, [class*="menu"]');
      for (const m of menus) {
        if (m.offsetParent !== null && m.innerText.trim().length > 5) {
          return m.innerText.substring(0, 500);
        }
      }
      return null;
    });
    note(`Menu content: ${menuContent}`);

    // ====== FINAL STATE ======
    count = await page.$eval('.discovery-counter', el => el.innerText);
    note(`Final discovery count: ${count}`);
    note(`Console errors: ${consoleErrors.length}`);
    consoleErrors.forEach(e => note(`  ERROR: ${e}`));
    await screenshot(page, 'final');

  } catch (e) {
    console.error(`FATAL: ${e.message}\n${e.stack}`);
    await screenshot(page, 'error');
  }

  await sleep(2000);
  await browser.close();
})();
