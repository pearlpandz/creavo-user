import React from 'react'
import { useEventById, useProfile } from '../hook/usePageData'
import { useNavigate, useParams } from 'react-router'
import { Box, Button, Grid, Typography } from '@mui/material';
import MediaCard from '../components/MediaCard';
import BannerComponent from '../components/Home/BannerComponent';
import { updateFrameImage } from '../redux/slices/editor.slice';
import { useDispatch } from 'react-redux';
import { useExpire } from '../hook/useExpire';

function EventPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: profile } = useProfile();
    const { expireIn } = useExpire(profile)
    const { data: event } = useEventById(id);

    const handleSelectedImg = (img) => {
        if (!profile?.license) {
            navigate('/subscription')
        } else if (expireIn === 0) {
            navigate('/expired')
        } else {
            dispatch(updateFrameImage(img))
            navigate('/editor')
        }
    };

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            {/* Banner */}
            <BannerComponent detail={{ name: event?.name, description: '' }} />

            <Box sx={{ mt: 4 }}>
                <Typography component='h2' variant='h5' sx={{ fontWeight: 'bold' }}>Featured Events</Typography>

                {/* List of Media */}

                <Box component='div' sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        {
                            event?.images?.map((item) => (
                                <Grid key={item.id} size={{ xs: 12, sm: 4, md: 3, xl: 2 }} component='div' onClick={() => handleSelectedImg(item.image)}>
                                    <MediaCard item={item} shouldShow={false} width='100%' height={200} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default EventPage
