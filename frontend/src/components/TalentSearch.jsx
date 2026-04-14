import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import api from '../api';

const styles = {
    container: {
        width: "100%",
        padding: "24px 28px",
        background: "white",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        fontFamily: '"Inter", sans-serif',
        boxSizing: "border-box",
    },
    title: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#1F2937",
        margin: "0 0 20px 0",
        fontFamily: '"Inter", sans-serif',
    },
    row: {
        display: "flex",
        gap: "16px",
        alignItems: "flex-end",
        marginBottom: "20px",
        flexWrap: "wrap",
    },
    label: {
        display: "block",
        fontSize: "14px",
        fontWeight: 500,
        color: "#374151",
        marginBottom: "6px",
        textAlign: "left",
        fontFamily: '"Inter", sans-serif',
    },
    select: {
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
    },
    input: {
        flex: 1,
        height: "42px",
        padding: "0 12px",
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#374151",
        outline: "none",
    },
    currencySelect: {
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
    },
    buttonActionsRow: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap"
    },
    baseSearchButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: "40px",
        padding: "0 20px",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: '"Inter", sans-serif',
        transition: 'all 0.2s ease-in-out',
    },
    baseClearButton: {
        height: "40px",
        padding: "0 20px",
        color: "#1D4ED8",
        border: "1px solid #BFDBFE",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: '"Inter", sans-serif',
        transition: 'all 0.2s ease-in-out',
    }
};

const TalentSearch = ({ onSearch }) => {
    const [areas, setAreas] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);

    const [selectedArea, setSelectedArea] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [especialidadesFiltradas, setEspecialidadesFiltradas] = useState([]);
    const [salary, setSalary] = useState("");
    const [currency, setCurrency] = useState("USD");

    const [isHoveredSearch, setIsHoveredSearch] = useState(false);
    const [isHoveredClear, setIsHoveredClear] = useState(false);

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
                especialidad: selectedSpecialty, 
                salario: salary,
                moneda: currency,
            });
        }
    };

    const handleClear = () => {
        setSelectedArea("");
        setSelectedSpecialty("");
        setSalary("");
        if (onSearch) {
            onSearch({ area: "", especialidad: "", salario: "", moneda: "" });
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>
                Buscador Inteligente de Talento
            </h2>

            {/* Fila de campos */}
            <div style={styles.row}>
                {/* Área de Trabajo */}
                <div style={{ flex: "1 1 320px" }}>
                    <label style={styles.label}>
                        Área de Trabajo
                    </label>
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        style={styles.select}
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
                    <label style={styles.label}>
                        Especialidades
                    </label>
                    <select
                        disabled={!selectedArea}
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        style={{
                            ...styles.select,
                            opacity: !selectedArea ? 0.6 : 1,
                            cursor: selectedArea ? 'pointer' : 'not-allowed',
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
                    <label style={styles.label}>
                        Aspiración Máxima
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <input
                            type="number"
                            min="0"
                            placeholder="Ej: 1000 (o menos)"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            style={styles.input}
                        />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={styles.currencySelect}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={styles.buttonActionsRow}>
                <button
                    type="button"
                    onClick={handleSearchClick}
                    style={{
                        ...styles.baseSearchButton,
                        backgroundColor: isHoveredSearch ? "#1557B0" : "#1A73E8",
                    }}
                    onMouseEnter={() => setIsHoveredSearch(true)}
                    onMouseLeave={() => setIsHoveredSearch(false)}
                >
                    <FiSearch />
                    Buscar Talento
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    style={{
                        ...styles.baseClearButton,
                        backgroundColor: isHoveredClear ? "#DBEAFE" : "#EFF6FF",
                    }}
                    onMouseEnter={() => setIsHoveredClear(true)}
                    onMouseLeave={() => setIsHoveredClear(false)}
                >
                    Ver todos
                </button>
            </div>
        </div>
    );
};

export default TalentSearch;
