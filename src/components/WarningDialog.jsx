import React from 'react';
import './WarningDialog.css';

const WarningDialog = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <p>Your daily download limit has been used up. Upgrade to unlock more downloads.</p>
        <div className="dialog-actions">
          <button onClick={onClose}>Close</button>
          <button onClick={onUpgrade}>Upgrade</button>
        </div>
      </div>
    </div>
  );
};

export default WarningDialog;
