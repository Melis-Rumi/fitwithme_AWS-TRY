import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Import the AuthContext
import './Metrics.css';

const Metrics = () => {
  const { date } = useParams();
  const { token } = useContext(AuthContext); // Access the token from context
  const [metricsRecords, setMetricsRecords] = useState([]); // Stores saved metrics records
  const [formData, setFormData] = useState({
    weight: '',
    bmi: '',
    chest: '',
    waist: '',
    glutes: '',
    left_thigh: '',
    right_thigh: '',
  });

  // Fetch saved metrics records for the day
  useEffect(() => {
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }
    axios
      .get(`fitwithme.onrender.com/api/metrics/${date}/`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
      })
      .then((response) => {
        setMetricsRecords(response.data);
      })
      .catch((error) => {
        console.error('Error fetching metrics records:', error);
      });
  }, [date, token]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save the current metrics record to the database
  const handleSubmit = async () => {
    try {
      if (!token) {
        alert('You must be logged in to save metrics data.');
        return;
      }
      if (
        !formData.weight ||
        !formData.bmi ||
        !formData.chest ||
        !formData.waist ||
        !formData.glutes ||
        !formData.left_thigh ||
        !formData.right_thigh
      ) {
        alert('Please fill in all fields before saving.');
        return;
      }
      // Save the current metrics record to the backend
      await axios.post(
        'fitwithme.onrender.com/api/metrics/',
        { ...formData, date },
        { headers: { Authorization: `Bearer ${token}` } } // Include the token in the headers
      );
      // Fetch updated metrics records from the backend
      const response = await axios.get(`fitwithme.onrender.com/api/metrics/${date}/`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
      });
      setMetricsRecords(response.data);
      // Clear the form after saving
      setFormData({
        weight: '',
        bmi: '',
        chest: '',
        waist: '',
        glutes: '',
        left_thigh: '',
        right_thigh: '',
      });
      alert('Metrics data saved successfully!');
    } catch (error) {
      console.error('Error saving metrics data:', error);
    }
  };

  // Delete a metrics record
  const handleDelete = async (index) => {
    try {
      if (!token) {
        alert('You must be logged in to delete metrics data.');
        return;
      }
      const recordToDelete = metricsRecords[index];
      await axios.delete(`fitwithme.onrender.com/api/metrics/${recordToDelete.id}/`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
      });
      // Remove the deleted record from the state
      setMetricsRecords(metricsRecords.filter((_, i) => i !== index));
      alert('Metrics record deleted successfully!');
    } catch (error) {
      console.error('Error deleting metrics record:', error);
    }
  };

  return (
    <div className="metrics-container">
  <h1>Body Metrics for {date}</h1>

  {/* Saved Metrics Records Table */}
  <table className="metrics-table">
    <thead>
      <tr>
        <th>Weight (kg)</th>
        <th>BMI</th>
        <th>Chest (cm)</th>
        <th>Waist (cm)</th>
        <th>Glutes (cm)</th>
        <th>Left Thigh (cm)</th>
        <th>Right Thigh (cm)</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {metricsRecords.map((record, index) => (
        <tr key={index}>
          <td>{record.weight}</td>
          <td>{record.bmi}</td>
          <td>{record.chest}</td>
          <td>{record.waist}</td>
          <td>{record.glutes}</td>
          <td>{record.left_thigh}</td>
          <td>{record.right_thigh}</td>
          <td>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Metrics Form */}
  <div className="metrics">
    <div className="form-group">
      <label>
        Weight (kg):
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
      </label>
    </div>
    <div className="form-group">
      <label>
        BMI:
        <input type="number" name="bmi" value={formData.bmi} onChange={handleChange} />
      </label>
    </div>
    <div className="form-group">
      <label>
        Chest (cm):
        <input type="number" name="chest" value={formData.chest} onChange={handleChange} />
      </label>
    </div>
    <div className="form-group">
      <label>
        Waist (cm):
        <input type="number" name="waist" value={formData.waist} onChange={handleChange} />
      </label>
    </div>
    <div className="form-group">
      <label>
        Glutes (cm):
        <input type="number" name="glutes" value={formData.glutes} onChange={handleChange} />
      </label>
    </div>
    <div className="form-group">
      <label>
        Left Thigh (cm):
        <input type="number" name="left_thigh" value={formData.left_thigh} onChange={handleChange} />
      </label>
    </div>
    <div className="form-group">
      <label>
        Right Thigh (cm):
        <input type="number" name="right_thigh" value={formData.right_thigh} onChange={handleChange} />
      </label>
    </div>

    <button onClick={handleSubmit} className="save-matrics">Save</button>
  </div>
</div>
  );
};

export default Metrics;