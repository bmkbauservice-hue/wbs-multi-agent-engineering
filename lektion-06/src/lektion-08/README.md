# Lektion 08 – Der Agentenkreislauf
Erweiterung für `lektion-06`, ohne neue npm-Pakete. Alle Sendungen und der Kontakt sind fiktiv; `send_email` erstellt ausschließlich eine Vorschau im Speicher. Kein SMTP, keine externen Nachrichten. Das Modell kann die Werkzeuge auswählen; der Code prüft Vorbedingungen und Zielerreichung. Die lokale Simulation hat eine fest definierte Modellantwortfolge und demonstriert nicht selbst autonome Auswahl.

## Ausführen (aus lektion-06)
```
npm run check
npx --no-install tsx --test src/lektion-08/loop.test.ts
npx --no-install tsx src/lektion-08/demo.ts
```
Optional, kostenpflichtig mit eigenem freigegebenem Anthropic-Schulschlüssel in der lokalen `.env`:
```
npx --no-install tsx src/lektion-08/live.ts
```
Der Live-Adapter verwendet Chat Completions mit Funktionswerkzeugen; kein OpenAI-Schlüssel. Modell aus `LLM_MODEL`, bestehende Konfiguration nicht überschreiben. Kein Tracing. Die Demo benutzt den festen Stichtag 24.11.2026. `calculate_delays` nutzt intern die geladenen Testdaten statt vom Modell übermittelter Rohdaten. Das Ergebnis der Rangliste wird deterministisch berechnet, die E-Mail-Vorschau ist Modelltext und muss vor Nutzung menschlich geprüft werden; die lokale Zielprüfung kontrolliert Kontakt, Vorbedingungen und IDs, nicht die sprachliche Richtigkeit aller Stundenangaben.

Limits: 8 Modellzüge, 8 Tool-Aufrufe, 24.000 Zeichen für Ziel/Verlauf/aktuelle Entscheidung (Näherung, kein Tokenlimit; Systemprompt und Tool-Schemas nicht enthalten); Abbruch beim zweiten Tool-Fehler insgesamt; pro HTTP-Aufruf 30 s Timeout. Kein automatischer Modell-Retry. Mehrere Tool-Aufrufe in einer Modellantwort zählen einzeln. Bei Limit oder Fehler kann eine bereits erzeugte Vorschau existieren, sie ist nie versendet. Für echte Produktion zusätzlich serverseitige Berechtigungen, unabhängige Freigabe, Persistenz, Token- und Gesamtzeitlimits.
