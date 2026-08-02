"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Eye,
  GripVertical,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { saveHeroSlides } from "@/app/admin/actions";
import { ConfirmationDialog } from "@/app/admin/components/AdminOverlays";
import { AdminCard, AdminButton, StatusBadge, inputClass } from "@/app/admin/components/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";
import { ImageUpload } from "@/app/admin/components/ImageUpload";
import {
  MAX_ACTIVE_HERO_SLIDES,
  heroSlideTitle,
  type HeroSlideRecord,
  type HeroSlideTrashRecord,
} from "@/lib/hero-slides";
import { CUSTOM_LINK, isKnownSiteLink, siteLinkGroups } from "@/lib/site-links";

type MediaOption = { key: string; label: string; url: string };

function newSlide(imageKey: string): HeroSlideRecord {
  return {
    id: `slide-${Date.now()}`,
    headline: { pre: "", highlight: "Yeni banner", post: "" },
    subcopy: "Kısa açıklamayı buraya yazın.",
    ctaPrimary: "Daha fazla bilgi",
    ctaPrimaryHref: "/about",
    ctaSecondary: "İletişim",
    ctaSecondaryHref: "/contact",
    imageKey,
    alt: "",
    active: true,
  };
}

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
  // An unrecognised saved value means someone entered it by hand, so the
  // picker opens in custom mode rather than silently rewriting their link.
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
        <>
          <input
            className={inputClass}
            style={{ marginTop: "8px" }}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://… veya /kampanya"
            aria-label={`${label} — adres`}
          />
          <span className="admin-field-hint">
            Site içi adresler / ile, dış bağlantılar https:// ile başlamalıdır.
          </span>
        </>
      )}
    </div>
  );
}

