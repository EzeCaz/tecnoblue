/** Loads .env.local (then .env) into process.env without printing anything. Values stay server-side. */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export function loadLocalEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = resolve(f)
    if (existsSync(p)) { try { process.loadEnvFile(p) } catch { /* ignore malformed lines */ } }
  }
}

/** True when credentials are present. Never returns or logs the value itself. */
export function hasHiggsfieldCredentials(): boolean {
  const c = process.env.HF_CREDENTIALS
  return typeof c === 'string' && c.includes(':') && c.trim().length > 10
}
