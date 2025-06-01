import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign'; // MUI icon (use custom if needed)

const styles = {
    card: {
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '16px 0 16px 0',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23232b' : '#fff',
    },
    icon: {
        fontSize: 48,
        color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#2196F3',
    },
    title: {
        fontWeight: 600,
        fontSize: '16px',
        marginBottom: 0.5,
        color: (theme) => theme.palette.mode === 'dark' ? '#eee' : '#222',
    },
    count: {
        fontSize: '13px',
        marginBottom: 0.5,
        color: (theme) => theme.palette.mode === 'dark' ? '#e0e0e0' : '#333',
    },
    gradientButton: {
        background: (theme) =>
            theme.palette.mode === 'dark'
                ? 'linear-gradient(to right, #3a375a, #5a3a4a)'
                : 'linear-gradient(to right, #D4CCFF, #FFD1F5)',
        color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
        fontWeight: 500,
        borderRadius: 3,
        textTransform: 'none',
        padding: '8px 16px',
        width: '100%',
        '&:hover': {
            background: (theme) =>
                theme.palette.mode === 'dark'
                    ? 'linear-gradient(to right, #4a457a, #7a4a6a)'
                    : 'linear-gradient(to right, #C5B8FF, #FFBEEB)',
        },
    },
};

const TemplateCard = ({ item }) => {
    return (
        <Card sx={styles.card}>
            <CardContent sx={{ py: '0 !important', width: '100%' }}>
                <img style={{ height: 40, objectFit: 'contain' }} src={item.image} alt={item.name} />
                <Typography sx={styles.title}>{item.name}</Typography>
                <Typography sx={styles.count}>40 Templates</Typography>
                <Button sx={styles.gradientButton}>Browse Templates</Button>
            </CardContent>
        </Card>
    );
};

export default TemplateCard;
