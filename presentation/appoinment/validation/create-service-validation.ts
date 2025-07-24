import * as Yup from 'yup';

const validationSchemaSignin = Yup.object().shape({
	coordinates: Yup.string().required('Se requiere este campo'),
	detail: Yup.string().required('Se requiere este campo'),
	price: Yup.number().required('Se requiere este campo'),
});

export default validationSchemaSignin;
