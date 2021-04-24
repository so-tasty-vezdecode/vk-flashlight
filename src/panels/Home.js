import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Div, Text, Button } from '@vkontakte/vkui';

import FlashLightButton from '../components/FlashLightButton';

const BUTTON_COUNT = 8;

const Home = ({ id }) => {
	const [buttonsState, setButtonsState] = useState(new Array(BUTTON_COUNT).fill(false));
	const [isFlashLightAvailable, setFlashLightAvailability] = useState(false);
	const [currentFlashlightIndex, setIndex] = useState(null);

	const buttonsStateRef = useRef(buttonsState);
	const interval = useRef(null);

	const onFlashLightButtonChange = useCallback((e, index) => {
		const newState = [...buttonsState];
		newState[index] = e.target.checked;

		setButtonsState(newState);
		buttonsStateRef.current = newState;
	}, [buttonsState]);

	useEffect(() => {
		const listener = ({ detail }) => {
			console.log(detail);
			if (detail.type === 'VKWebAppViewHide') {
				setFlashlightState(0);
			}
		}

		bridge.subscribe(listener);

		return () => bridge.unsubscribe(listener);
	}, []);

	useEffect(() => {
		bridge.send("VKWebAppFlashGetInfo")
			.then(({ is_available }) => setFlashLightAvailability(is_available))
			.catch(console.log);
	}, []);

	const setFlashlightState = useCallback(async (level) => {
		await bridge.send("VKWebAppFlashSetLevel", { level })
			.then(console.log)
			.catch(console.log);
	}, []);

	const startFlashing = useCallback(async () => {
		let currentIndex = currentFlashlightIndex;

		const call = async () => {
			const nextIndex = currentIndex + 1 >= BUTTON_COUNT || currentIndex === null ? 0 : currentIndex + 1;

			currentIndex = nextIndex;
			setIndex(nextIndex);

			if (currentIndex === null || buttonsStateRef.current[currentIndex] !== buttonsStateRef.current[currentIndex - 1]) {
				await setFlashlightState(Number(buttonsStateRef.current[currentIndex]));
			}

			interval.current = setTimeout(call, 1000);
		}

		interval.current = setTimeout(call, 1000);
	}, [setFlashlightState, currentFlashlightIndex]);

	const stopFlashing = useCallback(
		() => {
			clearTimeout(interval.current);

			setIndex(null);
			setFlashlightState(0);
		},
		[setFlashlightState],
	);

	useEffect(() => {
		() => clearTimeout(interval.current);
	}, [])

	return (
		<Panel id={id}>
			<PanelHeader>Flashlight</PanelHeader>

			<Div style={{ display: 'flex', justifyContent: 'center' }}>
				{
					isFlashLightAvailable ? (
						buttonsState.map((state, index) => {
							return (
								<FlashLightButton
									key={index}
									state={state}
									onChange={(e) => onFlashLightButtonChange(e, index)}
									active={currentFlashlightIndex === index}
								/>
							);
						})
					) :
						<Text size={2}>Нет доступа к вспышке :(</Text>
				}
			</Div>

			<Div style={{ display: 'flex', justifyContent: 'center' }}>
				{
					currentFlashlightIndex !== null
						? <Button size="m" style={{ width: '100%' }} onClick={stopFlashing}>Остановить</Button>
						: <Button size="m" style={{ width: '100%' }} onClick={startFlashing}>Начать</Button>
				}
			</Div>
		</Panel>
	);
}

Home.propTypes = {
	id: PropTypes.string.isRequired,
};

export default Home;
