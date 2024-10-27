import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainRouter from './components/routers/Router'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
axios.defaults.baseURL = "https://report-card-backend-l3id.onrender.com/"
//axios.defaults.baseURL = "http://localhost:3000/"
  return (
    <>
      <MainRouter/>
    </>
  )
}

export default App
