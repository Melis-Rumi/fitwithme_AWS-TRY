import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientList from './components/ClientList';
import TrainingProgram from './components/TrainingProgram';
import TrainingDay from './components/TrainingDay';
import Metrics from './components/Metrics';
import Intro from './components/Intro';
import Home from './components/Home'; // Create a Home component for the root route
import Signup from './components/Signup';
import Login from './components/Login';
import Day from './components/Day';
import Diet from './components/Diet';
import Cardio from './components/Cardio';
import Training from './components/Training';
import Progress from './components/Progress';
import Sidebar from './components/Sidebar';
import ProfilePage from './components/ProfilePage';
import './components/styles.css';

function App() {
  return (
    <Router>
      {/* Add the Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="content">
        <Routes>
          <Route path="/clients" element={<ClientList />} />
          <Route path="/" element={<Home />} /> {/* Root route */}
          <Route path="/day/:date" element={<Day />} />
          <Route path="/diet/:date" element={<Diet />} />
          <Route path="/cardio/:date" element={<Cardio />} />
          <Route path="/metrics/:date" element={<Metrics />} />
          <Route path="/training/:date" element={<Training />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/trainingprogram" element={<TrainingProgram />} />
          <Route path="/training-day/:dayId" element={<TrainingDay />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;