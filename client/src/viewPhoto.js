import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';

function ViewInfo({ viewId }) {
  const [viewInfo, setViewInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchViewInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/view_info?viewId=${viewId}`);
        setViewInfo(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching view information:', error);
        setError('Error fetching view information');
      }
    };

    fetchViewInfo();
  }, [viewId]);

  return (
    <div>
      {error && <p>{error}</p>}
      {viewInfo && (
        <div className='ViewHeader'>
          {viewInfo.view_photo && (
            <img src={`http://localhost:${PORT}/${viewInfo.view_photo}`} alt="View" className='ViewPhoto' />
          )}
          <div>
            <h2>{viewInfo.view_name}</h2>
            <p>{viewInfo.view_description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewInfo;
