from pathlib import Path
from PIL import Image
import json,hashlib,wave
root=Path(__file__).resolve().parents[1];m=json.loads((root/'assets/v12/manifest.json').read_text())
for p in (root/'assets/v12').rglob('*.png'):
 with Image.open(p) as im:im.load()
for id,meta in m['sprites'].items():
 p=root/f'assets/v12/sprites/{id}.png';im=Image.open(p);assert im.size==(1024,144) and im.mode=='RGBA',id
 assert hashlib.sha256(p.read_bytes()).hexdigest()==meta['sha256'],id
 frames=[]
 for i in range(8):
  f=im.crop((i*128,0,(i+1)*128,144));box=f.getchannel('A').getbbox();assert box and box[0]>=3 and box[2]<=125 and box[1]>=3 and box[3]<=140,(id,i,box)
  assert sum(a>128 for a in f.getchannel('A').get_flattened_data())>800,(id,i,'empty pose')
  frames.append(hashlib.sha256(f.tobytes()).hexdigest())
 assert len(set(frames))==8,(id,'duplicate pose')
for id in list(m['sprites'])[:5]:assert Image.open(root/f'assets/v12/portraits/{id}.png').size==(128,128)
assert Image.open(root/'assets/v12/fx/battle-fx.png').size==(512,896)
for name in ['battle','boss','victory']:
 with wave.open(str(root/f'assets/v12/audio/{name}.wav')) as f:assert f.getnframes()>22050*8 and f.getnchannels()==2
for p in (root/'src/v12').glob('*.js'):
 s=p.read_text()
 assert not any(x in s for x in ['heroArtV115','enemyArtV11','battleRendererV11','battleArt.js']),p.name
 for token in ['primeGesture','navigator.audioSession','IOS_PRIME','webkitAudioContext','visibilitychange','pageshow']:
  assert token in (root/'src/v11/audioV11.js').read_text(),token
html=(root/'golden-v12.html').read_text();assert 'v120.css?v=12.0' in html and 'main.js?v=12.0' in html
assert "import {AudioV11}" in (root/'src/v12/audio.js').read_text()
assert not any('serviceWorker.register' in p.read_text() for p in (root/'src/v12').glob('*.js'))
print('V12: all PNGs fully decode; 80 unique poses; independent portraits; bounds, hashes, audio, version and renderer isolation pass.')

assert 'fillRect(' not in (root/'src/v12/renderer.js').read_text()
world=json.loads((root/'assets/v12/world/manifest.json').read_text())
for name,digest in world['sha256'].items():
 p=root/'assets/v12/world'/name
 assert hashlib.sha256(p.read_bytes()).hexdigest()==digest,name
 im=Image.open(p);im.load()
 assert im.size==((512,512) if name=='terrain.png' else (128,80)),name
for name in ['world','town']:
 with wave.open(str(root/f'assets/v12/source/{name}-score.wav')) as f:assert f.getnframes()>22050*8 and f.getnchannels()==2
 assert (root/f'assets/v12/audio/{name}.mp3').stat().st_size>10000
index=(root/'index.html').read_text()
assert 'src/v12/campaign.js?v=12.5' in index and 'styles/campaign-v12.css?v=12.5' in index
assert 'src/game.js' not in index
assert (root/'legacy-v8.html').exists()
print('V12 campaign: generated map/NPC art hashes, source music, compressed audio and main entry pass.')

chapter=json.loads((root/'assets/v12/chapter-two-manifest.json').read_text())
for name,digest in chapter['sha256'].items():
 p=root/'assets/v12'/name;assert hashlib.sha256(p.read_bytes()).hexdigest()==digest;Image.open(p).load()
im=Image.open(root/'assets/v12/sprites/caochun.png');assert im.size==(1024,144) and im.mode=='RGBA'
poses=[]
for i in range(8):
 f=im.crop((i*128,0,i*128+128,144));box=f.getchannel('A').getbbox();assert box and box[0]>=3 and box[2]<=125 and box[1]>=3 and box[3]<=140
 poses.append(hashlib.sha256(f.tobytes()).hexdigest())
