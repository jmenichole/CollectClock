import React, { useState, useEffect } from 'react';
import './AffiliateLinks.css';

const AffiliateLinks = () => {
  const [casinos, setCasinos] = useState([]);

  useEffect(() => {
    // Fetch casino data from the backend
    fetch('/api/casinos')
      .then((response) => response.json())
      .then((data) => setCasinos(data))
      .catch((error) => console.error('Error fetching casino data:', error));
  }, []);

  const handleCollectBonus = (casinoId) => {
    // Mark the bonus as collected
    fetch(`/api/collect/${casinoId}`, { method: 'POST' })
      .then((response) => response.json())
      .then((updatedCasino) => {
        setCasinos((prevCasinos) =>
          prevCasinos.map((casino) =>
            casino.id === updatedCasino.id ? updatedCasino : casino
          )
        );
      })
      .catch((error) => console.error('Error collecting bonus:', error));
  };

  return (
    <div className="affiliate-links">
      <h1>Casino Affiliate Links</h1>
      <ul>
        {casinos.map((casino) => (
          <li key={casino.id} className="casino-item">
            <a href={casino.link} target="_blank" rel="noopener noreferrer">
              {casino.name}
            </a>
            <button
              onClick={() => handleCollectBonus(casino.id)}
              disabled={casino.collected}
            >
              {casino.collected ? 'Collected' : 'Collect Bonus'}
            </button>
            <p>Next collection: {casino.nextCollection}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AffiliateLinks;
