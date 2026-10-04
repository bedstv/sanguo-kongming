"""Pack chapter-four original art without altering source pixels or generated alpha."""
from pathlib import Path
from PIL import Image
import io,json,hashlib
import numpy as np
from scipy.ndimage import label,find_objects
ROOT=Path(__file__).resolve().parents[1];A=ROOT/'assets/v12'
def save(im,path):
 b=io.BytesIO();im.save(b,format='PNG',optimize=True);path.write_bytes(b.getvalue())
im=Image.open(A/'source/huangzhong-sheet.png').convert('RGBA');arr=np.asarray(im);assert arr[:,:,3].min()==0
labels,n=label(arr[:,:,3]>128)
components=[(k,sl) for k,sl in enumerate(find_objects(labels),1) if (sl[0].stop-sl[0].start)*(sl[1].stop-sl[1].start)>12000]
assert len(components)==8
components.sort(key=lambda z:(z[1][0].stop>im.height*.65,(z[1][1].start+z[1][1].stop)/2))
parts=[]
for k,sl in components:
 assert sl[0].start>0 and sl[1].start>0 and sl[0].stop<im.height and sl[1].stop<im.width
 p=arr[sl].copy();p[:,:,3]=np.where(labels[sl]==k,p[:,:,3],0);parts.append(Image.fromarray(p))
scale=min(120/max(p.width for p in parts),132/max(p.height for p in parts));out=Image.new('RGBA',(1024,144));bounds=[]
for i,p in enumerate(parts):
 p=p.resize((round(p.width*scale),round(p.height*scale)),Image.Resampling.NEAREST);x=(128-p.width)//2;y=140-p.height;out.alpha_composite(p,(i*128+x,y));bounds.append([x,y,p.width,p.height])
save(out,A/'sprites/huangzhong.png');save(out,ROOT/'docs/v12/huangzhong-contact-sheet.png')
save(Image.open(A/'source/huangzhong-portrait.png').convert('RGB').resize((128,128),Image.Resampling.NEAREST),A/'portraits/huangzhong.png')
bg=Image.open(A/'source/changsha-background.png').convert('RGB');save(bg.resize((520,780),Image.Resampling.NEAREST),A/'backgrounds/changsha.png')
save(bg.crop((0,100,1024,1124)).resize((520,520),Image.Resampling.NEAREST),A/'backgrounds/changsha-wide.png')
save(bg.crop((448,1024,576,1152)),A/'world/courtyard.png')
terrain=Image.open(A/'source/jingnan-tiles.png').convert('RGB');atlas=terrain.resize((256,256),Image.Resampling.NEAREST);half=terrain.width//2;gate_crop=[0,half-52,half,terrain.height-52];atlas.paste(terrain.crop(tuple(gate_crop)).resize((128,128),Image.Resampling.NEAREST),(0,128));save(atlas,A/'world/jingnan.png')
paths=['sprites/huangzhong.png','portraits/huangzhong.png','backgrounds/changsha.png','backgrounds/changsha-wide.png','world/jingnan.png','world/courtyard.png']+[f'source/{n}.png' for n in ['huangzhong-sheet','huangzhong-portrait','changsha-background','jingnan-tiles']]
(A/'chapter-four-manifest.json').write_text(json.dumps({'sprite':{'cell':[128,144],'frames':8,'anchor':[64,140],'bounds':bounds},'terrain':{'cell':[128,128],'columns':2,'rows':2,'gateCrop':gate_crop},'compactBattlefield':{'source':'source/changsha-background.png','crop':[0,100,1024,1124]},'courtyard':{'source':'source/changsha-background.png','crop':[448,1024,576,1152]},'sha256':{p:hashlib.sha256((A/p).read_bytes()).hexdigest() for p in paths}},indent=2))
print('Packed Huang Zhong eight unique grounded poses, independent portrait, city courtyard and terrain.')
