"use client";

import { useState } from "react";
import { useI18n } from "@/app/components/LanguageProvider";
import {
  Field,
  Honeypot,
  SentPanel,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/app/components/FormFields";
import {
  composeMailto,
  contactSchema,
  fieldErrors,
  type SubmitState,
} from "@/lib/forms";

const empty = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  companyWebsite: "",
};

export function ContactForm() {
  const { t } = useI18n();
  const f = t.forms;
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [draft, setDraft] = useState("");

  function set(field: keyof typeof empty, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as it is touched: keeping it on screen while
    // the reader is fixing it just adds noise.
    if (errors[field]) {
      setErrors(({ [field]: _cleared, ...rest }) => rest);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});

    const url = composeMailto({
      to: t.utility.email,
      // Subject line the association will see in its inbox.
      subject: `[IHBA] ${parsed.data.subject}`,
      lines: [
        { label: f.fullName, value: parsed.data.fullName },
        { label: f.email, value: parsed.data.email },
        { label: f.phone, value: parsed.data.phone ?? "" },
      ],
      bodyLabel: f.message,
      body: parsed.data.message,
    });

    setDraft(url);
    setState("sent");

    /*
      Hands the draft to whatever the reader uses for mail. The answers stay in
      state rather than being cleared: if nothing opens — no handler registered,
      a blocked navigation — the panel can offer the draft again instead of
      having quietly thrown the message away.
    */
    window.location.href = url;
  }

  if (state === "sent") {
    return (
      <SentPanel
        title={f.sentTitle}
        body={f.sentBody}
        hint={f.mailHint}
        again={f.mailOpenAgain}
        href={draft}
      />
    );
  }

  const message = (field: string) =>
    errors[field] ? f.errors[errors[field] as keyof typeof f.errors] : undefined;

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

        <Field id="subject" label={f.subject} error={message("subject")}>
          <TextInput
            id="subject"
            value={values.subject}
            error={Boolean(errors.subject)}
            onChange={(event) => set("subject", event.target.value)}
          />
        </Field>
      </div>

      <Field id="message" label={f.message} error={message("message")}>
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

      <div className="flex flex-wrap items-center gap-5 border-t border-navy-ink/15 pt-6">
        <SubmitButton>{f.send}</SubmitButton>
        <p className="text-xs leading-relaxed text-ink/50">{f.privacy}</p>
      </div>
    </form>
  );
}
