import { Agent, handoff, run } from '@openai/agents';
import { z } from 'zod';
import { model } from '../llm.ts';
import { renderEscalation } from './customer-safety.ts';
const support = new Agent({ name: 'Customer Support Agent', model, handoffDescription: 'Questions about pillows, delivery and returns', instructions: 'Answer politely as the seller. This is a simulation. Do not invent policies, request personal data or claim external actions.' });
const escalationSchema = z.object({ concern: z.enum(['product_mismatch','delivery_problem','other']) });
const escalation = new Agent({ name: 'Escalation Control Agent', model, handoffDescription: 'Upset customers and complaints', instructions: 'Classify the customer complaint: product_mismatch for unsuitable products, delivery_problem for delivery issues, otherwise other. Return only the specified structured classification. This is a simulation, no complaint is filed, no personal data is needed.', outputType: escalationSchema });
let reasonRecorded = false;
const triage = Agent.create({ name: 'Triage Agent', model, instructions: 'Route complaints to Escalation Control Agent and ordinary questions to Customer Support Agent. Do not answer yourself.', handoffs: [support, handoff(escalation, { inputType: z.object({ reason: z.string() }), onHandoff: async (_context, input) => { reasonRecorded = Boolean(input?.reason?.trim()); console.log('Handoff reason:', input?.reason); } })] });
const defaultDemo = !process.argv[2];
const result = await run(triage, process.argv[2] || 'The pillows are too fluffy and I am not happy with my purchase.', { maxTurns: 5 });
console.log('Final agent:', result.lastAgent?.name);
if (result.lastAgent?.name === escalation.name) {
  if (!reasonRecorded) throw Error('Missing handoff reason');
  const parsed = escalationSchema.parse(result.finalOutput);
  if (defaultDemo && parsed.concern !== 'product_mismatch') throw Error('Unexpected complaint classification');
  console.log(renderEscalation(parsed));
} else if (result.lastAgent?.name === support.name && !defaultDemo && typeof result.finalOutput === 'string' && result.finalOutput.trim()) {
  console.log('[SIMULATION] Support draft (not sent):', result.finalOutput);
} else {
  console.error('FAILED: Expected a valid handoff to the correct specialist.'); process.exitCode = 1;
}
