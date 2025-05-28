import DailyInspirationContainer from './DailyInspirationContainer';
import LanguageQuoteContainer from './LanguageQuoteContainer';
import MediaContainer from './MediaContainer';

function CategoryContainer(props) {
    const { item, handleSelectedImg } = props;

    if (!item || !item.category) {
        return null; // Return null if item or category is not defined
    }

    if (item.category.toLowerCase() === 'daily inspiration') {
        return (
            <DailyInspirationContainer key={item.category} title={item.category} data={item} />
        )
    }

    if (item.category.toLowerCase() === 'language quotes') {
        return (
            <LanguageQuoteContainer key={item.category} title={item.category} data={item} handleSelectedImg={handleSelectedImg} />
        )
    }

    return (
        <MediaContainer key={item.category} title={item.category} data={item} handleSelectedImg={handleSelectedImg} />
    )
}

export default CategoryContainer