import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Importamos BrowserRouter solo aquí
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* ✅ Colocamos el Router aquí */}
    <App />
  </BrowserRouter>
);
