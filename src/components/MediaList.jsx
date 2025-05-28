import {
    Box,
    Typography,
    IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const MediaList = ({ data, handleSelectedImg, shouldShow = true }) => {
    const [translateX, setTranslateX] = useState(0);
    const cardWidth = 300; // px

    // Responsive visibleCards based on screen size
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm')); // width < 600px
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // width >= 600px and < 960px
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // width >= 960px and < 1280px
    const isLg = useMediaQuery(theme.breakpoints.up('lg')); // width >= 1280px

    let visibleCards = 1;
    if (isXs) visibleCards = 1;
    else if (isSm) visibleCards = 2;
    else if (isMd) visibleCards = 4;
    else if (isLg) visibleCards = 6;

    const maxTranslate = data && data.length > visibleCards ? -(cardWidth * (data.length - visibleCards)) : 0;

    const handleNext = () => {
        setTranslateX(prev => {
            const next = prev - cardWidth;
            return next < maxTranslate ? maxTranslate : next;
        });
    };
    const handlePrev = () => {
        setTranslateX(prev => {
            const next = prev + cardWidth;
            return next > 0 ? 0 : next;
        });
    };

    // Responsive card width based on breakpoints
    let responsiveCardWidth = 300;
    if (isXs) responsiveCardWidth = 220;
    else if (isSm) responsiveCardWidth = 260;
    else if (isMd) responsiveCardWidth = 280;
    else if (isLg) responsiveCardWidth = 300;

    const styles = {
        card: {
            width: shouldShow ? responsiveCardWidth : 200,
            // py: 2,
            // m: 1,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.05)' },
        },
        prevButton: {
            position: 'absolute',
            left: 0,
            top: '50%',
            zIndex: 10,
            transform: 'translateY(-50%)',
            background: '#fff',
            boxShadow: 1,
            visibility: 'visible',
            '&:hover': {
                backgroundColor: '#473FC4',
                color: '#fff',
            },
            '&:disabled': {
                visibility: 'hidden',
                pointerEvents: 'none',
            },
        },
        nextButton: {
            position: 'absolute',
            right: 0,
            top: '50%',
            zIndex: 2,
            transform: 'translateY(-50%)',
            background: '#fff',
            boxShadow: 1,
            visibility: 'visible',
            '&:hover': {
                backgroundColor: '#473FC4',
                color: '#fff',
            },
            '&:disabled': {
                visibility: 'hidden',
                pointerEvents: 'none',
            },
        },
    };

    useEffect(() => {
        // Reset translateX when data changes
        setTranslateX(0);
    }, [data]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <IconButton onClick={handlePrev} disabled={translateX === 0} sx={styles.prevButton}>
                <ArrowBackIosNewIcon />
            </IconButton>
            <Box sx={{
                display: 'flex',
                gap: 2,
                py: 2,
                transition: 'transform 0.4s cubic-bezier(.4,1.3,.6,1)',
                transform: `translateX(${translateX}px)`,
                width: cardWidth * visibleCards
            }}>
                {data?.length > 0 ? (
                    data.map((item) => (
                        <Box>
                            <Box
                                key={item.id}
                                sx={styles.card}
                                onClick={() => handleSelectedImg(item.image)}
                            >
                                <Box sx={{ width: '100%', height: shouldShow ? 150 : 200, overflow: 'hidden' }}>
                                    <img
                                        src={item.image}
                                        alt={item.id}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>
                                {shouldShow && (
                                    <Box sx={{ p: 1.5 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontSize: 16,
                                                textTransform: 'capitalize',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                                            {item.short_description}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography>No Media Found!</Typography>
                )}
            </Box>
            <IconButton
                onClick={handleNext}
                sx={styles.nextButton}
                disabled={translateX === maxTranslate}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};

export default MediaList;
