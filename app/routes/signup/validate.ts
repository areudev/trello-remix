export function validate(email: string, password: string) {
  const errors: {email?: string; password?: string} = {}

  if (!email) {
    errors['email'] = 'Email is required'
  } else if (!email.includes('@')) {
    errors['email'] = 'Email is invalid'
  }

  if (!password) {
    errors['password'] = 'Password is required'
  } else if (password.length < 5) {
    errors['password'] = 'Password is too short'
  }

  return Object.keys(errors).length > 0 ? errors : null
}
