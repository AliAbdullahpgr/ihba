"use client";

import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink, Button } from "@/app/components/primitives";
import {
  NumberedList,
  PageHeader,
  PageSection,
  Prose,
} from "@/app/components/PageShell";
import { formatIban } from "@/lib/org-settings";

export function DonatePage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.donatePage.title} lede={t.donatePage.lede} />

      {/* Nothing here needs a name beyond the page title above it, so this
          band is a plain div rather than an unlabelled section. */}
      <div className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Prose paragraphs={t.donatePage.body} />

            {/*
              Bank details are not published yet, so the page states that plainly
              and gives the direct route instead of a dead form.
            */}
            {/*
              One block per currency, in the order set in the admin. Falls back
              to the explanatory note while no account has been published.
            */}
            <div className="mt-10 border-t border-navy-ink/15 pt-5">
              {t.bankAccounts.length > 0 ? (
                <div className="space-y-4">
                  {t.bankAccounts.map((account) => (
                    <div
                      key={`${account.currency}-${account.iban}`}
                      className="border border-navy-ink/15 bg-paper-warm/40 p-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-ink">
                        Banka bilgileri · {account.currency}
                      </p>
                      {account.bankName && (
                        <p className="mt-3 text-sm font-semibold text-navy-ink">{account.bankName}</p>
                      )}
                      {account.accountHolder && (
                        <p className="mt-1 text-sm text-ink/70">Hesap adı: {account.accountHolder}</p>
                      )}
                      <p className="mt-4 break-all font-mono text-base font-semibold text-navy-ink">
                        {formatIban(account.iban)}
                      </p>
                    </div>
                  ))}
                  <p className="text-xs leading-relaxed text-ink/65">
                    Bağış yapmadan önce IBAN bilgisini lütfen dikkatle kontrol edin.
                  </p>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-ink/70">{t.donatePage.accountsNote}</p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={`mailto:${t.utility.email}`}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t.utility.email}
              </Button>
              <Button
                href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
                variant="outline"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t.utility.phone}
              </Button>
            </div>
          </div>

          {/* Square, like every other image in the rebuilt system — the arch
              mask is gone from the inner pages it used to sit on. */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-square w-full">
              <Image
                src={t.media.fieldRamadanIftar.url}
                alt="A large IHBA Ramadan iftar gathering in Pakistan"
                fill
                sizes="(min-width: 1024px) 320px, 100vw"
                className="object-cover"
              />
            </div>
          </aside>
        </div>
      </div>

      <PageSection title={t.donatePage.usesLabel} tone="warm">
        <NumberedList items={t.donatePage.uses} />

        <div className="mt-12 border-t border-navy-ink/15">
          <div className="grid gap-8 pt-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-medium text-navy-ink">
                {t.volunteerPage.title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                {t.volunteerPage.lede}
              </p>
              <ArrowLink href="/volunteer" className="mt-5">
                {t.volunteerPage.title}
              </ArrowLink>
            </div>
            <div>
              <h3 className="font-display text-lg font-medium text-navy-ink">
                {t.identity.title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                {t.footer.transparency}
              </p>
              <ArrowLink href="/about" className="mt-5">
                {t.identity.title}
              </ArrowLink>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
