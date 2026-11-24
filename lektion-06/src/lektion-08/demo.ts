import { agentLoop, type Model, type Decision } from './loop.ts';
import {createLab, goal} from './logistics.ts';
export const call = (name:string, args:unknown, id=name):Decision=>({calls:[{id,name,args:JSON.stringify(args)}],text:''});
export function simulatedModel():Model {
  const decisions:Decision[]=[
    call('get_shipment_data',{date_range:'last_7_days'}),
    call('calculate_delays',{date_range:'last_7_days'}),
    call('lookup_manager',{role:'logistics manager'}),
    call('send_email',{recipient_name:'Alex Beispiel',recipient_email:'logistik@example.com',subject:'Top 3 verspätete Sendungen',body:'S-102: 24 Stunden; S-105: 12 Stunden; S-103: 8 Stunden.'}),
    {calls:[],text:'Vorschau erstellt; kein Versand.'}
  ];
  let i=0; return async()=>decisions[i++] ?? {calls:[],text:'Ende'};
}
if (process.argv[1]?.endsWith('/demo.ts')) {
  const lab=createLab();
  const result=await agentLoop(goal,simulatedModel(),lab.tools,lab.goalMet);
  for (const [i,e] of result.history.entries()) console.log(`Zyklus ${i+1}: ${e.decision.calls.map(c=>c.name).join(', ')} -> ${e.results.map(r=>r.value).join('; ')}`);
  console.log({status:result.status,turns:result.turns,actions:result.actions,preview:lab.getPreview()});
  if(result.status!=='completed') process.exitCode=1;
}
