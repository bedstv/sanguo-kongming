const assert = require('node:assert/strict');
const fs = require('node:fs');
const {webkit} = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/playwright' : 'playwright');
(async () => {
  const browser = await webkit.launch({headless:true});
  const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,hasTouch:true,isMobile:true});
  const errors=[], failed=[], checks=[];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('response', r=>{if(r.status()>=400)failed.push(r.url());});
  const base=process.env.V12_BASE_URL||'http://127.0.0.1:8123';
  await page.goto(base+'/?qa');
  await page.waitForFunction(()=>window.__Campaign);
  await page.evaluate(async()=>{
    const {newCampaign,SAVE_KEY}=await import('./src/v12/campaign-state.js?v=12.4');
    const s=newCampaign();s.map='refugecamp';s.gold=2288;
    Object.assign(s.story,{stage:5,clear:true,boss:true,chapter2Started:true});
    localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  });
  await page.reload();await page.waitForFunction(()=>window.__Campaign);await page.click('#loadJourney');
  const shot=async name=>{
    await page.waitForTimeout(220);
    await page.screenshot({path:`docs/v12/exploration-${name}.png`,scale:'css'});
  };
  if(process.env.CAPTURE_BEFORE){
    await page.evaluate(async()=>{
      const {WorldRendererV12,loadWorldArt}=await import('./src/v12/world-renderer-before.mjs');
      const {preload}=await import('./src/v12/assets.js');
      const original=document.querySelector('#worldMap'),copy=original.cloneNode();original.replaceWith(copy);
      copy.width=copy.height=320;copy.style.imageRendering='pixelated';
      copy.parentElement.style.paddingBottom='0px';
      const images=new Map([...(await preload()),...(await loadWorldArt())]);
      new WorldRendererV12(copy,images,__Campaign.state).draw(0);
    });
    await shot('refugecamp-before-390x844');
    await page.reload();await page.waitForFunction(()=>window.__Campaign);await page.click('#loadJourney');
  }
  for(const [w,h,safe] of [[390,844,false],[393,852,false],[390,664,false],[390,844,true]]){
    await page.setViewportSize({width:w,height:h});
    await page.evaluate(s=>{const c=document.querySelector('#campaign');c.style.paddingTop=s?'47px':'0px';c.style.paddingBottom=s?'34px':'0px';},safe);
    await page.waitForTimeout(220);
    const metrics=await page.evaluate(()=>{
      const canvas=document.querySelector('#worldMap'),r=canvas.getBoundingClientRect();
      return {width:canvas.width,height:canvas.height,expected:Math.round(Math.min(r.width,r.height)*devicePixelRatio),buttons:[...document.querySelectorAll('#worldScene button')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}),overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.equal(metrics.width,metrics.expected);assert.equal(metrics.height,metrics.expected);assert.equal(metrics.overflow,false);
    for(const r of metrics.buttons){assert.ok(r.x>=0&&r.x+r.w<=w+.1&&r.y>=0&&r.y+r.h<=h+.1);assert.ok(r.h>=44);}
    await shot(`refugecamp-${w}x${h}${safe?'-safe':''}`);
    checks.push(`DPR 3 native-resolution canvas, controls and safe caption ${w}x${h}${safe?' safe':''}`);
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{const c=document.querySelector('#campaign');c.style.paddingTop=c.style.paddingBottom='0px';});
  // Verify actual click-to-walk still maps to cells after changing backing resolution.
  await page.waitForTimeout(220);
  const target=await page.evaluate(()=>{
    const r=document.querySelector('#worldMap').getBoundingClientRect(),side=Math.min(r.width,r.height);
    return {x:r.x+(r.width-side)/2+side*6.5/10,y:r.y+(r.height-side)/2+side*7.5/10};
  });
  await page.mouse.click(target.x,target.y);
  await page.waitForFunction(()=>__Campaign.state.x===9&&__Campaign.state.y===9);
  await page.click('#saveJourney');await page.reload();await page.waitForFunction(()=>window.__Campaign);await page.click('#loadJourney');
  assert.deepEqual(await page.evaluate(()=>[__Campaign.state.x,__Campaign.state.y,__Campaign.state.gold]),[9,9,2288]);
  checks.push('high-resolution click-to-walk and exact save/reload coordinates');
  await page.evaluate(()=>__Campaign.enterMap('refugecamp',8,8));await shot('refugecamp-adjacent');await page.click('#interact');
  while(await page.locator('#storyDialog').isVisible())await page.click('#advanceDialog');
  assert.equal(await page.evaluate(()=>__Campaign.state.story.stage),6);
  checks.push('enlarged elder sprite retains proximity interaction and convoy progression');
  for(const [map,stage] of [['xinye',2],['longzhong',0],['changban',6],['alliedcamp',10],['jingcamp',15],['changshatown',19]]){
    await page.evaluate(([map,stage])=>{__Campaign.state.story.stage=stage;__Campaign.enterMap(map);},[map,stage]);
    await shot(map);
    checks.push(`${map} assets and labels render without page errors`);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  const result={engine:'Playwright WebKit 26.5 on Linux',deviceScaleFactor:3,physicalIPhone:false,checks,errors,failed};
  fs.writeFileSync('docs/v12/exploration-clarity-qa.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
