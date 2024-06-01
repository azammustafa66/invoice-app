import { ThemeProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'

import App from './App'
import { useStore } from './utils/store'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111'
        }
      }
    }
  }
})

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f4f6f8'
        }
      }
    }
  }
})

export default function ThemeWrapper() {
  const { theme } = useStore()

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}
