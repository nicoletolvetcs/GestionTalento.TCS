import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Star,
  CheckCircle2,
  Folder,
  XCircle,
  FileText,
} from "lucide-react";

const StarRating = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-sm font-medium text-gray-00">{label}</span>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange(star)}>
          <Star
            className={`w-5 h-5 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  </div>
);

const DictamenBtn = ({ type, icon, color, active, onClick }) => {
  const colors = {
    green: active
      ? "border-green-00 bg-green-50 text-green-700"
      : "border-gray-300 bg-white text-gray-700",
    amber: active
      ? "border-amber-500 bg-amber-50 text-amber-700"
      : "border-gray-300 bg-white text-gray-700",
    red: active
      ? "border-red-500 bg-red-50 text-red-700"
      : "border-gray-300 bg-white text-gray-700",
  };
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 flex items-center gap-2 font-medium text-sm ${colors[color]}`}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
      {type}
    </button>
  );
};

export const InterviewForm = ({ onBack, talents = [], onSave }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [formData, setFormData] = useState({
    observaciones: "",
    puntuacionTecnica: 0,
    puntuacionComunicacion: 0,
    puntuacionInteres: 0,
    dictamen: "",
    observacionesCierre: "",
  });

  const selectedCandidate = talents.find(
    (t) => String(t.id) === selectedCandidateId,
  );
  const fecha = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleSave = () => {
    if (!selectedCandidateId || !formData.dictamen) {
      alert("Por favor, selecciona un candidato y un dictamen final.");
      return;
    }
    onSave({
      ...formData,
      talentoId: selectedCandidateId,
      entrevistador: "Nicole Tolve",
      fecha,
      area: selectedCandidate?.area || "",
    });
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-8">
      <div className="flex flex-col w-[896px] items-start gap-6 p-4 relative">
        <button
          onClick={onBack}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 w-fit"
        >
          <ChevronLeft className="w-4 h-4 text-[#1a73e8]" />
          <div className="font-medium text-[#1a73e8] text-base">
            Volver a Búsqueda
          </div>
        </button>

        <div className="flex w-[896px] flex-col items-start gap-6 pt-[33px] pb-8 px-[33px] bg-white rounded-lg border-2 border-gray-100 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">
            Registro de Entrevista
          </h2>

          {selectedCandidate && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300 w-full">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {selectedCandidate.nombre[0]}
                {selectedCandidate.apellido[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {selectedCandidate.nombre} {selectedCandidate.apellido}
                </h3>
                <p className="text-sm text-blue-600">
                  {selectedCandidate.area}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-800">
              Seleccionar Candidato *
            </label>
            <div className="relative w-full">
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="appearance-none w-full h-[41px] bg-white rounded-lg border-2 border-gray-400 px-3 font-medium text-gray-800 text-sm focus:outline-none focus:border-[#1a73e8] pr-10"
                required
              >
                <option value="">Seleccione un candidato</option>
                {talents.map((talent) => (
                  <option key={talent.id} value={talent.id}>
                    {talent.nombre} {talent.apellido}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 w-full">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Datos de la Entrevista (Automático)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Entrevistador:</p>
                <p className="text-sm font-medium text-gray-800">
                  Nicole Tolve
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Área:</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedCandidate?.area || "No especificada"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fecha:</p>
                <p className="text-sm font-medium text-gray-800">{fecha}</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones, fortalezas y debilidades *
            </label>
            <textarea
              placeholder="Escribe aquí las observaciones, fortalezas y debilidades..."
              className="w-full p-3 border-2 border-gray-400 rounded-lg h-32 resize-none focus:outline-none focus:border-[#1a73e8]"
              value={formData.observaciones}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Puntuación de Competencias
            </label>
            <div className="space-y-3">
              <StarRating
                label="Técnica"
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
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dictamen Final *
            </label>
            <div className="flex gap-3">
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
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones del Cliente
            </label>
            <textarea
              placeholder="Escribe aquí las observaciones del cliente..."
              className="w-full p-3 border-2 border-gray-400 rounded-lg h-24 resize-none focus:outline-none focus:border-[#1a73e8]"
              value={formData.observacionesCierre}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  observacionesCierre: e.target.value,
                })
              }
            />
          </div>

          <div className="flex gap-4 w-full pt-4">
            <button
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Realizar Entrevista y Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
