import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sequence } from '../lektion-07/patterns.ts';
import { agentLoop } from '../lektion-08/loop.ts';
import { createLab, goal } from '../lektion-08/logistics.ts';
import { simulatedModel } from '../lektion-08/demo.ts';
import { FileMemory } from '../lektion-09/memory.ts';
import { SafeTools } from '../lektion-09/tools.ts';

test('integration: simulation -> verified preview -> human approval -> isolated memory', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'wbs-final-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = join(dir, 'notes.json');
  const memory = new FileMemory(file);
  const safe = new SafeTools(memory);
  const lab = createLab();
  const result = await sequence({
    draft: () => agentLoop(goal, simulatedModel(), lab.tools, lab.goalMet),
    check: async draft => draft.status === 'completed' && lab.getPreview()?.status === 'simulated',
    approved: ok => ok === true,
    finish: async () => safe.propose('wbs', 'Logistik-Simulation abgeschlossen; kein Versand.'),
  });
  if (result.status !== 'ok') throw new Error('Simulation unexpectedly blocked');
  assert.equal(memory.read('wbs').length, 0);
  // Test fixture represents the human decision; real approval belongs to UI/CLI.
  safe.decideFromHuman('wbs', result.result.id, true);
  assert.equal(new FileMemory(file).search('wbs', 'Logistik').length, 1);
  assert.deepEqual(memory.read('other'), []);
});
