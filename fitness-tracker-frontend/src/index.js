import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import { AuthProvider } from './AuthContext';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);