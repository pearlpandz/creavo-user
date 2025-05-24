import React from 'react';
import './EventCard.css';

const EventCard = ({ image, date, name }) => {
  const day = date.split('-')[2];

  return (
    <div className="event-card">
      <div className="event-card-image-container">
        <img src={image} alt={name} className="event-card-image" />
        <div className="event-card-date">{day}</div>
      </div>
      <div className="event-card-content">
        <div className="event-card-title">{name}</div>
      </div>
    </div>
  );
};

export default EventCard; 