import { Agent, run, setDefaultOpenAIClient, setOpenAIAPI, setTracingDisabled } from '@openai/agents';
import { client, model } from './client.js';

setDefaultOpenAIClient(client);
setOpenAIAPI('chat_completions');
setTracingDisabled(true);

const agent = new Agent({
  name: 'WBS Lern-Agent',
  model,
  instructions: 'Erkläre Programmierkonzepte auf Deutsch, in höchstens drei Sätzen.',
  modelSettings: { maxTokens: 256 }
});
try {
  const result = await run(agent, 'Was unterscheidet einen Agenten von einem einzelnen LLM-Aufruf?', { maxTurns: 2 });
  if (typeof result.finalOutput !== 'string' || !result.finalOutput.trim()) throw new Error('Keine Textantwort erhalten.');
  console.log(result.finalOutput);
  console.log('Agents-SDK-Test erfolgreich.');
} catch (error) {
  console.error('Agententest fehlgeschlagen:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
