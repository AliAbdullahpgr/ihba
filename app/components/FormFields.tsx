"use client";

import { AlertCircle, Check, Loader2, Mail } from "lucide-react";
import { Button } from "@/app/components/primitives";

/*
  Form controls in the site's own idiom: square, hairline-bounded, no pills and
  no shadows. The one concession to convention is a 44px minimum height on every
  control, which is the smallest target a thumb reliably hits.
*/

const controlClasses =
  "block w-full min-h-11 border border-navy-ink/25 bg-white px-3.5 py-2.5 text-base text-navy-ink transition-colors placeholder:text-ink/35 hover:border-navy-ink/45 focus:border-navy-ink focus:outline-none focus:ring-2 focus:ring-azure/40 disabled:bg-mist/40 disabled:text-ink/40";

const invalidClasses = "border-gold-deep hover:border-gold-deep";

/** Label, control and error message as one block. */
export function Field({
  id,
  label,
  error,
  optionalLabel,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="eyebrow mb-2 flex items-baseline gap-2 text-ink/60"
      >
        {label}
        {optionalLabel && (
          <span className="font-semibold normal-case tracking-normal text-ink/35">
            {optionalLabel}
          </span>
        )}
      </label>

      {children}

      {error && (
        // role=alert so the message is announced the moment it appears, rather
        // than only being visible to whoever is looking at that field.
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-gold-deep"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  id,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; error?: boolean }) {
  return (
    <input
      id={id}
      name={id}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${controlClasses} ${error ? invalidClasses : ""}`}
      {...props}
    />
  );
}

export function TextArea({
  id,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  error?: boolean;
}) {
  return (
    <textarea
      id={id}
      name={id}
      rows={6}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${controlClasses} resize-y leading-relaxed ${error ? invalidClasses : ""}`}
      {...props}
    />
  );
}

export function SelectField({
  id,
  error,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  error?: boolean;
  options: string[];
}) {
  return (
    <select
      id={id}
      name={id}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${controlClasses} ${error ? invalidClasses : ""}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

/** Consent checkbox. Square, and large enough to hit without aiming. */
export function Consent({
  id,
  label,
  error,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  error?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/75"
      >
        {/*
          The native tick is drawn with the browser's own rounding and blue, so
          it is replaced: an appearance-none square with the site's check laid
          over it, still driven by a real checkbox underneath.
        */}
        <span className="relative mt-0.5 grid shrink-0 place-items-center">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`h-5 w-5 appearance-none border bg-white transition-colors checked:border-navy-ink checked:bg-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure ${
              error ? "border-gold-deep" : "border-navy-ink/35"
            }`}
          />
          {checked && (
            <Check
              className="pointer-events-none absolute h-3.5 w-3.5 text-white"
              aria-hidden="true"
            />
          )}
        </span>
        {label}
      </label>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-gold-deep"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * The honeypot. Hidden from sight, from screen readers and from the tab order,
 * so only an automated filler ever reaches it.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="sr-only">
      <label htmlFor="companyWebsite">Company website</label>
      <input
        id="companyWebsite"
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function SubmitButton({
  sending,
  children,
  sendingLabel,
}: {
  sending: boolean;
  children: React.ReactNode;
  sendingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={sending}
      className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:opacity-60"
    >
      {sending && (
        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      )}
      {sending ? sendingLabel : children}
    </button>
  );
}

/**
 * What stands in for a form when no delivery endpoint is configured. Rendering
 * the fields anyway would be a lie — the reader would fill them in and hear
 * nothing back — so the email route is offered instead.
 */
export function MailFallback({ note, email }: { note: string; email: string }) {
  return (
    <div className="border-l-2 border-gold pl-5">
      <p className="text-sm leading-relaxed text-ink/70">{note}</p>
      <Button href={`mailto:${email}`} className="mt-6">
        <Mail className="h-4 w-4" aria-hidden="true" />
        {email}
      </Button>
    </div>
  );
}

/** Post-submit outcome, announced rather than merely shown. */
export function StatusPanel({
  tone,
  title,
  body,
}: {
  tone: "sent" | "error";
  title: string;
  body: string;
}) {
  return (
    <div
      role="status"
      className={`border-l-2 p-5 ${
        tone === "sent"
          ? "border-azure-deep bg-azure-mist"
          : "border-gold-deep bg-gold-mist"
      }`}
    >
      <p className="flex items-center gap-2 font-display text-base font-medium text-navy-ink">
        {tone === "sent" ? (
          <Check className="h-4 w-4 shrink-0 text-azure-deep" aria-hidden="true" />
        ) : (
          <AlertCircle className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
        )}
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
    </div>
  );
}
