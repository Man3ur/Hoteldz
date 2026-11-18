import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import { IconClose, IconLocate } from '../components/Icons';
import { PlaceCard } from '../components/PlaceCard';
import { config } from '../services/config';
import { distanceKm } from '../services/location';
import { CATEGORY_LABEL, scoreOf } from '../services/places';
import { usePlaces } from '../services/usePlaces';
import { usePosition } from '../services/usePosition';
import type { Category, Coords, Place } from '../types';

const CATS: (Category | 'all')[] = ['all', 'hotel', 'restaurant', 'cafe', 'site'];

const iconCache = new Map<string, L.DivIcon>();
function pinIcon(p: Place, selected: boolean) {
  const r = scoreOf(p).rating.toFixed(1);
  const key = `${p.category}-${r}-${selected}`;
  let icon = iconCache.get(key);
  if (!icon) {
    icon = L.divIcon({
      className: '',
      html: `<div class="pin pin-${p.category}${selected ? ' selected' : ''}"><span>${r}</span></div>`,
      iconSize: [46, 30],
      iconAnchor: [23, 30],
    });
    iconCache.set(key, icon);
  }
  return icon;
}

const clusterCache = new Map<number, L.DivIcon>();
function clusterIcon(n: number) {
  let icon = clusterCache.get(n);
  if (!icon) {
    const size = n > 9 ? 44 : 38;
    icon = L.divIcon({ className: '', html: `<div class="cluster" style="width:${size}px;height:${size}px">${n}</div>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
    clusterCache.set(n, icon);
  }
  return icon;
}

/** Regroupement en grille d'écran : les repères trop proches fusionnent en une bulle. */
const CELL_PX = 56;

function ClusteredMarkers({
  places,
  zoom,
  selectedId,
  onSelect,
  onCluster,
}: {
  places: Place[];
  zoom: number;
  selectedId?: string;
  onSelect: (p: Place) => void;
  onCluster: (c: Coords & { zoom: number }) => void;
}) {
  const map = useMap();
  const groups = useMemo(() => {
    const cells = new Map<string, Place[]>();
    for (const p of places) {
      const pt = map.project([p.lat, p.lng], zoom);
      const key = `${Math.floor(pt.x / CELL_PX)}:${Math.floor(pt.y / CELL_PX)}`;
      cells.set(key, [...(cells.get(key) ?? []), p]);
    }
    return [...cells.values()];
  }, [places, zoom, map]);

  return (
    <>
      {groups.map((list) => {
        if (list.length === 1 || zoom >= 15) {
          return list.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={pinIcon(p, selectedId === p.id)}
              zIndexOffset={selectedId === p.id ? 1000 : 0}
              eventHandlers={{ click: () => onSelect(p) }}
              title={p.name}
            />
          ));
        }
        const lat = list.reduce((s, p) => s + p.lat, 0) / list.length;
        const lng = list.reduce((s, p) => s + p.lng, 0) / list.length;
        return (
          <Marker
            key={list.map((p) => p.id).join()}
            position={[lat, lng]}
            icon={clusterIcon(list.length)}
            title={`${list.length} lieux`}
            eventHandlers={{
              click: () => {
                const b = L.latLngBounds(list.map((p) => [p.lat, p.lng] as [number, number]));
                const z = Math.min(map.getBoundsZoom(b.pad(0.4)), 16);
                onCluster({ lat, lng, zoom: Math.max(z, zoom + 2) });
              },
            }}
          />
        );
      })}
    </>
  );
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({ zoomend: (e) => onZoom(e.target.getZoom()) });
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  return null;
}

function FlyTo({ target }: { target: (Coords & { zoom?: number }) | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom ?? Math.max(map.getZoom(), 14), { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function MapScreen() {
  const places = usePlaces();
  const [params] = useSearchParams();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<Place | null>(() => places.find((p) => p.id === params.get('lieu')) ?? null);
  const [flyTarget, setFlyTarget] = useState<(Coords & { zoom?: number }) | null>(selected);
  const [zoom, setZoom] = useState(5);
  const { coords, locate, loading, error } = usePosition();

  const visible = useMemo(
    () => places.filter((p) => category === 'all' || p.category === category),
    [places, category],
  );


  const onLocate = async () => {
    const c = await locate();
    if (c) setFlyTarget({ ...c });
  };

  return (
    <div className="screen map-screen">
      <MapContainer
        bounds={L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number]))}
        boundsOptions={{ padding: [40, 60] }}
        minZoom={4}
        maxBounds={[[15, -12], [40, 16]]}
        zoomControl={false}
        className="map"
        attributionControl
      >
        <TileLayer url={config.mapTilesUrl} attribution={config.mapAttribution} />
        <FlyTo target={flyTarget} />
        <ZoomWatcher onZoom={setZoom} />
        <ClusteredMarkers
          places={visible}
          zoom={zoom}
          selectedId={selected?.id}
          onSelect={setSelected}
          onCluster={(c) => setFlyTarget(c)}
        />
        {coords && (
          <CircleMarker center={[coords.lat, coords.lng]} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }} />
        )}
      </MapContainer>

      <div className="map-top">
        <div className="chips">
          {CATS.map((c) => (
            <button key={c} className={`chip elevated ${category === c ? 'on' : ''}`} onClick={() => setCategory(c)}>
              {c === 'all' ? 'Tout' : CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        {error && <p className="error small map-error">{error}</p>}
      </div>

      <button className="fab locate" onClick={onLocate} aria-label="Me localiser" disabled={loading}>
        <IconLocate size={22} />
      </button>

      <div className="map-legend small">
        {visible.length} lieux · Touchez un repère pour voir la fiche
      </div>

      {selected && (
        <div className="map-sheet" role="dialog" aria-label={selected.name}>
          <button className="sheet-close" onClick={() => setSelected(null)} aria-label="Fermer">
            <IconClose size={18} />
          </button>
          <PlaceCard place={selected} distance={coords ? distanceKm(coords, selected) : undefined} />
        </div>
      )}
    </div>
  );
}
