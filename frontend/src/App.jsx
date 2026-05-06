import { useState, useContext } from "react";
import LoginRegistro from "./components/LoginRegistro";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
import Interviews from "./components/InterviewForm";
import PrintCard from "./components/PrintCard";
import ProtectedRoute from './components/ProtectedRoute';
import ConsultaPublica from "./components/ConsultaCedula";
import PublicViewRegister from "./components/PublicViewRegister";
import CandidateDetail from "./components/CandidateDetail";
import { AuthContext } from "./context/AuthContext";




function App() {
  const { user, logout, loading } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("search");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const rutaPublica = window.location.pathname === '/consulta-publica';
  const rutaRegistro = window.location.pathname === '/registro-publico';


  const handleVerFicha = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("report");
  }
  const handleVerDetalle = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("candidate-detail");
  }
  const handleRellenarEntrevista = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("interviews");
  }
  // PARA CERRAR SESIÓN
  const handleLogout = () => {
    logout(); // Limpia tokens y estado del contexto
    setCurrentPage("search"); // Resetea la página a la inicial
  };


  // Validacion de ruta consulta publica
  if (rutaPublica) {
    return <ConsultaPublica />;
  }
  // Validacion de ruta registro publico
  if (rutaRegistro) {
    return <PublicViewRegister />;
  }

  // Si el contexto aún está cargando, no renderizar nada
  if (loading) return null;

  // Validación de entrada: si no hay usuario autenticado, mostrar login
  if (!user) {
    return <LoginRegistro alEntrar={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="no-print">
        <Navbar
          userName={user.nombre_completo}
          userRole={user.rol}
          activePage={currentPage}
          onNavChange={setCurrentPage}
          onLogout={handleLogout}
        />
      </div>

      <main style={{ padding: "0px 0px 0px" }}>
        {currentPage === "search" &&
          <TalentManagement onVerFicha={handleVerFicha} onVerDetalle={handleVerDetalle} onRellenarEntrevista={handleRellenarEntrevista} />}

        {/* Detalle del Candidato */}
        {currentPage === "candidate-detail" && selectedCandidate &&
          <CandidateDetail
            candidato={selectedCandidate}
            onBack={() => setCurrentPage("search")}
            onVerFicha={handleVerFicha}
            onRellenarEntrevista={handleRellenarEntrevista}
          />
        }
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
