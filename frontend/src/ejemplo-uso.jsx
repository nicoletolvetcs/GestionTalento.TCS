import { InterviewForm } from './components/InterviewForm';

function InterviewPage() {
  // Función para manejar el retorno
  const handleBack = () => {
    console.log('Volviendo a búsqueda...');
    // Aquí puedes navegar a otra página o mostrar otro componente
  };

  // Función para guardar los datos
  const handleSave = (datosEntrevista) => {
    console.log('Datos guardados:', datosEntrevista);
    /*
    datosEntrevista contiene:
    {
      observaciones: string,
      puntuacionTecnica: number,
      puntuacionComunicacion: number,
      puntuacionInteres: number,
      dictamen: string,
      talentoId: string
    }
    */
    
    // Aquí puedes enviar los datos a una API o guardarlos
  };

  // Array de talentos (candidatos)
  const talents = [
    {
      id: "1",
      nombre: "Ana",
      apellido: "García",
      area: "Desarrollo Frontend"
    },
    {
      id: "2", 
      nombre: "Carlos",
      apellido: "López",
      area: "Backend"
    },
    {
      id: "3",
      nombre: "María",
      apellido: "Rodríguez",
      area: "UX/UI Design"
    }
  ];

  return (
    <InterviewForm
      onBack={handleBack}
      talents={talents}
      onSave={handleSave}
    />
  );
}

export default InterviewPage;
