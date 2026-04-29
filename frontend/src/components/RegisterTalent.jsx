import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import ciudadesVE from '../ciudadesVE.json';
import api from '../api';

const FormSelect = ({ label, value, onChange, options, width = "100%", defaultOption = "Seleccione...", disabled = false }) => (
  <div style={{ width, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        height: '42px',
        padding: '0 16px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        fontSize: '16px',
        fontFamily: 'Inter',
        outline: 'none',
        backgroundColor: disabled ? '#F3F4F6' : 'white',
        color: disabled ? '#6B7280' : 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      <option value="">{defaultOption}</option>
      {options?.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const FormInput = ({ label, placeholder, type = "text", value, onChange,
  width = "100%", disabled = false, readOnly = false,
  name, error }) => (
  <div style={{ width, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      style={{
        height: '42px',
        padding: '0 16px',
        borderRadius: '8px',
        border: error ? '1px solid #EF4444' : '1px solid #E5E7EB',
        fontSize: '16px',
        fontFamily: 'Inter',
        outline: 'none',
        backgroundColor: disabled || readOnly ? '#F3F4F6' : 'white',
        color: disabled || readOnly ? '#6B7280' : 'inherit'
      }}
    />
    {error && (
      <span style={{ color: '#EF4444', fontSize: '12px', fontFamily: 'Inter' }}>
        {error}
      </span>
    )}
  </div>
);

const FormSection = ({ title, children }) => (
  <div
    style={{
      alignSelf: "stretch",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      marginBottom: "32px",
    }}
  >
    <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "8px" }}>
      <h3
        style={{
          color: "#1F2937",
          fontSize: "18px",
          fontWeight: "600",
          fontFamily: "Inter",
          margin: 0,
        }}
      >
        {title}
      </h3>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {children}
    </div>
  </div>
);

const FileDropzone = ({ label, helperText, accept, maxFiles, files, onChange }) => (
  <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{label}</span>
    <label style={{
      height: '132px',
      borderRadius: '8px',
      border: '2px dashed #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: '#FAFBFC'
    }}>
      <input
        type="file"
        multiple={maxFiles > 1}
        accept={accept}
        style={{ display: 'none' }}
        onChange={onChange}
      />
      {files && files.length > 0 ? (
        <div style={{ color: '#1A73E8', fontSize: '14px', fontWeight: 'bold' }}>
          {files.length} archivo(s) seleccionado(s)
        </div>
      ) : (
        <>
          <div style={{ color: '#6B7280', fontSize: '14px' }}>Arrastra o haz clic aquí</div>
          <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{helperText}</div>
        </>
      )}
    </label>
  </div>
);

const RegisterTalent = ({ onBack }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre_completo: '',
    email: '',
    telefono: '+58',
    direccion: '',
    fecha_nacimiento: '',
  });
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [errors, setErrors] = useState({
    nombre_completo: '',
    telefono: '',
    cedula: '',
  });
  const [erroresServidor, setErroresServidor] = useState({});


  // Estado para la data cruda del backend
  const [areas, setAreas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  // Estado para agregar multiples areas y especiliades a el candidato 
  const [bloquesAreas, setBloquesAreas] = useState([
    { area: '', especialidades: [] }
  ]);
  const agregarBloque = () => {
    setBloquesAreas([...bloquesAreas, { area: '', especialidades: [] }]);
  };

  const handleAreaChange = (index, value) => {
    const nuevosBloques = [...bloquesAreas];
    nuevosBloques[index].area = value;
    // Si cambia de area, se limpian las especialidades previas
    nuevosBloques[index].especialidades = [];
    setBloquesAreas(nuevosBloques);
  };

  const handleEspecialidadesChange = (index, selectedOptions) => {
    const nuevosBloques = [...bloquesAreas];
    const values = Array.from(selectedOptions, option => option.value);
    nuevosBloques[index].especialidades = values;
    setBloquesAreas(nuevosBloques);
  };

  const eliminarBloque = (index) => {
    const nuevosBloques = [...bloquesAreas];
    nuevosBloques.splice(index, 1);
    setBloquesAreas(nuevosBloques);
  };
  //Estado para las expectativas salariales
  const [salarial, setSalarial] = useState('');
  // Estados para los Archivos
  const [docsIdentidad, setDocsIdentidad] = useState([]); // Array de máx 3
  const [cv, setCv] = useState(null); // Archivo único (máx 1)

  const [disponibilidad, setDisponibilidad] = useState('');
  const opcionesDisponibilidad = ['Inmediata',
    '15 días', '30 días', 'Remoto',
    'Presencial', 'Híbrido', 'Negociable'];
  const [moneda, setMoneda] = useState('');
  const opcionesMoneda = ['USD', 'EUR'];

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [resAreas, resEspec] = await Promise.all([
          api.get('areas/'),
          api.get('especialidades/')
        ]);
        setAreas(resAreas.data);
        setEspecialidades(resEspec.data);
      } catch (error) {
        console.error("Error al cargar filtros:", error);
      }
    };
    cargarDatosIniciales();
  }, []);





  const handleDocsIdentidadChange = (e) => {
    const choosenFiles = Array.from(e.target.files);
    if (choosenFiles.length > 3) {
      alert("Solamente puedes subir un máximo de 3 archivos en esta sección.");
      setDocsIdentidad(choosenFiles.slice(0, 3));
    } else {
      setDocsIdentidad(choosenFiles);
    }
  };
  const handleCvChange = (e) => {
    const choosenFile = Array.from(e.target.files);
    if (choosenFile.length > 1) {
      alert("Solamente puedes subir un archivo en esta sección.");
      setCv(choosenFile.slice(0, 1));
    } else {
      setCv(choosenFile);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // --- Validacion de Nombre Completo ---
    if (name === 'nombre_completo') {
      // Rechazamos cualquier caracter que sea numero
      const sinNumeros = value.replace(/[0-9]/g, '');
      // Transformamos las primeras letras de cada palabra a mayuscula
      const formatoNombre = sinNumeros.replace(/\b\w/g, (char) => char.toUpperCase());
      // Actualizamos estado y establecemos errores
      setFormData({ ...formData, [name]: formatoNombre });
      setErrors({
        ...errors,
        nombre_completo: /[0-9]/.test(value) ? 'El nombre no puede contener números.' : '',
      });
      return; // salimos aquí para no caer al setFormData genérico
    }

    // --- Validacion de Cedula ---
    if (name === 'cedula') {
      let nuevaVal = value.toUpperCase(); // Forzar mayúscula

      // Regla 1: El primer carácter SOLO puede ser V o E
      if (nuevaVal.length === 1 && !['V', 'E'].includes(nuevaVal)) {
        setErrors({ ...errors, cedula: 'Debe iniciar con V o E.' });
        return; // No actualiza el estado, bloquea la escritura
      }

      // Regla 2: Del segundo carácter en adelante, solo números
      if (nuevaVal.length > 1) {
        const resto = nuevaVal.slice(1).replace(/\D/g, ''); // Quitar no-numéricos
        nuevaVal = nuevaVal[0] + resto;
      }

      setFormData({ ...formData, [name]: nuevaVal });
      setErrors({
        ...errors,
        cedula: nuevaVal.length > 0 && !['V', 'E'].includes(nuevaVal[0])
          ? 'Debe iniciar con V o E.'
          : '',
      });
      return;
    }

    // --- Validacion de telefono ---
    if (name === 'telefono') {
      let tel = value;
      const prefijo = '+58 ';

      // asegurar que siempre empiece con +58
      if (!tel.startsWith(prefijo)) {
        tel = prefijo; // Si intenta borrar el prefijo, se restaura
      }

      // Solo permitir numeros despues del prefijo 
      const parteUsuario = tel.slice(prefijo.length).replace(/\D/g, '');
      tel = prefijo + parteUsuario;

      // Validamos el patron completo +58 4XX XXXXXXX
      const telefonoLimpio = parteUsuario;
      let msgError = '';
      if (telefonoLimpio.length > 0 && telefonoLimpio[0] !== '4') {
        msgError = 'Despues de +58, el numero debe empezar con 4';
      }
      else if (telefonoLimpio.length > 10) {
        msgError = 'El número no puede exceder 10 dígitos.';
        tel = prefijo + parteUsuario.slice(0, 10); // Truncamos el numero excedente 
      }
      setFormData({ ...formData, [name]: tel });
      setErrors({ ...errors, telefono: msgError });
      return;
    }

    // --- Demás campos ---
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se reinicie

    const pack = new FormData();

    // Agregamos los campos de texto
    pack.append('cedula', formData.cedula);
    pack.append('nombre_completo', formData.nombre_completo);
    pack.append('email', formData.email);
    pack.append('telefono', formData.telefono);
    pack.append('direccion', formData.direccion);
    pack.append('fecha_nacimiento', formData.fecha_nacimiento);
    pack.append('pais', pais);
    pack.append('ciudad', ciudad);

    //  Agregamos las áreas y especialidades
    bloquesAreas.forEach(bloque => {
      bloque.especialidades.forEach(espId => {
        // Django automáticamente tomará esto como la lista M2M (Muchas a Muchas)
        pack.append('especialidades', espId);
      });
    });

    if (salarial) {
      pack.append('aspiracion_salarial', salarial);
      pack.append('moneda', moneda);
    }
    if (disponibilidad) pack.append('disponibilidad', disponibilidad);

    //  Agregamos los archivos
    if (docsIdentidad.length > 0) {
      pack.append('url_documento_id', docsIdentidad[0]);
    }
    // Si cv es un array,  tomamos el primer elemento
    if (cv && cv.length > 0) {
      pack.append('url_referencias', cv[0]);
    }

    //  Agregamos el estatus por defecto
    pack.append('estatus', 'Pendiente');

    try {
      const respuesta = await api.post('candidatos/', pack, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Candidato registrado como un éxito!");
    } catch (error) {
      console.error("Detalle del error:", error.response?.data || error);
      const errorMsg = error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : "Revisa si faltaron datos obligatorios.";
      alert("Falló la creación. El servidor dice:\n\n" + errorMsg);
    }
  };
  return (
    <div
      style={{
        backgroundColor: "rgb(243, 244, 246)",
        width: "100%",
        minHeight: "calc(100vh - 68px)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "36px 24px",
          fontSize: "16px",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
        }}
      >
        {/* Botón Volver */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              color: "#1A73E8",
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              fontSize: "16px",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
            }}
          >
            <FaArrowLeft />
            Volver a Búsqueda
          </button>
        )}

        <div
          style={{
            background: "white",
            padding: "32px",
            paddingTop: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            border: "1px solid #E5E7EB",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "32px",
              fontFamily: "Inter",
            }}
          >
            Registro de Nuevo Candidato
          </h2>

          <form onSubmit={handleSubmit}>
            <FormSection title="I. Datos Personales">
              <FormInput
                label="Nombre Completo *"
                placeholder="Nombres y Apellidos"
                value={formData.nombre_completo}
                onChange={handleInputChange}
                name="nombre_completo"
                error={errors.nombre_completo}
              />
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FormInput
                  label="Identificación *"
                  placeholder="V-12345678"
                  width="50%"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  name="cedula"
                  error={errors.cedula}
                />
                <FormInput label="Fecha de Nacimiento *"
                  type="date"
                  width="50%"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  name="fecha_nacimiento" />
              </div>
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FormInput label="Teléfono *"
                  placeholder="+58 412..."
                  width="50%"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  name="telefono"
                  error={errors.telefono}
                />
                <FormInput label="Correo Electrónico *"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  width="50%"
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email" />
              </div>
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FormSelect
                  label="País *"
                  value={pais}
                  onChange={(e) => {
                    setPais(e.target.value);
                    if (e.target.value !== 'Venezuela') setCiudad('');
                  }}
                  options={['Venezuela']}
                  width="50%"
                  defaultOption="Seleccione un país..."
                />

                {pais === 'Venezuela' ? (
                  <FormSelect
                    label="Ciudad *"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    options={ciudadesVE}
                    width="50%"
                    defaultOption="Seleccione una ciudad..."
                  />
                ) : (
                  <FormSelect
                    label="Ciudad *"
                    value=""
                    onChange={() => { }}
                    options={[]}
                    width="50%"
                    defaultOption="Seleccione un país primero..."
                    disabled
                  />
                )}
              </div>
              <FormInput label="Dirección *"
                placeholder="Direccion corta"
                value={formData.direccion}
                onChange={handleInputChange}
                name="direccion" />
            </FormSection>

            <FormSection title="II. Perfil Profesional">
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bloquesAreas.map((bloque, index) => {
                  const especialidadesDelArea = especialidades.filter(e => e.area === parseInt(bloque.area));
                  return (
                    <div key={index} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FAFBFC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <label style={{ fontSize: '16px', fontWeight: '500' }}>Área de Trabajo {index + 1} *</label>
                        {index > 0 && (
                          <button type="button" onClick={() => eliminarBloque(index)} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                            Eliminar
                          </button>
                        )}
                      </div>

                      <select value={bloque.area} onChange={(e) => handleAreaChange(index, e.target.value)}
                        style={{
                          width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: 'Inter', fontSize: '16px', marginBottom: '16px',
                          color: bloque.area === '' ? '#6B7280' : '#1F2937'
                        }}>
                        <option value="">Seleccione un área...</option>
                        {areas.map((area) => (
                          <option key={area.id_area} value={area.id_area}>
                            {area.nombre}
                          </option>
                        ))}
                      </select>

                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Especialidades (Múltiple) *</label>
                      <select multiple disabled={!bloque.area} value={bloque.especialidades} onChange={(e) => handleEspecialidadesChange(index, e.target.selectedOptions)}
                        style={{
                          width: '100%', minHeight: '100px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', padding: '8px', fontFamily: 'Inter', fontSize: '14px',
                          opacity: !bloque.area ? 0.6 : 1, cursor: !bloque.area ? 'not-allowed' : 'pointer',
                          color: bloque.especialidades.length === 0 ? '#6B7280' : '#1F2937'
                        }}>
                        {especialidadesDelArea.length === 0 && <option value="" disabled>{bloque.area ? "No hay especialidades..." : "Primero seleccione un área"}</option>}
                        {especialidadesDelArea.map((esp) => (
                          <option key={esp.id_especialidad} value={esp.id_especialidad}>
                            {esp.nombre}
                          </option>
                        ))}
                      </select>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>* Mantén presionado Ctrl (o Cmd en Mac) para elegir múltiples</p>
                    </div>
                  );
                })}
                <button type="button" onClick={agregarBloque} style={{ width: 'fit-content', padding: '8px 16px', borderRadius: '8px', border: '1px dashed #1A73E8', color: '#1A73E8', background: 'transparent', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  + Agregar Nueva Área
                </button>
              </div>
              <FormSelect
                label="Disponibilidad *"
                value={disponibilidad}
                onChange={(e) => setDisponibilidad(e.target.value)}
                options={opcionesDisponibilidad}
                width="100%"
              />
            </FormSection>

            <FormSection title="III. Documentación y Aspiración">
              <div style={{ display: 'flex', gap: '16px', width: '100%', alignItems: 'center' }}>
                <FormInput
                  label="Expectativa Salarial (Opcional)"
                  type="number"
                  placeholder="Ej: 800"
                  value={salarial}
                  onChange={(e) => setSalarial(e.target.value)}
                  width="70%"
                />
                <FormSelect
                  label="Moneda"
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  options={['USD', 'EUR']}
                  width="30%"
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FileDropzone label="Documento de Identidad y Referencias Personales (Opcional)" helperText="PDF (máx. 10MB)" accept=".pdf" maxFiles={3} files={docsIdentidad} onChange={handleDocsIdentidadChange} />
                <FileDropzone label="Curriculum Vitae *" helperText="PDF (máx. 10MB)" accept=".pdf" maxFiles={1} files={cv} onChange={handleCvChange} />
              </div>
            </FormSection>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
              <button type="button" onClick={onBack} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: '14px' }}>
                Cancelar
              </button>
              <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', background: '#1A73E8', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
                Guardar Candidato
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTalent;
