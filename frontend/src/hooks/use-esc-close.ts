import { useEffect } from 'react';

const UseEscClose = (onClose: () => void) => {
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key == 'Escape') {
				onClose();
			}
		};
		window.addEventListener('keydown', handleEsc);

		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, [onClose]);
};

export default UseEscClose;
