import { useState } from "react";

export default function RegisterTalent({ onRegister }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    area: "",
    especialidad: "",
    experiencia: "",
    salario: "",
    ubicacion: "",
    currency: "USD",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    await new Promise((resolve) => setTimeout(resolve, 700));

    const newTalent = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      area: formData.area,
      especialidades: formData.especialidad ? [formData.especialidad] : [],
      salario: Number(formData.salario) || 0,
      currency: formData.currency,
      ubicacion: formData.ubicacion,
    };

    if (typeof onRegister === "function") {
      onRegister(newTalent);
    }

    setMessage("Talento registrado exitosamente!");
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      area: "",
      especialidad: "",
      experiencia: "",
      salario: "",
      ubicacion: "",
      currency: "USD",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 form-surface rounded-3xl shadow-2xl border border-white/10">
      <h2 className="text-3xl font-semibold text-white mb-6 tracking-tight">
        Registro de Talento
      </h2>

      {message && (
        <div
          className={`mb-4 p-4 rounded-xl text-sm font-medium ${message.includes("exitosamente") ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-semibold form-label mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Ingrese nombre"
            />
          </div>

          <div>
            <label className="block text-base font-semibold form-label mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Ingrese apellido"
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold form-label mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-base font-semibold form-label mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="+1234567890"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              className="form-select w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Seleccione área</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Marketing">Marketing</option>
              <option value="Ventas">Ventas</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Diseño">Diseño</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold form-label mb-1">
              Especialidad
            </label>
            <input
              type="text"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Ej: Frontend Developer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-semibold form-label mb-1">
              Experiencia (años)
            </label>
            <input
              type="number"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              min="0"
              className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-base font-semibold form-label mb-1">
              Salario esperado
            </label>
            <input
              type="number"
              name="salario"
              value={formData.salario}
              onChange={handleChange}
              min="0"
              className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold form-label mb-1">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="form-input w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Ciudad, País"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-500 text-slate-950 font-semibold py-3 px-4 rounded-2xl hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Registrando..." : "Registrar Talento"}
        </button>
      </form>
    </div>
  );
}
