import 'dotenv/config';
import OpenAI from 'openai';
import { setDefaultOpenAIClient, setOpenAIAPI, setTracingDisabled } from '@openai/agents';
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error('ANTHROPIC_API_KEY fehlt in .env.');
setDefaultOpenAIClient(new OpenAI({ apiKey, baseURL: 'https://api.anthropic.com/v1/', timeout: 30_000, maxRetries: 0 }));
setOpenAIAPI('chat_completions');
setTracingDisabled(true);
export const model = process.env.LLM_MODEL || 'claude-haiku-5-5';
