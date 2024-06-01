import { Box, Typography, styled } from '@mui/material'

export const PrimaryTypography = styled(Typography)`
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.5px;
`

export const SecondaryTypography = styled(Typography)`
  font-weight: 700;
  font-size: 15px;
  line-height: 15px;
  letter-spacing: -0.25px;
`

export const FormBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`
