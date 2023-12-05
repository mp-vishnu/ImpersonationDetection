import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";
import Temp2 from './components/Temp2';
//import AttendInterview from "./components/AttendInterview";
 import { Route, Routes } from 'react-router-dom';
 import Register from "./components/Register";
 import Navbar from "./components/Navbar";
 import InterviewPage from "./components/InterviewPage";
 import ErrorPage from "./components/ErrorPage";
import Verifying from "./components/Verifying";
//import Verifying from "./components/Verifying";
function App() {
  return (
    <>
    <Navbar/>
     <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/attend" element={<Temp2 />} />
        <Route path="/verify/:image" element={<Verifying />} />
        <Route path="/done" element={<InterviewPage />} />
        <Route path="/error" element={<ErrorPage />} />
       
      </Routes>
    </>
  );
}

export default App;
