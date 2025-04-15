// ProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Adjust the path as needed
import { UserContext } from './UserContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useContext(UserContext); // Get userId from context
  const url = userId
    ? `https://fitwithmpt.pythonanywhere.com/api/client-profile/?__user_id=${userId}`
    : 'https://fitwithmpt.pythonanywhere.com/api/client-profile/';
  const { token } = React.useContext(AuthContext); // Access the token from context
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    contact_number: '',
    preferred_contact_method: '',
    current_weight: '',
    goal: '',
    training_experience: '',
    specific_goals: '',
    obstacles: '',
    physique_rating: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch client profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData(response.data); // Initialize form data with fetched profile
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [url, token]);

  // Handle input changes for profile
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input changes for password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError(''); // Clear any previous errors
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(formData); // Update local state with new data
      setEditMode(false); // Exit edit mode
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  // Change password
  const handlePasswordSave = async () => {
    // Reset states
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await axios.post(
        'https://fitwithmpt.pythonanywhere.com/api/change-password/',
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear password fields
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => {
        setPasswordChangeMode(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setPasswordError(error.response.data.error);
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    }
  };

  // Toggle password change section
  const togglePasswordChange = () => {
    setPasswordChangeMode(!passwordChangeMode);
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      

      {/* Profile Section */}
      {editMode ? (
        <form className="profile-form">
          <label>
            Full Name:
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </label>
          <label>
            Contact Number:
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
            />
          </label>
          <label>
            Preferred Contact Method:
            <input
              type="text"
              name="preferred_contact_method"
              value={formData.preferred_contact_method}
              onChange={handleChange}
            />
          </label>
          <label>
            Current Weight (kg):
            <input
              type="number"
              step="0.1"
              name="current_weight"
              value={formData.current_weight}
              onChange={handleChange}
            />
          </label>
          <label>
            Goal:
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
            />
          </label>
          <label>
            Training Experience:
            <input
              type="text"
              name="training_experience"
              value={formData.training_experience}
              onChange={handleChange}
            />
          </label>
          <label>
            Specific Goals:
            <textarea
              name="specific_goals"
              value={formData.specific_goals}
              onChange={handleChange}
            />
          </label>
          <label>
            Obstacles:
            <textarea
              name="obstacles"
              value={formData.obstacles}
              onChange={handleChange}
            />
          </label>
          <label>
            Physique Rating (1-10):
            <input
              type="number"
              min="1"
              max="10"
              name="physique_rating"
              value={formData.physique_rating}
              onChange={handleChange}
            />
          </label>
          <button type="button" onClick={handleSave}>
            Save Changes
          </button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <p><strong>Full Name:</strong> {profile.full_name}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Contact Number:</strong> {profile.contact_number}</p>
          <p><strong>Preferred Contact Method:</strong> {profile.preferred_contact_method}</p>
          <p><strong>Current Weight:</strong> {profile.current_weight} kg</p>
          <p><strong>Goal:</strong> {profile.goal}</p>
          <p><strong>Training Experience:</strong> {profile.training_experience}</p>
          <p><strong>Specific Goals:</strong> {profile.specific_goals}</p>
          <p><strong>Obstacles:</strong> {profile.obstacles}</p>
          <p><strong>Physique Rating:</strong> {profile.physique_rating}/10</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}

      {/* Password Change Section */}
      <div className="password-section">
        {!passwordChangeMode ? (
          <button 
            className="password-change-btn" 
            onClick={togglePasswordChange}
          >
            Change Password
          </button>
        ) : (
          <div className="password-change-form">
            <h2>Change Password</h2>
            {passwordError && <p className="error-message">{passwordError}</p>}
            {passwordSuccess && <p className="success-message">{passwordSuccess}</p>}
            <label>
              Current Password:
              <input
                type="password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              Confirm New Password:
              <input
                type="password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <div className="button-group">
              <button type="button" onClick={handlePasswordSave}>
                Update Password
              </button>
              <button type="button" onClick={togglePasswordChange}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default ProfilePage;