import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Editor from "../components/Editor";
import { usePageData } from "../hook/usePageData";
import EventList from "../components/EventList";
import MediaContainer from "../components/MediaContainer";


const HomePage = () => {
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today)
    const { data, isLoading } = usePageData(selectedDay);

    useEffect(() => {
        fetch('https://api.unsplash.com/photos/?client_id=xGPW7tpKUYE6kyWR-vOWtpp_ZOUxpAbeH4AdA5Z-tgk')
            .then(res => res.json())
            .then(data => {
                setImages(data);
            });
    }, []);

    const handleSelectedImg = (img) => {
        setSelectedImg(img);
        setShowModal(true);
    }

    return (
        <div style={{ padding: 20 }}>
            <MediaContainer data={data?.media.find(a => a.category?.toLowerCase() === 'trending')} handleSelectedImg={handleSelectedImg} />

            <EventList data={data?.events} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

            {
                data?.media?.filter(a => a.category?.toLowerCase() !== 'trending')?.map((item) => (
                    <MediaContainer key={item.category} title={item.category} data={item} handleSelectedImg={handleSelectedImg} />
                ))
            }

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Editor selectedImg={selectedImg} />
            </Modal>
        </div>
    );
};

export default HomePage;
