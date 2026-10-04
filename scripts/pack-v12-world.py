"""Pack original generated map and NPC art into deterministic runtime atlases."""
from pathlib import Path
from PIL import Image
import io, json, hashlib
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/v12/world'
OUT.mkdir(exist_ok=True)
def save(im,path):
 b=io.BytesIO();im.save(b,format='PNG',optimize=True);path.write_bytes(b.getvalue())
source=Image.open(ROOT/'assets/v12/source/world-tiles.png').convert('RGB')
# Actual authored cell boundaries, checked against the source image.
xs=[0,314,627,942,1254];ys=[0,314,603,899,1254]
atlas=Image.new('RGB',(512,512))
for y in range(4):
 for x in range(4):
  crop=source.crop((xs[x]+2,ys[y]+2,xs[x+1]-2,ys[y+1]-2))
  atlas.paste(crop.resize((128,128),Image.Resampling.NEAREST),(x*128,y*128))
save(atlas,OUT/'terrain.png')
source=Image.open(ROOT/'assets/v12/source/town-npcs.png').convert('RGBA')
for col,name in enumerate(['villager','merchant','innkeeper']):
 atlas=Image.new('RGBA',(128,80))
 for row in range(2):
  f=source.crop((col*512,row*512,(col+1)*512,(row+1)*512))
  # Ignore near-transparent anti-alias halos when measuring the silhouette.
  box=f.getchannel('A').point(lambda a:255 if a>48 else 0).getbbox()
  assert box,(name,row)
  f=f.crop(box);scale=min(56/f.width,73/f.height)
  f=f.resize((round(f.width*scale),round(f.height*scale)),Image.Resampling.NEAREST)
  atlas.alpha_composite(f,(col*0+row*64+(64-f.width)//2,77-f.height))
 save(atlas,OUT/f'{name}.png')
meta={'terrain':{'cell':128,'columns':4,'rows':4,'sourceX':xs,'sourceY':ys},'npcs':{'cell':[64,80],'frames':2},'sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in OUT.glob('*.png')}}
(OUT/'manifest.json').write_text(json.dumps(meta,indent=2))
print('Packed terrain atlas and three two-frame NPC sheets.')
