import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { model } from '../llm.ts';
import { concurrent } from './patterns.ts';
import { renderCompanyReply } from './customer-safety.ts';
const review = 'The pillow is soft, but delivery took three weeks and nobody answered my email.';
const sentiment = new Agent({ name: 'Sentiment', model, instructions: 'Classify the customer review.', outputType: z.object({ sentiment: z.enum(['positive','neutral','negative']) }) });
const issues = new Agent({ name: 'Issues', model, instructions: 'List the problems in short bullet points.' });
const replySchema = z.object({ deliveryDelayed: z.boolean(), messageUnanswered: z.boolean() });
const reply = new Agent({ name: 'Reply', model, instructions: 'You are the seller’s customer service representative, not the customer. Identify whether the review describes a late delivery and whether the customer received no response to a message. Return only the specified booleans. Do not claim a refund, shipment, or message was sent.', outputType: replySchema });
async function timed<T>(name: string, task: () => Promise<T>) {
  const start = performance.now(); console.log(`START ${name}: ${Math.round(start)} ms`);
  try { return await task(); } finally { console.log(`END ${name}: ${Math.round(performance.now())} ms`); }
}
const start = performance.now();
const results = await concurrent(
  () => timed('Sentiment', async () => {
    const result = (await run(sentiment, review, { maxTurns: 3 })).finalOutput;
    if (result?.sentiment !== 'negative') throw Error('Unexpected sentiment in exercise');
    return result;
  }),
  () => timed('Issues', async () => {
    const result = (await run(issues, review, { maxTurns: 3 })).finalOutput;
    if (!result?.trim()) throw Error('Missing issue summary');
    return result;
  }),
  () => timed('Reply', async () => {
    const facts = replySchema.parse((await run(reply, review, { maxTurns: 3 })).finalOutput);
    if (!facts.deliveryDelayed || !facts.messageUnanswered) throw Error('Reply omitted a known issue in exercise');
    return renderCompanyReply(facts);
  }),
);
for (const [i, result] of results.entries()) console.log(['Sentiment','Issues','Reply'][i], result.status === 'fulfilled' ? result.value : 'FAILED');
console.log(`Total: ${Math.round(performance.now() - start)} ms`);
if (results.some(result => result.status === 'rejected')) process.exitCode = 1;
