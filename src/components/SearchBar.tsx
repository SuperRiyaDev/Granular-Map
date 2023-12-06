import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.scss";
import ShareButton from "./ShareButton";

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

interface SearchComponentProp {
  selectPosition: LocationData | null;
  setSelectPosition: React.Dispatch<React.SetStateAction<LocationData | null>>;
  setRecentSearches: React.Dispatch<React.SetStateAction<LocationData[]>>;
  recentSearches: LocationData[];
  searchParam: string;
}

const NOMINATIM_BASE_URL: string =
  "https://nominatim.openstreetmap.org/search?";

const SearchBar: React.FC<SearchComponentProp> = (props) => {
  const {
    selectPosition,
    setSelectPosition,
    setRecentSearches,
    recentSearches,
    searchParam
  } = props;
  const [searchText, setSearchText] = useState<string>("");
  const [listPlace, setListPlace] = useState<LocationData[]>([]);
  // const [searchParam, setSearchParam] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params: {
      q: string;
      format: string;
      addressdetails: string;
      polygon_geojson: string;
      type: string;
    } = {
      q: searchText,
      format: "json",
      addressdetails: "1",
      polygon_geojson: "1",
      type: "administrative",
    };

    const queryString: string = new URLSearchParams(params).toString();

    fetch(`${NOMINATIM_BASE_URL}${queryString}`)
      .then((response) => response.json())
      .then((result) => {
        const parsedResult: LocationData[] = result;
        setListPlace(parsedResult);
        if (parsedResult.length > 0) {
          setSelectPosition(parsedResult[0]);
          const isAlreadyInRecentSearches = recentSearches.some(
            (search) => search.place_id === parsedResult[0].place_id
          );

          if (!isAlreadyInRecentSearches) {
            setRecentSearches((prevSearches) => [
              parsedResult[0],
              ...prevSearches.slice(0, 4),
            ]);
          }

          navigate(`/search?q=${searchText}`);
        } else {
          setSelectPosition(null);
        }
      })
      .catch((err) => console.log("err: ", err));
  };

  useEffect(() => {
    if (selectPosition) {
      const isAlreadyInRecentSearches = recentSearches.some(
        (search) => search.place_id === selectPosition.place_id
      );

      if (!isAlreadyInRecentSearches) {
        setRecentSearches((prevSearches) => [
          selectPosition,
          ...prevSearches.slice(0, 4),
        ]);
      }
    }

  }, [selectPosition, setRecentSearches]);

  return (
    <div className="searchBar-wrap">
      <div className="search-btn-wrap">
        <div className="search-li-wrap">
          <input
            name="search"
            type="text"
            placeholder="Search your location..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <div className="list-wrap">
            <ul>
              {listPlace.map((item) => (
                <li key={item.place_id}>
                  <div
                    onClick={() => {
                      setSelectPosition(item);
                      setRecentSearches((prevSearches) => [
                        item,
                        ...prevSearches.slice(0, 4),
                      ]);
                      navigate(`/search?q=${item.display_name}`);
                    }}
                  >
                    <span>{item.display_name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="btn-wrap">
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
          <ShareButton shareUrl={searchParam} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
