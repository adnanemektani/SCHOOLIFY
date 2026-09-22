import { stats } from "@/data/content";

export default function Stats() {
  return (
    <section className="border-y-2 border-ink/5 bg-white/60">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y-2 divide-ink/5 px-6 sm:grid-cols-3 sm:divide-y-0 sm:divide-x-2">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-8 text-center">
            <p className="font-display text-3xl text-sky-deep sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
