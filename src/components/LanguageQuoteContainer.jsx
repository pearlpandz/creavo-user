import { Box, Button, Typography } from '@mui/material';
import MediaListSquareItems from './MediaListSquareItems';


const LanguageQuoteContainer = ({ data, title = 'Trending', media: mediaList = [], subCategoryId, setSelectedSubcategory }) => {

    const handleSelection = (id) => {
        setSelectedSubcategory(id);
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
                {data?.short_description || 'Explore our collection of media.'}
            </Typography>
            {
                data?.subcategories?.length > 0 && (
                    <>
                        <Box component='div' sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Button
                                variant='contained'
                                size='small'
                                sx={{
                                    textTransform: 'capitalize',
                                    background: subCategoryId === 'all' ? '#3C3892' : '#DEDCFF',
                                    color: subCategoryId === 'all' ? '#fff' : '#000',
                                    boxShadow: 'none'
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
                                            boxShadow: 'none'
                                        }}
                                        onClick={() => handleSelection(item.id)}
                                    >{item.name}</Button>
                                ))
                            }
                        </Box>
                    </>
                )
            }
            <MediaListSquareItems data={mediaList} />
        </Box>
    )
}

export default LanguageQuoteContainer;