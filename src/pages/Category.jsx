import React, { useCallback, useEffect, useState } from 'react'
import { useCateogryDetail, useCateogryMediaData, useProfile } from '../hook/usePageData'
import { useExpire } from '../hook/useExpire'
import { useNavigate, useParams } from 'react-router'
import { Box, Button, Grid, Typography } from '@mui/material';
import MediaCard from '../components/MediaCard';
import BannerComponent from '../components/Home/BannerComponent';
import { updateFrameImage } from '../redux/slices/editor.slice';
import { useDispatch } from 'react-redux';

function CategoryPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id, sub = 'all' } = useParams();
    const { data: profile } = useProfile();
    const { expireIn } = useExpire(profile)
    const { data: detail } = useCateogryDetail(id, sub);
    const [subCategoryId, setSelectedSubcategory] = useState(sub ?? 'all');

    const params = {
        categoryId: id,
        limit: 25,
        skip: 0,
        subCategoryId: subCategoryId ?? 'all'
    }
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        // isLoading,
    } = useCateogryMediaData(params)

    const allMedia = data?.pages.flatMap(page => page.media) ?? [];

    const handleSelectedImg = (img) => {
        if (!profile?.license) { // if no license
            if (expireIn === 0) { // if expired
                navigate('/subscription')
            } else { // if not expired
                dispatch(updateFrameImage(img))
                navigate('/editor')
            }
        } else {
            dispatch(updateFrameImage(img))
            navigate('/editor')
        }
    };

    // Scroll handler: only triggers near bottom
    const handleScroll = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;

        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

        if (isNearBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Attach scroll listener
    useEffect(() => {
        const container = document.getElementById('scrollable-container');
        container?.addEventListener('scrollend', handleScroll);
        return () => {
            container?.removeEventListener('scrollend', handleScroll)
        };
    }, [handleScroll]);

    const handleSelection = (id) => {
        setSelectedSubcategory(id);
    }

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            {/* Banner */}
            <BannerComponent detail={detail} />

            <Box sx={{ mt: 4 }}>
                <Typography component='h2' variant='h5' sx={{ fontWeight: 'bold' }}>Featured Designs</Typography>


                {
                    detail?.subcategories?.length > 0 && (
                        <>
                            <Box component='div' className='horizontal-scroll' sx={{ mt: 2, display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                                <Button
                                    variant='contained'
                                    size='small'
                                    sx={{
                                        textTransform: 'capitalize',
                                        background: subCategoryId === 'all' ? '#3C3892' : '#DEDCFF',
                                        color: subCategoryId === 'all' ? '#fff' : '#000',
                                        boxShadow: 'none',
                                        whiteSpace: 'nowrap',
                                        flex: '0 0 auto',
                                    }}
                                    onClick={() => handleSelection('all')}
                                >All</Button>
                                {
                                    detail?.subcategories?.map((item) => (
                                        <Button
                                            key={item.id}
                                            variant='contained'
                                            size='medium'
                                            sx={{

                                                textTransform: 'capitalize',
                                                background: subCategoryId === item?.id ? '#3C3892' : '#DEDCFF',
                                                color: subCategoryId === item?.id ? '#fff' : '#000',
                                                boxShadow: 'none',
                                                whiteSpace: 'nowrap',
                                                flex: '0 0 auto',
                                            }}
                                            onClick={() => handleSelection(item.id)}
                                        >{item.name}</Button>
                                    ))
                                }
                            </Box>
                        </>
                    )
                }

                {/* List of Media */}

                <Box component='div' sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        {
                            allMedia?.map((item) => (
                                <Grid key={item.id} size={{ xs: 12, sm: 4, md: 3, xl: 2 }} component='div' onClick={() => handleSelectedImg(item.image)}>
                                    <MediaCard item={item} shouldShow={true} width='100%' height={200} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default CategoryPage
