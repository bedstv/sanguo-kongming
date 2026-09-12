export const VERSION = '5.0.0';

export const PARTY_TEMPLATE = [
  {id:'liubei',name:'劉備',role:'主將',level:1,exp:0,maxHp:4200,hp:4200,maxSp:24,sp:24,atk:64,def:62,int:74,agi:62,weapon:'bronzeSword',armor:'clothArmor'},
  {id:'guanyu',name:'關羽',role:'猛將',level:1,exp:0,maxHp:5000,hp:5000,maxSp:14,sp:14,atk:82,def:72,int:54,agi:67,weapon:'crescentBlade',armor:'clothArmor'},
  {id:'zhangfei',name:'張飛',role:'猛將',level:1,exp:0,maxHp:5200,hp:5200,maxSp:10,sp:10,atk:86,def:68,int:34,agi:58,weapon:'ironSpear',armor:'clothArmor'},
  {id:'zhaoyun',name:'趙雲',role:'武將',level:1,exp:0,maxHp:4700,hp:4700,maxSp:16,sp:16,atk:78,def:70,int:58,agi:82,weapon:'ironSpear',armor:'clothArmor'},
  {id:'kongming',name:'孔明',role:'軍師',level:1,exp:0,maxHp:3600,hp:3600,maxSp:42,sp:42,atk:42,def:54,int:98,agi:66,weapon:'featherFan',armor:'scholarRobe'}
];

export const ITEMS = {
  bronzeSword:{id:'bronzeSword',name:'青銅劍',type:'weapon',price:180,atk:8,desc:'基礎單手劍。'},
  ironSpear:{id:'ironSpear',name:'鐵槍',type:'weapon',price:260,atk:12,desc:'槍兵常用兵器。'},
  crescentBlade:{id:'crescentBlade',name:'偃月刀',type:'weapon',price:420,atk:18,desc:'重型長刀，攻擊力高。'},
  featherFan:{id:'featherFan',name:'羽扇',type:'weapon',price:360,atk:4,int:10,desc:'軍師專用，可提升智力。'},
  steelSpear:{id:'steelSpear',name:'精鋼槍',type:'weapon',price:700,atk:24,desc:'新野工匠鍛造的精鋼槍。'},
  generalBlade:{id:'generalBlade',name:'將軍刀',type:'weapon',price:820,atk:28,desc:'適合前線武將。'},
  clothArmor:{id:'clothArmor',name:'布甲',type:'armor',price:140,def:5,desc:'輕便護甲。'},
  leatherArmor:{id:'leatherArmor',name:'皮甲',type:'armor',price:360,def:12,desc:'兼顧移動與防護。'},
  scaleArmor:{id:'scaleArmor',name:'鱗甲',type:'armor',price:760,def:22,agi:-2,desc:'厚重但防護優秀。'},
  scholarRobe:{id:'scholarRobe',name:'軍師袍',type:'armor',price:460,def:8,int:8,desc:'軍師服，強化智力。'},
  ration:{id:'ration',name:'軍糧',type:'consumable',price:80,heal:1600,desc:'恢復單一武將兵力。'},
  spiritTea:{id:'spiritTea',name:'醒神茶',type:'consumable',price:120,sp:12,desc:'恢復策略值。'}
};

export const SHOP_STOCK = ['steelSpear','generalBlade','leatherArmor','scaleArmor','scholarRobe','ration','spiritTea'];

export const SKILLS = [
  {id:'fire',name:'火攻計',cost:5,type:'damage',power:1.28,minInt:0},
  {id:'thunder',name:'落雷計',cost:9,type:'damage',power:1.72,minInt:78},
  {id:'heal',name:'聖雨',cost:6,type:'heal',power:1.0,minInt:70},
  {id:'confuse',name:'擾亂計',cost:7,type:'debuff',power:1.0,minInt:80}
];

export const ENEMIES = {
  scout:{name:'魏軍斥候',maxHp:2200,atk:58,def:48,int:38,agi:64,exp:35,gold:38,archetype:'scout'},
  pikeman:{name:'魏軍槍兵',maxHp:2700,atk:64,def:56,int:32,agi:52,exp:45,gold:45,archetype:'pikeman'},
  archer:{name:'魏軍弓手',maxHp:2400,atk:62,def:44,int:42,agi:68,exp:42,gold:46,archetype:'archer'},
  officer:{name:'魏軍校尉',maxHp:3600,atk:72,def:62,int:50,agi:58,exp:70,gold:75,archetype:'officer'},
  caoren:{name:'曹仁',maxHp:8800,atk:82,def:78,int:62,agi:60,exp:180,gold:220,archetype:'caoren'},
  zhanghe:{name:'張郃',maxHp:8200,atk:84,def:69,int:60,agi:78,exp:180,gold:220,archetype:'zhanghe'},
  xiahoudun:{name:'夏侯惇',maxHp:14500,atk:92,def:82,int:58,agi:70,exp:420,gold:520,archetype:'xiahoudun'}
};

