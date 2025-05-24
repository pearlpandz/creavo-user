import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header__logo">Logo</div>
            <nav className="header__nav">
                <a href="#" className="header__link">Home</a>
                <a href="#" className="header__link">About</a>
                <a href="#" className="header__link">Contact</a>
            </nav>
            <div className="header__user">
                <img src="https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg" alt="User" className="header__user-photo" />
                <span className="header__user-name">Muthupandi Velmurugan</span>
            </div>
        </header>
    );
};

export default Header;