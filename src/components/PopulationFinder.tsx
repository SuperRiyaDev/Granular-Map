import React, { useEffect, useState } from "react";

interface PopulationFinderProps {
  osm_id: number | undefined;
  display_name: string | undefined;
}

const PopulationFinder: React.FC<PopulationFinderProps> = ({
  osm_id,
  display_name,
}) => {
  const date: string = new Date().toLocaleDateString();
  return (
    <div>
      {osm_id !== null ? (
        <p>
          Population of {display_name}: {osm_id} updated on {date}
        </p>
      ) : (
        <p>No population data available for {display_name}</p>
      )}
    </div>
  );
};

export default PopulationFinder;
