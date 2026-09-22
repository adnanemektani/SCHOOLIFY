# Schoolify E-dTech

Landing page et premier parcours utilisateur de **Schoolify**, plateforme d’apprentissage des métiers du Web3 et de l’IA.

Le projet suit la charte Schoolify : bleu `#00ADEE`, bleu profond `#1B75BB`, accent doré `#FDC500` et titres à l’esprit **Alfa Slab One**.

## Ce qui est inclus

- Landing page responsive, pensée conversion : hero, mission, formations, métiers, étapes, partenaires et appels à l’action.
- Widget chatbot attractif, déjà intégré visuellement et prêt à être relié au chatbot IA de l’équipe.
- Inscription complète : prénom, nom, email, mot de passe, sexe, date de naissance, pays, région/ville et zone urbaine/rurale.
- Connexion, déconnexion, espace compte, mot de passe oublié, réinitialisation et vérification d’email.
- Validation serveur, mots de passe hashés avec bcrypt, cookies de session `HttpOnly`, tokens à durée limitée, vérification d’origine et limitation basique des tentatives.
- Email de bienvenue/vérification et notification startup via Resend (quand les variables d’environnement sont renseignées).
- Webhook optionnel pour envoyer un événement `user.created` à Google Apps Script, un CRM ou une autre plateforme. Aucune donnée sensible (hash / token) n’est envoyée.

## Lancer le projet

```bash
cd schoolify-web
npm install
copy .env.example .env.local
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

## Configuration

Créer `.env.local` depuis `.env.example` et configurer au minimum :

```env
SESSION_SECRET=une-valeur-longue-aleatoire-et-secrete
APP_URL=http://localhost:3000
```

Pour activer les emails transactionnels avec [Resend](https://resend.com) :

```env
RESEND_API_KEY=re_xxx
EMAIL_FROM=Schoolify <onboarding@votre-domaine.com>
STARTUP_NOTIFICATION_EMAIL=team@votre-domaine.com
```

Pour synchroniser les nouveaux comptes avec une autre plateforme ou Google Sheets via un Apps Script Web App :

```env
INTEGRATION_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
INTEGRATION_WEBHOOK_SECRET=secret-partage-avec-votre-webhook
```

Le webhook reçoit un `POST` JSON de la forme :

```json
{
  "event": "user.created",
  "data": {
    "id": "...",
    "firstName": "Sara",
    "lastName": "El Amrani",
    "email": "sara@example.com"
  }
}
```

Les autres champs de profil non sensibles sont également présents dans `data`. Les mots de passe hashés et tokens de sécurité ne quittent jamais l’application.

## Stockage de démonstration

Pour la démo, les comptes sont conservés dans `data/users.json`. Ce fichier est ignoré par Git afin de ne jamais versionner de données personnelles. Cette option est utile en local uniquement ; un déploiement réel doit remplacer `src/lib/users.ts` par une base de données transactionnelle (PostgreSQL/Supabase, par exemple), puis ajouter un rate limiter distribué et un service d’email configuré.

## Chatbot IA

Le widget est directement utilisable en mode démo : il accepte les messages et répond à des questions fréquentes. Quand le backend de l’équipe IA est prêt, ajouter son URL dans `.env.local` :

```env
NEXT_PUBLIC_CHATBOT_API_URL=https://votre-api-chatbot.example.com/chat
```

L’endpoint reçoit `POST { "message": "..." }` et doit renvoyer `JSON { "reply": "..." }`.

## Vérification

```bash
npx tsc --noEmit
npm run build
```
