import { useState } from "react";
import Login from "./Login";
import Scene from "./Scene"; // New scene component for rendering 3D model
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? <Scene /> : <Login onLogin={setIsAuthenticated} />}
    </>
  );
}

export default App;
