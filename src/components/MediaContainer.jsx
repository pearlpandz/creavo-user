import MediaList from './MediaList';
import './MediaContainer.css';
import { useMemo } from 'react';

const MediaContainer = ({ data, title='Trending', handleSelectedImg }) => { 

    const mediaList = useMemo(() => {
        if(data?.subcategories?.length > 0) {
            // returning for `All`
            return data.subcategories?.reduce((acc, curr) => {
                curr.media.forEach((ele) => {
                    if(acc.findIndex(item => item.id === ele.id) === -1) {
                        acc.push(ele)
                    }
                })
                return acc;
            }, [])
        } else {
            return data?.media;
        }
    }, [data])

    console.log(mediaList)

    return (
        <div className="trending-container">
            <div className="title-container">
                <h4>{title}</h4>
            </div>
            {
                data?.subcategories?.length > 0 && (
                    <div className="subcategory-container">
                        <ul>
                            <li key='all'>
                                <button>All</button>
                            </li>
                            {
                                data?.subcategories?.map((item) => (
                                    <li key={item.name}>
                                        <button>{item.name}</button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                )
            }
            <div className="trending">
                <MediaList data={mediaList} handleSelectedImg={handleSelectedImg} />
            </div>
        </div>
    )
}

export default MediaContainer;