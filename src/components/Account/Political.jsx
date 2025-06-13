import { Box, Typography, Avatar, Button, Grid, Paper, Divider, Input, TextField, Snackbar, Alert, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { SETTINGS } from '../../constants/settings';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

function ReadOnlyText({ value, readOnly, onChange, name }) {
    return readOnly ? (
        <Typography variant="body1">{value}</Typography>
    ) : (
        <TextField name={name} size='small' value={value} onChange={onChange} />
    );
}

// perform PATCH mutation for the product
const MutationFn = async (data) => {
    const { url, formData: payload } = data;
    const response = await axios.patch(url, payload, {
        withCredentials: true
    });
    return response;
};

const PoliticalDetails = ({ detail }) => {
    const [mode, setMode] = useState('view')
    const [open, setOpen] = useState(false)
    const initialLeaderObj = Object.keys(detail)?.length > 0 ? {
        leader_name: detail.leader_name,
        leader_designation: detail.leader_designation,
        image: detail.image,
        media: null,
    } : {};
    const [leader, setLeader] = useState(initialLeaderObj ?? {})

    const [party, setParty] = useState(detail?.party?.[0] ?? {})

    const [supporters, setSupporters] = useState(detail?.supporters ?? [])

    const { mutateAsync } = useMutation({ mutationFn: MutationFn });


    const handleSave = async () => {
        const promises = [];

        // Leader
        if (leader) {
            const formData = new FormData();
            Object.entries(leader).forEach(([key, value]) => {
                if (key !== 'image' && value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            const url = `${SETTINGS.DJANGO_URL}/accounts/political/${detail.id}/`
            promises.push(mutateAsync({ url, formData }));
        }

        // Party
        if (party) {
            const formData = new FormData();
            Object.entries(party).forEach(([key, value]) => {
                if (key !== 'image' && value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            const url = `${SETTINGS.DJANGO_URL}/accounts/party/${party.id}/`
            promises.push(mutateAsync({ url, formData }));
        }

        // Supporters 
        for (let index = 0; index < supporters.length; index++) {
            const formData = new FormData();
            const supporter = supporters[index];
            Object.entries(supporter).forEach(([key, value]) => {
                if (key !== 'image' && value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            const url = `${SETTINGS.DJANGO_URL}/accounts/supporter/${supporter.id}/`
            promises.push(mutateAsync({ url, formData }));
        }

        const results = await Promise.allSettled(promises);
        const allFulfilled = results?.every((ele) => ele.status === "fulfilled");
        if (allFulfilled) {
            setOpen(true);
        } else {
            console.log(allFulfilled)
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const styles = { display: 'block', mb: 1, textTransform: 'capitalize' }

    // Leader Change Handlings
    const handleLeaderChange = (event) => {
        setLeader((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    const handleLeaderFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show the selected image immediately
        const localUrl = URL.createObjectURL(file);
        setLeader((prev) => ({
            ...prev,
            image: localUrl,
            media: file,
        }));
    }

    // Party Changes
    const handlePartyChange = (event) => {
        setParty((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }
    const handlePartyFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show the selected image immediately
        const localUrl = URL.createObjectURL(file);
        setParty((prev) => ({
            ...prev,
            image: localUrl,
            media: file,
        }));
    }

    // supporter changes
    const handleSupporterChange = (event) => {
        const name = event.target.name?.split('-')[0];
        const id = event.target.name?.split('-')[1];
        setSupporters((prev) => {
            const existIndex = prev?.findIndex(ele => ele.id == id);
            if (existIndex > -1) {
                prev[existIndex] = { ...prev[existIndex], [name]: event.target.value }
                return [...prev]
            }
        });
    }
    const handleSupporterFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const id = event.target.name?.split('-')[1];

        // Show the selected image immediately
        const localUrl = URL.createObjectURL(file);

        setSupporters((prev) => {
            const existIndex = prev?.findIndex(ele => ele.id == id);
            if (existIndex > -1) {
                prev[existIndex] = { ...prev[existIndex], image: localUrl, media: file, }
                return [...prev]
            }
        });

    }

    return (
        <Box sx={{ mt: 4, p: 2 }}>
            {/* Personal Information */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600}>Political Details</Typography>
                    {
                        mode === 'view' ?
                            <Button variant="outlined" size="small" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} /> Edit</Button> :
                            <Button variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} />Save</Button>
                    }
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600}>Leader Details</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">leader image</Typography>
                        <img src={leader.image} width="100px" height="100px" style={{ objectFit: 'contain', display: 'block', border: '1px solid #d0d0d0', marginBottom: 10 }} />
                        {mode !== 'view' && <input type="file" onChange={handleLeaderFileChange} name="image" id="image" />}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">leader name</Typography>
                        <ReadOnlyText name="leader_name" readOnly={mode === 'view'} value={leader.leader_name} onChange={handleLeaderChange} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">leader designation</Typography>
                        <ReadOnlyText name="leader_designation" readOnly={mode === 'view'} value={leader.leader_designation} onChange={handleLeaderChange} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600}>Party Details</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">Party Logo</Typography>
                        <img src={party.image} width="100px" height="100px" style={{ objectFit: 'contain', display: 'block', border: '1px solid #d0d0d0', marginBottom: 10 }} />
                        {mode !== 'view' && <input type="file" onChange={handlePartyFileChange} name="image" id="image" />}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography sx={styles} variant="caption" color="text.secondary">party name</Typography>
                        <ReadOnlyText name="party_name" readOnly={mode === 'view'} value={party.party_name} onChange={handlePartyChange} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography fontWeight={600}>Supporters</Typography>
                </Box>
                <Grid container spacing={2}>
                    {
                        supporters?.map((supporter) => (
                            <Grid size={{ xs: 12, md: 4 }} key={supporter.id}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }} key={supporter.id}>
                                        <Typography sx={styles} variant="caption" color="text.secondary">Supporter Image</Typography>
                                        <img src={supporter.image} width="100px" height="100px" style={{ objectFit: 'contain', display: 'block', border: '1px solid #d0d0d0', marginBottom: 10 }} />
                                        {mode !== 'view' && <input type="file" onChange={handleSupporterFileChange} name={`image-${supporter.id}`} id={`image-${supporter.id}`} />}
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography sx={styles} variant="caption" color="text.secondary">supporter name</Typography>
                                        <ReadOnlyText name={`supporter_name-${supporter.id}`} readOnly={mode === 'view'} value={supporter.supporter_name} onChange={handleSupporterChange} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))
                    }
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

export default PoliticalDetails;
