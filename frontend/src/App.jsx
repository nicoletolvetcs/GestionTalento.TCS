import { useState } from "react";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
import Interviews from "./components/InterviewForm";
import PrintCard from "./components/PrintCard";

function App() {
  const [currentPage, setCurrentPage] = useState("search");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleVerFicha = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("report");
  }
  const handleRellenarEntrevista = (candidato) => {
    setSelectedCandidate(candidato);
    setCurrentPage("interviews");
  }
  return (
    <div className="min-h-screen bg-gray-10">
      <div className="no-print">
        <Navbar
          userName="Nicole Tolve"
          userRole="Administrador"
          activePage={currentPage}
          onNavChange={setCurrentPage}
        />
      </div>

      <main style={{ padding: "0px 0px 0px" }}>
        {currentPage === "search" && <TalentManagement onVerFicha={handleVerFicha} onRellenarEntrevista={handleRellenarEntrevista} />}

        {currentPage === "register" && (
          <RegisterTalent onBack={() => setCurrentPage("search")} onverFicha={handleVerFicha} />
        )}
        {currentPage === "interviews" && (<Interviews onBack={() => setCurrentPage("search")} onVerFicha={handleVerFicha} />)}

        {/* Ficha Reporte */}
        {currentPage === "report" && <PrintCard talentData={selectedCandidate} onBack={() => setCurrentPage("search")} onVerFicha={handleVerFicha} />}
      </main>
    </div>
  );
}

export default App;
