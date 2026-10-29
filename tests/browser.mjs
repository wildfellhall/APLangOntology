import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {concepts,conceptById,questionsForConcept} from '../src/data/index.js';

await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[];const a11y=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TEST_URL||'http://127.0.0.1:5173/';
async function navigate(path=''){await page.goto(base+path);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);}
async function screenshot(name){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`test-results/${name}.png`,fullPage:true,animations:'disabled'});}
async function axe(label){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();a11y.push({label,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}

try{
 await navigate();await expect(page.getByRole('heading',{name:/AP English Language/})).toBeVisible();await screenshot('overview');await axe('overview');
 await page.getByRole('link',{name:'Begin the course'}).click();await expect(page.getByRole('heading',{name:'Rhetorical situation',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Save Rhetorical situation',exact:true}).click();
 await page.getByRole('button',{name:'Mark complete',exact:true}).click();
 await page.getByLabel('Your concept notes').fill('A writer’s audience shapes the evidence needed to justify action.');
 await page.getByRole('link',{name:`Practice ${questionsForConcept(conceptById['rhetorical-situation']).length} MCQs + essay`,exact:true}).click();
 const question=questionsForConcept(conceptById['rhetorical-situation'])[0];
 const card=page.locator('.question-card').first();
 await card.locator('.answer-option').nth((question.correct+1)%4).click();await card.getByRole('button',{name:'Check answer'}).click();await expect(card.locator('.answer-feedback')).toContainText('The best answer');
 await card.getByRole('button',{name:'Try again'}).click();await card.locator('.answer-option').nth(question.correct).click();await card.getByRole('button',{name:'Check answer'}).click();await expect(card.locator('.answer-feedback')).toContainText('Correct.');
 await page.getByLabel('Your essay draft').fill('Chen makes a bounded proposal by pairing an account of exclusion with an acknowledgment of the council’s budget obligations.');
 await page.getByRole('button',{name:'Start timer',exact:true}).click();await expect(page.getByRole('button',{name:'Pause timer'})).toBeVisible();await page.getByRole('button',{name:'Pause timer'}).click();await page.getByRole('button',{name:'Reset timer'}).click();
 await page.reload();await expect(page.getByLabel('Your essay draft')).toHaveValue(/Chen makes a bounded/);await expect(page.getByRole('button',{name:'Marked complete'})).toBeVisible();await expect(page.getByRole('button',{name:'Unsave Rhetorical situation'})).toBeVisible();
 await page.getByRole('button',{name:'Open essay self-review'}).click();await expect(page.locator('.essay-rubric')).toBeVisible();await screenshot('practice');await axe('practice');
 const downloadReady=page.waitForEvent('download');await page.getByRole('button',{name:'Download complete assignment'}).click();const file=await downloadReady;await file.saveAs('test-results/downloaded-assignment.txt');const assignment=await readFile('test-results/downloaded-assignment.txt','utf8');expect(assignment).toContain('A room that stays open');expect(assignment).toContain('PROJECT RUBRIC');expect(assignment).toContain('ANSWER KEY');
 await page.getByRole('link',{name:'Project',exact:true}).click();await expect(page.getByRole('heading',{name:'The midnight cabinet'})).toBeVisible();await page.getByLabel('Project plan & reflection').fill('Compare the council, students, and residents; keep the proposal’s facts consistent.');await expect(page.getByRole('heading',{name:/Visual reasoning/})).toBeVisible();await screenshot('project');await axe('project');
 await page.getByRole('button',{name:/Find a concept/}).click();await page.getByLabel('Search concepts, skills, or projects').fill('warrant');await expect(page.getByRole('dialog').getByRole('link',{name:/Warrants & assumptions/})).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await navigate('#/concepts');await page.getByLabel('Filter library').fill('zzzzzzzz');await expect(page.getByRole('heading',{name:'No matches'})).toBeVisible();await page.getByRole('button',{name:'Clear filters'}).click();await page.getByLabel('Unit',{exact:true}).selectOption('6');await expect(page.locator('.concept-row')).toHaveCount(9);
 await navigate('#/concept/synthesis/practice');await expect(page.locator('.packet-source')).toHaveCount(6);await expect(page.getByRole('table')).toBeVisible();await expect(page.getByRole('img',{name:/Two simplified square layouts/})).toBeVisible();await axe('synthesis');
 await navigate('#/map');await expect(page.locator('.graph-node')).toHaveCount(concepts.length);await page.getByRole('button',{name:'Select Claims & defensibility, unit 1',exact:true}).click();await expect(page.locator('.map-inspector h2')).toHaveText('Claims & defensibility');await page.getByRole('button',{name:'Select Warrants & assumptions, unit 3',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.map-inspector h2')).toHaveText('Warrants & assumptions');await screenshot('map');await axe('map');
 await page.getByRole('button',{name:'List view'}).click();await page.getByLabel('Filter map by unit').selectOption('9');await expect(page.locator('.map-list>button')).toHaveCount(9);await page.getByRole('button',{name:'Unit 9 Complexity & sophistication'}).click();await expect(page.locator('.map-inspector h2')).toHaveText('Complexity & sophistication');
 await page.getByRole('button',{name:'Graph view',exact:true}).click();await navigate('#/map/ethical-representation');await expect(page.locator('.map-inspector h2')).toHaveText('Ethical representation');await expect(page.getByRole('button',{name:'Select Ethical representation, unit 9',exact:true})).toBeInViewport();
 await navigate('#/notebook');await expect(page.locator('.concept-row-main h2')).toHaveText('Rhetorical situation');await page.getByRole('button',{name:'Drafts & notes',exact:true}).click();await expect(page.locator('.draft-list-item')).toHaveCount(3);await axe('workspace');
 await navigate('#/sources');await page.getByText('View coverage of all 22 AP skill codes',{exact:true}).click();await expect(page.locator('.skill-coverage>div')).toHaveCount(22);await axe('sources');
 // Every data-backed route must render its own material rather than a generic or missing page.
 for(const n of concepts){for(const tab of ['learn','practice','project']){await navigate(`#/concept/${n.id}/${tab}`);await expect(page.locator('.concept-heading h1')).toHaveText(n.title);if(tab==='practice'){await expect(page.locator('.question-card')).toHaveCount(1);await expect(page.locator('.question-index button')).toHaveCount(10);}if(tab==='project')await expect(page.locator('.project-stage')).toHaveCount(6);}}
 await page.setViewportSize({width:390,height:844});await navigate();await screenshot('mobile-overview');await axe('mobile-overview');
 await page.getByRole('button',{name:'Open navigation'}).click();await axe('mobile-navigation');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open navigation'})).toBeFocused();await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Overview',exact:true}).click();await expect(page.getByRole('button',{name:'Open navigation'})).toHaveAttribute('aria-expanded','false');await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Concept map',exact:true}).click();await expect(page.locator('h1')).toHaveText('Concept map');
 for(const path of ['#/concept/rhetorical-situation/learn','#/concept/synthesis/practice','#/concept/multimodal-composition/project','#/sources','#/map']){await navigate(path);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);expect(overflow,`horizontal page overflow on ${path}`).toBe(false);}
 await navigate('#/concept/synthesis/practice');await screenshot('mobile-synthesis');await axe('mobile-synthesis');
 // The global navigation stays above the content across the responsive layout.
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const path of ['', '#/units', '#/concept/rhetorical-situation/learn', '#/projects', '#/notebook', '#/map']){
   await navigate(path);
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,headerBottom:document.querySelector('.site-header').getBoundingClientRect().bottom,mainTop:document.querySelector('main').getBoundingClientRect().top}));
   expect(layout.overflow,`horizontal overflow at ${width}px on ${path||'overview'}`).toBe(false);
   expect(layout.headerBottom,`top navigation at ${width}px on ${path||'overview'}`).toBeLessThanOrEqual(layout.mainTop+1);
  }
 }
 expect(errors).toEqual([]);
 await writeFile('test-results/accessibility.json',JSON.stringify(a11y,null,2));
 const violations=a11y.flatMap(r=>r.violations.map(v=>`${r.label}: ${v.id} (${v.nodes.length})`));
 console.log(JSON.stringify({routesChecked:concepts.length*3,consoleErrors:errors,accessibility:violations,screenshots:'test-results/'},null,2));
 expect(violations,'WCAG A/AA violations').toEqual([]);
}finally{await writeFile('test-results/accessibility.json',JSON.stringify(a11y,null,2));await browser.close();}
