"use client";

import {
  ExternalLink,
  FolderKanban,
  GalleryHorizontalEnd,
  HeartHandshake,
  HelpCircle,
  ImagePlus,
  Layers,
  Newspaper,
  Pencil,
  Quote,
  Save,
  Target,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  saveHomepageAreas,
  saveHomepageCampaign,
  saveHomepageSelection,
  saveSiteContent,
} from "@/app/admin/actions";
import { inputClass } from "@/app/admin/components/AdminUi";
import { AdminSubmitButton } from "@/app/admin/components/FormActions";
import { ImageUpload } from "@/app/admin/components/ImageUpload";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
import { contentFieldName, type ContentField } from "@/lib/content-fields";
import { HOMEPAGE_SECTION_LIMIT } from "@/lib/homepage-sections";
import { CUSTOM_LINK, isKnownSiteLink, siteLinkGroups } from "@/lib/site-links";

const icons = {
  banner: GalleryHorizontalEnd,
  intro: Layers,
  news: Newspaper,
  projects: FolderKanban,
  areas: Target,
  president: Quote,
  campaign: HeartHandshake,
  mission: Users,
  faq: HelpCircle,
} as const;

export type SelectOption = {
  id: string;
  title: string;
  /** Date, region or category — whatever tells two items apart at a glance. */
  meta?: string;
  image?: string;
  /**
   * Set where the image belongs to the item itself and is uploaded here —
   * activity areas. News and projects keep their photographs on their own
   * screens, so those lists stay read-only previews.
   */
  editableImage?: boolean;
  imagePublicId?: string;
  imageAlt?: string;
};

type AreaImageDraft = {
  index: number;
  imageUrl: string;
  imagePublicId: string;
  imageAlt: string;
};

export type CampaignData = {
  kicker: string;
  title: { pre: string; highlight: string; post: string };
  copy: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  goalLabel: string;
  goalValue: string;
  imageKey: string;
  imageUrl?: string;
  imagePublicId?: string;
};

export type MediaOption = { key: string; label: string; url: string };

type SectionBase = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof icons;
  note?: string;
};

export type HomepageSection = SectionBase &
  (
    | {
        /** Sections with their own screen link out to it. */
        kind: "link";
        href: string;
        action: string;
      }
    | {
        /**
         * Plain website copy opens a focus panel here instead of sending the
         * operator to the generic content screen to hunt for the right block.
         */
        kind: "fields";
        fields: ContentField[];
      }
    | {
        /** Curated lists: choose up to three of the published items. */
        kind: "select";
        section: "news" | "projects" | "areas";
        options: SelectOption[];
        selected: string[];
        /** What happens when nothing is chosen. */
        automaticHint: string;
        emptyHint: string;
        manageHref?: string;
        manageLabel?: string;
      }
    | {
        /** The campaign band, with the banner editor's destination pickers. */
        kind: "campaign";
        campaign: CampaignData;
        mediaOptions: MediaOption[];
      }
  );

/**
 * Button destination: a dropdown of real pages, so a mistyped path cannot
 * become a broken link. "Another address" stays available for campaign pages
 * and external sites, and reveals a plain input when chosen.
 */
function LinkPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [custom, setCustom] = useState(() => Boolean(value) && !isKnownSiteLink(value));

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      <select
        className={inputClass}
        value={custom ? CUSTOM_LINK : value}
        onChange={(event) => {
          if (event.target.value === CUSTOM_LINK) {
            setCustom(true);
            return;
          }
          setCustom(false);
          onChange(event.target.value);
        }}
      >
        {Object.entries(siteLinkGroups).map(([group, links]) => (
          <optgroup label={group} key={group}>
            {links.map((link) => (
              <option value={link.href} key={link.href}>
                {link.label}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={CUSTOM_LINK}>Başka bir adres…</option>
      </select>
      {custom && (
        <input
          className={inputClass}
          style={{ marginTop: "8px" }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://… veya /kampanya"
          aria-label={`${label} — adres`}
        />
      )}
    </div>
  );
}

/**
 * Activity areas: choose up to three, and give each its own photograph.
 *
 * One panel and one Save button, because picking a card and giving it a
 * picture is a single job. The homepage previously drew these three images
 * from a hardcoded list keyed by slot, so changing which areas appeared kept
 * showing the same photographs.
 */
function AreasPanel({
  section,
  locale,
  onCancel,
}: {
  section: Extract<HomepageSection, { kind: "select" }>;
  locale: "tr" | "en";
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(() =>
    section.selected.filter((id) => section.options.some((option) => option.id === id)),
  );
  const [images, setImages] = useState<AreaImageDraft[]>(() =>
    section.options.map((option, index) => ({
      index,
      imageUrl: option.image ?? "",
      imagePublicId: option.imagePublicId ?? "",
      imageAlt: option.imageAlt ?? "",
    })),
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const full = selected.length >= HOMEPAGE_SECTION_LIMIT;

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length >= HOMEPAGE_SECTION_LIMIT
          ? current
          : [...current, id],
    );
  }

  function patchImage(index: number, patch: Partial<AreaImageDraft>) {
    setImages((current) =>
      current.map((image) => (image.index === index ? { ...image, ...patch } : image)),
    );
  }

  return (
    <form action={saveHomepageAreas} className="admin-drawer-form">
      <input type="hidden" name="locale" value={locale} />
      <input
        type="hidden"
        name="values"
        value={JSON.stringify(selected.map((id) => Number(id)))}
        readOnly
      />
      <input type="hidden" name="images" value={JSON.stringify(images)} readOnly />
      <div className="admin-drawer-body">
        <p className="admin-field-hint">
          En fazla {HOMEPAGE_SECTION_LIMIT} tanesini seçin. Seçtiğiniz sıra, anasayfadaki
          sıradır. Hiçbirini seçmezseniz {section.automaticHint}
        </p>

        {section.options.length === 0 ? (
          <p className="admin-empty-note">{section.emptyHint}</p>
        ) : (
          <ul className="admin-pick-list">
            {section.options.map((option, index) => {
              const order = selected.indexOf(option.id);
              const checked = order >= 0;
              const image = images[index];
              const isOpen = expanded === option.id;
              return (
                <li key={option.id}>
                  <div
                    className={`admin-pick-item ${checked ? "is-selected" : ""} ${
                      !checked && full ? "is-disabled" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() => toggle(option.id)}
                      aria-label={`${option.title} alanını anasayfada göster`}
                    />
                    {image?.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image.imageUrl} alt="" className="admin-pick-image" />
                    ) : (
                      <span className="admin-pick-image admin-pick-image-empty">
                        <ImagePlus className="size-5" aria-hidden="true" />
                      </span>
                    )}
                    <span className="admin-pick-copy">
                      <strong>{option.title}</strong>
                      {option.meta && <small>{option.meta}</small>}
                    </span>
                    {checked && <span className="admin-pick-order">{order + 1}</span>}
                    <button
                      type="button"
                      className="admin-table-action"
                      onClick={() => setExpanded(isOpen ? null : option.id)}
                      aria-expanded={isOpen}
                    >
                      <ImagePlus className="size-3.5" aria-hidden="true" />
                      {image?.imageUrl ? "Görseli değiştir" : "Görsel ekle"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="admin-pick-image-editor">
                      <ImageUpload
                        key={option.id}
                        initialUrl={image?.imageUrl}
                        initialPublicId={image?.imagePublicId}
                        emitHiddenFields={false}
                        cropAspectRatio={4 / 3}
                        recommendedDimensions="1200 × 900 px"
                        onValueChange={(value) =>
                          patchImage(index, {
                            imageUrl: value.url,
                            imagePublicId: value.publicId,
                          })
                        }
                      />
                      <label className="admin-field">
                        <span className="admin-field-label">Görsel açıklaması</span>
                        <input
                          className={inputClass}
                          value={image?.imageAlt ?? ""}
                          onChange={(event) =>
                            patchImage(index, { imageAlt: event.target.value })
                          }
                          placeholder="Fotoğrafta ne görünüyor?"
                        />
                        <span className="admin-field-hint">
                          Görme engelli ziyaretçiler ve arama motorları bu metni okur.
                        </span>
                      </label>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {section.manageHref && (
          <p className="admin-field-hint">
            Alan başlıklarını değiştirmek için{" "}
            <Link href={section.manageHref} className="admin-inline-link">
              {section.manageLabel} <ExternalLink className="size-3" aria-hidden="true" />
            </Link>
          </p>
        )}
      </div>
      <div className="admin-drawer-footer">
        <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
          Vazgeç
        </button>
        <AdminSubmitButton>Faaliyet alanlarını kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}

/** Choose up to three items; the order chosen is the order shown. */
function SelectionPanel({
  section,
  locale,
  onCancel,
}: {
  section: Extract<HomepageSection, { kind: "select" }>;
  locale: "tr" | "en";
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(() =>
    section.selected.filter((id) => section.options.some((option) => option.id === id)),
  );
  const full = selected.length >= HOMEPAGE_SECTION_LIMIT;

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length >= HOMEPAGE_SECTION_LIMIT
          ? current
          : [...current, id],
    );
  }

  // Areas are identified by their position in the card list, which has no
  // stable key; everything else is identified by slug.
  const payload =
    section.section === "areas" ? selected.map((id) => Number(id)) : selected;

  return (
    <form action={saveHomepageSelection} className="admin-drawer-form">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="section" value={section.section} />
      <input type="hidden" name="values" value={JSON.stringify(payload)} readOnly />
      <div className="admin-drawer-body">
        <p className="admin-field-hint">
          En fazla {HOMEPAGE_SECTION_LIMIT} tanesini seçin. Seçtiğiniz sıra, anasayfadaki
          sıradır. Hiçbirini seçmezseniz {section.automaticHint}
        </p>

        {section.options.length === 0 ? (
          <p className="admin-empty-note">{section.emptyHint}</p>
        ) : (
          <ul className="admin-pick-list">
            {section.options.map((option) => {
              const index = selected.indexOf(option.id);
              const checked = index >= 0;
              return (
                <li key={option.id}>
                  <label
                    className={`admin-pick-item ${checked ? "is-selected" : ""} ${
                      !checked && full ? "is-disabled" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() => toggle(option.id)}
                    />
                    {option.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={option.image} alt="" className="admin-pick-image" />
                    ) : (
                      <span className="admin-pick-image admin-pick-image-empty">
                        <ImagePlus className="size-5" aria-hidden="true" />
                      </span>
                    )}
                    <span className="admin-pick-copy">
                      <strong>{option.title}</strong>
                      {option.meta && <small>{option.meta}</small>}
                    </span>
                    {checked && <span className="admin-pick-order">{index + 1}</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {section.manageHref && (
          <p className="admin-field-hint">
            İçeriği değiştirmek için{" "}
            <Link href={section.manageHref} className="admin-inline-link">
              {section.manageLabel} <ExternalLink className="size-3" aria-hidden="true" />
            </Link>
          </p>
        )}
      </div>
      <div className="admin-drawer-footer">
        <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
          Vazgeç
        </button>
        <AdminSubmitButton>Seçimi kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}

/** The campaign band, edited the way the banner slides are. */
function CampaignPanel({
  section,
  locale,
  onCancel,
}: {
  section: Extract<HomepageSection, { kind: "campaign" }>;
  locale: "tr" | "en";
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(section.campaign);
  const patch = (next: Partial<CampaignData>) =>
    setDraft((current) => ({ ...current, ...next }));
  const patchTitle = (key: keyof CampaignData["title"], value: string) =>
    setDraft((current) => ({ ...current, title: { ...current.title, [key]: value } }));
  const preview = section.mediaOptions.find((media) => media.key === draft.imageKey);

  return (
    <form action={saveHomepageCampaign} className="admin-drawer-form">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="campaign" value={JSON.stringify(draft)} readOnly />
      <div className="admin-drawer-body">
        <label className="admin-field">
          <span className="admin-field-label">Üst etiket</span>
          <input
            className={inputClass}
            value={draft.kicker}
            onChange={(event) => patch({ kicker: event.target.value })}
            placeholder="Örnek: Öncelikli kampanya"
          />
        </label>
        <label className="admin-field">
          <span className="admin-field-label">Başlığın giriş kısmı</span>
          <input
            className={inputClass}
            value={draft.title.pre}
            onChange={(event) => patchTitle("pre", event.target.value)}
          />
        </label>
        <label className="admin-field">
          <span className="admin-field-label">Vurgulanan başlık</span>
          <input
            className={inputClass}
            value={draft.title.highlight}
            onChange={(event) => patchTitle("highlight", event.target.value)}
          />
          <span className="admin-field-hint">Bu kısım website'de renkli gösterilir.</span>
        </label>
        <label className="admin-field">
          <span className="admin-field-label">Başlığın devamı</span>
          <input
            className={inputClass}
            value={draft.title.post}
            onChange={(event) => patchTitle("post", event.target.value)}
          />
        </label>
        <label className="admin-field">
          <span className="admin-field-label">Açıklama</span>
          <textarea
            className={inputClass}
            rows={5}
            value={draft.copy}
            onChange={(event) => patch({ copy: event.target.value })}
          />
        </label>

        <div className="admin-drawer-grid">
          <label className="admin-field">
            <span className="admin-field-label">Ana buton yazısı</span>
            <input
              className={inputClass}
              value={draft.ctaPrimary}
              onChange={(event) => patch({ ctaPrimary: event.target.value })}
            />
          </label>
          <LinkPicker
            label="Ana buton nereye gitsin?"
            value={draft.ctaPrimaryHref}
            onChange={(next) => patch({ ctaPrimaryHref: next })}
          />
          <label className="admin-field">
            <span className="admin-field-label">İkinci buton yazısı</span>
            <input
              className={inputClass}
              value={draft.ctaSecondary}
              onChange={(event) => patch({ ctaSecondary: event.target.value })}
            />
          </label>
          <LinkPicker
            label="İkinci buton nereye gitsin?"
            value={draft.ctaSecondaryHref}
            onChange={(next) => patch({ ctaSecondaryHref: next })}
          />
          <label className="admin-field">
            <span className="admin-field-label">Hedef açıklaması</span>
            <input
              className={inputClass}
              value={draft.goalLabel}
              onChange={(event) => patch({ goalLabel: event.target.value })}
              placeholder="Örnek: Kampanya hedefi"
            />
          </label>
          <label className="admin-field">
            <span className="admin-field-label">Hedef değeri</span>
            <input
              className={inputClass}
              value={draft.goalValue}
              onChange={(event) => patch({ goalValue: event.target.value })}
              placeholder="Örnek: 1.200.000 ₺"
            />
          </label>
        </div>

        <label className="admin-field">
          <span className="admin-field-label">Hazır görsellerden seç</span>
          <select
            className={inputClass}
            value={draft.imageKey}
            onChange={(event) => patch({ imageKey: event.target.value })}
          >
            {section.mediaOptions.map((media) => (
              <option value={media.key} key={media.key}>
                {media.label}
              </option>
            ))}
          </select>
        </label>
        {/* The bundled choice above is what shows until a file is uploaded
            here; an upload takes precedence over it. */}
        {preview && !draft.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.url} alt="" className="admin-campaign-preview" />
        )}
        <div className="admin-field">
          <span className="admin-field-label">Ya da yeni bir görsel yükleyin</span>
          <ImageUpload
            initialUrl={draft.imageUrl}
            initialPublicId={draft.imagePublicId}
            emitHiddenFields={false}
            recommendedDimensions="1600 × 900 px"
            onValueChange={(value) =>
              patch({ imageUrl: value.url, imagePublicId: value.publicId })
            }
          />
          <span className="admin-field-hint">
            Yüklenen görsel, yukarıdaki hazır seçimin yerine kullanılır.
          </span>
        </div>
      </div>
      <div className="admin-drawer-footer">
        <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
          Vazgeç
        </button>
        <AdminSubmitButton>Kampanyayı kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}

/** The generic copy panel, built from the same fields the content screen uses. */
function FieldsPanel({
  section,
  locale,
  onCancel,
}: {
  section: Extract<HomepageSection, { kind: "fields" }>;
  locale: "tr" | "en";
  onCancel: () => void;
}) {
  return (
    <form action={saveSiteContent} className="admin-drawer-form">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="returnTo" value="homepage" />
      <div className="admin-drawer-body">
        <p className="admin-field-hint">{section.description}</p>
        {section.fields.map((field) => {
          const name = contentFieldName(field);
          if (field.kind === "rich") {
            return (
              <div className="admin-field" key={name}>
                <span className="admin-field-label">{field.label}</span>
                <RichTextEditor name={name} initialBlocks={field.blocks} />
              </div>
            );
          }
          const long = field.value.length > 90 || field.value.includes("\n");
          return (
            <label className="admin-field" key={name}>
              <span className="admin-field-label">{field.label}</span>
              {long ? (
                <textarea
                  name={name}
                  defaultValue={field.value}
                  rows={Math.min(8, Math.max(3, Math.ceil(field.value.length / 80)))}
                  className={inputClass}
                />
              ) : (
                <input name={name} defaultValue={field.value} className={inputClass} />
              )}
            </label>
          );
        })}
      </div>
      <div className="admin-drawer-footer">
        <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
          Vazgeç
        </button>
        <AdminSubmitButton>Kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}

/** One-line summary of a curated section, shown on the map row. */
function selectionSummary(section: Extract<HomepageSection, { kind: "select" }>) {
  const live = section.selected.filter((id) =>
    section.options.some((option) => option.id === id),
  );
  if (section.options.length === 0) return section.emptyHint;
  return live.length > 0
    ? `Seçili: ${live.length} / ${HOMEPAGE_SECTION_LIMIT}`
    : `Otomatik — ${section.automaticHint}`;
}

export function HomepageSectionEditor({
  locale,
  sections,
}: {
  locale: "tr" | "en";
  sections: HomepageSection[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const open = sections.find(
    (section) => section.id === openId && section.kind !== "link",
  );

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpenId(null);

  return (
    <>
      <ol className="admin-homepage-map">
        {sections.map((section, index) => {
          const Icon = icons[section.icon];
          const status =
            section.kind === "select" ? selectionSummary(section) : section.note;
          return (
            <li className="admin-homepage-section" key={section.id}>
              <span className="admin-homepage-order" aria-hidden="true">
                {index + 1}
              </span>
              <span className="admin-homepage-icon" aria-hidden="true">
                <Icon className="size-5" />
              </span>
              <div className="admin-homepage-copy">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                {status && <p className="admin-homepage-note">{status}</p>}
              </div>
              {section.kind === "link" ? (
                <Link href={section.href} className="admin-button admin-button-secondary">
                  {section.action}
                </Link>
              ) : (
                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={() => setOpenId(section.id)}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  {section.kind === "select" ? "Seç" : "Düzenle"}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {open && open.kind !== "link" && (
        <div className="admin-drawer-backdrop" role="presentation" onMouseDown={close}>
          <aside
            className="admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="homepage-section-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="admin-drawer-header">
              <div>
                <span className="admin-eyebrow">Anasayfa bölümü</span>
                <h2 id="homepage-section-title">{open.title}</h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="admin-icon-button"
                onClick={close}
                aria-label="Düzenlemeyi kapat"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {open.kind === "fields" && (
              <FieldsPanel section={open} locale={locale} onCancel={close} />
            )}
            {open.kind === "select" &&
              (open.section === "areas" ? (
                <AreasPanel section={open} locale={locale} onCancel={close} />
              ) : (
                <SelectionPanel section={open} locale={locale} onCancel={close} />
              ))}
            {open.kind === "campaign" && (
              <CampaignPanel section={open} locale={locale} onCancel={close} />
            )}
          </aside>
        </div>
      )}
    </>
  );
}
