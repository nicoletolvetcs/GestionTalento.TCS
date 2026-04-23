import { useState } from "react";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
import Interviews from "./components/InterviewForm";
// 1. IMPORTA EL COMPONENTE
import EstadoConsulta from "./components/EstadoConsulta";

function App() {
  const [currentPage, setCurrentPage] = useState("search");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        userName="Nicole Tolve"
        userRole="Administrador"
        activePage={currentPage}
        onNavChange={setCurrentPage}
      />

      <main className="p-4 md:p-6 w-full">
        {currentPage === "search" && <TalentManagement />}

        {currentPage === "register" && (
          <RegisterTalent onBack={() => setCurrentPage("search")} />
        )}

        {currentPage === "interviews" && <Interviews />}

        {/* 2. USA EL NOMBRE CORRECTO DEL COMPONENTE */}
        {currentPage === "status" && <EstadoConsulta />}
      </main>
    </div>
  );
}

export default App;
