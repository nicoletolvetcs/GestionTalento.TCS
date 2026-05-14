import { useState, useContext } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoginRegistro from "./components/LoginRegistro";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
import Interviews from "./components/InterviewForm";
import InterviewEvaluationView from "./components/InterviewEvaluationView";
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
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar rutas públicas
  const rutaPublica = location.pathname === '/consulta-publica';
  const rutaRegistro = location.pathname === '/registro-publico';
  // Detectar si estamos en una ruta gestionada por React Router (entrevistas/evaluar)
  const esRutaEvaluacion = location.pathname.startsWith('/entrevistas/evaluar');


  const handleVerFicha = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("report");
  }
  const handleVerDetalle = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("candidate-detail");
  }
  const handleRellenarEntrevista = (candidato) => {
    navigate(`/entrevistas/evaluar/${candidato.id_candidato}`);
  }
  // PARA CERRAR SESIÓN
  const handleLogout = () => {
    logout(); // Limpia tokens y estado del contexto
    setCurrentPage("search"); // Resetea la página a la inicial
    navigate("/");
  };

  // Sincronizar: si el usuario navega a /entrevistas directamente
  const handleNavChange = (page) => {
    setCurrentPage(page);
    if (page === "interviews") {
      navigate("/entrevistas");
    } else {
      // Resetear la URL si volvemos a una página basada en estado
      if (location.pathname !== "/") navigate("/");
    }
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
          activePage={esRutaEvaluacion ? "interviews" : currentPage}
          onNavChange={handleNavChange}
          onLogout={handleLogout}
        />
      </div>

      <main style={{ padding: "0px 0px 0px" }}>
        {/* ══════ RUTA DE EVALUACIÓN (React Router) ══════ */}
        <Routes>
          <Route
            path="/entrevistas/evaluar/:candidatoId"
            element={
              <ProtectedRoute allowedRoles={['RRHH', 'Entrevistador', 'Entrevistadores']}>
                <InterviewEvaluationView onVerFicha={handleVerFicha} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={null} />
        </Routes>

        {/* ══════ PÁGINAS BASADAS EN ESTADO (patrón existente) ══════ */}
        {!esRutaEvaluacion && (
          <>
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
              (<ProtectedRoute allowedRoles={['RRHH', 'Entrevistador', 'Entrevistadores']}>
                <Interviews onBack={() => handleNavChange("search")} onVerFicha={handleVerFicha} onVerDetalle={handleVerDetalle} />
              </ProtectedRoute>
              )}

            {/* Ficha Reporte */}
            {currentPage === "report" && <PrintCard talentData={selectedCandidate} onBack={() => setCurrentPage("search")} onVerFicha={handleVerFicha} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
