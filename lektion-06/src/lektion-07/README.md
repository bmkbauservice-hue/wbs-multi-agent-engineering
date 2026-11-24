# Lektion 07 – Orchestrierungsmuster
Erweiterung für das bereits installierte Projekt lektion-06. Keine neuen npm-Abhängigkeiten und kein neuer Server. Die vorhandene package-lock.json bleibt unverändert.

Im Ordner `~/Projekte/WBS-Agent/lektion-06`:

```sh
npm run check
npx --no-install tsx --test src/lektion-07/patterns.test.ts
```
Die drei lokalen Tests brauchen keinen Schlüssel. Sie prüfen Code-Orchestrierung mit simulierten Funktionen, nicht das Modell.

## Live-Übungen (Anthropic-Kosten)
Voraussetzung: eine eigene, erlaubte `.env` mit ANTHROPIC_API_KEY und LLM_MODEL, wie in Lektion 06. Nicht ausgeben, nicht committen. Die Modell-ID muss für den Schulschlüssel verfügbar sein.

```sh
npx --no-install tsx src/lektion-07/sequential.ts
npx --no-install tsx src/lektion-07/concurrent.ts
npx --no-install tsx src/lektion-07/handoffs.ts
npx --no-install tsx src/lektion-07/manager.ts
```
- Sequential: Bei negativem oder fehlendem Check keine Übersetzung. Ein LLM-Check ist keine Garantie.
- Concurrent: START/END zeigen die zeitliche Überlappung. allSettled bewahrt Teilergebnisse. Rate Limits beachten.
- Handoff: Final agent soll Escalation Control Agent sein; kein tatsächlicher Versand.
- Manager: Final agent bleibt Manager. Run items zeigen Tool-Aufrufe; im Zweifel Tool-Namen im Log separat prüfen.
- Die maxTurns-Werte gelten je run, nicht als globales Zeit- oder Kostenlimit. Native n8n-Workflows und Jarvis bleiben unangetastet.
