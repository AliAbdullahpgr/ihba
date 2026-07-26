"use client";

import { useState } from "react";
import { useI18n } from "@/app/components/LanguageProvider";
import {
  Consent,
  Field,
  Honeypot,
  MailFallback,
  SelectField,
  StatusPanel,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/app/components/FormFields";
import {
  FORM_ENDPOINT,
  fieldErrors,
  submitForm,
  volunteerSchema,
  type SubmitState,
} from "@/lib/forms";

const empty = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  areaOfInterest: "",
  availability: "",
  message: "",
  consent: false,
  companyWebsite: "",
};

export function VolunteerForm() {
  const { t } = useI18n();
  const f = t.forms;
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<SubmitState>("idle");

  if (!FORM_ENDPOINT) {
    return <MailFallback note={f.unavailable} email={t.utility.email} />;
  }

  function set(field: keyof typeof empty, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors(({ [field]: _cleared, ...rest }) => rest);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = volunteerSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setState("idle");
      return;
    }

    setErrors({});
    setState("sending");

    // The honeypot has done its job by now; it does not belong in the inbox.
    const { companyWebsite: _bait, ...payload } = parsed.data;

    const ok = await submitForm({
      form: "volunteer",
      ...payload,
      _subject: `[IHBA] ${f.volunteerSubject} — ${parsed.data.fullName}`,
    });

    setState(ok ? "sent" : "error");
    if (ok) setValues(empty);
  }

  if (state === "sent") {
    return (
      <StatusPanel tone="sent" title={f.sentTitle} body={f.volunteerSentBody} />
    );
  }

  const message = (field: string) =>
    errors[field] ? f.errors[errors[field] as keyof typeof f.errors] : undefined;

  /*
    The areas of interest are the same seven fields the association publishes on
    /areas-of-work, read straight from that copy so the two can never drift.
    A "no preference" option leads, because insisting on a choice turns away
    the volunteer who is simply willing to help.
  */
  const areas = [f.selectPrompt, f.noPreference, ...t.volunteerPage.areas];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="fullName" label={f.fullName} error={message("fullName")}>
          <TextInput
            id="fullName"
            autoComplete="name"
            value={values.fullName}
            error={Boolean(errors.fullName)}
            onChange={(event) => set("fullName", event.target.value)}
          />
        </Field>

        <Field id="email" label={f.email} error={message("email")}>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            error={Boolean(errors.email)}
            onChange={(event) => set("email", event.target.value)}
          />
        </Field>

        <Field
          id="phone"
          label={f.phone}
          optionalLabel={f.optional}
          error={message("phone")}
        >
          <TextInput
            id="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            error={Boolean(errors.phone)}
            onChange={(event) => set("phone", event.target.value)}
          />
        </Field>

        <Field id="city" label={f.city} error={message("city")}>
          <TextInput
            id="city"
            autoComplete="address-level2"
            value={values.city}
            error={Boolean(errors.city)}
            onChange={(event) => set("city", event.target.value)}
          />
        </Field>

        <Field
          id="areaOfInterest"
          label={f.areaOfInterest}
          error={message("areaOfInterest")}
        >
          <SelectField
            id="areaOfInterest"
            options={areas}
            /* The prompt is the empty value, so the schema rejects a non-choice. */
            value={values.areaOfInterest || f.selectPrompt}
            error={Boolean(errors.areaOfInterest)}
            onChange={(event) =>
              set(
                "areaOfInterest",
                event.target.value === f.selectPrompt ? "" : event.target.value
              )
            }
          />
        </Field>

        <Field
          id="availability"
          label={f.availability}
          error={message("availability")}
        >
          <TextInput
            id="availability"
            placeholder={f.availabilityHint}
            value={values.availability}
            error={Boolean(errors.availability)}
            onChange={(event) => set("availability", event.target.value)}
          />
        </Field>
      </div>

      <Field id="message" label={f.motivation} error={message("message")}>
        <TextArea
          id="message"
          value={values.message}
          error={Boolean(errors.message)}
          onChange={(event) => set("message", event.target.value)}
        />
      </Field>

      <Honeypot
        value={values.companyWebsite}
        onChange={(value) => set("companyWebsite", value)}
      />

      <div className="border-t border-navy-ink/15 pt-6">
        <Consent
          id="consent"
          label={f.consent}
          checked={values.consent}
          error={message("consent")}
          onChange={(checked) => set("consent", checked)}
        />
      </div>

      {state === "error" && (
        <StatusPanel tone="error" title={f.errorTitle} body={f.errorBody} />
      )}

      <div className="flex flex-wrap items-center gap-5">
        <SubmitButton sending={state === "sending"} sendingLabel={f.sending}>
          {f.apply}
        </SubmitButton>
        <p className="text-xs leading-relaxed text-ink/50">{f.privacy}</p>
      </div>
    </form>
  );
}
