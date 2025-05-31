import { Box, Typography, Avatar, Button, Grid, Paper, Divider } from '@mui/material';

const profile = {
    name: 'Jack Adams',
    role: 'Product Designer',
    location: 'Los Angeles, California, USA',
    email: 'jackadams@gmail.com',
    phone: '(209) 555-0324',
    bio: 'Product Designer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const MyProfile = () => (
    <Box sx={{ mt: 4, p: 2 }}>
        {/* Profile Card */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <Avatar src={profile.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                    <Box>
                        <Typography fontWeight={600}>{profile.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{profile.role}</Typography>
                        <Typography variant="body2" color="text.secondary">{profile.location}</Typography>
                    </Box>
                </Box>
                <Button variant="outlined" size="small">✎ Edit</Button>
            </Box>
        </Paper>

        {/* Personal Information */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography fontWeight={600}>Personal Information</Typography>
                <Button variant="outlined" size="small">✎ Edit</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">First Name</Typography>
                    <Typography>{profile.name.split(' ')[0]}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Last Name</Typography>
                    <Typography>{profile.name.split(' ')[1]}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Email address</Typography>
                    <Typography>{profile.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography>{profile.phone}</Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Typography variant="caption" color="text.secondary">Bio</Typography>
                    <Typography>{profile.bio}</Typography>
                </Grid>
            </Grid>
        </Paper>
    </Box>
);

export default MyProfile;
