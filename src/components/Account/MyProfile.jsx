import { Box, Typography, Avatar, Button, Grid, Paper, Divider, Input, TextField, Snackbar, Alert, IconButton } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { usePatchUser } from '../../hook/usePageData';

function ReadOnlyText({ value, readOnly, onChange, name }) {
    return readOnly ? (
        <Typography variant="body1">{value}</Typography>
    ) : (
            <TextField fullWidth={{ xs: true, sm: false }} name={name} size='small' value={value} onChange={onChange} />
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const ActionButtons = useMemo(() => (
        mode === 'view' ?
            isMobile ?
                <IconButton aria-label="Edit" size="large" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16 }} /></IconButton> :
                <Button variant="outlined" size="small" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'top', mt: '-2px' }} /> Edit</Button> :
            isMobile ?
                null :
                <Button variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'top', mt: '-2px' }} />{isPending ? 'Saving...' : 'Save'}</Button>
    ), [handleSave, isPending, mode, isMobile])

    return (
        <Box sx={{ p: { xs: 0, sm: 2 } }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        mb={1}
                        sx={{
                            fontSize: { xs: '1.5rem', sm: '2.125rem' } // Responsive font size
                        }}
                    >
                        Personal Information
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={3}
                        sx={{
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                    >
                        Manage your profile
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    {ActionButtons}
                    {!isMobile && <Button variant="outlined" size="small" onClick={() => setMode('view')}>Cancel</Button>}
                </Box>
            </Box>

            {/* Personal Information */}
            <Paper elevation={0} sx={{ p: { xs: 0, sm: 3 }, borderRadius: 3, border: { xs: 'none', sm: '1px solid #f0f0f0' } }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography
                            sx={{ display: 'block', mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            variant="caption"
                            color="text.secondary"
                        >
                            First Name
                        </Typography>
                        <ReadOnlyText name="first_name" readOnly={mode === 'view'} value={profile.first_name} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography
                            sx={{ display: 'block', mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            variant="caption"
                            color="text.secondary"
                        >
                            Last Name
                        </Typography>
                        <ReadOnlyText name="last_name" readOnly={mode === 'view'} value={profile.last_name} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography
                            sx={{ display: 'block', mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            variant="caption"
                            color="text.secondary"
                        >
                            Email address
                        </Typography>
                        <ReadOnlyText name="email" readOnly={mode === 'view'} value={profile.email} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography
                            sx={{ display: 'block', mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                            variant="caption"
                            color="text.secondary"
                        >
                            Phone
                        </Typography>
                        <ReadOnlyText name="mobile_number" readOnly={mode === 'view'} value={profile.mobile_number} onChange={handleChange} />
                    </Grid>
                </Grid>
            </Paper>

            {isMobile && mode !== 'view' && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Button fullWidth variant="outlined" size="small" onClick={() => setMode('view')}>Cancel</Button>
                    <Button fullWidth variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} />{isPending ? 'Saving...' : 'Save'}</Button>
                </Box>
            )}

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
