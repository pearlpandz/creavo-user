import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="logo">creavo</div>
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required />
                </div>
                <div className="form-group">
                    <button type="submit" className="login-button">Login</button>
                </div>
                <div className="form-links">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                    <p><Link to="/forget-password">Forgot your password?</Link></p>

                </div>
            </form>
        </div>
    );
};

export default Login;