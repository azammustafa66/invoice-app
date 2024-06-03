import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface ProtectedRouteProps {
  children?: JSX.Element // Ensure children are optional but accepted
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isProtectedRoute, handleAuthentication } = useAuth()
  const location = useLocation()

  useEffect(() => {
    handleAuthentication(location.pathname)
  }, [location, handleAuthentication])

  if (!isAuthenticated() && isProtectedRoute(location.pathname)) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children || <Outlet />
}
