import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { packages, ticketOptions } from "../lib/data";

const baseState = {
  buyer_name: "",
  owner_name: "",
  business_name: "",
  company_name: "",
  act_name: "",
  contact_name: "",
  email: "",
  phone: "",
  notes: "",
};

const formConfig = {
  ticket: {
    title: "Buy Tickets",
    table: "tickets",
    success: "Ticket order saved. Complete payment when payment links are connected.",
    fields: [
      ["buyer_name", "Buyer Name", "text"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["ticket_type", "Ticket Type", "select", ticketOptions.map((item) => item.name)],
      ["quantity", "Quantity", "number"],
    ],
    buildPayload: (values) => {
      const selected = ticketOptions.find((item) => item.name === values.ticket_type) || ticketOptions[0];
      const quantity = Math.max(Number(values.quantity || 1), 1);
      return {
        buyer_name: values.buyer_name,
        email: values.email,
        phone: values.phone,
        ticket_type: values.ticket_type,
        quantity,
        total_amount: selected.amount * quantity,
        payment_status: "pending",
        order_status: "new",
      };
    },
  },
  car: {
    title: "Register Car",
    table: "car_registrations",
    success: "Car registration saved. The team will review and follow up.",
    fields: [
      ["owner_name", "Owner Name", "text"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["state", "State", "select", ["NC", "SC"]],
      ["car_year", "Car Year", "number"],
      ["make", "Make", "text"],
      ["model", "Model", "text"],
      ["category", "Category", "select", ["Classic", "Custom", "Exotic", "Import", "Domestic", "Truck", "Motorcycle", "Other"]],
      ["image_url", "Image URL", "url"],
      ["notes", "Notes", "textarea"],
    ],
    buildPayload: (values) => ({
      owner_name: values.owner_name,
      email: values.email,
      phone: values.phone,
      state: values.state,
      car_year: values.car_year ? Number(values.car_year) : null,
      make: values.make,
      model: values.model,
      category: values.category,
      image_url: values.image_url,
      payment_status: "pending",
      approval_status: "pending",
      notes: values.notes,
    }),
  },
  vendor: {
    title: "Vendor Signup",
    table: "vendors",
    success: "Vendor signup saved. The team will review your booth request.",
    fields: [
      ["business_name", "Business Name", "text"],
      ["contact_name", "Contact Name", "text"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["vendor_type", "Vendor Type", "select", ["Food Truck", "Merch", "Auto", "Beauty", "Lifestyle", "Service", "Other"]],
      ["booth_size", "Booth Size", "select", ["10x10", "10x20", "Food Truck", "Custom"]],
      ["power_needed", "Power Needed", "select", ["No", "Yes"]],
      ["notes", "Notes", "textarea"],
    ],
    buildPayload: (values) => ({
      business_name: values.business_name,
      contact_name: values.contact_name,
      email: values.email,
      phone: values.phone,
      vendor_type: values.vendor_type,
      booth_size: values.booth_size,
      power_needed: values.power_needed === "Yes",
      payment_status: "pending",
      approval_status: "pending",
      notes: values.notes,
    }),
  },
  sponsor: {
    title: "Sponsor Inquiry",
    table: "sponsors",
    success: "Sponsor inquiry saved. The sponsor team will follow up shortly.",
    fields: [
      ["company_name", "Company Name", "text"],
      ["contact_name", "Contact Name", "text"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["sponsorship_level", "Sponsorship Level", "select", packages.map((item) => item.name)],
      ["logo_url", "Logo URL", "url"],
      ["notes", "Notes", "textarea"],
    ],
    buildPayload: (values) => ({
      company_name: values.company_name,
      contact_name: values.contact_name,
      email: values.email,
      phone: values.phone,
      sponsorship_level: values.sponsorship_level,
      logo_url: values.logo_url,
      payment_status: "pending",
      approval_status: "pending",
      notes: values.notes,
    }),
  },
  entertainment: {
    title: "DJ/Band/Entertainment Signup",
    table: "entertainment",
    success: "Entertainment signup saved. The booking team will review the act.",
    fields: [
      ["act_name", "Act Name", "text"],
      ["contact_name", "Contact Name", "text"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["type", "Type", "select", ["DJ", "Band", "Model", "Host", "Performer"]],
      ["social_link", "Social Link", "url"],
      ["notes", "Notes", "textarea"],
    ],
    buildPayload: (values) => ({
      act_name: values.act_name,
      contact_name: values.contact_name,
      email: values.email,
      phone: values.phone,
      type: values.type,
      social_link: values.social_link,
      approval_status: "pending",
      notes: values.notes,
    }),
  },
};

export default function FormModal({ type, defaults = {}, onClose }) {
  const config = formConfig[type];
  const initialValues = useMemo(() => {
    const values = { ...baseState, quantity: 1, ...defaults };
    config.fields.forEach(([key, , , options]) => {
      if (!values[key] && options?.length) values[key] = options[0];
    });
    return values;
  }, [config.fields, defaults]);
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const paymentLink = useMemo(() => {
    if (type === "ticket") {
      const selected = ticketOptions.find((item) => item.name === values.ticket_type) || ticketOptions[0];
      return import.meta.env[selected.envKey] || "";
    }
    const links = {
      car: import.meta.env.VITE_STRIPE_CAR_REGISTRATION_URL,
      vendor: import.meta.env.VITE_STRIPE_VENDOR_URL,
      sponsor: import.meta.env.VITE_STRIPE_SPONSOR_URL,
    };
    return links[type] || "";
  }, [type, values.ticket_type]);

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to save forms.");
      return;
    }

    const payload = config.buildPayload(values);
    const { error } = await supabase.from(config.table).insert(payload);
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage(config.success);
  };

  if (!config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950 shadow-[0_0_80px_rgba(0,109,255,.25)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">Carolina Classics</p>
            <h3 className="text-2xl font-black uppercase">{config.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 p-2 text-zinc-300 hover:border-white/30 hover:text-white" aria-label="Close form">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-5 md:grid-cols-2">
          {config.fields.map(([key, label, inputType, options]) => (
            <div key={key} className={inputType === "textarea" ? "md:col-span-2" : ""}>
              <label className="label" htmlFor={key}>{label}</label>
              {inputType === "select" ? (
                <select id={key} className="field" value={values[key] || ""} onChange={(event) => update(key, event.target.value)} required>
                  {options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : inputType === "textarea" ? (
                <textarea id={key} className="field min-h-28 resize-y" value={values[key] || ""} onChange={(event) => update(key, event.target.value)} />
              ) : (
                <input id={key} className="field" type={inputType} min={inputType === "number" ? 1 : undefined} value={values[key] || ""} onChange={(event) => update(key, event.target.value)} required={!["image_url", "logo_url", "notes", "social_link"].includes(key)} />
              )}
            </div>
          ))}

          {type === "ticket" && (
            <div className="md:col-span-2 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
              <div className="text-sm font-black uppercase tracking-wider text-yellow-200">
                Estimated Total: ${((ticketOptions.find((item) => item.name === values.ticket_type)?.amount || 0) * Number(values.quantity || 1)).toLocaleString()}
              </div>
            </div>
          )}

          {message && (
            <div className={`md:col-span-2 flex items-start gap-3 rounded-2xl border p-4 text-sm ${status === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-red-400/30 bg-red-500/10 text-red-100"}`}>
              {status === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message}</span>
            </div>
          )}

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={status === "loading"} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 px-6 py-4 font-black uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60">
              {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : null}
              Save Entry
            </button>
            <button
              type="button"
              onClick={() => {
                // Payment integration point: replace/open this link with Stripe Checkout, Square, Eventbrite, or processor-specific checkout creation.
                if (paymentLink) window.open(paymentLink, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-yellow-300/60 px-6 py-4 font-black uppercase tracking-wide text-yellow-200"
            >
              Pay Now <ExternalLink size={18} />
            </button>
          </div>

          <p className="md:col-span-2 text-xs text-zinc-500">
            Payment placeholder: replace this button with Stripe Checkout, Square, Eventbrite, or static payment links after the processor is selected.
          </p>
        </form>
      </div>
    </div>
  );
}
