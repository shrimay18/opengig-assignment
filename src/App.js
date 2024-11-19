import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './client/homepage.jsx';
import DecisionPage from './client/decisionPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/decision/:email" element={<DecisionPage />} />
            </Routes>
        </Router>
    );
}

export default App;
