import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import './App.css';
import Alert from 'react-bootstrap/Alert';

function ExhibitsByViewId({ viewId }) {
  const [exhibits, setExhibits] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/exhibits?viewId=${viewId}`);
        setExhibits(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching exhibits by view id');
        setLoading(false);
      }
    };

    fetchExhibits();
  }, [viewId]);

  return (
    <div className='Exhibit'>
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <Alert variant='danger'>{errorMessage}</Alert>
      ) : exhibits.length === 0 ? (
        <p>No exhibits found for the given view id</p>
      ) : (
        <div>
          <div className="exhibitList">
            {exhibits.map((exhibit) => (
              <div key={exhibit.exhibit_id} className='ExhibitCard'>
                {exhibit.exhibit_photo && (
                  <div>
                    <img src={`http://localhost:${PORT}/${exhibit.exhibit_photo}`} thumbnail alt={exhibit.exhibit_name} style={{ width: '20vw'}} />
                  </div>
                )}
                <div>
                  <h3>{exhibit.exhibit_name}</h3>
                  <p>{exhibit.exhibit_description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExhibitsByViewId;
