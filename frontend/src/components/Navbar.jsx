import React from "react";
import { FiSearch, FiUserPlus, FiClipboard } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

const NavButton = ({ label, icon, active = false, onClick }) => {
  // Usamos rounded-lg para borde suavemente redondeado
  const baseStyle =
    "flex items-center gap-[8px] px-6 py-[8px] rounded-[8px] cursor-pointer border-none font-medium text-[15px]";
  const activeStyle = "bg-[#1A73E8] text-[#ffffff] shadow-sm";
  const inactiveStyle = "hover:bg-gray-50 hover:shadow-sm text-gray-600 bg-transparent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyle} ${active ? activeStyle : inactiveStyle}`}
      style={{ transition: 'all 0.2s ease-in-out' }}
    >
      {icon && <span className="text-[18px] flex items-center">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

const Navbar = ({ userName, userRole, activePage, onNavChange }) => {
  return (
    <nav
      className="w-full h-[68px] px-8 flex items-center justify-between box-border"
      style={{
        fontFamily: '"Inter", sans-serif',
        boxShadow: "0 4px 8px rgba(0,0,0,0.02)",
        borderBottom: "2px solid #E5E7EB",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Logo y el ícono de FaBuilding integrados */}
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

      {/* Perfil de Usuario Integrado y Clicable */}
      <div className="flex-1 flex justify-end items-center">
        <div
          className="flex items-center p-1.5 pr-4 pl-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          style={{ marginRight: "12px", gap: "12px" }}
        >
          {/* Textos del Usuario */}
          <div className="flex flex-col items-end justify-center" style={{ gap: "2px" }}>
            <span className="text-[14px] font-semibold text-slate-800 leading-none">
              {userName}
            </span>
            <span className="text-[13px] font-normal text-[#6B7280] leading-none">
              {userRole}
            </span>
          </div>

          {/* Avatar Circular */}
          <div
            className="w-[40px] h-[40px] bg-[#2563eb] rounded-full flex items-center justify-center font-medium text-[15px] shadow-sm tracking-wide"
            style={{ color: "#ffffff" }}
          >
            {userName
              ? userName
                .split(" ")
                .map((n) => n[0])
                .join("")
              : "U"}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;