import {LoaderFunctionArgs, type LinksFunction} from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import {LoginIcon, LogoutIcon} from './icons/icons'
import {authCookie} from './auth/auth'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: '/app/styles/tailwind.css'}]
}

export async function loader({request}: LoaderFunctionArgs) {
  const cookieString = request.headers.get('Cookie')
  const userId = await authCookie.parse(cookieString)
  return {userId}
}

export default function App() {
  const {userId} = useLoaderData<typeof loader>()
  console.log('userId', userId)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        <div className="h-full flex flex-col min-h-0">
          <div className="bg-muted border-b border-border-800 flex items-center justify-between py-4 px-8 box-border">
            <Link to="/home" className="block leading-3 w-1/3">
              <div className="font-black text-2xl ">Trellix</div>
              <div className="text-muted-foreground">a Remix Demo</div>
            </Link>
            <div className="flex items-center gap-6"></div>
            <div className="w-1/3 flex justify-end">
              {userId ? (
                <form method="post" action="/logout">
                  <button className="block text-center">
                    <LogoutIcon />
                    <br />
                    <span className="text-muted-foreground text-xs uppercase font-bold">
                      Log out
                    </span>
                  </button>
                </form>
              ) : (
                <Link to="/login" className="block text-center">
                  <LoginIcon />
                  <br />
                  <span className="text-muted-foreground text-xs uppercase font-bold">
                    Log in
                  </span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex-grow min-h-0 h-full">
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
