import React, { useState } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { FiClipboard, FiFileText } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";


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
const ActionButtons = ({ onView, talent, onRellenarEntrevista }) => (
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
      title="Ver Ficha de Reporte"
    >
      <IoEyeOutline />
    </button>
    <button
      type="button"
      onClick={onRellenarEntrevista}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        color: "#22C55E",
      }}
      title="Rellenar Entrevista"
    >
      <FiClipboard />
    </button>
    <button
      type="button"
      onClick={() => {
        const url = talent?.url_referencias || talent?.url_documento_id;
        if (!url) {
          alert(`El candidato ${talent?.nombre_completo} no posee documentos registrados.`);
          return;
        }
        window.open(url, "_blank");
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        color: "#EF4444",
        opacity: (talent?.url_referencias || talent?.url_documento_id) ? 1 : 0.4,
      }}
      title="Descargar CV"
    >
      <FiFileText />
    </button>
  </div>
);

// 3. Fila de la Tabla (con efecto hover)
const TalentRow = ({ talent, onVerFicha, onRellenarEntrevista }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <tr
      style={{
        borderBottom: '1px solid #F3F4F6',
        backgroundColor: isHovered ? '#F9FAFB' : 'transparent',
        transition: 'background-color 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500, color: '#1F2937' }}>
        {talent.nombre_completo}
      </td>

      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6B7280' }}>
        {talent.area_nombre}
      </td>

      <td style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {talent.especialidades_detalle?.map(esp => (
            <span key={esp.id_especialidad} style={{
              padding: '2px 8px',
              backgroundColor: '#F3F4F6',
              color: '#6B7280',
              borderRadius: '4px',
              fontSize: '11px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              {esp.nombre}
            </span>
          ))}
        </div>
      </td>

      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1F2937' }}>
        {talent.aspiracion_salarial} {talent.moneda}
      </td>

      <td style={{ padding: '16px 24px' }}>
        <StatusBadge status={talent.estatus} />
      </td>
      <td style={{ padding: '16px 24px' }}>
        <ActionButtons
          talent={talent}
          onView={() => onVerFicha(talent)}
          onRellenarEntrevista={onRellenarEntrevista}
        />
      </td>
    </tr>
  );
};
// 4. Contenedor Principal
const TalentTable = ({ data = [], onVerFicha, onRellenarEntrevista }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCandidato, setModalCandidato] = useState(null);

  const handleEntrevistaClick = (candidato) => {
    if (candidato.estatus === 'Pendiente') {
      onRellenarEntrevista(candidato);
    }
    else {
      setModalCandidato(candidato);
      setIsModalOpen(true);
    }
  }

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
              data.map((candidato) => (
                <TalentRow
                  key={candidato.id_candidato}
                  talent={candidato}
                  onVerFicha={onVerFicha}
                  onRellenarEntrevista={() => handleEntrevistaClick(candidato)}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#9CA3AF',
                    fontStyle: 'italic',
                  }}
                >
                  No se encontraron registros para esta búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {
          isModalOpen && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
              fontFamily: '"Inter", sans-serif',
            }}>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                width: '420px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              }}>

                {/* ── Header con gradiente ── */}
                <div style={{
                  background: 'linear-gradient(135deg, #4F6EF7 0%, #6C4FE7 100%)',
                  padding: '36px 32px 28px',
                  textAlign: 'center',
                  position: 'relative',
                }}>
                  {/* Botón cerrar (×) */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      position: 'absolute', top: '16px', right: '18px',
                      background: 'rgba(255,255,255,0.15)',
                      border: 'none', borderRadius: '50%',
                      width: '28px', height: '28px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'white', fontSize: '15px', lineHeight: 1,
                    }}
                  >×</button>

                  {/* Círculo con ícono de advertencia */}
                  <div style={{
                    width: '60px', height: '60px',
                    background: 'rgba(255,255,255,0.18)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '26px',
                  }}>
                    <IoWarningOutline color="white" size={35} />
                  </div>

                  <h2 style={{
                    margin: 0, color: 'white',
                    fontSize: '22px', fontWeight: 700,
                    letterSpacing: '-0.3px',
                  }}>
                    Candidato Evaluado
                  </h2>
                </div>

                {/* ── Cuerpo ── */}
                <div style={{ padding: '24px 28px 0' }}>
                  <div style={{
                    background: '#F8FAFF',
                    border: '1px solid #E8EEFF',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: 1.6,
                  }}>
                    <span style={{ color: '#4F6EF7', fontWeight: 600 }}>
                      {modalCandidato?.nombre_completo}
                    </span>{' '}
                    ya ha sido evaluado previamente. ¿Deseas continuar con alguna de las siguientes acciones?
                  </div>
                </div>

                {/* ── Botones ── */}
                <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Programar nueva entrevista */}
                  <button
                    style={{
                      width: '100%', padding: '14px',
                      background: 'linear-gradient(135deg, #4F6EF7 0%, #3B54D4 100%)',
                      color: 'white', border: 'none', borderRadius: '12px',
                      fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <span style={{ fontSize: '16px' }}>
                      <FaRegCalendarAlt size={22} />
                    </span>
                    Programar nueva entrevista
                  </button>

                  {/* Editar entrevista */}
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onRellenarEntrevista(modalCandidato);
                    }}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'linear-gradient(135deg, #7C4FE7 0%, #5B34C4 100%)',
                      color: 'white', border: 'none', borderRadius: '12px',
                      fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <span style={{ fontSize: '16px' }}>
                      <CiEdit size={30} />
                    </span>
                    Editar entrevista
                  </button>

                  {/* Cerrar */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      width: '100%', padding: '14px',
                      background: 'white', color: '#374151',
                      border: '1.5px solid #E5E7EB', borderRadius: '12px',
                      fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ fontSize: '15px' }}>✕</span>
                    Cerrar
                  </button>
                </div>

              </div>
            </div>
          )
        }

      </div>
    </div>
  );
};



export default TalentTable;
