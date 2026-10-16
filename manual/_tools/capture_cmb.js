// 겸용 펌프 용량 계산서(옥내소화전 + 스프링클러) 매뉴얼 화면 캡처 — usage: node capture_cmb.js <repoDir> <outDir>
// 규격: 1440×900 · DSF 1.25 (영상용 좁은 화면: MM_VW=720 MM_VH=1280 MM_DSF=2) · serviceWorkers block · _marks.json · _example.json(앱 엔진 결과)
// 입력은 앱의 캡처용 창구 window.__mmCmb 로 넣고, 결과는 window.CMBENG.calc(엔진)로 읽는다.
const {chromium}=require(process.env.MM_PW||'playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const VW=+(process.env.MM_VW||1440),VH=+(process.env.MM_VH||900),DSF=+(process.env.MM_DSF||1.25),PORT=8920;
/* 예제 A = 익산 ○○ 업무시설(지상 9층) — 일반 · 소화전 2개 + 헤드 10개 · 합산 1,060 L/min
   예제 B = ○○ 오피스텔(지상 29층 · 높이 105 m — 고층건축물 아님) — 11층 이상 30개 · 2,660 L/min · 1.2 MPa 배관 · 감압
   예제 C = ○○ 판매시설(지상 2층) — 설치개수 24개 · 방화벽 구획 단서(최대값) · 옥상수조 면제 */
const EX={"A": {"proj": {"name": "익산시 ○○동 업무시설(지상 9층) 신축공사", "designer": "김만민", "date": "2026-10-16"}, "bf": 1, "hSys": {"hydrants": 3, "actualHead": 36, "hoseLen": 30, "hoseType": 2, "pipeType": "SCH10", "lowHead": 1.5}, "hSegs": [{"flow": 260, "dia": 100, "len": 40, "e90": 3, "e45": 0, "teeB": 1, "teeS": 9, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"flow": 260, "dia": 80, "len": 8, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"flow": 130, "dia": 65, "len": 6, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"flow": 130, "dia": 50, "len": 10, "e90": 1, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 1, "check": 0}], "sSys": {"baseType": "H10", "installN": 0, "actualHead": 38, "pipeType": "SCH10", "lowHead": 3}, "sSegs": [{"kind": "oth", "flow": 800, "dia": 100, "len": 45, "e90": 2, "e45": 0, "teeB": 1, "teeS": 8, "gate": 0, "ball": 0, "angle": 1, "check": 0}, {"kind": "oth", "flow": 640, "dia": 80, "len": 25, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"kind": "oth", "flow": 320, "dia": 65, "len": 12, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"kind": "br", "flow": 160, "dia": 40, "len": 8, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}], "cPump": {"pumpDia": 150, "pumpEff": 65, "transType": 1, "mode": "sum", "roofEx": 0, "pipeType": "SCH10"}, "cSegs": [{"flow": 1060, "dia": 150, "len": 12, "e90": 2, "e45": 0, "teeB": 1, "teeS": 0, "gate": 2, "ball": 0, "angle": 1, "check": 1}]}, "B": {"proj": {"name": "○○ 오피스텔(지상 29층 · 높이 105 m) 신축공사", "designer": "김만민", "date": "2026-10-16"}, "bf": 1, "hSys": {"hydrants": 2, "actualHead": 100, "hoseLen": 30, "hoseType": 2, "pipeType": "SCH40", "lowHead": 1.5}, "hSegs": [{"e45": 0, "teeS": 28, "gate": 0, "ball": 0, "angle": 0, "check": 0, "e90": 4, "teeB": 1, "flow": 260, "dia": 100, "len": 95}, {"e45": 0, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0, "e90": 0, "teeB": 1, "flow": 260, "dia": 80, "len": 6}, {"e45": 0, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0, "e90": 0, "teeB": 1, "flow": 130, "dia": 65, "len": 6}, {"e45": 0, "teeS": 0, "gate": 0, "ball": 0, "angle": 1, "check": 0, "e90": 1, "teeB": 1, "flow": 130, "dia": 50, "len": 10}], "sSys": {"baseType": "T30", "installN": 0, "actualHead": 98, "pipeType": "SCH40", "lowHead": 3}, "sSegs": [{"kind": "oth", "e45": 0, "teeS": 28, "gate": 0, "ball": 0, "angle": 1, "check": 0, "e90": 3, "teeB": 1, "flow": 2400, "dia": 150, "len": 95}, {"kind": "oth", "e45": 0, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0, "e90": 0, "teeB": 1, "flow": 1600, "dia": 125, "len": 20}, {"kind": "oth", "e45": 0, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0, "e90": 0, "teeB": 1, "flow": 800, "dia": 100, "len": 10}, {"kind": "br", "e45": 0, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0, "e90": 0, "teeB": 1, "flow": 160, "dia": 40, "len": 8}], "cPump": {"pumpDia": 150, "pumpEff": 70, "transType": 1, "mode": "sum", "roofEx": 0, "pipeType": "SCH40"}, "cSegs": [{"e45": 0, "teeS": 0, "gate": 2, "ball": 0, "angle": 1, "check": 1, "e90": 2, "teeB": 1, "flow": 2660, "dia": 200, "len": 15}]}, "C": {"proj": {"name": "○○ 판매시설(지상 2층) 신축공사", "designer": "김만민", "date": "2026-10-16"}, "bf": 1, "hSys": {"hydrants": 2, "actualHead": 12, "hoseLen": 30, "hoseType": 2, "pipeType": "SCH10", "lowHead": 1.5}, "hSegs": [{"flow": 260, "dia": 100, "len": 30, "e90": 3, "e45": 0, "teeB": 1, "teeS": 4, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"flow": 130, "dia": 65, "len": 8, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"flow": 130, "dia": 50, "len": 10, "e90": 1, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 1, "check": 0}], "sSys": {"baseType": "S30", "installN": 24, "actualHead": 11, "pipeType": "SCH10", "lowHead": 4}, "sSegs": [{"kind": "oth", "flow": 1920, "dia": 150, "len": 40, "e90": 2, "e45": 0, "teeB": 1, "teeS": 6, "gate": 0, "ball": 0, "angle": 1, "check": 0}, {"kind": "oth", "flow": 960, "dia": 100, "len": 20, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"kind": "oth", "flow": 480, "dia": 80, "len": 10, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}, {"kind": "br", "flow": 160, "dia": 32, "len": 6, "e90": 0, "e45": 0, "teeB": 1, "teeS": 0, "gate": 0, "ball": 0, "angle": 0, "check": 0}], "cPump": {"pumpDia": 150, "pumpEff": 65, "transType": 1, "mode": "max", "roofEx": 1, "pipeType": "SCH10"}, "cSegs": [{"flow": 1920, "dia": 150, "len": 10, "e90": 2, "e45": 0, "teeB": 1, "teeS": 0, "gate": 2, "ball": 0, "angle": 1, "check": 1}]}};
const FREEZE=`(()=>{const T=new Date(2026,9,16,10,0,0).getTime();const D=Date;class F extends D{constructor(...a){if(a.length)super(...a);else super(T);}static now(){return T;}}window.Date=F;window.alert=()=>{};window.confirm=()=>true;try{localStorage.clear();localStorage.setItem('pwa-dismissed','1');}catch(e){}})()`;
const HIDE='#toast,.toast,#pwa-banner,#pwa-install-bar,#ios-guide-modal,.pwa-banner,.pwa-install-banner,.pwa-install-fab{display:none!important}';
const HELP=`window.__vis=e=>e&&e.getClientRects().length>0;
window.__leaf=t=>[...document.querySelectorAll('div,span,label,b')].filter(x=>x.children.length===0&&__vis(x)&&x.textContent.trim().startsWith(t));
window.__box=t=>{const h=[...document.querySelectorAll('.box-hd')].find(x=>x.textContent.includes(t)&&__vis(x));return h?h.parentElement:null;};
window.__lab=t=>{const l=__leaf(t)[0];return l?l.parentElement:null;};
window.__card=t=>{const l=__leaf(t)[0];return l?l.parentElement:null;};
window.__row=t=>{const td=[...document.querySelectorAll('#report-zone td')].find(x=>x.textContent.trim()===t&&__vis(x));return td?td.parentElement:null;};
window.__find=sel=>{if(sel.startsWith('box:'))return __box(sel.slice(4));if(sel.startsWith('lab:'))return __lab(sel.slice(4));if(sel.startsWith('card:'))return __card(sel.slice(5));if(sel.startsWith('row:'))return __row(sel.slice(4));
 if(sel.startsWith('nth:')){const [q,i]=sel.slice(4).split('|');return [...document.querySelectorAll(q)].filter(__vis)[+i]||null;}
 for(const s of sel.split(',')){const e=[...document.querySelectorAll(s)].find(__vis);if(e)return e;}return null;};
window.__EX=${JSON.stringify(EX)};
window.__run=(k,tab)=>{const e=__EX[k],m=__mmCmb;m.setShowFormula(false);m.setProj(e.proj);m.setBuildingFloor(e.bf);m.setHSys(e.hSys);m.setHSegs(e.hSegs);m.setSSys(e.sSys);m.setSSegs(e.sSegs);m.setCPump(e.cPump);m.setCSegs(e.cSegs);m.setTab(tab||0);window.scrollTo(0,0);};
window.__ex=k=>{const e=__EX[k];const x=CMBENG.calc(e.hSys,e.hSegs,e.sSys,e.sSegs,e.cPump,e.cSegs,e.bf);const pick=(o,ks)=>Object.fromEntries(ks.map(q=>[q,o[q]]));
 return {in:e,Fc:x.Fc,cseg:x.cdets.map(d=>({fric:d.fric,tl:d.tl,hl:d.hl,vel:d.vel})),
  H:{...pick(x.H,['A','B','Clpm','D','E','Fc','F','G','H4','I','Jraw','J','hMaxCount','hWaterTime','hL','Plow','needPRV','hStar','pipeOK']),seg:x.H.sdets.map(d=>({hl:d.hl,vel:d.vel}))},
  S:{...pick(x.S,['A','B','Clpm','D','E','Fc','F','G','I','Jraw','J','sWaterPer','nInst','useInst','hL','Plow','overHead','hStar','pipeOK']),btype:x.S.btype,seg:x.S.sdets.map(d=>({hl:d.hl,vel:d.vel,vlim:d.vlim}))},
  C:pick(x.C,['hiRise','maxMode','Clpm','J','D','R','Dt','roofEx','M','N','K','Pkw','Php','hHead','Pdis','hiPress','pipePressOK','velOverN'])};};`;
const SHOTS=[
 {id:'s01_overview',pre:"__run('A',0)",clip:'viewport',m:[['.tab-bar-wrap','작업 탭 · 매뉴얼'],['.sum-bar','요약 바'],['box:프로젝트 정보','프로젝트 · 건축물 규모'],['box:Ⅰ. 옥내소화전','옥내소화전 파라미터'],['.formula-fab','계산식 안내']]},
 {id:'s02_header',clip:'nth:.no-print|0',m:[['nth:.tab-bar-wrap button|0','① 옥내소화전 입력'],['nth:.tab-bar-wrap button|1','② 스프링클러 입력'],['nth:.tab-bar-wrap button|2','③ 겸용펌프 결과'],['nth:.tab-bar-wrap button|3','④ 계산서 출력'],['.tb-manual','📘 매뉴얼'],['.hdr-right','근거 · 공고 · 시행일']]},
 {id:'s03_project',clip:'box:프로젝트 정보',m:[['lab:공사명','공사명'],['lab:설계자','설계자'],['lab:작성일','작성일'],['lab:🏢 건축물 규모','건축물 규모 — 일반 · 고층건축물 · 50층 이상']]},
 {id:'s04_hyd',clip:'box:Ⅰ. 옥내소화전',m:[['lab:A. 최대구역','A. 가장 많은 층 소화전 수'],['lab:F. 실양정','F. 실양정'],['lab:F-1. 최저층 방수구','F-1. 최저층 방수구 높이'],['lab:G. 호스 길이','G. 호스 길이'],['lab:G-1. 호스 타입','G-1. 호스 종류'],['lab:배관 종류','배관 종류(C값)']]},
 {id:'s05_hseg',clip:'box:Ⅰ-2',crop:620,m:[['nth:#root table tbody tr|0','1구간 — 분기 후 100A'],['nth:#root table tbody tr|3','4구간 — 방수구 50A'],['nth:button|__ADD__','＋ 구간 추가']]},
 {id:'s06_spk',pre:"__mmCmb.setTab(1)",wait:900,clip:'box:Ⅱ. 스프링클러',m:[['lab:A. 기준개수','A. 기준개수 — 표 2.1.1.1 · NFTC 608'],['lab:A-1. 설치개수','A-1. 설치개수'],['lab:F. 실양정','F. 실양정'],['lab:F-1. 최저층 헤드','F-1. 최저층 헤드 높이'],['lab:배관 종류','배관 종류(C값)']]},
 {id:'s07_sseg',clip:'box:Ⅱ-2',crop:640,m:[['nth:.seg-kind|0','구분 — 가지 / 교차·주'],['nth:#root table tbody tr|0','1구간 — 교차·주 100A'],['nth:#root table tbody tr|3','4구간 — 가지 40A']]},
 {id:'s08_cparam',pre:"__mmCmb.setTab(2)",wait:900,clip:'box:겸용 펌프 파라미터',m:[['lab:펌프 토출구경','펌프 구경'],['lab:펌프 효율','펌프 효율'],['lab:동력 전달방식','전달방식'],['lab:겸용 기준','겸용 기준 — 합산 / 방화벽 구획 최대값'],['lab:옥상수조','옥상수조 1/3'],['lab:공통 배관 종류','공통 배관 종류']]},
 {id:'s09_cseg',clip:'box:Ⅲ-1',crop:420,m:[['nth:#root table tbody tr|0','공통 배관 150A · 1,060 L/min']]},
 {id:'s10_result',clip:'.g-res',m:[['nth:.g-res > div|0','옥내소화전 단독 — 전양정 65 m'],['nth:.g-res > div|1','스프링클러 단독 — 전양정 61 m'],['card:공통 배관 (F₀)','공통 배관 F₀ 가산']]},
 {id:'s11_final',clip:'.mm-final',m:[['.mm-basis','겸용 설계 기준'],['nth:.mm-press > div|0','S 배관 사용압력'],['nth:.mm-press > div|1','T₁ 옥내소화전 최저층 노즐'],['nth:.mm-press > div|2','T₂ 스프링클러 최저층 헤드'],['.g-4cp','펌프 선정 결과']]},
 {id:'s12_b_final',pre:"__run('B',2)",wait:1000,clip:'.mm-final',m:[['.mm-basis','합산 2,660 L/min · 70.933 m³'],['nth:.mm-press > div|0','1.334 MPa — KS D 3562'],['nth:.mm-press > div|1','감압장치 필요'],['nth:.mm-press > div|2','헤드 1.2 MPa 초과 — 감압 검토']]},
 {id:'s13_c_cparam',pre:"__run('C',2)",wait:1000,clip:'box:겸용 펌프 파라미터',m:[['lab:겸용 기준','최대값 — 방화벽 · 방화문 구획'],['lab:옥상수조','면제 — 높이 10 m 이하']]},
 {id:'s14_c_final',clip:'.mm-final',m:[['.mm-basis','max(260, 1,920) · 38.400 m³']]},
 {id:'s15_hirise',pre:"__run('A',0);__mmCmb.setBuildingFloor(2)",wait:900,clip:'box:프로젝트 정보',post:"__mmCmb.setBuildingFloor(1)",m:[['lab:🏢 건축물 규모','고층건축물 선택'],['.mm-hirise','NFTC 604 2.1.3 · 2.2.3 — 겸용 펌프 불가']]},
 {id:'s16_formula',pre:"__run('A',0);setTimeout(()=>__mmCmb.setShowFormula(true),50)",wait:900,fixed:true,clip:'.fml-box',m:[]},
 {id:'s17_formula_c',pre:"[...document.querySelectorAll('.fml-tab')][3].click()",wait:500,fixed:true,clip:'.fml-box',m:[]},
 {id:'s18_formula_p',pre:"[...document.querySelectorAll('.fml-tab')][4].click()",wait:500,fixed:true,clip:'.fml-box',post:"__mmCmb.setShowFormula(false)",m:[]},
 {id:'s19_a4',pre:"__run('A',3)",wait:1500,clip:'viewport',m:[['#btn-jpg','JPG 저장'],['.mm-btn-pdf','인쇄 · PDF'],['#report-zone','A4 계산서']]},
 {id:'s20_a4page',clip:'#report-zone',crop:1900,m:[['nth:#report-zone .print-section|0','Ⅰ 옥내소화전 A ~ T₁'],['row:F₀','공통 배관 F₀'],['nth:#report-zone .print-section|1','Ⅱ 스프링클러 A ~ T₂']]},
 {id:'s21_a4page3',clip:'nth:#report-zone .print-section|5',m:[['nth:#report-zone .print-section|5','Ⅲ 겸용 — 토출량 · 전양정 · 총 저수량 · 압력']]},
];
(async()=>{
 const s=await server(repo,PORT);const b=await chromium.launch({args:['--lang=ko-KR'],env:{...process.env,LANG:'ko_KR.UTF-8',LANGUAGE:'ko',LC_ALL:'ko_KR.UTF-8'}});
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block',locale:'ko-KR'});await setup(ctx);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(FREEZE);
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.waitForFunction(()=>window.__mmCmb&&window.CMBENG,null,{timeout:20000});await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(1500);
 await pg.addStyleTag({content:HIDE});await pg.evaluate(HELP);
 await pg.evaluate("__run('A',0)");await pg.waitForTimeout(600);
 const addIdx=await pg.evaluate(()=>[...document.querySelectorAll('button')].filter(__vis).findIndex(x=>x.textContent.includes('구간 추가')));
 SHOTS.forEach(S=>S.m.forEach(m=>{m[0]=m[0].replace('__ADD__',addIdx);}));
 const ex={};const meta={};
 for(const S of SHOTS){
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||700);
  if(S.clip!=='viewport'&&!S.fixed){await pg.evaluate(c=>{const e=__find(c);if(e){window.scrollTo(0,e.getBoundingClientRect().top+scrollY-40);}},S.clip);await pg.waitForTimeout(500);}
  if(S.id==='s01_overview')ex.A=await pg.evaluate("__ex('A')");
  if(S.id==='s12_b_final')ex.B=await pg.evaluate("__ex('B')");
  if(S.id==='s13_c_cparam')ex.C=await pg.evaluate("__ex('C')");
  if(S.id==='s20_a4page')ex.A_a4=await pg.evaluate(()=>document.getElementById('report-zone').innerText.replace(/\s+/g,' '));
  if(S.id==='s04_hyd')ex.A_ui=await pg.evaluate(()=>document.querySelector('.sum-bar').innerText.replace(/\s+/g,' '));
  const info=await pg.evaluate(({S,VW,VH})=>{
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=__find(S.clip);if(!el)return {err:'clip '+S.clip};const a=abs(el);clip={x:a.x,y:a.y,width:a.w,height:a.h};
     const P=12;clip={x:Math.max(0,clip.x-P),y:Math.max(0,clip.y-P),width:clip.width+2*P,height:clip.height+2*P};
     if(S.crop&&clip.height>S.crop)clip.height=S.crop;}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=__find(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(Math.min(a.w,clip.x+clip.width-a.x)/clip.width*100).toFixed(2),h:+(Math.min(a.h,clip.y+clip.height-a.y)/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);continue;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW-Math.max(0,c.x)),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else if(S.fixed){const sx=await pg.evaluate(()=>scrollX),sy=await pg.evaluate(()=>scrollY);await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:Math.max(0,c.x-sx),y:Math.max(0,c.y-sy),width:Math.min(c.width,VW),height:Math.min(c.height,VH-Math.max(0,c.y-sy))}});}
  else{try{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}catch(e){errs.push(S.id+' shot '+JSON.stringify(cl));continue;}}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(Math.min(cl.height,S.fixed?VH:1e9)),marks:info.marks};
  if(S.post){try{await pg.evaluate(S.post);}catch(e){errs.push(S.id+' post '+e.message);}await pg.waitForTimeout(400);}
 }
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true,locale:'ko-KR'});await setup(mctx);
 const mp=await mctx.newPage();await mp.addInitScript(FREEZE);
 await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForFunction(()=>window.__mmCmb,null,{timeout:20000});await mp.waitForTimeout(1500);
 await mp.addStyleTag({content:HIDE});await mp.evaluate(HELP);await mp.evaluate("__run('A',0)");await mp.waitForTimeout(800);
 await mp.evaluate(()=>{const e=__box('Ⅰ. 옥내소화전');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-12);});await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s22_mobile_main.png')});meta['s22_mobile_main']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{__mmCmb.setTab(2);});await mp.waitForTimeout(900);await mp.evaluate(()=>{const e=document.querySelector('.mm-final');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-12);});await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s23_mobile_result.png')});meta['s23_mobile_result']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{__mmCmb.setTab(3);window.scrollTo(0,0);});await mp.waitForTimeout(1500);
 await mp.screenshot({path:path.join(out,'s24_mobile_a4.png')});meta['s24_mobile_a4']={w:390,h:844,marks:[]};
 ex.mobile=await mp.evaluate(()=>({page:document.documentElement.scrollWidth,vw:innerWidth}));
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(meta,null,1));fs.writeFileSync(path.join(out,'_example.json'),JSON.stringify(ex,null,1));
 const miss=[];Object.entries(meta).forEach(([k,v])=>v.marks.forEach(m=>{if(m.miss)miss.push(k+':'+m.miss);else if(m.x<0||m.y<0||m.x+m.w>100.5||m.y+m.h>100.5||m.w<=0||m.h<=0)miss.push(k+':OUT '+m.label+' '+m.x+','+m.y+','+m.w+','+m.h);}));
 const sh=o=>o&&{Hj:o.H.J,Sj:o.S.J,Q:o.C.Clpm,D:o.C.D,Dt:o.C.Dt,J:o.C.J,HP:o.C.Php,S:o.C.Pdis};
 console.log(JSON.stringify({A:sh(ex.A),B:sh(ex.B),C:sh(ex.C),mobile:ex.mobile,sizes:Object.fromEntries(Object.entries(meta).map(([k,v])=>[k,v.w+'x'+v.h])),miss,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
})();
