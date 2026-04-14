import { useState } from 'react'
import Navbar from './components/Navbar'
import RegisterTalent from './components/RegisterTalent'
import TalentManagement from './components/TalentManagment'

function App() {
  const [currentPage, setCurrentPage] = useState('search')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName="Nicole Tolve"
        userRole="Administrador"
        activePage={currentPage}
        onNavChange={setCurrentPage}
      />

      <main style={{ padding: '0px 0px 0px' }}>
        {currentPage === 'search' && <TalentManagement />}
        {currentPage === 'register' && <RegisterTalent onBack={() => setCurrentPage('search')} />}
        {currentPage === 'interviews' && (
          <div className="p-8 mt-10 text-center text-gray-500 text-lg">Componente de Entrevistas en Construcción...</div>
        )}
      </main>
    </div>
  )
}

export default App