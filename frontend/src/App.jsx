import { useState } from "react";
import LoginRegistro from "./components/LoginRegistro";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
import Interviews from "./components/InterviewForm";
import PrintCard from "./components/PrintCard";
import ProtectedRoute from './components/ProtectedRoute';
import ConsultaPublica from "./components/ConsultaCedula";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("search");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const rutaPublica = window.location.pathname === '/consulta-publica';


  const handleVerFicha = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("report");
  }
  const handleRellenarEntrevista = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("interviews");
  }
  // PARA CERRAR SESIÓN
  const handleLogout = () => {
    setIsAuthenticated(false); // Cambia el estado a no autenticado
    setCurrentPage("search"); // Resetea la página a la inicial
  };


  // Validacion de ruta publica
  if (rutaPublica) {
    return <ConsultaPublica />;
  }

  // Validación de entrada
  if (!isAuthenticated) {
    return <LoginRegistro alEntrar={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="no-print">
        <Navbar
          userName="Nicole Tolve"
          userRole="Administrador"
          activePage={currentPage}
          onNavChange={setCurrentPage}
          onLogout={handleLogout}
        />
      </div>

      <main style={{ padding: "0px 0px 0px" }}>
        {currentPage === "search" &&
          <TalentManagement onVerFicha={handleVerFicha} onRellenarEntrevista={handleRellenarEntrevista} />}
        {currentPage === "register" && (
          <ProtectedRoute allowedRoles={['RRHH']}>
            <RegisterTalent onBack={() => setCurrentPage("search")} onverFicha={handleVerFicha} />
          </ProtectedRoute>
        )}
        {currentPage === "interviews" &&
          (<ProtectedRoute allowedRoles={['RRHH', 'Entrevistador']}>
            <Interviews onBack={() => setCurrentPage("search")} onVerFicha={handleVerFicha} />
          </ProtectedRoute>
          )}

        {/* Ficha Reporte */}
        {currentPage === "report" && <PrintCard talentData={selectedCandidate} onBack={() => setCurrentPage("search")} onVerFicha={handleVerFicha} />}


      </main>
    </div>
  );
}

export default App;
