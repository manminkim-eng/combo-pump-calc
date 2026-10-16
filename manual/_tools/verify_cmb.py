# 겸용 펌프(옥내소화전 + 스프링클러) v5.1.0 독립 검증 — 앱 엔진(index.html <script id="cmb-engine"> cmbCalc)과 따로 짠 파이썬 구현을 무작위 대조
# usage: python3 -I verify_cmb.py <index.html> [건수]
#  · 원문: NFTC 102(제2026-34호) 2.1.1 · 2.1.2 · 2.2.1.3 · 2.2.1.4 · 2.3.1 · 2.3.5 · 2.9.1 · 2.9.2 / NFTC 103(제2026-35호) 표 2.1.1.1 · 2.1.2 · 2.2.1.10 ~ 12 · 2.5.1 · 2.5.3.3 · 2.13.1 · 2.13.2
#           NFTC 604(제2023-44호) 2.1.1 · 2.2.1 · NFTC 608(제2026-40호) 2.3.1.1
#  · KS 강관 내경 = 외경 − 2 × 두께 (KS D 3507 · KS D 3562 Sch40) — 이 파일에서 다시 계산 · 참고값은 앱과 같은 값을 따로 옮겨 적음
import sys,json,math,random,subprocess,os,tempfile
html=open(sys.argv[1],encoding='utf-8').read(); N=int(sys.argv[2]) if len(sys.argv)>2 else 50000
a=html.index('<script id="cmb-engine">')+len('<script id="cmb-engine">'); eng=html[a:html.index('</script>',a)]
BASE={'F30':30,'F20':20,'S30':30,'S20':20,'H20':20,'H10':10,'T30':30,'P10':10,'P30':30}
OD={'3507':{25:(34.0,3.2),32:(42.7,3.5),40:(48.6,3.5),50:(60.5,3.8),65:(76.3,4.2),80:(89.1,4.2),100:(114.3,4.5),125:(139.8,4.5),150:(165.2,5.0),200:(216.3,5.8)},
    '3562':{25:(34.0,3.4),32:(42.7,3.6),40:(48.6,3.7),50:(60.5,3.9),65:(76.3,5.2),80:(89.1,5.5),100:(114.3,6.0),125:(139.8,6.6),150:(165.2,7.1),200:(216.3,8.2)}}
INNER={'SCH10':({d:round(o-2*t,2) for d,(o,t) in OD['3507'].items()},120),'SCH40':({d:round(o-2*t,2) for d,(o,t) in OD['3562'].items()},120),
 'STS':({25:27.6,32:36.8,40:42.8,50:54.8,65:70.0,80:85.0,100:108.2,125:133.4,150:160.0,200:210.0},150),
 'CPVC':({25:26.6,32:35.1,40:40.9,50:52.5,65:62.7,80:79.4,100:101.6,125:127.0,150:154.1,200:203.2},150)}
FIT={25:[0.9,0.54,1.5,0.27,0.18,7.5,4.5,2.0],32:[1.2,0.72,1.8,0.36,0.24,10.5,5.4,2.5],40:[1.5,0.90,2.1,0.45,0.30,13.8,6.5,3.1],50:[2.1,1.20,3.0,0.60,0.39,16.5,8.4,4.0],
 65:[2.4,1.30,3.6,0.75,0.48,19.5,10.2,4.6],80:[3.0,1.80,4.5,0.90,0.60,24.0,12.0,5.7],100:[4.2,2.40,6.3,1.20,0.81,37.5,16.5,7.6],125:[5.1,3.00,7.5,1.50,0.99,42.0,21.0,10.0],
 150:[6.0,3.60,9.0,1.80,1.20,49.5,24.0,12.0],200:[6.5,3.70,14.0,4.00,1.40,70.0,33.0,15.0]}
HOSE={1:(26,None),2:(12,None),3:(7,None),4:(3,None),5:(0,14)}
K={1:1.1,2:1.15}; HP=[3,5,7.5,10,15,20,25,30,40,50,60,75,100,125,150,200]; FK=['e90','e45','teeB','teeS','gate','ball','angle','check']
MPA=9.80665e-3
def loss(segs,pt,lim):
    inner,C=INNER[pt]; F=0.0; vo=0
    for s in segs:
        Di=inner[s['dia']]; L=s['len']+sum(s[k]*FIT[s['dia']][i] for i,k in enumerate(FK))
        F+=10.67*L*(s['flow']/60000)**1.852/(C**1.852*(Di/1000)**4.87)
        v=(s['flow']/60000)/(math.pi*(Di/2000)**2); vo+= v>lim(s)
    return F,vo
