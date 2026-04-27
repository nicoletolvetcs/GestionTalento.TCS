import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function ConsultaEstado() {
  const [cedula, setCedula] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCedula(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError("");

    // Simulación de consulta, reemplazar con llamada real a API
    setTimeout(() => {
      if (cedula.length < 6) {
        setError("Por favor ingresa un número de cédula válido.");
      } else {
        setResultado({
          estado: "En revisión",
          mensaje:
            "Tu aplicación está siendo evaluada. Pronto recibirás noticias.",
        });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#F3F4F6",
        minHeight: "100vh",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          maxWidth: 600,
          margin: "0 auto",
          padding: "40px 36px",
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#1F2937",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Consulta el Estado de tu Aplicación
        </h2>
        <p
          style={{
            color: "#6B7280",
            textAlign: "center",
            marginBottom: 28,
            fontSize: 15,
          }}
        >
          Ingresa tu número de cédula para conocer en qué etapa del proceso de
          selección te encuentras
        </p>

        <form
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 0,
          }}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            style={{
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: "10px 16px",
              width: 220,
              fontSize: 15,
              background: "#F9FAFB",
              color: "#374151",
              outline: "none",
              fontFamily: "inherit",
            }}
            placeholder="Número de cédula"
            value={cedula}
            onChange={handleChange}
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              background: loading ? "#93C5FD" : "#1A73E8",
              color: "white",
              padding: "10px 28px",
              borderRadius: 8,
              border: "none",
              fontWeight: 500,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 1px 2px rgba(30,64,175,0.04)",
              transition: "background 0.2s",
              fontFamily: "inherit",
            }}
            disabled={loading}
          >
            <FiSearch style={{ fontSize: 18 }} />
            {loading ? "Consultando..." : "Consultar"}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: 18,
              color: "#DC2626",
              textAlign: "center",
              fontSize: 15,
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div
            style={{
              marginTop: 18,
              color: "#2563eb",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Conectando con el servidor...
          </div>
        )}

        {resultado && (
          <div
            style={{
              marginTop: 28,
              background: "#EFF6FF",
              border: "1px solid #DBEAFE",
              borderRadius: 8,
              padding: 18,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1D4ED8",
                marginBottom: 4,
              }}
            >
              Estado: {resultado.estado}
            </div>
            <div style={{ color: "#2563eb", fontSize: 15 }}>
              {resultado.mensaje}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
