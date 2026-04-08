import React from 'react';
import { FiSearch, FiUserPlus, FiClipboard } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

const NavButton = ({ label, icon, active = false }) => {
    // Usamos rounded-lg para borde suavemente redondeado
    const baseStyle = "flex items-center gap-[8px] px-6 py-[8px] rounded-[8px] transition-colors cursor-pointer border-none font-medium text-[15px]";
    const activeStyle = "bg-[#2563eb] text-white shadow-sm";
    const inactiveStyle = "hover:bg-gray-100 text-gray-600 bg-transparent";

    return (
        <button
            className={`${baseStyle} ${active ? activeStyle : inactiveStyle}`}
            style={active ? { color: '#ffffff' } : {}}
        >
            {icon && <span className="text-[18px] flex items-center">{icon}</span>}
            <span>{label}</span>
        </button>
    );
};

const Navbar = ({ userName, userRole }) => {
    return (
        <nav className="w-full h-[68px] px-8 flex items-center justify-between box-border" style={{ fontFamily: '"Inter", sans-serif', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', backgroundColor: '#ffffff' }}>

            {/* Logo y el ícono de FaBuilding integrados */}
            <div className="flex-1 flex justify-start items-center gap-3" style={{ marginLeft: '32px' }}>
                <div className="text-[24px] text-blue-600 flex items-center justify-center" style={{ color: '#3B82F6' }} >
                    <FaBuilding />
                </div>
                <span className="text-[20px] font-bold text-slate-800 tracking-wide">SGTH</span>
            </div>

            {/* Navegación Central */}
            <div className="flex-1 flex justify-center items-center gap-6">
                <NavButton
                    label="Búsqueda"
                    active={true}
                    icon={<FiSearch />}
                />
                <NavButton
                    label="Registrar"
                    icon={<FiUserPlus />}
                />
                <NavButton
                    label="Entrevistas"
                    icon={<FiClipboard />}
                />
            </div>

            {/* Perfil de Usuario con letras text-white para que se vean blancas */}
            <div className="flex-1 flex justify-end items-center">
                <div className="flex flex-col items-end justify-center" style={{ marginRight: '24px' }}>
                    <p className="text-[14px] font-semibold text-slate-800 leading-[1.1] m-0 mb-1">{userName}</p>
                    <p className="text-[13px] text-gray-500 leading-none m-0">{userRole}</p>
                </div>
                <div
                    className="w-[42px] h-[42px] bg-[#2563eb] text-white rounded-full flex items-center justify-center font-medium text-[15px] shadow-sm tracking-wide"
                    style={{ color: '#ffffff', marginRight: '24px' }}
                >
                    {userName ? userName.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;