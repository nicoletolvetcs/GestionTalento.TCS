import React, { useState } from "react";
import { FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

const LoginRegistro = ({ alEntrar }) => {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const manejarLogin = (e) => {
    e.preventDefault();
    // Tu lógica de validación se mantiene intacta
    if (identificador === "william" && password === "admin123") {
      alEntrar();
    } else {
      setError("ID de Reclutador o contraseña incorrectos");
    }
  };

  const estilos = {
    contenedor: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F8FAFC",
      fontFamily: '"Inter", sans-serif',
      padding: "20px",
    },
    tarjeta: {
      backgroundColor: "#ffffff",
      padding: "48px 40px",
      borderRadius: "20px",
      border: "1px solid #E2E8F0",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    cajaIcono: {
      width: "60px",
      height: "60px",
      backgroundColor: "#eff6ff",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px auto",
      color: "#1A73E8",
    },
    inputWrapper: {
      position: "relative",
      marginTop: "6px",
    },
    inputIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#94A3B8",
    },
    input: {
      width: "100%",
      height: "46px",
      padding: "0 12px 0 40px", // Espacio para el icono de la izquierda
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
      transition: "all 0.2s ease",
      backgroundColor: "#F8FAFC",
      color: "#1E293B",
    },
    boton: {
      width: "100%",
      height: "50px",
      backgroundColor: "#1A73E8",
      color: "#ffffff",
      border: "none",
      borderRadius: "10px",
      fontWeight: "600",
      fontSize: "15px",
      cursor: "pointer",
      marginTop: "24px",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 6px -1px rgba(26, 115, 232, 0.2)",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#475569",
      marginLeft: "2px",
      display: "block",
      textAlign: "left",
    },
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <div style={estilos.cajaIcono}>
          <FaBuilding size={28} />
        </div>

        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            color: "#1E293B",
            margin: "0",
            letterSpacing: "-0.5px",
          }}
        >
          SGTH
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#64748B",
            marginBottom: "32px",
            marginTop: "4px",
          }}
        >
          Gestión de Talento Humano
        </p>

        <form onSubmit={manejarLogin}>
          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FEE2E2",
                color: "#DC2626",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "20px",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          {/* Campo Usuario */}
          <div style={{ marginBottom: "20px" }}>
            <label style={estilos.label}>ID Usuario de Reclutador</label>
            <div style={estilos.inputWrapper}>
              <FiUser style={estilos.inputIcon} size={18} />
              <input
                type="text"
                placeholder="William"
                style={estilos.input}
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#1A73E8")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                required
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div style={{ marginBottom: "12px" }}>
            <label style={estilos.label}>Contraseña</label>
            <div style={estilos.inputWrapper}>
              <FiLock style={estilos.inputIcon} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{ ...estilos.input, paddingRight: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#1A73E8")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#94A3B8",
                  display: "flex",
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={estilos.boton}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#1557B0";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#1A73E8";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Ingresar al Sistema
          </button>
        </form>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid #F1F5F9",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#94A3B8",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            Acceso Administrativo
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginRegistro;
