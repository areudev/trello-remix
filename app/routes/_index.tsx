import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {Link, redirect} from '@remix-run/react'
import {authCookie} from '~/auth/auth'

export const meta: MetaFunction = () => {
  return [
    {title: 'New Remix App'},
    {name: 'description', content: 'Welcome to Remix!'},
  ]
}

export async function loader({request}: LoaderFunctionArgs) {
  const cookieString = request.headers.get('Cookie')
  const userId = await authCookie.parse(cookieString)

  if (userId) throw redirect('/home')

  return null
}

export default function Index() {
  return (
    <div className="h-full flex flex-col items-center pt-20 bg-background">
      <div className="space-y-4 max-w-md text-lg text-muted-foreground">
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam
          corporis magni porro quos vero voluptatibus dolores iure voluptates
          praesentium. Deserunt quia, necessitatibus id tempora incidunt
          molestias! Esse sequi cum, nihil, repellendus quas quisquam voluptas
          ducimus deleniti aliquid rerum sit omnis ipsa error voluptate soluta,
          dolorem officiis at. Ut harum,
        </p>
        <p>
          It's a recreation of the popular drag and drop interface in{' '}
          <a href="https://trello.com" className="underline">
            Trello
          </a>{' '}
          and other similar apps.
        </p>
        <p>If you want to play around, click sign up!</p>
      </div>
      <div className="flex w-full justify-evenly max-w-md mt-8 rounded-3xl p-10 bg-muted">
        <Link
          to="/signup"
          className="text-xl font-medium text-brand-aqua underline">
          Sign up
        </Link>
        <div className="h-full border-r border-slate-500" />
        <Link
          to="/login"
          className="text-xl font-medium text-brand-aqua underline">
          Login
        </Link>
      </div>
    </div>
  )
}
