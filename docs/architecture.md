# Architektur und Teststand

| Modul | Zweck |
|---|---|
| API-Labor (05) | OpenAI-kompatible Chat Completions und SDK-Konfiguration |
| SDK-Labor (06) | Tools, strukturierte Ausgaben, Express-Endpunkt, Guardrails |
| Orchestrierung (07) | Sequenz, Parallelität, Handoff und Agents as Tools |
| Agentenkreislauf (08) | Werkzeugwahl, Ergebnisverarbeitung, Abbruchlimits, simulierte E-Mail |
| Gedächtnis (09) | Dateispeicher, Session-Isolation, Stichwortsuche, menschliche Freigabe |
| Integration | Simulation → geprüfte Vorschau → Freigabe → isolierter Speicher |

## Nachweise

Im ursprünglichen lokalen Projekt wurden beide TypeScript-Typprüfungen und 24 lokale Tests bestanden. Elf Live-Beispiele liefen mit Claude; zwei fachliche Auffälligkeiten wurden anschließend korrigiert und live nachgetestet. Dabei wurde die Antwortperspektive korrigiert und die Eskalation als Simulation ausgewiesen. Das aktualisierte Testset enthält 28 Tests. Die öffentliche Vorlage muss eigenständig geprüft werden; die bisherigen Ergebnisse sind keine Garantie für eine neue Installation.

## Nicht Bestandteil des öffentlichen Labs

Produktiver Morgenbot, private MCP-Endpunkte, reale Slack-/Notion-Anbindungen, semantische Vektorsuche, echte Mehrbenutzer-Authentifizierung und Produktionsbetrieb. n8n und TypeScript sind getrennte Lernimplementierungen, keine integrierte Laufzeit.
