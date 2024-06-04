import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer
} from '@mui/material'
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material'

import InvoiceTable from '../Table'
import { useStore } from '../../utils/store'
import Form from '../Form'

export default function Invoices() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { isFormOpen, setFormOpen } = useStore()

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          sx={{
            fontSize: '36px',
            fontWeight: '700',
            lineHeight: '1.25'
          }}
          variant='h1'
        >
          Invoices
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: '500',
                lineHeight: '1.5',
                letterSpacing: '-0.1px'
              }}
              variant='body1'
            >
              Filter by status
            </Typography>
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
              <ArrowDownIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Paid</MenuItem>
              <MenuItem onClick={handleClose}>Pending</MenuItem>
              <MenuItem onClick={handleClose}>Draft</MenuItem>
            </Menu>
          </Box>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#7C5DFA',
              color: 'white',
              textTransform: 'none',
              fontWeight: '600',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: '#5A3BFA'
              }
            }}
            onClick={() => setFormOpen(true)}
          >
            New Invoice
          </Button>
          <Drawer anchor='left' open={isFormOpen} onClose={() => setFormOpen(false)}>
            <Form isNew={true} invoiceId='' />
          </Drawer>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: '13px',
          color: '#888EB0',
          fontWeight: '500',
          lineHeight: '1.5',
          letterSpacing: '-0.1px',
          marginBottom: '2rem'
        }}
        variant='body1'
      >
        There are 7 total invoices
      </Typography>
      <InvoiceTable />
    </Container>
  )
}
