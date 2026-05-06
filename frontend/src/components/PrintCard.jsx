import React, { useState, useEffect } from 'react';
import { Section, DataField, Badge, GrayBox, StarRating, CheckItem } from './FichaCard';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';


// ─── Encabezado del documento ───────────────────────────────────────────────
const DocumentHeader = ({ code, date }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #1F2937',
    paddingBottom: '24px',
    marginBottom: '32px'
  }}>
    {/* Logo + Título */}
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{
        width: '64px', height: '64px',
        background: '#1A73E8',
        borderRadius: '4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '16px', fontWeight: 'bold',
        flexShrink: 0, textAlign: 'center', lineHeight: '1.2'
      }}>
        SGTH
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: '22px', color: '#1F2937', fontWeight: 'bold', lineHeight: '1.2' }}>
          FICHA DE REGISTRO DE TALENTO
        </h1>
        <span style={{ color: '#6B7280', fontSize: '14px' }}>Sistema de Gestión de Talento Humano</span>
      </div>
    </div>

    {/* Metadatos */}
    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ color: '#6B7280', fontSize: '14px' }}>Código de Proceso:</span>
        <span style={{ color: '#1F2937', fontSize: '16px', fontWeight: '600' }}>#{code}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ color: '#6B7280', fontSize: '14px' }}>Fecha de Generación:</span>
        <span style={{ color: '#1F2937', fontSize: '16px', fontWeight: '600' }}>{date}</span>
      </div>
    </div>
  </div>
);

// ─── I. Información General ──────────────────────────────────────────────────
const GeneralInfo = ({ data }) => (
  <Section title="I. INFORMACIÓN GENERAL DEL CANDIDATO">
    <DataField label="Nombre Completo:" value={data?.nombre} />
    <DataField label="Identificación:" value={data?.identificacion} />
    <DataField label="Fecha de Nacimiento:" value={data?.fechaNacimiento} />
    <DataField
      label="Contacto:"
      customContent={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#1F2937', fontWeight: '500' }}>{data.telefono}</span>
          <span style={{ color: '#1F2937', fontWeight: '500' }}>{data.email}</span>
        </div>
      }
    />
    <DataField label="Ubicación:" value={data?.ubicacion} fullWidth />
  </Section>
);

// ─── II. Perfil Profesional ──────────────────────────────────────────────────
const ProfessionalProfile = ({ data }) => (
  <Section title="II. PERFIL PROFESIONAL Y ASPIRACIÓN">
    <DataField label="• Áreas de Interés:" value={data.area} />
    <DataField label="• Aspiración Salarial:" value={data.aspiracion} />
    <DataField label="• Disponibilidad:" value={data.disponibilidad} />
    <DataField
      label="• Especialidades:" fullWidth={true}
      customContent={
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
          {data.especialidades?.map((esp, i) => <Badge key={i} text={esp} />)}
        </div>
      }
    />
  </Section>
);

// ─── III. Documentación ──────────────────────────────────────────────────────
const Documentation = ({ docs }) => (
  <Section title="III. DOCUMENTACIÓN ADJUNTA">
    <div style={{ display: 'flex', flexDirection: 'row', gap: '80px', width: '100%' }}>
      <CheckItem label="Documento de Identidad y Referencias Personales" checked={docs?.identidad} />
      <CheckItem label="Currículum Vitae" checked={docs?.cv} />
    </div>
  </Section>
);

// ─── IV. Evaluación de la Entrevista ────────────────────────────────────────
const InterviewEvaluation = ({ evalData }) => {
  if (!evalData) {
    return (
      <Section title="IV. EVALUACIÓN DE LA ENTREVISTA">
        <GrayBox>
          Evaluación pendiente: El candidato aún no ha sido entrevistado.
        </GrayBox>
      </Section>
    );
  }
  return (
    <Section title="IV. EVALUACIÓN DE LA ENTREVISTA">
      <DataField label="Datos del Entrevistador:" value={evalData?.entrevistador} />
      <DataField label="Área:" value={evalData?.area} />
      <DataField
        label="Notas de la Entrevista:"
        fullWidth
        customContent={<GrayBox>{evalData?.notas}</GrayBox>}
      />
      <DataField
        label="Puntuación de Competencias:"
        fullWidth
        customContent={
          <div style={{ display: 'flex', gap: '48px', marginTop: '4px', flexWrap: 'wrap' }}>
            <StarRating label="Técnica:" score={evalData?.scoreTecnica} />
            <StarRating label="Comunicación:" score={evalData?.scoreComunicacion} />
            <StarRating label="Interés:" score={evalData?.scoreInteres} />
          </div>
        }
      />
    </Section>
  );
};

