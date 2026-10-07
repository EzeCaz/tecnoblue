import { useMemo, useState, type FormEvent } from 'react'
import { CheckCircle2, AlertCircle, MapPin } from 'lucide-react'
import { useLang } from '@/i18n/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { countryCodes } from '@/lib/countries'
import { cn } from '@/lib/cn'
import { site } from '@/config/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Errors = Partial<Record<'name' | 'email' | 'message', string>>

const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) || (import.meta.env.PROD ? '/api/contact' : undefined)

const field = 'mt-2 block h-13 w-full rounded-2xl border border-line bg-ground px-4 text-[16px] text-fg placeholder:text-fg-3 transition-[border-color,box-shadow,background-color] duration-200 focus:border-blue focus:bg-surface focus:shadow-[0_0_0_4px_rgb(9_119_188/0.18)] focus:outline-none'
const label = 'text-[13px] font-bold text-fg'

export function Contact({ subject }: { subject?: string } = {}) {
  const { lang, t } = useLang()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [mapOn, setMapOn] = useState(false)

  const countries = useMemo(() => {
    const dn = new Intl.DisplayNames([lang], { type: 'region' })
    return countryCodes.map((code) => ({ code, name: dn.of(code) ?? code })).sort((a, b) => a.name.localeCompare(b.name, lang))
  }, [lang])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>
    const next: Errors = {}
    if (!data.name?.trim()) next.name = t.contact.required
    if (!data.email?.trim()) next.email = t.contact.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = t.contact.invalidEmail
    if (!data.message?.trim()) next.message = t.contact.required
    setErrors(next)
    if (Object.keys(next).length) {
      ;(form.elements.namedItem(Object.keys(next)[0]) as HTMLElement | null)?.focus()
      return
    }
    setStatus('sending')
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data, lang, subject }) })
        if (!res.ok) throw new Error(String(res.status))
      } else {
        await new Promise((r) => setTimeout(r, 700))
        console.info('[contact] no endpoint configured; simulated send')
      }
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const err = (k: keyof Errors) => errors[k] && <p id={`${k}-error`} className="mt-1.5 text-[14px] text-danger">{errors[k]}</p>

  return (
    <>
      {!subject && <PageHero kicker={t.contact.kicker} title={t.contact.title} lead={t.contact.lead} />}

      <section className="bg-ground">
        <div className="wrap grid gap-10 py-20 sm:py-24 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="rounded-[32px] bg-surface p-6 shadow-soft ring-1 ring-line sm:p-12">
            {status === 'sent' ? (
              <div role="status" className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 aria-hidden="true" className="h-14 w-14 text-accent" strokeWidth={1.25} />
                <h2 className="title-sm mt-5 text-fg">{t.contact.successTitle}</h2>
                <p className="mt-2 text-[17px] text-fg-2">{t.contact.successBody}</p>
                <Button variant="secondary" className="mt-8" onClick={() => setStatus('idle')}>{t.contact.another}</Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={label}>{t.contact.name}</label>
                  <input id="name" name="name" autoComplete="name" maxLength={120} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} className={cn(field, errors.name && 'border-danger')} />
                  {err('name')}
                </div>
                <div>
                  <label htmlFor="company" className={label}>{t.contact.company} <span className="font-medium text-fg-3">· {t.contact.optional}</span></label>
                  <input id="company" name="company" autoComplete="organization" maxLength={120} className={field} />
                </div>
                <div>
                  <label htmlFor="role" className={label}>{t.contact.role} <span className="font-medium text-fg-3">· {t.contact.optional}</span></label>
                  <input id="role" name="role" autoComplete="organization-title" maxLength={120} className={field} />
                </div>
                <div>
                  <label htmlFor="email" className={label}>{t.contact.email}</label>
                  <input id="email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={160} required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} className={cn(field, errors.email && 'border-danger')} />
                  {err('email')}
                </div>
                <div>
                  <label htmlFor="phone" className={label}>{t.contact.phone} <span className="font-medium text-fg-3">· {t.contact.optional}</span></label>
                  <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} className={field} />
                </div>
                <div>
                  <label htmlFor="country" className={label}>{t.contact.country}</label>
                  <select id="country" name="country" autoComplete="country-name" defaultValue="" className={field}>
                    <option value="" disabled>{t.contact.countryPlaceholder}</option>
                    {countries.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="source" className={label}>{t.contact.source}</label>
                  <select id="source" name="source" defaultValue="" className={field}>
                    <option value="" disabled>—</option>
                    {t.contact.sourceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={label}>{t.contact.message}</label>
                  <textarea id="message" name="message" rows={5} maxLength={4000} required placeholder={t.contact.messagePlaceholder} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} className={cn(field, 'h-auto resize-y py-4', errors.message && 'border-danger')} />
                  {err('message')}
                </div>
                {status === 'error' && (
                  <p role="alert" className="flex items-center gap-2 text-[14px] text-danger sm:col-span-2"><AlertCircle aria-hidden="true" className="h-4 w-4" />{t.contact.errorBody}</p>
                )}
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" icon disabled={status === 'sending'} aria-busy={status === 'sending'}>
                    {status === 'sending' ? `${t.contact.sending}…` : t.contact.send}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div aria-labelledby="office-title">
            <h2 id="office-title" className="title-sm text-fg">{t.contact.office}</h2>
            <address className="mt-3 text-[16px] not-italic leading-relaxed text-fg-2">
              {site.address.line1}<br />{site.address.line2}<br />{site.address.country[lang]}
            </address>
            <div className="mt-6 overflow-hidden rounded-[24px] shadow-soft ring-1 ring-line">
              {mapOn ? (
                <iframe title={t.contact.mapTitle} src="https://www.google.com/maps?q=250+NW+136th+Ave+Suite+113+Pembroke+Pines+FL+33028&output=embed" width="100%" height="280" loading="lazy" referrerPolicy="strict-origin" className="block" />
              ) : (
                <div className="relative flex h-[280px] flex-col items-center justify-center gap-3 bg-ground p-6 text-center" style={{ backgroundImage: 'radial-gradient(rgb(11 31 58 / 0.12) 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
                  <MapPin aria-hidden="true" className="h-8 w-8 text-accent" strokeWidth={1.75} />
                  <p className="max-w-[30ch] text-[14px] text-fg-2">{t.contact.mapConsent}</p>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setMapOn(true)}>{t.contact.mapLoad}</Button>
                  <a href="https://www.google.com/maps/search/?api=1&query=250+NW+136th+Ave+Suite+113+Pembroke+Pines+FL+33028" target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-accent hover:underline">{t.contact.mapOpen}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
