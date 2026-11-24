# Sicherheitskonzept

- API-Schlüssel gehören in lokale Umgebungsvariablen oder einen Secret Store; `.env` und private Exporte niemals committen.
- n8n-Importvorlagen enthalten keine Credential-Verknüpfungen und sind inaktiv. Eigene Berechtigungen separat konfigurieren.
- Die Tools der Logistik- und Onboarding-Beispiele simulieren externe Schreibaktionen. Kein echter Versand.
- Eingaben werden validiert, Tool- und Kontextlimits begrenzen Agentenschleifen. Schreibfreigaben sind an Session und Nutzdaten gebunden und können ablaufen.
- Dateibasierte Speicher sind Lernimplementierungen; Session-Trennung ersetzt keine Authentifizierung und keine Mandantensicherheit.
- Vor öffentlicher Bereitstellung: Authentifizierung, Autorisierung, Datenschutz, Rate Limits, Secret-Scanning und Abhängigkeitsprüfung ergänzen.
- Sicherheitslücken nicht mit Schlüsseln oder persönlichen Daten in öffentlichen Issues melden.
