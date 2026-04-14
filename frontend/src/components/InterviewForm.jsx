import React, { useState } from "react";
import {
  ChevronLeft,
  Star,
  CheckCircle2,
  Folder,
  XCircle,
  FileText,
  User,
} from "lucide-react";

// Sub-componente para estrellas de calificación
const StarRating = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between w-full p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
    <span className="text-sm font-semibold text-gray-900">{label}</span>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none transform active:scale-90 transition-transform p-1"
        >
          <Star
            className={`w-6 h-6 ${star <= value ? "fill-amber-400 text-amber-500" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  </div>
);

export const InterviewForm = ({ onBack, talents = [], onSave }) => {
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    observaciones: "",
    puntuacionTecnica: 0,
    puntuacionComunicacion: 0,
    puntuacionInteres: 0,
    dictamen: "",
  });

  // Buscamos el talento seleccionado para mostrar su perfil dinámicamente
  const selectedTalent = talents.find((t) => String(t.id) === selectedId);

  const handleSave = () => {
    if (!selectedId || !formData.dictamen) {
      alert("Por favor, selecciona un candidato y un dictamen final.");
      return;
    }
    onSave({ ...formData, talentoId: selectedId });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Navegación */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 w-fit group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver a Búsqueda
        </button>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 flex flex-col gap-8">
          <header>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Registro de Entrevista
            </h1>
            <p className="text-gray-500 mt-1">
              Completa la evaluación detallada del candidato.
            </p>
          </header>

          {/* 1. Selección y Perfil */}
          <section className="grid grid-cols-1 gap-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Seleccionar Candidato *
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 text-gray-800 focus:border-blue-500 focus:ring-0 outline-none transition-all cursor-pointer"
            >
              <option value="">Seleccione un talento...</option>
              {talents.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} {t.apellido} - {t.area}
                </option>
              ))}
            </select>

            {selectedTalent && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-2">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedTalent.nombre?.[0] || ""}
                  {selectedTalent.apellido?.[0] || ""}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedTalent.nombre} {selectedTalent.apellido}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium">
                    {selectedTalent.area}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 2. Evaluación */}
          <section className="flex flex-col gap-6">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Evaluación de Competencias
            </label>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <StarRating
                label="Competencia Técnica"
                value={formData.puntuacionTecnica}
                onChange={(v) =>
                  setFormData({ ...formData, puntuacionTecnica: v })
                }
              />
              <StarRating
                label="Comunicación"
                value={formData.puntuacionComunicacion}
                onChange={(v) =>
                  setFormData({ ...formData, puntuacionComunicacion: v })
                }
              />
              <StarRating
                label="Nivel de Interés"
                value={formData.puntuacionInteres}
                onChange={(v) =>
                  setFormData({ ...formData, puntuacionInteres: v })
                }
              />
            </div>

            <textarea
              placeholder="Escribe aquí las observaciones, fortalezas y debilidades..."
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl h-32 focus:border-blue-500 focus:ring-0 outline-none resize-none transition-all"
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
            />
          </section>

          {/* 3. Dictamen Final */}
          <section className="flex flex-col gap-6">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Dictamen Final *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DictamenBtn
                type="ELEGIBLE"
                icon={<CheckCircle2 />}
                color="green"
                active={formData.dictamen === "ELEGIBLE"}
                onClick={() =>
                  setFormData({ ...formData, dictamen: "ELEGIBLE" })
                }
              />
              <DictamenBtn
                type="EN CARTERA"
                icon={<Folder />}
                color="amber"
                active={formData.dictamen === "EN CARTERA"}
                onClick={() =>
                  setFormData({ ...formData, dictamen: "EN CARTERA" })
                }
              />
              <DictamenBtn
                type="NO ELEGIBLE"
                icon={<XCircle />}
                color="red"
                active={formData.dictamen === "NO ELEGIBLE"}
                onClick={() =>
                  setFormData({ ...formData, dictamen: "NO ELEGIBLE" })
                }
              />
            </div>
          </section>

          {/* Botón Guardar */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <FileText className="w-6 h-6" />
            Finalizar Entrevista y Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente pequeño para los botones de dictamen
const DictamenBtn = ({ type, icon, color, active, onClick }) => {
  const colors = {
    green: active
      ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
      : "border-gray-200 bg-white text-gray-400 hover:border-gray-300",
    amber: active
      ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
      : "border-gray-200 bg-white text-gray-400 hover:border-gray-300",
    red: active
      ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
      : "border-gray-200 bg-white text-gray-400 hover:border-gray-300",
  };
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all font-bold text-sm ${colors[color]}`}
    >
      {React.cloneElement(icon, { className: "w-8 h-8" })}
      {type}
    </button>
  );
};
