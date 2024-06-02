import { useLocation, Navigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth'

type ProtectedRoutesProps = {
  children?: React.ReactNode
}

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { isAuthenticated, isProtectedRoute } = useAuth()
  const { pathname } = useLocation()

  if (isProtectedRoute(pathname) && !isAuthenticated()) {
    return <Navigate to='/login' />
  }

  return <>{children}</>
}
