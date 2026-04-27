import React, { useState } from "react";
import {
  FiSearch,
  FiUserPlus,
  FiClipboard,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
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

  return (
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
        <NavButton
          label="Consulta Estado"
          active={activePage === "consulta"}
          icon={<FiSearch />}
          onClick={() => onNavChange("consulta")}
        />
      </div>

      {/* Perfil de Usuario con Menú Desplegable */}
      <div className="flex-1 flex justify-end items-center relative">
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          style={{ marginRight: "12px", gap: "10px" }}
        >
          <div className="flex flex-col items-end justify-center mr-2">
            <span className="text-[14px] font-semibold text-slate-800 leading-tight text-right whitespace-nowrap">
              {userName}
            </span>
            <span className="text-[13px] font-normal text-[#6B7280] leading-tight text-right whitespace-nowrap">
              {userRole}
            </span>
          </div>

          <div
            className="w-[45px] h-[45px] bg-[#2563eb] rounded-full flex items-center justify-center font-medium text-[15px] shadow-sm tracking-wide shrink-0"
            style={{ color: "#ffffff" }}
          >
            {userName
              ? userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "U"}
          </div>
          <FiChevronDown
            className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
          />
        </div>

        {/* Menú Desplegable Corregido */}
        {showUserMenu && (
          <div
            className="absolute top-[50px] right-[10px] bg-white rounded-xl shadow-xl py-2 w-48 z-50"
            style={{
              border: "none",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <button
              onClick={() => {
                setShowUserMenu(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors border-none bg-transparent cursor-pointer text-left"
            >
              <FiLogOut size={16} />{" "}
              {/* Tamaño corregido para que sea visible */}
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
