import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { Typography, Button } from '@mui/material'

const ErrorDialog = ({ error, onClose }) => (
    <Dialog open={!!error} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Error
        </DialogTitle>
        <DialogContent>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorOutline color="error" />
                {typeof error === 'string' ? error : error?.response?.data?.detail || error?.message || 'An error occurred.'}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Close</Button>
        </DialogActions>
    </Dialog>
)

export default ErrorDialog