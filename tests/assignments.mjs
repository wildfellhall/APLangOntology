import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {skillSets,conceptSets,conceptById,questionsForConcept} from '../src/data/index.js';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const page=await context.newPage();
const base=process.env.TEST_URL||'http://127.0.0.1:4175/';if(!['127.0.0.1','localhost','[::1]'].includes(new URL(base).hostname))throw Error('Browser tests require a local port');const errors=[],access=[];page.on('pageerror',e=>errors.push(e.message));
const nav=async route=>{await page.goto(base+route);await page.locator('h1').waitFor();};
const axe=async label=>{const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();access.push({label,violations:r.violations});};
try{
 await nav('#/practice');await page.getByText('Review by official skill · 22 sets',{exact:true}).click();await expect(page.locator('.skill-directory a')).toHaveCount(22);
 // Every item and its stimulus are rendered through the actual set selector/reader interface.
 for(const set of skillSets){await nav(`#/practice/${set.id}`);await expect(page.locator('#practice-skill')).toHaveValue(set.id);await page.getByLabel('Show complete set',{exact:true}).check();await expect(page.locator('.question-card')).toHaveCount(10);for(const q of set.questions){await expect(page.locator(`#question-${q.id.replaceAll('.','\\.')}`)).toContainText(q.stem);}await expect(page.locator('.mcq-passage')).toHaveCount(5);if(Number(set.id[0])%2===0){for(const passage of await page.locator('.mcq-passage').all()){const numbers=await passage.locator('.sentence-number').allTextContents();expect(numbers).toEqual(Array.from({length:numbers.length},(_,i)=>`(${i+1})`));}}}
 // Every concept exposes its own ten canonical items, including new reading/revision views.
 for(const set of conceptSets){
  await nav(`#/concept/${set.id}/practice`);
  await page.getByLabel('Show complete set',{exact:true}).check();
  await expect(page.locator('.question-card')).toHaveCount(10);
  for(const q of set.questions)await expect(page.locator(`[id="question-${q.id}"]`)).toContainText(q.stem);
  await page.getByLabel('Show complete set',{exact:true}).uncheck();
  await page.getByRole('button',{name:'Question 10',exact:true}).click();
  await expect(page.locator('.question-card')).toContainText(set.questions[9].stem);
 }
 await nav('#/concept/rhetorical-situation/practice');
 const q=questionsForConcept(conceptById['rhetorical-situation'])[0];let card=page.locator('.question-card').first();
 await card.locator('.answer-option').nth((q.correct+1)%4).click();await card.getByRole('button',{name:'Check answer'}).click();await expect(card.locator('.answer-feedback')).toContainText('The best answer');
 await card.getByRole('button',{name:'Try again'}).click();await card.locator('.answer-option').nth(q.correct).click();await card.getByRole('button',{name:'Check answer'}).click();await expect(page.locator('.skill-status')).toContainText('1 of 10 checked · 1 correct');
 await page.reload();await expect(page.locator('.answer-feedback')).toContainText('Correct.');
 // Concepts are exclusive; the official-skill review remains another view of the old canonical item.
 await nav('#/concept/audience/practice');await expect(page.locator('.answer-feedback')).toHaveCount(0);await nav('#/practice/1.A');await expect(page.locator('.answer-feedback')).toContainText('Correct.');
 await page.getByRole('button',{name:'Question 10',exact:true}).click();await expect(page.locator('.current-question-heading')).toContainText('Question 10 of 10');await expect(page.locator('.current-question-heading')).toBeFocused();await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Previous',exact:true}).click();await expect(page.locator('.current-question-heading')).toContainText('Question 9 of 10');
 await page.locator('.question-card input').first().focus();await page.keyboard.press('Space');await expect(page.locator('.question-card input').first()).toBeChecked();await page.keyboard.press('ArrowDown');await expect(page.locator('.question-card input').nth(1)).toBeChecked();
 await page.getByLabel('Practice skill',{exact:true}).selectOption('8.C');await expect(page).toHaveURL(/practice\/8.C/);await expect(page.locator('h1')).toContainText('8.C');await expect(page.locator('.sentence-number')).toHaveCount(15);
 const ready=page.waitForEvent('download');await page.getByRole('button',{name:'Download this set'}).click();await (await ready).saveAs('test-results/skill-8C.txt');const txt=await readFile('test-results/skill-8C.txt','utf8');expect(txt).toContain('ANSWER KEY');expect(txt).toContain('ap-v2-8.C-10');expect(txt).toContain('(15)');
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await expect(page.locator('.question-card')).toHaveCount(10);await expect(page.locator('.practice-guidance')).toHaveAttribute('open','');await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await expect(page.locator('.question-card')).toHaveCount(1);await expect(page.locator('.practice-guidance')).not.toHaveAttribute('open','');
 await axe('single-writing-question');
 // Both supplied figures render, remain readable on narrow screens, and accompany downloads.
 for(const id of ['visual-rhetoric','multimodal-composition']){
  await nav(`#/concept/${id}/practice`);await page.getByLabel('Show complete set',{exact:true}).check();
  await expect(page.locator('.mcq-figure img').first()).toBeVisible();
  await expect.poll(()=>page.locator('.mcq-figure img').first().evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  const figureDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Download this set'}).click();
  await (await figureDownload).saveAs(`test-results/${id}-practice.txt`);
  expect(await readFile(`test-results/${id}-practice.txt`,'utf8')).toContain('Text equivalent:');
  await axe(`${id}-figure`);
  await page.screenshot({path:`test-results/${id}-figure.png`,fullPage:true});
 }
 await nav('#/concept/multimodal-composition/practice');
 await page.getByLabel('Show complete set',{exact:true}).uncheck();
 const newQ=questionsForConcept(conceptById['multimodal-composition'])[9];
 await page.getByRole('button',{name:'Question 10',exact:true}).click();
 await page.locator('.question-card .answer-option').nth(newQ.correct).click();await page.getByRole('button',{name:'Check answer'}).click();
 await page.reload();await page.getByRole('button',{name:'Question 10, checked',exact:true}).click();
 await expect(page.locator('.answer-feedback')).toContainText('Correct.');
 await nav('#/concept/definition/project');await expect(page.getByRole('heading',{name:'The dictionary tribunal'})).toBeVisible();await expect(page.locator('.topic-suggestions li')).toHaveCount(3);await expect(page.locator('.project-rubric-row')).toHaveCount(5);await expect(page.locator('.assessment-details')).not.toHaveAttribute('open','');await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await expect(page.locator('.assessment-details')).toHaveAttribute('open','');await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await expect(page.locator('.assessment-details')).not.toHaveAttribute('open','');await page.locator('.assessment-details summary').click();await expect(page.locator('.assessment-details')).toContainText('Proficient · 24 pts');await expect(page.locator('.assessment-details')).toContainText('Missing or unassessable · 0 pts');
 const assignmentReady=page.waitForEvent('download');await page.getByRole('button',{name:'Download complete assignment'}).click();await (await assignmentReady).saveAs('test-results/definition-assignment.txt');const full=await readFile('test-results/definition-assignment.txt','utf8');expect(full).toContain('POSSIBLE TOPICS');expect(full).toContain('The dictionary tribunal');expect(full).toContain('PROJECT RUBRIC');expect(full).toContain('Proficient (24)');expect(full).toContain('ap-v2-5.C-4');expect(full).toContain('lang-v3-definition-7');
 await axe('expanded-project-rubric');await page.screenshot({path:'test-results/new-project-desktop.png',fullPage:true});
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:950});
  for(const route of ['#/practice/4.A','#/concept/definition/project','#/practice','#/concept/visual-rhetoric/practice','#/concept/multimodal-composition/practice']){await nav(route);if(route==='#/practice')await page.locator('.skill-directory summary').click();if(route.includes('composition/practice')||route.includes('visual-rhetoric/practice'))await page.getByRole('button',{name:/^Question 10/}).click();const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));expect(size.scroll,`${route} overflow at ${width}`).toBeLessThanOrEqual(size.client+1);}
  if(width===390){await nav('#/practice/4.A');await axe('mobile-mcq');await page.screenshot({path:'test-results/new-mcq-mobile.png',fullPage:true});await nav('#/concept/definition/project');await axe('mobile-project');await page.screenshot({path:'test-results/new-project-mobile.png',fullPage:true});}
 }
 await writeFile('test-results/expanded-accessibility.json',JSON.stringify(access,null,2));
 expect(access.flatMap(r=>r.violations),JSON.stringify(access.filter(r=>r.violations.length))).toHaveLength(0);expect(errors).toEqual([]);
 console.log('Passed: 81 exclusive concept sets / 810 MCQs, 22 preserved skill reviews, old and new answer persistence, two figures, navigation, printing, exports, responsive layouts, and accessibility.');
}finally{await browser.close();}