export const FORMATIONS = {
  鶴翼:{atk:1,def:1,agi:1,desc:'均衡陣型'},
  魚鱗:{atk:.95,def:.86,agi:.94,desc:'減少所受傷害'},
  鋒矢:{atk:1.16,def:1.08,agi:1,desc:'提高攻擊、略降防禦'},
  雁行:{atk:1.02,def:1,agi:1.16,desc:'提高速度'}
};

export const MAPS = {
  xinye:{
    name:'新野城',kind:'town',width:16,height:12,start:{x:8,y:9},exit:{x:8,y:11,to:'overworld',toX:7,toY:8},
    rows:['################','##............##','##..SS....II..##','##............##','##..NN....NN..##','##............##','##......PP....##','##............##','##..NN....NN..##','##............##','##............##','#######..#######'],
    npcs:[
      {x:6,y:6,id:'officer',name:'守城校尉',dialog:['主公，北方道路近日有曹軍斥候出沒。','若要出城，請從南門離開。']},
      {x:4,y:4,id:'citizen',name:'百姓',dialog:['聽說隆中有位先生，連州牧都敬他三分。']},
      {x:11,y:4,id:'merchant',name:'商人',dialog:['軍情吃緊，城裡的兵器賣得特別快。']}
    ]
  },
  longzhong:{
    name:'隆中',kind:'village',width:14,height:10,start:{x:7,y:8},exit:{x:7,y:9,to:'overworld',toX:11,toY:4},
    rows:['##############','#............#','#..TT....TT..#','#............#','#....HH......#','#............#','#..NN........#','#............#','#............#','######..######'],
    npcs:[
      {x:4,y:6,id:'villager',name:'村民',dialog:['先生平日喜愛觀天象，也常談天下大勢。']},
      {x:6,y:4,id:'kongmingNpc',name:'孔明',dialog:['天下三分，荊益可為基業。','主公若真有大志，請先回新野整軍。','曹軍不久將至，我已有一計。']}
    ]
  },
  bowang:{
    name:'博望坡',kind:'battlefield',width:16,height:12,start:{x:8,y:10},exit:{x:8,y:11,to:'overworld',toX:18,toY:8},
    rows:['################','#..TT......TT..#','#......RR......#','#..TT..RR..TT..#','#......RR......#','#..TT..RR..TT..#','#......RR......#','#..TT..RR..TT..#','#......RR......#','#......RR......#','#......RR......#','#######..#######'],
    npcs:[]
  },
  overworld:{
    name:'荊州北境',kind:'world',width:26,height:14,start:{x:7,y:8},
    rows:['WWWWWWWWWWWWWWWWWWWWWWWWWW','W....FF....RR......FF......W','W..TTTT....RR..TTTT........W','W..........RR..............W','W.......RRRRR..L...........W','W..FF...R......RR....FF....W','W.......R.......R..........W','W..TT...R.......RRRR.......W','W......XR..........R..B....W','W..FF...R..........R.......W','W......RRRRRRRRRRRRR.......W','W..........................W','W....TT........FF..........W','WWWWWWWWWWWWWWWWWWWWWWWWWW'],
    points:{X:{name:'新野城',to:'xinye'},L:{name:'隆中',to:'longzhong'},B:{name:'博望坡',to:'bowang'}}
  }
};

export const STORY_TEXT = {
  intro:'劉備：「曹操勢大，我軍必須先穩住新野。聽聞隆中有大才，先去拜訪。」',
  longzhong:'孔明：「曹軍不久將南下。請主公先回新野整備，我自會同行。」',
  returned:'孔明：「主公，博望坡地形狹窄，正可用火攻。先整備裝備，再往東北迎敵。」',
  bowangIntro:'趙雲：「前方發現曹軍先鋒！」',
  bossIntro:'夏侯惇：「劉備小兒，今日看你往哪裡逃！」',
  chapterClear:'孔明：「博望坡首戰已勝。這只是開始。」\n第一章完成！'
};
