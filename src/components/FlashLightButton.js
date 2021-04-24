import { Checkbox } from "@vkontakte/vkui";

const FlashLightButton = ({ state, onChange, active }) => {
    return (
        <Checkbox
            style={{ padding: 0, backgroundColor: active ? 'yellow' : 'white' }}
            checked={state}
            onChange={onChange}
        />
    )
}

export default FlashLightButton;
