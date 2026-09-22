// Contenu de la landing page Schoolify — basé sur schoolify-edtech.com + brief fondateur

export const nav = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Espaces", href: "#espaces" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Logiciel de gestion scolaire",
  title: "Votre école, pilotée en un clic.",
  subtitle:
    "Schoolify réunit administration, suivi des élèves, transport et communication avec les parents dans une seule plateforme simple, sécurisée et pensée pour le terrain.",
  ctaPrimary: "Démarrer l'essai gratuit",
  ctaSecondary: "Demander une démo",
  note: "Sans carte bancaire — installation accompagnée",
};

export const stats = [
  { value: "500+", label: "établissements équipés" },
  { value: "40+", label: "fonctionnalités actives" },
  { value: "6", label: "pays d'Afrique francophone" },
];

export const pillars = [
  {
    title: "Simple",
    text: "Déploiement, prise en main et opérations quotidiennes pensés pour aller vite, sans formation lourde.",
  },
  {
    title: "Sécurisé",
    text: "Hébergement et données des élèves protégés selon des standards stricts, à chaque étape.",
  },
  {
    title: "Fonctionnel",
    text: "Les fonctions attendues par écoles, collèges et lycées — riches, testées sur le terrain marocain.",
  },
  {
    title: "Accompagné",
    text: "Une équipe qui vous aide au paramétrage et à l'intégration, du premier jour au déploiement complet.",
  },
  {
    title: "Adapté",
    text: "Le paramétrage colle à la taille et aux besoins réels de votre établissement, pas l'inverse.",
  },
  {
    title: "SAV 7j/7",
    text: "Des experts joignables par téléphone ou email, formations et supports inclus, 24h/24.",
  },
];

export const features = [
  {
    title: "Gestion administrative complète",
    text: "Inscriptions, dossiers élèves, emplois du temps, notes et bulletins centralisés dans un seul outil.",
  },
  {
    title: "Transport scolaire géolocalisé",
    text: "Suivi en temps réel des bus et notifications instantanées aux parents à chaque étape du trajet.",
  },
  {
    title: "Application parents & professeurs",
    text: "Un fil de communication continu : absences, devoirs, résultats et annonces, accessibles à tout moment.",
  },
  {
    title: "Suivi des dossiers élèves",
    text: "Historique scolaire, documents et progression réunis, consultables par l'administration en un instant.",
  },
];

export const spaces = [
  { title: "Administration", text: "Pilotage global de l'établissement et des équipes." },
  { title: "Direction", text: "Vue d'ensemble, indicateurs et décisions au quotidien." },
  { title: "Espace Professeurs", text: "Notes, absences et communication avec les familles." },
  { title: "Espace Parents", text: "Suivi scolaire et transport de leurs enfants en direct." },
  { title: "Espace Élèves", text: "Emploi du temps, devoirs et résultats à portée de main." },
];

export const pricing = [
  {
    name: "Free",
    price: "0",
    period: "toujours gratuit",
    description: "Pour démarrer sans engagement.",
    features: [
      "Gestion administrative de base",
      "Application de suivi élèves",
      "Accès école / élèves / parents / profs",
    ],
    highlighted: false,
  },
  {
    name: "Basic",
    price: "19",
    period: "/ mois",
    description: "Pour professionnaliser la gestion financière.",
    features: [
      "Solution administrative complète",
      "RH & comptabilité intégrées",
      "Application de suivi élèves",
      "Transport scolaire",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "49",
    period: "/ mois",
    description: "Pour développer la présence de l'école.",
    features: [
      "Tout Basic",
      "Création de site web dédié",
      "Gestion des réseaux sociaux (1 an)",
      "Accompagnement digital",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "250",
    period: "/ mois",
    description: "Pour une école 100% digitalisée.",
    features: [
      "Tout Pro",
      "Badge & carte de présence",
      "Plateforme e-learning",
      "Recouvrement des créances",
      "Reconnaissance faciale",
    ],
    highlighted: false,
  },
];

export const contact = {
  address: "351, Technopark, Casablanca, Maroc",
  phone: "+212 5 22 52 09 35",
  email: "contact@schoolify-edtech.com",
};

export const footerLinks = {
  espaces: ["Administration", "Direction", "Professeurs", "Parents", "Élèves"],
  ressources: ["Documentation", "Centre d'aide", "FAQ", "Support 24/7"],
  entreprise: ["À propos", "Nos packs", "Contact", "Confidentialité"],
};
