import React, { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for making HTTP requests

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (username && password) {
      setLoggedIn(true);
      navigate("/mainpage");
    }
    try {
      const response = await axios.post("/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setLoggedIn(true);
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (

    <div className="main-container">
      {loggedIn ? (
        <div className="welcome-container">
          <h1>Welcome, {username}!</h1>
          <p>You are now logged in.</p>
        </div>
      ) : (
        <div className="login-container">
          <h1>Login page</h1>
          <form>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                />
            </label>
            <button type="button" onClick={handleLogin}>
              Login
            </button>
            <p style={{ fontSize: 20 }}>or</p>
            <button type="button" onClick={()=>{navigate("/signup")}}>
              Signup
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
