import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Admin/Dashboard';
import SMM from './Pages/Admin/SSM'
import Login from './Pages/Admin/Login';
import StaffHead from './Pages/Admin/StaffHead';
import Zone from './Pages/Admin/Settings/Zone';
import Pre from './Pages/Admin/Pre-Visa';
import Mainpage from './Pages/Admin/Mainpage';
import FinalVisaOfficer from './Pages/Admin/FinalVisaOfficer';
import InterviewManager from './Pages/Admin/InterviewManager';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={
          <Dashboard>
            <Mainpage />
          </Dashboard>
        } />

        {/* Protected Admin Routes */}
        <Route path="/social-media-manager" element={
          <Dashboard>
            <SMM />
          </Dashboard>
        } />
        <Route path="/staffHead" element={
          <Dashboard>
            <StaffHead />
          </Dashboard>
        } />
        <Route path="/interview-manager" element={
          <Dashboard>
            <InterviewManager />
          </Dashboard>
        } />
        <Route path="/pre-visa" element={
          <Dashboard>
            <Pre />
          </Dashboard>
        } />
        <Route path="/final-visa" element={
          <Dashboard>
            <FinalVisaOfficer />
          </Dashboard>
        } />






        {/* //inner  side */}


        <Route path="/settings/zone" element={
          <Dashboard>
            <Zone />
          </Dashboard>
        } />





        {/* You can add more like this */}
        {/* <Route path="/settings" element={<Dashboard><Settings /></Dashboard>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
