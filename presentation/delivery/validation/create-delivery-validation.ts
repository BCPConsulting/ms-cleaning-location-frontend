import * as Yup from 'yup';

const validationCreateDelivery = Yup.object().shape({
	clientName: Yup.string().required('Se requiere este campo'),
	price: Yup.string()
		.required('Se requiere este campo')
		.matches(/^[0-9]+$/, 'El precio solo debe contener números'),
	paymentType: Yup.string().required('Se requiere este campo'),
	phone: Yup.string()
		.required('Se requiere este campo')
		.length(9, 'El teléfono debe tener exactamente 9 caracteres')
		.matches(/^[0-9]+$/, 'El teléfono solo debe contener números'),
});

export default validationCreateDelivery;
