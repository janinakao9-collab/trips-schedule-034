import {describe,it,expect} from 'vitest';
import {assess,scenarios,instant,mockProvider,newTask,metrics} from '../src/domain';
const c=scenarios[0].context;
describe('confidence rules',()=>{
 for(const [label,f,state] of [['today',scenarios[0].facts[0],'已確認'],['static',scenarios[0].facts[1],'仍需確認'],['missing timestamp',scenarios[0].facts[2],'無法確認'],['current transport',scenarios[1].facts[0],'已確認'],['conflict',scenarios[1].facts[2],'無法確認'],['no evidence',scenarios[2].facts[0],'無法確認'],['nonofficial',scenarios[2].facts[1],'仍需確認']] as const)it(label,()=>expect(assess(f,c).state).toBe(state));
 it('event interval includes start and excludes end across local date',()=>{const f=scenarios[1].facts[0];expect(assess(f,{...c,time:'2026-11-16T00:00'}).state).toBe('無法確認');expect(assess(f,{...c,time:'2026-11-15T08:00'}).state).toBe('已確認');});
 it('destination timezone conversion',()=>expect(instant('2026-11-15T10:00','Asia/Tokyo')).toBe(Date.parse('2026-11-15T01:00:00Z')));
 it('expired event falls back to static reference',()=>expect(assess(scenarios[0].facts[0],{...c,time:'2026-11-16T10:00'}).state).toBe('仍需確認'));
 it('scenario references remain valid',()=>{for(const s of scenarios){expect(mockProvider.get(s.id,s.context)).not.toBeNull();for(const o of s.options)for(const f of o.facts)expect(s.facts.some(x=>x.id===f)).toBe(true);}});
 it('unsupported context does not generate results',()=>expect(mockProvider.get('museum',{...c,location:'Paris'})).toBeNull());
 it('unassessed selection is not success or zero error',()=>{const r=newTask('s','museum','report');r.states=['無法確認'];r.selected='cafe';expect(metrics([r]).completion).toBe('資料不完整');expect(metrics([r]).error).toBe('資料不完整');expect(metrics([]).error).toBe('不適用');r.completed='是';r.misbelief='否';expect(metrics([r]).completion).toBe('1/1');expect(metrics([r]).error).toBe('0/1');});
});
