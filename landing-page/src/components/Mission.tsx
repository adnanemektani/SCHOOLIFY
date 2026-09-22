import { mission } from "@/data/content";
import { DoodleStar } from "./icons";

export default function Mission() {
  return (
    <section id="mission" className="px-6 py-20">
      <div className="relative mx-auto max-w-4xl rounded-[2rem] border-2 border-ink/10 bg-white px-8 py-14 text-center">
        <DoodleStar className="absolute -top-3 left-10 h-6 w-6 -rotate-6 text-gold" />
        <p className="font-display text-sm tracking-wide text-sky-deep">{mission.eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">{mission.title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/65">
          {mission.text}
        </p>
      </div>
    </section>
  );
}
