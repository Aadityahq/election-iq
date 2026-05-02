import React from 'react';
import { useState } from "react";
import "../styles/CountrySelector.css";

const COUNTRIES = [
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    election: "Lok Sabha Elections",
    url: "https://eci.gov.in",
    color: "#FF9933",
    description: "Election Commission of India",
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    election: "Presidential & Congressional",
    url: "https://vote.gov",
    color: "#3C3B6E",
    description: "U.S. Vote Foundation",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    election: "General Elections",
    url: "https://www.electoralcommission.org.uk",
    color: "#012169",
    description: "Electoral Commission UK",
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    election: "Federal Elections",
    url: "https://www.aec.gov.au",
    color: "#00008B",
    description: "Australian Electoral Commission",
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    election: "Federal Elections",
    url: "https://www.elections.ca",
    color: "#FF0000",
    description: "Elections Canada",
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    election: "Bundestagswahl",
    url: "https://www.bundeswahlleiterin.de",
    color: "#000000",
    description: "Federal Returning Officer",
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    election: "Élections Présidentielles",
    url: "https://www.conseil-constitutionnel.fr",
    color: "#002395",
    description: "Conseil Constitutionnel",
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    election: "General Elections",
    url: "https://www.soumu.go.jp/senkyo",
    color: "#BC002D",
    description: "Ministry of Internal Affairs",
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    election: "Eleições Gerais",
    url: "https://www.tse.jus.br",
    color: "#009C3B",
    description: "Tribunal Superior Eleitoral",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    election: "National Elections",
    url: "https://www.elections.org.za",
    color: "#007A4D",
    description: "Electoral Commission of SA",
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    election: "General Elections",
    url: "https://elections.nz",
    color: "#00247D",
    description: "Electoral Commission NZ",
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    election: "General Elections",
    url: "https://www.eld.gov.sg",
    color: "#EF3340",
    description: "Elections Department Singapore",
  },
];

export default function CountrySelector() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.election.toLowerCase().includes(search.toLowerCase())
  );

  const handleVisit = () => {
    if (selected) {
      window.open(selected.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="country-selector-section">
      <div className="country-selector-header">
        <span className="country-selector-badge">🌍 Global Elections</span>
        <h2 className="country-selector-title">
          Explore Elections Worldwide
        </h2>
        <p className="country-selector-subtitle">
          Select a country to visit its official election commission website
        </p>

       <div className="country-search-wrapper">
         <span className="country-search-icon">🔍</span>
         <input
           className="country-search-input"
           type="text"
           placeholder="Search countries..."
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
         {search && (
           <button
             className="country-search-clear"
             onClick={() => setSearch("")}
           >
             &times;
           </button>
         )}
       </div>
      </div>

      <div className="country-grid">
        {filtered.length === 0 && (
          <div className="country-empty">
            <span>🌐</span>
             <p>No countries found for &quot;{search}&quot;</p>
          </div>
        )}
        {filtered.map((country) => (
          <button
            key={country.code}
            className={`country-card ${selected?.code === country.code ? "country-card--selected" : ""}`}
            onClick={() =>
              setSelected(selected?.code === country.code ? null : country)
            }
          >
            <span className="country-flag">{country.flag}</span>
            <span className="country-name">{country.name}</span>
            <span className="country-election">{country.election}</span>
            {selected?.code === country.code && (
              <span className="country-check">✓</span>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="country-action-bar">
          <div className="country-action-info">
            <span className="country-action-flag">{selected.flag}</span>
            <div>
              <p className="country-action-name">{selected.name}</p>
              <p className="country-action-desc">{selected.description}</p>
            </div>
          </div>
          <button className="country-visit-btn" onClick={handleVisit}>
            Visit Official Site
            <span className="country-visit-arrow">→</span>
          </button>
        </div>
      )}
    </section>
  );
}
