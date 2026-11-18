import { Link, useNavigate } from 'react-router-dom';
import { CategoryGlyph, IconSearch } from '../components/Icons';
import { Wordmark } from '../components/Logo';
import { PlaceCard } from '../components/PlaceCard';
import { WeatherCard } from '../components/WeatherCard';
import { CATEGORY_LABEL, scoreOf } from '../services/places';
import { usePlaces } from '../services/usePlaces';
import type { Category } from '../types';

const DESTINATIONS = [
  { city: 'Alger', tagline: 'La Blanche', hue: 205 },
  { city: 'Oran', tagline: 'El Bahia', hue: 18 },
  { city: 'Constantine', tagline: 'Ville des ponts', hue: 32 },
  { city: 'Ghardaïa', tagline: 'Vallée du M’Zab', hue: 40 },
  { city: 'Tlemcen', tagline: 'Perle du Maghreb', hue: 150 },
  { city: 'Djanet', tagline: 'Porte du Tassili', hue: 12 },
  { city: 'Béjaïa', tagline: 'Cap Carbon', hue: 190 },
  { city: 'Timimoun', tagline: 'L’oasis rouge', hue: 8 },
];

const CATS: Category[] = ['hotel', 'restaurant', 'cafe', 'site'];

export default function Home() {
  const places = usePlaces();
  const nav = useNavigate();
  const top = [...places].sort((a, b) => scoreOf(b).rating - scoreOf(a).rating);
  const topHotels = top.filter((p) => p.category === 'hotel').slice(0, 6);
  const topFood = top.filter((p) => p.category === 'restaurant' || p.category === 'cafe').slice(0, 6);

  return (
    <div className="screen home">
      <header className="hero">
        <div className="hero-pattern" />
        <div className="hero-inner">
          <Wordmark />
          <h1>
            Marhba bik.
            <br />
            <span>Où partez-vous en Algérie ?</span>
          </h1>
          <button className="search-fake" onClick={() => nav('/recherche')}>
            <IconSearch size={20} />
            <span>Hôtel, restaurant, ville…</span>
          </button>
        </div>
      </header>

      <section className="section">
        <div className="cat-grid">
          {CATS.map((c) => (
            <Link key={c} to={`/recherche?cat=${c}`} className={`cat-tile cat-${c}`}>
              <CategoryGlyph category={c} size={26} />
              <span>{CATEGORY_LABEL[c]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <WeatherCard coords={{ lat: 36.7538, lng: 3.0588 }} label="Alger" />
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Destinations</h2>
        </div>
        <div className="h-scroll">
          {DESTINATIONS.map((d) => (
            <Link
              key={d.city}
              to={`/recherche?ville=${encodeURIComponent(d.city)}`}
              className="dest-card"
              style={{ background: `linear-gradient(160deg, hsl(${d.hue} 60% 48%), hsl(${(d.hue + 25) % 360} 55% 26%))` }}
            >
              <div className="cover-pattern" />
              <strong>{d.city}</strong>
              <span>{d.tagline}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Hôtels les mieux notés</h2>
          <Link to="/recherche?cat=hotel">Tout voir</Link>
        </div>
        <div className="h-scroll">
          {topHotels.map((p) => (
            <PlaceCard key={p.id} place={p} variant="tile" />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Bonnes tables</h2>
          <Link to="/recherche?cat=restaurant">Tout voir</Link>
        </div>
        <div className="h-scroll">
          {topFood.map((p) => (
            <PlaceCard key={p.id} place={p} variant="tile" />
          ))}
        </div>
      </section>

      <p className="demo-note">Version de démonstration : les établissements et avis affichés sont fictifs.</p>
    </div>
  );
}
