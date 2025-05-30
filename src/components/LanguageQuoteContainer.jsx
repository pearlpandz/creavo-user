import { Box, Button, Typography } from '@mui/material';
import MediaListSquareItems from './MediaListSquareItems';


const LanguageQuoteContainer = ({ data, title = 'Trending', handleSelectedImg, media: mediaList = [], subCategoryId, setSelectedSubcategory, pk }) => {

    const handleSelection = (e) => {
        const selected = e.currentTarget.innerText;
        setSelectedSubcategory(selected);
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
                {data?.description || 'Explore our collection of media.'}
            </Typography>
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
            <MediaListSquareItems data={mediaList} handleSelectedImg={handleSelectedImg} pk={pk} />
        </Box>
    )
}

export default LanguageQuoteContainer;