import React, { useState, useEffect } from "react";
import axios from "axios";

const Highlight = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://collectionapi.metmuseum.org/public/collection/v1/search",
          {
            params: {
              q: "painting",
            },
          }
        );

        const objectIds = response.data.objectIDs;
        if (objectIds && objectIds.length > 0) {
          const objectResponses = await Promise.all(
            objectIds
              .slice(0, 5)
              .map((objectId) =>
                axios.get(
                  `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
                )
              )
          );
          setItems(objectResponses.map((res) => res.data));
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching featured items:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Highlight Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.objectID}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Highlight;
