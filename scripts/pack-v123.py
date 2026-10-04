"""Pack original chapter-three art; keep source RGBA, full weapon envelopes and common anchors."""
from pathlib import Path
from PIL import Image
import io,json,hashlib
import numpy as np
from scipy.ndimage import label,find_objects
ROOT=Path(__file__).resolve().parents[1];A=ROOT/'assets/v12'
def save(im,path):
 b=io.BytesIO();im.save(b,format='PNG',optimize=True);path.write_bytes(b.getvalue())
def pack(name,count,cell,anchor,fit,sort_rows=False):
 im=Image.open(A/f'source/{name}.png').convert('RGBA');arr=np.asarray(im);assert arr[:,:,3].min()==0
 labels,n=label(arr[:,:,3]>128)
 components=[(k,sl) for k,sl in enumerate(find_objects(labels),1) if (sl[0].stop-sl[0].start)*(sl[1].stop-sl[1].start)>12000]
 assert len(components)==count,(name,len(components))
 components.sort(key=lambda z:(z[1][0].stop>im.height*.65 if sort_rows else False,(z[1][1].start+z[1][1].stop)/2))
 parts=[]
 for k,sl in components:
  assert sl[0].start>0 and sl[1].start>0 and sl[0].stop<im.height and sl[1].stop<im.width,'source clipped'
  p=arr[sl].copy();p[:,:,3]=np.where(labels[sl]==k,p[:,:,3],0);parts.append(Image.fromarray(p))
 scale=min(fit[0]/max(p.width for p in parts),fit[1]/max(p.height for p in parts));out=Image.new('RGBA',(cell[0]*count,cell[1]));bounds=[]
 for i,p in enumerate(parts):
  p=p.resize((round(p.width*scale),round(p.height*scale)),Image.Resampling.NEAREST);x=(cell[0]-p.width)//2;y=anchor-p.height;out.alpha_composite(p,(i*cell[0]+x,y));bounds.append([x,y,p.width,p.height])
 return out,bounds
boss,bounds=pack('xuhuang-sheet',8,(128,144),140,(120,132),True)
save(boss,A/'sprites/xuhuang.png');save(boss,ROOT/'docs/v12/xuhuang-contact-sheet.png')
npc,npc_bounds=pack('zhouyu-world',2,(64,80),76,(56,70))
save(npc,A/'world/zhouyu.png')
for id in ['xuhuang','zhouyu']:save(Image.open(A/f'source/{id}-portrait.png').convert('RGB').resize((128,128),Image.Resampling.NEAREST),A/f'portraits/{id}.png')
save(Image.open(A/'source/redcliff-background.png').convert('RGB').resize((520,780),Image.Resampling.NEAREST),A/'backgrounds/redcliff.png')
save(Image.open(A/'source/naval-tiles.png').convert('RGB').resize((256,256),Image.Resampling.NEAREST),A/'world/naval.png')
save(Image.open(A/'source/redcliff-background.png').convert('RGB').crop((448,1024,576,1152)),A/'world/deck.png')
paths=['world/deck.png','sprites/xuhuang.png','world/zhouyu.png','portraits/xuhuang.png','portraits/zhouyu.png','backgrounds/redcliff.png','world/naval.png']+[f'source/{n}.png' for n in ['xuhuang-sheet','xuhuang-portrait','zhouyu-portrait','zhouyu-world','redcliff-background','naval-tiles']]
(A/'chapter-three-manifest.json').write_text(json.dumps({'sprite':{'cell':[128,144],'frames':8,'anchor':[64,140],'bounds':bounds},'npc':{'cell':[64,80],'frames':2,'bounds':npc_bounds},'deck':{'source':'source/redcliff-background.png','crop':[448,1024,576,1152]},'terrain':{'cell':[128,128],'columns':2,'rows':2},'sha256':{p:hashlib.sha256((A/p).read_bytes()).hexdigest() for p in paths}},indent=2))
print('Packed eight Xu Huang poses, two Zhou Yu idle poses, independent portraits and naval terrain/background.')
