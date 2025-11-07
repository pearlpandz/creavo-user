// import { Box, Typography } from '@mui/material'

// function MediaCard({ item, shouldShow = true, width, height }) {
//     return (
//         <Box sx={{
//             boxShadow: "1px 1px 6px 0px rgb(0 0 0 / 25%)",
//             borderRadius: 2,
//             overflow: 'hidden',
//             transition: '0.3s',
//             width: width,
//             '&:hover': {
//                 boxShadow: "1px 3px 6px 3px rgb(0 0 0 / 30%)",
//             },
//         }} component='div'>
//             <Box sx={{ width: '100%', height: height, overflow: 'hidden', position: 'relative' }}>
//                 <img
//                     src={item.image}
//                     alt={item.id}
//                     width="100%"
//                     height="100%"
//                     style={{
//                         objectFit: 'cover',
//                         position: 'relative',
//                         zIndex: 1
//                     }}
//                     loading="lazy"
//                 />
//                 <img
//                     src={item.image}
//                     alt={item.id}
//                     width="100%"
//                     height="100%"
//                     style={{
//                         position: 'absolute',
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                         filter: 'blur(20px)',
//                         transform: 'scale(1.1)',
//                         left: 0,
//                         top: 0,
//                         zIndex: 0
//                     }}
//                     loading="lazy"
//                 />
//             </Box>
//             {shouldShow && (
//                 <Box sx={{ p: 1.5 }}>
//                     <Typography
//                         variant="p"
//                         sx={{
//                             fontSize: 14,
//                             whiteSpace: 'nowrap',
//                             overflow: 'hidden',
//                             textOverflow: 'ellipsis',
//                             display: 'inline-block',
//                             maxWidth: '100%',
//                         }}
//                     >
//                         {item.title}
//                     </Typography>
//                     <Typography variant="body2" sx={{ fontSize: 12 }}>
//                         {item.short_description}
//                     </Typography>
//                 </Box>
//             )}
//         </Box>
//     )
// }

// export default MediaCard


import { Box, Typography, IconButton } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined'; // ✅ MUI Icon
import { useRef, useState } from 'react';

function MediaCard({ item, shouldShow = true, width, height }) {
    const isVideo = item.media_type === "video";
    const isGif = item.media_type === "gif";
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTogglePlay = (e) => {
        e.stopPropagation(); // prevent navigation
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <Box
            sx={{
                boxShadow: "1px 1px 6px 0px rgb(0 0 0 / 25%)",
                borderRadius: 2,
                overflow: 'hidden',
                transition: '0.3s',
                width: width,
                '&:hover': {
                    boxShadow: "1px 3px 6px 3px rgb(0 0 0 / 30%)",
                },
                cursor: 'pointer',
                position: 'relative',
            }}
            component='div'
        >
            <Box
                sx={{
                    width: '100%',
                    height: height,
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#000',
                }}
            >
                {isVideo ? (
                    <>
                        {/* VIDEO PREVIEW */}
                        <video
                            ref={videoRef}
                            src={item.media}
                            width="100%"
                            height="100%"
                            style={{
                                objectFit: 'cover',
                                display: 'block',
                            }}
                            preload="metadata"
                            muted
                            loop
                            playsInline
                        />

                        {/* TOP-RIGHT TOGGLE ICON */}
                        <IconButton
                            onClick={handleTogglePlay}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: '#fff',
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                                zIndex: 3,
                            }}
                        >
                            {isPlaying ? (
                                <PauseCircleOutlineIcon sx={{ fontSize: 28 }} />
                            ) : (
                                <PlayCircleOutlineIcon sx={{ fontSize: 28 }} />
                            )}
                        </IconButton>

                        {/* OPTIONAL: Faint Play Indicator in Center When Paused */}
                        {!isPlaying && (
                            <PlayCircleOutlineIcon
                                sx={{
                                    position: 'relative',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: 60,
                                    color: 'rgba(255,255,255,0.3)',
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                    </>
                ) : (
                    <>
                        {/* FOREGROUND IMAGE */}
                        <img
                            src={item.image}
                            alt={item.title || item.id}
                            width="100%"
                            height="100%"
                            style={{
                                objectFit: 'cover',
                                position: 'relative',
                                zIndex: 1,
                            }}
                            loading="lazy"
                        />

                        {/* BLURRED BACKGROUND */}
                        <img
                            src={item.image}
                            alt={item.title || item.id}
                            width="100%"
                            height="100%"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'blur(20px)',
                                transform: 'scale(1.1)',
                                left: 0,
                                top: 0,
                                zIndex: 0,
                            }}
                            loading="lazy"
                        />

                        {/* GIF ICON (TOP-RIGHT) */}
                        {isGif && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: '#5171fdff',
                                    borderRadius: '50%',
                                    width: 30,
                                    height: 30,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 3,
                                }}
                            >
                                <GifBoxOutlinedIcon sx={{ fontSize: 30 }} />
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {shouldShow && (
                <Box sx={{ p: 1.5 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: 14,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                            maxWidth: '100%',
                        }}
                    >
                        {item.title}
                    </Typography>
                    {item.short_description && (
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                            {item.short_description}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default MediaCard;
