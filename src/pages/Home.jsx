import { Box } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import Modal from "../components/Modal";
import Editor from "../components/Editor";
import { useCategory } from "../hook/usePageData";
import { SETTINGS } from "../constants/settings";
import BannerComponent from "../components/Home/BannerComponent";
import TemplateCardList from "../components/Home/TemplateCategory/List";
import CategoryContainer from "../components/CategoryContainer";

const HomePage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [showModal, setShowModal] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

    const limit = 2;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useCategory(limit);

    const allCategories = data?.pages.flatMap(page => page.categories) ?? [];

    const getTemplates = async () => {
        try {
            const response = await fetch(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/list`);
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
    };

    useEffect(() => {
        getTemplates();
    }, []);

    const handleSelectedImg = (img) => {
        setSelectedImg(img);
        setShowModal(true);
    };

    // Scroll handler: only triggers near bottom
    const handleScroll = useCallback(() => {
        console.log("scrolling"); // debug line
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;

        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

        if (isNearBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Attach scroll listener
    useEffect(() => {
        const container = document.getElementById('scrollable-container');
        container?.addEventListener('scrollend', handleScroll);
        return () => container?.removeEventListener('scrollend', handleScroll);
    }, [handleScroll]);

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            <BannerComponent />
            <TemplateCardList data={allCategories} />

            {allCategories.map((item) => (
                <CategoryContainer key={item.id} item={item} handleSelectedImg={handleSelectedImg} />
            ))}

            {isFetchingNextPage && <Box sx={{ textAlign: 'center', mt: 2 }}>Loading more...</Box>}

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Editor
                    selectedImg={selectedImg}
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                />
            </Modal>
        </Box>
    );
};

export default HomePage;
