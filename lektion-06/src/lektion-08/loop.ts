export type Call = { id: string; name: string; args: string };
export type Decision = { calls: Call[]; text: string };
export type Entry = { decision: Decision; results: { id: string; value: string }[] };
export type Model = (goal: string, history: readonly Entry[]) => Promise<Decision>;
export type Tool = { description: string; parameters: Record<string, unknown>; execute: (input: unknown) => unknown | Promise<unknown> };
export type Outcome = { status: 'completed' | 'incomplete' | 'turn_limit' | 'action_limit' | 'context_limit' | 'tool_error' | 'model_error'; turns: number; actions: number; history: Entry[]; text: string };

// Das Modell entscheidet; der Code kontrolliert Grenzen und Erfolg.
export async function agentLoop(goal: string, model: Model, tools: Record<string, Tool>, goalMet: () => boolean, limits = { turns: 8, actions: 8, contextChars: 24000 }): Promise<Outcome> {
  const history: Entry[] = [];
  let turns = 0, actions = 0, errors = 0;
  const stop = (status: Outcome['status'], text: string): Outcome => ({status, turns, actions, history, text});
  while (turns < limits.turns) {
    if (JSON.stringify({goal, history}).length > limits.contextChars) return stop('context_limit', 'Kontextbudget erreicht.');
    turns++;
    let decision: Decision;
    try { decision = await model(goal, history); }
    catch { return stop('model_error', 'Modellanfrage fehlgeschlagen.'); }
    if (!decision.calls.length) return goalMet() ? stop('completed', decision.text) : stop('incomplete', 'Abschluss ohne belegtes Ziel.');
    if (actions + decision.calls.length > limits.actions) return stop('action_limit', 'Werkzeugbudget erreicht.');
    if (JSON.stringify({goal, history, decision}).length > limits.contextChars) return stop('context_limit', 'Kontextbudget vor Tool-Aufruf erreicht.');
    const entry: Entry = { decision, results: [] };
    history.push(entry);
    for (const call of decision.calls) {
      actions++;
      try {
        if (!Object.hasOwn(tools, call.name)) throw new Error('Unbekanntes Werkzeug.');
        const result = await tools[call.name].execute(JSON.parse(call.args));
        entry.results.push({id: call.id, value: JSON.stringify({ok: true, result})});
      } catch (e) {
        errors++;
        entry.results.push({id: call.id, value: JSON.stringify({ok: false, error: e instanceof Error ? e.message : 'Werkzeugfehler'})});
        if (errors >= 2) return stop('tool_error', 'Zweites fehlerhaftes Werkzeugergebnis; kontrollierter Abbruch.');
      }
    }
  }
  return stop('turn_limit', 'Maximale Modellaufrufe erreicht.');
}
