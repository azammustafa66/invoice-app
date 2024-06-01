import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, Register, Login, Navbar, Invoice, Invoices, Error } from './components' // Adjust path if needed

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/invoices' element={<Invoices />} />
        <Route path='/invoice/:id' element={<Invoice />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </Router>
  )
}
