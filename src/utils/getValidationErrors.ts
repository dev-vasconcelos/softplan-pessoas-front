import * as Yup from 'yup';

export default function getValidationErrors(error) {
  if (error instanceof Yup.ValidationError) {
    const validationErrors = {};

    error.inner.forEach(err => {
      if (err.path) {
        validationErrors[err.path] = err.message;
      }
    });

    return validationErrors;
  }

  return null;
}
