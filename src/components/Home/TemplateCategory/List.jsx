import React from 'react'
import TemplateCard from './Single'
import { Box, Grid, Typography } from '@mui/material'

function TemplateCardList() {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                variant='h4'
                component='h4'
                sx={() => ({
                    fontSize: 18,
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    color: '#000'
                })}
            >
                Template Categories
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }} >
                {
                    new Array(10).fill(0).map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3, xl: 2 }} key={index}>
                            <TemplateCard />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>

    )
}

export default TemplateCardList