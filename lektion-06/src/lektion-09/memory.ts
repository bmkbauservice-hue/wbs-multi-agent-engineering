import { readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
export type Entry = { id: string; text: string };
const sessionPattern = /^[a-zA-Z0-9_-]{1,64}$/;
export function checkSession(session: string) {
  if (!sessionPattern.test(session) || ['__proto__','constructor','prototype'].includes(session)) throw new Error('Ungültige Sitzung');
}
// Lokaler Einprozess-Speicher; kein Ersatz für eine Mehrbenutzer-Datenbank.
export class FileMemory {
  constructor(private file: string) {}
  private load(): Record<string, Entry[]> {
    try { return JSON.parse(readFileSync(this.file,'utf8')) as Record<string,Entry[]>; }
    catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return {}; throw e; }
  }
  read(session: string): Entry[] { checkSession(session); const data = this.load(); return Object.hasOwn(data, session) ? data[session] : []; }
  append(session: string, text: string): Entry {
    checkSession(session);
    if (!text.trim() || text.length > 1000) throw new Error('Ungültiger Eintrag');
    const data = this.load();
    const entry = { id: randomUUID(), text };
    data[session] = [...(Object.hasOwn(data,session) ? data[session] : []), entry].slice(-100);
    mkdirSync(dirname(this.file),{recursive:true, mode:0o700});
    const tmp = `${this.file}.${randomUUID()}.tmp`;
    writeFileSync(tmp,JSON.stringify(data,null,2),{mode:0o600,flag:'wx'});
    renameSync(tmp,this.file);
    return entry;
  }
  // Einfache Stichwortsuche, ausdrücklich keine Embeddings/Vektorsuche.
  search(session: string, query: string): Entry[] {
    const terms = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
    return this.read(session).map(entry=>({entry,score:terms.filter(t=>entry.text.toLowerCase().includes(t)).length}))
      .filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.entry);
  }
}
export class SessionMemory {
  private history = new Map<string, string[]>();
  add(session: string, text: string) { checkSession(session); this.history.set(session,[...(this.history.get(session)??[]), text.slice(0,1000)].slice(-10)); }
  read(session: string) { checkSession(session); return [...(this.history.get(session)??[])]; }
}
