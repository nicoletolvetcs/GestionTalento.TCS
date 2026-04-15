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

const FormInput = ({ label, placeholder, type = "text", value, onChange, width = "100%", disabled = false, readOnly = false }) => (
  <div style={{ width, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      style={{
        height: '42px',
        padding: '0 16px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        fontSize: '16px',
        fontFamily: 'Inter',
        outline: 'none',
        backgroundColor: disabled || readOnly ? '#F3F4F6' : 'white',
        color: disabled || readOnly ? '#6B7280' : 'inherit'
      }}
    />
  </div>
);

const FormSection = ({ title, children }) => (
  <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
    <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
      <h3 style={{ color: '#1F2937', fontSize: '18px', fontWeight: '600', fontFamily: 'Inter', margin: 0 }}>
        {title}
      </h3>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {children}
    </div>
  </div>
);

const FileDropzone = ({ label, helperText, accept, maxFiles, files, onChange }) => (
  <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{label}</span>
    <div style={{
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
        accept={accept}
        style={{ display: 'none' }}
        onChange={onChange}
      />
      {files && files.legth > 0 ? (
        <div style={{ color: '#1A73E8', fontSize: '14px', fontWeight: 'bold' }}>
          {files.length} archivo(s) seleccionado(s)
        </div>
      ) : (
        <>
          <div style={{ color: '#6B7280', fontSize: '14px' }}>Arrastra o haz clic aquí</div>
          <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{helperText}</div>
        </>
      )}
    </div>
  </div>
);


const RegisterTalent = ({ onBack }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre_completo: '',
    email: '',
    telefono: '',
  });
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  // Estado para las areas de trabajo 
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  //Estado para las expectativas salariales
  const [salarial, setSalarial] = useState('');
  // Estados para los Archivos
  const [docsIdentidad, setDocsIdentidad] = useState([]); // Array de máx 3
  const [cv, setCv] = useState(null); // Archivo único (máx 1)

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const respuesta = await
          api.get('areas/');
        setAreas(respuesta.data);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      }
    };
    cargarAreas();
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


  return (
    <div style={{ backgroundColor: 'rgb(243, 244, 246)', width: '100%', minHeight: 'calc(100vh - 68px)', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px', fontSize: '16px', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
        {/* Botón Volver */}
        {onBack && (
          <button
            onClick={onBack}
            style={{ color: '#1A73E8', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '16px', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}
          >
            <FaArrowLeft />
            Volver a Búsqueda
          </button>
        )}

        <div style={{ background: 'white', padding: '32px', paddingTop: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '32px', fontFamily: 'Inter' }}>Registro de Nuevo Candidato</h2>

          <form>
            <FormSection title="I. Datos Personales">
              <FormInput label="Nombre Completo *" placeholder="Nombres y Apellidos" />
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FormInput label="Identificación *" placeholder="12345678" width="50%" />
                <FormInput label="Fecha de Nacimiento *" type="date" width="50%" />
              </div>
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FormInput label="Teléfono *" placeholder="+584121234567" width="50%" />
                <FormInput label="Correo Electrónico *" type="email" placeholder="correo@ejemplo.com" width="50%" />
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
              <FormInput label="Dirección *" placeholder="Direccion corta" />
            </FormSection>

            <FormSection title="II. Perfil Profesional">
              <div style={{ width: '100%' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Área de Trabajo *</label>
                <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}>
                  <option>Seleccione un área...</option>
                  {areas.map((area) => (
                    <option key={area.id_area} value={area.id_area}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </FormSection>

            <FormSection title="III. Documentación y Aspiración">
              <FormInput label="Expectativa Salarial " type="number" placeholder="Ej: 800" value={salarial} onChange={(e) => setSalarial(e.target.value)} />
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FileDropzone label="Documento de Identidad y Referencias Personales" helperText="PDF o JPG (máx. 5MB)" accept=".pdf', '.jpg', '.jpeg" maxFiles={3} files={docsIdentidad} onChange={handleDocsIdentidadChange} />
                <FileDropzone label="Curriculum Vitae" helperText="PDF o JPG (máx. 5MB)" accept=".pdf', '.jpg', '.jpeg" maxFiles={1} files={cv} onChange={handleCvChange} />
              </div>
            </FormSection>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
              <button type="button" onClick={onBack} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', background: '#1A73E8', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
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
