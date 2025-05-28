import { useMemo, useState } from 'react';
import MediaList from './MediaList';
import { Box, Button, Typography } from '@mui/material';

const LanguageQuoteContainer = ({ data, title = 'Trending', handleSelectedImg }) => {

    const [selectedSubcategory, setSelectedSubcategory] = useState('all');

    const mediaList = useMemo(() => {
        if (data?.subcategories?.length > 0) {
            if (selectedSubcategory?.toLowerCase() !== 'all') {
                const subcategoryData = data.subcategories.find(item => item.name.toLowerCase() === selectedSubcategory.toLowerCase());
                return subcategoryData ? subcategoryData.media : [];
            } else {
                // returning for `All`
                return data.subcategories?.reduce((acc, curr) => {
                    curr.media.forEach((ele) => {
                        if (acc.findIndex(item => item.id === ele.id) === -1) {
                            acc.push(ele)
                        }
                    })
                    return acc;
                }, [])
            }
        } else {
            return data?.media;
        }
    }, [data, selectedSubcategory])

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
                            <Button variant={selectedSubcategory?.toLowerCase() === 'all' ? 'contained' : 'outlined'} size='small' sx={{ borderRadius: 25, textTransform: 'capitalize' }} onClick={handleSelection}>All</Button>
                            {
                                data?.subcategories?.map((item) => (
                                    <Button variant={selectedSubcategory?.toLowerCase() === item?.name?.toLowerCase() ? 'contained' : 'outlined'} size='small' sx={{ borderRadius: 25, textTransform: 'capitalize' }} onClick={handleSelection}>{item.name}</Button>
                                ))
                            }
                        </Box>
                    </>
                )
            }
            <MediaList data={mediaList} handleSelectedImg={handleSelectedImg} shouldShow={false} />
        </Box>
    )
}

export default LanguageQuoteContainer;