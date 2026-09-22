import { features } from "@/data/content";
import { IconAdmin, IconBus, IconChat, IconFolder } from "./icons";

const icons = [IconAdmin, IconBus, IconChat, IconFolder];

export default function Features() {
  return (
    <section className="bg-ink px-6 py-24 text-cream">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-display text-sm tracking-wide text-gold">Ce que Schoolify gère</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Une plateforme, tous les services de l&apos;école
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {features.map((f, i) => {
            const Icon = icons[i];
            return (
              <div
                key={f.title}
                className="rounded-2xl border-2 border-cream/10 bg-cream/[0.04] p-7 transition hover:border-sky/40"
              >
                <div className="inline-flex rounded-xl bg-sky/15 p-2.5 text-sky">
                  <Icon />
                </div>
                <h3 className="mt-5 font-display text-xl">{f.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-cream/60">{f.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
