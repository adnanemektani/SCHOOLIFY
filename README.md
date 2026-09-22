# Schoolify E-dTech — Hackathon, Jour 1

Livrable du Jour 1 : Landing Page & Création de compte pour **E-dTech**, plateforme de formation aux métiers du Web3 et de l'IA.

## Projets

| Dossier | Rôle | Port (dev) |
| --- | --- | --- |
| [`landing-page/`](landing-page/README.md) | Mission, formations, métiers, fonctionnement, CTA | `3000` |
| [`registration-form/`](registration-form/README.md) | Création de compte → Welcome → Espace compte | `3211` |
| `ai-solution/` | Réservé aux prochains jours (fonctionnalités Web3/IA) | — |

## Lancer la démo complète

```bash
cd landing-page && npm install && npm run dev
cd registration-form && npm install && npm run dev -- -p 3211
```

Parcours : ouvrir `http://localhost:3000`, cliquer sur **Créer mon compte**, remplir le formulaire → redirection vers la page de bienvenue et l'espace compte.

Charte graphique (couleurs, logo, typographies) fournie par le fondateur et réutilisée à l'identique dans les deux projets — voir `public/brand/` dans chaque dossier.
