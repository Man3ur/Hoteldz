import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cover } from '../components/Cover';
import { IconBack, IconHeart, IconMap, IconPin, IconRoute, IconShare } from '../components/Icons';
import { RatingPill, Stars } from '../components/Stars';
import { WeatherCard } from '../components/WeatherCard';
import { useFavorites } from '../services/favorites';
import { distanceKm, formatDistance } from '../services/location';
import { CATEGORY_SINGULAR, getPlaceSync, priceLabel, scoreOf } from '../services/places';
import { addReview, deleteReview, reviewsFor } from '../services/reviews';
import { usePosition } from '../services/usePosition';
import type { Review } from '../types';

const VISITS: NonNullable<Review['visit']>[] = ['Famille', 'Couple', 'Solo', 'Affaires', 'Amis'];

export default function PlaceDetail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const place = getPlaceSync(id);
  const { favorites, toggle } = useFavorites();
  const { coords } = usePosition();
  const [, setVersion] = useState(0);
  const [writing, setWriting] = useState(false);

  if (!place) {
    return (
      <div className="screen empty">
        <p>Lieu introuvable.</p>
        <Link className="btn" to="/">Retour à l’accueil</Link>
      </div>
    );
  }

  const { rating, count } = scoreOf(place);
  const reviews = reviewsFor(place);
  const fav = favorites.has(place.id);
  const breakdown = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => Math.round(r.rating) === n).length }));
  const maxC = Math.max(1, ...breakdown.map((b) => b.c));
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  const share = async () => {
    const data = { title: place.name, text: `${place.name} à ${place.city}, sur Rihla` };
    try {
      if (navigator.share) await navigator.share(data);
    } catch {
      /* annulé */
    }
  };

  return (
    <div className="screen detail">
      <div className="detail-cover">
        <Cover place={place} height={240} />
        <div className="detail-actions">
          <button className="round" onClick={() => (history.length > 1 ? nav(-1) : nav('/'))} aria-label="Retour">
            <IconBack />
          </button>
          <div>
            <button className="round" onClick={share} aria-label="Partager">
              <IconShare size={20} />
            </button>
            <button className={`round ${fav ? 'fav-on' : ''}`} onClick={() => toggle(place.id)} aria-label="Favori" aria-pressed={fav}>
              <IconHeart size={20} filled={fav} />
            </button>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="eyebrow">
          {CATEGORY_SINGULAR[place.category]}
          {place.stars ? ` · ${'★'.repeat(place.stars)}` : ''}
          {place.priceLevel ? ` · ${priceLabel(place.priceLevel)}` : ''}
        </div>
        <h1>{place.name}</h1>
        <RatingPill value={rating} count={count} />
        <p className="muted address">
          <IconPin size={16} /> {place.address}, {place.city}
          {coords && ` · ${formatDistance(distanceKm(coords, place))}`}
        </p>

        <div className="action-row">
          <a className="btn" href={directions} target="_blank" rel="noreferrer">
            <IconRoute size={18} /> Itinéraire
          </a>
          <Link className="btn ghost" to={`/carte?lieu=${place.id}`}>
            <IconMap size={18} /> Sur la carte
          </Link>
        </div>

        <p className="lead">{place.description}</p>

        <div className="tags">
          {place.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <h2>Météo sur place</h2>
        <WeatherCard coords={place} label={place.city} />

        <div className="section-head">
          <h2>Avis</h2>
          <button className="link" onClick={() => setWriting((w) => !w)}>
            {writing ? 'Annuler' : 'Écrire un avis'}
          </button>
        </div>

        <div className="review-summary">
          <div className="big-score">
            <strong>{rating.toFixed(1)}</strong>
            <Stars value={rating} size={16} />
            <span className="muted small">{count.toLocaleString('fr-FR')} avis</span>
          </div>
          <div className="bars">
            {breakdown.map((b) => (
              <div key={b.n} className="bar-row">
                <span className="small">{b.n}</span>
                <div className="bar"><div style={{ width: `${(b.c / maxC) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {writing && (
          <ReviewForm
            onSubmit={(r) => {
              addReview({ ...r, placeId: place.id });
              setWriting(false);
              setVersion((v) => v + 1);
            }}
          />
        )}

        <ul className="reviews">
          {reviews.map((r) => (
            <li key={r.id} className="review">
              <div className="review-head">
                <span className="avatar">{r.author.charAt(0)}</span>
                <div>
                  <strong>{r.author}</strong>
                  <div className="muted small">
                    {new Date(r.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    {r.visit && ` · ${r.visit}`}
                  </div>
                </div>
              </div>
              <Stars value={r.rating} />
              <h4>{r.title}</h4>
              <p>{r.text}</p>
              {r.local && (
                <button
                  className="link small"
                  onClick={() => {
                    deleteReview(r.id);
                    setVersion((v) => v + 1);
                  }}
                >
                  Supprimer mon avis
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReviewForm({ onSubmit }: { onSubmit: (r: Omit<Review, 'id' | 'date' | 'local' | 'placeId'>) => void }) {
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [visit, setVisit] = useState<Review['visit']>();
  const valid = rating > 0 && author.trim() && text.trim().length >= 10;

  return (
    <form
      className="review-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSubmit({ rating, author: author.trim(), title: title.trim() || 'Mon avis', text: text.trim(), visit });
      }}
    >
      <div className="star-input" role="radiogroup" aria-label="Votre note">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} role="radio" aria-checked={rating === n} className={n <= rating ? 'on' : ''} onClick={() => setRating(n)}>
            ★
          </button>
        ))}
      </div>
      <input placeholder="Votre prénom" value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={40} />
      <input placeholder="Titre de l’avis" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
      <textarea placeholder="Racontez votre expérience (10 caractères minimum)" value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={1000} />
      <div className="chips">
        {VISITS.map((v) => (
          <button type="button" key={v} className={`chip ${visit === v ? 'on' : ''}`} onClick={() => setVisit(v)}>
            {v}
          </button>
        ))}
      </div>
      <button className="btn" disabled={!valid}>Publier</button>
    </form>
  );
}
