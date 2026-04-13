function PopupModal({ message, onClose, isReward, rewardAmount }) {
  if (isReward) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal popup-modal" onClick={(e) => e.stopPropagation()}>
          <div className="popup-message">You've earned {rewardAmount} ⍟</div>
          <button className="button close-button" onClick={onClose}>
            Claim
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-message">{message}</div>
        <button className="button close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default PopupModal;
