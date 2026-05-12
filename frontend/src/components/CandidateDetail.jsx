import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import CandidateInfoCard from './CandidateInfoCard';
import CandidateActionsCard from './CandidateActionsCard';
import AssignInterviewerModal from './AssignInterviewerModal';
import ManageInterviewModal from './ManageInterviewModal';
import ProcessHiringModal from './ProcessHiringModal';
import EditCandidateModal from './EditCandidateModal';
import api from '../api';

// ── Estilos del layout principal ──
const estilos = {
  container: {
    padding: '40px',
    backgroundColor: '#F3F4F6',
    minHeight: 'calc(100vh - 68px)',
    fontFamily: '"Inter", sans-serif',
    boxSizing: 'border-box',
  },
  backBtn: {
    color: '#1A73E8',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    fontSize: '15px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 600,
    padding: 0,
    transition: 'opacity 0.2s',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1F2937',
    margin: '0 0 24px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },
};

const CandidateDetail = ({ candidato: candidatoInicial, onBack, onVerFicha, onRellenarEntrevista }) => {
  // Estado local del candidato (para poder actualizar el estatus sin volver al padre)
  const [candidato, setCandidato] = useState(candidatoInicial);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // ── Recargar datos del candidato desde el backend ──
  const recargarCandidato = async () => {
    try {
      const response = await api.get(`candidatos/${candidato.id_candidato}/`);
      setCandidato(response.data);
    } catch (error) {
      console.error("Error recargando candidato:", error);
    }
  };

  // ── Cambiar estatus del candidato en el backend ──
  const handleCambiarEstatus = async (nuevoEstatus) => {
    try {
      await api.patch(`candidatos/${candidato.id_candidato}/`, {
        estatus: nuevoEstatus,
      });
      // Actualizar el estado local
      setCandidato({ ...candidato, estatus: nuevoEstatus });
    } catch (error) {
      console.error("Error al cambiar estatus:", error);
      alert("No se pudo actualizar el estatus. Intenta de nuevo.");
    }
  };

  // ── Descargar CV ──
  const handleDescargarCV = (cand) => {
    const url = cand?.curriculum_vitae || cand?.documento_identidad;
    if (!url) {
      alert(`${cand.nombre_completo} no posee documentos registrados.`);
      return;
    }
    window.open(url, "_blank");
  };

  // ── Imprimir Ficha (reutiliza componente existente) ──
  const handleImprimirFicha = (cand) => {
    onVerFicha(cand);
  };

  // ── Asignar Entrevistador (abre el modal de asignación) ──
  const handleAsignarEntrevistador = () => {
    setShowAssignModal(true);
  };

  // ── Gestionar Entrevista (abre el modal dinámico) ──
  const handleGestionarEntrevista = () => {
    setShowManageModal(true);
  };

  // ── Evaluar / Editar Entrevista (navega al formulario) ──
  const handleEvaluarEntrevista = (cand) => {
    onRellenarEntrevista(cand);
  };

  // ── Desde ManageInterviewModal: solicitar abrir AssignInterviewerModal ──
  const handleRequestAssign = () => {
    setShowManageModal(false);
    setShowAssignModal(true);
  };

  // ── Procesar Contratación ──
  const handleProcesarContratacion = () => {
    setShowHiringModal(true);
  };

  // ── Editar datos del candidato (abre modal) ──
  const handleEditarDatos = () => {
    setShowEditModal(true);
  };

  return (
    <>
      <div style={estilos.container}>
        {/* Botón Volver */}
        <button style={estilos.backBtn} onClick={onBack}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <FaArrowLeft />
          Volver a Búsqueda
        </button>

        <h1 style={estilos.title}>Detalle de Candidato</h1>

        {/* Grid de 2 columnas */}
        <div style={estilos.grid}>
          {/* Columna Izquierda: Info */}
          <CandidateInfoCard
            candidato={candidato}
            onEditarDatos={handleEditarDatos}
          />

          {/* Columna Derecha: Acciones */}
          <CandidateActionsCard
            candidato={candidato}
            onCambiarEstatus={handleCambiarEstatus}
            onDescargarCV={handleDescargarCV}
            onImprimirFicha={handleImprimirFicha}
            onAsignarEntrevistador={handleAsignarEntrevistador}
            onGestionarEntrevista={handleGestionarEntrevista}
            onProcesarContratacion={handleProcesarContratacion}
          />
        </div>
      </div>

      {/* Modal de Asignar Entrevistador (siempre POST) */}
      {showAssignModal && (
        <AssignInterviewerModal
          candidato={candidato}
          onClose={() => setShowAssignModal(false)}
          onSuccess={recargarCandidato}
        />
      )}

      {/* Modal de Gestionar Entrevista (dinámico: Caso A, B, C) */}
      {showManageModal && (
        <ManageInterviewModal
          candidato={candidato}
          onClose={() => setShowManageModal(false)}
          onEvaluarEntrevista={handleEvaluarEntrevista}
          onRequestAssign={handleRequestAssign}
        />
      )}

      {/* Modal de Procesar Contratación */}
      {showHiringModal && (
        <ProcessHiringModal
          candidato={candidato}
          onClose={() => setShowHiringModal(false)}
          onSuccess={recargarCandidato}
        />
      )}

      {/* Modal de Editar Candidato */}
      {showEditModal && (
        <EditCandidateModal
          candidato={candidato}
          onClose={() => setShowEditModal(false)}
          onSuccess={recargarCandidato}
        />
      )}
    </>
  );
};

export default CandidateDetail;
