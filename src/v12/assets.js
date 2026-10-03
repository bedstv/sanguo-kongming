export const VERSION='12.0';
export const CELL={w:128,h:144,cols:8};
export const POSES={idle:[0,1],anticipation:[2],strike:[3],recover:[4],hurt:[5],cast:[6],ko:[7]};
export const IDS=['liubei','guanyu','zhangfei','zhaoyun','kongming','caoren','zhanghe','xiahoudun','pikeman','archer'];
export const asset=p=>new URL(`../../assets/v12/${p}?v=${VERSION}`,import.meta.url).href;
export const sheet=id=>asset(`sprites/${id}.png`);
export const portrait=id=>asset(`portraits/${id}.png`);
export const background=asset('backgrounds/bowang.png');
export const FX_NAMES=['slash','thrust','impact','fire','lightning','heal','ko'];
export const fxAtlas=asset('fx/battle-fx.png');
export async function preload(onProgress=()=>{}){const urls=[...IDS.map(sheet),...IDS.slice(0,5).map(portrait),background,fxAtlas];let n=0;const entries=await Promise.all(urls.map(url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{onProgress(++n,urls.length);resolve([url,im]);};im.onerror=()=>reject(new Error(`素材載入失敗：${url.split('/').pop()}`));im.src=url;})));return new Map(entries);}
