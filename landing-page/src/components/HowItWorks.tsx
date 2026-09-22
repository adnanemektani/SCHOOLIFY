import { steps, registerUrl } from "@/data/content";

export default function HowItWorks() {
  return (
    <section id="fonctionnement" className="bg-white/60 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-wide text-gold">Comment ça marche</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            De la curiosité au premier poste, en 4 étapes
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative pl-14">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-sky-deep font-display text-lg text-white">
                {i + 1}
              </span>
              <h3 className="font-display text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href={registerUrl}
            className="rounded-full bg-ink px-7 py-3.5 text-base font-bold text-cream transition hover:bg-sky-deep"
          >
            Créer mon compte
          </a>
        </div>
      </div>
    </section>
  );
}
