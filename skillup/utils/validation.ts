import * as Yup from 'yup';
import { VALIDATION_MESSAGES } from '../constants';

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, VALIDATION_MESSAGES.USERNAME_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password: Yup.string()
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED),
});

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, VALIDATION_MESSAGES.USERNAME_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED),
  email: Yup.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .required(VALIDATION_MESSAGES.REQUIRED),
  firstName: Yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  lastName: Yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  password: Yup.string()
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN)
    .required(VALIDATION_MESSAGES.REQUIRED),
});
