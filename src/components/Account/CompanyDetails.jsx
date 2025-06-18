import { Box, Typography, Avatar, Button, Grid, Paper, Divider, Input, TextField, Snackbar, Alert, TextareaAutosize, IconButton } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
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

const CompanyDetails = ({ detail, isEditorView = false }) => {
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

    const handleSave = useCallback(async () => {
        if (detail.id) {
            const formData = new FormData();
            Object.entries(profile).forEach(([key, value]) => {
                if (key !== 'image' && value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            await mutate({ id: detail.id, data: formData });
        }
    }, [detail.id, mutate, profile])

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

    const paperStyle = { p: 3, borderRadius: 3, border: '1px solid #f0f0f0' };

    const editorPaerStyle = { background: 'transparent' }

    const ActionButtons = useMemo(() => (
        mode === 'view' ?
            isEditorView ?
                <IconButton aria-label="Edit" size="large" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16 }} /></IconButton> :
                <Button variant="outlined" size="small" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'top', mt: '-2px' }} /> Edit</Button> :
            isEditorView ?
                null :
                <Button variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'top', mt: '-2px' }} />{isPending ? 'Saving...' : 'Save'}</Button>
    ), [handleSave, isPending, mode, isEditorView])

    return (
        <Box sx={{ p: isEditorView ? 0 : 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                    <Typography variant="h4" fontWeight={700} mb={isEditorView ? '0 !important' : 1}>Company Details</Typography>
                    {!isEditorView && <Typography variant="body2" color="text.secondary" mb={3}>
                        Manage your profile
                    </Typography>}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    {ActionButtons}
                    {!isEditorView && <Button variant="outlined" size="small" onClick={() => setMode('view')}>Cancel</Button>}
                </Box>
            </Box>

            {/* Personal Information */}
            <Paper elevation={0} sx={isEditorView ? editorPaerStyle : paperStyle}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">logo</Typography>
                        <img src={profile.image} width="100px" height="100px" style={{ objectFit: 'contain', display: 'block', border: '1px solid #d0d0d0', marginBottom: 10 }} />
                        {mode !== 'view' && <input type="file" onChange={handleFileChange} name="image" id="image" />}
                    </Grid>
                    <Grid size={{ xs: 12, sm: isEditorView ? 12 : 6, md: isEditorView ? 12 : 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">company name</Typography>
                        <ReadOnlyText name="company_name" readOnly={mode === 'view'} value={profile.company_name} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: isEditorView ? 12 : 6, md: isEditorView ? 12 : 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">email</Typography>
                        <ReadOnlyText name="email" readOnly={mode === 'view'} value={profile.email} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: isEditorView ? 12 : 6, md: isEditorView ? 12 : 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">primary contact number</Typography>
                        <ReadOnlyText name="primary_contact" readOnly={mode === 'view'} value={profile.primary_contact} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: isEditorView ? 12 : 6, md: isEditorView ? 12 : 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">secondary contact</Typography>
                        <ReadOnlyText name="secondary_contact" readOnly={mode === 'view'} value={profile.secondary_contact} onChange={handleChange} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: isEditorView ? 12 : 6, md: isEditorView ? 12 : 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">description</Typography>
                        {
                            mode === 'view' ?
                                <Typography>{profile.description}</Typography> :
                                <TextareaAutosize style={{ maxWidth: 300, width: '100%', resize: 'none', padding: '8.5px 14px', background: 'transparent', fontSize: 16 }} minRows={3} name="description" readOnly={mode === 'view'} value={profile.description} onChange={handleChange} />
                        }
                    </Grid>
                </Grid>
            </Paper>

            {isEditorView && mode !== 'view' && (
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
                    Company Details Successfully Updated!
                </Alert>
            </Snackbar>
        </Box>
    )
};

export default CompanyDetails;
