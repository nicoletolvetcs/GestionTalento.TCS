import React, { useState } from "react";

/**
 * NOTA PARA EL USUARIO:
 * Para que este componente se vea correctamente, debes asegurarte de que tu archivo
 * 'src/index.css' contenga las siguientes líneas al principio:
 * * @tailwind base;
 * @tailwind components;
 * @tailwind utilities;
 * * Tu configuración de 'tailwind.config.js' y 'main.jsx' que compartiste es correcta.
 */

export default function RegisterTalent({ onRegister, onBack }) {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    identificacion: "",
    fechaNacimiento: "",
    telefono: "",
    correoElectronico: "",
    ciudad: "",
    pais: "",
    areaTrabajo: "",
    especialidad: "",
    disponibilidad: "Inmediata",
    expectativaSalarial: "",
    moneda: "EUR",
    documentoIdentidad: null,
    referenciasPersonales: null,
    aceptaPoliticas: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Simulación de espera para el backend
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Estructura para enviar al backend (FormData es necesario por los archivos)
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    if (typeof onRegister === "function") {
      onRegister(formData);
    }

    setMessage("Candidato registrado exitosamente.");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Botón de volver */}
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mb-6 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a Búsqueda
        </button>

        {/* Contenedor principal del formulario */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Registro de Nuevo Candidato
          </h2>

          {message && (
            <div className="mb-6 p-4 rounded-md text-sm font-medium bg-green-50 text-green-800 border border-green-200">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECCIÓN I. Datos Personales */}
            <section>
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                I. Datos Personales
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    required
                    placeholder="Nombres y Apellidos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Identificación *
                    </label>
                    <input
                      type="text"
                      name="identificacion"
                      value={formData.identificacion}
                      onChange={handleChange}
                      required
                      placeholder="DNI 12345678A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="+34 612 345 678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="correoElectronico"
                      value={formData.correoElectronico}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                      placeholder="Madrid"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País *
                    </label>
                    <input
                      type="text"
                      name="pais"
                      value={formData.pais}
                      onChange={handleChange}
                      required
                      placeholder="España"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN II. Perfil Profesional */}
            <section>
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                II. Perfil Profesional
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área de Trabajo *
                  </label>
                  <select
                    name="areaTrabajo"
                    value={formData.areaTrabajo}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="" disabled>
                      Seleccione un área
                    </option>
                    <option value="tecnologia">
                      Tecnología de la Información
                    </option>
                    <option value="marketing">Marketing y Publicidad</option>
                    <option value="finanzas">Finanzas y Contabilidad</option>
                    <option value="rrhh">Recursos Humanos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidades *
                  </label>
                  <input
                    type="text"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    required
                    disabled={!formData.areaTrabajo}
                    placeholder={
                      formData.areaTrabajo
                        ? "Ingrese sus especialidades"
                        : "Primero seleccione un Área de trabajo"
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidad
                  </label>
                  <select
                    name="disponibilidad"
                    value={formData.disponibilidad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="Inmediata">Inmediata</option>
                    <option value="15_dias">15 días</option>
                    <option value="1_mes">1 mes</option>
                    <option value="negociable">Negociable</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN III. Documentación y Aspiración Salarial */}
            <section>
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                III. Documentación y Aspiración Salarial
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expectativa Salarial *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="expectativaSalarial"
                      value={formData.expectativaSalarial}
                      onChange={handleChange}
                      required
                      placeholder="35000"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <select
                      name="moneda"
                      value={formData.moneda}
                      onChange={handleChange}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Carga Documento Identidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento de Identidad
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                      <input
                        type="file"
                        name="documentoIdentidad"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <svg
                        className="w-8 h-8 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">
                        {formData.documentoIdentidad
                          ? formData.documentoIdentidad.name
                          : "Arrastra el archivo aquí"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF o JPG (máx. 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Carga Referencias Personales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referencias Personales
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                      <input
                        type="file"
                        name="referenciasPersonales"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <svg
                        className="w-8 h-8 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">
                        {formData.referenciasPersonales
                          ? formData.referenciasPersonales.name
                          : "Arrastra el archivo aquí"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF o JPG (máx. 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Checkbox de Políticas */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="aceptaPoliticas"
                  checked={formData.aceptaPoliticas}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Acepto las políticas de privacidad y manejo de datos sensibles
                  (LOPD) *
                </span>
              </label>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={() => {
                  /* Lógica para cancelar o resetear */
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Guardando..." : "Guardar Candidato"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
