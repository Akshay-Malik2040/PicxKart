import { useState } from 'react'
import NavBar from './components/NavBar'
import Header from './components/Header'
import Body from './components/Body'

function App() {
  const [searchQuery,setSearchQuery]=useState(null);
  const [hasSearched,setHasSearched]=useState(false);

  const handleSearch=(query)=>{
    setSearchQuery(query);
    setHasSearched(true);
  }

  return (
    <>
      <div className=''>
        <NavBar onSearch={handleSearch}></NavBar>
        <Header onSearch={handleSearch}></Header>
        <Body searchQuery={searchQuery}></Body>
      </div>
    </>
  )
}

export default App
