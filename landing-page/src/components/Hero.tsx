import { hero } from "@/data/content";
import { DoodleStar, Scribble } from "./icons";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pt-16 pb-24">
      <DoodleStar className="absolute left-[6%] top-24 h-6 w-6 text-gold/70 rotate-6" />
      <DoodleStar className="absolute right-[12%] top-40 h-4 w-4 text-sky/60 -rotate-12" />
      <DoodleStar className="absolute left-[18%] bottom-10 h-5 w-5 text-sky-deep/40 rotate-12" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-white px-4 py-1.5 text-sm font-bold text-sky-deep shadow-[3px_3px_0_0_rgba(20,36,51,0.08)]">
            {hero.eyebrow}
          </span>

          <h1 className="mt-6 font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            Votre école,{" "}
            <span className="underline-scribble text-sky-deep">
              pilotée
              <Scribble className="h-3.5 text-gold" />
            </span>{" "}
            en un clic.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-sky-deep px-7 py-3.5 text-base font-bold text-white shadow-[4px_4px_0_0_rgba(20,36,51,0.18)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(20,36,51,0.22)]"
            >
              {hero.ctaPrimary}
            </a>
            <a
              href="#contact"
              className="rounded-full border-2 border-ink/15 bg-transparent px-7 py-3.5 text-base font-bold text-ink transition hover:border-ink/30"
            >
              {hero.ctaSecondary}
            </a>
          </div>

          <p className="mt-4 text-sm text-ink/50">{hero.note}</p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gold/25 rotate-3" />

          <div className="rotate-[-2deg] rounded-[1.75rem] border-2 border-ink/10 bg-white p-5 shadow-[10px_10px_0_0_rgba(20,36,51,0.12)]">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                <span className="h-2.5 w-2.5 rounded-full bg-sky" />
                <span className="h-2.5 w-2.5 rounded-full bg-sky-deep" />
              </div>
              <span className="text-xs font-bold text-ink/40">Tableau de bord</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-sky/10 p-3">
                <p className="text-2xl font-extrabold text-sky-deep">96%</p>
                <p className="text-xs font-semibold text-ink/50">Présence du jour</p>
              </div>
              <div className="rounded-xl bg-gold/15 p-3">
                <p className="text-2xl font-extrabold text-ink">12</p>
                <p className="text-xs font-semibold text-ink/50">Bus en circulation</p>
              </div>
            </div>

            <div className="mt-3 space-y-2 rounded-xl border border-ink/10 p-3">
              <p className="text-xs font-bold text-ink/40">Notifications parents</p>
              <div className="h-2 w-[85%] rounded-full bg-ink/10" />
              <div className="h-2 w-[60%] rounded-full bg-ink/10" />
              <div className="h-2 w-[70%] rounded-full bg-sky/30" />
            </div>
          </div>

          <div className="absolute -bottom-6 -right-4 rotate-6 rounded-2xl border-2 border-ink/10 bg-ink px-4 py-3 text-cream shadow-[6px_6px_0_0_rgba(20,36,51,0.15)]">
            <p className="text-xs font-semibold text-cream/60">Bus 03</p>
            <p className="text-sm font-bold">à 4 min de l&apos;école</p>
          </div>
        </div>
      </div>
    </section>
  );
}
