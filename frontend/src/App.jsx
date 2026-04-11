import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Navbar from "./components/Navbar";
import TalentSearch from "./components/TalentSearch";
import TalentTable from "./components/TalentTable";
import RegisterTalent from "./components/RegisterTalent";

const initialTalents = [
  {
    id: 1,
    nombre: "Carlos Pérez",
    apellido: "Martínez",
    email: "carlos.perez@example.com",
    telefono: "+595123456789",
    area: "Tecnología",
    especialidades: ["Frontend", "React"],
    experiencia: 4,
    salario: 3500,
    currency: "USD",
    ubicacion: "Asunción, PY",
    estatus: "Elegible",
  },
  {
    id: 2,
    nombre: "Ana López",
    apellido: "Gómez",
    email: "ana.lopez@example.com",
    telefono: "+595987654321",
    area: "Marketing",
    especialidades: ["SEO", "Content"],
    experiencia: 3,
    salario: 2800,
    currency: "USD",
    ubicacion: "Asunción, PY",
    estatus: "En Cartera",
  },
  {
    id: 3,
    nombre: "Luis García",
    apellido: "Ruiz",
    email: "luis.garcia@example.com",
    telefono: "+595998877665",
    area: "Tecnología",
    especialidades: ["Backend", "DevOps"],
    experiencia: 6,
    salario: 4200,
    currency: "USD",
    ubicacion: "Ciudad del Este, PY",
    estatus: "Pendiente",
  },
  {
    id: 4,
    nombre: "Mar�a Rodríguez",
    apellido: "Fernández",
    email: "maria.rodriguez@example.com",
    telefono: "+595112233445",
    area: "Diseño",
    especialidades: ["UI/UX"],
    experiencia: 5,
    salario: 3000,
    currency: "USD",
    ubicacion: "Encarnación, PY",
    estatus: "No Elegible",
  },
];

