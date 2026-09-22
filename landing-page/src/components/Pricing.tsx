import { pricing } from "@/data/content";

export default function Pricing() {
  return (
    <section id="tarifs" className="bg-white/60 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-wide text-gold">Tarifs</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Un pack pour chaque étape de votre école
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border-2 p-6 ${
                plan.highlighted
                  ? "border-sky-deep bg-ink text-cream shadow-[6px_6px_0_0_rgba(0,173,238,0.35)]"
                  : "border-ink/10 bg-white text-ink"
              }`}
            >
              {plan.highlighted && (
                <span className="mb-3 w-fit rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-ink">
                  Le plus choisi
                </span>
              )}
              <h3 className="font-display text-xl">{plan.name}</h3>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-cream/60" : "text-ink/55"}`}>
                {plan.description}
              </p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-3xl">{plan.price}$</span>
                <span className={`text-sm ${plan.highlighted ? "text-cream/50" : "text-ink/45"}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        plan.highlighted ? "bg-sky" : "bg-sky-deep"
                      }`}
                    />
                    <span className={plan.highlighted ? "text-cream/80" : "text-ink/70"}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-7 rounded-full px-5 py-3 text-center text-sm font-bold transition ${
                  plan.highlighted
                    ? "bg-sky text-ink hover:bg-white"
                    : "bg-ink/5 text-ink hover:bg-ink hover:text-cream"
                }`}
              >
                Choisir {plan.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
