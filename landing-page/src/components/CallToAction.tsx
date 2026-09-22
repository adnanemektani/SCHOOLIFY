import { registerUrl } from "@/data/content";
import { DoodleStar } from "./icons";

export default function CallToAction() {
  return (
    <section className="px-6 py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border-2 border-ink/10 bg-sky-deep px-8 py-16 text-center text-cream">
        <DoodleStar className="absolute left-10 top-8 h-6 w-6 rotate-6 text-gold/70" />
        <DoodleStar className="absolute bottom-10 right-14 h-5 w-5 -rotate-12 text-white/40" />

        <h2 className="font-display text-3xl sm:text-4xl">
          Prêt à apprendre le métier de demain ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-cream/75">
          Rejoins les apprenants qui se forment déjà au Web3 et à l&apos;IA avec un
          accompagnement réel, du premier cours jusqu&apos;au premier emploi.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={registerUrl}
            className="rounded-full bg-gold px-7 py-3.5 text-base font-bold text-ink shadow-[4px_4px_0_0_rgba(20,36,51,0.25)] transition hover:-translate-y-0.5"
          >
            Créer mon compte
          </a>
          <a
            href={registerUrl}
            className="rounded-full border-2 border-cream/30 px-7 py-3.5 text-base font-bold text-cream transition hover:border-cream/60"
          >
            Start Learning
          </a>
        </div>
      </div>
    </section>
  );
}
