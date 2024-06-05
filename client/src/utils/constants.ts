export const StatusColorsAndBackground: Record<string, string> = {
  paid: '#33D69F',
  pending: '#FF8F00',
  draft: '#373B53'
}

export const cookieOptions = {
  path: '/',
  httpOnly: import.meta.env.VITE_ENV === 'production',
  secure: import.meta.env.VITE_ENV === 'production'
}
