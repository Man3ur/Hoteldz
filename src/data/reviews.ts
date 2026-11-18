import type { Category, Review } from '../types';

/** Avis de démonstration, générés à partir de modèles pour chaque lieu. */

const AUTHORS = ['Amina B.', 'Yacine K.', 'Lynda M.', 'Karim S.', 'Sofia H.', 'Walid T.', 'Nesrine A.',
  'Mehdi O.', 'Imane R.', 'Rafik D.', 'Samia L.', 'Anis Z.'];
const VISITS: Review['visit'][] = ['Famille', 'Couple', 'Solo', 'Affaires', 'Amis'];

const TEMPLATES: Record<Category, [string, string][]> = {
  hotel: [
    ['Séjour parfait', 'Personnel très accueillant, chambre propre et petit-déjeuner copieux. Je recommande.'],
    ['Très bon rapport qualité-prix', 'Bien situé, literie confortable. Le Wi-Fi pourrait être plus rapide.'],
    ['Vue magnifique', 'La vue depuis la chambre valait le voyage à elle seule. On reviendra en famille.'],
    ['Correct sans plus', 'Bon emplacement mais insonorisation à revoir. Accueil sympathique.'],
  ],
  restaurant: [
    ['Un régal', 'Des plats généreux et pleins de saveurs, comme chez nos grands-mères.'],
    ['Service rapide', 'Bonne adresse pour un déjeuner, prix raisonnables et produits frais.'],
    ['À ne pas manquer', 'Le meilleur repas de notre voyage. Pensez à réserver le week-end.'],
    ['Bien mais bruyant', 'La cuisine est bonne, mais la salle est très animée le soir.'],
  ],
  cafe: [
    ['Pause idéale', 'Café excellent et pâtisseries fraîches, terrasse agréable.'],
    ['Ambiance authentique', 'On s’y sent bien, le thé à la menthe est parfait.'],
    ['Sympa', 'Bon accueil, un peu d’attente aux heures de pointe.'],
  ],
  site: [
    ['Incontournable', 'Un lieu chargé d’histoire. Prenez un guide local, ça change tout.'],
    ['Spectaculaire', 'Des paysages à couper le souffle, prévoir de bonnes chaussures et de l’eau.'],
    ['Superbe visite', 'Magnifique, à faire tôt le matin pour éviter la chaleur et la foule.'],
  ],
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function demoReviews(placeId: string, category: Category, baseRating: number): Review[] {
  const h = hash(placeId);
  const tpl = TEMPLATES[category];
  return Array.from({ length: 3 }, (_, i) => {
    const [title, text] = tpl[(h + i) % tpl.length];
    const rating = Math.max(3, Math.min(5, Math.round(baseRating + (((h >> i) % 3) - 1) * 0.6)));
    const d = new Date(2026, 9 - i * 2, 1 + ((h >> (i + 3)) % 27));
    return {
      id: `${placeId}-demo-${i}`,
      placeId,
      author: AUTHORS[(h + i * 5) % AUTHORS.length],
      rating,
      title,
      text,
      date: d.toISOString(),
      visit: VISITS[(h + i) % VISITS.length],
    };
  });
}
