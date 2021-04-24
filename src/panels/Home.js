import React, { useCallback, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Button, Div, Title, Spacing } from '@vkontakte/vkui';

import FlashLightButton from '../components/FlashLightButton';
import useAppHide from '../hooks/useAppHide';
import useFlashlightButtons from '../hooks/useFlashlightButtons';
import useFlashlightLoop from '../hooks/useFlashlightLoop';
import CenteredDiv from '../components/CenteredDiv';

const BUTTON_COUNT = 8;

const Home = ({ id }) => {
	const [isFlashLightAvailable, setFlashLightAvailability] = useState(false);

	const { flashlightButtons, toggleFlashlightButton } = useFlashlightButtons({ count: BUTTON_COUNT });
	const flashlightButtonsRef = useRef(flashlightButtons);

	useAppHide(() => setFlashlightState(0));

	const { startFlashing, stopFlashing, activeFlashlightButton } = useFlashlightLoop({
		flashlightButtonsRef,
		maxButtonsCount: BUTTON_COUNT,
		timeoutMs: 1000,
	});

	const onFlashLightButtonChange = useCallback(
		(isChecked, index) => {
			flashlightButtonsRef.current = toggleFlashlightButton(index, isChecked);
		},
		[toggleFlashlightButton],
	);

	useEffect(
		() => {
			bridge.send("VKWebAppFlashGetInfo")
				.then(({ is_available }) => setFlashLightAvailability(is_available))
				.catch(() => setFlashLightAvailability(false));
		},
		[],
	);

	return (
		<Panel id={id} centered>
			<PanelHeader>Зажигалка!</PanelHeader>

			<CenteredDiv style={{ width: '100%' }}>
				{
					!isFlashLightAvailable && (
						<Title weight="medium">Нет доступа к вспышке :(</Title>
					)
				}

				{
					isFlashLightAvailable && (
						<Div style={{ width: '100%' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								{
									flashlightButtons.map((state, index) => {
										return (
											<FlashLightButton
												key={index}
												state={state}
												onChange={e => onFlashLightButtonChange(e, index)}
												isActive={activeFlashlightButton === index}
											/>
										);
									})
								}
							</div>

							<Spacing size={16} />

							<Button
								size="l"
								mode={activeFlashlightButton !== null ? 'secondary' : 'commerce'}
								style={{ width: '100%' }}
								type="error"
								onClick={activeFlashlightButton !== null ? stopFlashing : startFlashing}
							>
								{
									activeFlashlightButton !== null ? 'Остановиться' : 'Зажигаем!'
								}
							</Button>
						</Div>
					)
				}
			</CenteredDiv>
		</Panel>
	);
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
};

export default Home;
