import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

const ComingSoon = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={theme => ({
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
                    : 'linear-gradient(135deg, #8B3DFF 0%, #532599 100%)',
                borderRadius: 4,
                p: 4,
                color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : '#fff',
            })}
        >
            <Typography variant="h2" fontWeight="bold" mb={2} sx={{ textAlign: 'center' }}>
                Coming Soon
            </Typography>
            <Typography variant="h6" mb={4} sx={{ textAlign: 'center', maxWidth: 500 }}>
                We're working hard to bring you this feature. Stay tuned for updates!
            </Typography>
            <Button
                variant="contained"
                sx={theme => ({
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.primary.dark,
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        color: '#fff',
                    },
                })}
                onClick={() => navigate(-1)}
            >
                Back to Home
            </Button>
        </Box>
    );
};

export default ComingSoon;
