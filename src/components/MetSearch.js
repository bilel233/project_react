import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import "./MetSearch.css";
// bibliotheques d'importation React

const MetSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const fetchData = useCallback(
    debounce(async (searchTerm) => {
      try {
        const response = await axios.get(
          "https://collectionapi.metmuseum.org/public/collection/v1/search",
          {
            params: {
              q: searchTerm,
            },
          }
        );

        const objectIds = response.data.objectIDs;
        if (objectIds && objectIds.length > 0) {
          const objectResponses = await Promise.all(
            objectIds
              .slice(0, 10)
              .map((objectId) =>
                axios.get(
                  `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
                )
              )
          );
          setResults(objectResponses.map((res) => res.data));
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm === "") {
      setResults([]);
      return;
    }

    fetchData(searchTerm);
  }, [searchTerm, fetchData]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="met-search">
      <input
        type="text"
        placeholder="Search Met Collection"
        value={searchTerm}
        onChange={handleInputChange}
        className="met-search__input"
      />
      <ul className="met-search__results">
        {results.map((item) => (
          <li key={item.objectID} className="met-search__result-item">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}; // Ajout de l'accolade fermante ici

export default MetSearch;
