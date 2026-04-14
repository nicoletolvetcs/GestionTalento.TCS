// src/components/Interview.jsx
import React from "react";
import { InterviewForm } from "./InterviewForm";

const Interview = () => {
  const handleBack = () => {
    console.log("Navegando de vuelta...");
    // Aquí podrías usar useNavigate de react-router-dom si lo tienes instalado
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pt-10">
      <InterviewForm onBack={handleBack} />
    </div>
  );
};

export default Interview;
