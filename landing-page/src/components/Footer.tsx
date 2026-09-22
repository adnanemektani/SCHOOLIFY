import Image from "next/image";
import { contact, footerLinks } from "@/data/content";

export default function Footer() {
  return (
    <footer id="contact" className="border-t-2 border-ink/10 bg-ink px-6 pt-16 pb-8 text-cream/70">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/brand/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8" />
              <span className="font-display text-lg text-cream">Schoolify</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Le logiciel de gestion d&apos;école qui relie administration, enseignants,
              parents et élèves.
            </p>
          </div>

          <FooterCol title="Espaces" items={footerLinks.espaces} />
          <FooterCol title="Ressources" items={footerLinks.ressources} />

          <div>
            <h4 className="font-display text-sm tracking-wide text-cream">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>{contact.address}</li>
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Schoolify. Tous droits réservés.</p>
          <p>Casablanca, Maroc</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display text-sm tracking-wide text-cream">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((item) => (
          <li key={item} className="transition hover:text-cream">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
