import * as Yup from 'yup';

const validationCreateAppoinment = Yup.object().shape({
	detail: Yup.string().required('Se requiere este campo'),
	price: Yup.number().typeError('El precio debe ser un número válido').required('Se requiere este campo'),
	clientName: Yup.string().required('Se requiere este campo'),
	locationName: Yup.string().required('Se requiere este campo'),
	locationReference: Yup.string().required('Se requiere este campo'),
	cel: Yup.string()
		.required('Se requiere este campo')
		.matches(/^[0-9]+$/, 'El celular solo debe contener números')
		.length(9, 'El celular debe tener exactamente 9 dígitos')
		.matches(/^9[0-9]{8}$/, 'El celular debe empezar con 9 y tener 9 dígitos'),
});

export default validationCreateAppoinment;
