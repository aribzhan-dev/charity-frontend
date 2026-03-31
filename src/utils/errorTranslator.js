/**
 * @param {string} error - The error message from the backend
 * @param {function} t - The translation function from i18next
 * @returns {string} - The translated or original error message
 */
export const translateError = (error, t) => {
  if (!error) return t('form.error');

  const errorMap = {
    'Server xatosi': t('eventForm.serverError') || 'Server Error',
    'Foydalanuvchi topilmadi': t('eventForm.userNotFound') || 'User not found',
    'Login yoki parol noto\'g\'ri': t('login.invalidCredentials') || 'Invalid login or password',
    'Email allaqachon mavjud': t('register.emailExists') || 'Email already exists',
    'Parol juda qisqa': t('register.passwordShort') || 'Password too short',
    'Noma\'lum xatolik': t('form.error'),
  };

  // Try exact match or contains
  for (const [uzbek, translated] of Object.entries(errorMap)) {
    if (error.includes(uzbek)) return translated;
  }

  return error; // Fallback to original if no match
};
