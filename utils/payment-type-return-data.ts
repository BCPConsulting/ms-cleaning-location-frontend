interface Props {
	color: string;
	name: string;
	id: string;
}

export const paymentTypeReturnData = (idPaymentType: string): Props => {
	switch (idPaymentType) {
		case 'CASH':
			return {
				color: '#16a34a',
				name: 'Efectivo',
				id: 'CASH',
			};

		case 'YAPE':
			return {
				color: '#3a034d',
				name: 'Yape',
				id: 'YAPE',
			};

		case 'TRANSFER':
			return {
				color: '#ea580c',
				name: 'Transferencia',
				id: 'TRANSFER',
			};

		case 'PLIN':
			return {
				color: '#1fa8b4',
				name: 'Plin',
				id: 'PLIN',
			};

		default:
			return {
				color: '',
				name: '',
				id: '',
			};
	}
};
