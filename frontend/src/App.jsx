import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/user/Home";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
