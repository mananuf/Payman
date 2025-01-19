"use client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "~~/components/LandingPage";


const App = () => {
  return (
   
      <div className="flex items-center flex-col flex-grow pt-10">
        <LandingPage/>
        
      </div>
   
  );
};

export default App;
