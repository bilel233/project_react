import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import MetSearch from "./components/MetSearch";
import AdvancedSearch from "./components/AdvancedSearch";
import Highlight from "./components/Highlight";

function App() {
  return (
    <div className="App">
      <h1>Metropolitan Museum of Art Collection Search</h1>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
            <li>
              <Link to="/advanced-search">Advanced Search</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Highlight />} />
          <Route path="/search" element={<MetSearch />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
