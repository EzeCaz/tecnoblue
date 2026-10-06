/**
 * Higgsfield API example — Seedance 2.5 text-to-video.
 *   npm run seedance
 * Reads HF_CREDENTIALS from .env.local (key-id:key-secret). Each run is a billable generation.
 */
import { config, higgsfield } from '@higgsfield/client/v2'
import { loadLocalEnv, hasHiggsfieldCredentials } from './env'

loadLocalEnv()
if (!hasHiggsfieldCredentials()) {
  console.error('HF_CREDENTIALS is not set. Add it to .env.local as key-id:key-secret (from console.higgsfield.ai) and run again.')
  process.exit(2)
}
config({ credentials: process.env.HF_CREDENTIALS })

const started = Date.now()
console.log('Submitting bytedance/seedance-2.5/text-to-video…')

let result
try {
  result = await higgsfield.subscribe('bytedance/seedance-2.5/text-to-video', {
    input: {
      prompt: 'A cinematic scene at sunset',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
      output_format: 'mp4',
      generate_audio: true,
    },
    withPolling: true,
  })
} catch (err) {
  const e = err as { name?: string; message?: string; statusCode?: number }
  if (e.statusCode === 403 && /credit/i.test(e.message ?? '')) console.error('Not enough credits on the Higgsfield account. Top up at console.higgsfield.ai and run again.')
  else if (e.statusCode === 401 || e.statusCode === 403) console.error(`Request refused (${e.statusCode}): ${e.message}. Check the key in .env.local.`)
  else console.error(`Request failed${e.statusCode ? ` (${e.statusCode})` : ''}: ${e.message ?? String(err)}`)
  process.exit(1)
}

const seconds = ((Date.now() - started) / 1000).toFixed(1)
// The v2 client returns the raw API response: { status, request_id, status_url, cancel_url, video?: { url }, images?: [{ url }] }
type V2Response = { status?: string; request_id?: string; video?: { url?: string }; images?: { url?: string }[]; error?: unknown; message?: string }
const r = result as unknown as V2Response
const status = r.status ?? 'unknown'

if (status === 'nsfw') { console.error(`Request was rejected by moderation (status: nsfw) after ${seconds}s. Credits are refunded.`); process.exit(1) }
if (status === 'canceled' || status === 'cancelled') { console.error(`Request was canceled after ${seconds}s.`); process.exit(1) }
if (status === 'failed') { console.error(`Generation failed after ${seconds}s.${r.message ? ` ${r.message}` : ''}`); process.exit(1) }
if (status !== 'completed') { console.error(`Request did not complete (status: ${status}) after ${seconds}s. Request id: ${r.request_id ?? 'n/a'}`); process.exit(1) }

const url = r.video?.url ?? r.images?.[0]?.url
if (!url) { console.error(`Completed, but no video URL was returned. Request id: ${r.request_id ?? 'n/a'}`); process.exit(1) }
console.log(`Completed in ${seconds}s. Request id: ${r.request_id}`)
console.log(`Video URL: ${url}`)
