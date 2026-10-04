"""Pack original chapter-two bitmap art; preserve authored alpha and pose order."""
from pathlib import Path
from PIL import Image
import io,json,hashlib
import numpy as np
from scipy.ndimage import label,find_objects
ROOT=Path(__file__).resolve().parents[1];A=ROOT/'assets/v12'
def save(im,path):
 b=io.BytesIO();im.save(b,format='PNG',optimize=True);path.write_bytes(b.getvalue())
source=A/'source/caochun-sheet.png';im=Image.open(source).convert('RGBA');parts=[]
assert im.getchannel('A').getextrema()[0]==0
arr=np.asarray(im);labels,n=label(arr[:,:,3]>128)
components=[(k,sl) for k,sl in enumerate(find_objects(labels),1) if (sl[0].stop-sl[0].start)*(sl[1].stop-sl[1].start)>12000]
assert len(components)==8
components.sort(key=lambda z:(z[1][0].stop>im.height*.65,(z[1][1].start+z[1][1].stop)/2))
for k,sl in components:
 assert sl[0].start>0 and sl[1].start>0 and sl[0].stop<im.height and sl[1].stop<im.width,'source clipped'
 part=arr[sl].copy();part[:,:,3]=np.where(labels[sl]==k,part[:,:,3],0);parts.append(Image.fromarray(part))
scale=min(120/max(p.width for p in parts),132/max(p.height for p in parts));sheet=Image.new('RGBA',(1024,144));bounds=[]
for i,p in enumerate(parts):
 p=p.resize((round(p.width*scale),round(p.height*scale)),Image.Resampling.NEAREST);x=(128-p.width)//2;y=140-p.height;sheet.alpha_composite(p,(i*128+x,y));bounds.append([x,y,p.width,p.height])
save(sheet,A/'sprites/caochun.png');save(sheet,ROOT/'docs/v12/caochun-contact-sheet.png')
save(Image.open(A/'source/caochun-portrait.png').convert('RGB').resize((128,128),Image.Resampling.NEAREST),A/'portraits/caochun.png')
save(Image.open(A/'source/changban-background.png').convert('RGB').resize((520,780),Image.Resampling.NEAREST),A/'backgrounds/changban.png')
im=Image.open(A/'source/river-tiles.png').convert('RGB');save(im.resize((256,256),Image.Resampling.NEAREST),A/'world/river.png')
paths=['sprites/caochun.png','portraits/caochun.png','backgrounds/changban.png','world/river.png','source/caochun-sheet.png','source/caochun-portrait.png','source/changban-background.png','source/river-tiles.png']
(A/'chapter-two-manifest.json').write_text(json.dumps({'sprite':{'cell':[128,144],'frames':8,'anchor':[64,140],'bounds':bounds},'river':{'cell':[128,128],'columns':2,'rows':2},'sha256':{p:hashlib.sha256((A/p).read_bytes()).hexdigest() for p in paths}},indent=2))
print('Packed Cao Chun eight-pose sheet, independent portrait, river-bridge background and four terrain cells.')
