# WBS Lektion 05 – OpenAI-kompatible Endpunkte

Separates TypeScript-Labor. Kein Zugriff auf n8n, Jarvis, Discord oder MCP. Keine Schlüssel im Projekt. Node.js 22+.

```bash
npm install
npm run check
read -rsp 'Anthropic-Schulschlüssel: ' ANTHROPIC_API_KEY; echo
export ANTHROPIC_API_KEY
npm run test:api && npm run test:agent
unset ANTHROPIC_API_KEY
```

Bei einem bereits gesetzten Schlüssel ist die read-Zeile nicht nötig. Nur einen für die Schulübung freigegebenen Schlüssel verwenden. Bei Bedarf CLAUDE_MODEL auf einen erlaubten Modellnamen setzen. ANTHROPIC_WORKSPACE_ID nur bei einem nicht auf einen Workspace begrenzten Schlüssel, falls erforderlich. Beide Live-Tests kosten Anthropic-Tokens. npm install erzeugt eine Lockdatei; diese für reproduzierbare Installation aufbewahren.

- client.ts: Basis-URL, Schlüssel, Modell, begrenzter Timeout, keine automatischen Retries.
- openai-sdk.ts: ein Chat-Completions-Aufruf, Text in choices[0].message.content.
- agents-sdk.ts: ein Agent mit kompatiblem Client, Chat Completions und deaktiviertem OpenAI-Tracing.
- Fehler 401/403: Schlüssel/Berechtigung prüfen; 404: Endpoint und Modell; 400: Parameter; 429: Rate Limits/Quota beachten.

Noch keine externen Tools oder parallelen Agenten. Das folgt in den nächsten Übungen. Keine echte API-Ausführung bei der Erstellung; lokal `npm run check` und Live-Tests ausführen.

Quellen: https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/openai-sdk und https://openai.github.io/openai-agents-js/guides/config/.
