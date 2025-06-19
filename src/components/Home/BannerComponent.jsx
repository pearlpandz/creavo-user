import { Box, Typography, Button, Stack } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';

const BannerComponent = (params) => {
    const navigate = useNavigate()
    const { title, description } = params;

    const handleRedirection = () => {
        navigate('/editor')
    }

    return (
        <Box
            sx={theme => ({
                background: theme.palette.mode === 'dark' ? 'linear-gradient(to left, #777, #111)' : 'linear-gradient(to right, #8CA2FF, #FF87C5)',
                borderRadius: 2,
                p: { xs: 2, sm: 4 },
                textAlign: 'center',
                color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : '#fff',
                mx: 0,
                my: 2,
                boxShadow: theme.shadows[2]
            })}
            component='div'
        >
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={2}
                sx={theme => ({
                    color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : '#fff',
                })}
            >
                {title}
            </Typography>
            <Typography
                variant="body1"
                mb={4}
                sx={theme => ({
                    color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[100],
                })}
            >
                {description}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                <Button
                    variant="contained"
                    sx={() => ({
                        backgroundColor: '#eee',
                        color: '#222',
                        fontWeight: 'bold',
                        boxShadow: 'none',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#fff',
                            color: '#444'
                        },
                    })}
                    onClick={handleRedirection}
                >
                    Start Designing
                </Button>
                <Button
                    variant="contained"
                    sx={() => ({
                        backgroundColor: '#eee',
                        color: '#222',
                        fontWeight: 'bold',
                        boxShadow: 'none',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#fff',
                            color: '#444'
                        },
                    })}
                    onClick={handleRedirection}
                >
                    Create New
                </Button>
            </Stack>
        </Box>
    );
};

export default React.memo(BannerComponent);
