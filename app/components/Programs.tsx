"use client";

import {
  GraduationCap,
  HandHeart,
  Handshake,
  Palette,
  Sprout,
  Stethoscope,
  Users,
} from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { SectionHeader } from "@/app/components/SectionHeader";

const icons = [HandHeart, GraduationCap, Sprout, Users, Stethoscope, Palette, Handshake];

export function Programs() {
  const { t } = useI18n();
  const cards = t.programs.cards;
  const { title } = t.programs;

  return (
    <section id="programs" className="bg-paper-warm py-16 lg:py-24">
      <div className="container-site">
        <SectionHeader
          align="left"
          title={
            <>
              {title.pre}
              <span className="bg-azure-soft px-2 rounded-md box-decoration-clone">
                {title.highlight}
              </span>
              {title.post}
            </>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = icons[index];
            const isLast = index === cards.length - 1;

            if (isLast) {
              return (
                <Reveal key={card.title} className="sm:col-span-2 lg:col-span-1 lg:col-start-2">
                  <article className="h-full rounded-2xl border border-navy-deep bg-navy-deep p-7 transition-all hover:-translate-y-0.5 hover:border-gold/60">
                    <span className="grid size-11 place-items-center rounded-full bg-white/10 text-gold">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{card.blurb}</p>
                  </article>
                </Reveal>
              );
            }

            return (
              <Reveal key={card.title}>
                <article className="h-full rounded-2xl border border-line bg-white p-7 transition-all hover:border-azure/60 hover:-translate-y-0.5">
                  <span className="grid size-11 place-items-center rounded-full bg-azure/10 text-azure-deep">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/65">{card.blurb}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
