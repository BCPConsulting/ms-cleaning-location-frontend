import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';

export const useSecureStorage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const setStorageValue = useCallback(async (key: string, value: string) => {
		setIsLoading(true);
		try {
			await SecureStore.setItemAsync(key, value);
			setError(null);
		} catch (e) {
			setError(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getStorageValue = useCallback(async (key: string) => {
		setIsLoading(true);
		try {
			const result = await SecureStore.getItemAsync(key);
			setError(null);
			return result ? result : null;
		} catch (e) {
			setError(e as Error);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const removeStorageValue = useCallback(async (key: string) => {
		setIsLoading(true);
		try {
			await SecureStore.deleteItemAsync(key);
			setError(null);
		} catch (e) {
			setError(e as Error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { setStorageValue, getStorageValue, removeStorageValue, isLoading, error };
};
