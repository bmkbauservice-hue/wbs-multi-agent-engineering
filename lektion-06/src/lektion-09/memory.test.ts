import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FileMemory, SessionMemory } from './memory.ts';
import { SafeTools } from './tools.ts';
import { inputGuard, outputGuard } from './guardrails.ts';
function fixture(t: {after: (fn:()=>void)=>void}) {
 const dir=mkdtempSync(join(tmpdir(),'wbs09-test-')); t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const file=join(dir,'memory.json'); const m=new FileMemory(file); return {m,file,s:new SafeTools(m)};
}
test('persistent memory survives new instance',t=>{const {m,file}=fixture(t);m.append('a','MCP lernen');assert.equal(new FileMemory(file).read('a')[0]?.text,'MCP lernen');});
test('session separation and reserved keys',t=>{const {m}=fixture(t);m.append('a','privat');assert.deepEqual(m.read('b'),[]);assert.throws(()=>m.read('__proto__'));});
test('keyword search only returns matching session',t=>{const {m,s}=fixture(t);m.append('a','MCP lernen');m.append('b','MCP geheim');m.append('a','andere Notiz');assert.equal(s.read('a','MCP').length,1);});
test('bounded volatile context',()=>{const s=new SessionMemory();for(let i=0;i<12;i++)s.add('a',String(i));assert.equal(s.read('a').length,10);assert.deepEqual(s.read('b'),[]);assert.deepEqual(new SessionMemory().read('a'),[]);});
test('input and output guards',()=>{assert.throws(()=>inputGuard(' '));assert.throws(()=>inputGuard('a'.repeat(2001)));assert.throws(()=>outputGuard('Passwort: beispiel'));assert.equal(outputGuard('Lernnotiz'),'Lernnotiz');});
test('no write until human approval',t=>{const {m,s}=fixture(t);const p=s.propose('a','Notiz');assert.equal(m.read('a').length,0);assert.equal(s.decideFromHuman('a',p.id,true).status,'saved');assert.equal(m.read('a')[0]?.text,'Notiz');});
test('rejection and replay blocked',t=>{const {m,s}=fixture(t);const p=s.propose('a','Notiz');assert.equal(s.decideFromHuman('a',p.id,false).status,'rejected');assert.throws(()=>s.decideFromHuman('a',p.id,true));assert.deepEqual(m.read('a'),[]);});
test('approval bound to session and payload',t=>{const {m,s}=fixture(t);const p=s.propose('a','Original');assert.throws(()=>s.decideFromHuman('b',p.id,true));p.text='Manipuliert';s.decideFromHuman('a',p.id,true);assert.equal(m.read('a')[0]?.text,'Original');assert.throws(()=>s.decideFromHuman('a',p.id,true));});
test('expired approval blocked',t=>{const {m}=fixture(t);let now=100;const s=new SafeTools(m,()=>now);const p=s.propose('a','Notiz');now+=60000;assert.throws(()=>s.decideFromHuman('a',p.id,true));assert.deepEqual(m.read('a'),[]);});
test('invalid write and suspicious tool output blocked',t=>{const {m,s}=fixture(t);assert.throws(()=>s.propose('a','api_key: beispiel'));m.append('a','Passwort: test');assert.throws(()=>s.read('a','Passwort'));});
