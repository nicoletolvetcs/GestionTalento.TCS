import React, { useState, useEffect, useMemo, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarWidget.css';
import api from "../api";
import { AuthContext } from '../context/AuthContext';

const InterviewDashboard = ({ onBack, onVerFicha, onVerDetalle }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);
  const [activeTab, setActiveTab] = useState("Todos");
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

  // Filtros de Tabulador (incluye "Atrasadas")
  const ahora = new Date();
  const filteredData = combinedData.filter(item => {
    if (activeTab === "Todos") return true;
    if (activeTab === "Pendientes") return !item.entrevista || !item.entrevista.fecha_programada;
    if (activeTab === "Programados") return item.entrevista && item.entrevista.fecha_programada && !item.entrevista.eligibilidad;
    if (activeTab === "Evaluados") return item.entrevista && item.entrevista.eligibilidad;
    if (activeTab === "Atrasadas") {
      // Entrevistas cuya fecha_programada < ahora Y que NO han sido evaluadas
      if (!item.entrevista || !item.entrevista.fecha_programada) return false;
      const fechaProgramada = new Date(item.entrevista.fecha_programada);
      return fechaProgramada < ahora && !item.entrevista.eligibilidad;
    }
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

  // Contadores para los badges de las pestañas
  const contadorAtrasadas = combinedData.filter(item => {
    if (!item.entrevista || !item.entrevista.fecha_programada) return false;
    return new Date(item.entrevista.fecha_programada) < ahora && !item.entrevista.eligibilidad;
  }).length;

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
              {["Todos", "Pendientes", "Programados", "Evaluados", "Atrasadas"].map(tab => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tab,
                    ...(activeTab === tab ? styles.activeTab : {}),
                    ...(tab === "Atrasadas" && contadorAtrasadas > 0 ? { color: activeTab === tab ? 'white' : '#DC2626' } : {}),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {tab}
                  {tab === "Atrasadas" && contadorAtrasadas > 0 && (
                    <span style={{
                      background: activeTab === tab ? 'rgba(255,255,255,0.3)' : '#FEE2E2',
                      color: activeTab === tab ? 'white' : '#DC2626',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '1px 7px',
                      borderRadius: '10px',
                      lineHeight: '16px',
                    }}>
                      {contadorAtrasadas}
                    </span>
                  )}
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
                    ) : filteredData.map((row, idx) => {
                      // Detectar si esta fila está atrasada
                      const estaAtrasada = row.entrevista && row.entrevista.fecha_programada &&
                        new Date(row.entrevista.fecha_programada) < ahora && !row.entrevista.eligibilidad;

                      return (
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
                              <span style={{
                                color: estaAtrasada ? '#DC2626' : '#374151',
                                fontWeight: 500,
                              }}>
                                {formatDate(row.entrevista.fecha_programada)}
                                {estaAtrasada && (
                                  <span style={{
                                    marginLeft: '8px',
                                    background: '#FEE2E2',
                                    color: '#DC2626',
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                  }}>
                                    Atrasada
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span style={styles.badgeYellow}>Por programar fecha</span>
                            )}
                          </td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <button
                              style={styles.actionBtn}
                              onClick={() => navigate(`/entrevistas/evaluar/${row.candidato.id_candidato}`)}
                              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                              Ver / Evaluar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

// ── ESTILOS ──
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
  headerRow: {
    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", marginBottom: "32px",
  },
  pageTitle: {
    fontSize: "24px", margin: 0, color: "#0F172A", fontWeight: 700, letterSpacing: "-0.5px",
  },
  gridContainer: {
    display: "grid", gridTemplateColumns: "70% 28%", gap: "2%", alignItems: "start",
  },
  leftCol: { display: "flex", flexDirection: "column", gap: "20px" },
  tabsContainer: { display: "flex", gap: "12px", flexWrap: "wrap" },
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
};

export default InterviewDashboard;