// ─── V. Dictamen Final ───────────────────────────────────────────────────────
const FinalAssessment = ({ assessment }) => {

  if (!assessment) {
    return (
      <Section title="V. DICTAMEN FINAL">
        <GrayBox>
          Dictamen pendiente: El candidato aún no ha sido evaluado.
        </GrayBox>
      </Section>
    );
  }
  const st = assessment?.status;
  return (
    <Section title="V. DICTAMEN FINAL">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
        <span style={{ color: '#6B7280', fontSize: '14px' }}>Estatus de Elegibilidad:</span>
        <span style={{ color: '#1F2937', fontSize: '16px', fontWeight: 'bold' }}>{st}</span>
      </div>
      <DataField
        label="Observaciones de Cierre:"
        fullWidth
        customContent={<GrayBox>{assessment?.observaciones}</GrayBox>}
      />
    </Section>
  );
};

// ─── Pie de página ───────────────────────────────────────────────────────────
const DocumentFooter = () => (
  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px', textAlign: 'center', marginTop: '48px' }}>
    <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 4px 0' }}>
      Documento generado por el Sistema de Gestión de Talento Humano (SGTH)
    </p>
    <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
      Este documento contiene información confidencial
    </p>
  </div>
);

// ─── Componente Principal ────────────────────────────────────────────────────
const PrintCard = ({ talentData, onBack }) => {

  // PASO 4: Estado para guardar los datos de la entrevista
  const [entrevista, setEntrevista] = useState(null);

  // PASO 4: useEffect que busca la entrevista del candidato seleccionado
  useEffect(() => {
    if (talentData?.id_candidato) {
      axios.get(`http://localhost:8000/api/entrevistas/?candidato=${talentData.id_candidato}`)
        .then(res => {
          const resultados = res.data.results ? res.data.results : res.data;
          if (resultados.length > 0) setEntrevista(resultados[0]);
        })
        .catch(err => console.error('Error al cargar entrevista:', err));
    }
  }, [talentData]);

  // PASO 3: Traducción Django → Formato de la Ficha
  const data = talentData ? {
    // Si hay entrevista, usamos el ID de la entrevista (para reportes únicos). Si no, usamos el del candidato por defecto.
    procesoId: entrevista ? String(entrevista.id_entrevista).padStart(8, '0') : String(talentData.id_candidato).padStart(8, '0'),
    fechaGeneracion: new Date().toLocaleDateString('es-VE'),

    personal: {
      nombre: talentData.nombre_completo,
      identificacion: talentData.cedula,
      fechaNacimiento: talentData.fecha_nacimiento,
      telefono: talentData.telefono,
      email: talentData.email,
      ubicacion: `${talentData.direccion}, ${talentData.ciudad}, ${talentData.pais}`,
    },

    profesional: {
      area: talentData.area_nombre || 'No definida',
      especialidades: talentData.especialidades_detalle?.map(e => e.nombre) || [],
      aspiracion: `${talentData.aspiracion_salarial} ${talentData.moneda}`,
      disponibilidad: talentData.disponibilidad,
    },

    docs: {
      identidad: !!talentData.url_documento_id,
      cv: !!talentData.url_referencias,
    },

    evaluacion: entrevista ? {
      entrevistador: entrevista.entrevistador_nombre || 'Recursos Humanos',
      area: talentData.area_nombre || 'No definida',
      notas: entrevista.observaciones,
      scoreTecnica: entrevista.puntuacion_tecnica,
      scoreComunicacion: entrevista.puntuacion_comunicacion,
      scoreInteres: entrevista.puntuacion_interes,
    } : null,

    dictamen: entrevista ? {
      status: entrevista.eligibilidad?.toUpperCase().replace('_', ' '),
      observaciones: entrevista.justificacion_dictamen,
    } : null,

  } : null;

  return (
    <div style={{ padding: '24px', background: '#F5F7FA', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>

      {/* Barra de controles superiores */}
      <div className="no-print" style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{ color: '#1A73E8', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FaArrowLeft /> Volver a Búsqueda
        </button>
        <button
          onClick={() => window.print()}
          style={{ background: '#EF4444', color: 'white', padding: '8px 18px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
        >
          <FaFilePdf /> Descargar Ficha PDF
        </button>
      </div>

      {/* Documento principal */}
      <div className="print-card" style={{
        width: '100%',
        maxWidth: '900px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        padding: '48px'
      }}>
        <DocumentHeader code={data.procesoId} date={data.fechaGeneracion} />
        <GeneralInfo data={data.personal} />
        <ProfessionalProfile data={data.profesional} />
        <Documentation docs={data.docs} />
        <InterviewEvaluation evalData={data.evaluacion} />
        <FinalAssessment assessment={data.dictamen} />
        <DocumentFooter />
      </div>

    </div>
  );
};

export default PrintCard;
