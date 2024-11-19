import { useState } from "react";
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const Api = "http://localhost:3000/api/login"; 
    const logindata = { email, password };

    try {
      // Send POST request to the API
      const response = await axios.post(Api, logindata);
      console.log("Login Successful", response.data);
      const name = response.data.User ? response.data.User.name : "Admin";
      
      navigate("/dashboard", { state: { name } });

    } catch (error) {
      if (error.response) {
        console.error("Login failed", error.response.data);
      } else if (error.request) {
        console.error("No Response from server", error.request);
      } else {
        console.error("Error during Login", error.message);
      }
    }

    console.log("Form submitted with data:", { email, password });

    // Clear form inputs after submission
    setEmail(""); 
    setPassword(""); 
  };

  return (
    <div className="signup-form-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>&emsp;&emsp;&emsp;    
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>&emsp;
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
