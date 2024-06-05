import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import PieChartIcon from '@mui/icons-material/PieChart'
import { Link, useNavigate } from 'react-router-dom'

import { useStore } from '../../zustand/store'
import { useTheme } from '@mui/material'

function Navbar() {
  const { theme, setTheme, user, isAuthenticated, logout } = useStore()
  const mode = useTheme().palette.mode
  const navigate = useNavigate()
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const settings = [
    { label: 'Profile', path: '/profile' },
    { label: 'Account', path: '/account' },
    { label: 'Dashboard', path: '/invoices' },
    {
      label: 'Logout',
      action: () => {
        logout()
        navigate('/login')
      }
    }
  ]

  return (
    <AppBar position='static' sx={{ backgroundColor: `${mode === 'light' ? '' : '#1e1e1e'}` }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
              width: '100%'
            }}
          >
            <IconButton>
              <Link to={'/'}>
                <PieChartIcon
                  sx={{
                    fontSize: '2rem'
                  }}
                />
              </Link>
            </IconButton>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <IconButton>
                {theme === 'light' ? (
                  <DarkModeIcon onClick={() => setTheme('dark')} />
                ) : (
                  <LightModeIcon onClick={() => setTheme('light')} />
                )}
              </IconButton>

              {isAuthenticated && (
                <Tooltip title='Open settings'>
                  <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                    <Avatar alt={user?.name}>{user?.name?.split('')[0]}</Avatar>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Menu
            sx={{ mt: '45px' }}
            id='menu-appbar'
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.label} onClick={setting.action || handleCloseUserMenu}>
                {setting.path ? (
                  <Link to={setting.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign='center'>{setting.label}</Typography>
                  </Link>
                ) : (
                  <Typography textAlign='center'>{setting.label}</Typography>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
