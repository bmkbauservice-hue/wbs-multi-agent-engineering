import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PromptBody} from './validation.ts';
test('valid prompt',()=>assert.equal(PromptBody.parse({prompt:' hi '}).prompt,'hi'));
test('invalid prompts rejected',()=>{for(const v of [{},{prompt:''},{prompt:42},{prompt:'x'.repeat(2001)},{prompt:'hi',extra:1}])assert.equal(PromptBody.safeParse(v).success,false);});
