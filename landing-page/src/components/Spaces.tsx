import { spaces } from "@/data/content";
import { DoodleStar } from "./icons";

export default function Spaces() {
  return (
    <section id="espaces" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
          <div className="max-w-2xl">
            <p className="font-display text-sm tracking-wide text-gold">Un espace pour chacun</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Toute la communauté scolaire, connectée
            </h2>
          </div>
          <DoodleStar className="hidden h-8 w-8 text-sky/50 sm:block" />
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {spaces.map((space, i) => (
            <div
              key={space.title}
              className="w-full rounded-2xl border-2 border-ink/10 bg-white p-6 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)]"
              style={{ transform: i % 2 === 0 ? "rotate(-0.4deg)" : "rotate(0.4deg)" }}
            >
              <span className="text-xs font-extrabold text-sky-deep/60">0{i + 1}</span>
              <h3 className="mt-1 font-display text-lg text-ink">{space.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{space.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
