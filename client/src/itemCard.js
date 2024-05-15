import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import './App.css';
import Image from 'react-bootstrap/Image';

function CardList() {
    const [views, setViews] = useState([]);

    useEffect(() => {
        const fetchViews = async () => {
            try {
                const response = await axios.get(`http://localhost:${PORT}/views`);
                setViews(response.data);
            } catch (error) {
                console.error('Error fetching views:', error);
            }
        };

        fetchViews();
    }, []);

    return (
        <div className="card-list">
            {views.map(view => (
                <Card key={view.view_id} name={view.view_name} description={view.view_description} photo={view.view_photo} url={view.view_url} />
            ))}
        </div>
    );
}

function Card({ name, description, photo, url }) {
    return (
        <div className="card">
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ margin: "0 auto" }}>
                {photo && (
                    <div>
                        <Image src={`http://localhost:${PORT}/${photo}`} thumbnail alt="View" style={{ width: '20vw', height: 'auto' }} />
                    </div>
                )}
                <div style={{ paddingLeft: '3vw' }}>
                <h3>{name}</h3>
                <p>{description}</p>
                </div>
            </a>
        </div>

    );
}

export default CardList;
