#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$root/lektion-06"
if [[ ${1:-} != --live ]]; then
  echo 'Nur mit freigegebenem Schulschlüssel: bash wbs-livetest.sh --live (API-Kosten).'; exit 2
fi
# Use only an explicitly configured school credential; never access n8n secrets.
if ! node -r dotenv/config -e 'if (!process.env.ANTHROPIC_API_KEY?.trim()) process.exit(1)'; then
  echo 'Schulschlüssel in lektion-06/.env oder Umgebungsvariable fehlt.'; exit 2
fi
printf 'Live-Smoke-Tests: Ergebnisse kontrollieren; kein echter Versand, keine n8n-Änderung.\n'
for file in src/samples/first-agent.ts src/samples/pokedex.ts src/samples/review.ts src/samples/guardrail.ts src/samples/max-turns.ts src/lektion-07/sequential.ts src/lektion-07/concurrent.ts src/lektion-07/handoffs.ts src/lektion-07/manager.ts src/lektion-08/live.ts src/lektion-09/live.ts; do
  printf '\n=== %s ===\n' "$file"
  timeout 180s ./node_modules/.bin/tsx "$file"
done
printf '\nSmoke-Aufrufe beendet. Ausgaben auf fachliche Korrektheit, Tool-Nachweise und FAILED/BLOCKED prüfen.\n'
