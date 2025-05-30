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
            <Box sx={{ width: '100%', height: height, overflow: 'hidden' }}>
                <img
                    src={item.image}
                    alt={item.id}
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
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
    )
}

export default MediaCard