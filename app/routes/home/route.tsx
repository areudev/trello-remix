import {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{title: 'Boards'}]
}

export async function loader({request}: LoaderFunctionArgs) {
  const boards = null
  console.log(request)
  return {boards}
}
