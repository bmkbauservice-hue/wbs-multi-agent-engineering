import { randomUUID } from 'node:crypto';
import { FileMemory, checkSession } from './memory.ts';
import { inputGuard, outputGuard } from './guardrails.ts';
type Pending = { session: string; text: string; expires: number };
export class SafeTools {
  private pending = new Map<string,Pending>();
  constructor(private memory: FileMemory, private now = Date.now) {}
  read(session: string, query: unknown) {
    return this.memory.search(session,inputGuard(query)).map(e=>({ ...e, text: outputGuard(e.text) }));
  }
  propose(session: string, value: unknown) {
    checkSession(session);
    const text = outputGuard(inputGuard(value));
    if (text.length>1000) throw new Error('Notiz zu lang');
    for (const [id,p] of this.pending) if (p.expires <= this.now()) this.pending.delete(id);
    if (this.pending.size>=100) throw new Error('Zu viele offene Freigaben');
    const id = randomUUID();
    this.pending.set(id,{session,text,expires:this.now()+60_000});
    return { id, text, status:'pending' as const };
  }
  // NUR aus vertrauenswürdiger UI/CLI aufrufen. Niemals als Modell-Tool registrieren.
  decideFromHuman(session: string, id: string, approved: boolean) {
    const p = this.pending.get(id);
    if (!p || p.session !== session) throw new Error('Unbekannte Freigabe');
    this.pending.delete(id); // einmalig, auch bei Ablehnung/Fehler
    if (p.expires <= this.now()) throw new Error('Freigabe abgelaufen');
    if (!approved) return { status:'rejected' as const };
    return { status:'saved' as const, entry:this.memory.append(session,outputGuard(p.text)) };
  }
}
