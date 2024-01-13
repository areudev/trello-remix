import {LoaderFunctionArgs, json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {authCookie} from '~/auth/auth'

export async function loader({request, params}: LoaderFunctionArgs) {
  const accountId = await authCookie.parse(request.headers.get('Cookie'))
  const id = Number(params.id)
  return json({accountId, id})
}
export default function Board() {
  const {id} = useLoaderData<typeof loader>()
  return (
    <div>
      <h2>Board {id} Yo</h2>
    </div>
  )
}
