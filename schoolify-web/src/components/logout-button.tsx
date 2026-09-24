"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({ className = "logout-button" }: { className?: string }) {
  const router = useRouter();
  return <button className={className} onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }}>Se déconnecter ↗</button>;
}
