import { useState, useEffect } from 'react';
import { petApi } from '../services/api';

function MainView({ petState, onOpenFeed, onOpenFocus, onOpenSettings, _refreshPetState }) {
  const [hungerTime, setHungerTime] = useState({ hours: 0, minutes: 0 });
  const [remainingFocus, setRemainingFocus] = useState(0);

  useEffect(() => {
    fetchHungerTime();
    fetchRemainingFocus();

    const hungerInterval = setInterval(fetchHungerTime, 5000);
    const focusInterval = setInterval(fetchRemainingFocus, 5000);

    return () => {
      clearInterval(hungerInterval);
      clearInterval(focusInterval);
    };
  }, [petState]);

  const fetchHungerTime = async () => {
    try {
      const data = await petApi.getHungerTime();
      setHungerTime(data);
    } catch (error) {
      console.error('Error fetching hunger time:', error);
    }
  };

  const fetchRemainingFocus = async () => {
    try {
      const data = await petApi.getRemainingFocusTime();
      setRemainingFocus(data.remainingMinutes);
    } catch (error) {
      console.error('Error fetching remaining focus:', error);
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

  if (!petState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-view">
      <h1 className="greeting-text">Hi, {petState.username}</h1>
      <p className="subtitle-text">Your friend missed you</p>

      <img src={getAnimalImage(petState.animalImagePath)} alt="Pet" className="pet-image" />

      <button className="button feed-button" onClick={onOpenFeed}>
        Feed
      </button>

      <p className="goal-text">Your daily goal is {petState.focusGoal} min</p>
      <p className="goal-text">Time left {remainingFocus} min</p>

      <div className="info-container">
        <div className="info-box">
          <div className="info-number">{petState.totalTime}</div>
          <div className="info-label">total min</div>
        </div>
        <div className="info-box">
          <div className="info-number">{petState.totalTimesAte}</div>
          <div className="info-label">times ate</div>
        </div>
      </div>

      <div className="hunger-box">
        <div className="info-number">
          {hungerTime.hours}h {hungerTime.minutes}m
        </div>
        <div className="info-label">will be hungry in</div>
      </div>

      <div className="button-container">
        <button className="button focus-button" onClick={onOpenFocus}>
          Focus now
        </button>
        <button className="button settings-button" onClick={onOpenSettings}>
          <span className="settings-icon">⚙️</span>
        </button>
      </div>
    </div>
  );
}

export default MainView;
