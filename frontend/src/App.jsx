import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout shell
import Layout from './components/Layout';

// Intelligence pages
import Dashboard from './pages/Dashboard';
import Momentum from './pages/Momentum';
import Analyst from './pages/Analyst';
import Predictor from './pages/Predictor';
import Fantasy from './pages/Fantasy';
import Simulator from './pages/Simulator';
import WarRoom from './pages/WarRoom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Dashboard Shell Layout Route */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="momentum" element={<Momentum />} />
          <Route path="analyst" element={<Analyst />} />
          <Route path="war-room" element={<WarRoom />} />
          <Route path="predictor" element={<Predictor />} />
          <Route path="fantasy" element={<Fantasy />} />
          <Route path="simulator" element={<Simulator />} />
          {/* Fallback route redirection */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
