import React, { useEffect, useMemo, useState } from 'react'
import { useEventById, useProfile } from '../hook/usePageData'
import { useNavigate, useParams } from 'react-router'
import { Box, Button, Grid, Typography } from '@mui/material';
import MediaCard from '../components/MediaCard';
import BannerComponent from '../components/Home/BannerComponent';
import { updateFrameImage } from '../redux/slices/editor.slice';
import { useDispatch } from 'react-redux';
import { useExpire } from '../hook/useExpire';
import axios from '../utils/axios-interceptor';
import { SETTINGS } from '../constants/settings';

function EventPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: profile } = useProfile();
    const { expireIn } = useExpire(profile)
    const { data: event } = useEventById(id);
    const [fallbackMediaItems, setFallbackMediaItems] = useState([]);

    const sanitizeUrl = (value = '') => value.replace(/`/g, '').trim();

    const detectMediaType = (item, mediaUrl, imageUrl) => {
        const declaredType = item?.type || item?.media_type || '';
        const referenceUrl = (mediaUrl || imageUrl || '').toLowerCase();

        if (declaredType === 'video' || /\.(mp4|webm|mov|m4v|avi)(\?|$)/.test(referenceUrl)) {
            return 'video';
        }

        if (declaredType === 'gif' || /\.gif(\?|$)/.test(referenceUrl)) {
            return 'gif';
        }

        return 'image';
    };

    const normalizeEventMediaItems = (items = [], title = '') => {
        return items.map((item) => {
            const mediaUrl = sanitizeUrl(item?.media || item?.url || '');
            const imageUrl = sanitizeUrl(item?.image || item?.url || '');
            const itemType = detectMediaType(item, mediaUrl, imageUrl);
            const itemUrl = itemType === 'video'
                ? (imageUrl || mediaUrl)
                : (imageUrl || mediaUrl);

            return {
                id: item?.id,
                url: itemUrl,
                type: itemType,
                media_type: itemType,
                media: itemType === 'video' ? itemUrl : undefined,
                image: itemType !== 'video' ? itemUrl : undefined,
                title: item?.title || title,
            };
        }).filter((item) => item.url);
    };

    const primaryMediaItems = useMemo(() => {
        return normalizeEventMediaItems(event?.media || event?.images || [], event?.name);
    }, [event]);

    const eventMediaItems = primaryMediaItems.length > 0 ? primaryMediaItems : fallbackMediaItems;

    useEffect(() => {
        if (!event?.id || !event?.date || primaryMediaItems.length > 0) return;

        let ignore = false;

        const fetchFallbackMedia = async () => {
            try {
                const formattedDate = event.date.split('-').reverse().join('-');
                const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/events/${formattedDate}/`);
                const matchedEvent = res.data?.find((item) => String(item?.id) === String(event.id));
                const normalizedFallbackItems = normalizeEventMediaItems(
                    matchedEvent?.media || matchedEvent?.images || [],
                    matchedEvent?.name || event?.name
                );

                if (!ignore) {
                    setFallbackMediaItems(normalizedFallbackItems);
                }
            } catch {
                if (!ignore) {
                    setFallbackMediaItems([]);
                }
            }
        };

        fetchFallbackMedia();

        return () => {
            ignore = true;
        };
    }, [event, primaryMediaItems.length]);

    const getEventMediaPayload = (item) => ({
        url: item?.url,
        type: item?.type === 'video' ? 'video' : item?.type === 'gif' ? 'gif' : 'image',
    });

    const handleSelectedImg = (item) => {
        const payload = getEventMediaPayload(item);
        if (!profile?.license) { // if no license
            if (expireIn === 0) { // if expired
                navigate('/subscription')
            } else { // if not expired
                dispatch(updateFrameImage(payload))
                navigate('/editor')
            }
        } else {
            dispatch(updateFrameImage(payload))
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
                            eventMediaItems.map((item) => (
                                <Grid key={item.id} size={{ xs: 12, sm: 4, md: 3, xl: 2 }} component='div' onClick={() => handleSelectedImg(item)}>
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
