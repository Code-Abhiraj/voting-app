import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import IndexPage from './pages/IndexPage'
import OtpVerify from './pages/OtpVerify'
import OfficersPage from './pages/OfficersPage'
import VotingPage from './pages/VotingPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/OtpVerify" element={<OtpVerify />} />
      <Route path="/Officer/:id" element={<OfficersPage />} />
      <Route path="/VotingPage/:id" element={<VotingPage />} />
    </Routes>
    
  )
}

export default App
