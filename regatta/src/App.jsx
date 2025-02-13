import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Map2D from "./Map2D";
import Scene from "./Scene";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/map" element={<Map2D />} />
      <Route path="/scene" element={<Scene />} />
    </Routes>
  );
};

export default App;
