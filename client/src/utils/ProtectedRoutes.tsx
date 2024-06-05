import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

import useAuth from '../hooks/useAuth'

interface ProtectedRouteProps {
  children?: JSX.Element
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { handleAuthentication, handlePublicRoutes } = useAuth()
  const location = useLocation()

  useEffect(() => {
    handleAuthentication(location.pathname)
    handlePublicRoutes(location.pathname)
  })

  return children || <Outlet />
}
