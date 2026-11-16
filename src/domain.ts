export type Confidence='已確認'|'仍需確認'|'無法確認';
export type Evidence={source:string;url:string|null;official:boolean;kind:'current'|'event'|'static';value:string;updated:string|null;retrieved:string;start:string|null;end:string|null};
export type Fact={id:string;title:string;evidence:Evidence[]};
export type Context={problem:string;location:string;time:string;zone:string;original:string;entry:string};
export type Option={id:string;strategy:string;place:string;steps:string;reason:string;minutes:number|null;impact:string;facts:string[]};
export type Scenario={id:string;name:string;context:Context;facts:Fact[];options:Option[]};
export const strategies=['最省時間','最少改動','其他推薦'];
export function instant(local:string,zone:string):number {
 const parsed=Date.parse(local+'Z'); if(!Number.isFinite(parsed))return NaN;
 let result=parsed;
 for(let i=0;i<3;i++){const parts=new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date(result));result+=parsed-Date.parse(parts.replace(' ','T')+'Z');}
 return result;
}
export function assess(f:Fact,c:Context):{state:Confidence;reason:string;value:string} {
 const t=instant(c.time,c.zone);const rows=f.evidence;
 if(!rows.length)return {state:'無法確認',reason:'沒有足夠來源，請向現場或官方確認',value:f.title};
 const active=rows.filter(e=>e.official&&e.kind!=='static'&&e.updated&&Date.parse(e.updated)<=t&&e.start&&e.end&&Date.parse(e.start)<=t&&t<Date.parse(e.end));
 if(active.length){if(new Set(active.map(e=>e.value)).size>1)return {state:'無法確認',reason:'適用同時段的官方公告互相衝突',value:f.title};return {state:'已確認',reason:'官方目前／事件資訊涵蓋查詢時刻；優先於固定資料',value:active[0].value};}
 if(rows.some(e=>!e.updated))return {state:'無法確認',reason:'來源更新時間不明，無法判斷有效性',value:f.title};
 const reference=rows.filter(e=>e.kind==='static'||!e.official);
 if(reference.length&&new Set(reference.map(e=>e.value)).size===1)return {state:'仍需確認',reason:'僅有固定時間或非官方參考，不能證明今日現況',value:reference[0].value};
 return {state:'無法確認',reason:'公告未涵蓋查詢時刻、資料不足或互相衝突',value:f.title};
}
const at=(s:string)=>`2026-11-15T${s}:00+09:00`;
const evidence=(value:string,kind:Evidence['kind']='event',patch:Partial<Evidence>={}):Evidence=>({source:'展示官方公告',url:null,official:true,kind,value,updated:at('08:00'),retrieved:at('10:00'),start:at('00:00'),end:'2026-11-16T00:00:00+09:00',...patch});
export const scenarios:Scenario[]=[
 {id:'museum',name:'景點臨時休館',context:{problem:'到現場才發現美術館休館，接下來怎麼辦？',location:'京都・岡崎',time:'2026-11-15T10:00',zone:'Asia/Tokyo',original:'10:00 美術館 → 13:00 午餐',entry:'report'},facts:[{id:'original',title:'美術館今日狀態',evidence:[evidence('今日休館'),evidence('通常開放','static')]},{id:'park',title:'附近公園開放狀態',evidence:[evidence('一般開放','static')]},{id:'cafe',title:'街角咖啡店今日營業',evidence:[evidence('營業時間不明','static',{updated:null})]}],options:[{id:'park',strategy:'最省時間',place:'岡崎公園散步',steps:'步行到附近公園，保留原定午餐時間。',reason:'減少移動，先在周邊調整節奏',minutes:10,impact:'替換上午景點；午餐不變',facts:['park']},{id:'cafe',strategy:'最少改動',place:'附近咖啡店休息',steps:'先確認咖啡店營業，再安排短暫休息。',reason:'留在原區域，保留下午安排',minutes:15,impact:'原景點改為休息時間',facts:['cafe']},{id:'walk',strategy:'其他推薦',place:'岡崎街區漫步',steps:'沿街區步行，依現場情況決定停留。',reason:'彈性探索附近街區',minutes:null,impact:'上午安排改為彈性散步',facts:['park','cafe']}]},
 {id:'train',name:'交通延誤',context:{problem:'電車延誤，原定景點可能趕不上',location:'京都車站',time:'2026-11-15T10:00',zone:'Asia/Tokyo',original:'10:00 搭車 → 11:00 參觀',entry:'report'},facts:[{id:'original',title:'原路線運行',evidence:[evidence('目前延誤','current',{url:'https://www.westjr.co.jp/'})]},{id:'bus',title:'替代公車狀態',evidence:[evidence('正常運行','current')]},{id:'venue',title:'目的地今日開放',evidence:[evidence('今日開放'),evidence('今日休館')]}],options:[{id:'bus',strategy:'最省時間',place:'改搭替代公車',steps:'向站務確認站牌，改搭展示公車路線。',reason:'繞開原路線的延誤',minutes:35,impact:'更換交通工具；參觀時間可能縮短',facts:['bus','venue']},{id:'wait',strategy:'最少改動',place:'留在車站等候資訊',steps:'查看官方運行公告，確認恢復狀況後再決定。',reason:'保留原交通安排',minutes:null,impact:'抵達時間尚待確認',facts:['original','venue']}]},
 {id:'restaurant',name:'餐廳無法前往',context:{problem:'原訂餐廳無法前往，想找替代用餐安排',location:'京都・河原町',time:'2026-11-15T10:00',zone:'Asia/Tokyo',original:'12:00 原訂餐廳 → 14:00 街區散步',entry:'report'},facts:[{id:'original',title:'原訂餐廳狀態',evidence:[]},{id:'nearby',title:'附近食堂營業',evidence:[evidence('一般時段營業','static',{official:false,source:'展示旅客分享'})]},{id:'market',title:'市場餐飲區營業',evidence:[evidence('今日營業')]}],options:[{id:'nearby',strategy:'最省時間',place:'附近食堂',steps:'先確認現場營業與候位，再決定用餐。',reason:'在原用餐區域找替代選擇',minutes:10,impact:'替換午餐地點',facts:['nearby']},{id:'market',strategy:'最少改動',place:'市場餐飲區',steps:'到市場挑選用餐地點，保留下午街區行程。',reason:'維持原行程的區域與節奏',minutes:25,impact:'午餐延後約 15 分鐘（估計）',facts:['market']},{id:'explore',strategy:'其他推薦',place:'市場用餐與散步',steps:'將午餐與街區探索合併，現場選擇餐點。',reason:'保留彈性，縮短重複移動',minutes:null,impact:'合併午餐與下午散步',facts:['market','nearby']}]}];
