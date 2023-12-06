import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polygon,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";

interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

interface LocationData {
  lat: number;
  lon: number;
  osm_id: number;
  place_id: string;
  display_name: string;
  address?: {
    city?: string;
  };
  geojson: GeoJSONPolygon;
}

interface MapComponentProps {
  selectPosition: LocationData | null;
}

const RecenterView: React.FC<MapComponentProps> = (props) => {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true,
        }
      );
    }
  }, [selectPosition]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = (props) => {
  const { selectPosition } = props;
  const [polygonCoordinates, setPolygonCoordinates] = useState<
    [number, number][]
  >([]);

  console.log("coordi", selectPosition?.geojson.coordinates);

  const position: [number, number] = selectPosition
    ? [selectPosition.lat, selectPosition.lon]
    : [42.3601, -71.0589];

  useEffect(() => {
    if (selectPosition?.geojson && selectPosition.geojson.type === "Polygon") {
      const coordinates: [number, number][] =
        selectPosition.geojson.coordinates[0].map((row) => [row[1], row[0]]);
      setPolygonCoordinates(coordinates);
    } else {
      setPolygonCoordinates([]);
    }
  }, [selectPosition]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[42.3601, -71.0589]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {selectPosition && (
          <Marker position={position}>
            <Popup>
              <div>
                <h2>{selectPosition.display_name}</h2>
                <p>{selectPosition.address && selectPosition.address.city}</p>
              </div>
            </Popup>
          </Marker>
        )}
        {selectPosition && (
          <Polygon
            pathOptions={{ color: "purple" }}
            positions={polygonCoordinates}
          >
            <Tooltip sticky>sticky Tootip for </Tooltip>
          </Polygon>
        )}
        <RecenterView selectPosition={selectPosition} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
