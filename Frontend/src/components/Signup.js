import React, { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [education, setEducation] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const navigate = useNavigate();
  const handleSignup = async () => {
    // Your API endpoint
    const apiUrl = "http://127.0.0.1:5000/signup";

    try {
      console.log(apiUrl)
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          education,
        }),
      });
      console.log(response)
      if (response.ok) {
        const result = await response.json();
        console.log(result); // You can handle the response data here
        setSignedUp(true); // Set signedUp to true upon successful signup
      } else {
        console.error("Failed to signup");
        // Handle error if needed
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // Handle error if needed
    }
  };

  return (
    <div className="main-container">
      {signedUp ? (
        <div className="welcome-container">
          <h1>Welcome, {firstName}!</h1>
          <p>You have successfully signed up.</p>
        </div>
      ) : (
        <div className="login-container">
          <h1>Signup page</h1>
          <form>
            <label>
              First Name:
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
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
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </label>
            <label>
              Education:
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Enter your education"
              />
            </label>
            <button type="button" onClick={handleSignup}>
              Signup
            </button>
            {/* Add a Login button */}
            <p>
              or
            </p>
            <button type="button" onClick={()=>{navigate("/")}}>
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;
