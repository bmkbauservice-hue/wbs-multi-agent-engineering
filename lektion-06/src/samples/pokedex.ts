import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import { model } from '../llm.ts';
const Pokemon = z.object({ weight: z.number(), types: z.array(z.object({ type: z.object({ name: z.string() }) })) });
const pokemonTool = tool({
  name: 'pokemon_info', description: 'Get real Pokémon types and weight by name.',
  parameters: z.object({ pokemon: z.string().describe('Pokémon name') }),
  execute: async ({pokemon}) => {
    const name = pokemon.trim().toLowerCase();
    if (!/^[a-z0-9-]{1,80}$/.test(name)) return 'Invalid Pokémon name.';
    console.log('Tool lookup:', name);
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(name), {signal: AbortSignal.timeout(8000)});
      if (response.status === 404) return 'Pokémon not found.';
      if (!response.ok) return 'PokéAPI unavailable: HTTP ' + response.status;
      const parsed = Pokemon.safeParse(await response.json());
      if (!parsed.success) return 'Unexpected PokéAPI response.';
      return JSON.stringify({weightInKg: parsed.data.weight / 10, types: parsed.data.types.map(x => x.type.name)});
    } catch { return 'PokéAPI request failed; do not invent data.'; }
  }
});
const agent = new Agent({name:'Pokédex Agent',model,instructions:'Use pokemon_info for Pokémon facts. Never invent facts on tool failure. Other questions: brief answer without tools.',tools:[pokemonTool]});
const result = await run(agent, process.argv[2] || 'What type is Pikachu and how heavy is it?', {maxTurns:4});
console.log(result.finalOutput, result.newItems.map(x => x.type));
