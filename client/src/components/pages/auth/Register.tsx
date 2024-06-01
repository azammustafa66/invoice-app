import { Box, Button, Container, TextField, Typography, Link } from '@mui/material'

export default function Register() {
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
        Register
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
        <TextField label='Name' type='text' variant='outlined' fullWidth required sx={{ mb: 2 }} />
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
        <TextField
          label='Confirm Password'
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
          Register
        </Button>
        <Typography variant='body2' sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href='/login' sx={{ color: '#7C5DFA', fontWeight: '500' }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
