import React, { useState, useEffect } from 'react';
import { FiClipboard, FiCalendar, FiCheck } from 'react-icons/fi';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { IoWarningOutline } from 'react-icons/io5';
import api from '../api';

// ── Estilos ──
const estilos = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15, 23, 42, 0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
    fontFamily: '"Inter", sans-serif',
  },
  box: {
    background: 'white',
    borderRadius: '20px',
    width: '460px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
  },
  header: {
    padding: '36px 32px 28px',
    textAlign: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: '16px', right: '18px',
    background: 'rgba(255,255,255,0.15)',
    border: 'none', borderRadius: '50%',
    width: '28px', height: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'white', fontSize: '15px', lineHeight: 1,
  },
  iconCircle: {
    width: '60px', height: '60px',
    background: 'rgba(255,255,255,0.18)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: {
    margin: 0, color: 'white',
    fontSize: '22px', fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  subtitle: {
    margin: '6px 0 0', color: 'rgba(255,255,255,0.8)',
    fontSize: '14px', fontWeight: 400,
  },
  body: { padding: '24px 28px 0' },
  infoCard: {
    background: '#F8FAFF',
    border: '1px solid #E8EEFF',
    borderRadius: '12px',
    padding: '16px 20px',
    fontSize: '14px',
    color: '#374151',
    lineHeight: 1.6,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  infoLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#1F2937',
  },
  actions: {
    padding: '20px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btnBase: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
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
  loadingContainer: {
    padding: '40px',
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '14px',
  },
  resultBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
};

// Variantes de botón
const btnVariants = {
  primary: { background: 'linear-gradient(135deg, #4F6EF7 0%, #3B54D4 100%)', color: '#ffffff' },
  purple: { background: 'linear-gradient(135deg, #7C4FE7 0%, #5B34C4 100%)', color: '#ffffff' },
  green: { background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#ffffff' },
  amber: { background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#ffffff' },
  outline: { background: '#ffffff', color: '#374151', border: '1.5px solid #E5E7EB' },
};

const ActionBtn = ({ variant = 'outline', onClick, children, disabled }) => {
  const varStyle = btnVariants[variant] || btnVariants.outline;
  const isGradient = variant !== 'outline';

  return (
    <button
      style={{
        ...estilos.btnBase,
        ...varStyle,
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={e => {
        if (disabled) return;
        if (isGradient) e.currentTarget.style.opacity = '0.88';
        else e.currentTarget.style.background = '#F9FAFB';
      }}
      onMouseLeave={e => {
        if (disabled) return;
        if (isGradient) e.currentTarget.style.opacity = '1';
        else e.currentTarget.style.background = '#ffffff';
      }}
    >
      {children}
    </button>
  );
};

// Colores del dictamen para el badge
const DICTAMEN_COLORS = {
  elegible: { bg: '#ECFDF5', text: '#059669' },
  en_cartera: { bg: '#FFFBEB', text: '#D97706' },
  no_elegible: { bg: '#FEF2F2', text: '#DC2626' },
  en_revision: { bg: '#EFF6FF', text: '#2563EB' },
};

const DICTAMEN_LABELS = {
  elegible: 'Elegible',
  en_cartera: 'En Cartera',
  no_elegible: 'No Elegible',
  en_revision: 'En Revisión',
};


/**
 * Props:
 * - candidato: datos del candidato
 * - onClose: cerrar el modal
 * - onEvaluarEntrevista: callback para navegar al formulario de evaluación (recibe candidato)
 * - onRequestAssign: callback para abrir AssignInterviewerModal (cierra este modal primero)
 */
const ManageInterviewModal = ({ candidato, onClose, onEvaluarEntrevista, onRequestAssign }) => {
  const [entrevista, setEntrevista] = useState(null);
  const [loading, setLoading] = useState(true);

  // Buscar la entrevista más reciente del candidato
  useEffect(() => {
    const fetchEntrevista = async () => {
      try {
        const res = await api.get('entrevistas/');
        const data = res.data.results ? res.data.results : res.data;
        // Buscar todas las entrevistas del candidato y tomar la más reciente
        const entrevistas = data
          .filter(e => e.candidato === candidato.id_candidato)
          .sort((a, b) => new Date(b.fecha_entrevista || b.fecha_programada || 0) - new Date(a.fecha_entrevista || a.fecha_programada || 0));

        setEntrevista(entrevistas.length > 0 ? entrevistas[0] : null);
      } catch (err) {
        console.error("Error buscando entrevista:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntrevista();
  }, [candidato.id_candidato]);

  // Determinar el caso
  const yaEvaluada = entrevista && entrevista.eligibilidad;
  const programadaSinEvaluar = entrevista && entrevista.fecha_programada && !entrevista.eligibilidad;

  // ─── Caso: Cargando ───
  if (loading) {
    return (
      <div style={estilos.overlay}>
        <div style={estilos.box}>
          <div style={estilos.loadingContainer}>
            Verificando entrevistas del candidato...
          </div>
        </div>
      </div>
    );
  }

  // ─── Caso C: No tiene entrevista ───
  if (!entrevista) {
    return (
      <div style={estilos.overlay}>
        <div style={estilos.box}>
          <div style={{ ...estilos.header, background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)' }}>
            <button style={estilos.closeBtn} onClick={onClose}>×</button>
            <div style={estilos.iconCircle}>
              <FiCalendar color="white" size={28} />
            </div>
            <h2 style={estilos.title}>Sin Entrevista</h2>
            <p style={estilos.subtitle}>{candidato.nombre_completo}</p>
          </div>

          <div style={estilos.body}>
            <div style={estilos.infoCard}>
              Este candidato aún no tiene ninguna entrevista registrada en el sistema.
              Para comenzar, asigna un entrevistador y programa una fecha.
            </div>
          </div>

          <div style={estilos.actions}>
            <ActionBtn variant="primary" onClick={() => {
              onClose();
              onRequestAssign();
            }}>
              <FaRegCalendarAlt size={18} />
              Programar Entrevista
            </ActionBtn>

            <ActionBtn variant="outline" onClick={onClose}>
              <span style={{ fontSize: '15px' }}>✕</span>
              Cerrar
            </ActionBtn>
          </div>
        </div>
      </div>
    );
  }

  // ─── Caso A: Programada pero no evaluada ───
  if (programadaSinEvaluar) {
    return (
      <div style={estilos.overlay}>
        <div style={estilos.box}>
          <div style={{ ...estilos.header, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
            <button style={estilos.closeBtn} onClick={onClose}>×</button>
            <div style={estilos.iconCircle}>
              <FaRegCalendarAlt color="white" size={28} />
            </div>
            <h2 style={estilos.title}>Cita Programada</h2>
            <p style={estilos.subtitle}>{candidato.nombre_completo}</p>
          </div>

          <div style={estilos.body}>
            {/* Información de la cita */}
            <div style={estilos.infoCard}>
              <div style={estilos.infoRow}>
                <span style={estilos.infoLabel}>Fecha Programada</span>
                <span style={estilos.infoValue}>
                  {new Date(entrevista.fecha_programada).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                </span>
              </div>
              <div style={{ ...estilos.infoRow, borderBottom: 'none' }}>
                <span style={estilos.infoLabel}>Entrevistador</span>
                <span style={estilos.infoValue}>
                  {entrevista.entrevistador_nombre || 'Sin asignar'}
                </span>
              </div>
            </div>
          </div>

          <div style={estilos.actions}>
            <ActionBtn variant="green" onClick={() => {
              onClose();
              onEvaluarEntrevista(candidato);
            }}>
              <FiClipboard size={18} />
              Evaluar Entrevista
            </ActionBtn>

            <ActionBtn variant="amber" onClick={() => {
              onClose();
              onRequestAssign();
            }}>
              <FaRegCalendarAlt size={18} />
              Reprogramar Cita
            </ActionBtn>

            <ActionBtn variant="outline" onClick={onClose}>
              <span style={{ fontSize: '15px' }}>✕</span>
              Cerrar
            </ActionBtn>
          </div>
        </div>
      </div>
    );
  }

  // ─── Caso B: Ya evaluada ───
  if (yaEvaluada) {
    const dictColor = DICTAMEN_COLORS[entrevista.eligibilidad] || { bg: '#F1F5F9', text: '#64748B' };
    const dictLabel = DICTAMEN_LABELS[entrevista.eligibilidad] || entrevista.eligibilidad;

    return (
      <div style={estilos.overlay}>
        <div style={estilos.box}>
          <div style={{ ...estilos.header, background: 'linear-gradient(135deg, #4F6EF7 0%, #6C4FE7 100%)' }}>
            <button style={estilos.closeBtn} onClick={onClose}>×</button>
            <div style={estilos.iconCircle}>
              <IoWarningOutline color="white" size={30} />
            </div>
            <h2 style={estilos.title}>Entrevista Evaluada</h2>
            <p style={estilos.subtitle}>{candidato.nombre_completo}</p>
          </div>

          <div style={estilos.body}>
            <div style={estilos.infoCard}>
              {/* Dictamen */}
              <div style={{ ...estilos.infoRow, alignItems: 'center' }}>
                <span style={estilos.infoLabel}>Dictamen</span>
                <span style={{
                  ...estilos.resultBadge,
                  backgroundColor: dictColor.bg,
                  color: dictColor.text,
                }}>
                  {dictLabel}
                </span>
              </div>
              {/* Puntuaciones */}
              <div style={estilos.infoRow}>
                <span style={estilos.infoLabel}>Técnica</span>
                <span style={estilos.infoValue}>{'★'.repeat(entrevista.puntuacion_tecnica || 0)}{'☆'.repeat(5 - (entrevista.puntuacion_tecnica || 0))}</span>
              </div>
              <div style={estilos.infoRow}>
                <span style={estilos.infoLabel}>Comunicación</span>
                <span style={estilos.infoValue}>{'★'.repeat(entrevista.puntuacion_comunicacion || 0)}{'☆'.repeat(5 - (entrevista.puntuacion_comunicacion || 0))}</span>
              </div>
              <div style={{ ...estilos.infoRow, borderBottom: 'none' }}>
                <span style={estilos.infoLabel}>Interés</span>
                <span style={estilos.infoValue}>{'★'.repeat(entrevista.puntuacion_interes || 0)}{'☆'.repeat(5 - (entrevista.puntuacion_interes || 0))}</span>
              </div>
            </div>
          </div>

          <div style={estilos.actions}>
            <ActionBtn variant="purple" onClick={() => {
              onClose();
              onEvaluarEntrevista(candidato);
            }}>
              <CiEdit size={22} />
              Editar Evaluación
            </ActionBtn>

            <ActionBtn variant="primary" onClick={() => {
              onClose();
              onRequestAssign();
            }}>
              <FaRegCalendarAlt size={18} />
              Programar Nueva Entrevista
            </ActionBtn>

            <ActionBtn variant="outline" onClick={onClose}>
              <span style={{ fontSize: '15px' }}>✕</span>
              Cerrar
            </ActionBtn>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ManageInterviewModal;
