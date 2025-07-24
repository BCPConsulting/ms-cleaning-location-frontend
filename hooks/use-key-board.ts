import { useCallback, useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboard = () => {
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	const dismissKeyboard = useCallback(() => {
		Keyboard.dismiss();
	}, []);

	useEffect(() => {
		function onKeyboardDidShow(e: KeyboardEvent) {
			setKeyboardHeight(e.endCoordinates.height);
			setKeyboardVisible(true);
		}

		function onKeyboardDidHide() {
			setKeyboardHeight(0);
			setKeyboardVisible(false);
		}

		const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
		const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

		return () => {
			showSubscription?.remove();
			hideSubscription?.remove();
		};
	}, []);

	return {
		keyboardHeight,
		isKeyboardVisible,
		dismissKeyboard,
	};
};
