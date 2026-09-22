import { redirect } from "next/navigation";
import Image from "next/image";
import { getSessionUserId } from "@/lib/session";
import { findUserById, toPublicUser } from "@/lib/store";
import LogoutButton from "@/components/LogoutButton";
import { DoodleStar } from "@/components/icons";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatBirthDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function WelcomePage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/");

  const user = await findUserById(userId);
  if (!user) redirect("/");

  const account = toPublicUser(user);

  const infoRows = [
    { label: "Email", value: account.email },
    { label: "Sexe", value: capitalize(account.gender) },
    { label: "Date de naissance", value: formatBirthDate(account.birthDate) },
    { label: "Pays", value: account.country },
    { label: "Région", value: account.region },
    { label: "Ville", value: account.city },
    { label: "Zone de résidence", value: capitalize(account.zone) },
  ];

  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/brand/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-display text-lg tracking-wide text-sky-deep">E-dTech</span>
          </div>
          <LogoutButton />
        </div>

        <div className="relative mt-8 rounded-[1.75rem] border-2 border-ink/10 bg-sky-deep px-8 py-10 text-center text-cream">
          <DoodleStar className="absolute left-8 top-6 h-6 w-6 -rotate-6 text-gold" />
          <p className="font-display text-sm tracking-wide text-cream/70">Bienvenue</p>
          <h1 className="mt-2 font-display text-3xl">
            Welcome to E-dTech, {account.firstName} !
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] text-cream/75">
            Ton compte est créé. Ton parcours Web3 &amp; IA commence maintenant.
          </p>
        </div>

        <div className="mt-6 rounded-[1.75rem] border-2 border-ink/10 bg-white p-8">
          <h2 className="font-display text-lg text-ink">Mon espace compte</h2>
          <dl className="mt-5 divide-y divide-ink/10">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                <dt className="font-semibold text-ink/50">{row.label}</dt>
                <dd className="font-bold text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
