import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, LogOut, RefreshCw, Search, ShieldCheck, Trash2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { packages } from "../lib/data";

const tables = {
  tickets: {
    label: "Tickets",
    table: "tickets",
    search: ["buyer_name", "email", "phone", "ticket_type", "order_status", "payment_status"],
    filters: ["payment_status", "order_status", "ticket_type"],
    columns: ["buyer_name", "email", "phone", "ticket_type", "quantity", "total_amount", "payment_status", "order_status", "created_at"],
    editable: ["payment_status", "order_status", "notes"],
  },
  cars: {
    label: "Car Registrations",
    table: "car_registrations",
    search: ["owner_name", "email", "phone", "state", "make", "model", "category", "approval_status", "payment_status"],
    filters: ["state", "category", "approval_status", "payment_status"],
    columns: ["owner_name", "state", "car_year", "make", "model", "category", "payment_status", "approval_status", "created_at"],
    editable: ["payment_status", "approval_status", "notes"],
  },
  vendors: {
    label: "Vendors",
    table: "vendors",
    search: ["business_name", "contact_name", "email", "vendor_type", "booth_size", "approval_status", "payment_status"],
    filters: ["vendor_type", "booth_size", "approval_status", "payment_status"],
    columns: ["business_name", "contact_name", "email", "vendor_type", "booth_size", "power_needed", "payment_status", "approval_status", "created_at"],
    editable: ["payment_status", "approval_status", "notes"],
  },
  sponsors: {
    label: "Sponsors",
    table: "sponsors",
    search: ["company_name", "contact_name", "email", "sponsorship_level", "approval_status", "payment_status"],
    filters: ["sponsorship_level", "approval_status", "payment_status"],
    columns: ["company_name", "contact_name", "email", "sponsorship_level", "payment_status", "approval_status", "created_at"],
    editable: ["payment_status", "approval_status", "notes"],
  },
  entertainment: {
    label: "Entertainment",
    table: "entertainment",
    search: ["act_name", "contact_name", "email", "type", "approval_status"],
    filters: ["type", "approval_status"],
    columns: ["act_name", "contact_name", "email", "phone", "type", "social_link", "approval_status", "created_at"],
    editable: ["approval_status", "notes"],
  },
};

