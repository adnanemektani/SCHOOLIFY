# E-dTech — Landing Page

Landing page de **E-dTech**, plateforme de formation aux métiers du Web3 et de l'Intelligence Artificielle.

Réalisée pour le **Jour 1** du hackathon Schoolify E-dTech : présenter la mission, les formations, les métiers proposés et le fonctionnement de la plateforme, avec un appel à l'action vers la création de compte.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- Polices [Alfa Slab One](https://fonts.google.com/specimen/Alfa+Slab+One) (titres) + [Nunito](https://fonts.google.com/specimen/Nunito) (texte), chargées via `next/font/google`

## Démarrer

```bash
npm install
npm run dev
```

Le site est servi sur [http://localhost:3000](http://localhost:3000) (ou un autre port si celui-ci est occupé).

> Le bouton "Créer mon compte" pointe vers l'app **registration-form**, attendue sur `http://localhost:3211` (voir `src/data/content.ts` → `registerUrl`).

## Structure

```
src/
├── app/                 → layout (metadata, polices) + assemblage de la page
├── components/          → une section = un composant (Hero, Mission, Pillars, Formations, Metiers, HowItWorks, CallToAction, Footer)
│   └── icons.tsx         → set d'icônes "dessinées à la main" (pas de pack d'icônes générique)
├── data/content.ts       → tout le contenu texte du site, à un seul endroit
public/brand/             → logo, favicon (charte graphique fournie par le fondateur)
```

## Choix de design

- Couleurs et police issues de la charte graphique officielle (`#00adee`, `#1b75bb`, `#fdc500`, Alfa Slab One).
- Fond crème plutôt que blanc/gris générique, cartes légèrement inclinées, étoiles "doodle" et surlignage à main levée — pour éviter le rendu template générique.
