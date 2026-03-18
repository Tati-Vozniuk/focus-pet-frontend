import { useState, useEffect, useCallback } from 'react';
import PetService from '../services/petService';

function FocusModal({ petState, onClose, refreshPetState, onComplete }) {
  const [sliderValue, setSliderValue] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [completed, setCompleted] = useState(false); // ← Додано прапорець

  // Використовуємо useCallback для handleComplete
  const handleComplete = useCallback(() => {
    // Перевірка: якщо вже завершено - не виконувати повторно
    if (completed) {
      return;
    }

    setTimerRunning(false);
    setCompleted(true); // ← Позначити як завершено

    try {
      PetService.completeFocusSession(sliderValue);
      refreshPetState();
      onComplete(sliderValue);
    } catch (error) {
      console.error('Error completing focus session:', error);
    }
  }, [sliderValue, refreshPetState, onComplete, completed]); // ← Додано completed

  useEffect(() => {
    let interval;
    if (timerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // НЕ викликаємо handleComplete тут напряму
            // Просто зупиняємо таймер
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRunning && remainingTime === 0) {
      // Коли таймер досяг 0 - виконати завершення
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [timerRunning, remainingTime, handleComplete]);

  const handleStart = () => {
    if (!timerRunning) {
      setRemainingTime(sliderValue * 60);
      setTimerRunning(true);
      setCompleted(false); // ← Скинути прапорець при старті
    }
  };

  const handleReset = () => {
    setTimerRunning(false);
    setRemainingTime(sliderValue * 60);
    setCompleted(false); // ← Скинути прапорець при reset
  };

  const formatTime = () => {
    if (timerRunning) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${sliderValue} min`;
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
      <div className="modal focus-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-header">Time To Focus</h2>
        
        <img 
          src={getAnimalImage(petState.animalImagePath)} 
          alt="Pet" 
          className="pet-image"
        />
        
        <div className="timer-display">{formatTime()}</div>
        
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="120"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="slider"
            disabled={timerRunning}
          />
        </div>
        
        <button 
          className="button focus-modal-button" 
          onClick={handleStart}
          disabled={timerRunning}
        >
          Focus
        </button>
        
        <button 
          className="button focus-modal-button" 
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FocusModal;