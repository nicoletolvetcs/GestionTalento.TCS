import React, { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";


const FormInput = ({ label, placeholder, type = "text", value, onChange, width = "100%" }) => (
  <div style={{ width, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        height: '42px',
        padding: '0 16px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        fontSize: '16px',
        fontFamily: 'Inter',
        outline: 'none'
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

const FileDropzone = ({ label, helperText }) => (
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
      <div style={{ color: '#6B7280', fontSize: '14px' }}>Arrastra el archivo aquí</div>
      <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{helperText}</div>
    </div>
  </div>
);


const RegisterTalent = ({ onBack }) => {
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
                <FormInput label="Identificación *" placeholder="V-12345678" width="50%" />
                <FormInput label="Fecha de Nacimiento *" type="date" width="50%" />
              </div>
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FormInput label="Teléfono *" placeholder="+58 412..." width="50%" />
                <FormInput label="Correo Electrónico *" type="email" placeholder="correo@ejemplo.com" width="50%" />
              </div>
              <FormInput label="Dirección *" placeholder="Direccion completa" />
            </FormSection>

            <FormSection title="II. Perfil Profesional">
              <div style={{ width: '100%' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Área de Trabajo *</label>
                <select style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' }}>
                  <option>Seleccione un área...</option>
                </select>
              </div>
            </FormSection>

            <FormSection title="III. Documentación y Aspiración">
              <FormInput label="Expectativa Salarial *" type="number" placeholder="Ej: 35000" />
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <FileDropzone label="Documento de Identidad" helperText="PDF o JPG (máx. 5MB)" />
                <FileDropzone label="Referencias Personales" helperText="PDF o JPG (máx. 5MB)" />
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
