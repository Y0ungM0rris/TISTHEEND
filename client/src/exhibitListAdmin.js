import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function ExhibitsListAdmin({ viewId }) {
  const [exhibits, setExhibits] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/exhibits_list_admin?viewId=${viewId}`);
        setExhibits(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching exhibits');
        setLoading(false);
      }
    };

    fetchExhibits();
  }, [viewId]);

  const handleDelete = async (exhibitId) => {
    try {
      const response = await axios.delete(`http://localhost:${PORT}/delete_exhibit`, {
        data: { exhibit_id: exhibitId }
      });
      console.log(response.data); // Опционально: выводим ответ от сервера

      const updatedExhibits = exhibits.filter(exhibit => exhibit.exhibit_id !== exhibitId);
      setExhibits(updatedExhibits);
    } catch (error) {
      console.error('Error deleting exhibit:', error);
      // Можно добавить обработку ошибок
    }
  };

  return (
    <div className="exhibitList">
      {loading ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <Alert variant='danger'>{errorMessage}</Alert>
      ) : exhibits.length === 0 ? (
        <p>No exhibits found</p>
      ) : (
        <div className="card-list">
          {exhibits.map((exhibit) => (
            <div key={exhibit.exhibit_id} className="ExhibitCard" style={{ color: 'black' }}>
              <Image src={`http://localhost:${PORT}/${exhibit.exhibit_photo}`} thumbnail alt={exhibit.exhibit_name} style={{ width: '100%', height: 'auto' }} />
              <div style={{ padding: '1rem' }}>
                <h3>{exhibit.exhibit_name}</h3>
                <p>{exhibit.exhibit_description}</p>
                <Button variant="danger" onClick={() => handleDelete(exhibit.exhibit_id)}>
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExhibitsListAdmin;