export interface Provider {get(scenarioId:string,context:Context):Scenario|null}
export const mockProvider:Provider={get(id,c){const s=scenarios.find(s=>s.id===id);if(!s||!c.location.includes('京都')||c.time.slice(0,10)!=='2026-11-15'||!/(休館|美術館|電車|延誤|餐廳|用餐)/.test(c.problem))return null;return {...s,context:c};}};
export type Evaluation='未評估'|'是'|'否';
export type RecordTask={id:string;session:string;scenario:string;entry:string;start:string;end:string|null;status:'進行中'|'已選擇'|'放棄';states:Confidence[];selected:string|null;opened:string[];completed:Evaluation;misbelief:Evaluation;understood:Evaluation;external:Evaluation;notes:string};
export function newTask(session:string,scenario:string,entry:string):RecordTask{return {id:crypto.randomUUID(),session,scenario,entry,start:new Date().toISOString(),end:null,status:'進行中',states:[],selected:null,opened:[],completed:'未評估',misbelief:'未評估',understood:'未評估',external:'未評估',notes:''};}
export function metrics(rows:RecordTask[]){const uncertain=rows.filter(r=>r.states.some(s=>s!=='已確認'));const finished=rows.filter(r=>r.completed==='是').length;const errors=uncertain.filter(r=>r.misbelief==='是').length;return {total:rows.length,finished,uncertain:uncertain.length,errors,completion:!rows.length?'不適用':rows.some(r=>r.completed==='未評估')?'資料不完整':`${finished}/${rows.length}`,error:!uncertain.length?'不適用':uncertain.some(r=>r.misbelief==='未評估')?'資料不完整':`${errors}/${uncertain.length}`};}
