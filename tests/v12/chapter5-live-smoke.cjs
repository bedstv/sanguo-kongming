const assert=require('node:assert/strict'),fs=require('node:fs');
const {webkit}=require('playwright');
(async()=>{
 const browser=await webkit.launch({headless:true}),page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,hasTouch:true,isMobile:true}),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
 const url='https://bedstv.github.io/sanguo-kongming/?qa&v=12.5&check='+Date.now();
 await page.goto(url);await page.waitForFunction(()=>window.__Campaign);assert.match(await page.locator('.chapter-seal').textContent(),/五章/);
 await page.click('#startNew');while(await page.locator('#storyDialog').isVisible())await page.click('#advanceDialog');
 assert.equal(await page.locator('#worldScene').isVisible(),true);await page.waitForFunction(()=>__Campaign.audio.source?.buffer);
 await page.click('#saveJourney');const before=await page.evaluate(()=>({map:__Campaign.state.map,x:__Campaign.state.x,y:__Campaign.state.y,gold:__Campaign.state.gold}));
 await page.reload();await page.waitForFunction(()=>window.__Campaign);await page.click('#loadJourney');assert.deepEqual(await page.evaluate(()=>({map:__Campaign.state.map,x:__Campaign.state.x,y:__Campaign.state.y,gold:__Campaign.state.gold})),before);
 const fixture=JSON.parse(fs.readFileSync('docs/v12/chapter5-start-save.json'));await page.evaluate(s=>localStorage.setItem('sanguo-kongming-v12-campaign',JSON.stringify(s)),fixture);
 await page.reload();await page.waitForFunction(()=>window.__Campaign);await page.click('#loadJourney');await page.click('#waypoint');while(await page.locator('#storyDialog').isVisible())await page.click('#advanceDialog');assert.equal(await page.evaluate(()=>__Campaign.state.story.stage),20);assert.equal(await page.evaluate(()=>__Campaign.state.map),'jianglingfort');
 await page.reload();await page.waitForFunction(()=>window.__Campaign);await page.click('#loadJourney');assert.equal(await page.evaluate(()=>__Campaign.state.story.stage),20);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={url,engine:'Linux WebKit',physicalIPhone:false,checks:['deployed five-chapter entry','new game dialogue and exploration','decoded game music after gesture','exact save/reload','deployed fourth clear fixture to fifth continuation','fifth-stage reload without downgrade'],errors,failed};
 fs.writeFileSync('docs/v12/chapter5-live-qa.json',JSON.stringify(report,null,2));await page.screenshot({path:'docs/v12/chapter5-live.png',scale:'css'});console.log(JSON.stringify(report));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
