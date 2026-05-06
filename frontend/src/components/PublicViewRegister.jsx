import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ciudadesVE from '../ciudadesVE.json';
import { FormSelect, FormInput, FormSection, FileDropzone } from './FormComponents';

const PublicViewRegister = () => {
    // ── ESTADO: Igual que RegisterTalent pero SIN estatus ──
    const [formData, setFormData] = useState({
        cedula: '',
        nombre_completo: '',
        email: '',
        telefono: '+58 ',
        direccion: '',
        fecha_nacimiento: '',
    });
    const [pais, setPais] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [errors, setErrors] = useState({
        nombre_completo: '', telefono: '', cedula: '',
    });
    const [erroresServidor, setErroresServidor] = useState({});

    // Áreas y especialidades
    const [areas, setAreas] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [bloquesAreas, setBloquesAreas] = useState([{ area: '', especialidades: [] }]);

    // Salario, moneda, disponibilidad
    const [salarial, setSalarial] = useState('');
    const [moneda, setMoneda] = useState('');
    const [disponibilidad, setDisponibilidad] = useState('');
    const opcionesDisponibilidad = ['Inmediata', '15 días', '30 días',
        'Remoto', 'Presencial', 'Híbrido', 'Negociable'];

    // Archivos
    const [docsIdentidad, setDocsIdentidad] = useState([]);
    const [cv, setCv] = useState(null);

    // ── NUEVOS ESTADOS PARA PORTAL PÚBLICO ──
    const [aceptaLOPD, setAceptaLOPD] = useState(false);
    const [honeypot, setHoneypot] = useState(''); // Campo trampa para bots
    const [registroExitoso, setRegistroExitoso] = useState(false);

    // Cargar áreas y especialidades (SIN token, usa axios directo)
    useEffect(() => {
        const cargar = async () => {
            try {
                const [resAreas, resEspec] = await Promise.all([
                    axios.get('http://localhost:8000/api/areas/'),
                    axios.get('http://localhost:8000/api/especialidades/')
                ]);
                setAreas(resAreas.data);
                setEspecialidades(resEspec.data);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            }
        };
        cargar();
    }, []);

    // ── Funciones auxiliares para bloques de áreas ──
    const agregarBloque = () => {
        setBloquesAreas([...bloquesAreas, { area: '', especialidades: [] }]);
    };

    const handleAreaChange = (index, value) => {
        const nuevosBloques = [...bloquesAreas];
        nuevosBloques[index].area = value;
        nuevosBloques[index].especialidades = [];
        setBloquesAreas(nuevosBloques);
    };

    const handleEspecialidadesChange = (index, selectedOptions) => {
        const nuevosBloques = [...bloquesAreas];
        const values = Array.from(selectedOptions, option => option.value);
        nuevosBloques[index].especialidades = values;
        setBloquesAreas(nuevosBloques);
    };

    const eliminarBloque = (index) => {
        const nuevosBloques = [...bloquesAreas];
        nuevosBloques.splice(index, 1);
        setBloquesAreas(nuevosBloques);
    };

    // ── Funciones para archivos ──
    const handleDocsIdentidadChange = (e) => {
        const choosenFiles = Array.from(e.target.files);
        if (choosenFiles.length > 3) {
            alert("Solamente puedes subir un máximo de 3 archivos en esta sección.");
            setDocsIdentidad(choosenFiles.slice(0, 3));
        } else {
            setDocsIdentidad(choosenFiles);
        }
    };

    const handleCvChange = (e) => {
        const choosenFile = Array.from(e.target.files);
        if (choosenFile.length > 1) {
            alert("Solamente puedes subir un archivo en esta sección.");
            setCv(choosenFile.slice(0, 1));
        } else {
            setCv(choosenFile);
        }
    };

    // ── handleInputChange con validaciones ──
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // --- Validacion de Nombre Completo ---
        if (name === 'nombre_completo') {
            const sinNumeros = value.replace(/[0-9]/g, '');
            const formatoNombre = sinNumeros.replace(/\b\w/g, (char) => char.toUpperCase());
            setFormData({ ...formData, [name]: formatoNombre });
            setErrors({
                ...errors,
                nombre_completo: /[0-9]/.test(value) ? 'El nombre no puede contener números.' : '',
            });
            return;
        }

        // --- Validacion de Cedula ---
        if (name === 'cedula') {
            let nuevaVal = value.toUpperCase();

            if (nuevaVal.length === 1 && !['V', 'E'].includes(nuevaVal)) {
                setErrors({ ...errors, cedula: 'Debe iniciar con V o E.' });
                return;
            }

            if (nuevaVal.length > 1) {
                const resto = nuevaVal.slice(1).replace(/\D/g, '');
                nuevaVal = nuevaVal[0] + resto;
            }

            setFormData({ ...formData, [name]: nuevaVal });
            setErrors({
                ...errors,
                cedula: nuevaVal.length > 0 && !['V', 'E'].includes(nuevaVal[0])
                    ? 'Debe iniciar con V o E.'
                    : '',
            });
            return;
        }

        // --- Validacion de telefono ---
        if (name === 'telefono') {
            let tel = value;
            const prefijo = '+58 ';

            if (!tel.startsWith(prefijo)) {
                tel = prefijo;
            }

            const parteUsuario = tel.slice(prefijo.length).replace(/\D/g, '');
            tel = prefijo + parteUsuario;

            const telefonoLimpio = parteUsuario;
            let msgError = '';
            if (telefonoLimpio.length > 0 && telefonoLimpio[0] !== '4') {
                msgError = 'Despues de +58, el numero debe empezar con 4';
            }
            else if (telefonoLimpio.length > 10) {
                msgError = 'El número no puede exceder 10 dígitos.';
                tel = prefijo + parteUsuario.slice(0, 10);
            }
            setFormData({ ...formData, [name]: tel });
            setErrors({ ...errors, telefono: msgError });
            return;
        }

        // --- Demás campos ---
        setFormData({ ...formData, [name]: value });
    };

    // ── handleSubmit ──
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!aceptaLOPD) {
            alert("Debes aceptar las políticas de protección de datos para continuar.");
            return;
        }

        const pack = new FormData();
        pack.append('cedula', formData.cedula);
        pack.append('nombre_completo', formData.nombre_completo);
        pack.append('email', formData.email);
        pack.append('telefono', formData.telefono);
        pack.append('direccion', formData.direccion);
        pack.append('fecha_nacimiento', formData.fecha_nacimiento);
        pack.append('pais', pais);
        pack.append('ciudad', ciudad);

        // Honeypot (el backend lo detectará)
        if (honeypot) pack.append('website', honeypot);

        // Áreas y especialidades
        bloquesAreas.forEach(bloque => {
            bloque.especialidades.forEach(espId => {
                pack.append('especialidades', espId);
            });
        });

        if (salarial) {
            pack.append('aspiracion_salarial', salarial);
            pack.append('moneda', moneda);
        }
        if (disponibilidad) pack.append('disponibilidad', disponibilidad);

        // Archivos
        if (docsIdentidad.length > 0) pack.append('documento_identidad', docsIdentidad[0]);
        if (cv && cv.length > 0) pack.append('curriculum_vitae', cv[0]);

        // NO enviamos 'estatus' — el backend lo fuerza a 'Pendiente'

        try {
            await axios.post('http://localhost:8000/api/registro-publico/', pack, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRegistroExitoso(true);
            setErroresServidor({});
        } catch (error) {
            if (error.response?.data) {
                setErroresServidor(error.response.data);
            } else {
                alert("Error de conexión. Intenta de nuevo.");
            }
        }
    };

    // ── PANTALLA DE ÉXITO ──
    if (registroExitoso) {
        return (
            <div style={{
                backgroundColor: '#F3F4F6', minHeight: '100vh',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontFamily: '"Inter", sans-serif'
            }}>
                <div style={{
                    background: 'white', padding: '48px', borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB',
                    textAlign: 'center', maxWidth: '500px'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>
                        ¡Registro Exitoso!
                    </h2>
                    <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                        Tu postulación ha sido recibida correctamente. Nuestro equipo de Recursos Humanos
                        revisará tu perfil y te contactará pronto.
                    </p>
                    <p style={{
                        background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px',
                        padding: '12px 16px', fontSize: '13px', color: '#075985', marginBottom: '24px'
                    }}>
                        <strong>Tip:</strong> Puedes consultar el estado de tu postulación en cualquier momento
                        ingresando tu cédula en nuestro portal de consulta.
                    </p>
                    <button onClick={() => window.location.href = '/consulta-publica'} style={{
                        padding: '12px 32px', borderRadius: '8px', background: '#1A73E8',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontWeight: '600', fontSize: '14px'
                    }}>
                        Consultar Estado
                    </button>
                </div>
            </div>
        );
    }

    // ── FORMULARIO PÚBLICO ──
    return (
        <div style={{
            backgroundColor: '#F3F4F6', minHeight: '100vh', padding: '40px 24px',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header público */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937' }}>
                        Postulación de Candidato
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                        Completa el formulario para registrar tu perfil profesional
                    </p>
                </div>

                <div style={{
                    background: 'white', padding: '32px', borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB'
                }}>
                    <form onSubmit={handleSubmit}>

                        {/* ── HONEYPOT: Campo invisible para bots ── */}
                        <div style={{ position: 'absolute', left: '-9999px' }}>
                            <input
                                type="text"
                                name="website"
                                tabIndex="-1"
                                autoComplete="off"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                        </div>

                        {/* ══════ SECCIÓN I: Datos Personales ══════ */}
                        <FormSection title="I. Datos Personales">
                            <FormInput
                                label="Nombre Completo *"
                                placeholder="Nombres y Apellidos"
                                value={formData.nombre_completo}
                                onChange={handleInputChange}
                                name="nombre_completo"
                                error={errors.nombre_completo || erroresServidor.nombre_completo?.[0]}
                            />
                            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                                <FormInput
                                    label="Identificación *"
                                    placeholder="V12345678"
                                    width="50%"
                                    value={formData.cedula}
                                    onChange={handleInputChange}
                                    name="cedula"
                                    error={errors.cedula || erroresServidor.cedula?.[0]}
                                />
                                <FormInput
                                    label="Fecha de Nacimiento *"
                                    type="date"
                                    width="50%"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleInputChange}
                                    name="fecha_nacimiento"
                                    error={erroresServidor.fecha_nacimiento?.[0]}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                                <FormInput
                                    label="Teléfono *"
                                    placeholder="+58 412..."
                                    width="50%"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    name="telefono"
                                    error={errors.telefono || erroresServidor.telefono?.[0]}
                                />
                                <FormInput
                                    label="Correo Electrónico *"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    width="50%"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    name="email"
                                    error={erroresServidor.email?.[0]}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                                <FormSelect
                                    label="País *"
                                    value={pais}
                                    onChange={(e) => {
                                        setPais(e.target.value);
                                        if (e.target.value !== 'Venezuela') setCiudad('');
                                    }}
                                    options={['Venezuela']}
                                    width="50%"
                                    defaultOption="Seleccione un país..."
                                />
                                {pais === 'Venezuela' ? (
                                    <FormSelect
                                        label="Ciudad *"
                                        value={ciudad}
                                        onChange={(e) => setCiudad(e.target.value)}
                                        options={ciudadesVE}
                                        width="50%"
                                        defaultOption="Seleccione una ciudad..."
                                    />
                                ) : (
                                    <FormSelect
                                        label="Ciudad *"
                                        value=""
                                        onChange={() => { }}
                                        options={[]}
                                        width="50%"
                                        defaultOption="Seleccione un país primero..."
                                        disabled
                                    />
                                )}
                            </div>
                            <FormInput
                                label="Dirección *"
                                placeholder="Direccion corta"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                name="direccion"
                            />
                        </FormSection>

                        {/* ══════ SECCIÓN II: Perfil Profesional ══════ */}
                        <FormSection title="II. Perfil Profesional">
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {bloquesAreas.map((bloque, index) => {
                                    const especialidadesDelArea = especialidades.filter(e => e.area === parseInt(bloque.area));
                                    return (
                                        <div key={index} style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FAFBFC' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <label style={{ fontSize: '16px', fontWeight: '500' }}>Área de Trabajo {index + 1} *</label>
                                                {index > 0 && (
                                                    <button type="button" onClick={() => eliminarBloque(index)} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                            <select value={bloque.area} onChange={(e) => handleAreaChange(index, e.target.value)}
                                                style={{
                                                    width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: 'Inter', fontSize: '16px', marginBottom: '16px',
                                                    color: bloque.area === '' ? '#6B7280' : '#1F2937'
                                                }}>
                                                <option value="">Seleccione un área...</option>
                                                {areas.map((area) => (
                                                    <option key={area.id_area} value={area.id_area}>
                                                        {area.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Especialidades (Múltiple) *</label>
                                            <select multiple disabled={!bloque.area} value={bloque.especialidades} onChange={(e) => handleEspecialidadesChange(index, e.target.selectedOptions)}
                                                style={{
                                                    width: '100%', minHeight: '100px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', padding: '8px', fontFamily: 'Inter', fontSize: '14px',
                                                    opacity: !bloque.area ? 0.6 : 1, cursor: !bloque.area ? 'not-allowed' : 'pointer',
                                                    color: bloque.especialidades.length === 0 ? '#6B7280' : '#1F2937'
                                                }}>
                                                {especialidadesDelArea.length === 0 && <option value="" disabled>{bloque.area ? "No hay especialidades..." : "Primero seleccione un área"}</option>}
                                                {especialidadesDelArea.map((esp) => (
                                                    <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                                        {esp.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>* Mantén presionado Ctrl (o Cmd en Mac) para elegir múltiples</p>
                                        </div>
                                    );
                                })}
                                <button type="button" onClick={agregarBloque} style={{ width: 'fit-content', padding: '8px 16px', borderRadius: '8px', border: '1px dashed #1A73E8', color: '#1A73E8', background: 'transparent', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    + Agregar Nueva Área
                                </button>
                            </div>
                            <FormSelect
                                label="Disponibilidad *"
                                value={disponibilidad}
                                onChange={(e) => setDisponibilidad(e.target.value)}
                                options={opcionesDisponibilidad}
                                width="100%"
                            />
                        </FormSection>

                        {/* ══════ SECCIÓN III: Documentación y Aspiración ══════ */}
                        <FormSection title="III. Documentación y Aspiración">
                            <div style={{ display: 'flex', gap: '16px', width: '100%', alignItems: 'center' }}>
                                <FormInput
                                    label="Expectativa Salarial (Opcional)"
                                    type="number"
                                    placeholder="Ej: 800"
                                    value={salarial}
                                    onChange={(e) => setSalarial(e.target.value)}
                                    width="70%"
                                />
                                <FormSelect
                                    label="Moneda"
                                    value={moneda}
                                    onChange={(e) => setMoneda(e.target.value)}
                                    options={['USD', 'EUR']}
                                    width="30%"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                                <FileDropzone label="Documento de Identidad y Referencias Personales (Opcional)" helperText="PDF (máx. 10MB)" accept=".pdf" maxFiles={3} files={docsIdentidad} onChange={handleDocsIdentidadChange} />
                                <FileDropzone label="Curriculum Vitae *" helperText="PDF (máx. 10MB)" accept=".pdf" maxFiles={1} files={cv} onChange={handleCvChange} />
                            </div>
                        </FormSection>

                        {/* ── CHECKBOX LOPD ── */}
                        <div style={{
                            marginTop: '24px', padding: '16px', backgroundColor: '#F0F9FF',
                            border: '1px solid #BAE6FD', borderRadius: '8px',
                            display: 'flex', alignItems: 'flex-start', gap: '12px'
                        }}>
                            <input
                                type="checkbox"
                                checked={aceptaLOPD}
                                onChange={(e) => setAceptaLOPD(e.target.checked)}
                                style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label style={{ fontSize: '13px', color: '#1F2937', lineHeight: '1.5' }}>
                                Acepto la <strong>Política de Protección de Datos Personales (LOPD)</strong>.
                                Mis datos serán utilizados exclusivamente para el proceso de selección
                                y no serán compartidos con terceros sin mi consentimiento.
                            </label>
                        </div>

                        {/* Botón de envío */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                            <button type="submit" disabled={!aceptaLOPD} style={{
                                padding: '14px 48px', borderRadius: '8px',
                                background: aceptaLOPD ? '#1A73E8' : '#93C5FD',
                                color: 'white', border: 'none',
                                cursor: aceptaLOPD ? 'pointer' : 'not-allowed',
                                fontWeight: '600', fontSize: '16px'
                            }}>
                                Enviar Postulación
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PublicViewRegister;