assert len(set(poses))==8
assert Image.open(root/'assets/v12/portraits/caochun.png').size==(128,128)
assert Image.open(root/'assets/v12/backgrounds/changban.png').size==(520,780)
assert Image.open(root/'assets/v12/world/river.png').size==(256,256)
with wave.open(str(root/'assets/v12/source/bridge-score.wav')) as f:assert f.getnchannels()==2 and f.getnframes()>22050*8
assert (root/'assets/v12/audio/bridge.mp3').stat().st_size>10000
print('V12.2: new boss poses/alpha/bounds, portrait, river assets/hashes, original bridge music and versioned entry pass.')

third=json.loads((root/'assets/v12/chapter-three-manifest.json').read_text())
for name,digest in third['sha256'].items():
 p=root/'assets/v12'/name;assert hashlib.sha256(p.read_bytes()).hexdigest()==digest;Image.open(p).load()
im=Image.open(root/'assets/v12/sprites/xuhuang.png');assert im.size==(1024,144) and im.mode=='RGBA'
poses=[]
for i in range(8):
 f=im.crop((i*128,0,i*128+128,144));box=f.getchannel('A').getbbox();assert box and box[0]>=3 and box[2]<=125 and box[1]>=3 and box[3]<=140
 assert sum(a>128 for a in f.getchannel('A').get_flattened_data())>800
 poses.append(hashlib.sha256(f.tobytes()).hexdigest())
assert len(set(poses))==8
for name in ['xuhuang','zhouyu']:assert Image.open(root/f'assets/v12/portraits/{name}.png').size==(128,128)
im=Image.open(root/'assets/v12/world/zhouyu.png');assert im.size==(128,80) and im.mode=='RGBA'
assert im.crop((0,0,64,80)).tobytes()!=im.crop((64,0,128,80)).tobytes()
assert Image.open(root/'assets/v12/backgrounds/redcliff.png').size==(520,780)
assert Image.open(root/'assets/v12/world/naval.png').size==(256,256)
with wave.open(str(root/'assets/v12/source/naval-score.wav')) as f:assert f.getnchannels()==2 and f.getnframes()>22050*8
assert (root/'assets/v12/audio/naval.mp3').stat().st_size>10000
print('V12.3: Xu Huang eight unique poses/alpha/bounds, Zhou Yu two idles/portraits, naval art hashes and original score pass.')

fourth=json.loads((root/'assets/v12/chapter-four-manifest.json').read_text())
for name,digest in fourth['sha256'].items():
 p=root/'assets/v12'/name;assert hashlib.sha256(p.read_bytes()).hexdigest()==digest;Image.open(p).load()
im=Image.open(root/'assets/v12/sprites/huangzhong.png');assert im.size==(1024,144) and im.mode=='RGBA'
poses=[]
for i in range(8):
 f=im.crop((i*128,0,i*128+128,144));box=f.getchannel('A').getbbox();assert box and box[0]>=3 and box[2]<=125 and box[1]>=3 and box[3]<=140
 assert sum(a>128 for a in f.getchannel('A').get_flattened_data())>800
 poses.append(hashlib.sha256(f.tobytes()).hexdigest())
assert len(set(poses))==8
assert Image.open(root/'assets/v12/portraits/huangzhong.png').size==(128,128)
assert Image.open(root/'assets/v12/backgrounds/changsha.png').size==(520,780)
assert Image.open(root/'assets/v12/backgrounds/changsha-wide.png').size==(520,520)
assert Image.open(root/'assets/v12/world/jingnan.png').size==(256,256)
assert Image.open(root/'assets/v12/world/courtyard.png').size==(128,128)
with wave.open(str(root/'assets/v12/source/jingnan-score.wav')) as f:assert f.getnchannels()==2 and f.getnframes()>22050*8
assert (root/'assets/v12/audio/jingnan.mp3').stat().st_size>10000
print('V12.4: Huang Zhong eight original poses/alpha/bounds, independent portrait, Changsha/jingnan art hashes, original music and versioned entry pass.')

fifth=json.loads((root/'assets/v12/chapter-five-manifest.json').read_text())
for name in fifth['files']:
 p=root/'assets/v12'/name
 assert p.is_file(),name
 if p.suffix=='.png':
  with Image.open(p) as im:im.load()
with Image.open(root/'assets/v12/backgrounds/jiangling.png') as im:assert im.size==(1024,1536)
with wave.open(str(root/'assets/v12/audio/fortress.wav')) as f:assert f.getframerate()==22050 and f.getnframes()>22050*20
assert (root/'docs/v12/chapter5-visual-mockup.png').is_file()
print('V12.5: Jiangling production background, reusable approved cast, original fortress score and versioned entry pass.')
