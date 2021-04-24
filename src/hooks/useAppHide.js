import { useEffect } from 'react';

import bridge from '@vkontakte/vk-bridge';

const useAppHide = (callback) => {
    useEffect(() => {
        const listener = ({ detail }) => {
            if (detail.type === 'VKWebAppViewHide') {
                callback();
            }
        }

        bridge.subscribe(listener);

        return () => bridge.unsubscribe(listener);
    }, []);
}

export default useAppHide;
