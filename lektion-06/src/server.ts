import express, { type ErrorRequestHandler, type RequestHandler } from 'express';
import { run, MaxTurnsExceededError, InputGuardrailTripwireTriggered } from '@openai/agents';
import { PromptBody } from './validation.ts';
import { supportAgent } from './agents/supportAgent.ts';
const app = express();
app.use(express.json({limit:'16kb'}));
app.get('/healthz',(_req,res)=>{res.json({status:'ok'});});
const askAgent: RequestHandler = async (req,res) => {
  const parsed = PromptBody.safeParse(req.body);
  if(!parsed.success){res.status(400).json({error:'Invalid prompt'});return;}
  try {
    const result = await run(supportAgent,parsed.data.prompt,{maxTurns:5,signal:AbortSignal.timeout(60000)});
    res.json({answer:result.finalOutput});
  } catch(e){
    if(e instanceof MaxTurnsExceededError){res.status(502).json({error:'Agent turn limit exceeded'});return;}
    if(e instanceof InputGuardrailTripwireTriggered){res.status(422).json({error:'Request outside pillow topic'});return;}
    throw e;
  }
};
app.post('/ai/agent',askAgent);
const errors: ErrorRequestHandler = (err,_req,res,_next) => {
  const status = typeof err?.status === 'number' && [400,413].includes(err.status) && err?.type?.startsWith('entity.') ? err.status : 500;
  console.error('Request failed:',err instanceof Error ? err.name : 'UnknownError');
  res.status(status).json({error:'Request failed'});
};
app.use(errors);
const port=Number(process.env.PORT || 3106);
app.listen(port,'127.0.0.1',()=>console.log(`WBS lab: http://127.0.0.1:${port}`));
