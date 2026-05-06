import React, { useState } from 'react';
import { FiFileText, FiPrinter, FiUserPlus, FiClipboard, FiCheckCircle } from 'react-icons/fi';
import { IoWarningOutline } from 'react-icons/io5';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';

// ── Colores del badge según estatus ──
const STATUS_COLORS = {
  Elegible: { bg: "#ECFDF5", text: "#059669", border: "#D1FAE5" },
  "En Cartera": { bg: "#FFFBEB", text: "#D97706", border: "#FEF3C7" },
  Pendiente: { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" },
  "No Elegible": { bg: "#FEF2F2", text: "#DC2626", border: "#FEE2E2" },
  "En Revision": { bg: "#EFF6FF", text: "#2563EB", border: "#DBEAFE" },
};

const OPCIONES_ESTATUS = [
  'Pendiente',
  'En Revision',
  'Elegible',
  'En Cartera',
  'No Elegible',
];

// ── Estilos ──
const estilos = {
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    padding: '28px',
  },
  actionsTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1F2937',
    margin: '0 0 16px 0',
    textAlign: 'center',
  },
  statusSection: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: 600,
    textAlign: 'center',
    width: 'fit-content',
    margin: '0 auto 20px',
  },
  statusLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  statusSelect: {
    width: '100%',
    height: '40px',
    padding: '0 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    color: '#1F2937',
    outline: 'none',
    cursor: 'pointer',
    background: '#ffffff',
    transition: 'border-color 0.2s',
  },
  actionsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  // Estilos base para los botones de acción
  btnBase: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    border: 'none',
  },
  // Sección contratación
  hiringSection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #F1F5F9',
  },
  hiringTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1F2937',
    margin: '0 0 12px 0',
    textAlign: 'center',
  },
  hiringCard: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
  },
  hiringPlaceholder: {
    fontSize: '13px',
    color: '#6B7280',
    fontStyle: 'italic',
    margin: 0,
  },
  // Modal
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15, 23, 42, 0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
    fontFamily: '"Inter", sans-serif',
  },
  modalBox: {
    background: 'white',
    borderRadius: '20px',
    width: '420px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
  },
  modalHeader: {
    background: 'linear-gradient(135deg, #4F6EF7 0%, #6C4FE7 100%)',
    padding: '36px 32px 28px',
    textAlign: 'center',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute', top: '16px', right: '18px',
    background: 'rgba(255,255,255,0.15)',
    border: 'none', borderRadius: '50%',
    width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'white', fontSize: '15px', lineHeight: 1,
  },
  modalIcon: {
    width: '60px', height: '60px',
    background: 'rgba(255,255,255,0.18)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '26px',
  },
  modalTitle: {
    margin: 0, color: 'white',
    fontSize: '22px', fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  modalBody: { padding: '24px 28px 0' },
  modalMessage: {
    background: '#F8FAFF',
    border: '1px solid #E8EEFF',
    borderRadius: '12px',
    padding: '16px 20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#374151',
    lineHeight: 1.6,
  },
  modalActions: {
    padding: '20px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
};

// Variantes de botón
const btnVariants = {
  primary: { background: 'linear-gradient(135deg, #4F6EF7 0%, #3B54D4 100%)', color: '#ffffff' },
  purple: { background: 'linear-gradient(135deg, #7C4FE7 0%, #5B34C4 100%)', color: '#ffffff' },
  green: { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#ffffff' },
  outline: { background: '#ffffff', color: '#374151', border: '1.5px solid #E5E7EB' },
};

// Componente botón reutilizable
const ActionBtn = ({ variant = 'outline', onClick, children }) => {
  const varStyle = btnVariants[variant] || btnVariants.outline;
  const isGradient = variant !== 'outline';

  return (
    <button
      style={{ ...estilos.btnBase, ...varStyle }}
      onClick={onClick}
      onMouseEnter={e => {
        if (isGradient) e.currentTarget.style.opacity = '0.88';
        else e.currentTarget.style.background = '#F9FAFB';
      }}
      onMouseLeave={e => {
        if (isGradient) e.currentTarget.style.opacity = '1';
        else e.currentTarget.style.background = '#ffffff';
      }}
    >
      {children}
    </button>
  );
};

const CandidateActionsCard = ({
  candidato,
  onCambiarEstatus,
  onDescargarCV,
  onImprimirFicha,
  onAsignarEntrevistador,
  onProgramarEntrevista,
  onEditarEntrevista,
  onProcesarContratacion,
}) => {
  const [showEntrevistaModal, setShowEntrevistaModal] = useState(false);
  const [showContratadoModal, setShowContratadoModal] = useState(false);

  const estatus = candidato.estatus || 'Pendiente';
  const color = STATUS_COLORS[estatus] || STATUS_COLORS['Pendiente'];

  // Determina si ya tiene entrevista (si estatus no es Pendiente, asumimos que ya fue evaluado)
  const yaEvaluado = estatus !== 'Pendiente';
  
  // Determina si ya está contratado verificando el objeto anidado
  const yaContratado = !!candidato.contratacion;

  const handleEntrevistaClick = () => {
    if (yaEvaluado) {
      setShowEntrevistaModal(true);
    } else {
      onProgramarEntrevista(candidato);
    }
  };

  const handleContratacionClick = () => {
    if (yaContratado) {
      setShowContratadoModal(true);
    } else {
      onProcesarContratacion(candidato);
    }
  };

  return (
    <>
      <div style={estilos.card}>
        <h3 style={estilos.actionsTitle}>Estado del Candidato</h3>

        {/* ── Badge de estatus actual ── */}
        <div style={estilos.statusSection}>
          <span style={{
            ...estilos.statusBadge,
            backgroundColor: color.bg,
            color: color.text,
            border: `1px solid ${color.border}`,
          }}>
            {estatus}
          </span>

          {/* ── Select para cambiar estatus ── */}
          <label style={estilos.statusLabel}>Cambiar Estado</label>
          <select
            style={estilos.statusSelect}
            value={estatus}
            onChange={(e) => onCambiarEstatus(e.target.value)}
            onFocus={e => e.currentTarget.style.borderColor = '#3B82F6'}
            onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            {OPCIONES_ESTATUS.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>

        {/* ── Botones de acción (stack vertical) ── */}
        <div style={estilos.actionsStack}>
          <ActionBtn variant="primary" onClick={() => onAsignarEntrevistador(candidato)}>
            <FiUserPlus size={18} />
            Asignar Entrevistador
          </ActionBtn>

          <ActionBtn variant="purple" onClick={handleEntrevistaClick}>
            <FiClipboard size={18} />
            {yaEvaluado ? 'Gestionar Entrevista' : 'Programar Entrevista'}
          </ActionBtn>

          {/* Procesar Contratación — SOLO si es Elegible o ya está contratado */}
          {(estatus === 'Elegible' || yaContratado) && (
            <ActionBtn variant="green" onClick={handleContratacionClick}>
              <FiCheckCircle size={18} />
              Procesar Contratación
            </ActionBtn>
          )}

          <ActionBtn variant="outline" onClick={() => onDescargarCV(candidato)}>
            <FiFileText size={16} />
            Descargar CV
          </ActionBtn>

          <ActionBtn variant="outline" onClick={() => onImprimirFicha(candidato)}>
            <FiPrinter size={16} />
            Imprimir Ficha
          </ActionBtn>
        </div>

        {/* ── Sección Estado de Contratación (condicional) ── */}
        {(estatus === 'Elegible' || yaContratado) && (
          <div style={estilos.hiringSection}>
            <h4 style={estilos.hiringTitle}>Estado de Contratación</h4>
            <div style={estilos.hiringCard}>
              {yaContratado ? (
                <div>
                  <div style={{ color: '#059669', fontWeight: 700, marginBottom: '4px' }}>Candidato contratado</div>
                  <div style={{ fontSize: '13px', color: '#374151' }}>
                    Área: {candidato.contratacion.area_definitiva}
                    {candidato.contratacion.especialidad_asignada && ` - ${candidato.contratacion.especialidad_asignada}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                    Fecha ingreso: {candidato.contratacion.fecha_ingreso}
                  </div>
                </div>
              ) : (
                <p style={estilos.hiringPlaceholder}>
                  Pendiente de procesamiento. Utiliza el botón "Procesar Contratación" para iniciar el proceso.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════ MODAL: Candidato ya evaluado ══════ */}
      {showEntrevistaModal && (
        <div style={estilos.modalOverlay}>
          <div style={estilos.modalBox}>

            {/* Header con gradiente */}
            <div style={estilos.modalHeader}>
              <button style={estilos.modalClose} onClick={() => setShowEntrevistaModal(false)}>×</button>
              <div style={estilos.modalIcon}>
                <IoWarningOutline color="white" size={35} />
              </div>
              <h2 style={estilos.modalTitle}>Candidato Evaluado</h2>
            </div>

            {/* Cuerpo */}
            <div style={estilos.modalBody}>
              <div style={estilos.modalMessage}>
                <span style={{ color: '#4F6EF7', fontWeight: 600 }}>
                  {candidato.nombre_completo}
                </span>{' '}
                ya ha sido evaluado previamente. ¿Deseas continuar con alguna de las siguientes acciones?
              </div>
            </div>

            {/* Botones */}
            <div style={estilos.modalActions}>
              <ActionBtn variant="primary" onClick={() => {
                setShowEntrevistaModal(false);
                onProgramarEntrevista(candidato);
              }}>
                <FaRegCalendarAlt size={18} />
                Programar nueva entrevista
              </ActionBtn>

              <ActionBtn variant="purple" onClick={() => {
                setShowEntrevistaModal(false);
                onEditarEntrevista(candidato);
              }}>
                <CiEdit size={22} />
                Editar entrevista
              </ActionBtn>

              <ActionBtn variant="outline" onClick={() => setShowEntrevistaModal(false)}>
                <span style={{ fontSize: '15px' }}>✕</span>
                Cerrar
              </ActionBtn>
            </div>

          </div>
        </div>
      )}
      
      {/* ══════ MODAL: Candidato ya contratado ══════ */}
      {showContratadoModal && (
        <div style={estilos.modalOverlay}>
          <div style={estilos.modalBox}>

            {/* Header con gradiente naranja */}
            <div style={{...estilos.modalHeader, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}}>
              <button style={estilos.modalClose} onClick={() => setShowContratadoModal(false)}>×</button>
              <div style={estilos.modalIcon}>
                <FiCheckCircle color="white" size={35} />
              </div>
              <h2 style={estilos.modalTitle}>Candidato Contratado</h2>
            </div>

            {/* Cuerpo */}
            <div style={estilos.modalBody}>
              <div style={{...estilos.modalMessage, background: '#FFFBEB', border: '1px solid #FEF3C7', color: '#92400E'}}>
                <span style={{ fontWeight: 600 }}>
                  {candidato.nombre_completo}
                </span>{' '}
                ya ha sido contratado en el sistema. ¿Deseas editar los detalles de su contratación?
              </div>
            </div>

            {/* Botones */}
            <div style={estilos.modalActions}>
              <ActionBtn variant="primary" onClick={() => {
                setShowContratadoModal(false);
                onProcesarContratacion(candidato); // Abre el modal de ProcessHiringModal
              }}>
                <CiEdit size={22} />
                Editar Contratación
              </ActionBtn>

              <ActionBtn variant="outline" onClick={() => setShowContratadoModal(false)}>
                <span style={{ fontSize: '15px' }}>✕</span>
                Cerrar
              </ActionBtn>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CandidateActionsCard;
