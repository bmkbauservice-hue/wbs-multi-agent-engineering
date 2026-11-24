import OpenAI from 'openai';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error('ANTHROPIC_API_KEY fehlt. Bitte lokal setzen.');
export const model = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';
export const client = new OpenAI({
  apiKey,
  baseURL: 'https://api.anthropic.com/v1/',
  timeout: 30_000,
  maxRetries: 0,
  ...(process.env.ANTHROPIC_WORKSPACE_ID ? {
    defaultHeaders: { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID }
  } : {})
});
