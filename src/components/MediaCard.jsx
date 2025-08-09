import { Box, Typography } from '@mui/material'

function MediaCard({ item, shouldShow = true, width, height }) {
    return (
        <Box sx={{
            boxShadow: "1px 1px 6px 0px rgb(0 0 0 / 25%)",
            borderRadius: 2,
            overflow: 'hidden',
            transition: '0.3s',
            width: width,
            '&:hover': {
                boxShadow: "1px 3px 6px 3px rgb(0 0 0 / 30%)",
            },
        }} component='div'>
            <Box sx={{ width: '100%', height: height, overflow: 'hidden', position: 'relative' }}>
                <img
                    src={item.image}
                    alt={item.id}
                    width="100%"
                    height="100%"
                    style={{
                        objectFit: 'cover',
                        position: 'relative',
                        zIndex: 1
                    }}
                    loading="lazy"
                />
                <img
                    src={item.image}
                    alt={item.id}
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
                        zIndex: 0
                    }}
                    loading="lazy"
                />
            </Box>
            {shouldShow && (
                <Box sx={{ p: 1.5 }}>
                    <Typography
                        variant="p"
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
                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                        {item.short_description}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default MediaCard