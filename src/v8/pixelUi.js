const root=document.querySelector('#battle');
const cmds=[...document.querySelectorAll('#cmds button')];
const back=document.querySelector('#battleBack');
let focus=0;
function refresh(){cmds.forEach((b,i)=>b.classList.toggle('v8-focus',i===focus));}
function move(dx,dy){const cols=2,rows=Math.ceil(cmds.length/cols),x=focus%cols,y=Math.floor(focus/cols);let nx=(x+dx+cols)%cols,ny=(y+dy+rows)%rows,n=ny*cols+nx;if(n>=cmds.length)n=focus;focus=n;refresh();}
cmds.forEach((b,i)=>{b.addEventListener('pointerdown',()=>{focus=i;refresh()},{passive:true});b.addEventListener('focus',()=>{focus=i;refresh()})});
root?.addEventListener('keydown',e=>{if(!root.classList.contains('on'))return;if(e.key==='ArrowLeft'){move(-1,0);e.preventDefault()}else if(e.key==='ArrowRight'){move(1,0);e.preventDefault()}else if(e.key==='ArrowUp'){move(0,-1);e.preventDefault()}else if(e.key==='ArrowDown'){move(0,1);e.preventDefault()}else if(e.key==='Enter'||e.key===' '){cmds[focus]?.click();e.preventDefault()}else if(e.key==='Escape'){back?.click();e.preventDefault()}});
document.addEventListener('click',e=>{const skill=e.target.closest('#skills button');if(skill){document.querySelectorAll('#skills button').forEach(x=>x.classList.remove('v8-focus'));skill.classList.add('v8-focus')}});
refresh();
