import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Card Payment Form Demo — Visual Only" },
      {
        name: "description",
        content:
          "An interactive credit card form demo with live formatting and brand detection. Nothing is submitted or stored.",
      },
      { property: "og:title", content: "Card Payment Form Demo — Visual Only" },
      {
        property: "og:description",
        content:
          "Interactive credit card form with live formatting and card brand detection. Purely visual — no data is sent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Brand = "visa" | "mastercard" | null;

function detectBrand(digits: string): Brand {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  return null;
}

function VisaMark() {
  return (
    <span className="rounded-md bg-primary-foreground/15 px-2 py-1 text-[0.7rem] font-bold italic tracking-[0.15em] text-primary-foreground ring-1 ring-primary-foreground/25 backdrop-blur-sm">
      VISA
    </span>
  );
}

function MastercardMark() {
  return (
    <span className="flex items-center" aria-hidden="true">
      <span className="h-5 w-5 rounded-full bg-[oklch(0.62_0.2_25)]" />
      <span className="-ml-2 h-5 w-5 rounded-full bg-[oklch(0.8_0.16_75)] opacity-90 mix-blend-screen" />
    </span>
  );
}

function Index() {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState(false);

  const digits = card.replace(/\D/g, "");
  const brand = detectBrand(digits);

  return (
    <main
      className="flex min-h-dvh items-center justify-center px-4 py-14"
      style={{ backgroundImage: "var(--gradient-surface)" }}
    >
      <div className="w-full max-w-md [perspective:1200px]">
        <header className="animate-rise-in mb-7 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur transition-all duration-300 hover:border-ring/50 hover:bg-card hover:tracking-[0.22em]">
            Visual demo
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            Payment form preview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Type to watch formatting and brand detection react in real time.
          </p>
        </header>

        {/* Card visual */}
        <div
          className="card-3d sheen animate-rise-in group relative mb-7 overflow-hidden rounded-3xl p-6 text-primary-foreground [animation-delay:80ms]"
          style={{ backgroundImage: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}
        >
          <span className="animate-glow-pulse pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />
          <span className="animate-glow-pulse pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-accent/25 blur-3xl [animation-delay:1.5s]" />

          <div className="relative flex items-start justify-between">
            <div className="h-9 w-12 rounded-md bg-gradient-to-br from-[oklch(0.88_0.13_88)] to-[oklch(0.72_0.12_70)] shadow-inner transition-transform duration-500 group-hover:scale-105" />
            <div className="flex h-7 items-center transition-all duration-500 group-hover:-translate-y-0.5">
              {brand === "visa" && <VisaMark />}
              {brand === "mastercard" && <MastercardMark />}
            </div>
          </div>

          <p className="relative mt-9 font-mono text-[1.35rem] tabular-nums tracking-[0.2em] drop-shadow-sm transition-all duration-500 group-hover:tracking-[0.24em]">
            {card || "•••• •••• •••• ••••"}
          </p>

          <div className="relative mt-7 flex items-end justify-between text-[0.68rem] uppercase tracking-[0.16em]">
            <span className="min-w-0 truncate opacity-85 transition-opacity duration-300 group-hover:opacity-100">
              {name || "Cardholder name"}
            </span>
            <span className="opacity-85 transition-opacity duration-300 group-hover:opacity-100">
              {expiry || "MM / YY"}
            </span>
          </div>
        </div>

        {/* Form */}
        <section
          className="animate-rise-in rounded-3xl border border-border bg-card/85 p-6 backdrop-blur-xl transition-shadow duration-500 hover:shadow-lg [animation-delay:160ms]"
          style={{ boxShadow: "var(--shadow-panel)" }}
        >

          <h2 className="text-base font-semibold tracking-tight text-card-foreground">
            Payment details
          </h2>

          <div className="mt-5 space-y-4">
            <Field label="Cardholder name" htmlFor="holder">
              <input
                id="holder"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className={inputCls}
              />
            </Field>

            <Field label="Card number" htmlFor="cardnum">
              <div className="relative">
                <input
                  id="cardnum"
                  inputMode="numeric"
                  autoComplete="off"
                  value={card}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").substring(0, 16);
                    setCard(v.replace(/(\d{4})(?=\d)/g, "$1 "));
                  }}
                  placeholder="1234 5678 9012 3456"
                  className={`${inputCls} pr-20 font-mono tabular-nums tracking-wide`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {brand === "visa" && (
                    <span className="rounded-md bg-primary px-2 py-1 text-[0.65rem] font-bold italic tracking-widest text-primary-foreground">
                      VISA
                    </span>
                  )}
                  {brand === "mastercard" && <MastercardMark />}
                </span>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry" htmlFor="exp">
                <input
                  id="exp"
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").substring(0, 4);
                    if (v.length >= 3) v = v.substring(0, 2) + " / " + v.substring(2);
                    setExpiry(v);
                  }}
                  placeholder="MM / YY"
                  className={`${inputCls} font-mono tabular-nums`}
                />
              </Field>
              <Field label="CVV" htmlFor="cvv">
                <input
                  id="cvv"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                  placeholder="123"
                  className={`${inputCls} font-mono tabular-nums`}
                />
              </Field>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotice(true)}
            className="sheen relative mt-6 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-glow px-4 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:translate-y-0 active:scale-[0.985]"
            style={{ boxShadow: "var(--shadow-panel)" }}
          >
            Pay
          </button>

          {notice && (
            <p
              role="status"
              className="animate-rise-in mt-3 rounded-xl border border-border bg-muted px-3 py-2.5 text-center text-xs text-muted-foreground"
            >
              This is a visual demo only. No card data is sent or stored.
            </p>
          )}


          <p className="mt-5 border-t border-border pt-4 text-center text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            Visual demo only — nothing is submitted or stored
          </p>
        </section>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background/70 px-3.5 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground hover:border-ring/50 focus:border-ring focus:bg-background focus:ring-4 focus:ring-ring/15";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
