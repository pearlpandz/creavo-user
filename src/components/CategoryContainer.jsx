import { useState } from 'react';
import { useMediaData } from '../hook/usePageData';
import DailyInspirationContainer from './DailyInspirationContainer';
import LanguageQuoteContainer from './LanguageQuoteContainer';
import MediaContainer from './MediaContainer';

function CategoryContainer(props) {
    const { item, handleSelectedImg } = props;
    const limit = 15;
    const skip = 0;
    //const [skip, setSkip] = useState(0);
    const [subCategoryId, setSelectedSubcategory] = useState('all');
    const { data } = useMediaData({
        categoryId: item.id,
        limit,
        skip,
        subCategoryId: 'all'
    });

    if (!item || !item.name) {
        return null; // Return null if item or category is not defined
    }

    if (item.name.toLowerCase() === 'daily inspiration') {
        return (
            <DailyInspirationContainer pk={item.id} title={item.name} data={item} media={data?.media} />
        )
    }

    if (item.name.toLowerCase() === 'language quotes') {
        return (
            <LanguageQuoteContainer pk={item.id} title={item.name} data={item} handleSelectedImg={handleSelectedImg} media={data?.media} subCategoryId={subCategoryId} setSelectedSubcategory={setSelectedSubcategory} />
        )
    }

    return (
        <MediaContainer pk={item.id} title={item.name} data={item} handleSelectedImg={handleSelectedImg} media={data?.media} subCategoryId={subCategoryId} setSelectedSubcategory={setSelectedSubcategory} />
    )
}

export default CategoryContainer