import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import { Home, Register, Login, Navbar, Invoice, Invoices, Error } from './components'
import ProtectedRoutes from './utils/ProtectedRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
      cacheTime: Infinity
    }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          <Route element={<ProtectedRoutes />}>
            <Route path='/invoices' element={<Invoices />} />
            <Route path='/invoice/:id' element={<Invoice />} />
            {/* <Route path='/profile' element={<Profile />} /> */}
            {/* <Route path='/account' element={<Account />} /> */}
          </Route>

          <Route path='*' element={<Error />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
