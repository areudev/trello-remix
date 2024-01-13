import {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {getHomeData} from './queries'
import {requireAuthCookie} from '~/auth/auth'

export const meta: MetaFunction = () => {
  return [{title: 'Boards'}]
}

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request)
  const boards = await getHomeData(userId)
  return {boards}
}

export default function Home() {
  return (
    <div>
      <h2>Home Yo</h2>
    </div>
  )
}
