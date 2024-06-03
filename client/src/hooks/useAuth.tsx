import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

export default function useAuth() {
  const cookies = new Cookies()
  const navigate = useNavigate()

  const protectedRoutes = ['/invoices', '/invoice/:id', '/profile', '/account']

  const isAuthenticated = () => {
    const token = cookies.get('access_token')
    return token ? true : false
  }

  const isProtectedRoute = (pathname: string) => {
    return protectedRoutes.some((route) => {
      // Check if the route is a dynamic route (contains ":")
      if (route.includes(':')) {
        // Create a regex pattern to match dynamic route segments
        const routePattern = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`)
        return routePattern.test(pathname)
      } else {
        return route === pathname
      }
    })
  }

  const handleAuthentication = (pathname: string) => {
    if (!isAuthenticated() && isProtectedRoute(pathname)) {
      navigate('/login', { state: { from: pathname } })
    }
  }

  return { isAuthenticated, isProtectedRoute, handleAuthentication }
}
