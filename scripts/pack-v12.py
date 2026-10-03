"""Deterministically pack authored RGBA art; never draw character geometry.
Requires Pillow, numpy, scipy. Source PNGs are generated artwork; prompts logged.
"""
from pathlib import Path
from PIL import Image, ImageDraw
from scipy.ndimage import label, find_objects
import numpy as np
import json,hashlib,shutil
from io import BytesIO
def save_png(im,path):
    buffer=BytesIO();im.save(buffer,format="PNG",optimize=True);Path(path).write_bytes(buffer.getvalue())
ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/'docs/v12/generation-manifest.json').read_text())
out=ROOT/'assets/v12'; (out/'source').mkdir(exist_ok=True)
records={};contact=Image.new('RGB',(128*8,164*10),'#19232e');d=ImageDraw.Draw(contact)
for row,(id,entry) in enumerate(m['sprites'].items()):
 source=out/'source'/f'{id}-sheet.png'
 if not source.exists():shutil.copy(entry['source'],source)
 im=Image.open(source).convert('RGBA');arr=np.array(im); lab,n=label(arr[:,:,3]>128)
 components=[]
 for k,sl in enumerate(find_objects(lab),1):
  area=(sl[0].stop-sl[0].start)*(sl[1].stop-sl[1].start)
  if area>15000:components.append((k,sl))
 assert len(components)==8,(id,len(components))
 # Rows by feet, not top: a raised sword can extend above the nominal row boundary.
 components.sort(key=lambda z:(int(z[1][0].stop>im.height*.65),(z[1][1].start+z[1][1].stop)/2))
 scale=min(120/max(sl[1].stop-sl[1].start for k,sl in components),132/max(sl[0].stop-sl[0].start for k,sl in components))
 sheet=Image.new('RGBA',(1024,144));boxes=[]
 for frame,(k,sl) in enumerate(components):
  # Label masking removes neighboring capes in overlapping bounding rectangles.
  a=arr[sl].copy();a[:,:,3]=np.where(lab[sl]==k,a[:,:,3],0)
  part=Image.fromarray(a);part=part.resize((round(part.width*scale),round(part.height*scale)),Image.Resampling.NEAREST)
  x=(128-part.width)//2;y=140-part.height
  sheet.alpha_composite(part,(128*frame+x,y));boxes.append([x,y,part.width,part.height])
 save_png(sheet,out/'sprites'/f'{id}.png')
 contact.paste(sheet,(0,row*164),sheet);d.text((4,row*164+145),id,fill='#dac490')
 records[id]={'cell':[128,144],'frames':8,'anchor':[64,140],'bounds':boxes,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sha256':hashlib.sha256((out/'sprites'/f'{id}.png').read_bytes()).hexdigest()}
for id,entry in m['portraits'].items():
 source=out/'source'/f'{id}-portrait.png'
 if not source.exists():shutil.copy(entry['source'],source)
 save_png(Image.open(source).convert('RGB').resize((128,128),Image.Resampling.NEAREST),out/'portraits'/f'{id}.png')
for id,entry in m['other'].items():
 source=out/'source'/f'{id}.png'
 if not source.exists():shutil.copy(entry['source'],source)
 im=Image.open(source)
 if id=='background':save_png(im.convert('RGB').resize((520,780),Image.Resampling.NEAREST),out/'backgrounds/bowang.png')
 else:
  # Authored effect rows are visually positioned; retain their full envelopes.
  rows=[(0,250),(250,430),(430,667),(667,912),(912,1190),(1190,1410),(1410,im.height)]
  atlas=Image.new('RGBA',(512,896))
  for r,(y0,y1) in enumerate(rows):
   for c in range(4):
    p=im.crop((round(c*im.width/4),y0,round((c+1)*im.width/4),y1)).convert('RGBA')
    p=p.resize((120,120),Image.Resampling.NEAREST);atlas.alpha_composite(p,(c*128+4,r*128+4))
  save_png(atlas,out/'fx/battle-fx.png')
save_png(contact,ROOT/'docs/v12/production-contact-sheet.png')
(out/'manifest.json').write_text(json.dumps({'version':'12.0','sprites':records,'poses':['idleA','idleB','anticipation','strike','recover','hurt','cast','ko'],'fx':{'cell':[128,128],'columns':4,'rows':['slash','thrust','impact','fire','lightning','heal','ko']}},indent=2))
print('Packed ten independent 8-pose sheets, five portraits, background and 28 FX frames.')
