// Lehrbeispiel: deterministische Regeln, keine vollständige DLP oder Authentifizierung.
export function inputGuard(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 2000) throw new Error('Eingabe blockiert');
  return value.trim();
}
export function outputGuard(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 2000) throw new Error('Ausgabe blockiert');
  if (/sk-(?:ant-|proj-)?[a-z0-9_-]{12,}|(?:api[_ -]?key|password|passwort)\s*[:=]\s*\S+/i.test(value)) throw new Error('Mögliche Zugangsdaten blockiert');
  return value;
}
