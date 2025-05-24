import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    return (
        <div className="register-container">
            <div className="logo">creavo</div>
            <form className="register-form">
                <input type="text" placeholder="Full Name" className="form-input" />
                <input type="email" placeholder="Email" className="form-input" />
                <input type="password" placeholder="Password" className="form-input" />
                <button type="submit" className="form-button">Sign Up</button>
                <div className="form-links">
                    <p>Already have an account? <Link to="/login">Log in.</Link></p>

                </div>
            </form>
        </div>
    );
};

export default Register;