import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Pompa from './components/Pompa';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/pompa" element={<Pompa />} />
        </Routes>
      </div>
    </Router>
  )}
export default App;