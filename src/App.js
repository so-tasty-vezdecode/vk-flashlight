import React, { useState } from 'react';
import { View, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';

const App = () => {
	const [activePanel] = useState('home');

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel}>
					<Home id='home' />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
