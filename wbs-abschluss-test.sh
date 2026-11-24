#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$root/lektion-05"
if [[ ! -x node_modules/.bin/tsc ]]; then
  if [[ -f package-lock.json ]]; then npm ci; else npm install; fi
fi
npm run check
cd "$root/lektion-06"
if [[ ! -x node_modules/.bin/tsc || ! -x node_modules/.bin/tsx ]]; then
  if [[ -f package-lock.json ]]; then npm ci; else npm install; fi
fi
npm run check
./node_modules/.bin/tsx --test src/local.test.ts src/lektion-07/patterns.test.ts src/lektion-08/loop.test.ts src/lektion-09/memory.test.ts src/abschluss/integration.test.ts
./node_modules/.bin/tsx src/lektion-08/demo.ts
printf '\nLOKALE ABSCHLUSSPRUEFUNG BESTANDEN. Keine KI-API aufgerufen.\n'
