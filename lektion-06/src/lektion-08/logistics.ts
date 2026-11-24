import type { Tool } from './loop.ts';
export const goal = 'Ermittle die drei am stärksten verspäteten Sendungen der letzten sieben Tage aus den Übungsdaten, ermittle den Logistikmanager und erstelle eine E-Mail-Vorschau. Kein echter Versand.';
const shipments = [
  {id:'S-101', expected:'2026-11-18T09:00:00Z', actual:'2026-11-18T12:00:00Z'},
  {id:'S-102', expected:'2026-11-19T09:00:00Z', actual:'2026-11-20T09:00:00Z'},
  {id:'S-103', expected:'2026-11-20T09:00:00Z', actual:'2026-11-20T17:00:00Z'},
  {id:'S-104', expected:'2026-11-21T09:00:00Z', actual:'2026-11-21T09:00:00Z'},
  {id:'S-105', expected:'2026-11-22T09:00:00Z', actual:'2026-11-22T21:00:00Z'},
];
const manager = {name:'Alex Beispiel', email:'logistik@example.com'};
export const ranking = () => shipments.map(s => ({id:s.id, delayHours:(Date.parse(s.actual)-Date.parse(s.expected))/3600000})).filter(s=>s.delayHours>0).sort((a,b)=>b.delayHours-a.delayHours).slice(0,3);
function obj(input: unknown, keys: string[]): Record<string,unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Objekt erwartet.');
  const o = input as Record<string,unknown>;
  if (Object.keys(o).some(k=>!keys.includes(k)) || keys.some(k=>!Object.hasOwn(o,k))) throw new Error('Ungültige Parameter.');
  return o;
}
function schema(properties: Record<string,unknown>) { return {type:'object', properties, required:Object.keys(properties), additionalProperties:false}; }
const str = {type:'string'};
export function createLab() {
  let fetched=false, calculated=false, lookedUp=false;
  let preview: {recipient:string; subject:string; body:string; status:'simulated'} | undefined;
  const tools: Record<string, Tool> = {
    get_shipment_data: { description:'Lies die fiktiven Sendungen der letzten sieben Tage am Stichtag 24.11.2026.', parameters:schema({date_range:{type:'string',enum:['last_7_days']}}), execute(input) {
      if (obj(input,['date_range']).date_range !== 'last_7_days') throw new Error('Nur last_7_days unterstützt.');
      fetched=true; return {asOf:'2026-11-24', shipments};
    }},
    calculate_delays: {description:'Berechne die Top 3 aus den zuvor geladenen Sendungen. Verwende date_range last_7_days; Rohdaten bleiben im Code.', parameters:schema({date_range:{type:'string',enum:['last_7_days']}}), execute(input) {
      if (obj(input,['date_range']).date_range !== 'last_7_days' || !fetched) throw new Error('Zuerst Sendungsdaten laden.');
      calculated=true; return ranking();
    }},
    lookup_manager: {description:'Lies den fiktiven Logistikmanager aus dem Testverzeichnis.',parameters:schema({role:{type:'string',enum:['logistics manager']}}),execute(input){
      if (obj(input,['role']).role !== 'logistics manager') throw new Error('Unbekannte Rolle.');
      lookedUp=true; return manager;
    }},
    send_email: {description:'Erstelle NUR eine lokale E-Mail-Vorschau, kein Versand. Erst nach Berechnung und Kontaktabfrage. Verwende exakten Testkontakt und alle drei IDs samt Stunden.',parameters:schema({recipient_name:str,recipient_email:str,subject:str,body:str}),execute(input){
      const o=obj(input,['recipient_name','recipient_email','subject','body']);
      if (!calculated || !lookedUp) throw new Error('Erforderliche Ergebnisse fehlen.');
      if (preview) throw new Error('Vorschau bereits erstellt.');
      if (o.recipient_name!==manager.name || o.recipient_email!==manager.email) throw new Error('Nur Testkontakt erlaubt.');
      if (typeof o.subject!=='string' || !o.subject.trim() || o.subject.length>200 || typeof o.body!=='string' || !o.body.trim() || o.body.length>3000) throw new Error('Ungültiger Entwurf.');
      const body=o.body;
      if (!ranking().every(s=>body.includes(s.id))) throw new Error('Die drei Sendungs-IDs fehlen im Entwurf.');
      preview={recipient:manager.email,subject:o.subject,body,status:'simulated'};
      return {...preview, verifiedRanking:ranking()};
    }}
  };
  return {tools, goalMet:()=>Boolean(preview), getPreview:()=>preview};
}
