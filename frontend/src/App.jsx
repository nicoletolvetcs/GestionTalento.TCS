import { useState } from "react";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
// 1. Asegúrate de que el nombre del componente importado sea el que usas abajo
import Interviews from "./components/InterviewForm";

function App() {
  const [currentPage, setCurrentPage] = useState("search");

  return (
    <div className="min-h-screen bg-gray-10">
      <Navbar
        userName="Nicole Tolve"
        userRole="Administrador"
        activePage={currentPage}
        onNavChange={setCurrentPage}
      />

      <main style={{ padding: "0px 0px 0px" }}>
        {currentPage === "search" && <TalentManagement />}

        {currentPage === "register" && (
          <RegisterTalent onBack={() => setCurrentPage("search")} />
        )}

        {/* 2. CORRECCIÓN AQUÍ: Cambia "interview" por "interviews" */}
        {currentPage === "interviews" && <Interviews />}
      </main>
    </div>
  );
}

export default App;
