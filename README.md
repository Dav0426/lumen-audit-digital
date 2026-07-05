# Lumen — Landing page SaaS (produit fictif)

Landing page d'un SaaS fictif d'**audit digital automatisé par IA pour les PME** : Lumen scanne le site web, les outils et les process d'une entreprise, puis génère un **score de maturité digitale sur 100** et un **plan d'action priorisé**.

> Produit fictif — Conçu & développé par **David Azoulay**, élève-ingénieur ECE Lyon (projet portfolio).

## Stack

- **HTML / CSS / JS pur** — zéro dépendance, zéro build, zéro image bitmap (tout est SVG/CSS).
- Typographie : [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Google Fonts).

## Fonctionnalités

- Hero avec **mockup produit 100 % HTML/CSS** : jauge circulaire SVG animée (68/100, `requestAnimationFrame` + easing), sous-scores en barres, halo dégradé conic animé.
- Reveals au scroll (`IntersectionObserver`, stagger 60 ms).
- Bento grid de features (mini bar chart CSS, sparkline SVG).
- Toggle tarifs **mensuel / annuel (−20 %)** en JS.
- FAQ en **accordéon accessible** (`button` + `aria-expanded`, animation `grid-template-rows`).
- Nav sticky glassmorphism + menu burger mobile accessible.
- `prefers-reduced-motion` respecté (tout devient instantané).
- Responsive 375 / 768 / 1024 / 1440.

## Lancer en local

Aucun build nécessaire. Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
npx serve .
# ou
python -m http.server 8000
```

## Déploiement sur Vercel

### Option 1 — CLI

```bash
npm i -g vercel
cd 03-saas-lumen
vercel          # préversion
vercel --prod   # production
```

### Option 2 — Dashboard

1. Poussez le dossier sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com), **Add New → Project**, importez le dépôt.
3. Framework preset : **Other** (site statique, aucune commande de build, output = racine).
4. Deploy — le site est en ligne en quelques secondes.

> Pensez à mettre à jour les URL `og:url` / `og:image` dans `index.html` avec votre domaine Vercel définitif (et à ajouter une image `og.png` 1200×630 à la racine si vous voulez un aperçu riche sur les réseaux).

## Structure

```
03-saas-lumen/
├── index.html      # Page unique, sémantique, meta OG complètes
├── css/style.css   # Design system + composants + responsive + reduced-motion
├── js/main.js      # Reveals, jauge, toggle tarifs, FAQ, burger
└── README.md
```