def py(h,hs,sp,ss,c,cs,bf):
    Fc,v1=loss(cs,c['pipeType'],lambda s:4)
    hA=min(2 if bf==1 else 5,max(1,h['hydrants'])); hQ=130*hA; hD=hA*{1:2.6,2:5.2,3:7.8}[bf]
    hF,v2=loss(hs,h['pipeType'],lambda s:4); r,fx=HOSE[h['hoseType']]; hG=fx if fx is not None else r*h['hoseLen']/100
    hJ=math.ceil((h['actualHead']+Fc+hF+hG+17)*1.1)
    n=BASE[sp['baseType']]; ni=sp['installN']; sA=ni if 0<ni<n else n; sQ=80*sA; sD=sA*{1:1.6,2:3.2,3:4.8}[bf]
    sF,v3=loss(ss,sp['pipeType'],lambda s:6 if s['kind']=='br' else 10)
    sJ=math.ceil((sp['actualHead']+Fc+sF+10)*1.1)
    mx=c['mode']=='max'; Q=max(hQ,sQ) if mx else hQ+sQ; D=max(hD,sD) if mx else hD+sD; Dt=D if c['roofEx'] else D*4/3
    J=max(hJ,sJ); P=0.163*(Q/1000)*J*K[c['transType']]/(c['pumpEff']/100); hp=P*1.341; Php=next((x for x in HP if x>=hp), math.ceil(hp/5)*5)
    S=J*MPA; ok=S<1.2 or all(x=='SCH40' for x in (h['pipeType'],sp['pipeType'],c['pipeType']))
    Th=(J-h['lowHead']-hG)*MPA; Ts=(J-sp['lowHead'])*MPA
    return dict(Fc=Fc,hJ=hJ,sJ=sJ,hD=hD,sD=sD,Q=Q,D=D,Dt=Dt,J=J,Pkw=P,Php=Php,S=S,ok=ok,prv=Th>0.7,over=Ts>1.2,vo=v1+v2+v3)
random.seed(20261016); cases=[]
def segs(fl,sizes,kind=False):
    return [dict(**({'kind':random.choice(['br','oth'])} if kind else {}),flow=random.choice(fl),dia=random.choice(sizes),len=round(random.uniform(0,80),1),**{k:random.randint(0,6) for k in FK}) for _ in range(random.randint(1,4))]
for _ in range(N):
    bf=random.randint(1,3); P=list(INNER)
    h=dict(hydrants=random.randint(1,7),actualHead=round(random.uniform(5,150),1),hoseLen=random.choice([15,30]),hoseType=random.randint(1,5),pipeType=random.choice(P),lowHead=round(random.uniform(-10,30),1))
    sp=dict(baseType=random.choice(list(BASE)),installN=random.choice([0,0,random.randint(1,35)]),actualHead=round(random.uniform(5,150),1),pipeType=random.choice(P),lowHead=round(random.uniform(-10,30),1))
    c=dict(pumpDia=150,pumpEff=random.randint(10,80),transType=random.randint(1,2),mode=random.choice(['sum','max']),roofEx=random.randint(0,1),pipeType=random.choice(P))
    cases.append((h,segs([130*k for k in range(1,6)],[40,50,65,80,100,125,150,200]),sp,segs([80*k for k in range(1,31)],list(FIT),True),c,segs([100*k for k in range(1,40)],[50,65,80,100,125,150,200]),bf))
tf=os.path.join(tempfile.gettempdir(),'_cmb_cases.json'); json.dump(cases,open(tf,'w'))
js=os.path.join(tempfile.gettempdir(),'_cmb_run.js')
open(js,'w',encoding='utf-8').write("var window=globalThis;\n"+eng+"\nconst cs=require(process.argv[2]);process.stdout.write(JSON.stringify(cs.map(a=>{const x=cmbCalc(...a);"
 "return {Fc:x.Fc,hJ:x.H.J,sJ:x.S.J,hD:x.H.D,sD:x.S.D,Q:x.C.Clpm,D:x.C.D,Dt:x.C.Dt,J:x.C.J,Pkw:x.C.Pkw,Php:x.C.Php,S:x.C.Pdis,ok:x.C.pipePressOK,prv:x.H.needPRV,over:x.S.overHead,vo:x.C.velOverN}})));")
E=json.loads(subprocess.check_output(['node',js,tf],maxbuffer=None) if False else subprocess.check_output(['node','--max-old-space-size=4096',js,tf])); bad=[]
for i,(cs,e) in enumerate(zip(cases,E)):
    p=py(*cs)
    for k in p:
        if isinstance(p[k],bool) or k in('vo','Php','hJ','sJ','J','Q'):
            if p[k]!=e[k]: bad.append((i,k,p[k],e[k])); break
        elif abs(p[k]-e[k])>1e-9*max(1,abs(p[k])): bad.append((i,k,p[k],e[k])); break
print(f'검사 {N}건 · 불일치 {len(bad)}건'); print(bad[:5])
print(f'판정 분포 — 최대값 단서 {sum(1 for c in cases if c[4]["mode"]=="max")}건 · 배관 부적합 {sum(1 for e in E if not e["ok"])}건 · 감압장치 {sum(1 for e in E if e["prv"])}건 · 헤드 상한 초과 {sum(1 for e in E if e["over"])}건 · 유속 초과 포함 {sum(1 for e in E if e["vo"])}건')
