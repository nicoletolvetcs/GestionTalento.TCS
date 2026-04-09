import React from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FiClipboard, FiFileText } from "react-icons/fi";

// Datos de ejemplo para que la tabla siempre tenga contenido
const mockData = [
  {
    id: 1,
    nombre: "Carlos Pérez",
    area: "Tecnología",
    especialidades: ["Frontend", "React"],
    salario: 3500,
    currency: "USD",
    estatus: "Elegible",
  },
  {
    id: 2,
    nombre: "Ana López",
    area: "Marketing",
    especialidades: ["SEO", "Content"],
    salario: 2800,
    currency: "USD",
    estatus: "En Cartera",
  },
  {
    id: 3,
    nombre: "Luis García",
    area: "Tecnología",
    especialidades: ["Backend", "DevOps"],
    salario: 4200,
    currency: "USD",
    estatus: "Pendiente",
  },
  {
    id: 4,
    nombre: "María Rodríguez",
    area: "Diseño",
    especialidades: ["UI/UX"],
    salario: 3000,
    currency: "USD",
    estatus: "No Elegible",
  },
];

// 1. Componente para el Estatus (Badge)
const StatusBadge = ({ status }) => {
  const colors = {
    Elegible: { bg: "#ECFDF5", text: "#059669", border: "#D1FAE5" },
    "En Cartera": { bg: "#FFFBEB", text: "#D97706", border: "#FEF3C7" },
    Pendiente: { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" },
    "No Elegible": { bg: "#FEF2F2", text: "#DC2626", border: "#FEE2E2" },
  };

  const c = colors[status] || colors["Pendiente"];

  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "9999px",
        border: `1px solid ${c.border}`,
        backgroundColor: c.bg,
        color: c.text,
        fontSize: "12px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {status}
    </span>
  );
};

// 2. Componente para las Acciones
const ActionButtons = ({ onView, onToggleStatus, onDelete }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#9CA3AF",
    }}
  >
    <button
      type="button"
      onClick={onView}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        color: "#3B82F6",
      }}
      title="Ver detalles"
    >
      <IoEyeOutline />
    </button>
    <button
      type="button"
      onClick={onToggleStatus}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        color: "#22C55E",
      }}
      title="Cambiar estatus"
    >
      <FiClipboard />
    </button>
    <button
      type="button"
      onClick={onDelete}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        color: "#EF4444",
      }}
      title="Eliminar talento"
    >
      <FiFileText />
    </button>
  </div>
);

// 3. Fila de la Tabla
const TalentRow = ({ talent, onView, onToggleStatus, onDelete }) => (
  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
    <td
      style={{
        padding: "16px 24px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#1F2937",
      }}
    >
      {talent.nombre}
    </td>
    <td style={{ padding: "16px 24px", fontSize: "14px", color: "#6B7280" }}>
      {talent.area}
    </td>
    <td style={{ padding: "16px 24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {talent.especialidades.map((esp) => (
          <span
            key={esp}
            style={{
              padding: "2px 8px",
              backgroundColor: "#F3F4F6",
              color: "#6B7280",
              borderRadius: "4px",
              fontSize: "11px",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {esp}
          </span>
        ))}
      </div>
    </td>
    <td style={{ padding: "16px 24px", fontSize: "14px", color: "#1F2937" }}>
      {talent.aspiracion
        ? talent.aspiracion
        : `${talent.currency ? `$${talent.salario.toLocaleString()} ${talent.currency}` : "$0 USD"}`}
    </td>
    <td style={{ padding: "16px 24px" }}>
      <StatusBadge status={talent.estatus} />
    </td>
    <td style={{ padding: "16px 24px" }}>
      <ActionButtons
        onView={onView}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
      />
    </td>
  </tr>
);

// 4. Contenedor Principal
const TalentTable = ({
  data = mockData,
  onViewTalent,
  onToggleStatus,
  onDeleteTalent,
}) => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        fontFamily: '"Inter", sans-serif',
        marginTop: "20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1F2937",
            margin: 0,
          }}
        >
          Resultados de Búsqueda ({data.length})
        </h3>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB" }}>
              {[
                "Nombre Completo",
                "Área Principal",
                "Especialidades",
                "Aspiración",
                "Estatus",
                "Acciones",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "12px 24px",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#9CA3AF",
                    fontWeight: 700,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((talent) => (
                <TalentRow
                  key={talent.id}
                  talent={talent}
                  onView={() => onViewTalent?.(talent)}
                  onToggleStatus={() => onToggleStatus?.(talent.id)}
                  onDelete={() => onDeleteTalent?.(talent.id)}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#6B7280",
                  }}
                >
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TalentTable;
