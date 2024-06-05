import { useNavigate } from 'react-router-dom'

import { useStore } from '../zustand/store'

export default function useAuth() {
  const navigate = useNavigate()
  const { isAuthenticated } = useStore()

  const protectedRoutes = ['/invoices', '/invoice/:id', '/profile', '/account']
  const publicRoutes = ['/login', '/register']

  const isProtectedRoute = (pathname: string) => {
    return protectedRoutes.some((route) => {
      if (route.includes(':')) {
        const routePattern = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`)
        return routePattern.test(pathname)
      } else {
        return route === pathname
      }
    })
  }

  const handlePublicRoutes = (pathname: string) => {
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      return navigate('/invoices', { replace: true })
    }
  }

  const handleAuthentication = (pathname: string) => {
    if (!isAuthenticated && isProtectedRoute(pathname)) {
      return navigate('/login', { state: { from: pathname }, replace: true })
    }
  }

  return { handleAuthentication, handlePublicRoutes }
}
