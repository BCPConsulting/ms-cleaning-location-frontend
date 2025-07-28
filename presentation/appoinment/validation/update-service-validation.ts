import * as Yup from 'yup';

const validationUpdateAppoinment = Yup.object().shape({
	dateTime: Yup.string().required('Se requiere este campo'),
	coordinates: Yup.string(),
	price: Yup.number().required('Se requiere este campo'),
	detail: Yup.string().required('Se requiere este campo'),
	cleanerId: Yup.string().required('Se requiere este campo'),
	locationName: Yup.string().required('Se requiere este campo'),
	locationReference: Yup.string().required('Se requiere este campo'),
	clientName: Yup.string().required('Se requiere este campo'),
});

export default validationUpdateAppoinment;
