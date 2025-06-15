import MediaList from './MediaList';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Link } from 'react-router';

const MediaContainer = ({ data, title = 'Trending', subCategoryId = 'all', setSelectedSubcategory, media: mediaList = [] }) => {

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
                <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} component={Link} to={`/category/${data?.id}`}>
                    <Typography sx={{ fontSize: 14, mr: 1 }}>View All</Typography>
                    <ArrowForwardIos sx={{ width: 14 }} />
                </Box>
            </Box>
            {
                data?.subcategories?.length > 0 && (
                    <>
                        <Box component='div' sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Button
                                variant='contained'
                                size='small'
                                sx={{
                                    textTransform: 'capitalize',
                                    background: subCategoryId?.toLowerCase() === 'all' ? '#3C3892' : '#DEDCFF',
                                    color: subCategoryId?.toLowerCase() === 'all' ? '#fff' : '#000',
                                    boxShadow: 'none'
                                }}
                                onClick={handleSelection}
                            >All</Button>
                            {
                                data?.subcategories?.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant='contained'
                                        size='small'
                                        sx={{

                                            textTransform: 'capitalize',
                                            background: subCategoryId === item?.id ? '#3C3892' : '#DEDCFF',
                                            color: subCategoryId === item?.id ? '#fff' : '#000',
                                            boxShadow: 'none'
                                        }}
                                        onClick={handleSelection}
                                    >{item.name}</Button>
                                ))
                            }
                        </Box>
                    </>
                )
            }
            <MediaList data={mediaList} noOfCards={7} />
        </Box>
    )
}

export default MediaContainer;