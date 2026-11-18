import type { Coords, Weather } from '../types';
import { config } from './config';

/**
 * Météo. Par défaut Open-Meteo (gratuit, sans clé).
 * Pour OpenWeatherMap : VITE_WEATHER_PROVIDER=openweather + VITE_OPENWEATHER_API_KEY.
 */
const cache = new Map<string, { at: number; data: Weather }>();
const TTL = 30 * 60 * 1000;

export async function getWeather({ lat, lng }: Coords): Promise<Weather> {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data;
  const data =
    config.weatherProvider === 'openweather' && config.openWeatherKey
      ? await openWeather(lat, lng, config.openWeatherKey)
      : await openMeteo(lat, lng);
  cache.set(key, { at: Date.now(), data });
  return data;
}

async function openMeteo(lat: number, lng: number): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    '&current=temperature_2m,weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=4&timezone=auto';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Météo indisponible');
  const j = await res.json();
  return {
    temperature: j.current.temperature_2m,
    code: j.current.weather_code,
    wind: j.current.wind_speed_10m,
    daily: j.daily.time.map((d: string, i: number) => ({
      date: d,
      min: j.daily.temperature_2m_min[i],
      max: j.daily.temperature_2m_max[i],
      code: j.daily.weather_code[i],
    })),
  };
}

async function openWeather(lat: number, lng: number, key: string): Promise<Weather> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${key}`,
  );
  if (!res.ok) throw new Error('Météo indisponible');
  const j = await res.json();
  // Conversion simplifiée des codes OpenWeather vers les codes WMO utilisés par l'app
  const id: number = j.weather?.[0]?.id ?? 800;
  const code = id === 800 ? 0 : id > 800 ? 2 : id >= 600 && id < 700 ? 71 : id >= 500 ? 61 : id >= 200 && id < 300 ? 95 : 45;
  return { temperature: j.main.temp, code, wind: j.wind.speed * 3.6, daily: [] };
}

/** Codes météo WMO → libellé + emoji */
export function describeWeather(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Ensoleillé', icon: '☀️' };
  if (code <= 2) return { label: 'Éclaircies', icon: '🌤️' };
  if (code === 3) return { label: 'Couvert', icon: '☁️' };
  if (code <= 48) return { label: 'Brouillard', icon: '🌫️' };
  if (code <= 57) return { label: 'Bruine', icon: '🌦️' };
  if (code <= 67) return { label: 'Pluie', icon: '🌧️' };
  if (code <= 77) return { label: 'Neige', icon: '❄️' };
  if (code <= 82) return { label: 'Averses', icon: '🌦️' };
  return { label: 'Orage', icon: '⛈️' };
}
