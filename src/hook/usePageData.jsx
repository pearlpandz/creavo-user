import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { SETTINGS } from '../constants/settings';
import axios from '../utils/axios-interceptor';

const fetchCategories = async ({ limit, skip }) => {
    const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/categories/list/?limit=${limit}&skip=${skip}`);
    return res.data;
};

const fetchEvents = async (param) => {
    const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/events/${param}/`);
    return res.data;
};

const fetchMedia = async ({ categoryId, limit, skip, subCategoryId = 'all' }) => {
    const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/categories/${categoryId}/media_list/?limit=${limit}&skip=${skip}&subcategoryid=${subCategoryId}`);
    return res.data;
};

export const useCategory = (limit) => {
    return useInfiniteQuery({
        queryKey: ['category'],
        queryFn: async ({ pageParam = 0 }) => {
            return await fetchCategories({ skip: pageParam, limit });
        },
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((acc, page) => acc + (page.categories?.length || 0), 0);
            return loaded < lastPage.total ? loaded : undefined;
        },
        refetchOnWindowFocus: false,
    });
};


export const useMediaData = (params) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['media', params],
        queryFn: async () => {
            const cached = queryClient.getQueryData(['media', params]);
            if (cached) return cached;
            return await fetchMedia(params)
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // 10 mins
        cacheTime: 1000 * 60 * 10, // 10 mins
    });
}

export const useEventData = (param) => {
    const queryClient = useQueryClient();
    const cached = queryClient.getQueryData(['events', param]);

    return useQuery({
        queryKey: ['events', param],
        queryFn: () => fetchEvents(param),
        enabled: cached === undefined, // ❗ Skip queryFn if data is already cached
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // 10 mins
        cacheTime: 1000 * 60 * 10, // 10 mins
        initialData: cached, // ✅ serve cached data immediately
    });
};