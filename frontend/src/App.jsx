import { useState } from "react";
import Navbar from "./components/Navbar";
import RegisterTalent from "./components/RegisterTalent";
import TalentManagement from "./components/TalentManagment";
import { InterviewForm } from "./components/InterviewForm";

function App() {
  const [currentPage, setCurrentPage] = useState("search");

  const talentosMock = [
    { id: 1, nombre: "Carlos", apellido: "Pérez", area: "Sistemas" },
    { id: 2, nombre: "Ana", apellido: "Gómez", area: "Ventas" },
    { id: 3, nombre: "Laura", apellido: "Martínez", area: "Diseño" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
        {currentPage === "interviews" && (
          <InterviewForm
            talents={talentosMock}
            onBack={() => setCurrentPage("search")}
          />
        )}
      </main>
    </div>
  );
}

export default App;
