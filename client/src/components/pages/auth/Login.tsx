import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  FormControl,
  Container,
  InputLabel,
  OutlinedInput,
  Alert,
  CircularProgress
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useLogin from '../../../hooks/useLogin'
import { loginValidationSchema } from '../../../utils/validationSchemas'

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginValidationSchema)
  })

  const { onSubmit, errorMessage, successMessage, mutation } = useLogin()

  return (
    <Container
      component='main'
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Typography variant='h4' sx={{ mb: 2, fontWeight: '700' }}>
        Login
      </Typography>
      {errorMessage && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity='success' sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Controller
          name='username'
          control={control}
          defaultValue=''
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Email'
              type='email'
              variant='outlined'
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              sx={{ width: '100%', mb: 2 }}
            />
          )}
        />
        <Controller
          name='password'
          control={control}
          defaultValue=''
          render={({ field, fieldState }) => (
            <FormControl
              variant='outlined'
              sx={{ width: '100%', mb: 2 }}
              error={fieldState.invalid}
            >
              <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
              <OutlinedInput
                {...field}
                id='outlined-adornment-password'
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Password'
              />
              {fieldState.invalid && (
                <Typography variant='caption' color='error'>
                  {fieldState.error?.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
        <Button
          type='submit'
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
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? <CircularProgress size={24} /> : 'Login'}
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
