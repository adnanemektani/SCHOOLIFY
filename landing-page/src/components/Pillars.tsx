import { pillars } from "@/data/content";
import {
  IconGlobeOnline,
  IconMentor,
  IconProject,
  IconCert,
  IconCommunity,
  IconGrowth,
} from "./icons";

const icons = [IconGlobeOnline, IconMentor, IconProject, IconCert, IconCommunity, IconGrowth];
const tilts = ["rotate-1", "-rotate-1", "rotate-0", "-rotate-1", "rotate-1", "rotate-0"];

export default function Pillars() {
  return (
    <section id="fonctionnement-atouts" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-display text-sm tracking-wide text-gold">Pourquoi E-dTech</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Une formation pensée pour l&apos;emploi, pas juste le diplôme
          </h2>
          <p className="mt-4 text-lg text-ink/65">
            Du premier cours au premier entretien, chaque étape du parcours est construite
            pour rapprocher les apprenants du marché réel du Web3 et de l&apos;IA.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = icons[i];
            return (
              <div
                key={pillar.title}
                className={`${tilts[i]} rounded-2xl border-2 border-ink/10 bg-white p-6 transition hover:-translate-y-1 hover:rotate-0 hover:shadow-[6px_6px_0_0_rgba(20,36,51,0.1)]`}
              >
                <div className="inline-flex rounded-xl bg-sky/10 p-2.5 text-sky-deep">
                  <Icon />
                </div>
                <h3 className="mt-4 font-display text-lg text-ink">{pillar.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{pillar.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
