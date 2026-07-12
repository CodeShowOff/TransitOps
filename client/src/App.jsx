import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Auth/Login';
import UserManagement from './pages/Settings/UserManagement';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
<<<<<<< HEAD
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
=======
// import Drivers from './pages/Drivers';
>>>>>>> 9146d6d ([Prashant] Added: Driver's Feat UI)

// Placeholder for other routes
const Placeholder = ({ title }) => (
  <div className="page-container">
    <h1>{title}</h1>
    <p>This module is under construction.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="/fleet" element={<Fleet />} />
<<<<<<< HEAD
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
=======
            <Route path="/drivers" element={<Placeholder title="Drivers" />} />
            <Route path="/trips" element={<Placeholder title="Trips" />} />
>>>>>>> 9146d6d ([Prashant] Added: Driver's Feat UI)
            <Route path="/maintenance" element={<Placeholder title="Maintenance" />} />
            <Route path="/fuel" element={<Placeholder title="Fuel & Expenses" />} />
            <Route path="/analytics" element={<Placeholder title="Analytics" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            <Route path="/users" element={<UserManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
