import { Field, SelectInput, TextInput } from "@/components/app/Field";
import { SegmentedControl } from "@/components/app/SegmentedControl";
import { Tag } from "@/components/app/StatusPill";
import {
  ACCENT_PRESETS,
  ACCESS_PERIODS,
  BACKGROUND_PRESETS,
  DEFAULT_SETTINGS,
  ERROR_PREVIEWS,
  SCOPES,
  USE_CASES,
} from "../constants";
import { ColorField, RadioGroup, SettingGroup, Switch } from "./controls";

function Text({ label, hint, section, field, values, onChange, maxLength = 60 }) {
  return (
    <Field label={label} hint={hint} required>
      <TextInput
        value={values[field]}
        maxLength={maxLength}
        placeholder={DEFAULT_SETTINGS[section][field]}
        onChange={(e) => onChange({ [field]: e.target.value })}
      />
    </Field>
  );
}

/**
 * ScreenSettings - The controls for one panel item. Every control changes the
 * preview straight away; nothing reaches end users until "Publish changes".
 */
export function ScreenSettings({ id, settings, onChange, preview }) {
  const values = settings[id];
  const common = { section: id, values, onChange };
  const client = settings.consent.clientName?.trim() || "This app";

  switch (id) {
    case "appearance":
      return (
        <>
          <ColorField label="Background colour" value={values.background} presets={BACKGROUND_PRESETS} onChange={(v) => onChange({ background: v })} />
          <p className="-mt-3 text-[12.5px] leading-5 text-ink-muted">Shown behind Link when it opens inside your app.</p>
          <ColorField label="Button colour" value={values.accent} presets={ACCENT_PRESETS} onChange={(v) => onChange({ accent: v })} />
          <p className="-mt-3 text-[12.5px] leading-5 text-ink-muted">Used for the main button on every screen. Button text switches between white and black to stay readable.</p>
        </>
      );

    case "consent":
      return (
        <>
          <RadioGroup
            label="Header"
            value={values.header}
            onChange={(v) => onChange({ header: v })}
            options={[
              { value: "setl", label: "Setl-branded" },
              { value: "co", label: "Co-branded", hint: "Shows your name next to Setl at the top of every screen." },
            ]}
          />
          <Text
            label="Client name"
            hint="Shown wherever Link names your app. If it's empty, Link says “This app”."
            field="clientName"
            maxLength={30}
            {...common}
          />
          <Field label="Use case" hint={`Finishes the title: “${client} uses Setl to …”`} required>
            <SelectInput value={values.useCase} onChange={(e) => onChange({ useCase: e.target.value })}>
              {USE_CASES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Switch
            label="Ask for a mobile number"
            hint="Users who share their +92 number sign in to Setl with a one-time code next time."
            checked={values.askPhone}
            onChange={(v) => onChange({ askPhone: v })}
          />
          <Text label="Button" field="button" maxLength={24} {...common} />
        </>
      );

    case "otp":
      return (
        <>
          <RadioGroup
            label="Send the code by"
            value={values.channel}
            onChange={(v) => onChange({ channel: v })}
            options={[
              { value: "sms", label: "SMS" },
              { value: "whatsapp", label: "WhatsApp", hint: "Falls back to SMS if the number isn't on WhatsApp." },
            ]}
          />
          <SettingGroup title="Code length">
            <SegmentedControl
              label="Code length"
              value={String(values.length)}
              onChange={(v) => onChange({ length: Number(v) })}
              options={[
                { value: "4", label: "4 digits" },
                { value: "6", label: "6 digits" },
              ]}
            />
          </SettingGroup>
          <Field label="Wait before resending" required>
            <SelectInput value={values.resendSeconds} onChange={(e) => onChange({ resendSeconds: Number(e.target.value) })}>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
            </SelectInput>
          </Field>
        </>
      );

    case "institutionSelect":
      return (
        <>
          <Text label="Title" field="title" maxLength={40} {...common} />
          <RadioGroup
            label="Institutions to show"
            value={values.types}
            onChange={(v) => onChange({ types: v })}
            options={[
              { value: "all", label: "Banks and wallets (default)" },
              { value: "banks", label: "Banks only", hint: "Includes microfinance banks." },
              { value: "wallets", label: "Wallets only", hint: "JazzCash, Easypaisa, SadaPay, NayaPay." },
            ]}
          />
          <SettingGroup title="Layout">
            <SegmentedControl
              label="Layout"
              value={values.layout}
              onChange={(v) => onChange({ layout: v })}
              options={[
                { value: "grid", label: "Logo grid" },
                { value: "list", label: "List" },
              ]}
            />
          </SettingGroup>
          <p className="rounded-lg bg-sunken px-3 py-2.5 text-[12.5px] leading-5 text-ink-muted">
            Search on the next screen follows the same filter.
          </p>
        </>
      );

    case "institutionSearch":
      return (
        <>
          <Text label="Search placeholder" field="placeholder" maxLength={40} {...common} />
          <Switch
            label="Offer statement upload"
            hint="Shows “Can't find your bank? Upload a statement instead” under the results."
            checked={values.offerUpload}
            onChange={(v) => onChange({ offerUpload: v })}
          />
          <p className="rounded-lg bg-sunken px-3 py-2.5 text-[12.5px] leading-5 text-ink-muted">
            Type in the preview&apos;s search box to try it. “Allied”, “Islami” and “Microfinance” all return results.
          </p>
        </>
      );

    case "dataTransparency":
      return (
        <>
          <Text
            label="Why you need the data"
            hint={`Finishes the sentence “${client} uses this to …”`}
            field="purpose"
            maxLength={80}
            {...common}
          />
          <RadioGroup
            label="Access period"
            value={values.accessDays}
            onChange={(v) => onChange({ accessDays: Number(v) })}
            options={ACCESS_PERIODS}
          />
          <SettingGroup title="Requested scopes" hint="Change these with the Preview scopes buttons under the preview.">
            <div className="flex flex-wrap gap-1.5">
              {SCOPES.filter((s) => preview.scopes.includes(s.id)).map((s) => (
                <Tag key={s.id}>{s.scope}</Tag>
              ))}
            </div>
          </SettingGroup>
        </>
      );

    case "statementUpload":
      return (
        <>
          <Text label="Title" field="title" maxLength={40} {...common} />
          <Field label="Months of history to ask for" required>
            <SelectInput value={values.months} onChange={(e) => onChange({ months: Number(e.target.value) })}>
              <option value={1}>1 month</option>
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
            </SelectInput>
          </Field>
          <Switch
            label="Accept password-protected PDFs"
            hint="Many Pakistani banks lock e-statements. Link asks for the password after upload."
            checked={values.allowLocked}
            onChange={(v) => onChange({ allowLocked: v })}
          />
          <Switch
            label="Accept photos of statements"
            hint="JPG and PNG. Photos are read less reliably than the bank's PDF."
            checked={values.allowImages}
            onChange={(v) => onChange({ allowImages: v })}
          />
        </>
      );

    case "statementReview":
      return (
        <>
          <Switch
            label="Show latest transactions"
            hint="Lets users spot a wrong statement before they continue."
            checked={values.showTransactions}
            onChange={(v) => onChange({ showTransactions: v })}
          />
          <Text label="Button" field="button" maxLength={24} {...common} />
        </>
      );

    case "accountSelect":
      return (
        <>
          <p className="text-[13.5px] leading-[1.55] text-ink-muted">
            Users choose which accounts your app receives. You get no data from accounts they leave out.
          </p>
          <RadioGroup
            label="Selection options"
            value={values.mode}
            onChange={(v) => onChange({ mode: v })}
            options={[
              { value: "single", label: "Single select", hint: "Users pick exactly one account." },
              { value: "multi", label: "Multi select", hint: "Users pick one or more accounts." },
              { value: "all", label: "Require all", hint: "Every account at the institution is shared." },
            ]}
          />
        </>
      );

    case "success":
      return (
        <>
          <Text label="Title" field="title" maxLength={40} {...common} />
          <Text label="Button" field="button" maxLength={24} {...common} />
        </>
      );

    case "error":
      return (
        <>
          <RadioGroup label="Preview" value={preview.errorKind} onChange={preview.setErrorKind} options={ERROR_PREVIEWS} />
          <p className="-mt-3 text-[12.5px] leading-5 text-ink-muted">Preview only. Link picks the error that actually happened.</p>
          <Switch
            label="Offer statement upload as a fallback"
            hint="When bank sign-in isn't available, the main button becomes “Upload a statement instead”."
            checked={values.offerUpload}
            onChange={(v) => onChange({ offerUpload: v })}
          />
          <Field label="Support contact" hint="An email address or WhatsApp number. Leave empty to hide it.">
            <TextInput value={values.support} maxLength={60} onChange={(e) => onChange({ support: e.target.value })} />
          </Field>
        </>
      );

    case "exit":
      return (
        <>
          <Text label="Title" field="title" maxLength={40} {...common} />
          <Switch
            label="Ask why they're leaving"
            hint="Answers would appear in your exit reports. In this demo they aren't sent anywhere."
            checked={values.askReason}
            onChange={(v) => onChange({ askReason: v })}
          />
        </>
      );

    default:
      return null;
  }
}
