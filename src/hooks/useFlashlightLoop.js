import { useCallback, useRef, useState, useEffect } from 'react';

import bridge from '@vkontakte/vk-bridge';

const useFlashlightLoop = ({ flashlightButtonsRef, maxButtonsCount, timeoutMs }) => {
	const [activeFlashlightButton, setActiveFlashlightButton] = useState(null);

    const flashlightTimeout = useRef(null);

    useEffect(() => () => clearTimeout(flashlightTimeout.current), []);

    const getButtonState = useCallback(index => flashlightButtonsRef.current[index], []);

    const changeFlashlightLevel = useCallback(
        async level => await bridge.send("VKWebAppFlashSetLevel", { level }),
        []
    );

    const startFlashing = useCallback(
        async () => {
            const schemeAttribute = document.createAttribute('scheme');
            schemeAttribute.value = 'space_gray';
            document.body.attributes.setNamedItem(schemeAttribute);

            let currentIndex = activeFlashlightButton;

            const updateFlashlight = async () => {
                const nextIndex =
                    currentIndex + 1 >= maxButtonsCount || currentIndex === null
                        ? 0
                        : currentIndex + 1;

                currentIndex = nextIndex;
                setActiveFlashlightButton(nextIndex);

                if (currentIndex === null || getButtonState(currentIndex) !== getButtonState(currentIndex - 1)) {
                    try {
                        await changeFlashlightLevel(
                            Number(getButtonState(currentIndex))
                        );
                    } catch (e) {}
                }

                flashlightTimeout.current = setTimeout(updateFlashlight, timeoutMs);
            }

            flashlightTimeout.current = setTimeout(updateFlashlight, timeoutMs);
        },
        [changeFlashlightLevel, activeFlashlightButton],
    );

    const stopFlashing = useCallback(
        () => {
            clearTimeout(flashlightTimeout.current);

            setActiveFlashlightButton(null);
            changeFlashlightLevel(0);

            const schemeAttribute = document.createAttribute('scheme');
            schemeAttribute.value = 'bright_light';
            document.body.attributes.setNamedItem(schemeAttribute);
        },
        [changeFlashlightLevel],
    );

    return {
        startFlashing,
        stopFlashing,
        activeFlashlightButton,
    };
}

export default useFlashlightLoop;
