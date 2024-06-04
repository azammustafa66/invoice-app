import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import useAuth from '../hooks/useAuth'
import useFetchRefreshToken from '../hooks/useFetchRefreshToken'

interface ProtectedRouteProps {
  children?: JSX.Element
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isProtectedRoute, handleAuthentication } = useAuth()
  const location = useLocation()
  const { isTokenRefreshError } = useFetchRefreshToken()

  useEffect(() => {
    handleAuthentication(location.pathname)
  }, [location.pathname, handleAuthentication])

  useEffect(() => {
    if (isTokenRefreshError) {
      toast.error('Something went wrong. Please login again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        progress: 0.5
      })
    }
  }, [isTokenRefreshError])

  if (!isAuthenticated() && isProtectedRoute(location.pathname)) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children || <Outlet />
}
