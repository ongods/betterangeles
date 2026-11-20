import { useEffect, useRef, useState } from 'react';
import { map as createMap, tileLayer, marker, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapConfig, validatedCoordinates, type MapPlace } from '../../data/map';

const noPlaces: MapPlace[] = [];
export default function CityMap({
  places = noPlaces,
  compact = false,
}: {
  places?: MapPlace[];
  compact?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!container.current) return;
    const instance = createMap(container.current, {
      scrollWheelZoom: false,
    }).setView(mapConfig.center, mapConfig.zoom);
    let failed = false;
    let received = false;
    const timeout = window.setTimeout(() => {
      if (!received) setState('error');
    }, 12000);
    const tiles = tileLayer(mapConfig.tileUrl, {
      maxZoom: 19,
      attribution: mapConfig.attribution,
    }).addTo(instance);
    tiles.on('tileerror', () => {
      failed = true;
      setState('error');
    });
    tiles.on('tileload', () => {
      received = true;
      window.clearTimeout(timeout);
      if (!failed) setState('ready');
    });
    for (const place of places) {
      if (!validatedCoordinates(place.coordinates)) continue;
      const popup = document.createElement('a');
      popup.textContent = place.name;
      popup.href = place.href;
      marker([place.coordinates.latitude, place.coordinates.longitude], {
        title: place.name,
        icon: divIcon({
          className: 'verified-map-marker',
          html: '<span></span>',
          iconSize: [20, 20],
        }),
      })
        .bindPopup(popup)
        .addTo(instance);
    }
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(container.current);
    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
      instance.remove();
    };
  }, [places, attempt]);
  return (
    <div className="map-frame">
      <div
        ref={container}
        className={compact ? 'city-map mini-map' : 'city-map'}
        aria-label="Interactive street map of the Angeles City area"
      />
      {state === 'loading' && (
        <p className="map-status" role="status">
          Loading street map…
        </p>
      )}
      {state === 'error' && (
        <div className="map-status" role="status">
          <p>
            Map tiles could not be fully loaded. The place list remains
            available.
          </p>
          <button
            className="text-link mt-2"
            onClick={() => {
              setState('loading');
              setAttempt(value => value + 1);
            }}
          >
            Retry map
          </button>
        </div>
      )}
      <p className="text-sm text-gray-700 p-3">
        OpenStreetMap street context. Official boundaries, hazards, routes, and
        facility positions are pending.{' '}
        <a href="https://www.openstreetmap.org/#map=12/15.15/120.58333">
          Open larger street map
        </a>
        .
      </p>
    </div>
  );
}
