/** Configuration centralisée : toutes les clés d'API passent par ici (fichier .env). */
const env = import.meta.env;

export const config = {
  weatherProvider: (env.VITE_WEATHER_PROVIDER as 'open-meteo' | 'openweather') || 'open-meteo',
  openWeatherKey: env.VITE_OPENWEATHER_API_KEY as string | undefined,
  placesSource: (env.VITE_PLACES_SOURCE as 'demo' | 'api') || 'demo',
  placesApiUrl: env.VITE_PLACES_API_URL as string | undefined,
  mapTilesUrl:
    (env.VITE_MAP_TILES_URL as string) ||
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  mapAttribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  /** Centre de l'Algérie du Nord */
  defaultCenter: { lat: 35.2, lng: 3.5 },
};
