import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { mockData, StatusColorsAndBackground } from '../utils/data'

export default function InvoiceTable() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: 'full' }}>
      <TableContainer component={Paper} sx={{ width: '80%', boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label='invoice table'>
          <TableBody>
            {mockData.map((invoice) => (
              <TableRow
                key={invoice.id}
                component={Link}
                to={`/invoice/${invoice.id}`}
                style={{ textDecoration: 'none' }}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.06)'
                  },
                  transition: 'background-color 0.3s'
                }}
              >
                <TableCell component='th' scope='row'>
                  {invoice.id}
                </TableCell>
                <TableCell align='right'>{invoice.paymentDue}</TableCell>
                <TableCell align='right'>{invoice.clientName}</TableCell>
                <TableCell align='right'>{invoice.total}</TableCell>
                <TableCell align='right'>
                  <Button
                    variant='contained'
                    disableElevation
                    sx={{
                      backgroundColor: StatusColorsAndBackground[invoice.status],
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      width: '75px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: StatusColorsAndBackground[invoice.status]
                      }
                    }}
                  >
                    {invoice.status}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
