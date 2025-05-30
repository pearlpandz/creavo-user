
import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useSpring, animated } from '@react-spring/web';

export default function MasonryImageList() {
    const [itemHovered, setHovered] = React.useState(false);
    const springProps = useSpring({
        config: { tension: 300, friction: 20 },
        transition: '0.3s'
    });
    const [images, setImages] = React.useState([]);

    React.useEffect(() => {
        // Fetch images from an API or use a static array
        const fetchImages = async () => {
            // Example: Fetching images from a placeholder API
            const response = await fetch('https://picsum.photos/v2/list?page=1&limit=40');
            const data = await response.json();
            const photos = await data.map((item) => item.download_url);
            setImages(photos);
        };

        fetchImages();
    }, [])

    return (
        <Box>
            <ImageList variant="masonry" cols={6} gap={8} sx={{ overflow: 'hidden', width: '100%', m: 0, pt: 1, pl: 1 }}>
                {images.map((item, index) => (
                    <ImageListItem
                        key={index}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ cursor: 'pointer' }}
                    >
                        <animated.img
                            srcSet={item}
                            src={item}
                            alt={item.title}
                            loading="lazy"
                            style={{
                                width: '100%',
                                borderRadius: 8,
                                position: 'relative',
                                zIndex: itemHovered === index ? 2 : 1,
                                ...springProps,
                                transform: itemHovered === index ? 'scale(1.25)' : 'scale(1)',
                                boxShadow: itemHovered === index
                                    ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                                    : '0 2px 8px 0 rgba(0,0,0,0.10)',
                            }}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}