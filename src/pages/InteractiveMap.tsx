import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import CityMap from '../components/ui/CityMap';
import SourceLinks from '../components/ui/SourceLinks';
import SEO from '../components/SEO';
import {
  directionsUrl,
  distanceKm,
  mapLayers,
  mapPlaces,
  searchMapPlaces,
  validatedCoordinates,
} from '../data/map';

export default function InteractiveMap() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const layers = params.getAll('layer');
  const [showMap, setShowMap] = useState(true);
  const [locationStatus, setLocationStatus] = useState('');
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const entries = useMemo(
    () => searchMapPlaces(params.get('q') ?? '', params.getAll('layer')),
    [params]
  );
  const verified = useMemo(
    () => entries.filter(item => validatedCoordinates(item.coordinates)),
    [entries]
  );
  const sorted = origin
    ? [...entries].sort((a, b) => {
        const first =
          a.coordinates && validatedCoordinates(a.coordinates)
            ? distanceKm(origin, a.coordinates)
            : Infinity;
        const second =
          b.coordinates && validatedCoordinates(b.coordinates)
            ? distanceKm(origin, b.coordinates)
            : Infinity;
        return first - second;
      })
    : entries;
  const updateQuery = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value);
    else next.delete('q');
    setParams(next, { replace: true });
  };
  const toggle = (id: string) => {
    const next = new URLSearchParams(params);
    next.delete('layer');
    (layers.includes(id)
      ? layers.filter(value => value !== id)
      : [...layers, id]
    ).forEach(value => next.append('layer', value));
    setParams(next, { replace: true });
  };
  const useLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        'Location is unavailable in this browser. Enter coordinates or search a place name.'
      );
      return;
    }
    setLocationStatus('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      position => {
        setOrigin({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus(
          'Location set for this visit. Nearby distances require verified facility coordinates.'
        );
      },
      () =>
        setLocationStatus(
          'Your location could not be obtained. Enter coordinates below or search by name.'
        ),
      { timeout: 10000, maximumAge: 60000 }
    );
  };
  return (
    <>
      <SEO
        title="Interactive map"
        description="Browse Angeles City street context and sourced place records, with clear map-layer availability."
      />
      <main id="main-content">
        <Section>
          <Breadcrumbs className="mb-6" />
          <Heading>Explore Angeles</Heading>
          <p className="max-w-3xl mb-7 text-gray-800">
            Find places in the available city records. The street map provides
            context; locations still need checking before we can place facility
            markers or give directions.
          </p>
          <div className="map-layout">
            <aside className="min-w-0">
              <div className="search-panel">
                <label htmlFor="map-search">Search locations</label>
                <input
                  id="map-search"
                  type="search"
                  value={query}
                  onChange={event => updateQuery(event.target.value)}
                  placeholder="School, office, or heritage place"
                />
                <fieldset className="mt-6">
                  <legend className="font-semibold mb-3">Map layers</legend>
                  <p className="text-sm text-gray-700 mb-4">
                    Select layers to filter the place list. Geographic data is
                    pending for every layer.
                  </p>
                  <div className="layer-list">
                    {mapLayers.map(([id, label]) => {
                      const count = mapPlaces.filter(
                        place => place.layer === id
                      ).length;
                      return (
                        <label key={id} className="layer-option">
                          <input
                            type="checkbox"
                            checked={layers.includes(id)}
                            onChange={() => toggle(id)}
                          />
                          <span>
                            {label}
                            <small>
                              {count
                                ? `${count} text records · map data pending`
                                : 'Data pending'}
                            </small>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                {(query || layers.length > 0) && (
                  <button
                    className="text-link mt-4"
                    onClick={() => setParams({})}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </aside>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-5 items-center justify-between mb-4">
                <p role="status">
                  {entries.length} place records · {verified.length} verified
                  map positions
                </p>
                <button
                  className="text-link"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? 'Use list only' : 'Show map'}
                </button>
              </div>
              {showMap && <CityMap places={verified} />}
              <div className="notice my-6">
                <p>
                  No verified jeepney paths, hazard areas, road closures, or
                  emergency facility positions are available. This map cannot
                  assess safe routes or dispatch assistance.
                </p>
              </div>
              <details className="border-b border-gray-200 pb-5 mb-6">
                <summary className="font-semibold cursor-pointer">
                  Find nearby services
                </summary>
                <p className="my-3">
                  Distance sorting becomes available as facility positions are
                  verified. Your location stays in this page for this visit.
                </p>
                <button className="action-button" onClick={useLocation}>
                  Use my location
                </button>
                <form
                  className="search-panel mt-4"
                  onSubmit={event => {
                    event.preventDefault();
                    const lat = Number(latitude);
                    const lng = Number(longitude);
                    if (
                      !latitude.trim() ||
                      !longitude.trim() ||
                      !Number.isFinite(lat) ||
                      !Number.isFinite(lng) ||
                      Math.abs(lat) > 90 ||
                      Math.abs(lng) > 180
                    ) {
                      setLocationStatus(
                        'Enter a latitude from −90 to 90 and longitude from −180 to 180.'
                      );
                      return;
                    }
                    setOrigin({ latitude: lat, longitude: lng });
                    setLocationStatus(
                      'Manual location set. No distances are estimated for unverified places.'
                    );
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        id="latitude"
                        type="text"
                        inputMode="decimal"
                        value={latitude}
                        onChange={event => setLatitude(event.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        id="longitude"
                        type="text"
                        inputMode="decimal"
                        value={longitude}
                        onChange={event => setLongitude(event.target.value)}
                      />
                    </div>
                  </div>
                  <button className="text-link mt-4">
                    Set manual location
                  </button>
                </form>
                <p role="status" className="mt-3">
                  {locationStatus}
                </p>
              </details>
              <Heading level={2} className="text-2xl md:text-2xl lg:text-2xl">
                Places and published locations
              </Heading>
              {entries.length === 0 && (
                <p className="py-6">
                  No place records match. Clear the filters or choose a layer
                  with text records. Missing data does not mean a facility or
                  route does not exist.
                </p>
              )}
              <div
                className="map-results"
                tabIndex={0}
                role="region"
                aria-label="Searchable place list"
              >
                {sorted.map(item => {
                  const directions = directionsUrl(item.coordinates);
                  return (
                    <article
                      key={item.id}
                      className="py-5 border-b border-gray-200"
                    >
                      <Heading
                        level={3}
                        className="text-xl md:text-xl lg:text-xl"
                      >
                        <Link to={item.href}>{item.name}</Link>
                      </Heading>
                      <p>{item.details}</p>
                      <p className="mt-3 text-sm text-gray-700">
                        {directions
                          ? 'Position checked against the cited location source.'
                          : 'Position not verified · directions pending'}
                      </p>
                      {directions && (
                        <a href={directions}>Get directions in Google Maps</a>
                      )}
                      {origin && validatedCoordinates(item.coordinates) && (
                        <p>
                          {distanceKm(origin, item.coordinates).toFixed(1)} km
                          straight-line distance; travel distance may differ.
                        </p>
                      )}
                      <SourceLinks ids={item.sourceIds} />
                    </article>
                  );
                })}
              </div>
              <section className="mt-8">
                <Heading level={2} className="text-2xl md:text-2xl lg:text-2xl">
                  Report a location concern
                </Heading>
                <p>
                  A city reporting destination has not been confirmed.{' '}
                  <Link to="/contact">Contact & Help</Link> links to official
                  systems and explains how to report an information correction
                  to BetterAngeles. This site does not submit city reports.
                </p>
              </section>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
