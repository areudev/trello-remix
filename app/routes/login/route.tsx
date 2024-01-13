import {ActionFunctionArgs, json, redirect} from '@remix-run/node'
import {Form, Link, useActionData} from '@remix-run/react'
import {Button} from '~/components/ui/button'
import {Input} from '~/components/ui/input'
import {Label} from '~/components/ui/label'
import {validate} from './validate'
import {authCookie} from '~/auth/auth'
import {login} from './queries'

export const meta = () => {
  return [
    {
      title: 'Trellix Login',
    },
  ]
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  const errors = validate(email, password)
  if (errors) {
    return json({ok: false, errors}, 400)
  }

  const userId = await login(email, password)

  if (userId === false) {
    return json(
      {ok: false, errors: {email: '', password: 'Invalid credentials'}},
      400
    )
  }

  return redirect('/home', {
    headers: {
      'Set-Cookie': await authCookie.serialize(userId),
    },
  })
}

export default function Signup() {
  const actionData = useActionData<typeof action>()
  const emailError = actionData?.errors?.email
  const passwordError = actionData?.errors?.password

  return (
    <div className="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          id="signup-header"
          className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight ">
          Log in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-background px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form className="space-y-6" method="post">
            <div>
              <Label htmlFor="email">
                Email address{' '}
                {emailError && (
                  <span className="text-destructive">{emailError}</span>
                )}
              </Label>
              <Input
                autoFocus
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">
                Password{' '}
                {passwordError && (
                  <span className="text-destructive">{passwordError}</span>
                )}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-describedby="password-error"
                required
              />
            </div>

            <Button type="submit">Sign in</Button>

            <div className="text-sm ">
              Already have an account?{' '}
              <Link className="underline" to="/signup">
                Sign up
              </Link>
              .
            </div>
          </Form>
        </div>
        <div className="mt-8 space-y-2 mx-2">
          <h3 className="font-bold ">Privacy Notice</h3>
          <p>
            We won't use your email address for anything other than
            authenticating with this demo application. This app doesn't send
            email anyway, so you can put whatever fake email address you want.
          </p>
          <h3 className="font-bold ">Terms of Service</h3>
          <p>
            This is a demo app, there are no terms of service. Don't be
            surprised if your data dissappears.
          </p>
        </div>
      </div>
    </div>
  )
}
