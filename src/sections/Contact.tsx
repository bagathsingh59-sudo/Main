"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { COMPANY } from "@/constants/company";
import { contactSchema, submitContact, type ContactInput } from "@/services/contact";
import { APIError } from "@/services/api";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { fadeUp, viewportOnce } from "@/animations/variants";
import type { ContactPayload } from "@/types";

const DEFAULT_SERVICES = [
  "Payroll & Statutory Compliance",
  "EPF & ESI Compliance",
  "GST Compliance",
  "Income Tax Advisory",
  "Labour Law Compliance",
  "Virtual CFO Advisory",
  "Audit & Assurance",
  "Full Compliance Suite",
];

const DEFAULT_SIZES = ["1-10", "11-50", "51-250", "250+"];

interface ContactProps {
  /** Service dropdown options. Falls back to defaults when not provided. */
  services?: readonly string[];
  /** Company-size brackets. Falls back to defaults when not provided. */
  sizes?: readonly string[];
  /** Admin-edited contact info — overrides COMPANY constant when set. */
  contactInfo?: {
    phone: string;
    altPhone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pin: string;
    hours: string;
    mapEmbedUrl?: string;
  };
  /** When set, replaces the form with a maintenance card. */
  maintenanceMessage?: string;
}

export function Contact({ services, sizes, contactInfo, maintenanceMessage }: ContactProps = {}) {
  const SERVICES = services && services.length > 0 ? services : DEFAULT_SERVICES;
  const SIZES = sizes && sizes.length > 0 ? sizes : DEFAULT_SIZES;

  // Contact display — prefer admin-edited, fall back to COMPANY constant.
  const ci = {
    phone: contactInfo?.phone || COMPANY.contact.phone,
    altPhone: contactInfo?.altPhone || COMPANY.contact.altPhone,
    email: contactInfo?.email || COMPANY.contact.email,
    addressLine1: contactInfo?.addressLine1 || COMPANY.contact.address.line1,
    addressLine2: contactInfo?.addressLine2 || COMPANY.contact.address.line2,
    city: contactInfo?.city || COMPANY.contact.address.city,
    state: contactInfo?.state || COMPANY.contact.address.state,
    pin: contactInfo?.pin || COMPANY.contact.address.pin,
    hours: contactInfo?.hours || COMPANY.contact.hours,
  };

  const initial: ContactInput = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    companySize: (SIZES.includes("11-50") ? "11-50" : SIZES[0]) as ContactInput["companySize"],
    service: SERVICES[0],
    message: "",
  };

  const [data, setData] = useState<ContactInput>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "throttled">("idle");
  const [throttleMessage, setThrottleMessage] = useState<string | null>(null);

  const update = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }
    try {
      await submitContact(parsed.data as ContactPayload);
      setStatus("success");
      setData(initial);
    } catch (err) {
      if (err instanceof APIError && err.status === 429) {
        setThrottleMessage(err.message);
        setStatus("throttled");
      } else {
        setStatus("error");
      }
    }
  };

  return (
    <SectionLayout id="contact" className="bg-cloud">
      <SectionHeader
        eyebrow="Get in touch"
        title={
          <>
            Start your compliance <em className="not-italic text-navy-600">conversation.</em>
          </>
        }
        description="Send a note and a senior consultant will reply within one working day. Every email is read by a human."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col gap-4"
        >
          <ContactItem icon="MapPin" title="Head office">
            <div>{ci.addressLine1}</div>
            <div>{ci.addressLine2}</div>
            <div>
              {ci.city}, {ci.state} {ci.pin}
            </div>
          </ContactItem>
          <ContactItem icon="Phone" title="Phone">
            <a href={`tel:${ci.phone.replace(/\s/g, "")}`} className="hover:text-navy-600">
              {ci.phone}
            </a>
            <div className="text-[0.82rem] text-navy-900/55">Also on {ci.altPhone}</div>
          </ContactItem>
          <ContactItem icon="Mail" title="Email">
            <a href={`mailto:${ci.email}`} className="hover:text-navy-600">
              {ci.email}
            </a>
            <div className="text-[0.82rem] text-navy-900/55">Replies within one working day</div>
          </ContactItem>
          <ContactItem icon="Clock" title="Working hours">
            <div>{ci.hours}</div>
            <div className="text-[0.82rem] text-navy-900/55">Branches: {COMPANY.contact.branches.join(" · ")}</div>
          </ContactItem>
        </motion.div>

        {maintenanceMessage ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={1}
            className="flex flex-col items-start gap-5 rounded-3xl border-2 border-amber-200 bg-amber-50/80 p-7 shadow-elevated sm:p-9"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-xl font-bold text-white shadow-glow">
              !
            </div>
            <div>
              <div className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-amber-700">
                Forms briefly offline
              </div>
              <h3 className="mt-2 text-[1.4rem] font-bold leading-tight text-amber-950">
                We&apos;re doing scheduled maintenance.
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-amber-950/85">{maintenanceMessage}</p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <a
                href={`tel:${ci.phone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-[0.92rem] font-semibold text-white shadow-md hover:bg-amber-700"
              >
                📞 {ci.phone}
              </a>
              <a
                href={`mailto:${ci.email}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-3 text-[0.92rem] font-semibold text-amber-900 hover:bg-amber-50"
              >
                ✉ {ci.email}
              </a>
            </div>
          </motion.div>
        ) : (
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={1}
          onSubmit={onSubmit}
          className="rounded-3xl border border-white/70 bg-white/65 p-7 shadow-elevated backdrop-blur-xl sm:p-9"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" value={data.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} required />
            <Input label="Last name" value={data.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} required />
          </div>
          <Input
            className="mt-4"
            label="Business email"
            type="email"
            value={data.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
            placeholder="name@company.com"
            required
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Phone" value={data.phone ?? ""} onChange={(v) => update("phone", v)} error={errors.phone} placeholder="+91" />
            <Input label="Company" value={data.company ?? ""} onChange={(v) => update("company", v)} error={errors.company} />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select label="Company size" value={data.companySize} onChange={(v) => update("companySize", v as ContactInput["companySize"])}>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} employees
                </option>
              ))}
            </Select>
            <Select label="Service needed" value={data.service} onChange={(v) => update("service", v)}>
              {SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>

          <Textarea
            className="mt-4"
            label="Message"
            value={data.message}
            onChange={(v) => update("message", v)}
            error={errors.message}
            placeholder="A short note on what you'd like help with…"
            required
          />

          <Button type="submit" className="mt-7 w-full" size="lg" disabled={status === "submitting"}>
            {status === "submitting"
              ? "Sending…"
              : status === "success"
                ? "✓ Sent — we'll reply within 1 working day"
                : status === "throttled"
                  ? "Try again in a moment"
                  : "Send message →"}
          </Button>
          {status === "throttled" && throttleMessage && (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-center text-[0.82rem] text-amber-900">
              {throttleMessage}
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-center text-[0.82rem] text-rose-600">
              Couldn't send — please email {COMPANY.contact.email}.
            </p>
          )}
        </motion.form>
        )}
      </div>

      {/* Lazy-loaded Google Maps embed — renders nothing when the admin
          hasn't pasted a URL into /admin/contact-info → "Google Maps embed". */}
      {contactInfo?.mapEmbedUrl && (
        <div className="mt-14">
          <div className="mb-4 text-center">
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-navy-600/70">
              Find us
            </div>
            <h3 className="mt-2 text-display-md font-display text-navy-900">
              {ci.addressLine1}
            </h3>
            <p className="mt-1 text-[0.95rem] text-navy-900/65">
              {ci.addressLine2}, {ci.city} {ci.pin}
            </p>
          </div>
          <MapEmbed url={contactInfo.mapEmbedUrl} title={`${ci.addressLine1} — map`} />
        </div>
      )}
    </SectionLayout>
  );
}

