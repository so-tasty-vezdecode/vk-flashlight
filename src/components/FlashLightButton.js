import React from 'react';

import { Button } from "@vkontakte/vkui";
import { Icon20LightbulbOutline } from '@vkontakte/icons';

const FlashLightButton = ({ state, onChange, isActive }) => {
    return (
        <Button
            style={{
                padding: 0,
                borderRadius: '50%',
                width: 36,
                height: 36,
                backgroundColor: state ? 'yellow' : '#efefef',
                transform: `scale(${isActive ? 1.2 : 1})`,
                transition: 'all 0.2s ease-in-out',
            }}
            before={<Icon20LightbulbOutline width={16} height={16} fill={state ? '#222' : '#777'} />}
            onClick={() => onChange(!state)}
        />
    )
}

export default FlashLightButton;
