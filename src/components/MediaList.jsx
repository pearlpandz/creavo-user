import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router";
import MediaCard from "./MediaCard";

const MediaList = ({ data, handleSelectedImg, shouldShow = true, noOfCards = 6, pk }) => {
    const navigate = useNavigate();
    const [sliderInstanceRef, slider] = useKeenSlider({
        loop: false,
        mode: "snap",
        slides: {
            perView: noOfCards,
            spacing: 3,
        },
        breakpoints: {
            "(max-width: 1200px)": {
                slides: { perView: 3, spacing: 16 },
            },
            "(max-width: 900px)": {
                slides: { perView: 2, spacing: 16 },
            },
            "(max-width: 600px)": {
                slides: { perView: 1, spacing: 16 },
            },
        },
    });

    const [currentSlide, setCurrentSlide] = useState(0);
    const [perView, setPerView] = useState(8);

    useEffect(() => {
        if (!slider.current) return;
        slider.current.on("slideChanged", (s) => {
            setCurrentSlide(s.track.details.rel);
        });
        setPerView(slider.current.options.slides.perView || 8);
        slider.current.on("updated", (s) => {
            setPerView(s.options.slides.perView || 8);
        });
    }, [slider]);

    const hideLeft = currentSlide === 0;
    const hideRight = slider.current ? (currentSlide >= slider?.current?.track?.details?.maxIdx) : false;
    const hideBoth = data.length <= perView;

    useEffect(() => {
        // Re-initialize the slider when slides are ready
        if (data.length > 0 && slider.current) {
            slider.current.update(); // Refresh the instance
        }
    }, [data, slider])

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', mt: 2 }}>
            {/* Left Arrow */}
            {!hideBoth && !hideLeft && (
                <IconButton
                    onClick={() => slider.current?.prev()}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        zIndex: 10,
                        transform: 'translateY(-50%)',
                        backgroundColor: '#fff',
                        boxShadow: 1,
                        '&:hover': { backgroundColor: '#473FC4', color: '#fff' },
                    }}
                >
                    <ArrowBackIos />
                </IconButton>
            )}

            {/* Right Arrow */}
            {!hideBoth && !hideRight && (
                <IconButton
                    onClick={() => slider.current?.next()}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        zIndex: 10,
                        transform: 'translateY(-50%)',
                        backgroundColor: '#fff',
                        boxShadow: 1,
                        '&:hover': { backgroundColor: '#473FC4', color: '#fff' },
                    }}
                >
                    <ArrowForwardIos />
                </IconButton>
            )}

            {/* Slider */}

            <Box ref={sliderInstanceRef} className="keen-slider" sx={{ width: '100%' }}>
                {data?.length > 0 ? (
                    <>
                        {
                            data.map((item) => (
                                <Box
                                    key={item.id}
                                    className="keen-slider__slide"
                                    onClick={() => handleSelectedImg(item.image)}
                                    sx={{ p: 1, cursor: 'pointer' }}
                                >
                                    <MediaCard item={item} height={noOfCards > 5 ? 120 : 180} width='100%' shouldShow={shouldShow} />
                                </Box>
                            ))
                        }
                        <Box
                            className="keen-slider__slide"
                            onClick={() => { navigate(`/category/${pk}`) }}
                            sx={{ p: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} component='div'>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #444',
                                    width: 24,
                                    height: 24,
                                    borderRadius: 50
                                }} component='div'><ArrowForwardIos sx={{ ml: 0, width: 16 }} /></Box>
                                <Typography sx={{ fontSize: 14 }}>View All</Typography>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Typography>No Media Found!</Typography>
                )}
            </Box>
        </Box>
    );
};

export default MediaList;
