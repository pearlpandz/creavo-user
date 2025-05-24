import './MediaList.css';

const MediaList = ({ data, handleSelectedImg }) => {
    return (
        <>
            {
                data?.length > 0 ? 
                data?.map((item) => (
                    <div className="media" key={item.id} onClick={() => handleSelectedImg(item.image)}>
                        <img src={item.image} alt={item.id} />
                    </div>
                )) : (
                    <p>No Media Found!</p>
                )
            }
        </>
    )
}

export default MediaList