import React from 'react';
import './ForgetPassword.css';

const ForgetPassword = () => {
    return (
        <div className="forget-password-container">
            <div className="logo">creavo</div>
            <form className="forget-password-form">
                <input type="email" placeholder="Email" className="form-input" />
                <button type="submit" className="form-button">Reset Password</button>
            </form>
        </div>
    );
};

export default ForgetPassword;