function ContactItem({
  icon,
  title,
  children,
}: {
  icon: React.ComponentProps<typeof Icon>["name"];
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/70 bg-white/65 p-5 shadow-soft backdrop-blur-xl">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
        <Icon name={icon} size={18} />
      </div>
      <div>
        <div className="text-[0.95rem] font-bold text-navy-900">{title}</div>
        <div className="mt-1 text-[0.88rem] leading-[1.6] text-navy-900/65">{children}</div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

function Input({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required,
  className,
}: FieldProps & { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-[0.78rem] font-semibold text-navy-900">{label}{required && " *"}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`block w-full rounded-xl border bg-white/85 px-4 py-3 text-[0.92rem] text-navy-900 outline-none transition-colors ${
          error ? "border-rose-400" : "border-navy-900/10 focus:border-navy-600"
        }`}
      />
      {error && <span className="mt-1 block text-[0.75rem] text-rose-600">{error}</span>}
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  className,
}: FieldProps & { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-[0.78rem] font-semibold text-navy-900">{label}{required && " *"}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className={`block w-full resize-y rounded-xl border bg-white/85 px-4 py-3 text-[0.92rem] text-navy-900 outline-none transition-colors ${
          error ? "border-rose-400" : "border-navy-900/10 focus:border-navy-600"
        }`}
      />
      {error && <span className="mt-1 block text-[0.75rem] text-rose-600">{error}</span>}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: FieldProps & { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.78rem] font-semibold text-navy-900">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block h-12 w-full rounded-xl border border-navy-900/10 bg-white/85 px-4 text-[0.92rem] text-navy-900 outline-none transition-colors focus:border-navy-600"
      >
        {children}
      </select>
    </label>
  );
}
