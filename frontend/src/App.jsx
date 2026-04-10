import Navbar from './components/Navbar'

import TalentManagement from './components/TalentManagment'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="Nicole Tolve" userRole="Administrador" />

      <main style={{ padding: '15px 40px 40px 40px' }}>
        <TalentManagement />
      </main>
    </div>
  )
}

export default App