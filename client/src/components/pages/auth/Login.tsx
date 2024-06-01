import { Box, Button, Container, TextField, Typography, Link } from '@mui/material'

export default function Login() {
  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        boxShadow: 3,
        padding: 4,
        borderRadius: 2
      }}
    >
      <Typography variant='h4' sx={{ mb: 2, fontWeight: '700' }}>
        Login
      </Typography>
      <Box
        component='form'
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <TextField
          label='Email'
          type='email'
          variant='outlined'
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label='Password'
          type='password'
          variant='outlined'
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button
          variant='contained'
          fullWidth
          sx={{
            backgroundColor: '#7C5DFA',
            color: 'white',
            fontWeight: '600',
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: '#5A3BFA'
            },
            mb: 2
          }}
        >
          Login
        </Button>
        <Typography variant='body2' sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href='/register' sx={{ color: '#7C5DFA', fontWeight: '500' }}>
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
