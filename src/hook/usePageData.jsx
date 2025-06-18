import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { SETTINGS } from '../constants/settings';
import axios from '../utils/axios-interceptor';

const fetchTemplates = async (category) => {
    const res = await axios.get(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/list/${category}`);
    return res.data;
};

const fetchTemplate = async (templateId) => {
    const res = await axios.get(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/${templateId}`);
    return res.data;
};

const fetchTemplateCategories = async () => {
    const res = await axios.get(`${SETTINGS.DJANGO_URL}/frames/frametypes/list/`);
    return res.data;
};

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

export const useTemplateCategories = () => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['template-categories'],
        queryFn: async () => {
            const cached = queryClient.getQueryData(['template-categories']);
            if (cached) return cached;
            return await fetchTemplateCategories()
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // 10 mins
        cacheTime: 1000 * 60 * 10, // 10 mins
    });
};

// useTemplates for editor
export const useTemplates = (category, options = {}) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['templates', category],
        queryFn: async () => {
            const cached = queryClient.getQueryData(['templates', category]);
            if (cached) return cached;
            return await fetchTemplates(category)
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // 10 mins
        cacheTime: 1000 * 60 * 10, // 10 mins
        ...options,
    });
};

// useTemplateDetails for editor
export const useTemplateDetail = (templateId, options = {}) => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['template', templateId],
        queryFn: async () => {
            const cached = queryClient.getQueryData(['template', templateId]);
            if (cached) return cached;
            return await fetchTemplate(templateId)
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // 10 mins
        cacheTime: 1000 * 60 * 10, // 10 mins
        ...options,
    });
};

// using this hook in homepage - infinite scroll for category section loading
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
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchOnMount: false,   // Don't refetch on component mount if data is fresh
        staleTime: Infinity,     // Data considered fresh forever (while app is running)
        cacheTime: 1000 * 60 * 5, // Cache kept for 5min
    });
};

// used this hook in homepage caetgory media
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

// used this hook in category page
export const useCateogryMediaData = ({ categoryId, limit, subCategoryId }) => {
    return useInfiniteQuery({
        queryKey: ['category', categoryId, subCategoryId],
        queryFn: async ({ pageParam = 0 }) => {
            return await fetchMedia({ categoryId, skip: pageParam, limit, subCategoryId });
        },
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((acc, page) => acc + (page.media?.length || 0), 0);
            return loaded < lastPage.total ? loaded : undefined;
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchOnMount: false,   // Don't refetch on component mount if data is fresh
        staleTime: Infinity,     // Data considered fresh forever (while app is running)
        cacheTime: 1000 * 60 * 5, // Cache kept for 5min
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

const fetchProfile = async () => {
    const res = await axios.get(`${SETTINGS.DJANGO_URL}/accounts/users/profile/`);
    return res.data;
};

// useTemplateDetails for editor
export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10, // 10 mins
        cacheTime: 1000 * 60 * 10, // 10 mins
    });
};

const patchUser = async (userId, data) => {
    const response = await axios.patch(`${SETTINGS.DJANGO_URL}/accounts/users/${userId}/`, data);
    return response.data;
};

export const usePatchUser = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }) => patchUser(userId, data),
        onSuccess: (data) => {
            // Optional: invalidate or update cache
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            if (onSuccessCallback) {
                onSuccessCallback(data); // trigger state update from component
            }
        },
    });
};

const changePassword = async (userId, data) => {
    const response = await axios.post(`${SETTINGS.DJANGO_URL}/accounts/users/${userId}/changepassword/`, data);
    return response.data;
};

export const useChangePassword = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }) => changePassword(userId, data),
        onSuccess: (data) => {
            // Optional: invalidate or update cache
            queryClient.invalidateQueries({ queryKey: ['user'] });
            if (onSuccessCallback) {
                onSuccessCallback(data); // trigger state update from component
            }
        },
    });
};

const patchCompanyDetails = async (id, data) => {
    const response = await axios.patch(`${SETTINGS.DJANGO_URL}/accounts/companydetails/${id}/`, data);
    return response.data;
};

export const usePatchCompanyDetails = (onSuccessCallback) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => patchCompanyDetails(id, data),
        onSuccess: (data) => {
            // Invalidate profile and user cache to fetch latest data
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            if (onSuccessCallback) {
                onSuccessCallback(data); // trigger state update from component
            }
        },
    });
};