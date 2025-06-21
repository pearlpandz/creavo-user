import { Box, Typography, Button, Grid, Paper, Divider, Link, Dialog } from '@mui/material';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Subscription = ({ detail }) => {
    const [showLicense, setShowLicense] = useState(false);
    const distributor = detail?.issued_to_distributor ? detail?.issued_to_distributor?.name : detail?.issued_to_master_distributor?.name;
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <Box sx={{ p: { xs: 0, sm: 2 } }}>
            <Typography
                variant="h4"
                fontWeight={700}
                mb={1}
                sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
            >
                Subscription
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                mb={3}
                sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
            >
                Manage your subscription
            </Typography>

            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Typography fontWeight={600} mb={2} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Current Subscription
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            Plan
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {detail?.subscription?.name}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            Distributor
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {distributor}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            License Code
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ letterSpacing: 2, mr: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                                {showLicense
                                    ? detail?.code
                                    : detail?.code
                                        ? `${'*'.repeat(Math.max(0, detail.code.length - 4))}${detail.code.slice(-4)}`
                                        : ''
                                }
                            </Typography>
                            {detail?.code && <Button
                                onClick={() => setShowLicense(v => !v)}
                                size="small"
                                sx={{ minWidth: 0, p: 0.5 }}
                                aria-label={showLicense ? 'Hide License Code' : 'Show License Code'}
                            >
                                {showLicense ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </Button>}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Typography fontWeight={600} mb={2} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                    Usage
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            Overall downloads
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {detail?.overall_downloads ?? 0}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            Today Downloads
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {detail?.day_downloads ?? 0}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            Remaining
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            {detail?.day_downloads ? (3 - detail?.day_downloads) : 3}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12 }}>
                        <Typography fontWeight={600} mb={0.5} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            Unlock all features with Diamond
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            Get unlimited downloads, priority support, and more.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setOpenDialog(true)}
                        >
                            Upgrade to Diamond
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Popup Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <Box sx={{ p: 3, minWidth: 300 }}>
                    <Typography variant="h6" mb={1} sx={{ fontSize: { xs: '1.15rem', sm: '1.25rem' } }}>
                        Contact Required
                    </Typography>
                    <Typography variant="body2" mb={2} sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                        Please contact your distributor or admin (<Link href="mailto:sales@creavo.in">sales@creavo.in</Link>) to upgrade your subscription.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenDialog(false)}
                        fullWidth
                    >
                        OK
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}

export default Subscription;
