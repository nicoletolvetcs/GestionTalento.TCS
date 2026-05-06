import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiCheck, FiEdit } from 'react-icons/fi';
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
    width: '520px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
  },
  header: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    padding: '36px 32px 28px',
    textAlign: 'center',
    position: 'relative',
  },
  headerEdit: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
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
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
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

const ProcessHiringModal = ({ candidato, onClose, onSuccess }) => {
  const isEditing = !!candidato.contratacion;
  const initialData = candidato.contratacion || {};

  const [areasData, setAreasData] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  // Form state
  const [areaId, setAreaId] = useState('');
  const [especialidadId, setEspecialidadId] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(initialData.fecha_ingreso || '');
  const [salario, setSalario] = useState(initialData.salario_acordado || '');
  const [moneda, setMoneda] = useState(initialData.moneda_salario || 'USD');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('configuracion-areas/');
        setAreasData(response.data);
        
        // Si estamos editando, preseleccionamos el área basándonos en el nombre (ya que el nested serializer nos da el nombre)
        // Para hacerlo mejor, necesitaríamos el ID en el serializer, pero podemos buscarlo por nombre.
        if (isEditing && response.data.length > 0) {
          const areaObj = response.data.find(a => a.nombre === initialData.area_definitiva);
          if (areaObj) {
            setAreaId(areaObj.id_area);
            // Intentamos preseleccionar la especialidad si existe
            if (initialData.especialidad_asignada) {
               const espObj = areaObj.especialidades.find(e => e.nombre === initialData.especialidad_asignada);
               if (espObj) setEspecialidadId(espObj.id_especialidad);
            }
          }
        }
      } catch (err) {
        console.error("Error cargando configuración de áreas:", err);
        setError("No se pudo cargar la configuración de áreas.");
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchAreas();
  }, [isEditing, initialData]);

  // Manejo de especialidades dinámicas basadas en el área seleccionada
  const selectedAreaObj = areasData.find(a => a.id_area.toString() === areaId.toString());
  const especialidadesOptions = selectedAreaObj ? selectedAreaObj.especialidades : [];

  const handleGuardar = async () => {
    setError('');

    // Validaciones
    if (!areaId) return setError('Debes seleccionar un área.');
    if (!especialidadId) return setError('Debes seleccionar una especialidad.');
    if (!fechaIngreso) return setError('Debes indicar la fecha de ingreso.');
    if (!salario || isNaN(salario)) return setError('Debes indicar un salario válido.');
    if (!moneda) return setError('Debes seleccionar la moneda del salario.');

    setLoading(true);
    const payload = {
      candidato: candidato.id_candidato,
      area_definitiva: areaId,
      especialidad_asignada: especialidadId,
      fecha_ingreso: fechaIngreso,
      salario_acordado: parseFloat(salario),
      moneda_salario: moneda,
    };

    try {
      if (isEditing) {
        await api.put(`contrataciones/${initialData.id}/`, payload);
      } else {
        await api.post('contrataciones/', payload);
      }
      setExito(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al procesar contratación:", err);
      if (err.response?.data) {
        const errores = err.response.data;
        const mensaje = typeof errores === 'string' ? errores : Object.values(errores).flat().join(' ');
        setError(mensaje || 'Error al procesar la contratación.');
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
        <div style={isEditing ? estilos.headerEdit : estilos.header}>
          <button style={estilos.closeBtn} onClick={onClose}>×</button>
          <div style={estilos.iconCircle}>
            {isEditing ? <FiEdit color="white" size={28} /> : <FiBriefcase color="white" size={28} />}
          </div>
          <h2 style={estilos.title}>{isEditing ? 'Editar Contratación' : 'Procesar Contratación'}</h2>
          <p style={estilos.subtitle}>Candidato: {candidato.nombre_completo}</p>
        </div>

        {/* Contenido */}
        {exito ? (
          <div style={{ padding: '28px' }}>
            <div style={estilos.successBox}>
              <FiCheck size={24} style={{ marginBottom: '8px' }} />
              <br />
              ¡Contratación {isEditing ? 'actualizada' : 'procesada'} exitosamente!
            </div>
          </div>
        ) : (
          <>
            <div style={estilos.body}>
              {error && <div style={estilos.errorBox}>{error}</div>}

              <div style={estilos.row}>
                <div style={estilos.col}>
                  <label style={estilos.label}>Área a Asignar</label>
                  <select
                    style={estilos.select}
                    value={areaId}
                    onChange={(e) => {
                      setAreaId(e.target.value);
                      setEspecialidadId(''); // Reset especialidad
                    }}
                    disabled={loadingConfig}
                  >
                    <option value="">{loadingConfig ? 'Cargando...' : '— Seleccionar —'}</option>
                    {areasData.map(a => (
                      <option key={a.id_area} value={a.id_area}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
                <div style={estilos.col}>
                  <label style={estilos.label}>Especialidad</label>
                  <select
                    style={estilos.select}
                    value={especialidadId}
                    onChange={(e) => setEspecialidadId(e.target.value)}
                    disabled={!areaId || loadingConfig}
                  >
                    <option value="">— Seleccionar —</option>
                    {especialidadesOptions.map(e => (
                      <option key={e.id_especialidad} value={e.id_especialidad}>{e.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={estilos.fieldGroup}>
                <label style={estilos.label}>Fecha de Ingreso</label>
                <input
                  type="date"
                  style={estilos.input}
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                />
              </div>

              <div style={estilos.row}>
                <div style={estilos.col}>
                  <label style={estilos.label}>Salario Acordado</label>
                  <input
                    type="number"
                    style={estilos.input}
                    placeholder="Ej. 1500"
                    value={salario}
                    onChange={(e) => setSalario(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div style={estilos.col}>
                  <label style={estilos.label}>Moneda</label>
                  <select
                    style={estilos.select}
                    value={moneda}
                    onChange={(e) => setMoneda(e.target.value)}
                  >
                    <option value="USD">USD - Dólar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div style={estilos.actions}>
              <button
                style={{
                  ...estilos.btnBase,
                  background: isEditing 
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#ffffff',
                  opacity: loading ? 0.7 : 1,
                }}
                onClick={handleGuardar}
                disabled={loading}
              >
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar Contratación' : 'Confirmar Contratación')}
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

export default ProcessHiringModal;
