import {ArcLayer, ScatterplotLayer} from '@deck.gl/layers/typed';
import {MapboxOverlay, MapboxOverlayProps} from '@deck.gl/mapbox/typed';
import {useControl} from 'react-map-gl';
import Map, {NavigationControl} from 'react-map-gl';
import {scaleQuantile} from 'd3-scale';
import { useMemo } from 'react';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function DeckGLOverlay(props: MapboxOverlayProps & {
  interleaved?: boolean;
}) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export const inFlowColors = [
  // [255, 255, 204],
  // [199, 233, 180],
  [0, 255, 0],
  // [127, 205, 187],
  // [65, 182, 196],
  // [29, 145, 192],
  // [34, 94, 168],
  // [12, 44, 132]
];

export const outFlowColors = [
  // [255, 255, 178],
  // [254, 217, 118],
  [255, 0, 0],
  // [254, 178, 76],
  // [253, 141, 60],
  // [252, 78, 42],
  // [227, 26, 28],
  // [177, 0, 38]
];

type StoreData = {
  id: number,
  position: [number, number],
  value: number,
}

type ArcData = {
  source: [number, number, number],
  target: [number, number, number],
  value: number,
  gain?: number,
  quantile?: number,
}

const storeData: StoreData[] = [
  { id: 1, position: [14.288621061892725, 50.07474489404285], value: 25 },
  { id: 2, position: [14.574952246392753, 50.104041202863954], value: 25 },
  { id: 8, position: [14.470582125890278, 50.052264913903414], value: 25 },
  { id: 18, position: [14.454960940091391, 50.05215469197256], value: 25 },
  { id: 9, position: [14.404664155046612, 50.07000734337097], value: 25 },
  { id: 19, position: [14.417195435962205, 50.07099896254184], value: 25 },
  { id: 10, position: [16.60739139853013, 49.189704452276295], value: 25 },
  { id: 20, position: [16.591555635948716, 49.19621106917828], value: 25 },
  { id: 21, position: [16.612193881806625, 49.23302483562288], value: 25 },
  { id: 12, position: [17.270005310476, 49.5860716071725], value: 25 },
  { id: 3, position: [18.264439676074456, 49.81102218476692], value: 25 },
  { id: 13, position: [18.287098978551967, 49.83427932950807], value: 25 },
  { id: 4, position: [15.840617145917761, 50.20899578017983], value: 25 },
  { id: 14, position: [15.808001483206217, 50.20526034662531], value: 25 },
  { id: 5, position: [13.37927700703987, 49.729296460829474], value: 25 },
  { id: 15, position: [13.377560394578884, 49.76146473672511], value: 25 },
  { id: 6, position: [14.485562542968808, 50.09895250612975], value: 25 },
  { id: 16, position: [14.468396404728267, 50.11128374642081], value: 25 },
  { id: 7, position: [14.390462137116222, 50.102476041587316], value: 25 },
  { id: 17, position: [14.405568338767894, 50.08573693992665], value: 25 },
];

const data: ArcData[] = [];
storeData.forEach(s1 => {
  storeData.forEach(s2 => {
    if (s1.id >= s2.id) return;
    if (Math.random() < 0.5) return;
    data.push({
      source: [...s1.position, 0],
      target: [...s2.position, 0],
      value: s1.value * Math.random() * 500,
    })
  })
})

function calculateArcs(data: ArcData[]) {
  if (!data || !data.length) {
    return [];
  }
  // if (!selectedCounty) {
  //   selectedCounty = data.find(f => f.properties.name === 'Los Angeles, CA');
  // }

  const arcs = data;

  const scale = scaleQuantile()
    .domain(arcs.map(a => Math.abs(a.value)))
    .range(inFlowColors.map((c, i) => i));

  arcs.forEach(a => {
    a.gain = Math.sign(a.value);
    a.quantile = scale(Math.abs(a.value));
  });

  console.log("ARCS: ", arcs)

  return arcs;
}


// DeckGL react component
export function MapComponent() {
  const arcs = useMemo(() => calculateArcs(data), []);

  const scatterplotLayer = new ScatterplotLayer({
    id: 'my-scatterplot',
    data: storeData.map(d => ({ position: d.position, size: d.value })),
    getPosition: d => d.position,
    getRadius: d => d.size * 5,
    getFillColor: [255, 0, 0]
  });

  const arcLayer = new ArcLayer({
      id: 'arc',
      data: arcs,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: d => (d.gain > 0 ? inFlowColors : outFlowColors)[d.quantile],
      getTargetColor: d => (d.gain > 0 ? outFlowColors : inFlowColors)[d.quantile],
      getWidth: 2,
    })

  return <Map
    initialViewState={{
      latitude: 50.092,
      longitude: 14.436,
      zoom: 7
    }}/*
    initialViewState={{
      latitude: 50.087,
      longitude: 14.427,
      zoom: 12
    }}*/
    reuseMaps={true}
    style={{width: 800, height: 800}}
    mapStyle="mapbox://styles/mapbox/light-v9"
    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
  >
    <DeckGLOverlay layers={[scatterplotLayer, arcLayer]} />
    <NavigationControl />
  </Map>;
}