import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const workAreas = ["Tecnología", "Marketing", "Ventas", "Finanzas", "Recursos Humanos", "Diseño"];

const specialtiesByArea = {
    Tecnología: ["Frontend", "Backend", "DevOps", "Data Science"],
    Marketing: ["SEO", "SEM", "Content"],
    // ... (puedes completar el resto aquí)
};

const TalentSearch = () => {
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [salary, setSalary] = useState("");
    const [currency, setCurrency] = useState("USD");

    const specialties = selectedArea ? specialtiesByArea[selectedArea] || [] : [];

    const handleAreaChange = (e) => {
        setSelectedArea(e.target.value);
        setSelectedSpecialty("");
    };

    return (
        <div style={{
            width: '100%',
            padding: '24px 28px',
            background: 'rgba(226, 239, 255, 0.95)',
            borderRadius: '12px',
            border: '1px solid rgba(147, 197, 253, 0.6)',
            boxShadow: '0 12px 30px rgba(59, 130, 246, 0.08)',
            fontFamily: '"Inter", sans-serif',
            boxSizing: 'border-box',
        }}>

            <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 20px 0',
                fontFamily: '"Inter", sans-serif',
            }}>
                Buscador Inteligente de Talento
            </h2>

            {/* Fila de campos */}
            <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-end',
                marginBottom: '20px',
            }}>

                {/* Área de Trabajo */}
                <div style={{ flex: '1 1 0' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '6px',
                        textAlign: 'left',
                        fontFamily: '"Inter", sans-serif',
                    }}>Área de Trabajo</label>
                    <select
                        value={selectedArea}
                        onChange={handleAreaChange}
                        style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            backgroundColor: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#6B7280',
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="">Seleccione un área...</option>
                        {workAreas.map(area => <option key={area} value={area}>{area}</option>)}
                    </select>
                </div>

                {/* Especialidades */}
                <div style={{ flex: '1.5 1 0' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '6px',
                        textAlign: 'left',
                        fontFamily: '"Inter", sans-serif',
                    }}>Especialidades</label>
                    <select
                        disabled={!selectedArea}
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        style={{
                            width: '100%',
                            height: '42px',
                            padding: '0 12px',
                            backgroundColor: '#F9FAFB',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#6B7280',
                            outline: 'none',
                            opacity: !selectedArea ? 0.6 : 1,
                            cursor: selectedArea ? 'pointer' : 'not-allowed',
                        }}
                    >
                        <option value="">{selectedArea ? "Seleccione especialidad..." : "Primero seleccione un área"}</option>
                        {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                </div>

                {/* Aspiración Salarial */}
                <div style={{ flex: '1.2 1 0' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '6px',
                        textAlign: 'left',
                        fontFamily: '"Inter", sans-serif',
                    }}>Aspiración Salarial </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="number"
                            placeholder="Ej: 40000"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            style={{
                                flex: 1,
                                height: '42px',
                                padding: '0 12px',
                                backgroundColor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '14px',
                                color: '#374151',
                                outline: 'none',
                            }}
                        />
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{
                                width: '70px',
                                height: '42px',
                                backgroundColor: '#F3F4F6',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#374151',
                                textAlign: 'center',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Botón Buscar - alineado a la izquierda */}
            <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: '40px',
                padding: '0 20px',
                backgroundColor: '#1A73E8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: '"Inter", sans-serif',
            }}>
                {<FiSearch />}
                Buscar Talento
            </button>
        </div>
    );
};

export default TalentSearch;