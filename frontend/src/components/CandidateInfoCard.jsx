import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// ── Estilos ──
const estilos = {
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    padding: '28px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '1px solid #F1F5F9',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '52px',
    height: '52px',
    background: '#2563EB',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '18px',
    flexShrink: 0,
  },
  name: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1F2937',
    margin: 0,
  },
  cedula: {
    fontSize: '13px',
    color: '#6B7280',
    margin: '2px 0 0 0',
  },
  editBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    background: '#1A73E8',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  fieldValue: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#1F2937',
    padding: '10px 14px',
    background: '#F9FAFB',
    border: '1px solid #F1F5F9',
    borderRadius: '8px',
  },
  espBadge: {
    padding: '4px 10px',
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
  },
};

const CandidateInfoCard = ({ candidato, onEditarDatos }) => {
  const { user } = useContext(AuthContext);
  const esEntrevistador = ['Entrevistador', 'Entrevistadores'].includes(user?.rol);

  // Obtener iniciales para el avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Campos a renderizar en el grid
  const campos = [
    { label: "Cédula", value: candidato.cedula },
    { label: "Fecha de Nacimiento", value: candidato.fecha_nacimiento || "No especificada" },
    { label: "Nombre Completo", value: candidato.nombre_completo, fullWidth: true },
    { label: "Email", value: candidato.email },
    { label: "Teléfono", value: candidato.telefono },
    { label: "Ciudad", value: candidato.ciudad || "No especificada" },
    { label: "País", value: candidato.pais || "No especificado" },
    { label: "Dirección", value: candidato.direccion || "No especificada", fullWidth: true },
    {
      label: "Aspiración Salarial",
      value: candidato.aspiracion_salarial
        ? `${candidato.aspiracion_salarial} ${candidato.moneda || ''}`
        : "No especificada"
    },
    { label: "Disponibilidad", value: candidato.disponibilidad || "No especificada" },
  ];

  return (
    <div style={estilos.card}>
      {/* Header: Avatar + Nombre + Botón Editar */}
      <div style={estilos.header}>
        <div style={estilos.avatarSection}>
          <div style={estilos.avatar}>
            {getInitials(candidato.nombre_completo)}
          </div>
          <div>
            <h2 style={estilos.name}>{candidato.nombre_completo}</h2>
            <p style={estilos.cedula}>Cédula: {candidato.cedula}</p>
          </div>
        </div>
        {!esEntrevistador && (
          <button style={estilos.editBtn} onClick={onEditarDatos}
            onMouseEnter={e => e.currentTarget.style.background = '#1557B0'}
            onMouseLeave={e => e.currentTarget.style.background = '#1A73E8'}
          >
            Editar Datos
          </button>
        )}
      </div>

      {/* Grid de campos */}
      <div style={estilos.fieldsGrid}>
        {campos.map((campo, idx) => (
          <div key={idx} style={{
            ...estilos.field,
            ...(campo.fullWidth ? { gridColumn: '1 / -1' } : {}),
          }}>
            <span style={estilos.fieldLabel}>{campo.label}</span>
            <span style={estilos.fieldValue}>{campo.value}</span>
          </div>
        ))}
      </div>

      {/* Especialidades */}
      {candidato.especialidades_detalle && candidato.especialidades_detalle.length > 0 && (
        <div style={{ ...estilos.field, gridColumn: '1 / -1', marginTop: '20px' }}>
          <span style={estilos.fieldLabel}>Especialidades</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {candidato.especialidades_detalle.map(esp => (
              <span key={esp.id_especialidad} style={estilos.espBadge}>
                {esp.nombre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInfoCard;
