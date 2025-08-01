import * as Yup from 'yup';

const validationSchemaSignUpCleaner = Yup.object().shape({
	username: Yup.string().matches(/^\S*$/, 'No se permiten espacios').required('Se requiere este campo'),
	phone: Yup.string().required('Se requiere este campo'),
	password: Yup.string().required('Se requiere este campo'),
});

export default validationSchemaSignUpCleaner;
