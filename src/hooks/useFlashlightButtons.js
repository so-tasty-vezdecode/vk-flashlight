import { useCallback, useState } from 'react';

const useFlashlightButtons = ({ count }) => {
	const [flashlightButtons, setFlashlightButtonsState] = useState(new Array(count).fill(false));

    const toggleFlashlightButton = useCallback((index, state) => {
        const newState = [...flashlightButtons];
		newState[index] = state;

		setFlashlightButtonsState(newState);

        return newState;
    }, [flashlightButtons]);

    return {
        flashlightButtons,
        toggleFlashlightButton,
    };
}

export default useFlashlightButtons;
