import React, { useEffect, useState } from 'react';

import { View, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';

import Home from './panels/Home';

const App = () => {
	const [activePanel] = useState('home');

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
	}, []);

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} style={{ height: '100%' }}>
					<Home id='home' />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
