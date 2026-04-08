import Navbar from './components/Navbar'
import TalentSearch from './components/TalentSearch'
import TalentTable from './components/TalentTable'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName="Nicole Tolve" userRole="Administrador" />

      <main style={{ padding: '15px 40px 40px 40px' }}>
        <TalentSearch />
        <TalentTable />

        {/* Aquí podrías poner luego la lista de resultados */}
      </main>
    </div>
  )
}

export default App