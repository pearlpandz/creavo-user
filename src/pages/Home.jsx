import { Box } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import Modal from "../components/Modal";
import Editor from "../components/Editor";
import { useCategory, useTemplateCategories } from "../hook/usePageData";
import { SETTINGS } from "../constants/settings";
import BannerComponent from "../components/Home/BannerComponent";
import TemplateCardList from "../components/Home/TemplateCategory/List";
import CategoryContainer from "../components/CategoryContainer";

const HomePage = () => {
    const { data: templateCategories } = useTemplateCategories();
    const [showModal, setShowModal] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

    const limit = 5;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useCategory(limit);

    const allCategories = data?.pages.flatMap(page => page.categories) ?? [];

    const handleSelectedImg = (img) => {
        setSelectedImg(img);
        setShowModal(true);
    };

    // Scroll handler: only triggers near bottom
    const handleScroll = useCallback(() => {
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
        return () => {
            container?.removeEventListener('scrollend', handleScroll)
        };
    }, [handleScroll]);

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            <BannerComponent
                title="Create Stunning Posters in Just a Few Clicks"
                description="Bring your ideas to life with our intuitive editor. Fast, flexible, and designer-approved."
            />
            <TemplateCardList data={templateCategories} />

            {allCategories.map((item) => (
                <CategoryContainer key={item.id} item={item} handleSelectedImg={handleSelectedImg} />
            ))}

            {isFetchingNextPage && <Box sx={{ textAlign: 'center', mt: 2 }}>Loading more...</Box>}

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Editor selectedImg={selectedImg} />
            </Modal>
        </Box>
    );
};

export default HomePage;
