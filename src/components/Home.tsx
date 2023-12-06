import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.scss";
import MapComponent from "./MapComponent";
import SearchBar from "./SearchBar";
import PopulationFinder from "./PopulationFinder";
import Mlogo from "../assets/Mlogo.png";

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

const Home: React.FC = () => {
  const [selectPosition, setSelectPosition] =
    React.useState<LocationData | null>(null);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [searchParam, setSearchParam] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get("q");

  useEffect(() => {
    const fetchData = async () => {
      if (q) {
        try {
          const params: {
            q: string;
            format: string;
            addressdetails: string;
            polygon_geojson: string;
            type: string;
          } = {
            q,
            format: "json",
            addressdetails: "1",
            polygon_geojson: "1",
            type: "administrative",
          };

          console.log("qfromhome", q);
          setSearchParam(
            `https://granular-maps-by-superriyadev.netlify.app/search?q=${q}`
          );
          const queryString: string = new URLSearchParams(params).toString();
          const requestOptions: { method: string; redirect?: RequestRedirect } =
            {
              method: "GET",
              redirect: "follow",
            };

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${queryString}`,
            requestOptions
          );
          const result: LocationData[] = await response.json();

          if (result && result.length > 0) {
            setSelectPosition(result[0]);
            setRecentSearches((prevSearches) =>
              Array.from(new Set([result[0], ...prevSearches.slice(0, 4)]))
            );
          } else {
            setSelectPosition(null);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [q]);

  return (
    <div>
      <div className="heading">
        <img src={Mlogo} alt="map icon" />
        <h1>Granular Maps</h1>
      </div>
      <div className="home">
        <div className="search">
          <SearchBar
            selectPosition={selectPosition}
            setSelectPosition={setSelectPosition}
            recentSearches={recentSearches}
            setRecentSearches={setRecentSearches}
            searchParam={searchParam}
          />
        </div>
        <div className="wrap">
          {selectPosition && (
            <PopulationFinder
              osm_id={selectPosition.osm_id}
              display_name={selectPosition.display_name}
            />
          )}
          <div className="map">
            <MapComponent selectPosition={selectPosition} />
          </div>
        </div>
      </div>
      <div className="recent-searches">
        <h3>Recent Searches:</h3>
        <ul>
          {recentSearches.map((search) => (
            <li key={search.place_id}>
              <button
                onClick={() => {
                  setSelectPosition(search);
                  navigate(`/search?q=${search.display_name}`);
                }}
              >
                {search.display_name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
