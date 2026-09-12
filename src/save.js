const KEY='sanguo-kongming-v5';
export function saveGame(state){localStorage.setItem(KEY,JSON.stringify(state));}
export function loadGame(){try{const v=localStorage.getItem(KEY);return v?JSON.parse(v):null}catch{return null}}
export function hasSave(){return !!localStorage.getItem(KEY)}
