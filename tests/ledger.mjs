import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';

await mkdir('test-results',{recursive:true});
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const base=process.env.TEST_URL||'http://127.0.0.1:4175/';
const reports=[];
const entries=[
 ['Interpretive claim','Chen frames access as a responsibility the council can meet through a limited trial.'],
 ['Textual evidence & reasoning','The acknowledgment of budget duties makes the request answer a concern the council already holds.'],
 ['Alternative reading','The trial might be read as a retreat from the claim that evening access matters.'],
 ['Qualified claim','The trial preserves the principle of access while making its implementation open to evidence.'],
];
try {
 await page.goto(base+'#/concept/rhetorical-situation/practice');
 await page.locator('.argument-ledger summary').click();
 for(const [label,value] of entries)await page.getByLabel(label,{exact:true}).fill(value);
 await page.reload();await page.locator('.argument-ledger summary').click();
 for(const [label,value] of entries)await expect(page.getByLabel(label,{exact:true})).toHaveValue(value);
 await expect(page.locator('.ledger-summary-note')).toHaveText('4 of 4 entries saved');
 const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Export ledger',exact:true}).click();
 await (await downloaded).saveAs('test-results/argument-ledger.txt');
 const exported=await readFile('test-results/argument-ledger.txt','utf8');for(const [,value] of entries)expect(exported).toContain(value);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`overflow at ${width}px`).toBe(false);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  reports.push({width,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await page.getByRole('button',{name:'Export ledger',exact:true}).focus();await page.locator('.argument-ledger').screenshot({path:`test-results/ledger-${width}.png`});
 }
 await page.goto(base+'#/notebook');await page.getByRole('button',{name:'Drafts & notes',exact:true}).click();
 await expect(page.locator('.draft-list-item')).toHaveCount(4);
 await expect(page.locator('.draft-list-item').first()).toContainText('ARGUMENT LEDGER');
 await page.locator('.draft-list-item').first().click();await expect(page.locator('.concept-tabs .active')).toContainText('Practice');await expect(page.locator('.argument-ledger')).toHaveAttribute('open','');await expect(page.locator('.argument-ledger summary')).toBeInViewport();
 await page.goto(base+'#/concept/argument/practice');await page.locator('.argument-ledger summary').click();
 await expect(page.getByLabel('Counterargument',{exact:true})).toBeVisible();
 await expect(page.getByLabel('Alternative reading',{exact:true})).toHaveCount(0);
 await page.getByLabel('Claim',{exact:true}).fill('A trial is useful when it can test a disputed cause.');
 await page.goto(base+'#/concept/rhetorical-situation/practice');await page.locator('.argument-ledger summary').click();
 await expect(page.getByLabel('Interpretive claim',{exact:true})).toHaveValue(entries[0][1]);
 await writeFile('test-results/ledger-accessibility.json',JSON.stringify(reports,null,2));
 expect(reports.flatMap(r=>r.violations)).toEqual([]);
 console.log('Argument ledger: persistence, task-specific prompts, workspace links, export, 320–1440px layouts, and accessibility passed.');
} finally {await writeFile('test-results/ledger-accessibility.json',JSON.stringify(reports,null,2));await browser.close();}
