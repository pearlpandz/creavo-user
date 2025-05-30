import MediaList from './MediaList';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Link } from 'react-router';

const MediaContainer = ({ data, title = 'Trending', handleSelectedImg, subCategoryId = 'all', setSelectedSubcategory, media: mediaList = [], pk }) => {

    const handleSelection = (e) => {
        const selected = e.currentTarget.innerText;
        setSelectedSubcategory(selected);
    }

    return (
        <Box component='div' sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography component='h4' sx={() => ({
                        fontSize: 18,
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        color: '#000'
                    })}>
                        {title}
                    </Typography>
                    <Typography component='p' sx={{ fontSize: 13 }}>
                        {data?.description || 'Explore our collection of media.'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} component={Link} to={`/category/${pk}`}>
                    <Typography sx={{ fontSize: 14, mr: 1 }}>View All</Typography>
                    <ArrowForwardIos sx={{ width: 14 }} />
                </Box>
            </Box>
            {
                data?.subcategories?.length > 0 && (
                    <>
                        <Box component='div' sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Button variant={subCategoryId?.toLowerCase() === 'all' ? 'contained' : 'outlined'} size='small' sx={{ borderRadius: 25, textTransform: 'capitalize' }} onClick={handleSelection}>All</Button>
                            {
                                data?.subcategories?.map((item) => (
                                    <Button key={item.id} variant={subCategoryId === item?.id ? 'contained' : 'outlined'} size='small' sx={{ borderRadius: 25, textTransform: 'capitalize' }} onClick={handleSelection}>{item.name}</Button>
                                ))
                            }
                        </Box>
                    </>
                )
            }
            <MediaList data={mediaList} handleSelectedImg={handleSelectedImg} noOfCards={7} pk={pk} />
        </Box>
    )
}

export default MediaContainer;