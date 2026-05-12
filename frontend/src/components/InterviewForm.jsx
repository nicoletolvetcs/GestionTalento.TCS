import React, { useState, useEffect, useMemo, useContext } from "react";
import { FaArrowLeft, FaRegCheckCircle, FaFolderOpen, FaUserClock } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarWidget.css';
import api from "../api";
import { AuthContext } from '../context/AuthContext';

const InterviewDashboard = ({ onBack, onVerFicha, onVerDetalle, initialCandidato }) => {
  const { user } = useContext(AuthContext);
  const [candidatos, setCandidatos] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);
  const [activeTab, setActiveTab] = useState("Todos");
  const [evalModalData, setEvalModalData] = useState(null); // { candidato, entrevista }
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resCandidatos, resEntrevistas] = await Promise.all([
        api.get("candidatos/"),
        api.get("entrevistas/")
      ]);
      const dataC = resCandidatos.data.results ? resCandidatos.data.results : resCandidatos.data;
      const dataE = resEntrevistas.data.results ? resEntrevistas.data.results : resEntrevistas.data;
      setCandidatos(dataC);
      setEntrevistas(dataE);

      // Si viene con un candidato inicial, abrir directamente el formulario de evaluación
      if (initialCandidato) {
        const entrevista = dataE.find(e => e.candidato === initialCandidato.id_candidato) || null;
        setEvalModalData({
          candidato: initialCandidato,
          entrevista: entrevista
        });
      }
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mapeamos y combinamos datos
  let combinedData = candidatos.map(c => {
    const entrevista = entrevistas.find(e => e.candidato === c.id_candidato);
    return {
      candidato: c,
      entrevista: entrevista || null
    };
  });

  // Filtro de Seguridad por Rol: Entrevistadores solo ven a sus asignados
  // Nota: entrevistador_nombre viene del backend como 'username' (source='entrevistador.username')
  if (['Entrevistador', 'Entrevistadores'].includes(user?.rol)) {
    combinedData = combinedData.filter(item => 
      item.entrevista && item.entrevista.entrevistador_nombre === user?.username
    );
  }

  // Filtros de Tabulador
  const filteredData = combinedData.filter(item => {
    if (activeTab === "Todos") return true;
    if (activeTab === "Pendientes") return !item.entrevista || !item.entrevista.fecha_programada;
    if (activeTab === "Programados") return item.entrevista && item.entrevista.fecha_programada && !item.entrevista.eligibilidad;
    if (activeTab === "Evaluados") return item.entrevista && item.entrevista.eligibilidad;
    return true;
  });

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  /**
   * useMemo: Creamos un HashMap (diccionario) agrupado por fecha "YYYY-MM-DD".
   * Esto convierte la búsqueda de entrevistas por día de O(N) a O(1).
   * Solo se recalcula cuando combinedData cambia.
   */
  const entrevistasPorDia = useMemo(() => {
    const mapa = {}; // { "2026-05-15": [{ candidato, entrevista }, ...] }
    combinedData.forEach(item => {
      if (!item.entrevista || !item.entrevista.fecha_programada) return;
      // Extraer la clave YYYY-MM-DD
      const fecha = new Date(item.entrevista.fecha_programada);
      const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
      if (!mapa[clave]) mapa[clave] = [];
      mapa[clave].push(item);
    });
    return mapa;
  }, [combinedData]);

  const hoy = new Date();

  // Próximas entrevistas (Todas desde hoy en adelante)
  const proximas = combinedData
    .filter(item => {
      if (!item.entrevista || !item.entrevista.fecha_programada) return false;
      const d = new Date(item.entrevista.fecha_programada);
      
      // Fecha de hoy al inicio del día (para incluir las de hoy)
      const hoyInicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      return d >= hoyInicioDia;
    })
    .sort((a, b) => new Date(a.entrevista.fecha_programada) - new Date(b.entrevista.fecha_programada));

  /**
   * tileContent: Función que react-calendar llama para cada "tile" (día).
   * Busca en el HashMap con O(1) y renderiza un punto + tooltip si hay entrevistas.
   */
  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const clave = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const entrevistasDelDia = entrevistasPorDia[clave];
    if (!entrevistasDelDia || entrevistasDelDia.length === 0) return null;

    // Construir el texto del tooltip
    const tooltipText = entrevistasDelDia.map(item => {
      const hora = new Date(item.entrevista.fecha_programada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      return `${hora} - ${item.candidato.nombre_completo}`;
    });

    return (
      <div className="cal-tile-wrapper">
        <div className="cal-dot-indicator"></div>
        <div className="cal-tooltip">
          {tooltipText.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizado Condicional: Si estamos evaluando, mostramos el formulario a página completa
  if (evalModalData) {
    return (
      <FullPageEvaluationForm
        candidato={evalModalData.candidato}
        entrevista={evalModalData.entrevista}
        onBack={() => setEvalModalData(null)}
        onSuccess={() => {
          setEvalModalData(null);
          fetchData();
        }}
        onVerFicha={onVerFicha}
      />
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>

        <div style={styles.headerRow}>
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
          <h1 style={styles.pageTitle}>Dashboard de Entrevistas</h1>
        </div>

        <div style={styles.gridContainer}>
          {/* COLUMNA IZQUIERDA (70%) */}
          <div style={styles.leftCol}>
            <div style={styles.tabsContainer}>
              {["Todos", "Pendientes", "Programados", "Evaluados"].map(tab => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.activeTab : {})
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div style={styles.tableCard}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Cargando datos...</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>CANDIDATO</th>
                      <th style={styles.th}>ENTREVISTADOR</th>
                      <th style={styles.th}>FECHA PROGRAMADA</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#6B7280' }}>
                          No hay candidatos en esta categoría.
                        </td>
                      </tr>
                    ) : filteredData.map((row, idx) => (
                      <tr key={row.candidato.id_candidato} style={{ borderBottom: idx !== filteredData.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                        <td style={styles.td}>
                          <div style={styles.candidatoCell}>
                            <div style={styles.avatarDashboard}>
                              {row.candidato.nombre_completo.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div
                                style={{...styles.candName, cursor: onVerDetalle ? 'pointer' : 'default', color: '#2563EB'}}
                                onClick={() => onVerDetalle && onVerDetalle(row.candidato)}
                                onMouseEnter={(e) => { if (onVerDetalle) e.currentTarget.style.textDecoration = 'underline'; }}
                                onMouseLeave={(e) => { if (onVerDetalle) e.currentTarget.style.textDecoration = 'none'; }}
                              >
                                {row.candidato.nombre_completo}
                              </div>
                              <div style={styles.candSub}>{row.candidato.area_nombre || "Área General"}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          {row.entrevista && row.entrevista.entrevistador_nombre ? (
                            <span style={{ color: '#374151', fontWeight: 500 }}>{row.entrevista.entrevistador_nombre}</span>
                          ) : (
                            <span style={styles.badgeGray}>Sin asignar</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          {row.entrevista && row.entrevista.fecha_programada ? (
                            <span style={{ color: '#374151', fontWeight: 500 }}>{formatDate(row.entrevista.fecha_programada)}</span>
                          ) : (
                            <span style={styles.badgeYellow}>Por programar fecha</span>
                          )}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <button
                            style={styles.actionBtn}
                            onClick={() => setEvalModalData(row)}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            Ver / Evaluar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA (30%) */}
          <div style={styles.rightCol}>
            <div style={styles.widgetCard}>
              <Calendar
                className="saas-calendar"
                locale="es-ES"
                tileContent={renderTileContent}
                showNeighboringMonth={false}
                prev2Label={null}
                next2Label={null}
                onClickDay={(value) => setSelectedDate(value)}
                value={selectedDate}
              />
            </div>

            <div style={styles.widgetCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={styles.widgetTitle}>
                  {selectedDate 
                    ? `Entrevistas del ${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}` 
                    : 'Próximas Entrevistas'}
                </h3>
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate(null)}
                    style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                  >
                    Ver próximas
                  </button>
                )}
              </div>
              <div style={{ marginTop: '16px' }}>
                {(() => {
                  let listaAMostrar = proximas;
                  
                  // Si hay fecha seleccionada, filtramos las de ese día usando el useMemo
                  if (selectedDate) {
                    const clave = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                    listaAMostrar = entrevistasPorDia[clave] || [];
                  }

                  if (listaAMostrar.length === 0) {
                    return (
                      <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>
                        {selectedDate ? 'No hay entrevistas para esta fecha.' : 'No hay entrevistas programadas en los próximos días.'}
                      </p>
                    );
                  }

                  return (
                    <div style={styles.upcomingList}>
                      {listaAMostrar.map(item => (
                        <div key={item.entrevista.id_entrevista} style={styles.upcomingItem}>
                          <div style={styles.upcomingDot}></div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "13px", color: '#111827' }}>
                              {formatDate(item.entrevista.fecha_programada)}
                            </div>
                            <div style={{ fontSize: "12px", color: '#6B7280', marginTop: '2px' }}>
                              {item.candidato.nombre_completo}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


// ── COMPONENTE DEL FORMULARIO A PÁGINA COMPLETA ──
const FullPageEvaluationForm = ({ candidato, entrevista, onBack, onSuccess, onVerFicha }) => {
  const [dictamen, setDictamen] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({
    tecnica: 1,
    comunicacion: 1,
    interes: 1,
  });

  useEffect(() => {
    if (entrevista && entrevista.eligibilidad) {
      setDictamen(entrevista.eligibilidad);
      setObservaciones(entrevista.observaciones || "");
      setJustificacion(entrevista.justificacion_dictamen || "");
      setRatings({
        tecnica: entrevista.puntuacion_tecnica || 1,
        comunicacion: entrevista.puntuacion_comunicacion || 1,
        interes: entrevista.puntuacion_interes || 1,
      });
    }
  }, [entrevista]);

  const handleSubmit = async () => {
    if (!observaciones.trim()) {
      alert("Por favor escriba las observaciones de la entrevista.");
      return;
    }
    if (!dictamen) {
      alert("Por favor seleccione un dictamen final.");
      return;
    }
    if (!justificacion.trim()) {
      alert("Por favor escriba las observaciones de cierre / justificación.");
      return;
    }

    const payload = {
      candidato: candidato.id_candidato,
      fecha_entrevista: new Date().toISOString(),
      observaciones: observaciones,
      eligibilidad: dictamen,
      puntuacion_tecnica: ratings.tecnica,
      puntuacion_comunicacion: ratings.comunicacion,
      puntuacion_interes: ratings.interes,
      justificacion_dictamen: justificacion
    };

    setLoading(true);
    try {
      if (entrevista && entrevista.id_entrevista) {
        await api.patch(`entrevistas/${entrevista.id_entrevista}/`, payload);
      } else {
        await api.post('entrevistas/', payload);
      }
      alert("¡Entrevista guardada exitosamente!");
      onSuccess();
    } catch (error) {
      console.error("Fallo al guardar:", error);
      alert("Hubo un error al guardar. Revisa la consola.");
    } finally {
      setLoading(false);
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
    <div style={styles.pageWrapper}>
      <div style={styles.containerForm}>
        <button onClick={onBack} style={styles.backButton}>
          <FaArrowLeft /> Volver al Dashboard
        </button>

        <div style={styles.card}>
          <div style={styles.infoBox}>
            <div style={styles.avatar}>
              {candidato.nombre_completo.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{candidato.nombre_completo}</div>
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

          <h3 style={styles.sectionTitle}>Datos de la Entrevista (Automático)</h3>
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
                <div>{entrevista?.entrevistador_nombre || "Recursos Humanos"}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Área</label>
                <div>{candidato.area_nombre || "No definida"}</div>
              </div>
              <div>
                <label style={styles.subLabel}>Fecha programada</label>
                <div>
                  {entrevista?.fecha_programada
                    ? new Date(entrevista.fecha_programada).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Evaluación de la Entrevista</h3>
          <label style={styles.subLabel}>Observaciones, Fortalezas y Debilidades *</label>
          <textarea
            style={styles.textarea}
            placeholder="Describe las observaciones de la entrevista..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />

          <h3 style={styles.sectionTitle}>Puntuación de Competencias</h3>
          <StarRating label="Competencia Técnica:" category="tecnica" />
          <StarRating label="Comunicación:" category="comunicacion" />
          <StarRating label="Nivel de Interés:" category="interes" />

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
                }
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
                  <div style={styles.optionDesc}>{opt.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={styles.subLabel}>Observaciones de Cierre</label>
              <textarea
                style={styles.textarea}
                placeholder="Comentarios adicionales o recomendaciones finales..."
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
              <button style={styles.cancelBtn} onClick={onBack} disabled={loading}>
                Cancelar
              </button>
              <button style={styles.saveBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? "Guardando..." : "Finalizar Entrevista y Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ESTILOS COMPARTIDOS ──
const styles = {
  // Estilos del Dashboard
  pageWrapper: {
    backgroundColor: '#F8FAFC',
    width: '100%',
    minHeight: 'calc(100vh - 68px)',
    boxSizing: 'border-box',
    fontFamily: '"Inter", sans-serif',
  },
  container: {
    padding: "40px 32px",
    maxWidth: "1280px",
    margin: "0 auto",
  },
  containerForm: {
    padding: "24px 24px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "Inter",
  },
  headerRow: {
    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", marginBottom: "32px",
  },
  backButtonDashboard: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "none", border: "none", color: "#64748B",
    cursor: "pointer", fontSize: "14px", fontWeight: "600",
    padding: 0,
  },
  pageTitle: {
    fontSize: "24px", margin: 0, color: "#0F172A", fontWeight: 700, letterSpacing: "-0.5px",
  },
  gridContainer: {
    display: "grid", gridTemplateColumns: "70% 28%", gap: "2%", alignItems: "start",
  },
  leftCol: { display: "flex", flexDirection: "column", gap: "20px" },
  tabsContainer: { display: "flex", gap: "12px" },
  tab: {
    padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
    color: "#64748B", background: "white", border: "1px solid #E2E8F0",
    cursor: "pointer", transition: "all 0.2s ease",
  },
  activeTab: { background: "#2563EB", color: "white", borderColor: "#2563EB" },
  tableCard: {
    background: "white", borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E2E8F0", overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "16px 24px", textAlign: "left", fontSize: "11px",
    fontWeight: 700, color: "#94A3B8", textTransform: "uppercase",
    letterSpacing: "0.5px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC",
  },
  td: { padding: "16px 24px", verticalAlign: "middle", fontSize: "14px" },
  candidatoCell: { display: "flex", alignItems: "center", gap: "12px" },
  avatarDashboard: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "#EFF6FF", color: "#2563EB",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: 700, flexShrink: 0,
  },
  candName: { fontWeight: 600, color: "#0F172A", fontSize: "14px" },
  candSub: { color: "#64748B", fontSize: "12px", marginTop: "2px" },
  badgeGray: {
    background: "#F1F5F9", color: "#64748B", padding: "4px 10px",
    borderRadius: "20px", fontSize: "12px", fontWeight: 500,
  },
  badgeYellow: {
    background: "#FEF9C3", color: "#A16207", padding: "4px 10px",
    borderRadius: "20px", fontSize: "12px", fontWeight: 500,
  },
  actionBtn: {
    background: "none", border: "none", color: "#2563EB",
    fontWeight: 600, fontSize: "13px", cursor: "pointer", padding: 0,
  },
  rightCol: { display: "flex", flexDirection: "column", gap: "20px" },
  widgetCard: {
    background: "white", borderRadius: "16px", padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #E2E8F0",
  },
  widgetTitle: { margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" },
  upcomingList: { display: "flex", flexDirection: "column", gap: "16px" },
  upcomingItem: { display: "flex", gap: "12px", alignItems: "flex-start" },
  upcomingDot: {
    width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B", marginTop: "6px", flexShrink: 0,
  },

  // Estilos del Formulario de Evaluación (Full Page)
  backButton: {
    display: "flex", alignItems: "center", gap: "5px",
    background: "none", border: "none", color: "#1A73E8",
    cursor: "pointer", marginBottom: "20px", fontFamily: "Inter",
    fontSize: "16px", fontWeight: "600", padding: 0
  },
  card: {
    background: "white", padding: "30px", borderRadius: "12px",
    border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  infoBox: {
    display: "flex", gap: "15px", padding: "15px", background: "#F9FAFB",
    borderRadius: "8px", marginBottom: "20px",
  },
  avatar: {
    width: "40px", height: "40px", background: "#1A73E8", color: "white",
    borderRadius: "50%", display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: "bold",
  },
  tagContainer: { display: "flex", gap: "8px", marginTop: "5px" },
  tag: {
    fontSize: "10px", background: "#E5E7EB", padding: "2px 8px", borderRadius: "10px", color: "#374151"
  },
  sectionTitle: {
    fontSize: "16px", fontWeight: 600, margin: "25px 0 15px 0", color: "#374151"
  },
  infoGridBox: {
    padding: "15px", background: "#F9FAFB",
    borderRadius: "8px", marginBottom: "20px",
  },
  grid: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: "20px", columnGap: "20px", fontSize: "14px", color: "#1F2937"
  },
  subLabel: {
    color: "#6B7280", fontSize: "12px", display: "block", marginBottom: "4px",
  },
  textarea: {
    width: "100%", height: "100px", padding: "10px", borderRadius: "8px",
    border: "1px solid #D1D5DB", resize: "none", fontFamily: "Inter", boxSizing: "border-box"
  },
  ratingRow: {
    display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "15px", gap: "50px"
  },
  ratingLabel: { fontSize: "14px", fontWeight: 500, minWidth: "150px" },
  footer: { marginTop: "30px" },
  optionCard: {
    flex: 1, padding: "20px 15px", borderRadius: "8px", border: "1px solid #E5E7EB",
    cursor: "pointer", textAlign: "center", backgroundColor: "white",
    transition: "all 0.2s ease", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  },
  optionSelected: {
    borderColor: "#1A73E8", backgroundColor: "#F4F8FF", boxShadow: "0 0 0 1px #1A73E8",
  },
  optionLabel: {
    fontWeight: "700", fontSize: "14px", color: "#374151", marginBottom: "5px", marginTop: "10px",
  },
  optionDesc: { fontSize: "12px", color: "#6B7280", fontWeight: "400" },
  cancelBtn: {
    padding: "10px 20px", borderRadius: "8px", border: "1px solid #D1D5DB",
    background: "white", cursor: "pointer", color: "#374151", fontWeight: 600
  },
  saveBtn: {
    padding: "10px 20px", borderRadius: "8px", border: "none",
    background: "#1A73E8", color: "white", cursor: "pointer", fontWeight: 600
  },
};

export default InterviewDashboard;
