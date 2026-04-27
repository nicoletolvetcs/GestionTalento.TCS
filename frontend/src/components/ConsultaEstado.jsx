import { useState } from "react";
import { FiSearch, FiClock, FiCheckCircle } from "react-icons/fi"; // FiCheckCircle para el badge de entrevistas

export default function ConsultaEstado() {
  const [cedula, setCedula] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCedula(e.target.value);
    setError("");
    // Limpiar resultado al escribir de nuevo para una mejor UX
    if (resultado) setResultado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError("");

    // Simulación de consulta, reemplazar con llamada real a API
    setTimeout(() => {
      // Usamos una cédula de prueba específica para mostrar los datos de la imagen
      if (cedula === "9876543210") {
        setResultado({
          estado: "En Revisión",
          mensaje:
            "Tu perfil está siendo revisado por nuestro equipo de reclutamiento.",
          datosAplicacion: {
            nombreCompleto: "María López Fernández",
            posicionAplicada: "Fábrica de Software",
            area: "Tecnología",
            fechaAplicacion: "14 de marzo de 2026",
            ultimaActualizacion: "9 de abril de 2026",
          },
          entrevistas: [
            {
              area: "Ventas",
              fecha: "9 de abril de 2026, 10:00 a. m.",
              completada: true,
            },
          ],
        });
      } else if (cedula.length < 6) {
        setError("Por favor ingresa un número de cédula válido.");
      } else {
        // Estado por defecto para otras cédulas válidas
        setResultado({
          estado: "Pendiente",
          mensaje:
            "Tu solicitud ha sido recibida y está en cola para revisión.",
        });
      }
      setLoading(false);
    }, 1500); // Un poco más de tiempo para apreciar el spinner pro
  };

  const estilos = {
    contenedorPage: {
      padding: "40px",
      backgroundColor: "#F3F4F6",
      minHeight: "100vh",
      fontFamily: '"Inter", sans-serif',
      boxSizing: "border-box",
    },
    // ESTE ES EL CONTENEDOR QUE CREA EL BORDE GRADIENTE
    wrapperGradiente: {
      position: "relative",
      maxWidth: "660px",
      margin: "0 auto", // Centrado horizontal
      padding: "1px", // Grosor del borde
      borderRadius: "14px",
      background:
        "linear-gradient(135deg, #eceff4 0%, #e6eeed 50%, #ebedf2 100%)",
      boxShadow:
        "0 10px 15px -3px rgba(37, 99, 235, 0.1), 0 4px 6px -2px rgba(37, 99, 235, 0.05)",
    },
    // TARJETA INTERNA DE CONSULTA
    tarjetaBlanca: {
      background: "white",
      borderRadius: "12px",
      padding: "40px 36px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    // TARJETA DE RESULTADOS (DESPLEGABLE)
    tarjetaResultados: {
      background: "white",
      borderRadius: "12px",
      padding: "40px 36px",
      marginTop: "20px", // Espacio con la tarjeta de consulta
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: "1px solid #E5E7EB",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      width: "100%",
      boxSizing: "border-box",
    },
    titulo: {
      fontSize: "22px",
      fontWeight: "600",
      color: "#1F2937",
      marginBottom: "8px",
      textAlign: "center",
    },
    subtitulo: {
      color: "#6B7280",
      textAlign: "center",
      marginBottom: "32px",
      fontSize: "14px",
      maxWidth: "440px",
      lineHeight: "1.5",
    },
    formulario: {
      display: "flex",
      flexDirection: "row",
      gap: "12px",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    input: {
      border: "1px solid #E5E7EB",
      borderRadius: "8px",
      padding: "12px 16px",
      flex: "1",
      maxWidth: "280px",
      fontSize: "15px",
      background: "#F9FAFB",
      color: "#374151",
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.2s",
    },
    boton: {
      background: "#1A73E8",
      color: "white",
      padding: "12px 28px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "600",
      fontSize: "15px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(30,64,175,0.05)",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    },
    error: {
      marginTop: "20px",
      color: "#dc2626",
      textAlign: "center",
      fontSize: "14px",
      background: "#fef2f2",
      padding: "10px 20px",
      borderRadius: "6px",
      border: "1px solid #fee2e2",
    },
    // ESTILOS SECCIÓN RESULTADOS (NUEVOS, BASADOS EN TU IMAGEN)
    iconoEstado: {
      fontSize: "48px",
      color: "#F97316", // Naranja para 'En Revisión'
      marginBottom: "16px",
    },
    textoEstadoHeader: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1F2937",
      marginBottom: "4px",
    },
    textoMensajeEstado: {
      fontSize: "14px",
      color: "#6B7280",
      marginBottom: "32px",
      textAlign: "center",
      maxWidth: "400px",
    },
    seccionDatos: {
      width: "100%",
      background: "#F0F9FF", // Azul muy suave, igual que en tu imagen
      border: "1px solid #BAE6FD",
      borderRadius: "12px",
      padding: "24px",
      boxSizing: "border-box",
      marginBottom: "24px",
    },
    tituloSeccion: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#0369A1", // Azul oscuro
      marginBottom: "16px",
    },
    filaDato: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      fontSize: "14px",
    },
    labelDato: {
      color: "#6B7280",
      fontWeight: "500",
    },
    valorDato: {
      color: "#1F2937",
      fontWeight: "600",
      textAlign: "right",
    },
    seccionEntrevistas: {
      width: "100%",
      marginBottom: "24px",
    },
    tarjetaEntrevista: {
      width: "100%",
      background: "#ffffff",
      border: "1px solid #E5E7EB",
      borderRadius: "10px",
      padding: "16px 20px",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    badgeCompletada: {
      background: "#DCFCE7", // Verde suave
      color: "#166534",
      fontSize: "12px",
      fontWeight: "600",
      padding: "4px 10px",
      borderRadius: "999px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    notaFinal: {
      width: "100%",
      background: "#F0F9FF",
      border: "1px solid #BAE6FD",
      borderRadius: "10px",
      padding: "16px 20px",
      boxSizing: "border-box",
      fontSize: "13px",
      color: "#075985",
      lineHeight: "1.5",
    },
  };

  return (
    <div style={estilos.contenedorPage}>
      {/* Wrapper del borde gradiente para la consulta */}
      <div style={estilos.wrapperGradiente}>
        {/* Contenido blanco interno de consulta */}
        <div style={estilos.tarjetaBlanca}>
          <h2 style={estilos.titulo}>Consulta el Estado de tu Aplicación</h2>
          <p style={estilos.subtitulo}>
            Ingresa tu número de cédula para conocer en qué etapa del proceso de
            selección te encuentras.
          </p>

          <form style={estilos.formulario} onSubmit={handleSubmit}>
            <input
              type="text"
              style={estilos.input}
              placeholder="Ej: 9876543210 (para prueba)"
              value={cedula}
              onChange={handleChange}
              disabled={loading}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
            <button
              type="submit"
              style={{
                ...estilos.boton,
                backgroundColor: loading ? "#93C5FD" : "#1A73E8",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? (
                // Reutilizamos el spinner del resto del código si existe, sino texto
                <span>🌀</span>
              ) : (
                <FiSearch style={{ fontSize: "18px" }} />
              )}
              {loading ? "Consultando..." : "Consultar"}
            </button>
          </form>

          {error && <div style={estilos.error}>{error}</div>}
        </div>
      </div>

      {/* DESPLEGABLE DE RESULTADOS (DATOS DE TU IMAGEN) */}
      {resultado && (
        <div
          style={{
            ...estilos.wrapperGradiente,
            background: "none",
            border: "none",
            boxShadow: "none",
          }}
        >
          {" "}
          {/* Reutilizamos wrapper para max-width y centrado */}
          <div style={estilos.tarjetaResultados}>
            {/* Header de Estado */}
            <div style={estilos.iconoEstado}>
              <FiClock />
            </div>
            <h3 style={estilos.textoEstadoHeader}>En Revisión</h3>
            <p style={estilos.textoMensajeEstado}>
              Tu perfil está siendo revisado por nuestro equipo de
              reclutamiento.
            </p>

            {/* Sección de Datos de la Aplicación (Caja azul) */}
            {resultado.datosAplicacion && (
              <div style={estilos.seccionDatos}>
                <h4 style={estilos.tituloSeccion}>
                  Información de tu Aplicación
                </h4>

                <div style={estilos.filaDato}>
                  <span style={estilos.labelDato}>Nombre Completo:</span>
                  <span style={estilos.valorDato}>
                    {resultado.datosAplicacion.nombreCompleto}
                  </span>
                </div>
                <div style={estilos.filaDato}>
                  <span style={estilos.labelDato}>Posición Aplicada:</span>
                  <span style={estilos.valorDato}>
                    {resultado.datosAplicacion.posicionAplicada}
                  </span>
                </div>
                <div style={estilos.filaDato}>
                  <span style={estilos.labelDato}>Área:</span>
                  <span style={estilos.valorDato}>
                    {resultado.datosAplicacion.area}
                  </span>
                </div>
                <div style={estilos.filaDato}>
                  <span style={estilos.labelDato}>Fecha de Aplicación:</span>
                  <span style={estilos.valorDato}>
                    {resultado.datosAplicacion.fechaAplicacion}
                  </span>
                </div>
                <div style={estilos.filaDato}>
                  <span style={estilos.labelDato}>Última Actualización:</span>
                  <span style={estilos.valorDato}>
                    {resultado.datosAplicacion.ultimaActualizacion}
                  </span>
                </div>
              </div>
            )}

            {/* Sección de Entrevistas */}
            <div style={estilos.seccionEntrevistas}>
              <h4
                style={{
                  ...estilos.tituloSeccion,
                  color: "#1F2937",
                  marginBottom: "16px",
                }}
              >
                Entrevistas
              </h4>

              {resultado.entrevistas && resultado.entrevistas.length > 0 ? (
                resultado.entrevistas.map((entrevista, index) => (
                  <div key={index} style={estilos.tarjetaEntrevista}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#1F2937",
                        }}
                      >
                        Área: {entrevista.area}
                      </div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Fecha: {entrevista.fecha}
                      </div>
                    </div>
                    {entrevista.completada && (
                      <div style={estilos.badgeCompletada}>
                        <FiCheckCircle /> Completada
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  No hay entrevistas programadas.
                </p>
              )}
            </div>

            {/* Nota Final */}
            <div style={estilos.notaFinal}>
              <strong>Nota:</strong> Si tienes alguna pregunta sobre tu proceso
              de selección, por favor contacta a nuestro equipo de recursos
              humanos al correo: <u>rrhh@empresa.com</u>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
