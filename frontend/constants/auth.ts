export const AUTH_MODES = {
    LOGIN: 'login',
    REGISTER: 'register',
} as const;
  
export type AuthMode = typeof AUTH_MODES[keyof typeof AUTH_MODES];
  
export const AUTH_ERRORS = {
    EMPTY_FIELDS: 'Please fill in all fields',
    PASSWORD_LENGTH: 'Password must be at least 6 characters',
    REGISTRATION_SUCCESS: 'Registration successful! Please log in.',
};