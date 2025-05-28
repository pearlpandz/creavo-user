import React, { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import Editor from "../components/Editor";
import { useMediaData } from "../hook/usePageData";
import EventList from "../components/EventList";
import MediaContainer from "../components/MediaContainer";
import { SETTINGS } from "../constants/settings";


const HomePage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [showModal, setShowModal] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const { data: media } = useMediaData();

    const getTemplates = async () => {
        try {
            const response = await fetch(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                setTemplates(data);
                setSelectedTemplate(data[3]);
            } else {
                console.error('Error fetching templates:', data.message);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    }

    useEffect(() => {
        getTemplates();
    }, []);

    const handleSelectedImg = (img) => {
        setSelectedImg(img);
        setShowModal(true);
    }

    const trendingMedia = useMemo(() => {
        if (media?.length > 0) {
            return media?.find(a => a.category?.toLowerCase() === 'trending')
        } else {
            return [];
        }
    }, [media]);

    const groupedMedia = useMemo(() => {
        if (media?.length > 0) {
            return media?.filter(a => a.category?.toLowerCase() !== 'trending')
        } else {
            return [];
        }
    }, [media])

    // if (mediaLoading || eventLoading) {
    //     return (
    //         <div style={{ padding: 20 }}>
    //             <h2>Loading...</h2>
    //         </div>
    //     );
    // }

    return (
        <div style={{ padding: 20 }}>
            <MediaContainer data={trendingMedia} handleSelectedImg={handleSelectedImg} />

            <EventList />

            {
                groupedMedia?.map((item) => (
                    <MediaContainer key={item.category} title={item.category} data={item} handleSelectedImg={handleSelectedImg} />
                ))
            }

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Editor selectedImg={selectedImg} templates={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
            </Modal>
        </div>
    );
};

export default HomePage;
