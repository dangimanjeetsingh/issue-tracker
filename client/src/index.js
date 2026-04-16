import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";

// Create the React root and render the whole application.
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* BrowserRouter allows us to move between pages without reloading the website. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

