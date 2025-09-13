import React from 'react';
import './WarningDialog.css';

const WarningDialog = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <p>You have reached your usage limit. Please upgrade to continue</p>
        <div className="dialog-actions">
          <button onClick={onClose}>Close</button>
          <button onClick={onUpgrade}>Upgrade</button>
        </div>
      </div>
    </div>
  );
};

export default WarningDialog;
