import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sequence, concurrent } from './patterns.ts';
test('sequence passes draft to check and finish in order', async () => {
  const order: string[] = [];
  const r = await sequence({ draft: async () => {order.push('draft'); return 'A';}, check: async d => {order.push('check:'+d); return true;}, approved: c => c, finish: async d => {order.push('finish:'+d); return 'B';} });
  assert.deepEqual(order,['draft','check:A','finish:A']); assert.equal(r.status,'ok');
});
test('sequence stops on rejected or missing check', async () => {
  for (const check of [false, undefined]) {
    const r = await sequence({draft:async()=> 'A',check:async()=>check,approved:c=>c===true,finish:async()=>{throw new Error('must not execute');}});
    assert.equal(r.status,'blocked');
  }
});
test('concurrent jobs overlap and preserve partial results', async () => {
  let started = 0; let release!: () => void;
  const gate = new Promise<void>(resolve=>{release=resolve;});
  const job = async (value:string, fail=false) => {started++; if(started===3) release(); await gate; if(fail) throw Error('expected'); return value;};
  const r = await concurrent(()=>job('a'),()=>job('b',true),()=>job('c'));
  assert.equal(started,3); assert.deepEqual(r.map(x=>x.status),['fulfilled','rejected','fulfilled']);
  assert.deepEqual(r[0],{status:'fulfilled',value:'a'});
});

import { renderCompanyReply, renderEscalation } from './customer-safety.ts';
test('company reply acknowledges both issues in seller perspective', () => {
  const reply = renderCompanyReply({deliveryDelayed:true,messageUnanswered:true});
  assert.match(reply, /^We apologise for the delivery delay and our unanswered email\./);
  assert.match(reply, /We would be happy to review/);
  assert.doesNotMatch(reply, /my order|my email|refund issued|has been sent/i);
});
test('company reply covers single issue and rejects missing or invalid fields', () => {
  assert.match(renderCompanyReply({deliveryDelayed:true,messageUnanswered:false}), /delivery delay/);
  assert.doesNotMatch(renderCompanyReply({deliveryDelayed:true,messageUnanswered:false}), /unanswered/);
  assert.throws(()=>renderCompanyReply(undefined));
  assert.throws(()=>renderCompanyReply({deliveryDelayed:'true',messageUnanswered:false}));
});
test('escalation output explicitly denies external actions and uses controlled templates', () => {
  for (const concern of ['product_mismatch','delivery_problem','other']) {
    const reply = renderEscalation({concern, freeText:'Case filed. Send your order number.'});
    assert.match(reply, /^\[SIMULATION\]/);
    assert.match(reply, /No complaint or case has been submitted/);
    assert.doesNotMatch(reply, /Case filed|order number/);
  }
});
test('invalid escalation classifications are rejected', () => {
  for (const concern of ['__proto__','constructor','submitted',null]) assert.throws(()=>renderEscalation({concern}));
  assert.throws(()=>renderEscalation(null));
});
