import { Box, Typography, Avatar, Button, Grid, Paper, Divider, Input, TextField, Snackbar, Alert, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { usePatchCompanyDetails } from '../../hook/usePageData';
import { SETTINGS } from '../../constants/settings';

function ReadOnlyText({ value, readOnly, onChange, name }) {
    return readOnly ? (
        <Typography variant="body1">{value}</Typography>
    ) : (
        <TextField name={name} size='small' value={value} onChange={onChange} />
    );
}

const CompanyDetails = ({ detail }) => {
    const [mode, setMode] = useState('view')
    const [open, setOpen] = useState(false)
    const initialValue = Object.keys(detail)?.length > 0 ? {
        company_name: detail.company_name,
        email: detail.email,
        primary_contact: detail.primary_contact,
        secondary_contact: detail.secondary_contact,
        description: detail.description,
        image: detail.image,
        media: null,
    } : {};
    const [profile, setProfile] = useState(initialValue ?? {})
    const { mutate, isPending } = usePatchCompanyDetails((updatedData) => {
        console.log(updatedData);
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
        if (detail.id) {
            const formData = new FormData();
            Object.entries(profile).forEach(([key, value]) => {
                if (key !== 'image' && value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            mutate({ id: detail.id, data: formData });
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const styles = { display: 'block', mb: 1, textTransform: 'capitalize' }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show the selected image immediately
        const localUrl = URL.createObjectURL(file);
        setProfile((prev) => ({
            ...prev,
            image: localUrl,
            media: file,
        }));
    }

    return (
        <Box sx={{ mt: 4, p: 2 }}>
            {/* Personal Information */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600}>Company Details</Typography>
                    {
                        mode === 'view' ?
                            <Button variant="outlined" size="small" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} /> Edit</Button> :
                            <Button variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} />{isPending ? 'Saving...' : 'Save'}</Button>
                    }
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">logo</Typography>
                        <img src={profile.image} width="100px" height="100px" style={{ objectFit: 'contain', display: 'block', border: '1px solid #d0d0d0', marginBottom: 10 }} />
                        {mode !== 'view' && <input type="file" onChange={handleFileChange} name="image" id="image" />}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">company name</Typography>
                        <ReadOnlyText name="company_name" readOnly={mode === 'view'} value={profile.company_name} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">email</Typography>
                        <ReadOnlyText name="email" readOnly={mode === 'view'} value={profile.email} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">primary contact number</Typography>
                        <ReadOnlyText name="primary_contact" readOnly={mode === 'view'} value={profile.primary_contact} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">secondary contact</Typography>
                        <ReadOnlyText name="secondary_contact" readOnly={mode === 'view'} value={profile.secondary_contact} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">description</Typography>
                        {
                            mode === 'view' ?
                                <Typography>{profile.description}</Typography> :
                                <TextareaAutosize style={{ minWidth: 300, width: '100%', resize: 'none' }} minRows={3} name="description" readOnly={mode === 'view'} value={profile.description} onChange={handleChange} />
                        }
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
                    Company Details Successfully Updated!
                </Alert>
            </Snackbar>
        </Box>
    )
};

export default CompanyDetails;
