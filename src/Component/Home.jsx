import { useState } from "react";
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Swal from 'sweetalert2'; // Import SweetAlert2

const Home = () => {
  // State to store form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const Api = "http://localhost:3000/api/signup";
    // Prepare the signup data
    const signupdata = {
      name,
      email,
      password
    };

    try {
      // Send a POST request to the API
      const response = await axios.post(Api, signupdata);
      console.log("Signup Successful", response.data);

      // Show success message using SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful!',
        text: 'You have successfully signed up. Please log in.',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        // Navigate to the login page after success
        navigate("/login"); 
      });

    } catch (error) {
      if (error.response) {
        // Show error message using SweetAlert for signup failure
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: error.response.data.message || 'Something went wrong. Please try again.',
          confirmButtonText: 'Retry'
        });
      } else if (error.request) {
        Swal.fire({
          icon: 'error',
          title: 'No Response from Server',
          text: 'We could not connect to the server. Please try again later.',
          confirmButtonText: 'Retry'
        });
      } else {
        // Show a generic error message
        Swal.fire({
          icon: 'error',
          title: 'Error during Signup',
          text: error.message,
          confirmButtonText: 'Retry'
        });
      }
    }

    console.log("Form submitted with data:", { name, email, password });

    // Clear form inputs after submission
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="signup-form-container">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>&emsp;&emsp;&emsp;
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Home;
