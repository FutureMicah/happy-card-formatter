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
    <span className="rounded bg-[oklch(0.32_0.12_265)] px-2 py-1 text-[0.7rem] font-bold italic tracking-wide text-primary-foreground">
      VISA
    </span>
  );
}

function MastercardMark() {
  return (
    <span className="flex items-center">
      <span className="h-5 w-5 rounded-full bg-[oklch(0.62_0.2_25)]" />
      <span className="-ml-2 h-5 w-5 rounded-full bg-[oklch(0.78_0.16_75)] opacity-90" />
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
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg">
          <div className="flex items-start justify-between">
            <div className="h-9 w-12 rounded-md bg-[oklch(0.82_0.13_85)]" />
            <div className="h-7">{brand === "visa" && <VisaMark />}{brand === "mastercard" && <MastercardMark />}</div>
          </div>
          <p className="mt-8 font-mono text-xl tracking-[0.18em]">
            {card || "•••• •••• •••• ••••"}
          </p>
          <div className="mt-6 flex items-end justify-between text-xs uppercase tracking-widest opacity-80">
            <span className="truncate">{name || "Cardholder name"}</span>
            <span>{expiry || "MM / YY"}</span>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-card-foreground">Payment details</h1>

          <div className="mt-5 space-y-4">
            <Field label="Cardholder name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className={inputCls}
              />
            </Field>

            <Field label="Card number">
              <div className="relative">
                <input
                  inputMode="numeric"
                  value={card}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").substring(0, 16);
                    setCard(v.replace(/(\d{4})(?=\d)/g, "$1 "));
                  }}
                  placeholder="1234 5678 9012 3456"
                  className={`${inputCls} pr-16 font-mono`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {brand === "visa" && <VisaMark />}
                  {brand === "mastercard" && <MastercardMark />}
                </span>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry">
                <input
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").substring(0, 4);
                    if (v.length >= 3) v = v.substring(0, 2) + " / " + v.substring(2);
                    setExpiry(v);
                  }}
                  placeholder="MM / YY"
                  className={`${inputCls} font-mono`}
                />
              </Field>
              <Field label="CVV">
                <input
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                  placeholder="123"
                  className={`${inputCls} font-mono`}
                />
              </Field>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotice(true)}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Pay
          </button>

          {notice && (
            <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
              This is a visual demo only. No card data is sent or stored.
            </p>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Visual demo only — nothing is submitted or stored
          </p>
        </section>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
