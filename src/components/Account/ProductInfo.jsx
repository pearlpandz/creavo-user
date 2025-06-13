import { Box, Typography, Avatar, Button, Grid, Paper, Divider, Input, TextField, Snackbar, Alert, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useMutation } from '@tanstack/react-query';
import { SETTINGS } from '../../constants/settings';
import axios from 'axios';

// perform PATCH mutation for the product
const myMutation = async (data) => {
    const response = await axios.patch(`${SETTINGS.DJANGO_URL}/accounts/product/${data.id}/`, data.value, {
        withCredentials: true
    });
    return response;
};

const ProductInfo = ({ productList }) => {
    const [mode, setMode] = useState('view')
    const [open, setOpen] = useState(false)
    const initialValue = productList?.length > 0 ? productList : {};
    const [products, setProducts] = useState(initialValue ?? [])
    const { mutateAsync } = useMutation({ mutationFn: myMutation });


    const handleSave = async () => {
        const promises = [];
        for (let index = 0; index < products.length; index++) {
            const formData = new FormData();
            const product = products[index];
            Object.entries(product).forEach(([key, value]) => {
                if (key !== 'image' && value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            promises.push(mutateAsync({ id: product.id, value: formData }));
        }

        const results = await Promise.allSettled(promises);
        console.log(results);
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

        const id = event.target.name?.split('-')[1];

        // Show the selected image immediately
        const localUrl = URL.createObjectURL(file);

        setProducts((prev) => {
            const existIndex = prev?.findIndex(ele => ele.id == id);
            if (existIndex > -1) {
                prev[existIndex] = { ...prev[existIndex], image: localUrl, media: file, }
                return [...prev]
            } else {
                return [
                    ...prev,
                    {
                        ...prev,
                        image: localUrl,
                        media: file,
                    }
                ]
            }
        });

    }

    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                    <Typography variant="h4" fontWeight={700} mb={1}>Product Details</Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Manage your profile
                    </Typography>
                </Box>
                {
                    mode === 'view' ?
                        <Button variant="outlined" size="small" onClick={() => setMode('edit')}><ModeEditOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} /> Edit</Button> :
                        <Button variant="contained" size="small" onClick={handleSave}><SaveOutlinedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'top', mt: '-2px' }} />Save</Button>
                }
            </Box>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Grid container spacing={2}>
                    {
                        products?.map((product, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                                <Typography sx={styles} variant="caption" color="text.secondary">product {index + 1}</Typography>
                                <img src={product.image} width="100px" height="100px" style={{ objectFit: 'contain', display: 'block', border: '1px solid #d0d0d0', marginBottom: 10 }} />
                                {mode !== 'view' && <input type="file" onChange={handleFileChange} name={`image-${product.id}`} id={`image-${product.id}`} />}
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
                    Products Successfully Updated!
                </Alert>
            </Snackbar>
        </Box>
    )
};

export default ProductInfo;
