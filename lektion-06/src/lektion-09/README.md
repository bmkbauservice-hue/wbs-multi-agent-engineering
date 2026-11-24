# WBS Lektion 09 – Werkzeuge, Gedächtnis & Leitplanken
Erweiterung von lektion-06; keine zusätzlichen npm-Abhängigkeiten. Lokale Tests benötigen keinen API-Schlüssel.

- `memory.ts`: flüchtige, begrenzte Session-Historie und dateibasierte Notizen, nach Session getrennt. Die Stichwortsuche ist **keine Vektorsuche**.
- `guardrails.ts`: einfache Eingabe-/Ausgabeprüfungen; keine umfassende DLP, Inhaltsmoderation oder Authentifizierung.
- `tools.ts`: lesendes Tool und zweistufiges Speichern; Freigaben sind einmalig, 60 Sekunden gültig und an Sitzung und Originaltext gebunden. `decideFromHuman` darf nie als Modellwerkzeug registriert werden. In Produktion muss die UI die Benutzeridentität serverseitig prüfen.
- `demo.ts`: echte lokale Terminalfreigabe; nur fiktive Notizen, temporäre Datei wird am Ende gelöscht. Kein Netzwerkzugriff.
- `live.ts`: optionaler lesender Agent mit dem vorhandenen SDK-Client aus Lektion 06, Zod und maxTurns: 4. Nur fiktive Notizen werden an Claude übermittelt; reguläre API-Kosten. Nutzt .env, kein Schlüssel im Code.
- `memory.test.ts`: lokale Tests. Neustart wird durch neues Speicherobjekt mit derselben Datei demonstriert. Der Dateispeicher ist für einen Prozess gedacht; bei mehreren Prozessen transaktionale Datenbank verwenden. Keine echten personenbezogenen Daten oder Schlüssel speichern.

```bash
npm run check
npx --no-install tsx --test src/lektion-09/memory.test.ts
npx --no-install tsx src/lektion-09/demo.ts
# Optional, nur mit freigegebenem Anthropic-Schulschlüssel in .env:
npx --no-install tsx src/lektion-09/live.ts
```
Die SDK-Liveausführung und vollständige Projekt-Typprüfung erfolgen auf deinem Rechner. Kein Umbau von n8n oder Jarvis. Semantischer Speicher, echte Rollenprüfung und produktionsreife Guardrails bleiben weitere Ausbaustufen.
