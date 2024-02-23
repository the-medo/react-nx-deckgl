import {ScatterplotLayer} from '@deck.gl/layers/typed';
import {MapboxOverlay, MapboxOverlayProps} from '@deck.gl/mapbox/typed';
import {useControl} from 'react-map-gl';
import Map, {NavigationControl} from 'react-map-gl';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function DeckGLOverlay(props: MapboxOverlayProps & {
  interleaved?: boolean;
}) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

// DeckGL react component
export function MapComponent() {
  const scatterplotLayer = new ScatterplotLayer({
    id: 'my-scatterplot',
    data: [
      {position: [50.087, 14.427], size: 50},
      // {position: [50.08826637427358, 14.432054876751296], size: 50},
      // {position: [50.092107321258716, 14.436298131354246], size: 50},
    ],
    getPosition: d => d.position,
    getRadius: d => d.size,
    getFillColor: [255, 0, 0]
  });

  return <Map
    initialViewState={{
      latitude: 50.087,
      longitude: 14.427,
      zoom: 12
    }}
    style={{width: 800, height: 800}}
    mapStyle="mapbox://styles/mapbox/light-v9"
    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
  >
    <DeckGLOverlay layers={[scatterplotLayer]} />
    <NavigationControl />
  </Map>;
}