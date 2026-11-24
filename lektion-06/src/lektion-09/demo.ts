import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FileMemory, SessionMemory } from './memory.ts';
import { SafeTools } from './tools.ts';
import { createInterface } from 'node:readline/promises';
const dir = mkdtempSync(join(tmpdir(),'wbs09-'));
const file = join(dir,'memory.json');
const memory = new FileMemory(file);
const tools = new SafeTools(memory);
const history = new SessionMemory();
const session = 'wbs-demo';
const rl = createInterface({input:process.stdin,output:process.stdout});
try {
  history.add(session,'Bitte Lernnotiz merken.');
  const p = tools.propose(session,'MCP: Schreibaktionen brauchen eine Freigabe.');
  console.log('Vorschau:',p.text,'\nNoch gespeichert:',memory.read(session).length);
  const answer = await rl.question('Notiz speichern? (JA/NEIN) ');
  console.log(tools.decideFromHuman(session,p.id,answer.trim()==='JA'));
  console.log('Neues Speicherobjekt:',new FileMemory(file).search(session,'MCP'));
  console.log('Andere Sitzung:',memory.read('andere-sitzung'));
} finally { rl.close(); rmSync(dir,{recursive:true,force:true}); }
