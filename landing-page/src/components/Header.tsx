import Image from "next/image";
import { nav } from "@/data/content";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9"
            priority
          />
          <span className="font-display text-xl tracking-wide text-sky-deep">
            Schoolify
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] font-semibold text-ink/70 transition hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-sky-deep"
        >
          Essai gratuit
        </a>
      </div>

      <nav className="flex gap-5 overflow-x-auto border-t border-ink/5 px-6 py-2.5 md:hidden">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-sm font-semibold text-ink/60"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
