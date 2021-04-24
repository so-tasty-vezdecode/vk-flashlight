import React from 'react';

import { Div } from '@vkontakte/vkui';

const CenteredDiv = ({ children, style, ...other }) => {
    return (
        <Div
            style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style,
            }}
            {...other}
        >
            {children}
        </Div>
    )
}

export default CenteredDiv;
