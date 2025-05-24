import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import './App.css'
import TanstackProvider from './tanstack-query/Provider';

function App() {
    return (
        <TanstackProvider>
            <Router>
                <Routes>
                    <Route index element={<HomePage />} />
                </Routes>
            </Router>
        </TanstackProvider>
    );
}

export default App;