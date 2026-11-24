import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { model } from '../llm.ts';
const Review = z.object({ sentiment: z.enum(['positive','neutral','negative']), summary: z.string() });
const agent = new Agent({name:'Review Classifier',model,instructions:'Classify the customer review.',outputType:Review});
const result = await run(agent, process.argv[2] || 'The pillow went flat after two nights.', {maxTurns:3});
console.log(Review.parse(result.finalOutput));
