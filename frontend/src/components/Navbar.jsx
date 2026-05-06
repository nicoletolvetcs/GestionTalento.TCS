import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiUserPlus,
  FiClipboard,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
import { FaBuilding } from "react-icons/fa";

const NavButton = ({ label, icon, active = false, onClick }) => {
  const baseStyle =
    "flex items-center gap-[8px] px-6 py-[8px] rounded-[8px] cursor-pointer border-none font-medium text-[15px]";
  const activeStyle = "bg-[#1A73E8] text-[#ffffff] shadow-sm";
  const inactiveStyle =
    "hover:bg-gray-50 hover:shadow-sm text-gray-600 bg-transparent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyle} ${active ? activeStyle : inactiveStyle}`}
      style={{ transition: "all 0.2s ease-in-out" }}
    >
      {icon && <span className="text-[18px] flex items-center">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

const Navbar = ({ userName, userRole, activePage, onNavChange, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Obtener las iniciales del usuario para el avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav
        className="w-full h-[68px] px-8 flex items-center justify-between box-border sticky top-0 z-50"
        style={{
          fontFamily: '"Inter", sans-serif',
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          borderBottom: "1px solid #F1F5F9",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Logo */}
        <div
          className="flex-1 flex justify-start items-center gap-3"
          style={{ marginLeft: "32px" }}
        >
          <div
            className="text-[24px] text-blue-600 flex items-center justify-center"
            style={{ color: "#3B82F6" }}
          >
            <FaBuilding />
          </div>
          <span className="text-[20px] font-bold text-slate-800 tracking-wide">
            SGTH
          </span>
        </div>

        {/* Navegación Central */}
        <div className="flex-1 flex justify-center items-center gap-6">
          <NavButton
            label="Búsqueda"
            active={activePage === "search"}
            icon={<FiSearch />}
            onClick={() => onNavChange("search")}
          />

          <NavButton
            label="Registrar"
            active={activePage === "register"}
            icon={<FiUserPlus />}
            onClick={() => onNavChange("register")}
          />
          <NavButton
            label="Entrevistas"
            active={activePage === "interviews"}
            icon={<FiClipboard />}
            onClick={() => onNavChange("interviews")}
          />
        </div>

        {/* Perfil de Usuario con Menú Desplegable */}
        <div className="flex-1 flex justify-end items-center" ref={menuRef}
          style={{ position: "relative" }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            style={{ marginRight: "12px", gap: "10px" }}
          >
            <div className="flex flex-col items-end justify-center mr-2">
              <span className="text-[14px] font-semibold text-slate-800 leading-tight text-right whitespace-nowrap">
                {userName || "Usuario"}
              </span>
              <span className="text-[13px] font-normal text-[#6B7280] leading-tight text-right whitespace-nowrap">
                {userRole || "Sin Rol"}
              </span>
            </div>

            <div
              className="w-[45px] h-[45px] bg-[#2563eb] rounded-full flex items-center justify-center font-medium text-[15px] shadow-sm tracking-wide shrink-0"
              style={{ color: "#ffffff" }}
            >
              {getInitials(userName)}
            </div>
            <FiChevronDown
              className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
            />
          </div>

          {/* Menú Desplegable — Solo Cerrar Sesión */}
          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: "12px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 10px 40px -5px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                border: "1px solid #F1F5F9",
                padding: "6px 0",
                width: "180px",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowLogoutModal(true);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  color: "#EF4444",
                  fontWeight: "500",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#FEF2F2"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <FiLogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ══════ MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN ══════ */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
          fontFamily: '"Inter", sans-serif',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '420px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          }}>

            {/* ── Header con gradiente ── */}
            <div style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              padding: '36px 32px 28px',
              textAlign: 'center',
              position: 'relative',
            }}>
              {/* Botón cerrar (×) */}
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  position: 'absolute', top: '16px', right: '18px',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none', borderRadius: '50%',
                  width: '28px', height: '28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'white', fontSize: '15px', lineHeight: 1,
                }}
              >×</button>

              {/* Círculo con ícono de advertencia */}
              <div style={{
                width: '60px', height: '60px',
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '26px',
              }}>
                <IoWarningOutline color="white" size={35} />
              </div>

              <h2 style={{
                margin: 0, color: 'white',
                fontSize: '22px', fontWeight: 700,
                letterSpacing: '-0.3px',
              }}>
                Cerrar Sesión
              </h2>
            </div>

            {/* ── Cuerpo ── */}
            <div style={{ padding: '24px 28px 0' }}>
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '16px 20px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#374151',
                lineHeight: 1.6,
              }}>
                ¿Estás segura de que deseas cerrar sesión?
                Tu trabajo no guardado podría perderse.
              </div>
            </div>

            {/* ── Botones ── */}
            <div style={{ padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Confirmar cierre */}
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <FiLogOut size={18} />
                Sí, cerrar sesión
              </button>

              {/* Cancelar */}
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  width: '100%', padding: '14px',
                  background: 'white', color: '#374151',
                  border: '1.5px solid #E5E7EB', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: '15px' }}>✕</span>
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
