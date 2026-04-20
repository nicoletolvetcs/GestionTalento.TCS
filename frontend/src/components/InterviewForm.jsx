import React, { useState } from "react";
import { FiChevronLeft, FiStar } from "react-icons/fi";
import api from "../api";

const InterviewForm = ({ onBack }) => {
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [dictamen, setDictamen] = useState("");
  const [ratings, setRatings] = useState({
    tecnica: 0,
    comunicacion: 0,
    interes: 0,
  });

  // Datos simulados para el ejemplo
  const candidateInfo =
    selectedCandidate === "1"
      ? {
          nombre: "Laura Gómez Martin",
          rol: "Diseño UI/UX",
          detalles: ["Diseño de interfaces", "Prototipado"],
          entrevistador: "Carlos Ruiz",
          area: "Desarrollo Web",
          fecha: "16/4/2026",
        }
      : null;

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
        <FiChevronLeft /> Volver a Búsqueda
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
          <option value="1">Laura Gómez Martin - Diseño UI/UX</option>
        </select>

        {candidateInfo && (
          <>
            <div style={styles.infoBox}>
              <div style={styles.avatar}>LG</div>
              <div>
                <div style={{ fontWeight: 600 }}>{candidateInfo.nombre}</div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  {candidateInfo.rol}
                </div>
                <div style={styles.tagContainer}>
                  {candidateInfo.detalles.map((tag) => (
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
                <div>{candidateInfo.entrevistador}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Área</label>
                <div>{candidateInfo.area}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Fecha</label>
                <div>{candidateInfo.fecha}</div>
              </div>
            </div>

            <h3 style={styles.sectionTitle}>Evaluación de la Entrevista</h3>
            <label style={styles.subLabel}>
              Observaciones, Fortalezas y Debilidades *
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Describa las observaciones..."
            />

            <h3 style={styles.sectionTitle}>Puntuación de Competencias</h3>
            <StarRating label="Competencia Técnica" category="tecnica" />
            <StarRating label="Comunicación" category="comunicacion" />
            <StarRating label="Nivel de Interés" category="interes" />

            <div style={styles.footer}>
              <h3 style={styles.sectionTitle}>Dictamen Final *</h3>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                {[
                  { label: "APROBADO", val: "aprobado" },
                  { label: "NO APROBADO", val: "no_aprobado" },
                  { label: "EN ESPERA", val: "en_espera" },
                ].map((opt) => (
                  <div
                    key={opt.val}
                    onClick={() => setDictamen(opt.val)}
                    style={{
                      ...styles.optionCard,
                      ...(dictamen === opt.val ? styles.optionSelected : {}),
                    }}
                  >
                    {opt.label}
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
                />
              </div>

              <button style={styles.cancelBtn} onClick={onBack}>
                Cancelar
              </button>
              <button style={styles.saveBtn}>
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
    fontFamily: "Inter, sans-serif",
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
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  title: { fontSize: "20px", marginBottom: "20px", color: "#111827" },
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
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "13px",
    backgroundColor: "white",
    transition: "all 0.2s",
  },
  optionSelected: {
    borderColor: "#1A73E8",
    backgroundColor: "#EFF6FF",
    color: "#1A73E8",
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
