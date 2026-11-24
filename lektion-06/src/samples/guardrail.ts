import { InputGuardrailTripwireTriggered, run } from '@openai/agents';
import { supportAgent } from '../agents/supportAgent.ts';
try { console.log((await run(supportAgent,process.argv[2] || 'What is the meaning of life?',{maxTurns:5})).finalOutput); }
catch(e) { if(e instanceof InputGuardrailTripwireTriggered) console.log('BLOCKED: outside pillow topic.'); else throw e; }
