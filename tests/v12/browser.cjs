const assert=require('node:assert/strict');
const fs=require('node:fs');
const {webkit}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
const browser=await webkit.launch({headless:true});const errors=[],failed=[],checks=[];
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
const base=process.env.V12_BASE_URL||'http://127.0.0.1:8123';
await page.goto(base+'/golden-v12.html?v=12.0&qa');await page.waitForFunction(()=>window.__V12);
await page.click('#enter');await page.waitForFunction(()=>__V12.audio.source?.buffer);
assert.equal(await page.evaluate(()=>__V12.audio.isReady()),true);checks.push('gesture unlock + decoded boss playback');
await page.click('#sound');assert.equal(await page.evaluate(()=>__V12.audio.muted),true);assert.equal(await page.evaluate(()=>__V12.audio.source),null);
await page.click('#sound');await page.waitForFunction(()=>__V12.audio.source?.buffer);checks.push('mute/unmute');
await page.evaluate(async()=>{await __V12.audio.ctx.suspend();});await page.click('[data-cmd=attack]');await page.waitForFunction(()=>__V12.audio.ctx.state==='running');checks.push('suspended AudioContext resumes in gesture');
await page.click('#cancel');
await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.evaluate(()=>__V12.audio.source),null);
await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('pageshow'));});await page.waitForFunction(()=>__V12.audio.source?.buffer);checks.push('simulated visibility/pageshow resume (not physical iPhone)');
for(const [w,h,safe] of [[390,844,false],[393,852,false],[390,844,true],[390,664,false]]){
 await page.setViewportSize({width:w,height:h});await page.evaluate(safe=>{document.documentElement.style.setProperty('--safe-top',safe?'47px':'0px');document.documentElement.style.setProperty('--safe-bottom',safe?'34px':'0px');},safe);await page.waitForTimeout(120);
 const geometry=await page.evaluate(()=>{const root=document.querySelector('#battle').getBoundingClientRect();const infos=[...document.querySelectorAll('.unit-info')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};});return {overflow:document.documentElement.scrollWidth>innerWidth,root:{x:root.x,y:root.y,w:root.width,h:root.height},infos,panel:document.querySelector('.battle-panel').getBoundingClientRect().height,commands:[...document.querySelectorAll('[data-cmd]')].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),positions:[...__V12.renderer.positions.values()]};});
 assert.equal(geometry.overflow,false);for(const r of geometry.infos){assert.ok(r.x>=0&&r.x+r.w<=w+.1);assert.ok(r.y>=0&&r.y+r.h<=h);}
 for(let i=0;i<geometry.infos.length;i++)for(let j=i+1;j<geometry.infos.length;j++){const a=geometry.infos[i],b=geometry.infos[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'unit info overlap');}
 for(const p of geometry.positions)assert.ok(p.h>=40&&p.y+p.h<=p.rowY+p.rowH-25);
 assert.ok(geometry.panel/h<=.31);checks.push(`layout ${w}x${h}${safe?' with simulated safe areas':''}`);
 await page.screenshot({path:`docs/v12/golden-${w}x${h}${safe?'-safe':''}.png`});
}
await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);
await page.click('[data-cmd=attack]');await page.click('[data-id=caoren]');
await page.waitForFunction(()=>__V12.timeline.animations.get('liubei')?.pose==='anticipation');
await page.waitForFunction(()=>__V12.timeline.animations.get('liubei')?.pose==='strike');await page.screenshot({path:'docs/v12/attack-strike.png'});
await page.waitForFunction(()=>__V12.battle.state.actor===1&&__V12.battle.state.phase==='command');assert.equal(await page.evaluate(()=>__V12.battle.state.party[0].sp),24);checks.push('anticipation / strike / recover / damage');
await page.click('[data-cmd=tactic]');await page.getByRole('button',{name:'火攻計'}).click();const sp=await page.evaluate(()=>__V12.battle.actor().sp);await page.click('#cancel');assert.equal(await page.evaluate(()=>__V12.battle.actor().sp),sp);checks.push('cancel spell without SP payment');
for(const [skill,fx,target] of [['fire','fire','caoren'],['thunder','lightning','xiahoudun'],['heal','heal','liubei']]){
 await page.evaluate(()=>{const b=__V12.battle;b.state.actor=4;b.state.phase='command';b.state.party[0].hp=2500;b.emit();});
 await page.click('[data-cmd=tactic]');await page.locator('#skills button').filter({hasText:skill==='fire'?'火攻計':skill==='thunder'?'落雷計':'聖雨'}).click();await page.click(`[data-id=${target}]`);await page.waitForFunction(fx=>__V12.timeline.effects.some(e=>e.kind===fx),fx);await page.screenshot({path:`docs/v12/fx-${fx}.png`});await page.waitForFunction(()=>__V12.battle.state.phase==='command',{},{timeout:15000});checks.push(`cast ${skill}`);
}
await page.evaluate(()=>{const b=__V12.battle;b.state.actor=0;b.state.phase='command';b.state.enemies[4].hp=1;b.emit();});await page.click('[data-cmd=attack]');await page.click('[data-id=archer]');await page.waitForFunction(()=>__V12.battle.state.enemies[4].hp===0&&__V12.battle.state.phase==='command');await page.screenshot({path:'docs/v12/ko.png'});checks.push('KO art + dead target disabled');
assert.equal(await page.locator('[data-id=archer]').isDisabled(),true);
await page.click('#identity');await page.screenshot({path:'docs/v12/identity.png'});assert.equal(await page.locator('.unit-name').first().evaluate(e=>getComputedStyle(e).visibility),'hidden');assert.equal(await page.locator('#portrait').evaluate(e=>getComputedStyle(e).visibility),'hidden');
assert.equal(await page.locator('#portrait').getAttribute('alt'),'');
const anonymousLabels=await page.locator('.unit').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
assert.ok(anonymousLabels.every(x=>/^(我軍|敵軍) [1-5]，兵力/.test(x)));
await page.click('[data-cmd=attack]');
assert.ok((await page.locator('.unit').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')))).every(x=>/^(我軍|敵軍) [1-5]，兵力/.test(x)),'rerender must preserve anonymity');
await page.click('#cancel');await page.click('#identity');
assert.equal(await page.locator('#portrait').evaluate(e=>getComputedStyle(e).visibility),'visible');
assert.match(await page.locator('#portrait').getAttribute('alt'),/獨立肖像$/);
assert.match(await page.locator('[data-id=liubei]').getAttribute('aria-label'),/^劉備，/);
checks.push('identity hides portrait and accessible names; restored after exit');
await page.evaluate(()=>{const b=__V12.battle;b.state.enemies.forEach((e,i)=>e.hp=i?0:1);b.state.actor=0;b.state.phase='command';b.emit();});await page.click('[data-cmd=attack]');await page.click('[data-id=caoren]');await page.waitForFunction(()=>__V12.battle.state.result?.win===true);await page.waitForFunction(()=>__V12.audio.mode==='victory'&&__V12.audio.source?.buffer);await page.screenshot({path:'docs/v12/victory.png'});checks.push('victory + original victory track');
await page.click('#replay');await page.waitForFunction(()=>window.__V12);await page.click('#silent');await page.evaluate(()=>{const b=__V12.battle;b.state.party.forEach(p=>p.hp=0);b.enemyTurn();});await page.waitForFunction(()=>__V12.battle.state.result?.win===false);await page.screenshot({path:'docs/v12/defeat.png'});checks.push('defeat + replay');
assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
fs.writeFileSync('docs/v12/browser-qa.json',JSON.stringify({engine:'Playwright WebKit 26.5 on Linux',physicalIPhone:false,checks,errors,failed},null,2));console.log(JSON.stringify({checks:checks.length,errors,failed}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
