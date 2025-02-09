import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './Progress.css';
import { AuthContext } from '../AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Progress = () => {
  const navigate = useNavigate(); // Use the hook here
  const { token } = useContext(AuthContext);
  const [expandedSection, setExpandedSection] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [dietData, setDietData] = useState([]);
  const [cardioData, setCardioData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedNutrient, setSelectedNutrient] = useState('total_calories');

  useEffect(() => {
    // Check for token immediately when component mounts
    if (!token) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  // Fetch data for all sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return; // Skip the API calls if there's no token

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const dietResponse = await axios.get(
          `http://127.0.0.1:8000/api/progress/diet/?range=${timeRange}`,
          { headers }
        );
        setDietData(dietResponse.data || []);

        const cardioResponse = await axios.get(
          `http://127.0.0.1:8000/api/progress/cardio/?range=${timeRange}`,
          { headers }
        );
        setCardioData(cardioResponse.data || []);

        const trainingResponse = await axios.get(
          `http://127.0.0.1:8000/api/progress/training/?range=${timeRange}`,
          { headers }
        );
        setTrainingData(trainingResponse.data || []);

        const metricsResponse = await axios.get(
          `http://127.0.0.1:8000/api/progress/metrics/?range=${timeRange}`,
          { headers }
        );
        setMetricsData(metricsResponse.data || []);
      } catch (error) {
        if (error.response?.status === 401) {
          console.error( error);
        } else {
          console.error('Error fetching progress data:', error);
        }
      }
    };

    fetchData();
  }, [timeRange, token, navigate]);

  // Update selectedExercise when trainingData changes
  useEffect(() => {
    if (trainingData.length > 0) {
      const uniqueExercises = [...new Set(
        trainingData
          .filter(record => record.exercise && typeof record.exercise === 'string')
          .map(record => record.exercise.trim().toLowerCase())
      )];
      if (uniqueExercises.length > 0) {
        setSelectedExercise(uniqueExercises[0]);
      }
    }
  }, [trainingData]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Helper function to sort data by date
  const sortByDate = (data) => {
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Prepare chart data for Diet
  const getDietChartData = () => {
    const sortedData = sortByDate(dietData); // Sort data by date
    return {
      labels: sortedData.map((record) => new Date(record.date)), // Convert to Date objects
      datasets: [
        {
          label: selectedNutrient,
          data: sortedData.map((record) => record[selectedNutrient]),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  };

  // Prepare chart data for Cardio
  const getCardioChartData = () => {
    const sortedData = sortByDate(cardioData); // Sort data by date
    return {
      labels: sortedData.map((record) => new Date(record.date)), // Convert to Date objects
      datasets: [
        {
          label: 'Total Duration (minutes)',
          data: sortedData.map((record) => record.total_duration || 0),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
      ],
    };
  };

  // Prepare chart data for Training
  const getTrainingChartData = () => {
    const filteredData = trainingData.filter(
      (record) => record.exercise.trim().toLowerCase() === selectedExercise
    );
    const sortedData = sortByDate(filteredData); // Sort data by date
    return {
      labels: sortedData.map((record) => new Date(record.date)), // Convert to Date objects
      datasets: [
        {
          label: `Weight (${selectedExercise})`,
          data: sortedData.map((record) => record.weight || 0),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
      ],
    };
  };

  // Prepare chart data for Metrics
  const getMetricsChartData = () => {
    const sortedData = sortByDate(metricsData); // Sort data by date
    return {
      labels: sortedData.map((record) => new Date(record.date)), // Convert to Date objects
      datasets: [
        {
          label: selectedMetric,
          data: sortedData.map((record) => record[selectedMetric] || 0),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progress Over Time',
      },
    },
    scales: {
      x: {
        type: 'time', // Use a time scale for the x-axis
        time: {
          unit: 'day', // Display dates by day
          tooltipFormat: 'MMM d, yyyy', // Format for tooltips
          displayFormats: {
            day: 'MMM d', // Format for x-axis labels
          },
        },
        ticks: {
          maxRotation: 90, // Rotate labels vertically
          minRotation: 90,
        },
      },
      y: {
        beginAtZero: true, // Start the y-axis at zero
      },
    },
  };

  return (
    <div className="progress-container">
      <h1>Progress Tracker</h1>
      {/* Time Range Selector */}
      <div className="time-range-selector">
        <label>Time Range:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="month">1 Month</option>
          <option value="3months">3 Months</option>
          <option value="6months">6 Months</option>
          <option value="year">1 Year</option>
        </select>
      </div>
      {/* Diet Section */}
      <button onClick={() => toggleSection('diet')}>Diet</button>
      {expandedSection === 'diet' && (
        <div className="chart-section">
          <label>Select Nutrient:</label>
          <select value={selectedNutrient} onChange={(e) => setSelectedNutrient(e.target.value)}>
            <option value="total_calories">Calories</option>
            <option value="protein_intake">Protein</option>
            <option value="carbs_intake">Carbs</option>
            <option value="fat_intake">Fat</option>
          </select>
          {dietData.length > 0 ? (
            <Line data={getDietChartData()} options={chartOptions} />
          ) : (
            <p>No diet data available for this time range.</p>
          )}
        </div>
      )}
      {/* Cardio Section */}
      <button onClick={() => toggleSection('cardio')}>Cardio</button>
      {expandedSection === 'cardio' && (
        <div className="chart-section">
          {cardioData.length > 0 ? (
            <Line data={getCardioChartData()} options={chartOptions} />
          ) : (
            <p>No cardio data available for this time range.</p>
          )}
        </div>
      )}
      {/* Training Section */}
      <button onClick={() => toggleSection('training')}>Training</button>
      {expandedSection === 'training' && (
        <div className="chart-section">
          <label>Select Exercise:</label>
          <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
            {trainingData.length > 0 ? (
              [...new Set(
                trainingData
                  .filter(record => record.exercise && typeof record.exercise === 'string')
                  .map(record => record.exercise.trim().toLowerCase())
              )].map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
                </option>
              ))
            ) : (
              <option value="">No exercises available</option>
            )}
          </select>
          {trainingData.filter((record) => record.exercise.trim().toLowerCase() === selectedExercise).length > 0 ? (
            <Line data={getTrainingChartData()} options={chartOptions} />
          ) : (
            <p>No training data available for the selected exercise.</p>
          )}
        </div>
      )}
      {/* Metrics Section */}
      <button onClick={() => toggleSection('metrics')}>Body Metrics</button>
      {expandedSection === 'metrics' && (
        <div className="chart-section">
          <label>Select Metric:</label>
          <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <option value="weight">Weight</option>
            <option value="bmi">BMI</option>
            <option value="chest">Chest</option>
            <option value="waist">Waist</option>
            <option value="glutes">Glutes</option>
            <option value="left_thigh">Left Thigh</option>
            <option value="right_thigh">Right Thigh</option>
          </select>
          {metricsData.length > 0 ? (
            <Line data={getMetricsChartData()} options={chartOptions} />
          ) : (
            <p>No metrics data available for this time range.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Progress;