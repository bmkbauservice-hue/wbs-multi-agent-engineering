import { client, model } from './client.js';

try {
  const response = await client.chat.completions.create({
    model,
    max_tokens: 256,
    messages: [
      { role: 'system', content: 'Antworte kurz und auf Deutsch.' },
      { role: 'user', content: 'Erkläre einen kompatiblen API-Endpunkt in zwei Sätzen.' }
    ]
  });
  const content = response.choices[0]?.message.content;
  if (!content?.trim()) throw new Error('Keine Textantwort erhalten.');
  console.log(content);
  console.log('API-Test erfolgreich. Modell:', response.model);
  console.log('Token-Verbrauch:', response.usage ?? 'nicht gemeldet');
} catch (error) {
  console.error('API-Test fehlgeschlagen:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
