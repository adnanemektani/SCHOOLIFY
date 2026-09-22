# E-dTech — Création de compte

Formulaire d'inscription, page de bienvenue et espace compte pour **E-dTech**.

Réalisé pour le **Jour 1** du hackathon Schoolify E-dTech. Parcours couvert :
`Landing Page → Créer un compte → Formulaire → Compte créé → Welcome to E-dTech (+ espace compte)`

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Route Handlers)
- [Tailwind CSS v4](https://tailwindcss.com)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) pour le hachage des mots de passe
- Stockage : fichier JSON local (`data/users.json`) — suffisant pour la démo du Jour 1, à remplacer par une vraie base de données en production

## Démarrer

```bash
npm install
npm run dev -- -p 3211
```

Le formulaire est servi sur [http://localhost:3211](http://localhost:3211). Le port `3211` est celui attendu par le bouton "Créer mon compte" de la landing page.

## Parcours

1. `/` — formulaire (Prénom, Nom, Email, Mot de passe, Sexe, Date de naissance, Pays, Région, Ville, Zone de résidence)
2. `POST /api/register` — valide les données côté serveur, hache le mot de passe, crée le compte et ouvre une session (cookie `httpOnly`)
3. `/welcome` — page de bienvenue + **espace compte** récapitulant les informations de l'utilisateur connecté
4. `POST /api/logout` — ferme la session

## Sécurité (éléments de base couverts pour le Jour 1)

- Mots de passe **jamais stockés en clair** — hachage bcrypt (10 rounds) avant écriture.
- Validation systématique **côté serveur** (`src/lib/validate.ts`), le client ne fait jamais foi.
- Refus d'un email déjà utilisé.
- Cookie de session `httpOnly`, `sameSite=lax`, jamais accessible en JavaScript côté client.
- Le mot de passe (haché ou non) n'est **jamais renvoyé** au client (`toPublicUser`).

## Structure

```
src/
├── app/
│   ├── page.tsx           → formulaire d'inscription (client component)
│   ├── welcome/page.tsx   → bienvenue + espace compte (server component)
│   └── api/
│       ├── register/     → création de compte
│       └── logout/       → déconnexion
├── components/            → FormField, RadioPills, LogoutButton, icons
└── lib/
    ├── validate.ts        → validation serveur des champs
    ├── store.ts            → persistance JSON + hachage des mots de passe
    └── session.ts          → lecture du cookie de session
```
