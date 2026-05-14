import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaRegCheckCircle, FaFolderOpen, FaUserClock, FaFilePdf } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

/**
 * InterviewEvaluationView
 * Componente de página completa para evaluar una entrevista.
 * Se accede mediante la ruta /entrevistas/evaluar/:candidatoId
 */
const InterviewEvaluationView = ({ onVerFicha }) => {
  const navigate = useNavigate();
  const { candidatoId } = useParams();

  const [candidato, setCandidato] = useState(null);
  const [entrevista, setEntrevista] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const [dictamen, setDictamen] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [ratings, setRatings] = useState({
    tecnica: 1,
    comunicacion: 1,
    interes: 1,
  });

  // Cargar datos del candidato y su entrevista
  useEffect(() => {
    const fetchCandidatoYEntrevista = async () => {
      setLoadingData(true);
      try {
        const [resCandidato, resEntrevistas] = await Promise.all([
          api.get(`candidatos/${candidatoId}/`),
          api.get("entrevistas/"),
        ]);
        const cand = resCandidato.data;
        setCandidato(cand);

        const dataE = resEntrevistas.data.results
          ? resEntrevistas.data.results
          : resEntrevistas.data;
        const ent =
          dataE.find((e) => e.candidato === parseInt(candidatoId)) || null;
        setEntrevista(ent);

        // Precargar datos si ya fue evaluada
        if (ent && ent.eligibilidad) {
          setDictamen(ent.eligibilidad);
          setObservaciones(ent.observaciones || "");
          setJustificacion(ent.justificacion_dictamen || "");
          setRatings({
            tecnica: ent.puntuacion_tecnica || 1,
            comunicacion: ent.puntuacion_comunicacion || 1,
            interes: ent.puntuacion_interes || 1,
          });
        }
      } catch (err) {
        console.error("Error cargando datos de evaluación:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (candidatoId) fetchCandidatoYEntrevista();
  }, [candidatoId]);

  // ── Helpers reutilizables ──
  const validateForm = () => {
    if (!observaciones.trim()) {
      alert("Por favor escriba las observaciones de la entrevista.");
      return false;
    }
    if (!dictamen) {
      alert("Por favor seleccione un dictamen final.");
      return false;
    }
    if (!justificacion.trim()) {
      alert("Por favor escriba las observaciones de cierre / justificación.");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    candidato: candidato.id_candidato,
    fecha_entrevista: new Date().toISOString(),
    observaciones: observaciones,
    eligibilidad: dictamen,
    puntuacion_tecnica: ratings.tecnica,
    puntuacion_comunicacion: ratings.comunicacion,
    puntuacion_interes: ratings.interes,
    justificacion_dictamen: justificacion,
  });

  /**
   * Guarda en el backend. Retorna true si fue exitoso, false si falló.
   */
  const saveToBackend = async (payload) => {
    try {
      if (entrevista && entrevista.id_entrevista) {
        await api.patch(`entrevistas/${entrevista.id_entrevista}/`, payload);
      } else {
        await api.post("entrevistas/", payload);
      }
      return true;
    } catch (error) {
      console.error("Fallo al guardar:", error);
      alert("Hubo un error al guardar. Revisa la consola.");
      return false;
    }
  };

  // ── Botón "Guardar" → guarda y vuelve al Dashboard ──
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const success = await saveToBackend(buildPayload());
    setLoading(false);
    if (success) {
      alert("¡Entrevista guardada exitosamente!");
      navigate("/entrevistas");
    }
  };

  // ── Botón rojo "Imprimir" → guarda en BD, luego abre la ficha PDF ──
  const handleSaveAndPrint = async () => {
    if (!validateForm()) return;
    setPrinting(true);
    const success = await saveToBackend(buildPayload());
    setPrinting(false);
    if (success) {
      // 1. onVerFicha establece currentPage="report" y selectedCandidate en App.jsx
      if (onVerFicha && candidato) onVerFicha(candidato);
      // 2. Navegar fuera de /entrevistas/evaluar/ para que App.jsx renderice la PrintCard
      navigate("/");
    }
  };

  const StarRating = ({ label, category }) => (
    <div style={styles.ratingRow}>
      <span style={styles.ratingLabel}>{label}</span>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            onClick={() =>
              setRatings({ ...ratings, [category]: star })
            }
            style={{
              cursor: "pointer",
              fill:
                star <= ratings[category] ? "#F59E0B" : "none",
              color:
                star <= ratings[category] ? "#F59E0B" : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </div>
  );

  if (loadingData) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.containerForm}>
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "#6B7280",
            }}
          >
            Cargando datos de la evaluación...
          </div>
        </div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.containerForm}>
          <button
            onClick={() => navigate("/entrevistas")}
            style={styles.backButton}
          >
            <FaArrowLeft /> Volver al Dashboard
          </button>
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#EF4444",
            }}
          >
            No se encontró el candidato.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.containerForm}>
        <button
          onClick={() => navigate("/entrevistas")}
          style={styles.backButton}
        >
          <FaArrowLeft /> Volver al Dashboard
        </button>

        <div style={styles.card}>
          <div style={styles.infoBox}>
            <div style={styles.avatar}>
              {candidato.nombre_completo.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>
                {candidato.nombre_completo}
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>
                {candidato.area_nombre || "Área General"}
              </div>
              <div style={styles.tagContainer}>
                {candidato.especialidades_detalle?.map((e) => (
                  <span key={e.nombre} style={styles.tag}>
                    {e.nombre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>
            Datos de la Entrevista (Automático)
          </h3>
          <div style={styles.infoGridBox}>
            <div style={styles.grid}>
              <div>
                <label style={styles.subLabel}>Cédula</label>
                <div>{candidato.cedula}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Teléfono</label>
                <div>{candidato.telefono}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Dirección</label>
                <div>{candidato.direccion}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Ubicación</label>
                <div>{`${candidato.ciudad}, ${candidato.pais}`}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Aspiración</label>
                <div>{`${candidato.aspiracion_salarial} ${candidato.moneda}`}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Disponibilidad</label>
                <div>{candidato.disponibilidad}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Entrevistador</label>
                <div>
                  {entrevista?.entrevistador_nombre ||
                    "Recursos Humanos"}
                </div>
              </div>
              <div>
                <label style={styles.subLabel}>Área</label>
                <div>{candidato.area_nombre || "No definida"}</div>
              </div>
              <div>
                <label style={styles.subLabel}>
                  Fecha programada
                </label>
                <div>
                  {entrevista?.fecha_programada
                    ? new Date(
                        entrevista.fecha_programada
                      ).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>
            Evaluación de la Entrevista
          </h3>
          <label style={styles.subLabel}>
            Observaciones, Fortalezas y Debilidades *
          </label>
          <textarea
            style={styles.textarea}
            placeholder="Describe las observaciones de la entrevista..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />

          <h3 style={styles.sectionTitle}>
            Puntuación de Competencias
          </h3>
          <StarRating label="Competencia Técnica:" category="tecnica" />
          <StarRating label="Comunicación:" category="comunicacion" />
          <StarRating label="Nivel de Interés:" category="interes" />

          <div style={styles.footer}>
            <h3 style={styles.sectionTitle}>Dictamen Final *</h3>
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "30px",
              }}
            >
              {[
                {
                  label: "ELEGIBLE",
                  val: "elegible",
                  icon: (
                    <FaRegCheckCircle
                      size={32}
                      color={
                        dictamen === "elegible"
                          ? "#1A73E8"
                          : "#6B7280"
                      }
                    />
                  ),
                  desc: "Candidato apto para contratación",
                },
                {
                  label: "EN CARTERA",
                  val: "en_cartera",
                  icon: (
                    <FaFolderOpen
                      size={32}
                      color={
                        dictamen === "en_cartera"
                          ? "#1A73E8"
                          : "#6B7280"
                      }
                    />
                  ),
                  desc: "Mantener para futuras oportunidades",
                },
                {
                  label: "NO ELEGIBLE",
                  val: "no_elegible",
                  icon: (
                    <IoMdCloseCircle
                      size={32}
                      color={
                        dictamen === "no_elegible"
                          ? "#1A73E8"
                          : "#6B7280"
                      }
                    />
                  ),
                  desc: "No cumple con los requisitos",
                },
                {
                  label: "EN REVISIÓN",
                  val: "en_revision",
                  icon: (
                    <FaUserClock
                      size={32}
                      color={
                        dictamen === "en_revision"
                          ? "#1A73E8"
                          : "#6B7280"
                      }
                    />
                  ),
                  desc: "Requiere evaluación adicional",
                },
              ].map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => setDictamen(opt.val)}
                  style={{
                    ...styles.optionCard,
                    ...(dictamen === opt.val
                      ? styles.optionSelected
                      : {}),
                  }}
                >
                  {opt.icon}
                  <div
                    style={{
                      ...styles.optionLabel,
                      color:
                        dictamen === opt.val
                          ? "#1A73E8"
                          : "#374151",
                    }}
                  >
                    {opt.label}
                  </div>
                  <div style={styles.optionDesc}>{opt.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={styles.subLabel}>
                Observaciones de Cierre
              </label>
              <textarea
                style={styles.textarea}
                placeholder="Comentarios adicionales o recomendaciones finales..."
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              {/* Botón de impresión (izquierda) — Guarda + Imprime */}
              <button
                style={{
                  ...styles.printBtn,
                  opacity: (loading || printing) ? 0.7 : 1,
                  cursor: (loading || printing) ? 'not-allowed' : 'pointer',
                }}
                onClick={handleSaveAndPrint}
                disabled={loading || printing}
              >
                {printing ? (
                  <>
                    <span style={styles.spinner}></span>
                    Guardando y generando PDF...
                  </>
                ) : (
                  <>
                    <FaFilePdf /> Imprimir ficha PDF
                  </>
                )}
              </button>

              {/* Cancelar + Guardar (derecha) */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => navigate("/entrevistas")}
                  disabled={loading || printing}
                >
                  Cancelar
                </button>
                <button
                  style={{
                    ...styles.saveBtn,
                    opacity: (loading || printing) ? 0.7 : 1,
                    cursor: (loading || printing) ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleSubmit}
                  disabled={loading || printing}
                >
                  {loading
                    ? "Guardando..."
                    : "Finalizar Entrevista y Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ESTILOS ──
const styles = {
  pageWrapper: {
    backgroundColor: "#F8FAFC",
    width: "100%",
    minHeight: "calc(100vh - 68px)",
    boxSizing: "border-box",
    fontFamily: '"Inter", sans-serif',
  },
  containerForm: {
    padding: "24px 24px",
    maxWidth: "1000px",
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
    padding: 0,
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
    background: "#1A73E8",
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
    color: "#374151",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    margin: "25px 0 15px 0",
    color: "#374151",
  },
  infoGridBox: {
    padding: "15px",
    background: "#F9FAFB",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    rowGap: "20px",
    columnGap: "20px",
    fontSize: "14px",
    color: "#1F2937",
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
    fontFamily: "Inter",
    boxSizing: "border-box",
  },
  ratingRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "15px",
    gap: "50px",
  },
  ratingLabel: { fontSize: "14px", fontWeight: 500, minWidth: "150px" },
  footer: { marginTop: "30px" },
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
  optionDesc: { fontSize: "12px", color: "#6B7280", fontWeight: "400" },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    background: "white",
    cursor: "pointer",
    color: "#374151",
    fontWeight: 600,
  },
  saveBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#1A73E8",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  printBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#DC2626",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontFamily: "Inter",
    transition: "all 0.2s",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
};

// Inyectar la animación del spinner al montar
if (typeof document !== 'undefined' && !document.getElementById('eval-spinner-style')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'eval-spinner-style';
  styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(styleEl);
}

export default InterviewEvaluationView;
