import React, { useState } from 'react'
import { useMediaData } from '../hook/usePageData'
import { useParams } from 'react-router'
import { Box, Grid, Typography } from '@mui/material';
import MediaCard from '../components/MediaCard';
import BannerComponent from '../components/Home/BannerComponent';

function CategoryPage() {
    const { id } = useParams();
    const [skip, setSkip] = useState(0);
    const params = {
        categoryId: id,
        limit: 25,
        skip,
        subCategoryId: 'all'
    }
    const { data } = useMediaData(params)
    return (
        <Box sx={{ p: 2, width: '100%' }}>
            {/* Banner */}
            <BannerComponent />

            {/* List of Media */}
            <Box sx={{ mt: 4 }}>
                <Typography component='h2' variant='h5' sx={{ fontWeight: 'bold' }}>Featured Designs</Typography>
                <Box component='div' sx={{ px: 4, mt: 2 }}>
                    <Grid container spacing={2}>
                        {
                            data?.media?.map((item) => (
                                <Grid key={item.id} size={{ xs: 12, sm: 4, md: 3, xl: 2 }} >
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
