import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Import the AuthContext
import './Diet.css';

const Diet = () => {
  const { date } = useParams();
  const { token } = useContext(AuthContext); // Access the token from context
  const [dietRecords, setDietRecords] = useState([]); // Stores saved diet records
  const [formData, setFormData] = useState({
    total_calories: '',
    protein_intake: '',
    carbs_intake: '',
    fat_intake: '',
  });

  // Fetch saved diet records for the day
  useEffect(() => {
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/diet/${date}/`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
      })
      .then((response) => {
        setDietRecords(response.data);
      })
      .catch((error) => {
        console.error('Error fetching diet records:', error);
      });
  }, [date, token]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save the current diet record to the database
  const handleSubmit = async () => {
    try {
      if (!token) {
        alert('You must be logged in to save diet data.');
        return;
      }

      if (!formData.total_calories || !formData.protein_intake || !formData.carbs_intake || !formData.fat_intake) {
        alert('Please fill in all fields before saving.');
        return;
      }

      // Save the current diet record to the backend
      await axios.post(
        'http://127.0.0.1:8000/api/diet/',
        { ...formData, date },
        { headers: { Authorization: `Bearer ${token}` } } // Include the token in the headers
      );

      // Fetch updated diet records from the backend
      const response = await axios.get(`http://127.0.0.1:8000/api/diet/${date}/`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
      });
      setDietRecords(response.data);

      // Clear the form after saving
      setFormData({
        total_calories: '',
        protein_intake: '',
        carbs_intake: '',
        fat_intake: '',
      });

      alert('Diet data saved successfully!');
    } catch (error) {
      console.error('Error saving diet data:', error);
    }
  };

  // Delete a diet record
  const handleDelete = async (index) => {
    try {
      if (!token) {
        alert('You must be logged in to delete diet data.');
        return;
      }

      const recordToDelete = dietRecords[index];
      await axios.delete(`http://127.0.0.1:8000/api/diet/${recordToDelete.id}/`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
      });

      // Remove the deleted record from the state
      setDietRecords(dietRecords.filter((_, i) => i !== index));
      alert('Diet record deleted successfully!');
    } catch (error) {
      console.error('Error deleting diet record:', error);
    }
  };

  return (
    <div className="diet-container">
      <h1>Diet Log for {date}</h1>
      {/* Saved Diet Records Table */}
      <table className="diet-table">
        <thead>
          <tr>
            <th>Total Calories</th>
            <th>Protein Intake (g)</th>
            <th>Carbs Intake (g)</th>
            <th>Fat Intake (g)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dietRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.total_calories}</td>
              <td>{record.protein_intake}</td>
              <td>{record.carbs_intake}</td>
              <td>{record.fat_intake}</td>
              <td>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Diet Form */}
      <div className="form-group">
        <label>Total Calories:</label>
        <input
          type="number"
          name="total_calories"
          value={formData.total_calories}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Protein Intake (g):</label>
        <input
          type="number"
          name="protein_intake"
          value={formData.protein_intake}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Carbs Intake (g):</label>
        <input
          type="number"
          name="carbs_intake"
          value={formData.carbs_intake}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Fat Intake (g):</label>
        <input
          type="number"
          name="fat_intake"
          value={formData.fat_intake}
          onChange={handleChange}
        />
      </div>
      {/* Save Button */}
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default Diet;