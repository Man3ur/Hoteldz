# Rihla — Voyager en Algérie

**Rihla** (رحلة, « le voyage », en clin d'œil au récit d'Ibn Battuta) recense les hôtels, restaurants,
cafés et sites à visiter d'Algérie, avec une carte, des notes, des avis et la météo.
Un seul code produit le site web, l'application Android (APK) et l'application iPhone (IPA).

## Fonctionnalités

| Onglet | Contenu |
| --- | --- |
| **Accueil** | Recherche rapide, catégories, météo, destinations, hôtels et tables les mieux notés |
| **Carte** | Tous les lieux sur la carte avec leur note, filtres par catégorie, regroupement automatique, bouton « me localiser » |
| **Rechercher** | Recherche par nom, ville ou mot-clé (sans accents requis), filtres ville / note, tri par note, avis ou distance |
| **Favoris** | Les lieux enregistrés avec le cœur |
| **Fiche lieu** | Note détaillée, avis, écriture d'un avis, météo sur place sur 3 jours, itinéraire, partage |

## Identité visuelle

Inspirée de l'Algérie sans se limiter au vert et blanc : **terre cuite** des ksour (`#C8553D`),
**bleu Méditerranée** (`#0E4C6B`), **safran** du Sahara (`#E9A23B`), **sable** (`#FBF5EA`) et **vert oasis** (`#2F7D5B`).
Le logo est l'étoile à huit branches du zellige, dessinée en boussole. Mode sombre automatique.

## Démarrer

- **En ligne** : https://man3ur.github.io/Hoteldz/ (mis à jour à chaque push sur `Master`).
- **Sans rien installer** : ouvrez **`Rihla.html`** (à la racine) d'un double-clic dans Chrome, Edge, Firefox ou Safari. `index.html` est le code source et ne s'ouvre pas seul. `npm run build` régénère `Rihla.html`.
- **Pour développer** :

```bash
npm install
npm run dev          # site web sur http://localhost:5173
```

## Applications mobiles

Le projet utilise [Capacitor](https://capacitorjs.com) : le site est empaqueté dans une vraie app native.

**Android (APK)**
- Automatique : chaque push ou pull request lance le workflow GitHub *Android (APK)*, l'APK se télécharge dans l'onglet **Actions → artefacts**.
- En local (Android Studio installé) : `npm run android`, puis *Build → Build APK(s)*.

**iPhone (IPA)**
- Il faut un Mac avec Xcode et un compte Apple Developer (99 $/an) pour signer l'app et la publier sur l'App Store ou TestFlight.
- En local : `npm run ios`, puis dans Xcode choisir votre équipe (*Signing & Capabilities*) et *Product → Archive*.
- Le workflow *iOS (IPA non signé)* produit un IPA non signé, utile pour vérifier que le build passe ; il doit être signé avant installation.

Après une modification du code web : `npm run cap:sync`.

## Brancher vos API plus tard

Copiez `.env.example` en `.env`. Toutes les intégrations sont isolées dans `src/services/` :

| Service | Fichier | Aujourd'hui | Plus tard |
| --- | --- | --- | --- |
| Lieux | `places.ts` | Données de démo (`src/data/places.ts`) | `VITE_PLACES_SOURCE=api` + `VITE_PLACES_API_URL` |
| Avis | `reviews.ts` | Stockés sur l'appareil | Votre backend (Supabase, Firebase…) pour les partager |
| Météo | `weather.ts` | Open-Meteo, gratuit sans clé | OpenWeatherMap avec `VITE_OPENWEATHER_API_KEY` |
| GPS | `location.ts` | Plugin natif Capacitor (permissions Android/iOS déjà déclarées) | — |
| Carte | `config.ts` | OpenStreetMap / CARTO, sans clé | Autre fournisseur de tuiles via `VITE_MAP_TILES_URL` |

> ⚠️ **Données de démonstration** : les hôtels, restaurants et cafés listés sont fictifs, ainsi que toutes
> les notes et avis. Les sites touristiques sont réels. À remplacer par une vraie base avant publication.

## Structure

```
src/
  screens/     Accueil, Carte, Recherche, Favoris, Fiche lieu
  components/  Cartes de lieu, étoiles, météo, icônes, logo
  services/    Lieux, avis, favoris, GPS, météo, configuration
  data/        Données de démonstration
android/  ios/ Projets natifs générés par Capacitor
assets/        Icône et écran de démarrage sources (npx @capacitor/assets generate)
```
