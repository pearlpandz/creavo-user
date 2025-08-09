import { useEffect, useState } from "react";


export const useExpire = (profile) => {
    const [expireIn, setExpiry] = useState(0);
    const [expireMsg, setExpireMsg] = useState('');

    useEffect(() => {
        if (profile?.license) {
            console.log(profile?.license_details)
            const purchasedDate = profile?.license_details?.purchased_at;
            const joinedDate = new Date(purchasedDate);
            const now = new Date();
            const subscription = profile?.license_details?.subscription;
            const diffTime = Math.max(joinedDate.getTime() + subscription?.duration_days * 24 * 60 * 60 * 1000 - now.getTime(), 0);
            const expireIn = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setExpiry(expireIn)
            setExpireMsg(`Your subscription ends in ${expireIn} days`)
        } else {
            const joinedDate = new Date(profile?.date_joined);
            const now = new Date();
            const diffTime = Math.max(joinedDate.getTime() + 7 * 24 * 60 * 60 * 1000 - now.getTime(), 0);
            const expireIn = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setExpiry(expireIn)
            setExpireMsg(`Your trial ends in ${expireIn} days`)
        }
    }, [profile])

    return { expireIn, expireMsg }
}