export function SliderManager({
  locale,
  initialSlides,
  initialTrash,
  mediaOptions,
  saved,
}: {
  locale: "tr" | "en";
  initialSlides: HeroSlideRecord[];
  initialTrash: HeroSlideTrashRecord[];
  mediaOptions: MediaOption[];
  saved: boolean;
}) {
  const [slides, setSlides] = useState(initialSlides);
  const [trash, setTrash] = useState(initialTrash);
  const [editing, setEditing] = useState<HeroSlideRecord | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [removeCandidate, setRemoveCandidate] = useState<HeroSlideRecord | null>(null);
  const mediaByKey = useMemo(
    () => Object.fromEntries(mediaOptions.map((media) => [media.key, media])),
    [mediaOptions],
  );

  const activeCount = slides.filter((slide) => slide.active).length;

  function openEditor(slide: HeroSlideRecord) {
    setNotice("");
    setEditing({ ...slide, headline: { ...slide.headline } });
  }

  function updateEditing(patch: Partial<HeroSlideRecord>) {
    setEditing((current) => (current ? { ...current, ...patch } : current));
  }

  function updateHeadline(key: keyof HeroSlideRecord["headline"], value: string) {
    setEditing((current) =>
      current ? { ...current, headline: { ...current.headline, [key]: value } } : current,
    );
  }

  function commitEditing() {
    if (!editing) return;
    setSlides((current) =>
      current.map((slide) => (slide.id === editing.id ? editing : slide)),
    );
    setEditing(null);
    setNotice(
      "Banner değişikliği henüz kaydedilmedi. Hazır olduğunuzda sayfanın altındaki düğmeyi kullanın.",
    );
  }

  function addSlide() {
    const slide = {
      ...newSlide(mediaOptions[0]?.key ?? "hero"),
      active: activeCount < MAX_ACTIVE_HERO_SLIDES,
    };
    setSlides((current) => [...current, slide]);
    setEditing(slide);
    setNotice(
      activeCount >= MAX_ACTIVE_HERO_SLIDES
        ? `En fazla ${MAX_ACTIVE_HERO_SLIDES} banner yayında olabilir. Yeni banner gizli olarak eklendi.`
        : "",
    );
  }

  function duplicateSlide(slide: HeroSlideRecord) {
    const copy: HeroSlideRecord = {
      ...slide,
      id: `slide-${Date.now()}`,
      active: false,
      headline: { ...slide.headline, highlight: `${slide.headline.highlight} — kopya` },
    };
    setSlides((current) => {
      const index = current.findIndex((item) => item.id === slide.id);
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
    });
    setNotice("Banner kopyalandı ve gizli olarak eklendi. İçeriğini düzenleyip yayınlayabilirsiniz.");
  }

  function toggleSlide(slide: HeroSlideRecord) {
    if (!slide.active && activeCount >= MAX_ACTIVE_HERO_SLIDES) {
      setNotice(
        `Aynı anda en fazla ${MAX_ACTIVE_HERO_SLIDES} banner yayınlanabilir. Önce başka bir bannerı gizleyin.`,
      );
      return;
    }
    /*
      Hiding the last published banner would leave the homepage with no
      headline and no call to action, so the editor blocks it here and the
      save action refuses it as well.
    */
    if (slide.active && activeCount <= 1) {
      setNotice("En az bir banner yayında kalmalıdır. Önce başka bir bannerı yayınlayın.");
      return;
    }
    setSlides((current) =>
      current.map((item) => (item.id === slide.id ? { ...item, active: !item.active } : item)),
    );
    setNotice("");
  }

  function moveSlide(from: number, to: number) {
    if (to < 0 || to >= slides.length || from === to) return;
    setSlides((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setNotice("");
  }

  function moveToTrash(slide: HeroSlideRecord) {
    setSlides((current) => current.filter((item) => item.id !== slide.id));
    setTrash((current) => [...current, { ...slide, deletedAt: new Date().toISOString() }]);
    if (editing?.id === slide.id) setEditing(null);
    setNotice(`“${heroSlideTitle(slide)}” kaydettiğinizde Çöp kutusu'na taşınacak.`);
  }

  function requestRemove(slide: HeroSlideRecord) {
    if (slides.length <= 1) {
      setNotice("Anasayfanın en az bir bannerı olmalıdır. Bu son bannerı silemezsiniz.");
      return;
    }
    if (slide.active && activeCount <= 1) {
      setNotice("Yayındaki tek banner silinemez. Önce başka bir bannerı yayınlayın.");
      return;
    }
    setRemoveCandidate(slide);
  }

  return (
    <>
      {saved && (
        <div className="admin-feedback admin-feedback-success" role="status">
          <Check className="size-4" aria-hidden="true" />
          Banner değişiklikleri kaydedildi. Website'de görünmesi için yayın durumunu kontrol edin.
        </div>
      )}
      {notice && (
        <div className="admin-feedback admin-feedback-info" role="status">
          {notice}
        </div>
      )}

      <form action={saveHeroSlides} className="admin-slider-form">
        <UnsavedChangesGuard />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="slides" value={JSON.stringify(slides)} readOnly />
        <input type="hidden" name="trash" value={JSON.stringify(trash)} readOnly />

        <AdminCard
          eyebrow={`${activeCount} / ${MAX_ACTIVE_HERO_SLIDES} aktif`}
          title="Banner sırası"
          description="Masaüstünde sürükleyerek sıralayın. Mobilde ve klavyeyle yukarı-aşağı düğmelerini kullanın."
          action={
            <Link href="/" target="_blank" rel="noreferrer" className="admin-inline-link">
              <Eye className="size-3.5" aria-hidden="true" /> Website'de önizle
            </Link>
          }
        >
          <div className="admin-slider-list">
            {slides.map((slide, index) => {
              const media = mediaByKey[slide.imageKey];
              const image = slide.imageUrl || media?.url;
              return (
                <article
                  className={`admin-slider-item ${!slide.active ? "is-hidden" : ""}`}
                  key={slide.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (dragIndex !== null) moveSlide(dragIndex, index);
                    setDragIndex(null);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                >
                  <div className="admin-slider-drag" title="Sıralamak için sürükleyin">
                    <GripVertical className="size-5" aria-hidden="true" />
                    <span>{index + 1}</span>
                  </div>
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="admin-slider-image" />
                  ) : (
                    <div className="admin-slider-image admin-slider-image-empty">
                      <ImagePlus className="size-6" aria-hidden="true" />
                    </div>
                  )}
                  <div className="admin-slider-copy">
                    <div className="admin-slider-topline">
                      <StatusBadge state={slide.active ? "published" : "hidden"} />
                      <span>{index === 0 ? "İlk banner" : `Banner ${index + 1}`}</span>
                    </div>
                    <h2>{heroSlideTitle(slide)}</h2>
                    <p>{slide.subcopy}</p>
                    <div className="admin-slider-destination">
                      <span>{slide.ctaPrimary}</span>
                      <code>{slide.ctaPrimaryHref}</code>
                    </div>
                    <div className="admin-slider-actions">
                      {/*
                        Every banner opens the same editor. The first one used
                        to send the operator to the generic content screen
                        instead, which meant leaving the page to change a
                        headline they were looking straight at.
                      */}
                      <button
                        type="button"
                        className="admin-table-action"
                        onClick={() => openEditor(slide)}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" /> Düzenle
                      </button>
                      {index > 0 && (
                        <button
                          type="button"
                          className="admin-table-action"
                          onClick={() => moveSlide(index, index - 1)}
                          aria-label={`${heroSlideTitle(slide)} bannerını yukarı taşı`}
                        >
                          <ArrowUp className="size-3.5" aria-hidden="true" /> Yukarı
                        </button>
                      )}
                      {index < slides.length - 1 && (
                        <button
                          type="button"
                          className="admin-table-action"
                          onClick={() => moveSlide(index, index + 1)}
                          aria-label={`${heroSlideTitle(slide)} bannerını aşağı taşı`}
                        >
                          <ArrowDown className="size-3.5" aria-hidden="true" /> Aşağı
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-table-action"
                        onClick={() => duplicateSlide(slide)}
                      >
                        <Copy className="size-3.5" aria-hidden="true" /> Kopyala
                      </button>
                      <button
                        type="button"
                        className="admin-table-action"
                        onClick={() => toggleSlide(slide)}
                      >
                        {slide.active ? "Gizle" : "Yayınla"}
                      </button>
                      <button
                        type="button"
                        className="admin-table-action admin-table-action-danger"
                        onClick={() => requestRemove(slide)}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" /> Çöp kutusuna taşı
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="admin-slider-footer">
            <span>
              Değişiklikler taslak olarak bu sayfada tutulur; kaydettiğinizde website'e aktarılır.
            </span>
            <AdminSubmitButton>Bannerları kaydet</AdminSubmitButton>
          </div>
        </AdminCard>
      </form>

      <ConfirmationDialog
        open={Boolean(removeCandidate)}
        title={`“${removeCandidate ? heroSlideTitle(removeCandidate) : "Banner"}” çöp kutusuna taşınsın mı?`}
        description="Bu banner kaydettiğinizde website'den kaldırılır, ancak Çöp kutusu ekranından daha sonra geri yüklenebilir."
        confirmLabel="Çöp kutusuna taşı"
        destructive
        onClose={() => setRemoveCandidate(null)}
        onConfirm={() => {
          if (removeCandidate) moveToTrash(removeCandidate);
          setRemoveCandidate(null);
        }}
      />

      {editing && (
        <div
          className="admin-drawer-backdrop"
          role="presentation"
          onMouseDown={() => setEditing(null)}
        >
          <aside
            className="admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="slider-editor-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="admin-drawer-header">
              <div>
                <span className="admin-eyebrow">Banner düzenleme</span>
                <h2 id="slider-editor-title">{heroSlideTitle(editing)}</h2>
              </div>
              <button
                type="button"
                className="admin-icon-button"
                onClick={() => setEditing(null)}
                aria-label="Düzenlemeyi kapat"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="admin-drawer-body">
              <label className="admin-field">
                <span className="admin-field-label">Başlığın giriş kısmı</span>
                <input
                  className={inputClass}
                  value={editing.headline.pre}
                  onChange={(event) => updateHeadline("pre", event.target.value)}
                />
              </label>
              <label className="admin-field">
                <span className="admin-field-label">Vurgulanan başlık</span>
                <input
                  className={inputClass}
                  value={editing.headline.highlight}
                  onChange={(event) => updateHeadline("highlight", event.target.value)}
                />
                <span className="admin-field-hint">
                  Bu kısım website'de renkli olarak öne çıkarılır.
                </span>
              </label>
              <label className="admin-field">
                <span className="admin-field-label">Başlığın devamı</span>
                <input
                  className={inputClass}
                  value={editing.headline.post}
                  onChange={(event) => updateHeadline("post", event.target.value)}
                />
              </label>
              <label className="admin-field">
                <span className="admin-field-label">Kısa açıklama</span>
                <textarea
                  className={inputClass}
                  rows={5}
                  value={editing.subcopy}
                  onChange={(event) => updateEditing({ subcopy: event.target.value })}
                />
              </label>
              <div className="admin-drawer-grid">
                <label className="admin-field">
                  <span className="admin-field-label">Ana buton yazısı</span>
                  <input
                    className={inputClass}
                    value={editing.ctaPrimary}
                    onChange={(event) => updateEditing({ ctaPrimary: event.target.value })}
                  />
                </label>
                <LinkPicker
                  label="Ana buton nereye gitsin?"
                  value={editing.ctaPrimaryHref}
                  onChange={(next) => updateEditing({ ctaPrimaryHref: next })}
                />
                <label className="admin-field">
                  <span className="admin-field-label">İkinci buton yazısı</span>
                  <input
                    className={inputClass}
                    value={editing.ctaSecondary}
                    onChange={(event) => updateEditing({ ctaSecondary: event.target.value })}
                  />
                </label>
                <LinkPicker
                  label="İkinci buton nereye gitsin?"
                  value={editing.ctaSecondaryHref}
                  onChange={(next) => updateEditing({ ctaSecondaryHref: next })}
                />
              </div>
              <label className="admin-field">
                <span className="admin-field-label">Website görseli</span>
                <select
                  className={inputClass}
                  value={editing.imageKey}
                  onChange={(event) => updateEditing({ imageKey: event.target.value })}
                >
                  {mediaOptions.map((media) => (
                    <option value={media.key} key={media.key}>
                      {media.label}
                    </option>
                  ))}
                </select>
                <span className="admin-field-hint">
                  Seçili görselin üzerine yeni bir dosya yüklemek için aşağıdaki alanı kullanın.
                </span>
              </label>
              <ImageUpload
                key={editing.id}
                initialUrl={editing.imageUrl}
                initialPublicId={editing.imagePublicId}
                emitHiddenFields={false}
                onValueChange={(value) =>
                  updateEditing({ imageUrl: value.url, imagePublicId: value.publicId })
                }
                recommendedDimensions="1600 × 900 px"
              />
              {/*
                Uploaded photographs arrive with no description at all, so
                screen readers and search engines see nothing. This is the only
                place it can be written.
              */}
              <label className="admin-field">
                <span className="admin-field-label">Görsel açıklaması</span>
                <input
                  className={inputClass}
                  value={editing.alt}
                  onChange={(event) => updateEditing({ alt: event.target.value })}
                  placeholder="Fotoğrafta ne görünüyor?"
                />
                <span className="admin-field-hint">
                  Görme engelli ziyaretçiler ve arama motorları bu metni okur. Örnek: “Pakistan'da
                  iftar programında yemek dağıtan gönüllüler”.
                </span>
              </label>
              <label className="admin-switch-row">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(event) => {
                    if (event.target.checked && activeCount >= MAX_ACTIVE_HERO_SLIDES) {
                      setNotice(
                        `Aynı anda en fazla ${MAX_ACTIVE_HERO_SLIDES} banner yayınlanabilir.`,
                      );
                      return;
                    }
                    updateEditing({ active: event.target.checked });
                  }}
                />
                <span>
                  <strong>Website'de yayınla</strong>
                  <small>Gizli bannerlar düzenlenebilir ancak ziyaretçilere gösterilmez.</small>
                </span>
              </label>
            </div>
            <div className="admin-drawer-footer">
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={() => setEditing(null)}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="admin-button admin-button-primary"
                onClick={commitEditing}
              >
                <Check className="size-4" aria-hidden="true" /> Değişiklikleri uygula
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="admin-slider-add-row">
        <AdminButton variant="secondary" onClick={addSlide}>
          <Plus className="size-4" aria-hidden="true" /> Yeni banner ekle
        </AdminButton>
        <span>Her dil ayrı düzenlenir; üstteki dil seçimini kullanın.</span>
      </div>
    </>
  );
}
