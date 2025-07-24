import { useCallback, useState } from 'react';

export function useDisclose(initState?: boolean): [boolean, () => void, () => void, () => void] {
	const [isOpen, setIsOpen] = useState(initState || false);
	const onOpen = useCallback(() => {
		setIsOpen(true);
	}, []);
	const onClose = useCallback(() => {
		setIsOpen(false);
	}, []);
	const onToggle = useCallback(() => {
		setIsOpen(!isOpen);
	}, []);

	return [isOpen, onOpen, onClose, onToggle];
}
