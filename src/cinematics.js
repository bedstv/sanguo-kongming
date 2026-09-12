import {portraitData} from './art.js';

export class CinematicSystem{
  constructor(root){
    this.root=root;
    this.portrait=root?.querySelector('[data-cutin-portrait]');
    this.kicker=root?.querySelector('[data-cutin-kicker]');
    this.name=root?.querySelector('[data-cutin-name]');
    this.text=root?.querySelector('[data-cutin-text]');
    this.timer=null;
  }
  show({key,name,kicker='',text='',tone='ally',duration=850}={}){
    if(!this.root)return Promise.resolve();
    clearTimeout(this.timer);
    this.root.classList.remove('ally','enemy','boss','skill','on');
    this.root.classList.add(tone);
    if(this.portrait)this.portrait.src=portraitData(key);
    if(this.kicker)this.kicker.textContent=kicker;
    if(this.name)this.name.textContent=name;
    if(this.text)this.text.textContent=text;
    void this.root.offsetWidth;
    this.root.classList.add('on');
    return new Promise(resolve=>{
      this.timer=setTimeout(()=>{
        this.root.classList.remove('on');
        setTimeout(resolve,140);
      },duration);
    });
  }
  hide(){if(!this.root)return;clearTimeout(this.timer);this.root.classList.remove('on')}
}
