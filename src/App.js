import React, { useState, useEffect } from 'react';
import './App.css';
import MainView from './components/MainView';
import FeedModal from './components/FeedModal';
import FocusModal from './components/FocusModal';
import SettingsModal from './components/SettingsModal';
import PopupModal from './components/PopupModal';
import { petApi } from './services/api';

function App() {
  const [petState, setPetState] = useState(null);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [showFocusModal, setShowFocusModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchPetState();
  }, []);

  const fetchPetState = async () => {
    try {
      const data = await petApi.getPetState();
      setPetState(data);
    } catch (error) {
      console.error('Error fetching pet state:', error);
      showError('Failed to load pet data. Please refresh the page.');
    }
  };

  const showError = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const showSuccess = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleFocusComplete = (minutes) => {
    setShowFocusModal(false);
    showSuccess(`You've earned ${minutes} ⍟`);
  };

  return (
    <div className="app-container">
      <MainView
        petState={petState}
        onOpenFeed={() => setShowFeedModal(true)}
        onOpenFocus={() => setShowFocusModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        refreshPetState={fetchPetState}
      />

      {showFeedModal && petState && (
        <FeedModal
          petState={petState}
          onClose={() => setShowFeedModal(false)}
          refreshPetState={fetchPetState}
          onError={showError}
        />
      )}

      {showFocusModal && petState && (
        <FocusModal
          petState={petState}
          onClose={() => setShowFocusModal(false)}
          refreshPetState={fetchPetState}
          onComplete={handleFocusComplete}
        />
      )}

      {showSettingsModal && petState && (
        <SettingsModal
          petState={petState}
          onClose={() => setShowSettingsModal(false)}
          refreshPetState={fetchPetState}
          onError={showError}
        />
      )}

      {showPopup && (
        <PopupModal
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default App;