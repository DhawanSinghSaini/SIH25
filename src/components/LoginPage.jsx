import React, { useState } from 'react';

// The onLogin prop is received from App.js
function LoginPage({ onLogin }) {
  // State to hold the user's input
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  // State to hold any login error messages
  const [error, setError] = useState('');

  // Dummy credentials
  const dummyUserId = 'admin';
  const dummyPassword = 'password123';

  // This function is called when the form is submitted
  const handleSubmit = (event) => {
    // Prevents the browser from reloading the page
    event.preventDefault();

    // Check if the entered credentials match the dummy credentials
    if (userId === dummyUserId && password === dummyPassword) {
      console.log('Login successful!');
      setError(''); // Clear any previous errors
      onLogin(); // Call the onLogin function to update the app state
    } else {
      // If credentials do not match, set an error message
      setError('Invalid User ID or Password. Please try again.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h3>Authorised Login</h3>
        <p className="login-instruction">Please enter your credentials to proceed.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              name="userId"
              placeholder="Enter your official ID"
              value={userId} // Bind input value to state
              onChange={(e) => setUserId(e.target.value)} // Update state on change
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password} // Bind input value to state
              onChange={(e) => setPassword(e.target.value)} // Update state on change
              required
            />
          </div>

          {/* Display the error message if it exists */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">Sign In</button>
        </form>
        
        <div className="security-notice">
          <p>
            This portal is for authorized personnel only. All activities are monitored and recorded.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;