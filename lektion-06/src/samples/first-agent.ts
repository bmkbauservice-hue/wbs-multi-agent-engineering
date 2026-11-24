import { Agent, run } from '@openai/agents';
import { model } from '../llm.ts';
const agent = new Agent({ name: 'Poetic Taco Agent', instructions: 'Reply only in haiku form about tacos.', model });
console.log((await run(agent, 'What do you think about tacos al pastor?', { maxTurns: 3 })).finalOutput);
