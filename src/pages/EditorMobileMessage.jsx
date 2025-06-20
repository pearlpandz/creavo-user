import { Box, Typography, Button } from '@mui/material';
import LaptopImage from '/assets/laptop.jpg'; // Place your image in public/assets or src/assets
import { useNavigate } from 'react-router';

const EditorMobileMessage = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{
            minHeight: 'calc(100vh - 60px)',
            bgcolor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
        }}>
            <Box sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                p: 3,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '100%', sm: 380 },
                maxWidth: 420,
                boxShadow: 1,
            }}>
                <Box
                    component="img"
                    src={LaptopImage}
                    alt="Create on desktop"
                    sx={{ width: '100%', maxWidth: 260, display: 'block', mx: 'auto' }}
                />
            </Box>
            <Typography variant="h6" sx={{ color: '#222', fontWeight: 600, mb: 1, textAlign: 'center' }}>
                Create on desktop
            </Typography>
            <Typography sx={{ color: '#444', opacity: 0.85, mb: 3, textAlign: 'center', maxWidth: 340 }}>
                The editor is not available on mobile devices. Please access it on a desktop or larger screen for the full functionality.
            </Typography>
            <Button
                variant="contained"
                sx={{
                    bgcolor: '#3c3892',
                    color: '#fff',
                    borderRadius: 2,
                    px: 4,
                    py: 1.2,
                    fontWeight: 500,
                    fontSize: 16,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#3c3892' },
                }}
                onClick={() => navigate('/')}
            >
                Go to homepage
            </Button>
        </Box>
    );
};

export default EditorMobileMessage;
