import { Cookies } from 'react-cookie'

export default function useAuth() {
  const cookies = new Cookies()

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

  return { isAuthenticated, isProtectedRoute }
}
