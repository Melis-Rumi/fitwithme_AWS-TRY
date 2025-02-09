import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import './TrainingProgram.css'; // Import the CSS file

const TrainingProgram = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchProgram = async (programId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/training-program/${programId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentProgram(programId);
      setWeeks(response.data.weeks);
    } catch (error) {
      console.error('Error fetching program:', error);
    }
  };

  const fetchLatestProgram = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/training-program/latest/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.program_id) {
        fetchProgram(response.data.program_id);
      }
    } catch (error) {
      console.error('Error fetching latest program:', error);
    }
  };

  const createNewProgram = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/training-program/', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentProgram(response.data.program_id);
      fetchProgram(response.data.program_id);
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const addWeek = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/training-program/${currentProgram}/add-week/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProgram(currentProgram);
    } catch (error) {
      console.error('Error adding week:', error);
    }
  };

  const navigateToTrainingDay = (dayId) => {
    navigate(`/training-day/${dayId}`);
  };

  useEffect(() => {
    fetchLatestProgram();
  }, []);

  return (
    <div className="container">
      {/* Action Buttons */}
      <div className="button-container">
        <button onClick={createNewProgram} className="action-button">
          New Training Program
        </button>
        {currentProgram && (
          <button onClick={addWeek} className="add-week-button">
            Add Week
          </button>
        )}
      </div>

      {/* Training Program Table */}
      {weeks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="program-table">
            <thead>
              <tr>
                <th>Week</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week.week_number}>
                  <td style={{fontWeight: "bold"}}>Week {week.week_number}</td>
                  {days.map((day) => (
                    <td
                      key={day}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigateToTrainingDay(week.days[day]?.id)}
                    >
                      {week.days[day]?.description || 'Rest'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-program-message">No training program available. Create a new one!</p>
      )}
    </div>
  );
};

export default TrainingProgram;