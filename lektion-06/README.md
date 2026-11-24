# WBS Lektion 06 – Agents SDK mit Claude
Eigenständiges Lernlabor nach dem Unterricht, ohne Eingriffe in n8n/Jarvis. Node >=22. Kein automatischer Versand, keine Schreibtools. Lokaler Express-Port 3106 (statt Unterrichtsport 3000, um Konflikte zu vermeiden).

```bash
npm install
npm run check
npm run test:local
cp -n .env.example .env
```
API-Schlüssel lokal in `.env` ergänzen. Nicht in Chat oder Git kopieren. Modell-ID aus der Schule (`claude-haiku-5-5`) bzw. eine vom eigenen Anthropic-Zugang unterstützte ID verwenden. Erst nach Typprüfung Live-Aufrufe starten; sie kosten Tokens. npm install erzeugt package-lock.json, diese bei späteren Installationen mit npm ci verwenden.

- `npm run first`: erster Agent.
- `npm run pokedex`: echtes lesendes Tool; `npm run pokedex -- "What is the capital of Spain?"` testet ohne Tool.
- `npm run review`: strukturierte Ausgabe (negative erwartet).
- `npm run guardrail`: außerhalb des Themas, BLOCKED erwartet; `npm run guardrail -- "Can I wash my pillows?"` sollte durchkommen.
- `npm run max-turns -- 1` und `npm run max-turns -- 2`: Abbruch bzw. Abschluss, abhängig von Modellverhalten; das Tool kann vor Abbruch bereits laufen.
- `npm run dev`: lokaler Server, dann `curl -sS http://127.0.0.1:3106/healthz` und `curl -sS -X POST http://127.0.0.1:3106/ai/agent -H 'Content-Type: application/json' -d '{"prompt":"Can I wash my pillows?"}'`.

Guardrail ist eine semantische Klassifikation, keine Authentifizierung. `maxTurns` begrenzt Modellaufrufe pro Run, nicht alle Aktionen; die Guardrail hat ein eigenes Limit. Timeout und lokale Bindung ergänzen Schutz. API-Kompatibilität und Modell-ID müssen live geprüft werden; keine Freigabe für öffentlichen Betrieb.

Quellen: WBS-Unterricht Lektion 06; https://openai.github.io/openai-agents-js/ ; https://platform.claude.com/docs/en/cli-sdks-libraries/libraries/openai-sdk
