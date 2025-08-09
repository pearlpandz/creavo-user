import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Stack,
    Link,
    Avatar,
} from "@mui/material";
import { red, blue } from "@mui/material/colors";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSubscriptions } from "../hook/usePageData";

const SubscriptionPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { data: plans } = useSubscriptions();

    const handleOpenModal = (plan) => {
        setSelectedPlan(plan);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPlan(null);
    };

    return (
        <Box sx={{ bgcolor: "#f7f8fa", minHeight: "100vh", pb: 5, px: 2, pt: 2 }}>
            <Typography variant="h5" component="h1" fontWeight="bold">Subscriptions</Typography>
            <Typography
                variant="body1"
                component="p"
                fontWeight="medium"
                sx={{ mt: 1, color: "text.secondary" }}
            >
                Unlock premium access to our design tool — download exclusive templates, high-quality images, and custom frames to bring your creativity to life.
            </Typography>
            <Box sx={{ mx: "auto", mt: 5, maxWidth: 1000 }}>
                <Stack spacing={3}>
                    {plans?.map((plan, idx) => (
                        <Card
                            key={idx}
                            sx={{
                                borderRadius: 3,
                                boxShadow: 2,
                                px: 4,
                                py: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <CardContent sx={{ flex: 1, p: 0 }}>
                                <Grid container spacing={5}>
                                    <Grid item sx={{ display: 'flex', flexBasis: 150, flexDirection: 'column' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            PLAN
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            sx={{ whiteSpace: "pre-line" }}
                                        >
                                            {plan.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="caption" color="text.secondary">
                                            PRICE
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 1 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{ color: red[700], fontWeight: 700 }}
                                            >
                                                ₹ {plan.price}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                +GST
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="caption" color="text.secondary">
                                            VALIDITY
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {plan.duration_days}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Stack alignItems="flex-end" spacing={1.5} ml={3}>
                                <Button
                                    variant="text"
                                    disableRipple
                                    sx={{
                                        color: blue[700],
                                        fontWeight: 600,
                                        fontSize: 15,
                                        mb: 1,
                                        textTransform: 'none',
                                        minWidth: 0,
                                        p: 0,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                    onClick={() => handleOpenModal(plan)}
                                >
                                    View Details
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#174ea6",
                                        fontWeight: 700,
                                        fontSize: 16,
                                        borderRadius: 1.5,
                                        px: 3,
                                        py: 1.2,
                                        boxShadow: "none",
                                        "&:hover": { bgcolor: "#174ea6" },
                                    }}
                                >
                                    Buy
                                </Button>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </Box>

            {/* Modal for plan details */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="plan-details-title"
                aria-describedby="plan-details-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        minWidth: 320,
                        maxWidth: 400,
                        outline: 'none',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="plan-details-title" variant="h6" fontWeight={700}>
                            {selectedPlan?.name} Plan Details
                        </Typography>
                        <IconButton aria-label="close" onClick={handleCloseModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {selectedPlan && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Price: <span style={{ color: red[700], fontWeight: 700 }}>₹ {selectedPlan.price}</span> +GST
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Validity: <span style={{ fontWeight: 600 }}>{selectedPlan.duration_days}</span>
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Subscriptions:
                            </Typography>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                <li style={{ fontSize: 15 }}>Trending: {selectedPlan.show_trending ? 'Allow' : 'Not Allowed'}</li>
                                <li style={{ fontSize: 15 }}>Business Category: {selectedPlan.business_cat_count}</li>
                                <li style={{ fontSize: 15 }}>Languages: {selectedPlan.language_cat_count}</li>
                                <li style={{ fontSize: 15 }}>Rated Images to Visible: {selectedPlan.enabled_ratings?.toString()}</li>
                            </ul>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default SubscriptionPage;
