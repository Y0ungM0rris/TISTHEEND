import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PORT from './config';
import './App.css';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

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
                <Card key={view.view_id} view={view} />
            ))}
        </div>
    );
}

function Card({ view }) {
    const { view_id, view_name, view_description, view_photo, view_url } = view;

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:${PORT}/delete_view`, {
                data: { view_id: view_id }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error deleting view:', error);
        }
    };

    return (
        <div className="card" style={{color: "black"}}>
            {view_photo && (
                <div>
                    <Image src={`http://localhost:${PORT}/${view_photo}`} thumbnail alt="View" style={{ width: '100%', height: 'auto' }} />
                </div>
            )}
            <p>Название: {view_name}</p>
            <p>Ссылка: {view_url}</p>
            <p>Описание: {view_description}</p>
            <Button variant="danger" onClick={handleDelete}>
                Удалить
            </Button>
        </div>
    );
}

export default CardList;
