import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Container,
    Typography,
    AppBar,
    Toolbar,
    Card,
    Stack,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { SETTINGS } from "../constants/settings";
import axios from "../utils/axios-interceptor";
import { useProfile } from "../hook/usePageData";
import { useNavigate } from "react-router";

export default function PickBusinessCategory({ limit = 1 }) {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const { data: profile } = useProfile();

    useEffect(() => {
        axios.get(SETTINGS.DJANGO_URL + '/api/categories/signup-list/').then((res) => {
            if (res?.data?.length > 0) {
                const businessCategories = res.data.find(a => a.name?.toLowerCase().includes('business'))
                setCategories(businessCategories.subcategories)
            }
        })
    }, [])


    const handleClick = (category) => {
        if (limit == 1) {
            setSelectedCategory([category]);
        } else {
            setSelectedCategory((prev) => prev.push(category))
        }
    }

    const handleContinue = async () => {
        console.log(profile)
        const url = `${SETTINGS.DJANGO_URL}/accounts/users/${profile.id}/`;
        const payload = {
            business_category: selectedCategory?.map(category => category.id)
        }
        try {
            const res = await axios.patch(url, payload)
            if (res.status === 200) {
                console.log('update successfully');
                navigate('/select-language');
            }
        } catch (e) {
            console.log(e)
        }
    }

    const hasSelected = (category) => {
        if (selectedCategory.some(cat => cat.name === category.name)) {
            return true;
        }
        return false;
    }

    return (
        <Container maxWidth="lg">
            <Card
                elevation={0}
                sx={{
                    mt: 8,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "none",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    align="center"
                    gutterBottom
                    sx={{ mb: 1 }}
                >
                    What type of business do you have?
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 3 }}
                >
                    This will help us tailor your experience
                </Typography>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="center"
                    spacing={1.5}
                    sx={{ mb: 4, gap: 1.5 }}
                >
                    {categories?.map((cat) => (
                        <Chip
                            label={cat.name}
                            clickable
                            key={cat.id}
                            onClick={() => handleClick(cat)}
                            sx={{
                                fontWeight: 500,
                                fontSize: 15,
                                px: 2,
                                py: 2,
                                bgcolor: hasSelected(cat) ? "#009688" : "#f5f7fa",
                                color: hasSelected(cat) ? "#fff" : "#222",
                                borderRadius: 10,
                                transition: '0.1s',
                                '&:hover': {
                                    bgcolor: "#009688",
                                    color: "#fff",
                                }
                            }}
                        />
                    ))}
                </Stack>
                <Button
                    variant="contained"
                    sx={{
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 10,
                        boxShadow: "none",
                    }}
                    endIcon={<ArrowForward />}
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </Card>
        </Container>
    );
}
