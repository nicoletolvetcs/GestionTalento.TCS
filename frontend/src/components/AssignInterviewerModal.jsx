import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiCalendar, FiCheck } from 'react-icons/fi';
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
    width: '480px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
  },
  header: {
    background: 'linear-gradient(135deg, #4F6EF7 0%, #6C4FE7 100%)',
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
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    color: '#1F2937',
    outline: 'none',
    cursor: 'pointer',
    background: '#ffffff',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  dateInput: {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    color: '#1F2937',
    outline: 'none',
    background: '#ffffff',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
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
  successBox: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '12px',
    padding: '16px 20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#16A34A',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    padding: '12px 16px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#DC2626',
    lineHeight: 1.5,
    marginBottom: '12px',
  },
};

const AssignInterviewerModal = ({ candidato, onClose, onSuccess }) => {
  const [entrevistadores, setEntrevistadores] = useState([]);
  const [entrevistadorId, setEntrevistadorId] = useState('');
  const [fechaEntrevista, setFechaEntrevista] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  // Cargar lista de entrevistadores al abrir el modal
  useEffect(() => {
    const fetchEntrevistadores = async () => {
      try {
        const response = await api.get('entrevistadores/');
        setEntrevistadores(response.data);
      } catch (err) {
        console.error("Error cargando entrevistadores:", err);
        setError("No se pudo cargar la lista de entrevistadores.");
      } finally {
        setLoadingList(false);
      }
    };
    fetchEntrevistadores();
  }, []);

  // Enviar la asignación — siempre POST (crea nueva entrevista)
  const handleGuardar = async () => {
    setError('');

    // Validaciones básicas
    if (!entrevistadorId) {
      setError('Debes seleccionar un entrevistador.');
      return;
    }
    if (!fechaEntrevista) {
      setError('Debes seleccionar una fecha y hora para la entrevista.');
      return;
    }

    setLoading(true);
    try {
      await api.post('entrevistas/', {
        candidato: candidato.id_candidato,
        entrevistador: entrevistadorId,
        fecha_programada: fechaEntrevista,
      });
      setExito(true);

      // Esperar 1.5 segundos y cerrar
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al asignar entrevistador:", err);
      if (err.response?.data) {
        // Mostrar errores del backend
        const errores = err.response.data;
        const mensaje = typeof errores === 'string'
          ? errores
          : Object.values(errores).flat().join(' ');
        setError(mensaje || 'Error al programar la entrevista.');
      } else {
        setError('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={estilos.overlay}>
      <div style={estilos.box}>

        {/* ── Header ── */}
        <div style={estilos.header}>
          <button style={estilos.closeBtn} onClick={onClose}>×</button>
          <div style={estilos.iconCircle}>
            <FiUserPlus color="white" size={28} />
          </div>
          <h2 style={estilos.title}>Asignar Entrevistador</h2>
          <p style={estilos.subtitle}>Candidato: {candidato.nombre_completo}</p>
        </div>

        {/* ── Contenido ── */}
        {exito ? (
          <div style={{ padding: '28px' }}>
            <div style={estilos.successBox}>
              <FiCheck size={24} style={{ marginBottom: '8px' }} />
              <br />
              ¡Entrevista programada exitosamente!
            </div>
          </div>
        ) : (
          <>
            <div style={estilos.body}>
              {error && <div style={estilos.errorBox}>{error}</div>}

              {/* Select Entrevistador */}
              <div style={estilos.fieldGroup}>
                <label style={estilos.label}>Entrevistador</label>
                <select
                  style={estilos.select}
                  value={entrevistadorId}
                  onChange={(e) => setEntrevistadorId(e.target.value)}
                  onFocus={e => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                  disabled={loadingList}
                >
                  <option value="">
                    {loadingList ? 'Cargando entrevistadores...' : '— Seleccionar entrevistador —'}
                  </option>
                  {entrevistadores.map(ent => (
                    <option key={ent.id} value={ent.id}>
                      {ent.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Fecha y Hora */}
              <div style={estilos.fieldGroup}>
                <label style={estilos.label}>
                  <FiCalendar size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Fecha y Hora de Entrevista
                </label>
                <input
                  type="datetime-local"
                  style={estilos.dateInput}
                  value={fechaEntrevista}
                  onChange={(e) => setFechaEntrevista(e.target.value)}
                  onFocus={e => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* ── Botones ── */}
            <div style={estilos.actions}>
              <button
                style={{
                  ...estilos.btnBase,
                  background: 'linear-gradient(135deg, #4F6EF7 0%, #3B54D4 100%)',
                  color: '#ffffff',
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={handleGuardar}
                disabled={loading}
                onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => !loading && (e.currentTarget.style.opacity = '1')}
              >
                {loading ? 'Guardando...' : 'Programar Entrevista'}
              </button>

              <button
                style={{
                  ...estilos.btnBase,
                  background: 'white',
                  color: '#374151',
                  border: '1.5px solid #E5E7EB',
                }}
                onClick={onClose}
                disabled={loading}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '15px' }}>✕</span>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignInterviewerModal;
