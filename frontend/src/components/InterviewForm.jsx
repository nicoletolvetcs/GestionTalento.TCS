import React, { useState, useEffect } from "react";
import { FiStar } from "react-icons/fi";
import { FaArrowLeft, FaRegCheckCircle, FaFolderOpen } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import api from "../api";

const InterviewForm = ({ onBack }) => {
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [dictamen, setDictamen] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [candidatosLista, setCandidatosLista] = useState([]);
  const [ratings, setRatings] = useState({
    tecnica: 1,
    comunicacion: 1,
    interes: 1,
  });

  useEffect(() => {
    api.get("candidatos/")
      .then((response) => {
        const data = response.data.results ? response.data.results : response.data;
        setCandidatosLista(data);
      })
      .catch((err) => console.error("Error al cargar candidatos:", err));
  }, []);

  // Mappeo de los datos 
  const candidatoSeleccionado = candidatosLista.find(
    (c) => c.id_candidato.toString() === selectedCandidate
  );

  const candidatoInfo = candidatoSeleccionado
    ? {
      nombre: candidatoSeleccionado.nombre_completo,
      rol: candidatoSeleccionado.area_nombre || "Área General",
      detalles: candidatoSeleccionado.especialidades_detalle?.map(e => e.nombre) || [],
      entrevistador: "Recursos Humanos",
      area: candidatoSeleccionado.area_nombre || "No definida",
      fecha: new Date().toLocaleDateString(),
    }
    : null;

  const handleSubmit = async () => {
    if (!selectedCandidate || !dictamen) {
      alert("Por favor seleccione un candidato y aplique un dictamen final (Elegible, etc.)");
      return;
    }
    
    if (!observaciones.trim()) {
      alert("Por favor escriba las observaciones de la entrevista.");
      return;
    }

    const payload = {
      candidato: parseInt(selectedCandidate),
      entrevistador: null,
      fecha_entrevista: new Date().toISOString(),
      observaciones: observaciones,
      eligibilidad: dictamen,
      puntuacion_tecnica: ratings.tecnica,
      puntuacion_comunicacion: ratings.comunicacion,
      puntuacion_interes: ratings.interes,
      justificacion_dictamen: justificacion
    };

    try {
      await api.post('entrevistas/', payload);
      alert("¡Entrevista guardada exitosamente!");
      if (onBack) onBack();
    } catch (error) {
      console.error("Fallo al guardar:", error.response?.data || error);
      alert("Hubo un error al guardar. Revisa la consola.");
    }
  };

  const StarRating = ({ label, category }) => (
    <div style={styles.ratingRow}>
      <span style={styles.ratingLabel}>{label}</span>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            onClick={() => setRatings({ ...ratings, [category]: star })}
            style={{
              cursor: "pointer",
              fill: star <= ratings[category] ? "#F59E0B" : "none",
              color: star <= ratings[category] ? "#F59E0B" : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        <FaArrowLeft /> Volver a Búsqueda
      </button>

      <div style={styles.card}>
        <h2 style={styles.title}>Registro de Entrevista</h2>

        <label style={styles.label}>Seleccionar Candidato *</label>
        <select
          style={styles.select}
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
          <option value="">Seleccione un candidato</option>
          {candidatosLista.map((cand) => (
            <option key={cand.id_candidato} value={cand.id_candidato}>
              {cand.nombre_completo} - {cand.area_nombre || cand.email}
            </option>
          ))}
        </select>

        {candidatoInfo && (
          <>
            <div style={styles.infoBox}>
              <div style={styles.avatar}>
                {candidatoInfo.nombre.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{candidatoInfo.nombre}</div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  {candidatoInfo.rol}
                </div>
                <div style={styles.tagContainer}>
                  {candidatoInfo.detalles.map((tag) => (
                    <span key={tag} style={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <h3 style={styles.sectionTitle}>
              Datos de la Entrevista (Automático)
            </h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.subLabel}>Entrevistador</label>
                <div>{candidatoInfo.entrevistador}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Área</label>
                <div>{candidatoInfo.area}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Fecha</label>
                <div>{candidatoInfo.fecha}</div>
              </div>
            </div>

            <h3 style={styles.sectionTitle}>Evaluación de la Entrevista</h3>
            <label style={styles.subLabel}>
              Observaciones, Fortalezas y Debilidades *
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Describa las observaciones..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />

            <h3 style={styles.sectionTitle}>Puntuación de Competencias</h3>
            <StarRating label="Competencia Técnica" category="tecnica" />
            <StarRating label="Comunicación" category="comunicacion" />
            <StarRating label="Nivel de Interés" category="interes" />

            <div style={styles.footer}>
              <h3 style={styles.sectionTitle}>Dictamen Final *</h3>
              <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                {[
                  { 
                    label: "ELEGIBLE", 
                    val: "elegible", 
                    icon: <FaRegCheckCircle size={32} color={dictamen === "elegible" ? "#1A73E8" : "#6B7280"} />, 
                    desc: "Candidato apto para contratación" 
                  },
                  { 
                    label: "EN CARTERA", 
                    val: "en_cartera", 
                    icon: <FaFolderOpen size={32} color={dictamen === "en_cartera" ? "#1A73E8" : "#6B7280"} />, 
                    desc: "Mantener para futuras oportunidades" 
                  },
                  { 
                    label: "NO ELEGIBLE", 
                    val: "no_elegible", 
                    icon: <IoMdCloseCircle size={32} color={dictamen === "no_elegible" ? "#1A73E8" : "#6B7280"} />, 
                    desc: "No cumple con los requisitos" 
                  },
                ].map((opt) => (
                  <div
                    key={opt.val}
                    onClick={() => setDictamen(opt.val)}
                    style={{
                      ...styles.optionCard,
                      ...(dictamen === opt.val ? styles.optionSelected : {}),
                    }}
                  >
                    {opt.icon}
                    <div style={{ ...styles.optionLabel, color: dictamen === opt.val ? "#1A73E8" : "#374151" }}>
                      {opt.label}
                    </div>
                    <div style={styles.optionDesc}>
                      {opt.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={styles.subLabel}>
                  Justificación del Dictamen *
                </label>
                <textarea
                  style={styles.textarea}
                  placeholder="Explique brevemente el porqué de su decisión..."
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                />
              </div>

              <button style={styles.cancelBtn} onClick={onBack}>
                Cancelar
              </button>
              <button style={styles.saveBtn} onClick={handleSubmit}>
                Finalizar Entrevista y Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Inter",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "none",
    border: "none",
    color: "#1A73E8",
    cursor: "pointer",
    marginBottom: "20px",
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: "600",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  title: { fontSize: "24px", marginBottom: "20px", color: "#111827" },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 500,
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    marginBottom: "20px",
  },
  infoBox: {
    display: "flex",
    gap: "15px",
    padding: "15px",
    background: "#F9FAFB",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    background: "#3B82F6",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  tagContainer: { display: "flex", gap: "8px", marginTop: "5px" },
  tag: {
    fontSize: "10px",
    background: "#E5E7EB",
    padding: "2px 8px",
    borderRadius: "10px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    margin: "25px 0 15px 0",
    borderBottom: "1px solid #F3F4F6",
    paddingBottom: "5px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  subLabel: {
    color: "#6B7280",
    fontSize: "12px",
    display: "block",
    marginBottom: "4px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    resize: "none",
  },
  ratingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  ratingLabel: { fontSize: "14px" },
  footer: {
    marginTop: "30px",
  },
  optionCard: {
    flex: 1,
    padding: "20px 15px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    textAlign: "center",
    backgroundColor: "white",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    borderColor: "#1A73E8",
    backgroundColor: "#F4F8FF",
    boxShadow: "0 0 0 1px #1A73E8",
  },
  optionLabel: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#374151",
    marginBottom: "5px",
    marginTop: "10px",
  },
  optionDesc: {
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "400",
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    background: "white",
    cursor: "pointer",
    marginRight: "10px",
  },
  saveBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#1A73E8",
    color: "white",
    cursor: "pointer",
  },
};

export default InterviewForm;
