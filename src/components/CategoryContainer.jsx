import { useState } from 'react';
import { useMediaData } from '../hook/usePageData';
import DailyInspirationContainer from './DailyInspirationContainer';
import LanguageQuoteContainer from './LanguageQuoteContainer';
import MediaContainer from './MediaContainer';

function CategoryContainer(props) {
    const { item } = props;
    const limit = 15;
    const skip = 0;
    //const [skip, setSkip] = useState(0);
    const [subCategoryId, setSelectedSubcategory] = useState('all');
    const { data } = useMediaData({
        categoryId: item.id,
        limit,
        skip,
        subCategoryId
    });

    if (!item || !item.name) {
        return null; // Return null if item or category is not defined
    }

    if (item.name.toLowerCase() === 'daily inspiration') {
        return (
            <DailyInspirationContainer title={item.name} data={item} media={data?.media} />
        )
    }

    if (item.name.toLowerCase() === 'language quotes') {
        return (
            <LanguageQuoteContainer title={item.name} data={item} media={data?.media} subCategoryId={subCategoryId} setSelectedSubcategory={setSelectedSubcategory} />
        )
    }

    if (!data?.media || data.media.length === 0) {
        return null;
    }
    return (
        <MediaContainer
            title={item.name}
            data={item}
            media={data.media}
            subCategoryId={subCategoryId}
            setSelectedSubcategory={setSelectedSubcategory}
        />
    );
}

export default CategoryContainer