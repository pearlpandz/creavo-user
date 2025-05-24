import React from 'react';
import './Modal.css'; // Create a CSS file for styling

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h4>Frame Editor</h4>
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className='modal-body'>
                    {children}
                </div>
            </div>
        </div>
    );
};


export default Modal;