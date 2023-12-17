import React, { useState } from "react";
import Home from "./Home";
import Login from "./Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import { Navigate } from 'react-router-dom';
import Header from "./Header";
import StatsPage from "./Stats";
import RandomHome from "./RandomQuiz/RandomHome";
import MainPage from "./MainPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const checkIsLoggedIn = () => {
  //   // Add your authentication logic here
  //   // For demonstration purposes, using a simple state
  //   return isLoggedIn;
  // };
  return (
    <>
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stats" element={<StatsPage></StatsPage>} />
        <Route path="/mainpage" element={<MainPage></MainPage>} />
        <Route path="/randomhome" element={<RandomHome></RandomHome>} />
        <Route
          path="/home"
          element={<Home></Home>}
          />
      </Routes>
    </Router>
          </>
  );
}
