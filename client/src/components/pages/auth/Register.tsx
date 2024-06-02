import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormControl,
  Alert,
  CircularProgress
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { registerValidationSchema } from '../../../utils/validationSchemas'
import useRegister from '../../../hooks/useRegister'

export default function Register() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(registerValidationSchema)
  })

  const { onSubmit, errorMessage, successMessage, mutation } = useRegister()

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Container
      component='form'
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 4,
        borderRadius: 2
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant='h4' sx={{ mb: 2, fontWeight: '700' }}>
        Register
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
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Controller
          name='name'
          control={control}
          defaultValue=''
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Name'
              variant='outlined'
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              sx={{ mb: 2 }}
            />
          )}
        />
        <Controller
          name='email'
          control={control}
          defaultValue=''
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label='Email'
              variant='outlined'
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              sx={{ mb: 2 }}
            />
          )}
        />
        <Controller
          name='password'
          control={control}
          defaultValue=''
          render={({ field, fieldState }) => (
            <FormControl variant='outlined' fullWidth error={fieldState.invalid} sx={{ mb: 2 }}>
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
                      onMouseDown={handleMouseDownPassword}
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
        <Controller
          name='confirmPassword'
          control={control}
          defaultValue=''
          render={({ field, fieldState }) => (
            <FormControl variant='outlined' fullWidth error={fieldState.invalid} sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-confirm-password'>
                Confirm Password
              </InputLabel>
              <OutlinedInput
                {...field}
                id='outlined-adornment-confirm-password'
                type={showConfirmPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle confirm password visibility'
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Confirm Password'
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
          {mutation.isLoading ? <CircularProgress size={24} /> : 'Register'}
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
