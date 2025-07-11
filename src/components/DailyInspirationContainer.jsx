import { Box, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { getShortDescription } from '../utils';

const DailyInspirationContainer = ({ data, title = 'Trending', media }) => {
    const navigate = useNavigate();

    if (!data) {
        return null;
    }

    const handleRedirection = (categoryId, subCategoryId) => {
        navigate(`/category/${categoryId}/${subCategoryId}`)
    }

    return (
        <Box component='div' sx={{ mt: 4 }}>
            <Typography component='h4' sx={() => ({
                fontSize: 18,
                textTransform: 'capitalize',
                fontWeight: 'bold',
                color: '#000'
            })}>
                {title}
            </Typography>
            <Typography component='p' sx={{ fontSize: 13 }}>
                {getShortDescription(data?.short_description)}
            </Typography>
            {
                data?.subcategories?.length > 0 && (
                    <Grid container spacing={1} sx={{ mt: 2 }}>
                        {
                            data?.subcategories?.map((item, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3, xl: 2 }} key={item.name} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <Box
                                        component='div'
                                        sx={{
                                        cursor: 'pointer',
                                        backgroundImage: `url(${item.image ?? media?.[index]?.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        height: 160,
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-start',
                                        borderImage: "fill 0 linear-gradient(#0003, #000)",
                                        }}
                                        onClick={() => handleRedirection(data.id, item.id)}
                                    >
                                        <Box component='div' sx={{ p: 2 }}>
                                            <Typography variant='h4' component='h4' sx={{ diplay: 'block', color: '#cba', fontWeight: 600, fontSize: 14 }}>{item.name}</Typography>
                                            <Typography variant='p' component='p' sx={{ color: '#CBC9C9', fontSize: 12 }}>{item.description}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))
                        }
                    </Grid>
                )
            }
        </Box >
    )
}

export default DailyInspirationContainer;