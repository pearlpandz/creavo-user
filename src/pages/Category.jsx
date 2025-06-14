import React, { useCallback, useEffect } from 'react'
import { useCateogryMediaData, useTemplates } from '../hook/usePageData'
import { useParams } from 'react-router'
import { Box, Grid, Typography } from '@mui/material';
import MediaCard from '../components/MediaCard';
import BannerComponent from '../components/Home/BannerComponent';

function CategoryPage() {
    useTemplates();
    const { id } = useParams();

    const params = {
        categoryId: id,
        limit: 25,
        skip: 0,
        subCategoryId: 'all'
    }
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useCateogryMediaData(params)

    const allMedia = data?.pages.flatMap(page => page.media) ?? [];

    const handleSelectedImg = (img) => {
        // update this image to redux, so that page can access it
        // dispatch(updatedFrameImage(img));
        console.log(img)
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

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            {/* Banner */}
            <BannerComponent
                title="Create Stunning Posters in Just a Few Clicks"
                description="Bring your ideas to life with our intuitive editor. Fast, flexible, and designer-approved."
            />

            {/* List of Media */}
            <Box sx={{ mt: 4 }}>
                <Typography component='h2' variant='h5' sx={{ fontWeight: 'bold' }}>Featured Designs</Typography>
                <Box component='div' sx={{ px: 4, mt: 2 }}>
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
