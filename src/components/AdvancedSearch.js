import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";

const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [results, setResults] = useState([]);

  const fetchData = useCallback(
    debounce(async () => {
      try {
        const response = await axios.get(
          "https://collectionapi.metmuseum.org/public/collection/v1/search",
          {
            params: {
              q: searchTerm,
              departmentId: department,
              date: date,
              tags: tags,
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
    [searchTerm, department, date, tags]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search term"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="Department ID"
        value={department}
        onChange={handleDepartmentChange}
      />
      <input
        type="text"
        placeholder="Date"
        value={date}
        onChange={handleDateChange}
      />
      <input
        type="text"
        placeholder="Tags"
        value={tags}
        onChange={handleTagsChange}
      />
      <ul>
        {results.map((item) => (
          <li key={item.objectID}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdvancedSearch;
