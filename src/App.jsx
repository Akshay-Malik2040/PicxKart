import { useState } from 'react'
import NavBar from './components/NavBar'
import Header from './components/Header'
import Body from './components/Body'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=''>
        <NavBar></NavBar>
        <Header></Header>
        <Body></Body>
      </div>
    </>
  )
}

export default App
