import fs from 'node:fs';
import path from 'node:path';
import {MAPS,PARTY_TEMPLATE,ENEMIES,SKILLS} from '../src/data.js';

const root=path.resolve(import.meta.dirname,'..');
const fail=[];
const ok=msg=>console.log(`✓ ${msg}`);
const bad=msg=>{console.error(`✗ ${msg}`);fail.push(msg)};

for(const [id,map] of Object.entries(MAPS)){
  if(map.rows.length!==map.height)bad(`${id}: height=${map.height}, rows=${map.rows.length}`);else ok(`${id}: row count`);
  for(let y=0;y<map.rows.length;y++)if(map.rows[y].length!==map.width)bad(`${id}: row ${y} width=${map.rows[y].length}, expected=${map.width}`);
  if(map.start&&(map.start.x<0||map.start.x>=map.width||map.start.y<0||map.start.y>=map.height))bad(`${id}: invalid start`);
  for(const npc of map.npcs||[])if(npc.x<0||npc.x>=map.width||npc.y<0||npc.y>=map.height)bad(`${id}: NPC ${npc.name} outside map`);
}

const partyIds=new Set(PARTY_TEMPLATE.map(x=>x.id));
if(partyIds.size!==PARTY_TEMPLATE.length)bad('duplicate party ids');else ok('party ids unique');
if(Object.keys(ENEMIES).length<7)bad('enemy roster unexpectedly small');else ok('enemy roster');
if(!SKILLS.some(x=>x.id==='thunder')||!SKILLS.some(x=>x.id==='fire'))bad('key tactics missing');else ok('key tactics present');

const requiredV6=['assets/world-atlas.svg','assets/world-sprites.svg','src/assetAtlas.js','src/v60.js','styles/v60.css','GOAL_V6.md'];
for(const f of requiredV6){if(!fs.existsSync(path.join(root,f)))bad(`V6 asset missing: ${f}`);else ok(`V6 asset: ${f}`)}

const world=fs.readFileSync(path.join(root,'src/world.js'),'utf8');
if(!world.includes("from './assetAtlas.js'"))bad('world renderer is not using asset atlas');else ok('asset-driven world renderer');
const audio=fs.readFileSync(path.join(root,'src/audio.js'),'utf8');
if(!audio.includes('visibilitychange')||!audio.includes('pageshow')||!audio.includes('touchstart'))bad('iPhone audio recovery hooks missing');else ok('iPhone audio recovery hooks');

const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const refs=[...index.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)].map(m=>m[1]).filter(x=>x.startsWith('./')||!x.includes(':'));
for(const ref of refs){const clean=ref.replace(/^\.\//,'');if(clean&&clean!=='manifest.webmanifest'&&!fs.existsSync(path.join(root,clean)))bad(`index reference missing: ${clean}`)}
if(fs.existsSync(path.join(root,'manifest.webmanifest')))ok('manifest exists');

const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const assetMatch=sw.match(/const ASSETS=\[(.*?)\];/s);
if(assetMatch){const assets=[...assetMatch[1].matchAll(/'([^']+)'/g)].map(m=>m[1]).filter(x=>x!=='./');for(const asset of assets){const clean=asset.replace(/^\.\//,'');if(!fs.existsSync(path.join(root,clean)))bad(`service worker asset missing: ${clean}`)}if(!fail.length)ok('service worker asset list')}else bad('cannot parse service worker asset list');
if(!sw.includes('world-atlas.svg')||!sw.includes('world-sprites.svg'))bad('V6 atlases not precached');else ok('V6 atlases precached');

if(fail.length){console.error(`\nValidation failed: ${fail.length} problem(s).`);process.exit(1)}
console.log('\nV6 validation passed.');
