import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import VehicleEntry from './pages/VehicleEntry';
import VehicleExit from './pages/VehicleExit';
import Sessions from './pages/Sessions';
import BlockList from './pages/BlockList';
import Users from './pages/Users';
import { ParkingProvider } from './context/ParkingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ParkingProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entry" element={<VehicleEntry />} />
            <Route path="/exit" element={<VehicleExit />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/blocklist" element={<BlockList />} />
            <Route path="/users" element={<Users />} />
            <Route path="/payments" element={<Sessions />} />
            <Route path="/settings" element={<Dashboard />} />
          </Routes>
        </Layout>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </ParkingProvider>
  );
}

export default App;