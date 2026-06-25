import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Music, Phone, Sparkles } from "lucide-react";
import FormModal from "../components/FormModal";
import { eventInfo, features, heroSponsors, packages, quickInfo, sponsorLogos, ticketOptions, tickerSponsors } from "../lib/data";

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = Math.max(target - now, 0);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function CarolinaClassicsLanding() {
  const countdown = useCountdown("2026-10-17T11:00:00-04:00");
  const [modal, setModal] = useState(null);

  const openModal = (type, defaults = {}) => setModal({ type, defaults });

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <nav className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-black/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <a href="#top" className="font-black uppercase tracking-[0.25em] text-white">
            <span className="text-blue-400">NC</span> Classics <span className="text-red-400">SC</span>
          </a>
          <div className="hidden items-center gap-5 text-xs font-black uppercase tracking-wider text-zinc-300 md:flex">
            <a href="#tickets" className="hover:text-white">Tickets</a>
            <a href="#register" className="hover:text-white">Register</a>
            <a href="#sponsor" className="hover:text-white">Sponsors</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <Link to="/admin" className="rounded-full border border-yellow-300/50 px-3 py-2 text-yellow-200 hover:bg-yellow-300 hover:text-black">Admin</Link>
          </div>
        </div>
      </nav>

      <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            poster="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"
          >
            <source src="https://cdn.coverr.co/videos/coverr-racing-through-the-city-1560678663557?download=1080p" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,81,255,.45),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(255,0,0,.45),transparent_30%),linear-gradient(180deg,#050505,#090909_55%,#000)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,89,255,.35)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:70px_70px] opacity-30" />

        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          animate={{ x: [0, 8, -6, 0], y: [0, -6, 5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute left-0 top-0 h-full w-1/2">
            {heroSponsors.slice(0, 4).map((sponsor, index) => (
              <motion.div
                key={sponsor}
                className="absolute rounded-2xl border border-blue-400/10 bg-blue-500/10 px-5 py-3 font-black uppercase tracking-[.35em] text-blue-100/20 shadow-[0_0_25px_rgba(0,81,255,.15)] backdrop-blur-[2px]"
                animate={{ y: [0, -12, 0], opacity: [0.18, 0.3, 0.18], scale: [1, 1.03, 1] }}
                transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
                style={{ top: `${18 + index * 18}%`, left: `${8 + index * 6}%`, fontSize: `${1.6 + index * 0.35}rem`, transform: `rotate(${-12 + index * 2}deg)` }}
              >
                {sponsor}
              </motion.div>
            ))}
          </div>

          <div className="absolute right-0 top-0 h-full w-1/2">
            {heroSponsors.slice(4).map((sponsor, index) => (
              <motion.div
                key={sponsor}
                className="absolute rounded-2xl border border-red-400/10 bg-red-500/10 px-5 py-3 text-right font-black uppercase tracking-[.35em] text-red-100/20 shadow-[0_0_25px_rgba(255,0,0,.15)] backdrop-blur-[2px]"
                animate={{ y: [0, 14, 0], opacity: [0.18, 0.3, 0.18], scale: [1, 1.03, 1] }}
                transition={{ duration: 8 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}
                style={{ top: `${22 + index * 17}%`, right: `${8 + index * 5}%`, fontSize: `${1.7 + index * 0.3}rem`, transform: `rotate(${10 - index * 2}deg)` }}
              >
                {sponsor}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mb-6 w-fit rounded-full border border-yellow-300/50 bg-black/70 px-5 py-3 shadow-[0_0_45px_rgba(250,204,21,.35)]"
          >
            <div className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[.25em] text-yellow-300 md:text-sm">
              <Sparkles size={16} /> Presented By <span className="text-white">Diamond Sponsor</span> <Sparkles size={16} />
            </div>
          </motion.div>

          <img
            src="/brand/carolina-classics-logo-transparent.png"
            alt="1st Annual NC vs SC Carolina Classics"
            className="mx-auto w-full max-w-[22rem] drop-shadow-[0_0_34px_rgba(255,255,255,.28)] [filter:drop-shadow(0_0_28px_rgba(0,109,255,.22))_drop-shadow(0_0_30px_rgba(255,31,61,.18))_drop-shadow(0_16px_34px_rgba(0,0,0,.72))] md:max-w-[34rem]"
          />
          <p className="mt-3 bg-gradient-to-r from-blue-400 via-white to-red-500 bg-clip-text text-2xl font-black italic text-transparent md:text-5xl">King of the Carolinas</p>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold text-zinc-200 md:text-2xl">One show. Two states. One champion. Luxury, street culture, competition, live DJs, vendors, food trucks, awards, and the ultimate NC vs SC car show battle.</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
            <button onClick={() => openModal("ticket")} className="w-full rounded-2xl bg-white px-8 py-4 font-black uppercase tracking-wider text-black shadow-[0_0_35px_rgba(255,255,255,.25)] md:w-auto">Buy Tickets</button>
            <button onClick={() => openModal("car")} className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 px-8 py-4 font-black uppercase tracking-wider shadow-[0_0_35px_rgba(255,0,0,.35)] md:w-auto">Register Your Car</button>
            <button onClick={() => openModal("sponsor")} className="w-full rounded-2xl border border-yellow-400/70 px-8 py-4 font-black uppercase tracking-wider text-yellow-300 md:w-auto">Sponsor Now</button>
            <button onClick={() => openModal("vendor")} className="w-full rounded-2xl border border-white/20 px-8 py-4 font-black uppercase tracking-wider md:w-auto">Become a Vendor</button>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            {quickInfo.map(([Icon, title, text]) => <InfoCard key={title} icon={<Icon />} title={title} text={text} />)}
          </div>

          <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-white/15 bg-black/65 p-5 shadow-[0_0_45px_rgba(0,81,255,.25)] md:p-7">
            <div className="mb-4 text-xs font-black uppercase tracking-[.35em] text-yellow-300 md:text-sm">Countdown to the Crown</div>
            <div className="grid grid-cols-4 gap-3">
              <CountdownBox value={countdown.days} label="Days" />
              <CountdownBox value={countdown.hours} label="Hours" />
              <CountdownBox value={countdown.minutes} label="Minutes" />
              <CountdownBox value={countdown.seconds} label="Seconds" />
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-y border-white/10 bg-black/80 py-3 backdrop-blur">
          <motion.div className="flex w-max gap-8 whitespace-nowrap text-sm font-black uppercase tracking-[.25em] md:text-base" animate={{ x: [0, -900] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
            {[...tickerSponsors, ...tickerSponsors, ...tickerSponsors].map((sponsor, index) => (
              <span key={`${sponsor}-${index}`} className="inline-flex items-center gap-3 text-zinc-200">
                <span className="text-yellow-300">★</span>{sponsor}<span className="text-blue-400">NC</span><span className="text-red-400">SC</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-zinc-950 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="premium-heading text-center text-4xl font-black uppercase md:text-6xl">Event Highlights</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {features.map(([Icon, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center transition hover:bg-white/10">
                <Icon className="mx-auto mb-3 h-9 w-9 text-yellow-300" />
                <div className="font-black uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sponsor" className="bg-black px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="font-black uppercase tracking-[.35em] text-yellow-300">Sponsorship Opportunities</p>
            <h2 className="premium-heading mt-3 text-4xl font-black uppercase md:text-6xl">Put Your Brand in the Battle</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {packages.map((p) => (
              <div key={p.name} className="premium-card group overflow-hidden rounded-3xl border border-white/15 transition duration-200 hover:-translate-y-1 hover:border-yellow-300/35">
                <div className={`bg-gradient-to-r ${p.glow} p-5 text-black`}>
                  <div className="text-3xl font-black uppercase">{p.name}</div>
                  <div className="text-2xl font-black">{p.price}</div>
                  <div className="text-xs font-black uppercase opacity-80">{p.tag}</div>
                </div>
                <ul className="space-y-2 p-5 text-sm text-zinc-200">
                  {p.perks.map((perk) => <li key={perk}>- {perk}</li>)}
                </ul>
                <div className="px-5 pb-5">
                  <button onClick={() => openModal("sponsor", { sponsorship_level: p.name })} className="w-full rounded-2xl border border-yellow-300/50 bg-black/25 px-4 py-3 font-black uppercase tracking-wide text-yellow-200 transition group-hover:border-yellow-200 group-hover:bg-yellow-300/10 group-hover:text-yellow-100 group-hover:shadow-[0_0_24px_rgba(250,204,21,.18)]">Inquire</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-5 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-black uppercase tracking-[.35em] text-yellow-300">Sponsor Wall</p>
          <h2 className="premium-heading mt-3 text-4xl font-black uppercase md:text-6xl">Brands Backing the Battle</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">Sponsor logos can be added here as partners come in. This creates instant social proof and makes sponsorship feel more valuable.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {sponsorLogos.map((sponsor) => (
              <div key={sponsor} className="flex min-h-28 items-center justify-center rounded-3xl border border-white/10 bg-black/70 p-5 transition hover:border-yellow-300/70">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 via-white to-red-600" />
                  <div className="text-sm font-black uppercase tracking-wide text-zinc-200">{sponsor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tickets" className="border-y border-white/10 bg-black px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="font-black uppercase tracking-[.35em] text-yellow-300">Tickets & Experiences</p>
            <h2 className="premium-heading mt-3 text-4xl font-black uppercase md:text-6xl">Pull Up To The Battle</h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {ticketOptions.map((ticket) => (
              <div key={ticket.name} className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_0_45px_rgba(255,255,255,.05)]">
                <div className={`bg-gradient-to-r ${ticket.glow} p-6 text-black`}>
                  <div className="text-3xl font-black uppercase">{ticket.name}</div>
                  <div className="mt-2 text-5xl font-black">{ticket.price}</div>
                </div>
                <div className="p-6">
                  <ul className="mb-6 space-y-3 text-zinc-200">
                    {ticket.perks.map((perk) => <li key={perk}>- {perk}</li>)}
                  </ul>
                  <button onClick={() => openModal("ticket", { ticket_type: ticket.name })} className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 px-6 py-4 font-black uppercase tracking-wide shadow-[0_0_35px_rgba(255,0,0,.25)]">Buy Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="bg-gradient-to-r from-blue-950 via-black to-red-950 px-5 py-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/15 bg-black/70 p-8 text-center md:p-12">
          <h2 className="premium-heading text-4xl font-black uppercase md:text-6xl">Ready to Compete?</h2>
          <p className="mt-4 text-lg text-zinc-200">Register your car, apply as a vendor, pitch entertainment, or secure your sponsorship package today.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <button className="rounded-2xl bg-blue-600 p-5 font-black uppercase" onClick={() => openModal("car")}>Register Car</button>
            <button id="vendor" className="rounded-2xl bg-white p-5 font-black uppercase text-black" onClick={() => openModal("vendor")}>Become Vendor</button>
            <button className="rounded-2xl bg-red-600 p-5 font-black uppercase" onClick={() => openModal("sponsor")}>Sponsor Now</button>
            <button className="rounded-2xl border border-yellow-300/70 p-5 font-black uppercase text-yellow-200" onClick={() => openModal("entertainment")}><Music className="mx-auto mb-2" /> Entertainment</button>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-white/10 bg-black px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.35em] text-yellow-300">Contact</p>
            <h2 className="mt-2 text-2xl font-black uppercase">Carolina Classics Car Show</h2>
          </div>
          <div className="flex flex-col gap-3 text-zinc-200 md:flex-row md:gap-6">
            <span className="inline-flex items-center gap-2"><Phone size={20} />{eventInfo.phone}</span>
            <span className="inline-flex items-center gap-2"><Mail size={20} />{eventInfo.email}</span>
          </div>
        </div>
      </footer>

      {modal && <FormModal type={modal.type} defaults={modal.defaults} onClose={() => setModal(null)} />}
    </main>
  );
}

function CountdownBox({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-3xl font-black tabular-nums text-transparent md:text-5xl">{String(value).padStart(2, "0")}</div>
      <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 md:text-xs">{label}</div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-black/55 p-5 text-left backdrop-blur">
      <div className="mb-3 text-yellow-300">{icon}</div>
      <div className="text-lg font-black uppercase">{title}</div>
      <div className="mt-1 text-zinc-300">{text}</div>
    </div>
  );
}
