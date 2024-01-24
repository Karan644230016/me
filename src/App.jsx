import { useState } from 'react'
import './App.css'
import ConnectWeb3 from './components/ConnectWeb3'
import AddActivity from './components/addActivity'
function App() {

  return (
    <>
      <header>
        {/* <ConnectWeb3 /> */}
        <AddActivity/>
      </header>
    </>
  )
}

export default App
