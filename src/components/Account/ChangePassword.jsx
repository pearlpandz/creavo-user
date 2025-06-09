import { Box, Typography, Button, Grid, Paper, Divider, Snackbar, Alert, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { useState } from 'react';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useChangePassword } from '../../hook/usePageData';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const InputPassword = (props) => {
    const { name, value, onChange } = props;

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            name={name}
            size="small"
            hiddenLabel
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            }
        // label="Password"
        />
    )
}

const ChangePassword = () => {
    const [open, setOpen] = useState(false)
    const [passwords, setPasswords] = useState({})
    const { mutate, isPending } = useChangePassword(() => {
        setOpen(true);
    });

    const handleChange = (event) => {
        setPasswords((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const handleSave = () => {
        if (passwords.new_password === passwords.confirm_new_password || passwords.new_password !== passwords.old_password) {
            const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
            if (userId) {
                const payload = {
                    userId,
                    data: {
                        old_password: passwords.old_password,
                        new_password: passwords.new_password
                    }
                }
                mutate(payload);
            }
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Box sx={{ mt: 4, p: 2 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600}>Change Password</Typography>
                    <Button variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} />{isPending ? 'Saving...' : 'Save'}</Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={{ display: 'block', mb: 1 }} variant="caption" color="text.secondary">Old Password</Typography>
                        <InputPassword name="old_password" value={passwords.old_password} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={{ display: 'block', mb: 1 }} variant="caption" color="text.secondary">New Password</Typography>
                        <InputPassword name="new_password" value={passwords.new_password} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={{ display: 'block', mb: 1 }} variant="caption" color="text.secondary">Confirm New Password</Typography>
                        <InputPassword name="confirm_new_password" value={passwords.confirm_new_password} onChange={handleChange} />
                    </Grid>
                </Grid>
            </Paper>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Password Successfully Updated!
                </Alert>
            </Snackbar>
        </Box>
    )
};

export default ChangePassword;
