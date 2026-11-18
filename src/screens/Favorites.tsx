import { Link } from 'react-router-dom';
import { IconHeart } from '../components/Icons';
import { PlaceCard } from '../components/PlaceCard';
import { useFavorites } from '../services/favorites';
import { usePlaces } from '../services/usePlaces';

export default function Favorites() {
  const places = usePlaces();
  const { favorites } = useFavorites();
  const list = places.filter((p) => favorites.has(p.id));
  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Favoris</h1>
      </header>
      <div className="results">
        {list.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
        {list.length === 0 && (
          <div className="empty">
            <IconHeart size={40} />
            <p>
              <strong>Pas encore de favoris</strong>
            </p>
            <p className="muted">Touchez le cœur d’un hôtel ou d’un restaurant pour le retrouver ici.</p>
            <Link className="btn" to="/recherche">
              Explorer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
