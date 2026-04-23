import React, { useState } from "react";
import { Search, Loader2, CheckCircle2, User, FileText } from "lucide-react";

const EstadoConsulta = () => {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Simulación de búsqueda (aquí integrarás tu llamada real al API)
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulando delay de red
    setTimeout(() => {
      setResult({
        nombre: "Juan Pérez",
        etapa: "Entrevista técnica",
        progreso: 60, // Porcentaje de avance
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Consulta de Estado
          </h1>
          <p className="text-gray-500 mt-2">
            Ingresa tu cédula para conocer el estatus de tu proceso
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Cédula
            </label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0061FF] focus:border-[#0061FF] outline-none transition-all"
              placeholder="Ej: 12345678"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0061FF] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Buscando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" /> Consultar
              </>
            )}
          </button>
        </form>

        {/* Resultados */}
        {result && (
          <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-[#0061FF] rounded-full">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Candidato</p>
                <p className="font-bold text-gray-900">{result.nombre}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Etapa actual:</span>
                <span className="font-semibold text-[#0061FF]">
                  {result.etapa}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0061FF] transition-all duration-1000"
                  style={{ width: `${result.progreso}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoConsulta;
