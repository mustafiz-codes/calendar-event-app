import React from "react";
import logo from "./logo.svg";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Weekly from "./views/weekly";
import Monthly from "./views/monthly";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Weekly />} />
      <Route path="/monthly" element={<Monthly />} />
    </Routes>
  );
}
export default App;
