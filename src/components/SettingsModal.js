import { useState, useEffect } from 'react';
import PetService from '../services/petService';

function SettingsModal({ petState, onClose, refreshPetState, onError }) {
  const [username, setUsername] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [focusGoal, setFocusGoal] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('bear_img.png');
  
  const [usernameError, setUsernameError] = useState('');
  const [animalNameError, setAnimalNameError] = useState('');
  const [goalError, setGoalError] = useState('');

  useEffect(() => {
    if (petState) {
      setUsername(petState.username);
      setAnimalName(petState.animalName);
      setFocusGoal(String(petState.focusGoal));
      setSelectedAnimal(petState.animalImagePath);
    }
  }, [petState]);

  const validateUsername = (value) => {
    if (value && value.includes(' ')) {
      setUsernameError('Must be a single word');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateAnimalName = (value) => {
    if (value && value.includes(' ')) {
      setAnimalNameError('Must be a single word');
      return false;
    }
    setAnimalNameError('');
    return true;
  };

  const validateGoal = (value) => {
    if (value && !/^\d+$/.test(value)) {
      setGoalError('Numbers only');
      return false;
    }
    if (value && parseInt(value) <= 0) {
      setGoalError('Must be positive');
      return false;
    }
    setGoalError('');
    return true;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  const handleAnimalNameChange = (e) => {
    const value = e.target.value;
    setAnimalName(value);
    validateAnimalName(value);
  };

  const handleGoalChange = (e) => {
    const value = e.target.value;
    setFocusGoal(value);
    validateGoal(value);
  };

  const handleAnimalChange = (e) => {
    const animalMap = {
      'Bear': 'bear_img.png',
      'Cat': 'cat_img.png',
      'Bunny': 'bunny_img.png',
    };
    setSelectedAnimal(animalMap[e.target.value]);
  };

  const handleSave = () => {
    const isUsernameValid = validateUsername(username);
    const isAnimalNameValid = validateAnimalName(animalName);
    const isGoalValid = validateGoal(focusGoal);

    if (!isUsernameValid || !isAnimalNameValid || !isGoalValid) {
      onError('Please fix the validation errors before saving');
      return;
    }

    if (!username.trim()) {
      onError('Username cannot be empty');
      return;
    }

    if (!animalName.trim()) {
      onError('Animal name cannot be empty');
      return;
    }

    if (!focusGoal.trim()) {
      onError('Daily focus goal cannot be empty');
      return;
    }

    try {
      PetService.updateSettings({
        username: username.trim(),
        animalName: animalName.trim(),
        focusGoal: parseInt(focusGoal),
        animalImagePath: selectedAnimal,
      });
      refreshPetState();
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      onError('Failed to save settings');
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

  const getCurrentAnimalName = () => {
    const nameMap = {
      'bear_img.png': 'Bear',
      'cat_img.png': 'Cat',
      'bunny_img.png': 'Bunny',
    };
    return nameMap[selectedAnimal] || 'Bear';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-header">Settings</h2>
        
        <img 
          src={getAnimalImage(selectedAnimal)} 
          alt="Pet" 
          className="pet-image"
        />
        
        <select 
          className="animal-selector"
          value={getCurrentAnimalName()}
          onChange={handleAnimalChange}
        >
          <option>Bear</option>
          <option>Cat</option>
          <option>Bunny</option>
        </select>
        
        <label className="input-label">Your name</label>
        <input
          type="text"
          className="input-field"
          placeholder="single word only"
          value={username}
          onChange={handleUsernameChange}
        />
        {usernameError && <div className="validation-error">{usernameError}</div>}
        
        <label className="input-label">Animal name</label>
        <input
          type="text"
          className="input-field"
          placeholder="single word only"
          value={animalName}
          onChange={handleAnimalNameChange}
        />
        {animalNameError && <div className="validation-error">{animalNameError}</div>}
        
        <label className="input-label">Daily focus goal (min)</label>
        <input
          type="text"
          className="input-field"
          placeholder="numbers only"
          value={focusGoal}
          onChange={handleGoalChange}
        />
        {goalError && <div className="validation-error">{goalError}</div>}
        
        <button className="button save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;