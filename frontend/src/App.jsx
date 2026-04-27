import { useState } from "react";
import LoginRegistro from "./components/LoginRegistro";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
import Interviews from "./components/InterviewForm";
import ConsultaEstado from "./components/ConsultaEstado";

// 1. IMPORTA EL COMPONENTE

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("search");

  // 1. FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    setIsAuthenticated(false); // Cambia el estado a no autenticado
    setCurrentPage("search"); // Resetea la página a la inicial
  };

  // Validación de entrada
  if (!isAuthenticated) {
    return <LoginRegistro alEntrar={() => setIsAuthenticated(true)} />;
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        userName="Nicole Tolve"
        userRole="Administrador"
        activePage={currentPage}
        onNavChange={setCurrentPage}
        onLogout={handleLogout}
      />

      <main className="p-4 md:p-6 w-full">
        {currentPage === "search" && <TalentManagement />}

        {currentPage === "register" && (
          <RegisterTalent onBack={() => setCurrentPage("search")} />
        )}

        {currentPage === "interviews" && <Interviews />}

        {currentPage === "consulta" && <ConsultaEstado />}
      </main>
    </div>
  );
}

export default App;
