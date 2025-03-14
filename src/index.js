import React from "react";
import ReactDOM from "react-dom/client";  // Ensure correct import for React 18
import App from "./App";  // Ensure App import is at the top
import "bootstrap/dist/css/bootstrap.min.css";  // Ensure styles are imported after libraries

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
