import { useState, useEffect, useCallback } from 'react';
import PetService from '../services/petService';
import analytics from '../services/analytics';

function FeedModal({ petState, onClose, refreshPetState, onError }) {
  const [hungerTime, setHungerTime] = useState({ hours: 0, minutes: 0 });
  const [feeding, setFeeding] = useState(false);

  useEffect(() => {
    analytics.capture('feed_modal_opened', {
      currentMoney: petState.totalMoney,
      hungerLevel: petState.activeTimesAte,
    });
  }, [petState]);

  const updateHungerTime = useCallback(() => {
    const time = PetService.getHungerTime(petState);
    setHungerTime(time);
  }, [petState]);

  useEffect(() => {
    updateHungerTime();
    const interval = setInterval(updateHungerTime, 2500);
    return () => clearInterval(interval);
  }, [updateHungerTime]);

  const handleFeed = async () => {
    if (feeding) return;
    setFeeding(true);

    try {
      const moneyBefore = petState.totalMoney;
      await PetService.feedPet();

      analytics.capture('pet_fed', {
        moneyBefore,
        moneyAfter: moneyBefore - 50,
        totalTimesAte: petState.totalTimesAte + 1,
        animalType: petState.animalImagePath,
      });

      await refreshPetState();
      updateHungerTime();
    } catch (error) {
      analytics.capture('feed_failed', {
        reason: error.message,
        currentMoney: petState.totalMoney,
      });
      onError(error.message);
    } finally {
      setFeeding(false);
    }
  };

  const handleClose = () => {
    analytics.capture('feed_modal_closed', { fedPet: false });
    onClose();
  };

  const getAnimalImage = (imagePath) => {
    const imageMap = {
      'bear_img.png': '/images/bear.png',
      'cat_img.png': '/images/cat.png',
      'bunny_img.png': '/images/bunny.png',
      'wolf_img.png': '/images/wolf.png',
    };
    return imageMap[imagePath] || '/images/bear.png';
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              position: 'absolute',
              left: 0,
            }}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2
            style={{
              fontSize: '35px',
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
              margin: 0,
              flex: 1,
            }}
          >
            Feed Your Pet
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={getAnimalImage(petState.animalImagePath)} alt="Pet" className="pet-image" />

          <div className="money-display">{petState.totalMoney} ⍟</div>

          <div className="hunger-box">
            <div className="info-number">
              {hungerTime.hours}h {hungerTime.minutes}m
            </div>
            <div className="info-label">will be hungry in</div>
          </div>

          <button className="button feed-modal-button" onClick={handleFeed} disabled={feeding}>
            {feeding ? 'Feeding...' : `Feed ${petState.animalName} 50 ⍟`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedModal;
