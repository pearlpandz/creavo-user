import { Box } from "@mui/material";
import { useEffect, useCallback } from "react";
import { useCategory, useTemplateCategories } from "../hook/usePageData";
import BannerComponent from "../components/Home/BannerComponent";
import TemplateCardList from "../components/Home/TemplateCategory/List";
import CategoryContainer from "../components/CategoryContainer";

const HomePage = () => {
    const { data: templateCategories } = useTemplateCategories();

    const limit = 5;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        // isLoading,
    } = useCategory(limit);

    const allCategories = data?.pages.flatMap(page => page.categories) ?? [];

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
                <CategoryContainer key={item.id} item={item} />
            ))}

            {isFetchingNextPage && <Box sx={{ textAlign: 'center', mt: 2 }}>Loading more...</Box>}
        </Box>
    );
};

export default HomePage;
