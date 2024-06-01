import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  content: string
  confirmButtonText: string
  confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmButtonText,
  confirmButtonColor = 'warning'
}: ConfirmationDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby='confirmation-dialog-title'
    >
      <DialogTitle id='confirmation-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={'info'} variant='contained'>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          color={confirmButtonColor || 'warning'}
          variant={'contained'}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