const paymentStatuses = ["pending", "paid", "failed", "refunded"];
const approvalStatuses = ["pending", "approved", "declined", "waitlist"];
const orderStatuses = ["new", "confirmed", "cancelled", "refunded"];

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(() => sessionStorage.getItem("cc-admin") === "true");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("tickets");
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [error, setError] = useState("");

  const allRows = useMemo(() => Object.values(records).flat(), [records]);
  const config = tables[active] || null;
  const rows = useMemo(() => (config ? records[active] || [] : []), [active, config, records]);

  useEffect(() => {
    if (authorized) loadAll();
  }, [authorized]);

  const login = (event) => {
    event.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASSWORD || "admin";
    if (password === expected) {
      sessionStorage.setItem("cc-admin", "true");
      setAuthorized(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");
    if (!isSupabaseConfigured) {
      setError("Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }

    const entries = await Promise.all(
      Object.entries(tables).map(async ([key, item]) => {
        const { data, error: tableError } = await supabase.from(item.table).select("*").order("created_at", { ascending: false });
        if (tableError) throw tableError;
        return [key, data || []];
      }),
    ).catch((loadError) => {
      setError(loadError.message);
      return [];
    });

    setRecords(Object.fromEntries(entries));
    setLoading(false);
  };

  const updateRecord = async (id, changes) => {
    const { error: updateError } = await supabase.from(config.table).update(changes).eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRecords((current) => ({
      ...current,
      [active]: (current[active] || []).map((row) => (row.id === id ? { ...row, ...changes } : row)),
    }));
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    const { error: deleteError } = await supabase.from(config.table).delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setRecords((current) => ({ ...current, [active]: (current[active] || []).filter((row) => row.id !== id) }));
  };

  const filteredRows = config ? rows.filter((row) => {
    const textMatch = !query || config.search.some((field) => String(row[field] || "").toLowerCase().includes(query.toLowerCase()));
    const filterMatch = !filterField || !filterValue || String(row[filterField] ?? "") === filterValue;
    return textMatch && filterMatch;
  }) : [];

  const filterOptions = useMemo(() => {
    if (!filterField) return [];
    return [...new Set(rows.map((row) => row[filterField]).filter((value) => value !== null && value !== undefined && value !== ""))];
  }, [filterField, rows]);

  const metrics = useMemo(() => {
    const tickets = records.tickets || [];
    const cars = records.cars || [];
    const sponsors = records.sponsors || [];
    const vendors = records.vendors || [];
    const entertainment = records.entertainment || [];
    const paidTickets = tickets.filter((row) => row.payment_status === "paid");
    const paidSponsors = sponsors.filter((row) => row.payment_status === "paid");
    const sponsorRevenue = paidSponsors.reduce((sum, row) => sum + (packages.find((item) => item.name === row.sponsorship_level)?.amount || 0), 0);
    const pending = [...cars, ...vendors, ...sponsors, ...entertainment].filter((row) => row.approval_status === "pending").length;
    const nc = cars.filter((row) => row.state === "NC").length;
    const sc = cars.filter((row) => row.state === "SC").length;

    return {
      ticketsSold: tickets.reduce((sum, row) => sum + Number(row.quantity || 0), 0),
      ticketRevenue: paidTickets.reduce((sum, row) => sum + Number(row.total_amount || 0), 0),
      totalSponsors: sponsors.length,
      sponsorRevenue,
      carRegistrations: cars.length,
      nc,
      sc,
      vendors: vendors.length,
      pending,
    };
  }, [records]);

  const exportCsv = () => {
    const headers = ["id", ...config.columns, "notes"];
    const csvRows = [
      headers.join(","),
      ...filteredRows.map((row) => headers.map((field) => `"${String(row[field] ?? "").replaceAll('"', '""')}"`).join(",")),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.table}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-[0_0_70px_rgba(0,109,255,.2)]">
          <ShieldCheck className="mb-5 h-10 w-10 text-yellow-300" />
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">Admin Access</p>
          <h1 className="premium-heading mt-2 text-3xl font-black uppercase">Command Center</h1>
          <p className="mt-3 text-sm text-zinc-400">Simple MVP password protection. Move to Supabase Auth before handling live payments or sensitive data.</p>
          <label className="label mt-6" htmlFor="password">Password</label>
          <input id="password" type="password" className="field" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 px-6 py-4 font-black uppercase tracking-wide">Enter Dashboard</button>
          <Link to="/" className="mt-5 block text-center text-sm font-bold text-zinc-400 hover:text-white">Back to public site</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(0,109,255,.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,31,61,.22),transparent_30%),#050505] px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">Carolina Classics</p>
            <h1 className="premium-heading mt-2 text-4xl font-black uppercase">Admin Command Center</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide hover:bg-white/10">Public Site</Link>
            <button onClick={loadAll} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide hover:bg-white/10"><RefreshCw size={16} /> Refresh</button>
            <button onClick={() => { sessionStorage.removeItem("cc-admin"); setAuthorized(false); }} className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 px-4 py-3 text-sm font-black uppercase tracking-wide text-red-200 hover:bg-red-500/10"><LogOut size={16} /> Exit</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {error && <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-100">{error}</div>}

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="Tickets Sold" value={metrics.ticketsSold} accent="text-blue-300" />
          <Metric title="Ticket Revenue" value={`$${metrics.ticketRevenue.toLocaleString()}`} accent="text-emerald-300" />
          <Metric title="Sponsors" value={metrics.totalSponsors} accent="text-yellow-300" />
          <Metric title="Sponsor Revenue" value={`$${metrics.sponsorRevenue.toLocaleString()}`} accent="text-emerald-300" />
          <Metric title="Car Registrations" value={metrics.carRegistrations} accent="text-white" />
          <Metric title="NC vs SC" value={`${metrics.nc} / ${metrics.sc}`} accent="text-blue-300" />
          <Metric title="Vendors" value={metrics.vendors} accent="text-red-300" />
          <Metric title="Pending Approvals" value={metrics.pending} accent="text-yellow-300" />
        </section>

        <BattleMeter nc={metrics.nc} sc={metrics.sc} />

        <section className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {[...Object.entries(tables), ["payments", { label: "Payments" }], ["settings", { label: "Settings" }]].map(([key, item]) => (
              <button key={key} onClick={() => { setActive(key); setQuery(""); setFilterField(""); setFilterValue(""); }} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider ${active === key ? "border-yellow-300 bg-yellow-300 text-black" : "border-white/10 bg-white/5 text-zinc-300"}`}>
                {item.label}
              </button>
            ))}
          </div>

          {active === "payments" ? (
            <PaymentsView rows={allRows.filter((row) => "payment_status" in row)} />
          ) : active === "settings" ? (
            <SettingsView />
          ) : (
            <TableView
              config={config}
              rows={filteredRows}
              allRows={rows}
              query={query}
              setQuery={setQuery}
              filterField={filterField}
              setFilterField={setFilterField}
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              filterOptions={filterOptions}
              loading={loading}
              onExport={exportCsv}
              onUpdate={updateRecord}
              onDelete={deleteRecord}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ title, value, accent }) {
  return (
    <div className="admin-card">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">{title}</p>
      <div className={`mt-3 text-3xl font-black ${accent}`}>{value}</div>
    </div>
  );
}

function BattleMeter({ nc, sc }) {
  const total = nc + sc || 1;
  const ncPct = Math.round((nc / total) * 100);
  const leader = nc === sc ? "Tie battle" : nc > sc ? "NC is leading" : "SC is leading";

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/50 via-zinc-950 to-red-950/50 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-300">Battle Meter</p>
          <h2 className="mt-2 text-3xl font-black uppercase">{leader}</h2>
        </div>
        <div className="font-black uppercase tracking-wider text-zinc-300">NC {nc} registrations | SC {sc} registrations</div>
      </div>
      <div className="mt-5 h-5 overflow-hidden rounded-full border border-white/10 bg-red-600">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${ncPct}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs font-black uppercase tracking-wider text-zinc-400">
        <span>NC {ncPct}%</span>
        <span>SC {100 - ncPct}%</span>
      </div>
    </section>
  );
}

function TableView({ config, rows, allRows, query, setQuery, filterField, setFilterField, filterValue, setFilterValue, filterOptions, loading, onExport, onUpdate, onDelete }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase">{config.label}</h2>
          <p className="text-sm text-zinc-500">{rows.length} visible of {allRows.length} total</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative min-w-64">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
            <input className="field pl-10" placeholder="Search records" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="field md:w-48" value={filterField} onChange={(event) => { setFilterField(event.target.value); setFilterValue(""); }}>
            <option value="">Filter field</option>
            {config.filters.map((field) => <option key={field} value={field}>{field}</option>)}
          </select>
          <select className="field md:w-48" value={filterValue} onChange={(event) => setFilterValue(event.target.value)} disabled={!filterField}>
            <option value="">All values</option>
            {filterOptions.map((value) => <option key={value} value={value}>{String(value)}</option>)}
          </select>
          <button onClick={onExport} className="inline-flex items-center justify-center gap-2 rounded-xl border border-yellow-300/50 px-4 py-3 text-sm font-black uppercase tracking-wide text-yellow-200"><Download size={16} /> CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              {config.columns.map((column) => <th key={column} className="px-4 py-3 text-left">{column}</th>)}
              <th className="px-4 py-3 text-left">notes</th>
              <th className="px-4 py-3 text-left">actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr><td className="px-4 py-8 text-center text-zinc-400" colSpan={config.columns.length + 2}>Loading records...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-8 text-center text-zinc-400" colSpan={config.columns.length + 2}>No records found.</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="align-top hover:bg-white/[0.03]">
                {config.columns.map((column) => (
                  <td key={column} className="px-4 py-3">
                    {config.editable.includes(column) ? (
                      <EditableSelect field={column} value={row[column]} onChange={(value) => onUpdate(row.id, { [column]: value })} />
                    ) : column.includes("amount") ? (
                      `$${Number(row[column] || 0).toLocaleString()}`
                    ) : column === "created_at" ? (
                      new Date(row[column]).toLocaleDateString()
                    ) : (
                      String(row[column] ?? "")
                    )}
                  </td>
                ))}
                <td className="min-w-64 px-4 py-3">
                  <textarea className="field min-h-20" defaultValue={row.notes || ""} onBlur={(event) => onUpdate(row.id, { notes: event.target.value })} />
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => onDelete(row.id)} className="rounded-xl border border-red-400/30 p-3 text-red-200 hover:bg-red-500/10" aria-label="Delete record"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditableSelect({ field, value, onChange }) {
  const options = field === "payment_status" ? paymentStatuses : field === "order_status" ? orderStatuses : approvalStatuses;
  return (
    <select className="rounded-full border border-white/10 bg-black px-3 py-2 text-xs font-black uppercase tracking-wider" value={value || options[0]} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function PaymentsView({ rows }) {
  const totalPaid = rows.filter((row) => row.payment_status === "paid").reduce((sum, row) => sum + Number(row.total_amount || 0), 0);
  return (
    <div className="admin-card">
      <h2 className="text-2xl font-black uppercase">Payments</h2>
      <p className="mt-2 text-zinc-400">Payment records are tracked through each table using payment_status. Connect Stripe Checkout or payment links where the public form Pay Now buttons are marked.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <Metric title="Payment Rows" value={rows.length} accent="text-white" />
        <Metric title="Paid Rows" value={rows.filter((row) => row.payment_status === "paid").length} accent="text-emerald-300" />
        <Metric title="Pending Rows" value={rows.filter((row) => row.payment_status === "pending").length} accent="text-yellow-300" />
        <Metric title="Known Paid Revenue" value={`$${totalPaid.toLocaleString()}`} accent="text-emerald-300" />
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="admin-card">
      <h2 className="text-2xl font-black uppercase">Settings</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="font-black uppercase text-yellow-300">Environment</p>
          <p className="mt-2 text-sm text-zinc-400">Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_ADMIN_PASSWORD in Netlify environment variables.</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="font-black uppercase text-yellow-300">Payments</p>
          <p className="mt-2 text-sm text-zinc-400">Replace placeholder Pay Now buttons in FormModal with Stripe Checkout, Square, Eventbrite, or static payment links.</p>
        </div>
      </div>
    </div>
  );
}
