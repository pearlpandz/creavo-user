import MediaList from './MediaList';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Link } from 'react-router';
import { getShortDescription } from '../utils';

const MediaContainer = ({ data, title = 'Trending', subCategoryId = 'all', setSelectedSubcategory, media: mediaList = [] }) => {

    const handleSelection = (id) => {
        setSelectedSubcategory(id);
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
                        {getShortDescription(data?.short_description)}
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
                        <Box component='div' className='horizontal-scroll' sx={{ mt: 2, gap: 1, flexWrap: 'nowrap', alignItems: 'center' }}>
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
                                data?.subcategories?.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant='contained'
                                        size='small'
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
            <MediaList data={mediaList} noOfCards={7} />
        </Box>
    )
}

export default MediaContainer;