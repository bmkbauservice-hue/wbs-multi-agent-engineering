import { Agent, run } from '@openai/agents';
import { model } from '../llm.ts';
const policy = new Agent({ name: 'Policy Agent', model, instructions: 'Fictional training data only: Returns are free within 30 days. Pillows can be machine washed at 40 degrees. Answer from these facts only.' });
const translator = new Agent({ name: 'Translation Agent', model, instructions: 'Translate the supplied text to German; return only the translation.' });
const manager = new Agent({ name: 'Manager', model, instructions: 'Answer customers in this fictional exercise. Always use check_policy for policy facts. For German questions use translate_to_german on the policy answer. Retain control and deliver the final reply yourself. Never claim external actions.', tools: [policy.asTool({ toolName: 'check_policy', toolDescription: 'Look up fictional return and care policy. Pass the specific customer question.' }), translator.asTool({ toolName: 'translate_to_german', toolDescription: 'Translate the policy answer to German. Pass the actual policy text.' })] });
const result = await run(manager, 'Kann ich das Kissen waschen?', { maxTurns: 7 });
console.log('Final agent:', result.lastAgent?.name);
console.log(result.finalOutput);
console.log('Run items:', result.newItems.map(item => item.type));
