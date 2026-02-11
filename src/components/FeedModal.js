import React, { useState, useEffect } from 'react';
import { petApi } from '../services/api';

function FeedModal({ petState, onClose, refreshPetState, onError }) {
  const [hungerTime, setHungerTime] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    fetchHungerTime();
    const interval = setInterval(fetchHungerTime, 2500);
    return () => clearInterval(interval);
  }, [petState]);

  const fetchHungerTime = async () => {
    try {
      const data = await petApi.getHungerTime();
      setHungerTime(data);
    } catch (error) {
      console.error('Error fetching hunger time:', error);
    }
  };

  const handleFeed = async () => {
    try {
      await petApi.feedPet();
      await refreshPetState();
      fetchHungerTime();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        onError(error.response.data.error);
      } else {
        onError("You don't have enough money to feed your pet!");
      }
    }
  };

  const getAnimalImage = (imagePath) => {
    const imageMap = {
      'bear_img.png': '/images/bear.png',
      'cat_img.png': '/images/cat.png',
      'bunny_img.png': '/images/bunny.png',
    };
    return imageMap[imagePath] || '/images/bear.png';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-header">Feed Your Pet</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={getAnimalImage(petState.animalImagePath)} 
            alt="Pet" 
            className="pet-image"
          />
          
          <div className="money-display">
            {petState.totalMoney} ⍟
          </div>
          
          <div className="hunger-box">
            <div className="info-number">{hungerTime.hours}h {hungerTime.minutes}m</div>
            <div className="info-label">will be hungry in</div>
          </div>
          
          <button className="button feed-modal-button" onClick={handleFeed}>
            Feed {petState.animalName} 50 ⍟
          </button>
          
          <button className="button feed-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedModal;