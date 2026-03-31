import { useState } from 'react'
import NavBar from './components/NavBar'
import Header from './components/Header'
import Body from './components/Body'

function App() {
  const [searchQuery, setSearchQuery] = useState(null);
  const [mediaType, setMediaType] = useState('photos'); // 'photos' | 'videos'

  const handleSearch = (query) => {
    setSearchQuery(query);
  }

  return (
    <div className="min-h-screen text-slate-800 relative pb-20">
      <NavBar mediaType={mediaType} setMediaType={setMediaType} onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header onSearch={handleSearch} />
        <Body searchQuery={searchQuery} mediaType={mediaType} />
      </main>
    </div>
  )
}

export default App
