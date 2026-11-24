import { Agent, MaxTurnsExceededError, run, tool } from '@openai/agents';
import { z } from 'zod';
import { model } from '../llm.ts';
const checkStock = tool({name:'check_stock',description:'Read simulated stock for one pillow model.',parameters:z.object({pillow:z.string()}),execute:async ({pillow})=>{console.log('Checking mock stock:',pillow);return JSON.stringify({pillow,inStock:12,simulated:true});}});
const agent = new Agent({name:'Stock Agent',model,instructions:'Use check_stock for each requested pillow. Stock is simulated; never claim real inventory.',tools:[checkStock]});
const maxTurns = Number(process.argv[2] || '1');
if(!Number.isInteger(maxTurns)||maxTurns<1||maxTurns>5) throw new Error('Choose maxTurns 1–5');
try {console.log((await run(agent,'How many Cloud and Feather pillows do we have?',{maxTurns})).finalOutput);}
catch(e){if(e instanceof MaxTurnsExceededError) console.log('STOPPED: '+e.message);else throw e;}
