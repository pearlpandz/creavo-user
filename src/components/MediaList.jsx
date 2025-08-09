import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import MediaCard from "./MediaCard";
import { updateFrameImage } from "../redux/slices/editor.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useProfile } from "../hook/usePageData";
import { useExpire } from "../hook/useExpire";

const MediaList = ({ data, shouldShow = true, noOfCards = 6 }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: profile } = useProfile();
    const { expireIn } = useExpire(profile)
    const [sliderInstanceRef, slider] = useKeenSlider({
        loop: false,
        mode: "snap",
        slides: {
            perView: noOfCards,
            spacing: 0,
        },
        breakpoints: {
            "(max-width: 1200px)": {
                slides: { perView: 3, spacing: 0 },
            },
            "(max-width: 900px)": {
                slides: { perView: 2, spacing: 0 },
            },
            "(max-width: 600px)": {
                slides: { perView: 1, spacing: 0 },
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

    // Hide arrows on mobile view
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const shouldHideArrows = hideBoth || isMobile;

    useEffect(() => {
        // Re-initialize the slider when slides are ready
        if (data.length > 0 && slider.current) {
            slider.current.update(); // Refresh the instance
        }
    }, [data, slider])

    const handleSelectedImg = (item) => {
        if (!profile?.license) {
            navigate('/subscription')
        } else if (expireIn === 0) {
            navigate('/expired')
        } else {
            dispatch(updateFrameImage(item))
            navigate('/editor')
        }
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', mt: 2 }}>
            {/* Left Arrow */}
            {!shouldHideArrows && !hideLeft && (
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
            {!shouldHideArrows && !hideRight && (
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
            <Box key={data.map(item => item.id).join('-')} ref={sliderInstanceRef} className="keen-slider" sx={{ width: '100%' }}>
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
                                    <MediaCard
                                        item={item}
                                        height={isMobile ? 180 : (noOfCards > 5 ? 120 : 180)}
                                        width='100%'
                                        shouldShow={shouldShow}
                                    />
                                </Box>
                            ))
                        }
                    </>
                ) : (
                    <Typography>No Media Found!</Typography>
                )}
            </Box>
        </Box>
    );
};

export default MediaList;
