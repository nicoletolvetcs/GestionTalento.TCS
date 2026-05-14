import React, { useState, useEffect } from 'react';
import TalentSearch from './TalentSearch';
import TalentTable from './TalentTable';
import api from '../api';

const TalentManagement = ({ onVerFicha, onVerDetalle, onRellenarEntrevista }) => {
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estado para los filtros locales (Nombre/Cédula + Estatus)
    const [localFilters, setLocalFilters] = useState({
        searchQuery: "",
        estatus: "Todos",
    });

    // Función que conecta con el backend
    const fetchTalento = async (filtros = {}) => {
        setLoading(true);
        try {
            const response = await api.get('candidatos/', {
                params: {
                    area: filtros.area || '',
                    especialidad: filtros.especialidad || '',
                    salario: filtros.salario || '',
                    moneda: filtros.moneda || ''
                }
            });
            setCandidatos(response.data);
        } catch (error) {
            console.error("Error trayendo candidatos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar todos al entrar a la página
    useEffect(() => {
        fetchTalento();
    }, []);

    // Aplicar filtros locales (Nombre/Cédula + Estatus) — case-insensitive
    const candidatosFiltrados = candidatos.filter(c => {
        const query = localFilters.searchQuery.toLowerCase().trim();

        // Filtro por nombre o cédula (case-insensitive)
        if (query) {
            const nombre = (c.nombre_completo || "").toLowerCase();
            const cedula = (c.cedula || "").toLowerCase();
            if (!nombre.includes(query) && !cedula.includes(query)) {
                return false;
            }
        }

        // Filtro por estatus
        if (localFilters.estatus !== "Todos") {
            if ((c.estatus || "Pendiente") !== localFilters.estatus) {
                return false;
            }
        }

        return true;
    });

    return (
        <div style={{ padding: '40px', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
            {/* 1. El Buscador (le pasamos la función de búsqueda + callback de filtros locales) */}
            <TalentSearch
                onSearch={fetchTalento}
                onLocalFilter={setLocalFilters}
            />

            {/* 2. La Tabla (le pasamos los datos filtrados) */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#6B7280' }}>
                    Buscando en la base de datos...
                </div>
            ) : (
                <TalentTable data={candidatosFiltrados} onVerFicha={onVerFicha} onVerDetalle={onVerDetalle} onRellenarEntrevista={onRellenarEntrevista} />
            )}
        </div>
    );
};

export default TalentManagement;