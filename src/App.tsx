import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { IconHeart, IconHome, IconMap, IconSearch } from './components/Icons';
import Home from './screens/Home';
import Search from './screens/Search';
import Favorites from './screens/Favorites';
import PlaceDetail from './screens/PlaceDetail';

// La carte (Leaflet) est chargée à la demande pour un démarrage plus rapide.
const MapScreen = lazy(() => import('./screens/MapScreen'));

function TabBar() {
  const tabs = [
    { to: '/', label: 'Accueil', icon: <IconHome /> },
    { to: '/carte', label: 'Carte', icon: <IconMap /> },
    { to: '/recherche', label: 'Rechercher', icon: <IconSearch /> },
    { to: '/favoris', label: 'Favoris', icon: <IconHeart /> },
  ];
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
          {t.icon}
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function Shell() {
  const loc = useLocation();
  const nav = useNavigate();
  const isDetail = loc.pathname.startsWith('/lieu/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  // Bouton retour Android
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const sub = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack && loc.pathname !== '/') nav(-1);
      else CapApp.exitApp();
    });
    return () => {
      sub.then((s) => s.remove());
    };
  }, [loc.pathname, nav]);

  return (
    <div className={`app ${isDetail ? 'no-tabs' : ''}`}>
      <main>
        <Suspense fallback={<div className="screen loading">Chargement de la carte…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/carte" element={<MapScreen />} />
            <Route path="/recherche" element={<Search />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/lieu/:id" element={<PlaceDetail />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      {!isDetail && <TabBar />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
