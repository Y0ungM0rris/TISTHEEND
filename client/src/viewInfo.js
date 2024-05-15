import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';

function ExhibitsList({ viewId }) {
  const [exhibits, setExhibits] = useState([]);
  const [error, setError] = useState('');
  
  // Явное определение viewId
  const explicitViewId = 1;

  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/exhibits/${explicitViewId}`);
        setExhibits(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching exhibits:', error);
        setError('Error fetching exhibits');
      }
    };

    fetchExhibits();
  }, [explicitViewId]); // Используем explicitViewId в качестве зависимости

  return (
    <div>
      <h2>Exhibits List</h2>
      {error && <p>{error}</p>}
      <ul>
        {exhibits.map(exhibit => (
          <li key={exhibit.exhibit_id}>
            <h3>{exhibit.exhibit_name}</h3>
            <p>{exhibit.exhibit_description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExhibitsList;
