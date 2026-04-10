import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import api from '../api';

const TalentSearch = ({ onSearch }) => {
    const [areas, setAreas] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);

    const [selectedArea, setSelectedArea] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [especialidadesFiltradas, setEspecialidadesFiltradas] = useState([]);
    const [salary, setSalary] = useState("");
    const [currency, setCurrency] = useState("USD");

    // 1. Cargar filtros desde Django
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                const [resAreas, resEspec] = await Promise.all([
                    api.get('areas/'),
                    api.get('especialidades/')
                ]);
                setAreas(resAreas.data);
                setEspecialidades(resEspec.data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };
        cargarDatosIniciales();
    }, []);

    // 2. Lógica de filtrado de especialidades dependientes
    useEffect(() => {
        if (selectedArea) {
            // Buscamos las especialidades que pertenecen al ID del área seleccionada
            const filtradas = especialidades.filter(e => e.area === parseInt(selectedArea));
            setEspecialidadesFiltradas(filtradas);
        } else {
            setEspecialidadesFiltradas([]);
        }
        setSelectedSpecialty('');
    }, [selectedArea, especialidades]);

    // 3. Al hacer clic en buscar, enviamos los datos al componente Padre
    const handleSearchClick = () => {
        if (onSearch) {
            onSearch({
                area: selectedArea,
                especialidad: selectedSpecialty, // Cambié 'specialty' a 'especialidad' para que coincida con tu backend
                salario: salary,
            });
        }
    };

    const handleClear = () => {
        setSelectedArea("");
        setSelectedSpecialty("");
        setSalary("");
        if (onSearch) {
            onSearch({ area: "", especialidad: "", salario: "" });
        }
    };

    return (
        <div
            style={{
                width: "100%",
                padding: "24px 28px",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                fontFamily: '"Inter", sans-serif',
                boxSizing: "border-box",
            }}
        >
            <h2
                style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1F2937",
                    margin: "0 0 20px 0",
                    fontFamily: '"Inter", sans-serif',
                }}
            >
                Buscador Inteligente de Talento
            </h2>

            {/* Fila de campos */}
            <div
                style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-end",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                }}
            >
                {/* Área de Trabajo */}
                <div style={{ flex: "1 1 320px" }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#374151",
                            marginBottom: "6px",
                            textAlign: "left",
                            fontFamily: '"Inter", sans-serif',
                        }}
                    >
                        Área de Trabajo
                    </label>
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        style={{
                            width: "100%",
                            height: "42px",
                            padding: "0 12px",
                            backgroundColor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#6B7280",
                            outline: "none",
                            cursor: "pointer",
                        }}
                    >
                        <option value="">Seleccione un área...</option>
                        {areas.map((area) => (
                            <option key={area.id_area} value={area.id_area}>
                                {area.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Especialidades */}
                <div style={{ flex: "1.5 1 320px" }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#374151",
                            marginBottom: "6px",
                            textAlign: "left",
                            fontFamily: '"Inter", sans-serif',
                        }}
                    >
                        Especialidades
                    </label>
                    <select
                        disabled={!selectedArea}
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        style={{
                            width: "100%",
                            height: "42px",
                            padding: "0 12px",
                            backgroundColor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "#6B7280",
                            outline: "none",
                            opacity: !selectedArea ? 0.6 : 1,
                            cursor: selectedArea ? "pointer" : "not-allowed",
                        }}
                    >
                        <option value="">
                            {selectedArea
                                ? "Seleccione especialidad..."
                                : "Primero seleccione un área"}
                        </option>
                        {especialidadesFiltradas.map((esp) => (
                            <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                {esp.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Aspiración Salarial */}
                <div style={{ flex: "1.2 1 220px" }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#374151",
                            marginBottom: "6px",
                            textAlign: "left",
                            fontFamily: '"Inter", sans-serif',
                        }}
                    >
                        Aspiración Salarial
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <input
                            type="number"
                            placeholder="Ej: 40000"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            style={{
                                flex: 1,
                                height: "42px",
                                padding: "0 12px",
                                backgroundColor: "#F9FAFB",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#374151",
                                outline: "none",
                            }}
                        />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{
                                width: "70px",
                                height: "42px",
                                backgroundColor: "#F3F4F6",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#374151",
                                textAlign: "center",
                                outline: "none",
                                cursor: "pointer",
                            }}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={handleSearchClick}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        height: "40px",
                        padding: "0 20px",
                        backgroundColor: "#1A73E8",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: '"Inter", sans-serif',
                    }}
                >
                    {<FiSearch />}
                    Buscar Talento
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    style={{
                        height: "40px",
                        padding: "0 20px",
                        backgroundColor: "#EFF6FF",
                        color: "#1D4ED8",
                        border: "1px solid #BFDBFE",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: '"Inter", sans-serif',
                    }}
                >
                    Ver todos
                </button>
            </div>
        </div>
    );
};

export default TalentSearch;