function App() {
  const [activePage, setActivePage] = useState("search");
  const [talents, setTalents] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("sgth-talents");
      return stored ? JSON.parse(stored) : initialTalents;
    }
    return initialTalents;
  });

  const [filteredTalents, setFilteredTalents] = useState(talents);
  const [searchFilters, setSearchFilters] = useState({
    area: "",
    specialty: "",
    salary: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sgth-talents", JSON.stringify(talents));
    }
    setFilteredTalents(filterTalents(searchFilters, talents));
  }, [talents, searchFilters]);

  const filterTalents = (filters, list = talents) => {
    const area = filters.area?.trim();
    const specialty = filters.specialty?.trim().toLowerCase();
    const maxSalary = Number(filters.salary || 0);

    return list.filter((talent) => {
      if (area && talent.area !== area) return false;
      if (
        specialty &&
        !talent.especialidades.some((esp) =>
          esp.toLowerCase().includes(specialty),
        )
      ) {
        return false;
      }
      if (maxSalary > 0 && Number(talent.salario) > maxSalary) return false;
      return true;
    });
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setFilteredTalents(filterTalents(filters, talents));
  };

  const handleRegister = (newTalent) => {
    const talent = {
      id: Date.now(),
      ...newTalent,
      estatus: "Pendiente",
    };

    const nextTalents = [talent, ...talents];
    setTalents(nextTalents);
    setSearchFilters({ area: "", specialty: "", salary: "" });
    setFilteredTalents(nextTalents);
    setActivePage("search");
  };

  const handleViewTalent = (talent) => {
    const ficha = `
FICHA DE REGISTRO DE TALENTO

Código de Proceso: ${buildProcessCode(talent)}
Fecha de Generación: ${formatDate(new Date())}

I. INFORMACIÓN GENERAL DEL CANDIDATO

Nombre Completo: ${talent.nombre} ${talent.apellido || ""}
Identificación: DNI ${String(talent.id).padStart(8, "0")}
Email: ${talent.email || "-"}
Teléfono: ${talent.telefono || "-"}
Ubicación: ${talent.ubicacion || "-"}

II. PERFIL PROFESIONAL Y ASPIRACIÓN

Área: ${talent.area}
Especialidades: ${talent.especialidades?.join(", ") || "-"}
Experiencia: ${talent.experiencia ? `${talent.experiencia} años` : "-"}
Salario esperado: ${talent.currency ? `$${talent.salario.toLocaleString()} ${talent.currency}` : "-"}
Disponibilidad: Inmediata

III. DOCUMENTACIÓN ADJUNTA (Checklist)

[X] Documento de Identidad (Escaneado)
[X] Referencias Personales (Verificadas: SÍ)
[X] Currículum Vitae / Portafolio

IV. EVALUACIÓN DE LA ENTREVISTA

Datos del Entrevistador: Nicole Tolve
Área Relacionada: Administrador

Notas de la Entrevista:
Candidato con buena comunicación y habilidades técnicas. Se recomienda avance para entrevista Técnica.

Puntuación de Competencias:
Técnica: ?????
comunicación: ?????
Interés: ?????

V. DICTAMEN FINAL

Estatus de Elegibilidad: ${talent.estatus}

Observaciones de Cierre:
${talent.estatus === "Elegible" ? "Candidato altamente recomendado para proceso de selecci�n." : talent.estatus === "Pendiente" ? "Se requiere EVALUACIÓN adicional en entrevista." : "No cumple los criterios para este proceso."}
    `;
    alert(ficha);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const buildProcessCode = (talent) => {
    return `SGTH-${String(talent.id).padStart(6, "0")}`;
  };

  const handleDownloadPdf = (talent) => {
    const doc = new jsPDF({ unit: "px", format: "a4" });
    const titleX = 40;
    const contentX = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("FICHA DE REGISTRO DE TALENTO", titleX, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Sistema de Gestión de Talento Humano", titleX, 65);
    doc.text(`Código de Proceso: ${buildProcessCode(talent)}`, 420, 50);
    doc.text(`Fecha de Generación: ${formatDate(new Date())}`, 420, 65);

    doc.setLineWidth(0.7);
    doc.line(contentX, 75, 555, 75);

    const section = (label, value, top) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(label, contentX, top);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(value, contentX, top + 14);
    };

    const profileTop = 95;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("I. INFORMACIÓN GENERAL DEL CANDIDATO", contentX, profileTop);
    doc.setFont("helvetica", "normal");

    section(
      "Nombre Completo:",
      `${talent.nombre} ${talent.apellido || ""}`.trim(),
      profileTop + 18,
    );
    section(
      "Identificación:",
      talent.id ? `DNI ${String(talent.id).padStart(8, "0")}` : "-",
      profileTop + 38,
    );
    section("Email:", talent.email || "-", profileTop + 58);
    section("Teléfono:", talent.telefono || "-", profileTop + 78);
    section("Ubicación:", talent.ubicacion || "-", profileTop + 98);

    const secondSectionTop = profileTop + 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("II. PERFIL PROFESIONAL Y ASPIRACIÓN", contentX, secondSectionTop);
    doc.setFont("helvetica", "normal");

    section("Área:", talent.area || "-", secondSectionTop + 18);
    section(
      "Especialidades:",
      talent.especialidades?.join(", ") || "-",
      secondSectionTop + 38,
    );
    section(
      "Experiencia:",
      talent.experiencia ? `${talent.experiencia} años` : "-",
      secondSectionTop + 58,
    );
    section(
      "Salario esperado:",
      talent.currency
        ? `$${talent.salario.toLocaleString()} ${talent.currency}`
        : "-",
      secondSectionTop + 78,
    );
    section("Disponibilidad:", "Inmediata", secondSectionTop + 98);

    const notesTop = secondSectionTop + 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("IV. EVALUACIÓN DE LA ENTREVISTA", contentX, notesTop);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      "Candidato con buena comunicación y habilidades técnicas. Se recomienda avance para entrevista Técnica.",
      contentX,
      notesTop + 18,
      { maxWidth: 520 },
    );

    const finalTop = notesTop + 60;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("V. DICTAMEN FINAL", contentX, finalTop);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Estatus: ${talent.estatus}`, contentX, finalTop + 18);
    doc.text(
      talent.estatus === "Elegible"
        ? "Candidato altamente recomendado para proceso de selecci�n."
        : talent.estatus === "Pendiente"
          ? "Se recomienda EVALUACIÓN adicional en entrevista."
          : "No cumple los criterios para este proceso.",
      contentX,
      finalTop + 38,
      { maxWidth: 520 },
    );

    doc.save(`${talent.nombre.replace(/\s+/g, "_") || "talento"}_ficha.pdf`);
  };

  const handleToggleStatus = (talentId) => {
    setTalents((current) =>
      current.map((talent) => {
        if (talent.id !== talentId) return talent;

        const nextStatus =
          talent.estatus === "Pendiente"
            ? "Elegible"
            : talent.estatus === "Elegible"
              ? "En Cartera"
              : talent.estatus === "En Cartera"
                ? "Pendiente"
                : talent.estatus;

        return { ...talent, estatus: nextStatus };
      }),
    );
  };

  const handleDeleteTalent = (talentId) => {
    setTalents((current) => current.filter((talent) => talent.id !== talentId));
  };

  const interviewTalents = talents.filter(
    (talent) => talent.estatus === "Pendiente" || talent.estatus === "Elegible",
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        userName="Nicole Tolve"
        userRole="Administrador"
        activePage={activePage}
        onNavChange={setActivePage}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activePage === "search" && (
          <>
            <TalentSearch
              onSearch={handleSearch}
              initialFilters={searchFilters}
            />
            <TalentTable
              data={filteredTalents}
              onViewTalent={handleViewTalent}
              onToggleStatus={handleToggleStatus}
              onDeleteTalent={handleDeleteTalent}
            />
          </>
        )}

        {activePage === "register" && (
          <RegisterTalent onRegister={handleRegister} />
        )}

        {activePage === "interviews" && (
          <div className="w-full p-8 bg-white rounded-3xl shadow-lg text-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Entrevistas</h2>
            {interviewTalents.length === 0 ? (
              <p>No hay candidatos listos para entrevista.</p>
            ) : (
              <div className="space-y-4">
                {interviewTalents.map((talent) => (
                  <div
                    key={talent.id}
                    className="p-4 rounded-2xl border border-gray-200"
                  >
                    <p className="font-semibold text-gray-800">
                      {talent.nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      {talent.area} � {talent.especialidades.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      ASPIRACIÓN:{" "}
                      {talent.currency
                        ? `$${talent.salario.toLocaleString()} ${talent.currency}`
                        : talent.aspiracion}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      Estatus: {talent.estatus}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
