"use client";

import { Mail, MapPin, Phone, X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/app/components/SocialIcons";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer id="contact" className="bg-navy-deep pt-16 pb-8">
      <div className="container-site">
        <div className="grid gap-10 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img src="/brand/logo-white.png" alt="IHBA" className="h-11 w-auto" />
            <p className="mt-4 text-sm text-white/60">{t.utility.tagline}</p>
            <div className="mt-6 space-y-2.5 text-sm text-white/75">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{t.footer.addressLine}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`tel:${t.utility.phone.replace(/\s+/g, "")}`} className="hover:text-gold transition-colors">
                  {t.utility.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`mailto:${t.utility.email}`} className="hover:text-gold transition-colors">
                  {t.utility.email}
                </a>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label={t.social.facebook} className="grid size-10 place-items-center rounded-md border border-white/15 text-white transition-colors hover:bg-gold hover:text-white hover:border-gold">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href="#" aria-label={t.social.instagram} className="grid size-10 place-items-center rounded-md border border-white/15 text-white transition-colors hover:bg-gold hover:text-white hover:border-gold">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="#" aria-label={t.social.twitter} className="grid size-10 place-items-center rounded-md border border-white/15 text-white transition-colors hover:bg-gold hover:text-white hover:border-gold">
                <X className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#" aria-label={t.social.linkedin} className="grid size-10 place-items-center rounded-md border border-white/15 text-white transition-colors hover:bg-gold hover:text-white hover:border-gold">
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a href="#" aria-label={t.social.youtube} className="grid size-10 place-items-center rounded-md border border-white/15 text-white transition-colors hover:bg-gold hover:text-white hover:border-gold">
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {t.footer.columns.map((column) => (
            <div key={column.header} className="lg:col-span-2">
              <h3 className="text-sm font-bold text-white mb-4">
                {column.header}
              </h3>
              <ul className="space-y-2.5 text-sm text-white/60">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-gold">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:justify-between">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.transparency}</p>
        </div>
      </div>
    </footer>
  );
}
