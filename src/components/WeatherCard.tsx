import { useEffect, useState } from 'react';
import { describeWeather, getWeather } from '../services/weather';
import type { Coords, Weather } from '../types';

const day = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short' });

export function WeatherCard({ coords, label }: { coords: Coords; label: string }) {
  const [w, setW] = useState<Weather | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let alive = true;
    setW(null);
    setErr(false);
    getWeather(coords).then((d) => alive && setW(d)).catch(() => alive && setErr(true));
    return () => {
      alive = false;
    };
  }, [coords.lat, coords.lng]);

  if (err) return <div className="weather-card muted small">Météo indisponible pour le moment (connexion requise).</div>;
  if (!w) return <div className="weather-card skeleton" aria-busy="true" />;
  const now = describeWeather(w.code);
  return (
    <div className="weather-card">
      <div className="weather-now">
        <span className="weather-icon">{now.icon}</span>
        <div>
          <div className="weather-temp">{Math.round(w.temperature)}°</div>
          <div className="small muted">
            {now.label} à {label} · vent {Math.round(w.wind)} km/h
          </div>
        </div>
      </div>
      {w.daily.length > 0 && (
        <div className="weather-days">
          {w.daily.slice(1).map((d) => (
            <div key={d.date} className="weather-day">
              <span className="small muted">{day(d.date)}</span>
              <span>{describeWeather(d.code).icon}</span>
              <span className="small">
                {Math.round(d.max)}° <span className="muted">{Math.round(d.min)}°</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
