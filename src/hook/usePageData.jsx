import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SETTINGS } from '../constants/settings';
import axios from '../utils/axios-interceptor';


const fetchEvents = async (param) => {
    const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/events/${param}/`);
    return res.data;
};

const fetchMedia = async () => {
    const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/media/grouped/`, { withCredentials: true });
    return res.data;
};

export const useMediaData = () => {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['media'],
        queryFn: async () => {
            const cached = queryClient.getQueryData(['media']);
            if (cached) return cached;
            return await fetchMedia()
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