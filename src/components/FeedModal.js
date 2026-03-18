import { useState, useEffect, useCallback } from 'react';
import PetService from '../services/petService';

function FeedModal({ petState, onClose, refreshPetState, onError }) {
  const [hungerTime, setHungerTime] = useState({ hours: 0, minutes: 0 });

  // Використовуємо useCallback
  const updateHungerTime = useCallback(() => {
    const time = PetService.getHungerTime(petState);
    setHungerTime(time);
  }, [petState]);

  useEffect(() => {
    updateHungerTime();
    const interval = setInterval(updateHungerTime, 2500);
    return () => clearInterval(interval);
  }, [updateHungerTime]);

  const handleFeed = () => {
    try {
      PetService.feedPet();
      refreshPetState();
      updateHungerTime();
    } catch (error) {
      onError(error.message);
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
          <img src={getAnimalImage(petState.animalImagePath)} alt="Pet" className="pet-image" />

          <div className="money-display">{petState.totalMoney} ⍟</div>

          <div className="hunger-box">
            <div className="info-number">
              {hungerTime.hours}h {hungerTime.minutes}m
            </div>
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
