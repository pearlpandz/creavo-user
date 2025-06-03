import { Box, Typography, Avatar, Button, Grid, Paper, Divider, Input, TextField, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { usePatchUser } from '../../hook/usePageData';

function ReadOnlyText({ value, readOnly, onChange, name }) {
    return readOnly ? (
        <Typography variant="body1">{value}</Typography>
    ) : (
        <TextField name={name} size='small' value={value} onChange={onChange} />
    );
}

const MyProfile = ({ userDetail }) => {
    const [mode, setMode] = useState('view')
    const [open, setOpen] = useState(false)
    const initialValue = Object.keys(userDetail)?.length > 0 ? {
        first_name: userDetail.first_name,
        last_name: userDetail.last_name,
        mobile_number: userDetail.mobile_number,
        email: userDetail.email
    } : {};
    const [profile, setProfile] = useState(initialValue ?? {})
    const { mutate, isPending } = usePatchUser((updatedUser) => {
        console.log(updatedUser);
        setOpen(true);
        setMode('view')
    });

    const handleChange = (event) => {
        setProfile((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const handleSave = () => {
        const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
        if (userId) {
            mutate({ userId, data: profile });
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
            {/* Profile Card */}
            {/* <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 56, height: 56, mr: 2 }}>{profile.first_name[0]}{profile.last_name[0]}</Avatar>
                    <Box>
                        <Typography fontWeight={600}>{profile.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{profile.first_name} {profile.last_name}</Typography>
                        <Typography variant="body2" color="text.secondary">{profile.license}</Typography>
                    </Box>
                </Box>
                <Button variant="outlined" size="small">✎ Edit</Button>
            </Box>
        </Paper> */}

            {/* Personal Information */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600}>Personal Information</Typography>
                    {
                        mode === 'view' ?
                            <Button variant="outlined" size="small" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} /> Edit</Button> :
                            <Button variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} />{isPending ? 'Saving...' : 'Save'}</Button>
                    }
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={{ display: 'block', mb: 1 }} variant="caption" color="text.secondary">First Name</Typography>
                        <ReadOnlyText name="first_name" readOnly={mode === 'view'} value={profile.first_name} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={{ display: 'block', mb: 1 }} variant="caption" color="text.secondary">Last Name</Typography>
                        <ReadOnlyText name="last_name" readOnly={mode === 'view'} value={profile.last_name} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={{ display: 'block', mb: 1 }} variant="caption" color="text.secondary">Email address</Typography>
                        <ReadOnlyText name="email" readOnly={mode === 'view'} value={profile.email} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Typography sx={{ display: 'block', mb: 1 }} variant="caption" color="text.secondary">Phone</Typography>
                        <ReadOnlyText name="mobile_number" readOnly={mode === 'view'} value={profile.mobile_number} onChange={handleChange} />
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
                    Profile Successfully Updated!
                </Alert>
            </Snackbar>
        </Box>
    )
};

export default MyProfile;
