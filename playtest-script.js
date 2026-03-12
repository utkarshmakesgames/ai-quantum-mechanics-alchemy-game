const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '.claude', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let screenshotCount = 0;
async function screenshot(page, label) {
  screenshotCount++;
  const fname = `${String(screenshotCount).padStart(2, '0')}_${label}.png`;
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, fname), fullPage: false });
  console.log(`[SCREENSHOT] ${fname}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function safeClick(page, selector, label) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 5000 });
    await page.click(selector);
    console.log(`[CLICK] ${label || selector}`);
    await sleep(500);
    return true;
  } catch (e) {
    console.log(`[WARN] Could not click ${label || selector}: ${e.message}`);
    return false;
  }
}

async function getVisibleText(page, selector) {
  try {
    return await page.$eval(selector, el => el.innerText);
  } catch {
    return null;
  }
}

async function getConsoleErrors(page) {
  // We collect these via event listener
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  // Collect console errors
  const consoleErrors = [];
  const consoleWarnings = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  const report = {
    consoleErrors: [],
    consoleWarnings: [],
    bugs: [],
    notes: [],
    screenshots: []
  };

  function note(text) {
    console.log(`[NOTE] ${text}`);
    report.notes.push(text);
  }

  function bug(severity, title, details) {
    console.log(`[BUG:${severity}] ${title}`);
    report.bugs.push({ severity, title, details });
  }

  try {
    // ====== LOAD GAME ======
    console.log('=== PHASE 1: Loading Game ===');
    await page.goto('http://localhost:8742/?v=5', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await screenshot(page, 'title_screen');

    // Check title screen elements
    const titleText = await getVisibleText(page, '.game-title');
    note(`Title screen shows: "${titleText}"`);

    const tagline = await getVisibleText(page, '.tagline');
    note(`Tagline: "${tagline}"`);

    // Check buttons
    const newGameBtn = await page.$('#btn-new-game');
    const continueBtn = await page.$('#btn-continue');
    const challengesBtn = await page.$('#btn-challenges');
    const journalBtn = await page.$('#btn-journal-title');
    note(`Title buttons present: New Game=${!!newGameBtn}, Continue=${!!continueBtn}, Challenges=${!!challengesBtn}, Journal=${!!journalBtn}`);

    // Check if Continue is visible
    const continueVisible = await page.$eval('#btn-continue', el => el.style.display !== 'none').catch(() => false);
    note(`Continue button visible: ${continueVisible}`);

    // ====== NEW GAME ======
    console.log('\n=== PHASE 2: Starting New Game ===');
    await safeClick(page, '#btn-new-game', 'New Game button');
    await sleep(1500);
    await screenshot(page, 'after_new_game');

    // Check for tutorial/modal
    const tutorialVisible = await page.$eval('.modal.active, .modal[style*="display: flex"], .modal[style*="display:flex"], #tutorial-modal',
      el => el && el.offsetParent !== null).catch(() => false);

    // Try broader search for any visible modal
    const anyModal = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [class*="modal"], [class*="tutorial"]');
      for (const m of modals) {
        if (m.offsetParent !== null || getComputedStyle(m).display !== 'none') {
          return { class: m.className, id: m.id, text: m.innerText.substring(0, 300) };
        }
      }
      return null;
    });
    note(`Tutorial/modal after New Game: ${JSON.stringify(anyModal)}`);
    await screenshot(page, 'tutorial_check');

    // If there's a tutorial, try to advance through it
    if (anyModal) {
      note('Tutorial detected - advancing through it');
      // Look for Next/Continue/OK buttons inside modal
      for (let step = 0; step < 5; step++) {
        const modalText = await page.evaluate(() => {
          const modals = document.querySelectorAll('.modal, [class*="modal"], [class*="tutorial"]');
          for (const m of modals) {
            if (m.offsetParent !== null || getComputedStyle(m).display !== 'none') {
              return m.innerText.substring(0, 500);
            }
          }
          return null;
        });

        if (!modalText) break;
        note(`Tutorial step ${step + 1} text: "${modalText.substring(0, 200)}..."`);
        await screenshot(page, `tutorial_step_${step + 1}`);

        // Try clicking next/continue/ok button
        const clicked = await page.evaluate(() => {
          const buttons = document.querySelectorAll('.modal button, [class*="modal"] button, [class*="tutorial"] button');
          for (const btn of buttons) {
            if (btn.offsetParent !== null && btn.innerText.match(/next|continue|ok|got it|start|begin|let's go|close/i)) {
              btn.click();
              return btn.innerText;
            }
          }
          // Try any visible button in modal
          for (const btn of buttons) {
            if (btn.offsetParent !== null) {
              btn.click();
              return btn.innerText;
            }
          }
          return null;
        });
        note(`Clicked tutorial button: "${clicked}"`);
        await sleep(1000);
      }
      await screenshot(page, 'after_tutorial');
    }

    // ====== GAME SCREEN ======
    console.log('\n=== PHASE 3: Exploring Game Screen ===');
    await sleep(500);
    await screenshot(page, 'game_screen');

    // Read discovery counter
    const discoveryCount = await getVisibleText(page, '.discovery-counter');
    note(`Discovery counter: "${discoveryCount}"`);

    // List all visible elements in the workspace
    const elements = await page.evaluate(() => {
      const els = document.querySelectorAll('.element-card, [class*="element"], .particle');
      return Array.from(els).filter(e => e.offsetParent !== null).map(e => ({
        text: e.innerText.substring(0, 100),
        class: e.className,
        id: e.id
      })).slice(0, 20);
    });
    note(`Visible elements (${elements.length}): ${JSON.stringify(elements.slice(0, 10))}`);

    // Check for Research Notes panel
    const researchNotes = await page.evaluate(() => {
      const panels = document.querySelectorAll('[class*="research"], [id*="research"], [class*="quest"], [id*="quest"]');
      return Array.from(panels).map(p => ({
        class: p.className,
        id: p.id,
        visible: p.offsetParent !== null || getComputedStyle(p).display !== 'none',
        text: p.innerText.substring(0, 200)
      }));
    });
    note(`Research Notes panels: ${JSON.stringify(researchNotes)}`);

    // Check for info panel on right side
    const infoPanel = await page.evaluate(() => {
      const panels = document.querySelectorAll('[class*="info"], [id*="info"], [class*="detail"], [id*="detail"], .sidebar, .right-panel');
      return Array.from(panels).filter(p => p.offsetParent !== null).map(p => ({
        class: p.className,
        id: p.id,
        text: p.innerText.substring(0, 200)
      })).slice(0, 5);
    });
    note(`Info panels: ${JSON.stringify(infoPanel)}`);

    // ====== TRY COMBINING: Up Quark + Gluon ======
    console.log('\n=== PHASE 4: Combining Up Quark + Gluon ===');

    // Find element cards and try to identify Up Quark and Gluon
    const elementCards = await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card, .element, .particle-card, [data-element]');
      return Array.from(cards).filter(c => c.offsetParent !== null).map(c => ({
        text: c.innerText.trim().substring(0, 100),
        id: c.id,
        class: c.className,
        dataset: c.dataset ? {...c.dataset} : {},
        selector: c.id ? `#${c.id}` : `.${c.className.split(' ')[0]}`,
      }));
    });
    note(`Found ${elementCards.length} element cards`);
    for (const card of elementCards.slice(0, 15)) {
      note(`  Card: "${card.text}" dataset=${JSON.stringify(card.dataset)}`);
    }

    // Try to find and click Up Quark
    const upQuarkClicked = await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card, .element, [data-element]');
      for (const c of cards) {
        if (c.innerText.includes('Up Quark') || c.dataset.element === 'Up Quark' || c.dataset.name === 'Up Quark' || c.dataset.id === 'up_quark') {
          c.click();
          return c.innerText.substring(0, 50);
        }
      }
      return null;
    });
    note(`Clicked Up Quark: ${upQuarkClicked}`);
    await sleep(500);
    await screenshot(page, 'clicked_up_quark');

    // Try to find and click Gluon
    const gluonClicked = await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card, .element, [data-element]');
      for (const c of cards) {
        if (c.innerText.includes('Gluon') || c.dataset.element === 'Gluon' || c.dataset.name === 'Gluon' || c.dataset.id === 'gluon') {
          c.click();
          return c.innerText.substring(0, 50);
        }
      }
      return null;
    });
    note(`Clicked Gluon: ${gluonClicked}`);
    await sleep(1000);
    await screenshot(page, 'clicked_gluon');

    // Check for combination result / discovery modal
    const discoveryModal = await page.evaluate(() => {
      const modals = document.querySelectorAll('.modal, [class*="modal"], [class*="discovery"]');
      for (const m of modals) {
        if (m.offsetParent !== null || (getComputedStyle(m).display !== 'none' && m.innerText.trim().length > 0)) {
          return { class: m.className, text: m.innerText.substring(0, 500) };
        }
      }
      return null;
    });
    note(`Discovery modal after combo: ${JSON.stringify(discoveryModal)}`);
    if (discoveryModal) {
      await screenshot(page, 'discovery_modal');
    }

    // If we see a discovery, dismiss it and continue
    if (discoveryModal) {
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('.modal button, [class*="modal"] button');
        for (const btn of buttons) {
          if (btn.offsetParent !== null && btn.innerText.match(/ok|close|got it|continue|awesome|great/i)) {
            btn.click();
            return;
          }
        }
      });
      await sleep(500);
    }

    // ====== TRY MORE COMBINATIONS ======
    console.log('\n=== PHASE 5: More Combinations ===');

    // Let's use the text command interface if it exists
    const cmdInput = await page.$('#command-input, [class*="command"] input, .text-input, #text-command');
    if (cmdInput) {
      note('Found command input - testing text commands');

      // Type "help"
      await cmdInput.click();
      await cmdInput.type('help');
      await page.keyboard.press('Enter');
      await sleep(500);
      await screenshot(page, 'command_help');

      const helpOutput = await page.evaluate(() => {
        const outputs = document.querySelectorAll('[class*="output"], [class*="log"], [class*="console"], [class*="response"]');
        return Array.from(outputs).map(o => o.innerText.substring(0, 500)).join('\n');
      });
      note(`Help command output: ${helpOutput}`);

      // Type "list"
      await cmdInput.click({ clickCount: 3 });
      await cmdInput.type('list');
      await page.keyboard.press('Enter');
      await sleep(500);
      await screenshot(page, 'command_list');

      // Type "combine Up Quark + Gluon"
      await cmdInput.click({ clickCount: 3 });
      await cmdInput.type('combine Up Quark + Gluon');
      await page.keyboard.press('Enter');
      await sleep(1000);
      await screenshot(page, 'command_combine');

      const combineOutput = await page.evaluate(() => {
        const outputs = document.querySelectorAll('[class*="output"], [class*="log"], [class*="console"], [class*="response"]');
        return Array.from(outputs).map(o => o.innerText.substring(0, 500)).join('\n');
      });
      note(`Combine command output: ${combineOutput}`);
    } else {
      note('No command input found');
    }

    // Try combining via drag-and-drop or click-click
    // Let's try a few more combos
    const combosToTry = [
      ['Down Quark', 'Gluon'],
      ['Electron', 'Photon'],
      ['Up Quark', 'Down Quark'],
      ['Electron', 'Up Quark'],  // Probably wrong - test failure message
    ];

    for (const [a, b] of combosToTry) {
      note(`Trying combo: ${a} + ${b}`);

      // Click first element
      await page.evaluate((name) => {
        const cards = document.querySelectorAll('.element-card, .element, [data-element]');
        for (const c of cards) {
          if (c.innerText.includes(name) || c.dataset.element === name || c.dataset.name === name) {
            c.click();
            return true;
          }
        }
        return false;
      }, a);
      await sleep(300);

      // Click second element
      await page.evaluate((name) => {
        const cards = document.querySelectorAll('.element-card, .element, [data-element]');
        for (const c of cards) {
          if (c.innerText.includes(name) || c.dataset.element === name || c.dataset.name === name) {
            c.click();
            return true;
          }
        }
        return false;
      }, b);
      await sleep(1000);

      // Check for result
      const result = await page.evaluate(() => {
        // Check for modals
        const modals = document.querySelectorAll('.modal, [class*="modal"], [class*="discovery"]');
        for (const m of modals) {
          if (m.offsetParent !== null || getComputedStyle(m).display !== 'none') {
            if (m.innerText.trim().length > 10) {
              return { type: 'modal', text: m.innerText.substring(0, 500) };
            }
          }
        }
        // Check for toast/notification/failure message
        const toasts = document.querySelectorAll('[class*="toast"], [class*="notification"], [class*="message"], [class*="feedback"], [class*="result"], [class*="failure"], [class*="error-msg"]');
        for (const t of toasts) {
          if (t.offsetParent !== null && t.innerText.trim().length > 0) {
            return { type: 'toast', text: t.innerText.substring(0, 300) };
          }
        }
        return null;
      });
      note(`Result of ${a} + ${b}: ${JSON.stringify(result)}`);
      await screenshot(page, `combo_${a.replace(/\s/g, '_')}_${b.replace(/\s/g, '_')}`);

      // Dismiss any modal
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('.modal button');
        for (const btn of buttons) {
          if (btn.offsetParent !== null) { btn.click(); return; }
        }
      });
      await sleep(500);
    }

    // ====== WRONG COMBINATIONS - TEST FAILURE MESSAGES ======
    console.log('\n=== PHASE 6: Testing Wrong Combinations ===');
    const wrongCombos = [
      ['Photon', 'Photon'],
      ['Electron', 'Electron'],
      ['Gluon', 'Gluon'],
    ];

    for (const [a, b] of wrongCombos) {
      note(`Trying WRONG combo: ${a} + ${b}`);

      await page.evaluate((name) => {
        const cards = document.querySelectorAll('.element-card, .element, [data-element]');
        for (const c of cards) {
          if (c.innerText.includes(name)) { c.click(); return true; }
        }
        return false;
      }, a);
      await sleep(300);

      await page.evaluate((name) => {
        const cards = document.querySelectorAll('.element-card, .element, [data-element]');
        for (const c of cards) {
          if (c.innerText.includes(name)) { c.click(); return true; }
        }
        return false;
      }, b);
      await sleep(1000);

      const failMsg = await page.evaluate(() => {
        const msgs = document.querySelectorAll('[class*="toast"], [class*="notification"], [class*="message"], [class*="feedback"], [class*="failure"], [class*="error"]');
        for (const m of msgs) {
          if (m.offsetParent !== null && m.innerText.trim().length > 0) {
            return m.innerText.substring(0, 300);
          }
        }
        return null;
      });
      note(`Failure message for ${a} + ${b}: ${failMsg}`);
      await screenshot(page, `wrong_${a.replace(/\s/g, '_')}_${b.replace(/\s/g, '_')}`);
      await sleep(500);
    }

    // ====== CHECK RESEARCH NOTES ======
    console.log('\n=== PHASE 7: Research Notes Panel ===');

    // Try to find and click research notes button/tab
    const rnClicked = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, [class*="tab"], [class*="research"]');
      for (const b of btns) {
        if (b.innerText.match(/research|notes|guide|quest/i) && b.offsetParent !== null) {
          b.click();
          return b.innerText;
        }
      }
      return null;
    });
    note(`Clicked Research Notes: ${rnClicked}`);
    await sleep(500);
    await screenshot(page, 'research_notes');

    const rnContent = await page.evaluate(() => {
      const panels = document.querySelectorAll('[class*="research"], [id*="research"], [class*="quest"]');
      for (const p of panels) {
        if (p.innerText.trim().length > 20) {
          return p.innerText.substring(0, 1000);
        }
      }
      return null;
    });
    note(`Research Notes content: ${rnContent}`);

    // ====== CHECK JOURNAL ======
    console.log('\n=== PHASE 8: Journal ===');

    const journalClicked = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, [class*="tab"]');
      for (const b of btns) {
        if (b.innerText.match(/journal/i) && b.offsetParent !== null) {
          b.click();
          return b.innerText;
        }
      }
      return null;
    });
    note(`Clicked Journal: ${journalClicked}`);
    await sleep(500);
    await screenshot(page, 'journal');

    const journalContent = await page.evaluate(() => {
      const panels = document.querySelectorAll('[class*="journal"], [id*="journal"], .modal');
      for (const p of panels) {
        if (p.offsetParent !== null && p.innerText.trim().length > 20) {
          return p.innerText.substring(0, 1000);
        }
      }
      return null;
    });
    note(`Journal content: ${journalContent}`);

    // Dismiss journal
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.modal button, [class*="close"], .btn-close');
      for (const b of btns) {
        if (b.offsetParent !== null && b.innerText.match(/close|ok|back|x/i)) {
          b.click(); return;
        }
      }
    });
    await sleep(500);

    // ====== CHECK CHALLENGES ======
    console.log('\n=== PHASE 9: Challenges ===');

    const challengesClicked = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.innerText.match(/challenge/i) && b.offsetParent !== null) {
          b.click();
          return b.innerText;
        }
      }
      return null;
    });
    note(`Clicked Challenges: ${challengesClicked}`);
    await sleep(500);
    await screenshot(page, 'challenges');

    const challengesContent = await page.evaluate(() => {
      const panels = document.querySelectorAll('[class*="challenge"], [id*="challenge"], .modal, .screen.active');
      for (const p of panels) {
        if (p.offsetParent !== null && p.innerText.trim().length > 20) {
          return p.innerText.substring(0, 1000);
        }
      }
      return null;
    });
    note(`Challenges content: ${challengesContent}`);

    // Go back
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.innerText.match(/back|close|return/i) && b.offsetParent !== null) {
          b.click(); return;
        }
      }
    });
    await sleep(500);

    // ====== ELEMENT SEARCH/FILTER ======
    console.log('\n=== PHASE 10: Element Search/Filter ===');

    const searchInput = await page.$('#element-search, [class*="search"] input, input[placeholder*="search"], input[placeholder*="filter"]');
    if (searchInput) {
      note('Found search input - testing search');
      await searchInput.click();
      await searchInput.type('quark');
      await sleep(500);
      await screenshot(page, 'search_quark');

      const searchResults = await page.evaluate(() => {
        const cards = document.querySelectorAll('.element-card, .element, [data-element]');
        return Array.from(cards).filter(c => c.offsetParent !== null).map(c => c.innerText.substring(0, 50));
      });
      note(`Search results for "quark": ${JSON.stringify(searchResults)}`);

      // Clear search
      await searchInput.click({ clickCount: 3 });
      await searchInput.type('');
      await page.keyboard.press('Backspace');
      await sleep(300);
    } else {
      note('No search input found');
    }

    // ====== ELEMENT INFO PANEL ======
    console.log('\n=== PHASE 11: Element Info Panel ===');

    // Click an element and check if info appears on right side
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.element-card, .element, [data-element]');
      if (cards.length > 0) cards[0].click();
    });
    await sleep(500);
    await screenshot(page, 'element_info_panel');

    const infoPanelContent = await page.evaluate(() => {
      const panels = document.querySelectorAll('[class*="info"], [class*="detail"], [class*="sidebar"], .element-info, #element-info');
      for (const p of panels) {
        if (p.offsetParent !== null && p.innerText.trim().length > 20) {
          return p.innerText.substring(0, 500);
        }
      }
      return null;
    });
    note(`Element info panel: ${infoPanelContent}`);

    // ====== CATEGORY FILTERS ======
    console.log('\n=== PHASE 12: Category Filters ===');

    const categoryBtns = await page.evaluate(() => {
      const btns = document.querySelectorAll('[class*="category"], [class*="filter"] button, .tab-btn');
      return Array.from(btns).filter(b => b.offsetParent !== null).map(b => b.innerText.substring(0, 30));
    });
    note(`Category filter buttons: ${JSON.stringify(categoryBtns)}`);

    if (categoryBtns.length > 1) {
      // Click second category
      await page.evaluate(() => {
        const btns = document.querySelectorAll('[class*="category"], [class*="filter"] button, .tab-btn');
        const visible = Array.from(btns).filter(b => b.offsetParent !== null);
        if (visible.length > 1) visible[1].click();
      });
      await sleep(500);
      await screenshot(page, 'category_filter');
    }

    // ====== FULL PAGE STRUCTURE ======
    console.log('\n=== PHASE 13: Full Page Analysis ===');

    const fullStructure = await page.evaluate(() => {
      const active = document.querySelector('.screen.active');
      if (!active) return 'No active screen';

      function describe(el, depth) {
        if (depth > 3) return '';
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${el.className.toString().split(' ').slice(0, 2).join('.')}` : '';
        const id = el.id ? `#${el.id}` : '';
        const text = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? ` "${el.textContent.substring(0, 30)}"` : '';
        const vis = el.offsetParent !== null ? '' : ' [hidden]';
        let result = '  '.repeat(depth) + `${tag}${id}${cls}${text}${vis}\n`;
        for (const child of el.children) {
          result += describe(child, depth + 1);
        }
        return result;
      }
      return describe(active, 0);
    });
    note(`Active screen structure:\n${fullStructure}`);

    // ====== COMBO COUNT BADGES ======
    console.log('\n=== PHASE 14: Combo Count Badges ===');

    const badges = await page.evaluate(() => {
      const els = document.querySelectorAll('[class*="badge"], [class*="count"], [class*="combo"]');
      return Array.from(els).filter(e => e.offsetParent !== null).map(e => ({
        class: e.className,
        text: e.innerText.substring(0, 50)
      }));
    });
    note(`Combo badges: ${JSON.stringify(badges)}`);

    // ====== FINAL STATE ======
    console.log('\n=== PHASE 15: Final State & Errors ===');
    await screenshot(page, 'final_state');

    const finalDiscovery = await getVisibleText(page, '.discovery-counter');
    note(`Final discovery count: "${finalDiscovery}"`);

    report.consoleErrors = consoleErrors;
    report.consoleWarnings = consoleWarnings;
    note(`Console errors: ${consoleErrors.length}`);
    note(`Console warnings: ${consoleWarnings.length}`);
    for (const err of consoleErrors) {
      note(`  ERROR: ${err}`);
    }

    // Write raw report data
    fs.writeFileSync(
      path.join(__dirname, '.claude', 'playtest-raw.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('\n=== Playtest complete! Raw data saved. ===');

  } catch (e) {
    console.error(`FATAL ERROR: ${e.message}`);
    console.error(e.stack);
    await screenshot(page, 'error_state');
    report.bugs.push({ severity: 'CRITICAL', title: 'Script error', details: e.message });
    fs.writeFileSync(
      path.join(__dirname, '.claude', 'playtest-raw.json'),
      JSON.stringify(report, null, 2)
    );
  }

  // Keep browser open for a moment for final screenshots
  await sleep(2000);
  await browser.close();
})();
