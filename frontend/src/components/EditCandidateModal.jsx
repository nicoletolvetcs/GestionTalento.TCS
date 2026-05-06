import React, { useState } from 'react';
import { FiEdit3, FiCheck } from 'react-icons/fi';
import api from '../api';

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
    width: '600px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
  },
  header: {
    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    padding: '30px 32px 24px',
    textAlign: 'center',
    position: 'relative',
    flexShrink: 0,
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
    width: '56px', height: '56px',
    background: 'rgba(255,255,255,0.18)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 12px',
  },
  title: {
    margin: 0, color: 'white',
    fontSize: '22px', fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  subtitle: {
    margin: '4px 0 0', color: 'rgba(255,255,255,0.8)',
    fontSize: '14px', fontWeight: 400,
  },
  bodyScroll: {
    padding: '24px 28px',
    overflowY: 'auto',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  col: {
    flex: 1,
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
  input: {
    width: '100%',
    height: '42px',
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
  select: {
    width: '100%',
    height: '42px',
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
  actions: {
    padding: '20px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderTop: '1px solid #F1F5F9',
    background: '#F8FAFC',
    flexShrink: 0,
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
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    padding: '12px 16px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#DC2626',
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  successBox: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    fontSize: '15px',
    color: '#16A34A',
    lineHeight: 1.6,
    fontWeight: 500,
    margin: '40px 28px',
  },
};

const DISPONIBILIDAD_OPCIONES = [
  'Inmediata', '15 días', '30 días', 'Remoto', 'Presencial', 'Híbrido', 'Negociable'
];

const EditCandidateModal = ({ candidato, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cedula: candidato.cedula || '',
    nombre_completo: candidato.nombre_completo || '',
    email: candidato.email || '',
    telefono: candidato.telefono || '',
    ciudad: candidato.ciudad || '',
    pais: candidato.pais || '',
    direccion: candidato.direccion || '',
    aspiracion_salarial: candidato.aspiracion_salarial || '',
    moneda: candidato.moneda || 'USD',
    disponibilidad: candidato.disponibilidad || 'Inmediata',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setError('');
    
    // Validaciones básicas de front
    if (!formData.nombre_completo.trim()) return setError('El nombre completo es obligatorio.');
    if (!formData.cedula.trim()) return setError('La cédula es obligatoria.');
    if (!formData.email.trim()) return setError('El email es obligatorio.');
    if (!formData.telefono.trim()) return setError('El teléfono es obligatorio.');

    setLoading(true);

    try {
      // Usamos PATCH para actualizar solo los campos enviados
      await api.patch(`candidatos/${candidato.id_candidato}/`, formData);
      setExito(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al actualizar candidato:", err);
      if (err.response?.data) {
        const errores = err.response.data;
        const mensaje = typeof errores === 'string' ? errores : Object.values(errores).flat().join(' ');
        setError(mensaje || 'Error al actualizar los datos.');
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
        
        {/* Header */}
        <div style={estilos.header}>
          <button style={estilos.closeBtn} onClick={onClose} disabled={loading}>×</button>
          <div style={estilos.iconCircle}>
            <FiEdit3 color="white" size={26} />
          </div>
          <h2 style={estilos.title}>Editar Perfil</h2>
          <p style={estilos.subtitle}>Actualizando datos de {candidato.nombre_completo}</p>
        </div>

        {/* Contenido */}
        {exito ? (
          <div style={estilos.successBox}>
            <FiCheck size={32} style={{ marginBottom: '12px' }} />
            <br />
            ¡Perfil actualizado exitosamente!
          </div>
        ) : (
          <>
            <div style={estilos.bodyScroll}>
              {error && <div style={estilos.errorBox}>{error}</div>}

              <div style={estilos.row}>
                <div style={estilos.col}>
                  <label style={estilos.label}>Nombre Completo *</label>
                  <input
                    name="nombre_completo"
                    style={estilos.input}
                    value={formData.nombre_completo}
                    onChange={handleChange}
                  />
                </div>
                <div style={estilos.col}>
                  <label style={estilos.label}>Cédula *</label>
                  <input
                    name="cedula"
                    style={estilos.input}
                    value={formData.cedula}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={estilos.row}>
                <div style={estilos.col}>
                  <label style={estilos.label}>Email *</label>
                  <input
                    name="email"
                    type="email"
                    style={estilos.input}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div style={estilos.col}>
                  <label style={estilos.label}>Teléfono *</label>
                  <input
                    name="telefono"
                    style={estilos.input}
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={estilos.row}>
                <div style={estilos.col}>
                  <label style={estilos.label}>Ciudad</label>
                  <input
                    name="ciudad"
                    style={estilos.input}
                    value={formData.ciudad}
                    onChange={handleChange}
                  />
                </div>
                <div style={estilos.col}>
                  <label style={estilos.label}>País</label>
                  <input
                    name="pais"
                    style={estilos.input}
                    value={formData.pais}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={estilos.label}>Dirección</label>
                <input
                  name="direccion"
                  style={estilos.input}
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>

              <div style={estilos.row}>
                <div style={estilos.col}>
                  <label style={estilos.label}>Aspiración Salarial</label>
                  <input
                    name="aspiracion_salarial"
                    type="number"
                    style={estilos.input}
                    value={formData.aspiracion_salarial}
                    onChange={handleChange}
                  />
                </div>
                <div style={estilos.col}>
                  <label style={estilos.label}>Moneda</label>
                  <select
                    name="moneda"
                    style={estilos.select}
                    value={formData.moneda}
                    onChange={handleChange}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div style={estilos.col}>
                  <label style={estilos.label}>Disponibilidad</label>
                  <select
                    name="disponibilidad"
                    style={estilos.select}
                    value={formData.disponibilidad}
                    onChange={handleChange}
                  >
                    {DISPONIBILIDAD_OPCIONES.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={estilos.actions}>
              <button
                style={{
                  ...estilos.btnBase,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#ffffff',
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={handleGuardar}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
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
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditCandidateModal;
